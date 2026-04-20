import SwiftUI
import Combine
import CacheScanner
import CleanupEngine

@available(macOS 12, *)
@MainActor
class ScanResultsViewModel: ObservableObject {
  @Published var allEntries: [CacheEntry] = []
  @Published var filteredEntries: [CacheEntry] = []
  @Published var selectedEntries: Set<UUID> = []
  @Published var selectedCategory: CacheCategory? = nil
  @Published var searchText: String = ""
  @Published var isDeleting: Bool = false
  @Published var showConfirmation: Bool = false
  @Published var sortColumn: SortColumn = .size
  @Published var sortAscending: Bool = false

  enum SortColumn {
    case path, size, modified, safety, category
  }

  func loadResults(from scanRecord: ScanRecord) {
    allEntries = scanRecord.entries
    applyFilters()
  }

  func applyFilters() {
    var filtered = allEntries

    if let category = selectedCategory {
      filtered = filtered.filter { $0.category == category }
    }

    if !searchText.isEmpty {
      filtered = filtered.filter {
        $0.path.localizedCaseInsensitiveContains(searchText)
      }
    }

    filtered.sort { a, b in
      switch sortColumn {
      case .size: return sortAscending ? a.size < b.size : a.size > b.size
      case .path: return sortAscending ? a.path < b.path : a.path > b.path
      case .safety: return sortAscending ? a.safetyLevel.rawValue < b.safetyLevel.rawValue : a.safetyLevel.rawValue > b.safetyLevel.rawValue
      case .category: return sortAscending ? a.category.rawValue < b.category.rawValue : a.category.rawValue > b.category.rawValue
      case .modified: return sortAscending ? a.lastModified < b.lastModified : a.lastModified > b.lastModified
      }
    }

    filteredEntries = filtered
  }

  func toggleSelection(_ id: UUID) {
    if selectedEntries.contains(id) { selectedEntries.remove(id) }
    else { selectedEntries.insert(id) }
  }

  func selectAll() { selectedEntries = Set(filteredEntries.map { $0.id }) }
  func clearSelection() { selectedEntries.removeAll() }

  var selectedTotalSize: Int64 {
    filteredEntries.filter { selectedEntries.contains($0.id) }.reduce(0) { $0 + $1.size }
  }

  func deleteSelected() async {
    let toDelete = filteredEntries.filter { selectedEntries.contains($0.id) }
    isDeleting = true
    let manager = CleanupManager()
    do {
      _ = try await manager.cleanup(entries: toDelete) { _ in }
      allEntries.removeAll { entry in toDelete.contains { $0.id == entry.id } }
      applyFilters()
      clearSelection()
    } catch {}
    isDeleting = false
  }
}
