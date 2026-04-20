import Foundation

public struct CacheLocation: Sendable {
  public let path: String
  public let category: CacheCategory
  public let priority: Int

  public init(path: String, category: CacheCategory, priority: Int) {
    self.path = path
    self.category = category
    self.priority = priority
  }

  public var expandedPath: String? {
    let expanded = NSString(string: path).expandingTildeInPath
    var isDir: ObjCBool = false
    guard FileManager.default.fileExists(atPath: expanded, isDirectory: &isDir) else {
      return nil
    }
    return expanded
  }
}
