import SwiftUI

@available(macOS 12, *)
struct ScanProgressView: View {
  @ObservedObject var viewModel: DashboardViewModel
  @Binding var isPresented: Bool

  private let phases = ["Browser Caches", "System Caches", "Temp Files", "App Data", "Xcode & Developer"]

  private func formatBytes(_ bytes: Int64) -> String {
    ByteCountFormatter.string(fromByteCount: bytes, countStyle: .decimal)
  }

  var body: some View {
    VStack(spacing: AppSpacing.lg) {
      HStack {
        Text("Scanning System Cache")
          .font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold))
          .foregroundColor(.appTextPrimary)
        Spacer()
        Button(action: { isPresented = false }) {
          Image(systemName: "xmark")
            .foregroundColor(.appTextSecondary)
        }
        .buttonStyle(PlainButtonStyle())
      }

      VStack(alignment: .leading, spacing: AppSpacing.md) {
        ForEach(phases, id: \.self) { phase in
          HStack(spacing: AppSpacing.md) {
            let isCurrent = viewModel.scanPhase == phase
            let isDone = false // Would track completion per phase
            Group {
              if isDone {
                Image(systemName: "checkmark.circle.fill").foregroundColor(.appAccentGreen)
              } else if isCurrent {
                ProgressView().frame(width: 16, height: 16)
              } else {
                Image(systemName: "circle").foregroundColor(.appTextTertiary)
              }
            }
            .font(.system(size: 16))

            Text(phase)
              .font(.system(size: AppTypography.FontSize.body))
              .foregroundColor(isCurrent ? .appTextPrimary : .appTextSecondary)
            Spacer()
          }
        }
      }

      Divider()

      HStack(spacing: AppSpacing.xl) {
        VStack(alignment: .leading, spacing: 2) {
          Text("Files Found")
            .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
            .foregroundColor(.appTextSecondary)
          Text("\(viewModel.filesCount.formatted())")
            .font(.system(size: 20, weight: .semibold, design: .monospaced))
            .foregroundColor(.appTextPrimary)
        }
        VStack(alignment: .leading, spacing: 2) {
          Text("Cache Size")
            .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
            .foregroundColor(.appTextSecondary)
          Text(formatBytes(viewModel.totalCacheSize))
            .font(.system(size: 20, weight: .semibold, design: .monospaced))
            .foregroundColor(.appAccentTeal)
        }
        Spacer()
      }

      HStack {
        Spacer()
        Button("Cancel Scan") {
          isPresented = false
        }
        .buttonStyle(SecondaryButtonStyle())
      }
    }
    .padding(AppSpacing.lg)
    .frame(width: 480)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .shadow(color: .black.opacity(0.25), radius: 30, x: 0, y: 10)
    .onAppear { viewModel.startScan() }
  }
}
