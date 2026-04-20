// swift-tools-version:5.9
import PackageDescription

let package = Package(
  name: "CacheCleanerApp",
  platforms: [.macOS(.v13)],
  products: [
    .executable(name: "CacheCleaner", targets: ["CacheCleanerApp"]),
    .library(name: "CacheCleanerUI", targets: ["CacheCleanerUI"]),
    .library(name: "CacheScanner", targets: ["CacheScanner"]),
    .library(name: "CleanupEngine", targets: ["CleanupEngine"]),
    .library(name: "DataPersistence", targets: ["DataPersistence"]),
  ],
  dependencies: [],
  targets: [
    .executableTarget(
      name: "CacheCleanerApp",
      dependencies: [
        "CacheCleanerUI",
        "CacheScanner",
        "CleanupEngine",
        "DataPersistence",
      ],
    ),
    .target(name: "CacheCleanerUI", dependencies: ["DataPersistence", "CacheScanner", "CleanupEngine"]),
    .target(name: "CacheScanner"),
    .target(name: "CleanupEngine", dependencies: ["CacheScanner"]),
    .target(name: "DataPersistence", dependencies: ["CacheScanner", "CleanupEngine"]),
    // Test targets — add source files under Tests/ before enabling
    // .testTarget(name: "CacheScannerTests", dependencies: ["CacheScanner"]),
    // .testTarget(name: "CleanupEngineTests", dependencies: ["CleanupEngine"]),
    // .testTarget(name: "DataPersistenceTests", dependencies: ["DataPersistence"]),
    // .testTarget(name: "UITests", dependencies: ["CacheCleanerUI"]),
  ]
)
