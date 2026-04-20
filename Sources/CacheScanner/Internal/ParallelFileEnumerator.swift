import Foundation

public struct FileInfo: Sendable {
  public let path: String
  public let size: Int64
  public let modificationDate: Date
  public let isDirectory: Bool
}

public struct FileEnumerationSequence: AsyncSequence {
  public typealias Element = FileInfo

  public let rootPath: String

  public init(rootPath: String) {
    self.rootPath = rootPath
  }

  public func makeAsyncIterator() -> FileEnumerationIterator {
    FileEnumerationIterator(rootPath: rootPath)
  }
}

public struct FileEnumerationIterator: AsyncIteratorProtocol {
  public typealias Element = FileInfo

  private let enumerator: FileManager.DirectoryEnumerator?

  public init(rootPath: String) {
    self.enumerator = FileManager.default.enumerator(
      at: URL(fileURLWithPath: rootPath),
      includingPropertiesForKeys: [.fileSizeKey, .contentModificationDateKey, .isDirectoryKey],
      options: [.skipsHiddenFiles]
    )
  }

  public mutating func next() async -> FileInfo? {
    guard let enumerator = enumerator else { return nil }
    while let url = enumerator.nextObject() as? URL {
      guard let values = try? url.resourceValues(forKeys: [
        .fileSizeKey, .contentModificationDateKey, .isDirectoryKey
      ]) else { continue }

      return FileInfo(
        path: url.path,
        size: Int64(values.fileSize ?? 0),
        modificationDate: values.contentModificationDate ?? Date(),
        isDirectory: values.isDirectory ?? false
      )
    }
    return nil
  }
}
