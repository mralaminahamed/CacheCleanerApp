import Foundation
import CleanupEngine

public struct CleanupHistory: Identifiable, Codable, Sendable {
  public enum Status: String, Codable, Sendable {
    case success, partial, failed
  }

  public let id: UUID
  public let timestamp: Date
  public let filesDeleted: Int
  public let filesFailed: Int
  public let sizeFreed: Int64
  public let status: Status

  public init(id: UUID = UUID(), filesDeleted: Int, filesFailed: Int, sizeFreed: Int64) {
    self.id = id
    self.timestamp = Date()
    self.filesDeleted = filesDeleted
    self.filesFailed = filesFailed
    self.sizeFreed = sizeFreed
    self.status = filesFailed == 0 ? .success : (filesDeleted > 0 ? .partial : .failed)
  }
}
