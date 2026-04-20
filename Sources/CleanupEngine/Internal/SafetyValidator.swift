import Foundation
import CacheScanner

enum ValidationError: LocalizedError {
  case systemPath(String)
  case excluded(String)

  var errorDescription: String? {
    switch self {
    case .systemPath(let path): return "System path cannot be deleted: \(path)"
    case .excluded(let path): return "Path is excluded: \(path)"
    }
  }
}

struct SafetyValidator {
  private let protectedPaths = ["/System/", "/usr/", "/bin/", "/sbin/", "/private/etc/"]

  func validateEntries(_ entries: [CacheEntry]) async throws {
    for entry in entries where entry.safetyLevel == .dangerous {
      for path in protectedPaths {
        if entry.path.hasPrefix(path) {
          throw ValidationError.systemPath(entry.path)
        }
      }
    }
  }
}
