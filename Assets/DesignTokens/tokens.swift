// MARK: - Design Tokens (Auto-generated from Figma)

import SwiftUI

// MARK: Color Tokens

enum AppColor {
  enum Light {
    static let primary = Color(red: 0.96, green: 0.96, blue: 0.96)       // #F5F5F5
    static let secondary = Color.white
    static let tertiary = Color(red: 0.97, green: 0.97, blue: 0.97)      // #F7F7F7

    static let accentTeal = Color(red: 0.0, green: 0.627, blue: 0.627)   // #00A0A0
    static let accentRed = Color(red: 0.862, green: 0.208, blue: 0.271)  // #DC3545
    static let accentGreen = Color(red: 0.0, green: 0.784, blue: 0.322)  // #00C853
    static let accentAmber = Color(red: 0.961, green: 0.62, blue: 0.141) // #F59E23

    static let textPrimary = Color.black
    static let textSecondary = Color(red: 0.369, green: 0.369, blue: 0.376) // #5E5E62
    static let textTertiary = Color(red: 0.549, green: 0.549, blue: 0.557)  // #8C8C90
  }

  enum Dark {
    static let primary = Color(red: 0.11, green: 0.11, blue: 0.12)          // #1C1C1E
    static let secondary = Color(red: 0.173, green: 0.173, blue: 0.18)      // #2C2C2E
    static let tertiary = Color(red: 0.227, green: 0.227, blue: 0.235)      // #3A3A3C

    static let accentTeal = Color(red: 0.196, green: 0.831, blue: 0.878)    // #32D4E0
    static let accentRed = Color(red: 1.0, green: 0.333, blue: 0.333)       // #FF5555
    static let accentGreen = Color(red: 0.204, green: 0.784, blue: 0.345)   // #34C759
    static let accentAmber = Color(red: 1.0, green: 0.647, blue: 0.141)     // #FFA523

    static let textPrimary = Color(red: 0.961, green: 0.961, blue: 0.961)   // #F5F5F5
    static let textSecondary = Color(red: 0.631, green: 0.631, blue: 0.651) // #A1A1A6
    static let textTertiary = Color(red: 0.557, green: 0.557, blue: 0.576)  // #8E8E93
  }
}

// MARK: Typography Tokens

enum AppTypography {
  enum FontSize {
    static let titleLarge: CGFloat = 28
    static let titleMedium: CGFloat = 18
    static let titleSmall: CGFloat = 14
    static let body: CGFloat = 13
    static let caption: CGFloat = 12
    static let monospace: CGFloat = 11
  }

  enum FontWeight {
    static let regular = Font.Weight.regular
    static let medium = Font.Weight.medium
    static let semibold = Font.Weight.semibold
  }
}

// MARK: Spacing Tokens

enum AppSpacing {
  static let xs: CGFloat = 4
  static let sm: CGFloat = 8
  static let md: CGFloat = 16
  static let lg: CGFloat = 24
  static let xl: CGFloat = 32
}

// MARK: Corner Radius Tokens

enum AppRadius {
  static let small: CGFloat = 6
  static let medium: CGFloat = 8
  static let large: CGFloat = 12
  static let full: CGFloat = 9999
}

// MARK: Dynamic Color Extensions

extension Color {
  static var appPrimaryBackground: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.primary)
      default: return NSColor(AppColor.Light.primary)
      }
    })
  }

  static var appSecondaryBackground: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.secondary)
      default: return NSColor(AppColor.Light.secondary)
      }
    })
  }

  static var appAccentTeal: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.accentTeal)
      default: return NSColor(AppColor.Light.accentTeal)
      }
    })
  }

  static var appAccentRed: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.accentRed)
      default: return NSColor(AppColor.Light.accentRed)
      }
    })
  }

  static var appAccentGreen: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.accentGreen)
      default: return NSColor(AppColor.Light.accentGreen)
      }
    })
  }

  static var appAccentAmber: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.accentAmber)
      default: return NSColor(AppColor.Light.accentAmber)
      }
    })
  }

  static var appTextPrimary: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.textPrimary)
      default: return NSColor(AppColor.Light.textPrimary)
      }
    })
  }

  static var appTextSecondary: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.textSecondary)
      default: return NSColor(AppColor.Light.textSecondary)
      }
    })
  }

  static var appTextTertiary: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(AppColor.Dark.textTertiary)
      default: return NSColor(AppColor.Light.textTertiary)
      }
    })
  }

  static var appBorderTertiary: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(white: 1.0, alpha: 0.08)
      default: return NSColor(white: 0.0, alpha: 0.08)
      }
    })
  }
}
