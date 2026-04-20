import Foundation

public struct CacheAnalyzer {
  private let dangerousPatterns = [
    "Library/Saved Application State",
    "Library/Mail",
    "Library/Calendars",
    "Library/Contacts",
    "Library/Safari/Bookmarks",
  ]

  private let cautionPatterns = [
    "com.apple.nsurlsessiond",
    "system.",
    "com.apple.dock",
    "com.apple.Spotlight",
  ]

  public init() {}

  public func analyzeSafety(path: String) -> SafetyLevel {
    for pattern in dangerousPatterns {
      if path.contains(pattern) { return .dangerous }
    }
    for pattern in cautionPatterns {
      if path.contains(pattern) { return .caution }
    }
    return .safe
  }

  public func detectApp(path: String) -> String? {
    let components = path.components(separatedBy: "/")
    for component in components {
      if component.hasSuffix(".app") || component.contains("com.") {
        return component
      }
    }
    return nil
  }
}
