import SwiftUI
import Combine
import CacheScanner
import DataPersistence

@available(macOS 12, *)
@MainActor
class DashboardViewModel: ObservableObject {
  @Published var totalCacheSize: Int64 = 0
  @Published var filesCount: Int = 0
  @Published var estimatedRecoverable: Int64 = 0
  @Published var lastCleanupDate: Date?
  @Published var recentScans: [ScanRecord] = []
  @Published var isScanning: Bool = false
  @Published var scanPhase: String = ""

  lazy var resultsViewModel: ScanResultsViewModel = ScanResultsViewModel()

  private let scanHistoryRepository: ScanHistoryRepositoryProtocol

  init(scanHistoryRepository: ScanHistoryRepositoryProtocol = ScanHistoryRepository()) {
    self.scanHistoryRepository = scanHistoryRepository
    loadRecentScans()
  }

  func startScan() {
    isScanning = true
    scanPhase = "Browser Caches"
    Task {
      do {
        let scanner = CacheScanner()
        let entries = try await scanner.scanAsync { [weak self] progress in
          Task { @MainActor in
            self?.handleProgress(progress)
          }
        }

        let record = ScanRecord(
          entries: entries,
          totalSize: totalCacheSize,
          filesCount: filesCount
        )
        try await scanHistoryRepository.save(scan: record)
        resultsViewModel.loadResults(from: record)
        isScanning = false
        loadRecentScans()
      } catch {
        isScanning = false
      }
    }
  }

  private func handleProgress(_ progress: ScanProgress) {
    switch progress {
    case .progress(let files, let size):
      filesCount = files
      totalCacheSize = size
      estimatedRecoverable = Int64(Double(size) * 0.66)
    case .categoryProgress(let cat, _):
      scanPhase = cat.rawValue
    default:
      break
    }
  }

  private func loadRecentScans() {
    Task {
      do {
        recentScans = try await scanHistoryRepository.fetchRecentScans(limit: 5)
      } catch {}
    }
  }
}
