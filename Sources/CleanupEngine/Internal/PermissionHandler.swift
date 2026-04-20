import Foundation
import AppKit

struct PermissionHandler {
  @MainActor
  func requestElevation() async throws {
    let alert = NSAlert()
    alert.messageText = "Administrator Access Required"
    alert.informativeText = "Cache Cleaner needs elevated permissions to clean system caches. Grant Full Disk Access in System Settings > Privacy & Security."
    alert.addButton(withTitle: "Open System Settings")
    alert.addButton(withTitle: "Skip")
    let response = alert.runModal()
    if response == .alertFirstButtonReturn {
      NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles")!)
    }
  }
}
