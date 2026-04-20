import Foundation

public struct CleanupStatistics: Codable {
  public let totalScans: Int
  public let totalFilesDeleted: Int
  public let totalSizeFreed: Int64
  public let averageScanDuration: TimeInterval
  public let lastScanDate: Date?
}

public protocol StatisticsRepositoryProtocol {
  func getStatistics() -> CleanupStatistics
  func recordScan(duration: TimeInterval, filesFound: Int)
  func recordCleanup(filesDeleted: Int, sizeFreed: Int64)
}

public final class StatisticsRepository: StatisticsRepositoryProtocol {
  public init() {}

  private let defaults = UserDefaults.standard

  private enum Keys {
    static let totalScans = "com.cacheCleaner.stats.totalScans"
    static let totalFilesDeleted = "com.cacheCleaner.stats.totalFilesDeleted"
    static let totalSizeFreed = "com.cacheCleaner.stats.totalSizeFreed"
    static let totalScanDuration = "com.cacheCleaner.stats.totalScanDuration"
    static let lastScanDate = "com.cacheCleaner.stats.lastScanDate"
  }

  public func getStatistics() -> CleanupStatistics {
    let totalScans = defaults.integer(forKey: Keys.totalScans)
    let totalDuration = defaults.double(forKey: Keys.totalScanDuration)
    return CleanupStatistics(
      totalScans: totalScans,
      totalFilesDeleted: defaults.integer(forKey: Keys.totalFilesDeleted),
      totalSizeFreed: Int64(defaults.double(forKey: Keys.totalSizeFreed)),
      averageScanDuration: totalScans > 0 ? totalDuration / Double(totalScans) : 0,
      lastScanDate: defaults.object(forKey: Keys.lastScanDate) as? Date
    )
  }

  public func recordScan(duration: TimeInterval, filesFound: Int) {
    defaults.set(defaults.integer(forKey: Keys.totalScans) + 1, forKey: Keys.totalScans)
    defaults.set(defaults.double(forKey: Keys.totalScanDuration) + duration, forKey: Keys.totalScanDuration)
    defaults.set(Date(), forKey: Keys.lastScanDate)
  }

  public func recordCleanup(filesDeleted: Int, sizeFreed: Int64) {
    defaults.set(defaults.integer(forKey: Keys.totalFilesDeleted) + filesDeleted, forKey: Keys.totalFilesDeleted)
    defaults.set(defaults.double(forKey: Keys.totalSizeFreed) + Double(sizeFreed), forKey: Keys.totalSizeFreed)
  }
}
