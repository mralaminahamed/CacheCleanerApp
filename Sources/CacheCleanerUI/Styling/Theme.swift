import SwiftUI

struct Theme {
  let isDark: Bool

  var primaryBackground: Color { isDark ? AppColor.Dark.primary.toColor() : AppColor.Light.primary.toColor() }
  var secondaryBackground: Color { isDark ? AppColor.Dark.secondary.toColor() : AppColor.Light.secondary.toColor() }
  var accentTeal: Color { isDark ? AppColor.Dark.accentTeal.toColor() : AppColor.Light.accentTeal.toColor() }
  var accentRed: Color { isDark ? AppColor.Dark.accentRed.toColor() : AppColor.Light.accentRed.toColor() }
  var accentGreen: Color { isDark ? AppColor.Dark.accentGreen.toColor() : AppColor.Light.accentGreen.toColor() }
  var textPrimary: Color { isDark ? AppColor.Dark.textPrimary.toColor() : AppColor.Light.textPrimary.toColor() }
  var textSecondary: Color { isDark ? AppColor.Dark.textSecondary.toColor() : AppColor.Light.textSecondary.toColor() }

  static var current: Theme {
    let isDark = NSApp.effectiveAppearance.name == .darkAqua || NSApp.effectiveAppearance.name == .vibrantDark
    return Theme(isDark: isDark)
  }
}

private extension Color {
  func toColor() -> Color { self }
}
