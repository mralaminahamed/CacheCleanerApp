import Foundation
import CacheScanner

public enum DeleteMethod {
  case trash
  case secure
}

public struct CleanupResult: Sendable {
  public let filesDeleted: Int
  public let filesFailed: Int
  public let sizeFreed: Int64

  public init(filesDeleted: Int, filesFailed: Int, sizeFreed: Int64) {
    self.filesDeleted = filesDeleted
    self.filesFailed = filesFailed
    self.sizeFreed = sizeFreed
  }
}

public enum CleanupProgress: Sendable {
  case deleted(Int, Int64)
  case error(String, Error)
  case completed(CleanupResult)
}

@available(macOS 12, *)
public class CleanupManager {
  public enum CleanupError: LocalizedError {
    case validationFailed(String)
    case deletionFailed(String)
    case permissionDenied

    public var errorDescription: String? {
      switch self {
      case .validationFailed(let msg): return "Validation failed: \(msg)"
      case .deletionFailed(let path): return "Deletion failed: \(path)"
      case .permissionDenied: return "Permission denied"
      }
    }
  }

  private let validator = SafetyValidator()
  private let permissionHandler = PermissionHandler()
  private let trashManager = TrashManager()

  public init() {}

  public func cleanup(
    entries: [CacheEntry],
    method: DeleteMethod = .trash,
    progressHandler: @escaping (CleanupProgress) -> Void
  ) async throws -> CleanupResult {
    try await validator.validateEntries(entries)

    let homePath = FileManager.default.homeDirectoryForCurrentUser.path
    let needsElevation = entries.contains { $0.path.contains("/Library/") && !$0.path.hasPrefix(homePath) }
    if needsElevation {
      try await permissionHandler.requestElevation()
    }

    var deleted = 0
    var failed = 0
    var totalFreed: Int64 = 0

    for entry in entries {
      do {
        switch method {
        case .trash: try trashManager.moveToTrash(path: entry.path)
        case .secure: try trashManager.permanentlyDelete(path: entry.path)
        }
        deleted += 1
        totalFreed += entry.size
        progressHandler(.deleted(deleted, totalFreed))
      } catch {
        failed += 1
        progressHandler(.error(entry.path, error))
      }
    }

    let result = CleanupResult(filesDeleted: deleted, filesFailed: failed, sizeFreed: totalFreed)
    progressHandler(.completed(result))
    return result
  }
}
