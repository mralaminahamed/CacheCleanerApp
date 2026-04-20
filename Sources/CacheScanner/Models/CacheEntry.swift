import Foundation

public enum CacheCategory: String, CaseIterable, Codable, Sendable {
  case browser = "Browser"
  case system = "System"
  case temp = "Temp"
  case app = "App"
  case xcode = "Xcode"
}

public enum SafetyLevel: String, Codable, Sendable {
  case safe = "safe"
  case caution = "caution"
  case dangerous = "dangerous"
}

public struct CacheEntry: Identifiable, Codable, Sendable {
  public let id: UUID
  public let path: String
  public let size: Int64
  public let category: CacheCategory
  public let safetyLevel: SafetyLevel
  public let lastModified: Date
  public let appName: String?
  public var excluded: Bool

  public init(
    id: UUID = UUID(),
    path: String,
    size: Int64,
    category: CacheCategory,
    safetyLevel: SafetyLevel,
    lastModified: Date,
    appName: String? = nil,
    excluded: Bool = false
  ) {
    self.id = id
    self.path = path
    self.size = size
    self.category = category
    self.safetyLevel = safetyLevel
    self.lastModified = lastModified
    self.appName = appName
    self.excluded = excluded
  }
}
