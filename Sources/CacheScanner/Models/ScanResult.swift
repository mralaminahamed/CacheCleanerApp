import Foundation

public struct ScanRecord: Identifiable, Codable, Sendable {
  public enum Status: String, Codable, Sendable {
    case completed, cancelled, error
  }

  public let id: UUID
  public let timestamp: Date
  public let totalSize: Int64
  public let filesCount: Int
  public let status: Status
  public var entries: [CacheEntry]

  public init(
    id: UUID = UUID(),
    entries: [CacheEntry],
    totalSize: Int64,
    filesCount: Int,
    status: Status = .completed
  ) {
    self.id = id
    self.timestamp = Date()
    self.totalSize = totalSize
    self.filesCount = filesCount
    self.status = status
    self.entries = entries
  }
}
