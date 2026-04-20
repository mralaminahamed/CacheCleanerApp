import Foundation

public protocol PreferenceRepositoryProtocol {
  func getPreferences() -> UserPreferences
  func savePreferences(_ prefs: UserPreferences) throws
}

public final class PreferenceRepository: PreferenceRepositoryProtocol {
  private let defaults = UserDefaults.standard
  private let key = "com.cacheCleaner.preferences"

  public init() {}

  public func getPreferences() -> UserPreferences {
    guard let data = defaults.data(forKey: key),
          let prefs = try? JSONDecoder().decode(UserPreferences.self, from: data) else {
      return UserPreferences()
    }
    return prefs
  }

  public func savePreferences(_ prefs: UserPreferences) throws {
    let data = try JSONEncoder().encode(prefs)
    defaults.set(data, forKey: key)
  }
}
