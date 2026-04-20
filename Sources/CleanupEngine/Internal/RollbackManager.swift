import Foundation

struct RollbackManager {
  private let fileManager = FileManager.default

  func restoreFromTrash(originalPath: String) throws {
    let trashURL = fileManager.homeDirectoryForCurrentUser
      .appendingPathComponent(".Trash")
    let filename = URL(fileURLWithPath: originalPath).lastPathComponent
    let trashItemURL = trashURL.appendingPathComponent(filename)

    guard fileManager.fileExists(atPath: trashItemURL.path) else { return }
    try fileManager.moveItem(at: trashItemURL, to: URL(fileURLWithPath: originalPath))
  }
}
