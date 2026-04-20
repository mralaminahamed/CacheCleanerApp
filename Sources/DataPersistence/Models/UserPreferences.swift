import Foundation

public struct UserPreferences: Codable {
  public var launchAtStartup: Bool = false
  public var showMenuBar: Bool = true
  public var minimumFileAge: Int = 14
  public var defaultDeleteMethod: String = "trash"
  public var enableTelemetry: Bool = false
  public var enableAutoCleanup: Bool = false
  public var autoCleanupSchedule: String = "0 9 * * MON"
  public var enableNotifications: Bool = true
  public var notifyOnScanComplete: Bool = true
  public var notifyOnCleanupComplete: Bool = true
  public var debugLogging: Bool = false
  public var indexDepth: Int = 5

  public init() {}

  public init(
    launchAtStartup: Bool,
    showMenuBar: Bool,
    minimumFileAge: Int,
    defaultDeleteMethod: String,
    enableTelemetry: Bool,
    enableAutoCleanup: Bool,
    autoCleanupSchedule: String,
    enableNotifications: Bool,
    notifyOnScanComplete: Bool,
    notifyOnCleanupComplete: Bool,
    debugLogging: Bool,
    indexDepth: Int
  ) {
    self.launchAtStartup = launchAtStartup
    self.showMenuBar = showMenuBar
    self.minimumFileAge = minimumFileAge
    self.defaultDeleteMethod = defaultDeleteMethod
    self.enableTelemetry = enableTelemetry
    self.enableAutoCleanup = enableAutoCleanup
    self.autoCleanupSchedule = autoCleanupSchedule
    self.enableNotifications = enableNotifications
    self.notifyOnScanComplete = notifyOnScanComplete
    self.notifyOnCleanupComplete = notifyOnCleanupComplete
    self.debugLogging = debugLogging
    self.indexDepth = indexDepth
  }
}
