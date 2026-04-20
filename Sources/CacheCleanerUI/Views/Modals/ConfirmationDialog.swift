import SwiftUI

@available(macOS 12, *)
struct ConfirmationDialogView: View {
  let title: String
  let message: String
  let primaryButtonText: String
  let isDestructive: Bool
  let onPrimary: () -> Void
  let onCancel: () -> Void

  @State private var dontShowAgain = false

  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      HStack(spacing: AppSpacing.md) {
        Image(systemName: "exclamationmark.triangle.fill")
          .font(.system(size: 28))
          .foregroundColor(.appAccentAmber)
        VStack(alignment: .leading, spacing: 4) {
          Text(title)
            .font(.system(size: AppTypography.FontSize.titleSmall, weight: .semibold))
            .foregroundColor(.appTextPrimary)
          Text(message)
            .font(.system(size: AppTypography.FontSize.body))
            .foregroundColor(.appTextSecondary)
            .fixedSize(horizontal: false, vertical: true)
        }
      }

      Toggle("Don't show this again", isOn: $dontShowAgain)
        .font(.system(size: AppTypography.FontSize.caption))
        .foregroundColor(.appTextSecondary)

      HStack(spacing: AppSpacing.md) {
        Spacer()
        Button("Cancel", action: onCancel).buttonStyle(SecondaryButtonStyle())
        if isDestructive {
          Button(primaryButtonText, action: onPrimary).buttonStyle(DestructiveButtonStyle())
        } else {
          Button(primaryButtonText, action: onPrimary).buttonStyle(PrimaryButtonStyle())
        }
      }
    }
    .padding(AppSpacing.lg)
    .frame(width: 420)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .shadow(color: .black.opacity(0.2), radius: 20)
  }
}
