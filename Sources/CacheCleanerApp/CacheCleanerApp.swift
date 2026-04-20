import SwiftUI
import CacheCleanerUI

@main
struct CacheCleanerApp: App {
  var body: some Scene {
    WindowGroup {
      RootView()
        .frame(minWidth: 800, minHeight: 600)
    }
    .windowStyle(.hiddenTitleBar)
    .commands {
      CommandGroup(replacing: .newItem) {}
    }
  }
}
