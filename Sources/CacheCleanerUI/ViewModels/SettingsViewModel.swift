import SwiftUI
import Combine
import DataPersistence

@available(macOS 12, *)
@MainActor
class SettingsViewModel: ObservableObject {
  @Published var launchAtStartup: Bool = false
  @Published var showMenuBar: Bool = true
  @Published var minimumFileAge: Int = 14
  @Published var deleteMethod: String = "trash"
  @Published var enableTelemetry: Bool = false
  @Published var enableAutoCleanup: Bool = false
  @Published var autoCleanupSchedule: String = "0 9 * * MON"
  @Published var enableNotifications: Bool = true
  @Published var notifyOnScanComplete: Bool = true
  @Published var notifyOnCleanupComplete: Bool = true
  @Published var debugLogging: Bool = false
  @Published var indexDepth: Int = 5

  private let repository: PreferenceRepository

  init(repository: PreferenceRepository = PreferenceRepository()) {
    self.repository = repository
    load()
  }

  func load() {
    let prefs = repository.getPreferences()
    launchAtStartup = prefs.launchAtStartup
    showMenuBar = prefs.showMenuBar
    minimumFileAge = prefs.minimumFileAge
    deleteMethod = prefs.defaultDeleteMethod
    enableTelemetry = prefs.enableTelemetry
    enableAutoCleanup = prefs.enableAutoCleanup
    autoCleanupSchedule = prefs.autoCleanupSchedule
    enableNotifications = prefs.enableNotifications
    notifyOnScanComplete = prefs.notifyOnScanComplete
    notifyOnCleanupComplete = prefs.notifyOnCleanupComplete
    debugLogging = prefs.debugLogging
    indexDepth = prefs.indexDepth
  }

  func save() {
    let prefs = UserPreferences(
      launchAtStartup: launchAtStartup,
      showMenuBar: showMenuBar,
      minimumFileAge: minimumFileAge,
      defaultDeleteMethod: deleteMethod,
      enableTelemetry: enableTelemetry,
      enableAutoCleanup: enableAutoCleanup,
      autoCleanupSchedule: autoCleanupSchedule,
      enableNotifications: enableNotifications,
      notifyOnScanComplete: notifyOnScanComplete,
      notifyOnCleanupComplete: notifyOnCleanupComplete,
      debugLogging: debugLogging,
      indexDepth: indexDepth
    )
    try? repository.savePreferences(prefs)
  }

  func exportSettings() -> Data? {
    let prefs = UserPreferences(
      launchAtStartup: launchAtStartup, showMenuBar: showMenuBar,
      minimumFileAge: minimumFileAge, defaultDeleteMethod: deleteMethod,
      enableTelemetry: enableTelemetry, enableAutoCleanup: enableAutoCleanup,
      autoCleanupSchedule: autoCleanupSchedule, enableNotifications: enableNotifications,
      notifyOnScanComplete: notifyOnScanComplete, notifyOnCleanupComplete: notifyOnCleanupComplete,
      debugLogging: debugLogging, indexDepth: indexDepth
    )
    return try? JSONEncoder().encode(prefs)
  }

  func resetToDefaults() {
    let defaults = UserPreferences()
    launchAtStartup = defaults.launchAtStartup
    showMenuBar = defaults.showMenuBar
    minimumFileAge = defaults.minimumFileAge
    deleteMethod = defaults.defaultDeleteMethod
    enableTelemetry = defaults.enableTelemetry
    enableAutoCleanup = defaults.enableAutoCleanup
    enableNotifications = defaults.enableNotifications
    notifyOnScanComplete = defaults.notifyOnScanComplete
    notifyOnCleanupComplete = defaults.notifyOnCleanupComplete
    debugLogging = defaults.debugLogging
    indexDepth = defaults.indexDepth
    save()
  }
}
