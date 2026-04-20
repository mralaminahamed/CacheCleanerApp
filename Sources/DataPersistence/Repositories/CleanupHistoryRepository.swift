import Foundation

public protocol CleanupHistoryRepositoryProtocol: Sendable {
  func save(cleanup: CleanupHistory) async throws
  func fetchRecent(limit: Int) async throws -> [CleanupHistory]
}

public final class CleanupHistoryRepository: CleanupHistoryRepositoryProtocol, @unchecked Sendable {
  private var history: [CleanupHistory] = []
  private let lock = NSLock()

  public init() {}

  public func save(cleanup: CleanupHistory) async throws {
    lock.withLock { history.insert(cleanup, at: 0) }
  }

  public func fetchRecent(limit: Int) async throws -> [CleanupHistory] {
    lock.withLock { Array(history.prefix(limit)) }
  }
}
