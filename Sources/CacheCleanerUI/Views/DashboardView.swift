import SwiftUI
import CacheScanner
import DataPersistence

@available(macOS 12, *)
struct DashboardView: View {
  @ObservedObject var viewModel: DashboardViewModel
  let onNavigate: (RootView.Tab) -> Void
  @State private var showScanModal = false

  private func formatBytes(_ bytes: Int64) -> String {
    let formatter = ByteCountFormatter()
    formatter.allowedUnits = [.useGB, .useMB, .useKB]
    formatter.countStyle = .decimal
    return formatter.string(fromByteCount: bytes)
  }

  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: AppSpacing.lg) {
        VStack(alignment: .leading, spacing: 4) {
          Text("Dashboard")
            .font(.system(size: AppTypography.FontSize.titleLarge, weight: .semibold))
            .foregroundColor(.appTextPrimary)
          Text("Review cached data, scan, and reclaim space.")
            .font(.system(size: AppTypography.FontSize.body))
            .foregroundColor(.appTextSecondary)
        }

        HStack(spacing: AppSpacing.md) {
          SummaryCardView(
            title: "Total Cache Found",
            value: formatBytes(viewModel.totalCacheSize),
            subtitle: "\(viewModel.filesCount.formatted()) files",
            icon: "internaldrive.fill",
            color: .appAccentTeal
          )
          SummaryCardView(
            title: "Safe to Reclaim",
            value: formatBytes(viewModel.estimatedRecoverable),
            subtitle: "excluding system-critical caches",
            icon: "trash.fill",
            color: .appAccentGreen
          )
          SummaryCardView(
            title: "Last Cleanup",
            value: viewModel.lastCleanupDate.map { $0.formatted(.relative(presentation: .named)) } ?? "Never",
            subtitle: "freed 2.1 GB · 1,542 files",
            icon: "checkmark.circle.fill",
            color: .appAccentTeal
          )
        }

        HStack(spacing: AppSpacing.md) {
          VStack(alignment: .leading, spacing: AppSpacing.md) {
            Text("Run a full scan")
              .font(.system(size: AppTypography.FontSize.titleSmall, weight: .semibold))
              .foregroundColor(.appTextPrimary)
            Text("Scans ~/Library, /Library/Caches, /private/tmp, and developer dirs")
              .font(.system(size: AppTypography.FontSize.caption))
              .foregroundColor(.appTextSecondary)
            Button("Scan for Cache") { showScanModal = true }
              .buttonStyle(PrimaryButtonStyle())
              .disabled(viewModel.isScanning)
          }
          .padding(AppSpacing.md)
          .frame(maxWidth: .infinity, alignment: .leading)
          .background(Color.appSecondaryBackground)
          .cornerRadius(AppRadius.large)
          .cardShadow()
        }

        VStack(alignment: .leading, spacing: AppSpacing.sm) {
          HStack {
            Text("Recent scans")
              .font(.system(size: AppTypography.FontSize.titleSmall, weight: .semibold))
              .foregroundColor(.appTextPrimary)
            Spacer()
            Button("View all") { onNavigate(.results) }
              .buttonStyle(PlainButtonStyle())
              .foregroundColor(.appAccentTeal)
              .font(.system(size: AppTypography.FontSize.caption))
          }
          RecentScansTableView(scans: viewModel.recentScans, onSelect: { onNavigate(.results) })
        }
      }
      .padding(AppSpacing.lg)
    }
    .background(Color.appPrimaryBackground)
    .sheet(isPresented: $showScanModal) {
      ScanProgressView(viewModel: viewModel, isPresented: $showScanModal)
    }
  }
}

@available(macOS 12, *)
struct SummaryCardView: View {
  let title: String
  let value: String
  let subtitle: String
  let icon: String
  let color: Color

  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.sm) {
      Image(systemName: icon)
        .font(.system(size: 20))
        .foregroundColor(color)
      Text(title)
        .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
        .foregroundColor(.appTextSecondary)
      Text(value)
        .font(.system(size: 24, weight: .semibold))
        .foregroundColor(.appTextPrimary)
      Text(subtitle)
        .font(.system(size: AppTypography.FontSize.caption))
        .foregroundColor(.appTextTertiary)
    }
    .padding(AppSpacing.md)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .cardShadow()
  }
}

@available(macOS 12, *)
struct RecentScansTableView: View {
  let scans: [ScanRecord]
  let onSelect: () -> Void

  private func formatBytes(_ bytes: Int64) -> String {
    let formatter = ByteCountFormatter()
    formatter.allowedUnits = [.useGB, .useMB]
    formatter.countStyle = .decimal
    return formatter.string(fromByteCount: bytes)
  }

  var body: some View {
    VStack(spacing: 0) {
      HStack {
        Text("Date").frame(maxWidth: .infinity, alignment: .leading)
        Text("Cache Found").frame(width: 100, alignment: .trailing)
        Text("Files").frame(width: 80, alignment: .trailing)
        Text("Action").frame(width: 80, alignment: .trailing)
      }
      .font(.system(size: AppTypography.FontSize.caption, weight: .semibold))
      .foregroundColor(.appTextSecondary)
      .padding(AppSpacing.md)
      .background(Color.appSecondaryBackground)

      if scans.isEmpty {
        Text("No scans yet. Run your first scan to get started.")
          .font(.system(size: AppTypography.FontSize.body))
          .foregroundColor(.appTextSecondary)
          .padding(AppSpacing.lg)
          .frame(maxWidth: .infinity)
      } else {
        ForEach(Array(scans.enumerated()), id: \.element.id) { index, scan in
          Button(action: onSelect) {
            HStack {
              Text(scan.timestamp.formatted(date: .abbreviated, time: .shortened))
                .frame(maxWidth: .infinity, alignment: .leading)
              Text(formatBytes(scan.totalSize))
                .frame(width: 100, alignment: .trailing)
                .foregroundColor(.appAccentTeal)
              Text("\(scan.filesCount.formatted())")
                .frame(width: 80, alignment: .trailing)
                .foregroundColor(.appTextSecondary)
              Text("Details")
                .frame(width: 80, alignment: .trailing)
                .foregroundColor(.appAccentTeal)
            }
            .font(.system(size: AppTypography.FontSize.body))
            .foregroundColor(.appTextPrimary)
            .padding(AppSpacing.md)
            .background(index % 2 == 1 ? Color.appPrimaryBackground.opacity(0.5) : Color.clear)
          }
          .buttonStyle(PlainButtonStyle())

          if index < scans.count - 1 {
            Divider().padding(.horizontal, AppSpacing.md)
          }
        }
      }
    }
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .cardShadow()
  }
}
