import Foundation

public enum ScanProgress: Sendable {
  case started
  case categoryProgress(CacheCategory, Int)
  case progress(Int, Int64)
  case completed([CacheEntry])
  case error(CacheCategory, Error)
}

@available(macOS 12, *)
public actor CacheScanner {
  public enum ScanError: LocalizedError {
    case accessDenied(String)
    case enumerationFailed(String)

    public var errorDescription: String? {
      switch self {
      case .accessDenied(let path): return "Access denied: \(path)"
      case .enumerationFailed(let path): return "Enumeration failed: \(path)"
      }
    }
  }

  private let analyzer = CacheAnalyzer()
  private var discoveredCaches: [CacheEntry] = []

  public nonisolated let cacheLocations = [
    CacheLocation(path: "~/Library/Caches/", category: .system, priority: 1),
    CacheLocation(path: "~/Library/Safari/", category: .browser, priority: 1),
    CacheLocation(path: "/private/tmp/", category: .temp, priority: 3),
    CacheLocation(path: "~/Library/Application Support/", category: .app, priority: 2),
    CacheLocation(path: "~/Library/Developer/Xcode/DerivedData/", category: .xcode, priority: 1),
  ]

  public init() {}

  public func scanAsync(
    progressHandler: @escaping @Sendable (ScanProgress) -> Void
  ) async throws -> [CacheEntry] {
    discoveredCaches.removeAll()
    progressHandler(.started)

    try await withThrowingTaskGroup(of: [CacheEntry].self) { group in
      for location in cacheLocations {
        group.addTask {
          do {
            return try await self.enumerateDirectory(location, progressHandler: progressHandler)
          } catch {
            progressHandler(.error(location.category, error))
            return []
          }
        }
      }
      for try await entries in group {
        discoveredCaches.append(contentsOf: entries)
        progressHandler(.progress(discoveredCaches.count, totalSize))
      }
    }

    progressHandler(.completed(discoveredCaches))
    return discoveredCaches
  }

  private func enumerateDirectory(
    _ location: CacheLocation,
    progressHandler: @escaping @Sendable (ScanProgress) -> Void
  ) async throws -> [CacheEntry] {
    guard let path = location.expandedPath else {
      throw ScanError.accessDenied(location.path)
    }

    var entries: [CacheEntry] = []
    let sequence = FileEnumerationSequence(rootPath: path)

    for await fileInfo in sequence {
      guard !fileInfo.isDirectory else { continue }
      let entry = CacheEntry(
        path: fileInfo.path,
        size: fileInfo.size,
        category: location.category,
        safetyLevel: analyzer.analyzeSafety(path: fileInfo.path),
        lastModified: fileInfo.modificationDate,
        appName: analyzer.detectApp(path: fileInfo.path)
      )
      entries.append(entry)
      if entries.count % 50 == 0 {
        progressHandler(.categoryProgress(location.category, entries.count))
      }
    }
    return entries
  }

  public var totalSize: Int64 {
    discoveredCaches.reduce(0) { $0 + $1.size }
  }
}
