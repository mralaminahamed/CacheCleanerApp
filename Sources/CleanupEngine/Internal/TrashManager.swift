import Foundation

struct TrashManager {
  private let fileManager = FileManager.default

  func moveToTrash(path: String) throws {
    let url = URL(fileURLWithPath: path)
    var resultURL: NSURL?
    try fileManager.trashItem(at: url, resultingItemURL: &resultURL)
  }

  func permanentlyDelete(path: String) throws {
    try fileManager.removeItem(atPath: path)
  }
}
