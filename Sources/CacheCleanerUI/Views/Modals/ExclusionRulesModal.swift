import SwiftUI

@available(macOS 12, *)
struct ExclusionRulesModal: View {
  @Binding var isPresented: Bool
  @State private var rules: [ExclusionRule] = [
    ExclusionRule(pattern: "~/Library/Caches/com.apple.Safari/Thumbnails", enabled: true),
    ExclusionRule(pattern: "*.keychain", enabled: true),
    ExclusionRule(pattern: "~/Library/Mail", enabled: true),
  ]
  @State private var newPattern: String = ""

  struct ExclusionRule: Identifiable {
    let id = UUID()
    var pattern: String
    var enabled: Bool
  }

  var body: some View {
    VStack(spacing: 0) {
      HStack {
        Text("Exclusion Rules")
          .font(.system(size: AppTypography.FontSize.titleSmall, weight: .semibold))
          .foregroundColor(.appTextPrimary)
        Spacer()
        Button(action: { isPresented = false }) {
          Image(systemName: "xmark").foregroundColor(.appTextSecondary)
        }.buttonStyle(PlainButtonStyle())
      }
      .padding(AppSpacing.md)

      Divider()

      List($rules) { $rule in
        HStack {
          Toggle("", isOn: $rule.enabled).labelsHidden()
          Text(rule.pattern)
            .font(.system(size: AppTypography.FontSize.body, design: .monospaced))
            .foregroundColor(rule.enabled ? .appTextPrimary : .appTextTertiary)
          Spacer()
          Button(action: { rules.removeAll { $0.id == rule.id } }) {
            Image(systemName: "minus.circle.fill").foregroundColor(.appAccentRed)
          }.buttonStyle(PlainButtonStyle())
        }
        .padding(.vertical, 4)
      }
      .frame(height: 200)

      Divider()

      HStack(spacing: AppSpacing.sm) {
        TextField("Add pattern (e.g. ~/Library/Caches/MyApp)", text: $newPattern)
          .textFieldStyle(InputFieldStyle())
        Button("Add") {
          guard !newPattern.isEmpty else { return }
          rules.append(ExclusionRule(pattern: newPattern, enabled: true))
          newPattern = ""
        }
        .buttonStyle(PrimaryButtonStyle())
        .disabled(newPattern.isEmpty)
      }
      .padding(AppSpacing.md)

      HStack {
        Spacer()
        Button("Done") { isPresented = false }.buttonStyle(PrimaryButtonStyle())
      }
      .padding([.bottom, .horizontal], AppSpacing.md)
    }
    .frame(width: 520)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .shadow(color: .black.opacity(0.2), radius: 20)
  }
}
