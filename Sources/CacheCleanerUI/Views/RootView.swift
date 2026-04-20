import SwiftUI
import DataPersistence

public struct RootView: View {
  public init() {}
  @StateObject private var dashboardVM = DashboardViewModel()
  @State private var selectedTab: Tab = .dashboard

  enum Tab: String, CaseIterable {
    case dashboard = "Dashboard"
    case results = "Scan Results"
    case stats = "Statistics"
    case settings = "Settings"

    var icon: String {
      switch self {
      case .dashboard: return "house.fill"
      case .results: return "list.bullet"
      case .stats: return "chart.bar.fill"
      case .settings: return "gear"
      }
    }
  }

  public var body: some View {
    NavigationSplitView {
      SidebarView(selectedTab: $selectedTab, dashboardVM: dashboardVM)
        .navigationSplitViewColumnWidth(min: 180, ideal: 200, max: 220)
    } detail: {
      Group {
        switch selectedTab {
        case .dashboard:
          DashboardView(viewModel: dashboardVM, onNavigate: { selectedTab = $0 })
        case .results:
          ScanResultsView(viewModel: dashboardVM.resultsViewModel)
        case .stats:
          StatsView(repository: StatisticsRepository())
        case .settings:
          SettingsView()
        }
      }
      .animation(.easeInOut(duration: 0.2), value: selectedTab)
    }
    .frame(minWidth: 800, minHeight: 600)
  }
}

@available(macOS 12, *)
struct SidebarView: View {
  @Binding var selectedTab: RootView.Tab
  @ObservedObject var dashboardVM: DashboardViewModel

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: AppSpacing.sm) {
        Image(systemName: "trash.fill")
          .font(.system(size: 16))
          .foregroundColor(.appAccentTeal)
        Text("Cache Cleaner")
          .font(.system(size: AppTypography.FontSize.body, weight: .semibold))
          .foregroundColor(.appTextPrimary)
      }
      .padding(AppSpacing.md)

      Divider()

      ForEach(RootView.Tab.allCases, id: \.rawValue) { tab in
        Button(action: { selectedTab = tab }) {
          Label(tab.rawValue, systemImage: tab.icon)
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.horizontal, AppSpacing.sm)
        .padding(.vertical, 4)
        .background(
          selectedTab == tab
            ? Color.appAccentTeal.opacity(0.12)
            : Color.clear
        )
        .cornerRadius(AppRadius.small)
        .foregroundColor(selectedTab == tab ? .appAccentTeal : .appTextPrimary)
      }
      .padding(.horizontal, AppSpacing.sm)
      .padding(.top, AppSpacing.sm)

      Spacer()

      if let lastScan = dashboardVM.recentScans.first {
        VStack(alignment: .leading, spacing: 4) {
          Text("Last scan")
            .font(.system(size: AppTypography.FontSize.caption))
            .foregroundColor(.appTextTertiary)
          Text(lastScan.timestamp.formatted(date: .abbreviated, time: .shortened))
            .font(.system(size: AppTypography.FontSize.caption))
            .foregroundColor(.appTextSecondary)
        }
        .padding(AppSpacing.md)
      }
    }
    .background(Color.appSecondaryBackground)
  }
}
