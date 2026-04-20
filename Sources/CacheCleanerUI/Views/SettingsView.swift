import SwiftUI
import AppKit

@available(macOS 12, *)
struct SettingsView: View {
  @StateObject private var viewModel = SettingsViewModel()
  @State private var selectedTab: SettingsTab = .general

  enum SettingsTab: String, CaseIterable {
    case general = "General"
    case privacy = "Privacy"
    case notifications = "Notifications"
    case scheduling = "Scheduling"
    case advanced = "Advanced"

    var icon: String {
      switch self {
      case .general: return "gear"
      case .privacy: return "lock.fill"
      case .notifications: return "bell.fill"
      case .scheduling: return "calendar"
      case .advanced: return "wrench.and.screwdriver"
      }
    }
  }

  var body: some View {
    HStack(spacing: 0) {
      VStack(alignment: .leading, spacing: 0) {
        Text("SETTINGS")
          .font(.system(size: 10, weight: .semibold))
          .foregroundColor(.appTextSecondary)
          .padding(AppSpacing.md)

        ForEach(SettingsTab.allCases, id: \.rawValue) { tab in
          Button(action: { selectedTab = tab }) {
            HStack {
              Image(systemName: tab.icon).frame(width: 16)
              Text(tab.rawValue)
              Spacer()
            }
            .padding(AppSpacing.sm)
            .contentShape(Rectangle())
          }
          .buttonStyle(PlainButtonStyle())
          .background(selectedTab == tab ? Color.appAccentTeal.opacity(0.12) : Color.clear)
          .foregroundColor(selectedTab == tab ? .appAccentTeal : .appTextPrimary)
          .cornerRadius(AppRadius.small)
          .padding(.horizontal, AppSpacing.sm)
        }
        Spacer()
      }
      .frame(width: 160)
      .background(Color.appSecondaryBackground)

      Divider()

      ScrollView {
        VStack(alignment: .leading, spacing: AppSpacing.lg) {
          switch selectedTab {
          case .general: GeneralSettingsView(viewModel: viewModel)
          case .privacy: PrivacySettingsView(viewModel: viewModel)
          case .notifications: NotificationsSettingsView(viewModel: viewModel)
          case .scheduling: SchedulingSettingsView(viewModel: viewModel)
          case .advanced: AdvancedSettingsView(viewModel: viewModel)
          }
          Spacer()
        }
        .padding(AppSpacing.lg)
      }
    }
    .frame(minWidth: 700, minHeight: 500)
    .background(Color.appPrimaryBackground)
    .onChange(of: viewModel.launchAtStartup) { _ in viewModel.save() }
    .onChange(of: viewModel.showMenuBar) { _ in viewModel.save() }
    .onChange(of: viewModel.deleteMethod) { _ in viewModel.save() }
  }
}

@available(macOS 12, *)
struct GeneralSettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("General").font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold)).foregroundColor(.appTextPrimary)
      GroupBox("Startup & Behavior") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          Toggle("Launch at startup", isOn: $viewModel.launchAtStartup)
          Toggle("Show menu bar icon", isOn: $viewModel.showMenuBar)
        }.padding(AppSpacing.sm)
      }
      GroupBox("Cache Cleanup Defaults") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          HStack {
            Text("Minimum file age:")
            Picker("", selection: $viewModel.minimumFileAge) {
              Text("7 days").tag(7); Text("14 days").tag(14)
              Text("30 days").tag(30); Text("90 days").tag(90)
            }.frame(width: 120)
            Spacer()
          }
          HStack {
            Text("Delete method:")
            Picker("", selection: $viewModel.deleteMethod) {
              Text("Trash").tag("trash"); Text("Permanent").tag("secure")
            }.pickerStyle(.segmented).frame(width: 180)
            Spacer()
          }
        }.padding(AppSpacing.sm)
      }
    }
  }
}

@available(macOS 12, *)
struct PrivacySettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("Privacy").font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold)).foregroundColor(.appTextPrimary)
      GroupBox("Analytics") {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
          Toggle("Help improve Cache Cleaner", isOn: $viewModel.enableTelemetry)
          Text("Anonymously share cleanup statistics to help us improve.")
            .font(.system(size: AppTypography.FontSize.caption)).foregroundColor(.appTextSecondary)
        }.padding(AppSpacing.sm)
      }
    }
  }
}

@available(macOS 12, *)
struct NotificationsSettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("Notifications").font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold)).foregroundColor(.appTextPrimary)
      GroupBox("Notification Events") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          Toggle("Enable notifications", isOn: $viewModel.enableNotifications)
          Toggle("Notify on scan complete", isOn: $viewModel.notifyOnScanComplete).disabled(!viewModel.enableNotifications)
          Toggle("Notify on cleanup complete", isOn: $viewModel.notifyOnCleanupComplete).disabled(!viewModel.enableNotifications)
        }.padding(AppSpacing.sm)
      }
    }
  }
}

@available(macOS 12, *)
struct SchedulingSettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("Scheduling").font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold)).foregroundColor(.appTextPrimary)
      GroupBox("Auto Cleanup") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          Toggle("Enable automatic cleanup", isOn: $viewModel.enableAutoCleanup)
          HStack {
            Text("Schedule (cron):")
            TextField("0 9 * * MON", text: $viewModel.autoCleanupSchedule)
              .textFieldStyle(InputFieldStyle()).frame(width: 180)
          }.disabled(!viewModel.enableAutoCleanup)
          Text("Example: \"0 9 * * MON\" = every Monday at 9am")
            .font(.system(size: AppTypography.FontSize.caption)).foregroundColor(.appTextSecondary)
        }.padding(AppSpacing.sm)
      }
    }
  }
}

@available(macOS 12, *)
struct AdvancedSettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  @State private var showResetConfirm = false
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("Advanced").font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold)).foregroundColor(.appTextPrimary)
      GroupBox("Scan Engine") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          HStack {
            Text("Index depth:")
            Picker("", selection: $viewModel.indexDepth) {
              Text("3").tag(3); Text("5").tag(5); Text("10").tag(10); Text("Unlimited").tag(0)
            }.frame(width: 120)
            Spacer()
          }
          Toggle("Debug logging", isOn: $viewModel.debugLogging)
        }.padding(AppSpacing.sm)
      }
      GroupBox("Data") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          Button("Export Settings…") {
            if let data = viewModel.exportSettings() {
              let panel = NSSavePanel()
              panel.nameFieldStringValue = "cache-cleaner-settings.json"
              panel.begin { response in
                if response == .OK, let url = panel.url { try? data.write(to: url) }
              }
            }
          }.buttonStyle(SecondaryButtonStyle())
        }.padding(AppSpacing.sm)
      }
      GroupBox("Danger Zone") {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
          Button("Reset All Settings to Defaults") { showResetConfirm = true }
            .buttonStyle(DestructiveButtonStyle())
        }.padding(AppSpacing.sm)
      }
    }
    .alert("Reset Settings?", isPresented: $showResetConfirm) {
      Button("Reset", role: .destructive) { viewModel.resetToDefaults() }
      Button("Cancel", role: .cancel) {}
    } message: {
      Text("All settings will be restored to their default values.")
    }
  }
}
