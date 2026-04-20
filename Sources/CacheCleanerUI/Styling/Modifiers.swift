import SwiftUI

// MARK: Button Styles

struct PrimaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(.white)
      .frame(height: 36)
      .padding(.horizontal, AppSpacing.md)
      .background(Color.appAccentTeal)
      .cornerRadius(AppRadius.medium)
      .opacity(configuration.isPressed ? 0.8 : 1.0)
      .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
  }
}

struct DestructiveButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(.white)
      .frame(height: 36)
      .padding(.horizontal, AppSpacing.md)
      .background(Color.appAccentRed)
      .cornerRadius(AppRadius.medium)
      .opacity(configuration.isPressed ? 0.8 : 1.0)
      .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
  }
}

struct SecondaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(.appTextPrimary)
      .frame(height: 36)
      .padding(.horizontal, AppSpacing.md)
      .background(Color.appSecondaryBackground)
      .cornerRadius(AppRadius.small)
      .overlay(
        RoundedRectangle(cornerRadius: AppRadius.small)
          .stroke(Color.appBorderTertiary, lineWidth: 0.5)
      )
      .opacity(configuration.isPressed ? 0.7 : 1.0)
  }
}

// MARK: Text Field Style

struct InputFieldStyle: TextFieldStyle {
  func _body(configuration: TextField<Self._Label>) -> some View {
    configuration
      .font(.system(size: AppTypography.FontSize.body))
      .padding(.horizontal, AppSpacing.md)
      .padding(.vertical, AppSpacing.sm)
      .background(Color.appSecondaryBackground)
      .cornerRadius(AppRadius.medium)
      .overlay(
        RoundedRectangle(cornerRadius: AppRadius.medium)
          .stroke(Color.appBorderTertiary, lineWidth: 0.5)
      )
  }
}

struct SelectableButtonStyle: ButtonStyle {
  let isSelected: Bool
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(isSelected ? .white : .appTextPrimary)
      .frame(height: 36)
      .padding(.horizontal, AppSpacing.md)
      .background(isSelected ? Color.appAccentTeal : Color.appSecondaryBackground)
      .cornerRadius(AppRadius.small)
      .overlay(
        RoundedRectangle(cornerRadius: AppRadius.small)
          .stroke(isSelected ? Color.clear : Color.appBorderTertiary, lineWidth: 0.5)
      )
      .opacity(configuration.isPressed ? 0.8 : 1.0)
  }
}

// MARK: Card Shadow

struct CardShadow: ViewModifier {
  func body(content: Content) -> some View {
    content.shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 2)
  }
}

extension View {
  func cardShadow() -> some View { modifier(CardShadow()) }
}
