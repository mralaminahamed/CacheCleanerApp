import SwiftUI
import DataPersistence

@available(macOS 12, *)
struct StatsView: View {
  let repository: StatisticsRepository
  @State private var stats: CleanupStatistics?

  private func formatBytes(_ bytes: Int64) -> String {
    ByteCountFormatter.string(fromByteCount: bytes, countStyle: .decimal)
  }

  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: AppSpacing.lg) {
        Text("Statistics")
          .font(.system(size: AppTypography.FontSize.titleLarge, weight: .semibold))
          .foregroundColor(.appTextPrimary)

        if let stats = stats {
          HStack(spacing: AppSpacing.md) {
            StatCard(title: "Total Scans", value: "\(stats.totalScans)", icon: "magnifyingglass")
            StatCard(title: "Files Removed", value: "\(stats.totalFilesDeleted.formatted())", icon: "trash.fill")
            StatCard(title: "Space Freed", value: formatBytes(stats.totalSizeFreed), icon: "internaldrive.fill")
          }

          if let lastScan = stats.lastScanDate {
            HStack {
              Text("Last scan:")
                .foregroundColor(.appTextSecondary)
              Text(lastScan.formatted(date: .complete, time: .shortened))
                .foregroundColor(.appTextPrimary)
            }
            .font(.system(size: AppTypography.FontSize.body))
          }
        } else {
          Text("No statistics available yet. Run your first scan.")
            .foregroundColor(.appTextSecondary)
        }
      }
      .padding(AppSpacing.lg)
    }
    .background(Color.appPrimaryBackground)
    .onAppear { stats = repository.getStatistics() }
  }
}

struct StatCard: View {
  let title: String
  let value: String
  let icon: String

  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.sm) {
      Image(systemName: icon).font(.system(size: 20)).foregroundColor(.appAccentTeal)
      Text(title).font(.system(size: AppTypography.FontSize.caption, weight: .medium)).foregroundColor(.appTextSecondary)
      Text(value).font(.system(size: 22, weight: .semibold)).foregroundColor(.appTextPrimary)
    }
    .padding(AppSpacing.md)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .cardShadow()
  }
}
