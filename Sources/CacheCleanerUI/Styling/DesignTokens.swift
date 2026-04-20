// MARK: - Design Tokens (Auto-generated from Figma)

import SwiftUI

// MARK: Color Tokens

enum AppColor {
  enum Light {
    static let primary = Color(red: 0.96, green: 0.96, blue: 0.96)
    static let secondary = Color.white
    static let tertiary = Color(red: 0.97, green: 0.97, blue: 0.97)

    static let accentTeal = Color(red: 0.0, green: 0.627, blue: 0.627)
    static let accentRed = Color(red: 0.862, green: 0.208, blue: 0.271)
    static let accentGreen = Color(red: 0.0, green: 0.784, blue: 0.322)
    static let accentAmber = Color(red: 0.961, green: 0.62, blue: 0.141)

    static let textPrimary = Color.black
    static let textSecondary = Color(red: 0.369, green: 0.369, blue: 0.376)
    static let textTertiary = Color(red: 0.549, green: 0.549, blue: 0.557)
  }

  enum Dark {
    static let primary = Color(red: 0.11, green: 0.11, blue: 0.12)
    static let secondary = Color(red: 0.173, green: 0.173, blue: 0.18)
    static let tertiary = Color(red: 0.227, green: 0.227, blue: 0.235)

    static let accentTeal = Color(red: 0.196, green: 0.831, blue: 0.878)
    static let accentRed = Color(red: 1.0, green: 0.333, blue: 0.333)
    static let accentGreen = Color(red: 0.204, green: 0.784, blue: 0.345)
    static let accentAmber = Color(red: 1.0, green: 0.647, blue: 0.141)

    static let textPrimary = Color(red: 0.961, green: 0.961, blue: 0.961)
    static let textSecondary = Color(red: 0.631, green: 0.631, blue: 0.651)
    static let textTertiary = Color(red: 0.557, green: 0.557, blue: 0.576)
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

private func dynamicColor(light: Color, dark: Color) -> Color {
  Color(NSColor(name: nil, dynamicProvider: { appearance in
    switch appearance.name {
    case .darkAqua, .vibrantDark: return NSColor(dark)
    default: return NSColor(light)
    }
  }))
}

extension Color {
  static var appPrimaryBackground: Color { dynamicColor(light: AppColor.Light.primary, dark: AppColor.Dark.primary) }
  static var appSecondaryBackground: Color { dynamicColor(light: AppColor.Light.secondary, dark: AppColor.Dark.secondary) }
  static var appAccentTeal: Color { dynamicColor(light: AppColor.Light.accentTeal, dark: AppColor.Dark.accentTeal) }
  static var appAccentRed: Color { dynamicColor(light: AppColor.Light.accentRed, dark: AppColor.Dark.accentRed) }
  static var appAccentGreen: Color { dynamicColor(light: AppColor.Light.accentGreen, dark: AppColor.Dark.accentGreen) }
  static var appAccentAmber: Color { dynamicColor(light: AppColor.Light.accentAmber, dark: AppColor.Dark.accentAmber) }
  static var appTextPrimary: Color { dynamicColor(light: AppColor.Light.textPrimary, dark: AppColor.Dark.textPrimary) }
  static var appTextSecondary: Color { dynamicColor(light: AppColor.Light.textSecondary, dark: AppColor.Dark.textSecondary) }
  static var appTextTertiary: Color { dynamicColor(light: AppColor.Light.textTertiary, dark: AppColor.Dark.textTertiary) }

  static var appBorderTertiary: Color {
    Color(NSColor(name: nil, dynamicProvider: { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark: return NSColor(white: 1.0, alpha: 0.08)
      default: return NSColor(white: 0.0, alpha: 0.08)
      }
    }))
  }
}
