import SwiftUI

@available(macOS 12, *)
struct PasswordDialog: View {
  @Binding var isPresented: Bool
  let onAuthenticate: (String) -> Void

  @State private var password: String = ""
  @State private var isAuthenticating = false
  @State private var errorMessage: String? = nil

  var body: some View {
    VStack(spacing: AppSpacing.lg) {
      Image(systemName: "lock.fill")
        .font(.system(size: 32))
        .foregroundColor(.appAccentTeal)

      VStack(spacing: AppSpacing.sm) {
        Text("Administrator Access Required")
          .font(.system(size: AppTypography.FontSize.titleSmall, weight: .semibold))
          .foregroundColor(.appTextPrimary)
        Text("Cache Cleaner requires administrator privileges to delete system cache files.")
          .font(.system(size: AppTypography.FontSize.body))
          .foregroundColor(.appTextSecondary)
          .multilineTextAlignment(.center)
      }

      SecureField("Password", text: $password)
        .textFieldStyle(InputFieldStyle())
        .onSubmit { authenticate() }

      if let error = errorMessage {
        Text(error)
          .font(.system(size: AppTypography.FontSize.caption))
          .foregroundColor(.appAccentRed)
      }

      HStack(spacing: AppSpacing.md) {
        Button("Cancel") { isPresented = false }.buttonStyle(SecondaryButtonStyle())
        Button(action: authenticate) {
          if isAuthenticating { ProgressView() } else { Text("Authenticate") }
        }
        .buttonStyle(PrimaryButtonStyle())
        .disabled(password.isEmpty || isAuthenticating)
      }
    }
    .padding(AppSpacing.lg)
    .frame(width: 360)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .shadow(color: .black.opacity(0.25), radius: 20)
  }

  private func authenticate() {
    isAuthenticating = true
    errorMessage = nil
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
      isAuthenticating = false
      onAuthenticate(password)
      isPresented = false
    }
  }
}
