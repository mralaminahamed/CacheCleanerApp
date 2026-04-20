import CoreData
import Foundation
import CacheScanner

public protocol ScanHistoryRepositoryProtocol: Sendable {
  func save(scan: ScanRecord) async throws
  func fetchRecentScans(limit: Int) async throws -> [ScanRecord]
  func deleteScan(id: UUID) async throws
  func fetchScanDetails(id: UUID) async throws -> ScanRecord?
}

public final class ScanHistoryRepository: ScanHistoryRepositoryProtocol, @unchecked Sendable {
  private let lock = NSLock()
  private var scans: [ScanRecord] = []

  public init() {}

  public func save(scan: ScanRecord) async throws {
    lock.withLock {
      scans.removeAll { $0.id == scan.id }
      scans.insert(scan, at: 0)
    }
  }

  public func fetchRecentScans(limit: Int) async throws -> [ScanRecord] {
    lock.withLock { Array(scans.prefix(limit)) }
  }

  public func deleteScan(id: UUID) async throws {
    lock.withLock { scans.removeAll { $0.id == id } }
  }

  public func fetchScanDetails(id: UUID) async throws -> ScanRecord? {
    lock.withLock { scans.first { $0.id == id } }
  }
}
