import SwiftUI
import CacheScanner

@available(macOS 12, *)
struct ScanResultsView: View {
  @ObservedObject var viewModel: ScanResultsViewModel

  private func formatBytes(_ bytes: Int64) -> String {
    let formatter = ByteCountFormatter()
    formatter.allowedUnits = [.useGB, .useMB, .useKB]
    formatter.countStyle = .decimal
    return formatter.string(fromByteCount: bytes)
  }

  var body: some View {
    VStack(spacing: 0) {
      // Toolbar
      HStack(spacing: AppSpacing.md) {
        TextField("Search results…", text: $viewModel.searchText)
          .textFieldStyle(InputFieldStyle())
          .onChange(of: viewModel.searchText) { _ in viewModel.applyFilters() }
          .frame(maxWidth: 300)

        Spacer()

        Button("Exclude Pattern…") {}
          .buttonStyle(SecondaryButtonStyle())
      }
      .padding(AppSpacing.md)
      .background(Color.appSecondaryBackground)

      // Category filters
      ScrollView(.horizontal, showsIndicators: false) {
        HStack(spacing: AppSpacing.sm) {
          Button("All") {
            viewModel.selectedCategory = nil
            viewModel.applyFilters()
          }
          .buttonStyle(SelectableButtonStyle(isSelected: viewModel.selectedCategory == nil))

          ForEach(CacheCategory.allCases, id: \.self) { cat in
            Button(cat.rawValue) {
              viewModel.selectedCategory = viewModel.selectedCategory == cat ? nil : cat
              viewModel.applyFilters()
            }
            .buttonStyle(SelectableButtonStyle(isSelected: viewModel.selectedCategory == cat))
          }
        }
        .padding(.horizontal, AppSpacing.md)
        .padding(.vertical, AppSpacing.sm)
      }
      .background(Color.appSecondaryBackground)

      Divider()

      // Table
      ResultsTableView(
        entries: viewModel.filteredEntries,
        selectedEntries: $viewModel.selectedEntries,
        onToggleSelection: viewModel.toggleSelection
      )

      Divider()

      // Action bar
      HStack(spacing: AppSpacing.md) {
        if !viewModel.selectedEntries.isEmpty {
          Text("\(viewModel.selectedEntries.count) selected · \(formatBytes(viewModel.selectedTotalSize))")
            .font(.system(size: AppTypography.FontSize.body, weight: .medium))
            .foregroundColor(.appAccentTeal)
          Button("Clear") { viewModel.clearSelection() }
            .buttonStyle(SecondaryButtonStyle())
        }
        Spacer()
        Button(action: viewModel.selectAll) {
          Label("Select All", systemImage: "checkmark.circle")
        }
        .buttonStyle(SecondaryButtonStyle())
        Button {
          viewModel.showConfirmation = true
        } label: {
          Label("Delete Selected", systemImage: "trash.fill")
        }
        .buttonStyle(DestructiveButtonStyle())
        .disabled(viewModel.selectedEntries.isEmpty || viewModel.isDeleting)
      }
      .padding(AppSpacing.md)
      .background(Color.appSecondaryBackground)
    }
    .background(Color.appPrimaryBackground)
    .confirmationDialog(
      "Delete \(viewModel.selectedEntries.count) files?",
      isPresented: $viewModel.showConfirmation,
      titleVisibility: .visible
    ) {
      Button("Delete", role: .destructive) {
        Task { await viewModel.deleteSelected() }
      }
      Button("Cancel", role: .cancel) {}
    } message: {
      Text("This will free \(formatBytes(viewModel.selectedTotalSize)). Items will be moved to the Trash.")
    }
  }
}

@available(macOS 12, *)
struct ResultsTableView: View {
  let entries: [CacheEntry]
  @Binding var selectedEntries: Set<UUID>
  let onToggleSelection: (UUID) -> Void

  var body: some View {
    Table(entries, selection: $selectedEntries) {
      TableColumn("") { entry in
        Image(systemName: fileTypeIcon(entry))
          .foregroundColor(.appTextSecondary)
      }
      .width(28)

      TableColumn("Path") { entry in
        VStack(alignment: .leading, spacing: 2) {
          Text(entry.path)
            .font(.system(size: AppTypography.FontSize.body, design: .monospaced))
            .lineLimit(1)
          if let app = entry.appName {
            Text(app)
              .font(.system(size: AppTypography.FontSize.caption))
              .foregroundColor(.appTextSecondary)
          }
        }
      }

      TableColumn("Category") { entry in
        Text(entry.category.rawValue)
          .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
          .foregroundColor(.appTextSecondary)
      }
      .width(90)

      TableColumn("Size") { entry in
        Text(ByteCountFormatter.string(fromByteCount: entry.size, countStyle: .decimal))
          .font(.system(size: AppTypography.FontSize.body, design: .monospaced))
          .foregroundColor(.appTextPrimary)
      }
      .width(90)

      TableColumn("Modified") { entry in
        Text(entry.lastModified.formatted(date: .abbreviated, time: .omitted))
          .font(.system(size: AppTypography.FontSize.body))
          .foregroundColor(.appTextSecondary)
      }
      .width(120)

      TableColumn("Safety") { entry in
        SafetyBadgeView(level: entry.safetyLevel)
      }
      .width(100)
    }
  }

  private func fileTypeIcon(_ entry: CacheEntry) -> String {
    switch entry.category {
    case .browser: return "globe"
    case .system: return "gearshape.fill"
    case .temp: return "clock.fill"
    case .app: return "app.fill"
    case .xcode: return "hammer.fill"
    }
  }
}

struct SafetyBadgeView: View {
  let level: SafetyLevel

  var body: some View {
    HStack(spacing: 4) {
      Image(systemName: icon).font(.system(size: 10, weight: .semibold))
      Text(level.rawValue.capitalized).font(.system(size: AppTypography.FontSize.caption, weight: .medium))
    }
    .padding(.horizontal, AppSpacing.sm)
    .padding(.vertical, 3)
    .background(color.opacity(0.15))
    .foregroundColor(color)
    .cornerRadius(AppRadius.small)
  }

  var color: Color {
    switch level {
    case .safe: return .appAccentGreen
    case .caution: return .appAccentAmber
    case .dangerous: return .appAccentRed
    }
  }

  var icon: String {
    switch level {
    case .safe: return "checkmark.circle.fill"
    case .caution: return "exclamationmark.circle.fill"
    case .dangerous: return "xmark.circle.fill"
    }
  }
}
