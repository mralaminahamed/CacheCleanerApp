# macOS Cache Cleaner — Complete Implementation Plan with Claude Design

## Executive Summary

This document outlines the end-to-end implementation strategy for building a native macOS cache cleaner application, integrating Figma design assets from Claude Design with Swift/SwiftUI development. The plan covers architecture, development phases, design-to-code workflows, testing, and deployment.

**Total Timeline**: 16 weeks (4 months)  
**Team Size**: 1 Senior iOS/macOS Engineer + 1 UI/UX Designer (part-time)  
**Delivery**: Production-ready app (v1.0) with App Store notarization support.

---

## Part 1: Design Phase (Weeks 1–2)

### 1.1 Design Kickoff & Asset Generation

**Objective**: Generate all UI components, screens, and design tokens from Claude Design.

**Process**:

1. **Brief Handoff to Claude Design**
   - Upload the design brief (`macos_cache_cleaner_design_brief.md`) to Claude Design.
   - Request deliverables:
     - Figma file with all screens (Dashboard, Scan Progress, Results, Settings, Modals).
     - Light/dark mode variants for each screen.
     - Component library (button, input, dropdown, table row, card, badge, checkbox).
     - Interactive prototype demonstrating: Dashboard → Scan → Results → Delete flow.
     - Design tokens (colors, typography, spacing, corner radii) exported as JSON/CSS.

2. **Design File Organization** (Figma Structure)
   ```
   Cache Cleaner Design
   ├── 📋 Screens
   │   ├── 01 - Dashboard (Light)
   │   ├── 01 - Dashboard (Dark)
   │   ├── 02 - Scan Progress Modal (Light/Dark)
   │   ├── 03 - Scan Results (Light/Dark)
   │   ├── 04 - Settings Window (Light/Dark)
   │   ├── 05 - Exclusion Rules Modal (Light/Dark)
   │   ├── 06 - Confirmation Dialogs (Light/Dark)
   │   └── 07 - Password Dialog (Light/Dark)
   ├── 🧩 Components
   │   ├── Button (Default, Hover, Active, Disabled)
   │   ├── Input (Default, Focused, Error, Disabled)
   │   ├── Dropdown (Default, Open, Selected)
   │   ├── Checkbox (Unchecked, Checked, Indeterminate)
   │   ├── Toggle (Off, On)
   │   ├── Table Row (Default, Hover, Selected, Alternating)
   │   ├── Card (Summary Card, List Card)
   │   ├── Badge (Safety Badge: Green/Yellow/Red, Category Badge)
   │   ├── Modal (Base, Header, Body, Footer)
   │   ├── Spinner (Loading animation, SVG export)
   │   └── Progress Bar (Linear, indeterminate)
   ├── 🎨 Design System
   │   ├── Colors (Light/Dark palette, semantic colors)
   │   ├── Typography (Font scale, weights)
   │   ├── Spacing (Grid system, padding scale)
   │   ├── Icons (SF Symbols mapping)
   │   └── Shadows & Depth
   ├── 📱 Prototype
   │   ├── Flow 1: Scan Flow (Dashboard → Scan Modal → Results)
   │   ├── Flow 2: Delete Flow (Results → Confirmation → Completion)
   │   ├── Flow 3: Settings Navigation
   │   └── Flow 4: Exclusion Rules
   └── 📝 Specs & Documentation
       ├── Redlines (All screens with measurements)
       ├── Component Specs (States, dimensions, spacing)
       └── Accessibility Notes (Focus states, ARIA equivalent)
   ```

3. **Design Tokens Export**
   - Export design tokens as JSON for Swift integration:
   ```json
   {
     "colors": {
       "light": {
         "primary": "#F5F5F5",
         "secondary": "#FFFFFF",
         "accent_teal": "#00A0A0",
         "accent_red": "#DC3545",
         "text_primary": "#000000",
         "text_secondary": "#5E5E62"
       },
       "dark": {
         "primary": "#1C1C1E",
         "secondary": "#2C2C2E",
         "accent_teal": "#32D4E0",
         "accent_red": "#FF5555",
         "text_primary": "#F5F5F5",
         "text_secondary": "#A1A1A6"
       }
     },
     "typography": {
       "title_large": {"size": 28, "weight": 600},
       "title_medium": {"size": 18, "weight": 600},
       "body": {"size": 13, "weight": 400},
       "caption": {"size": 12, "weight": 400}
     },
     "spacing": {
       "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32
     },
     "radius": {
       "small": 6, "medium": 8, "large": 12, "full": 9999
     }
   }
   ```

**Deliverables by End of Week 2**:
- ✅ Figma file (read-only link shared with dev team).
- ✅ Interactive prototype (shareable Figma prototype link).
- ✅ Design tokens JSON (committed to repo under `Assets/DesignTokens/`).
- ✅ Redline specs PDF (measurements for all screen elements).
- ✅ Component inventory spreadsheet (component name, states, where used).

---

### 1.2 Design Review & Feedback Loop

**Week 2 Activities**:

1. **Internal Review**
   - Engineer reviews designs for technical feasibility (SwiftUI support, performance on large tables, etc.).
   - Identify any design-to-code concerns early (e.g., complex animations, dynamic sizing).

2. **Iteration & Approval**
   - Round-trip feedback to Claude Design (if any adjustments needed).
   - Final sign-off on all screen states and components.

3. **Documentation Handoff**
   - Export component specs as Markdown for developer reference.
   - Create a "Design System" wiki page in GitHub.

---

## Part 2: Project Setup & Architecture (Weeks 3–4)

### 2.1 Repository Initialization

**GitHub Repository Structure**:
```
CacheCleanerApp/
├── README.md
├── .gitignore
├── LICENSE
├── Makefile                          # Common tasks (build, test, lint)
├── Sources/
│   ├── CacheCleanerApp/
│   │   ├── CacheCleanerApp.swift     # @main entry point
│   │   ├── AppDelegate.swift         # NSApplicationDelegate
│   │   └── SceneDelegate.swift       # Scene management
│   │
│   ├── CacheCleanerUI/               # UI package
│   │   ├── Views/
│   │   │   ├── RootView.swift        # Main window coordinator
│   │   │   ├── DashboardView.swift
│   │   │   ├── ScanProgressView.swift
│   │   │   ├── ScanResultsView.swift
│   │   │   ├── SettingsView.swift
│   │   │   ├── Components/
│   │   │   │   ├── SummaryCardView.swift
│   │   │   │   ├── CategoryFilterButton.swift
│   │   │   │   ├── ResultsTableView.swift
│   │   │   │   ├── ConfirmationDialog.swift
│   │   │   │   └── CustomComponents.swift (buttons, inputs, badges)
│   │   │   └── Modals/
│   │   │       ├── ScanProgressModal.swift
│   │   │       ├── ExclusionRulesModal.swift
│   │   │       └── PasswordDialog.swift
│   │   │
│   │   ├── ViewModels/
│   │   │   ├── DashboardViewModel.swift
│   │   │   ├── ScanViewModel.swift
│   │   │   ├── ResultsViewModel.swift
│   │   │   └── SettingsViewModel.swift
│   │   │
│   │   ├── Styling/
│   │   │   ├── DesignTokens.swift    # Colors, fonts, spacing
│   │   │   ├── Theme.swift           # Light/dark mode logic
│   │   │   └── Modifiers.swift       # Custom SwiftUI modifiers
│   │   │
│   │   └── Package.swift
│   │
│   ├── CacheScanner/                 # Scanning logic package
│   │   ├── Public/
│   │   │   ├── CacheScanner.swift    # Public API
│   │   │   └── CacheEntry.swift
│   │   ├── Internal/
│   │   │   ├── CacheLocation.swift
│   │   │   ├── ParallelFileEnumerator.swift
│   │   │   ├── CacheAnalyzer.swift
│   │   │   └── CacheCategory.swift
│   │   ├── Models/
│   │   │   ├── CacheEntry.swift
│   │   │   ├── ScanResult.swift
│   │   │   └── Progress.swift
│   │   └── Package.swift
│   │
│   ├── CleanupEngine/                # Deletion & safety package
│   │   ├── Public/
│   │   │   └── CleanupManager.swift
│   │   ├── Internal/
│   │   │   ├── SafetyValidator.swift
│   │   │   ├── RollbackManager.swift
│   │   │   ├── PermissionHandler.swift
│   │   │   └── TrashManager.swift
│   │   └── Package.swift
│   │
│   └── DataPersistence/              # Storage package
│       ├── Models/
│       │   ├── ScanRecord+CoreData.swift
│       │   ├── CleanupHistory+CoreData.swift
│       │   └── UserPreferences.swift
│       ├── Repositories/
│       │   ├── ScanHistoryRepository.swift
│       │   ├── PreferenceRepository.swift
│       │   └── StatisticsRepository.swift
│       ├── CoreData/
│       │   ├── CoreDataStack.swift
│       │   ├── CacheCleanerModel.xcdatamodeld/
│       │   └── Migration.swift
│       └── Package.swift
│
├── Tests/
│   ├── CacheScannerTests/
│   │   ├── CacheScannerTests.swift
│   │   ├── CacheAnalyzerTests.swift
│   │   ├── CacheCategoryTests.swift
│   │   └── Fixtures/
│   │       └── MockFileSystem.swift
│   │
│   ├── CleanupEngineTests/
│   │   ├── SafetyValidatorTests.swift
│   │   ├── RollbackManagerTests.swift
│   │   └── PermissionHandlerTests.swift
│   │
│   ├── DataPersistenceTests/
│   │   ├── CoreDataStackTests.swift
│   │   └── RepositoryTests.swift
│   │
│   └── UITests/
│       ├── DashboardUITests.swift
│       ├── ScanFlowUITests.swift
│       └── ResultsUITests.swift
│
├── Assets/
│   ├── DesignTokens/
│   │   ├── tokens.json               # Exported from Figma
│   │   └── tokens.swift              # Converted to Swift constants
│   │
│   ├── Figma/
│   │   └── CacheCleanerDesign.figma.link  # Figma file URL
│   │
│   ├── Media/
│   │   ├── AppIcon.appiconset/
│   │   └── Localizable.strings       # i18n strings
│   │
│   └── Configuration/
│       ├── Info.plist
│       ├── Entitlements.plist
│       └── Build.xcconfig
│
├── .github/
│   └── workflows/
│       ├── test.yml                  # Run tests on PR
│       ├── lint.yml                  # PHPStan, SwiftLint
│       ├── build.yml                 # Build release
│       └── notarize.yml              # macOS notarization
│
├── Documentation/
│   ├── ARCHITECTURE.md               # System design overview
│   ├── DESIGN_SYSTEM.md              # UI components & tokens
│   ├── CONTRIBUTING.md
│   ├── SETUP.md                      # Dev environment setup
│   └── DEPLOYMENT.md                 # Release & distribution process
│
└── Package.swift                     # Root package manifest
```

### 2.2 Swift Package Setup

**Root Package.swift**:
```swift
// swift-tools-version:5.9
import PackageDescription

let package = Package(
  name: "CacheCleanerApp",
  platforms: [.macOS(.v12)],
  products: [
    .executable(name: "CacheCleaner", targets: ["CacheCleanerApp"]),
    .library(name: "CacheCleanerUI", targets: ["CacheCleanerUI"]),
    .library(name: "CacheScanner", targets: ["CacheScanner"]),
    .library(name: "CleanupEngine", targets: ["CleanupEngine"]),
    .library(name: "DataPersistence", targets: ["DataPersistence"]),
  ],
  dependencies: [
    .package(url: "https://github.com/apple/swift-async-algorithms.git", from: "1.0.0"),
  ],
  targets: [
    .executableTarget(
      name: "CacheCleanerApp",
      dependencies: [
        "CacheCleanerUI",
        "CacheScanner",
        "CleanupEngine",
        "DataPersistence",
      ]
    ),
    .target(name: "CacheCleanerUI", dependencies: ["DataPersistence"]),
    .target(name: "CacheScanner"),
    .target(name: "CleanupEngine", dependencies: ["CacheScanner"]),
    .target(name: "DataPersistence"),
    // Tests...
    .testTarget(name: "CacheScannerTests", dependencies: ["CacheScanner"]),
    .testTarget(name: "CleanupEngineTests", dependencies: ["CleanupEngine"]),
    .testTarget(name: "DataPersistenceTests", dependencies: ["DataPersistence"]),
    .testTarget(name: "UITests", dependencies: ["CacheCleanerUI"]),
  ]
)
```

### 2.3 Design Tokens Implementation (Week 3)

**Create `Assets/DesignTokens/tokens.swift`**:
```swift
// MARK: - Design Tokens (Auto-generated from Figma)

import SwiftUI

// MARK: Color Tokens

enum AppColor {
  // Light Mode
  enum Light {
    static let primary = Color(red: 0.96, green: 0.96, blue: 0.96)      // #F5F5F5
    static let secondary = Color.white
    static let tertiary = Color(red: 0.97, green: 0.97, blue: 0.97)     // #F7F7F7
    
    static let accentTeal = Color(red: 0.0, green: 0.627, blue: 0.627)  // #00A0A0
    static let accentRed = Color(red: 0.862, green: 0.208, blue: 0.271) // #DC3545
    static let accentGreen = Color(red: 0.0, green: 0.784, blue: 0.322) // #00C853
    static let accentAmber = Color(red: 0.961, green: 0.62, blue: 0.141) // #F59E23
    
    static let textPrimary = Color.black
    static let textSecondary = Color(red: 0.369, green: 0.369, blue: 0.376) // #5E5E62
    static let textTertiary = Color(red: 0.549, green: 0.549, blue: 0.557)  // #8C8C90
  }
  
  // Dark Mode
  enum Dark {
    static let primary = Color(red: 0.11, green: 0.11, blue: 0.12)       // #1C1C1E
    static let secondary = Color(red: 0.173, green: 0.173, blue: 0.18)   // #2C2C2E
    static let tertiary = Color(red: 0.227, green: 0.227, blue: 0.235)   // #3A3A3C
    
    static let accentTeal = Color(red: 0.196, green: 0.831, blue: 0.878) // #32D4E0
    static let accentRed = Color(red: 1.0, green: 0.333, blue: 0.333)    // #FF5555
    static let accentGreen = Color(red: 0.204, green: 0.784, blue: 0.345) // #34C759
    static let accentAmber = Color(red: 1.0, green: 0.647, blue: 0.141)  // #FFA523
    
    static let textPrimary = Color(red: 0.961, green: 0.961, blue: 0.961) // #F5F5F5
    static let textSecondary = Color(red: 0.631, green: 0.631, blue: 0.651) // #A1A1A6
    static let textTertiary = Color(red: 0.557, green: 0.557, blue: 0.576)  // #8E8E93
  }
}

// MARK: Typography Tokens

enum AppTypography {
  enum FontSize {
    static let titleLarge: CGFloat = 28
    static let titleMedium: CGFloat = 18
    static let titleSmall: CGFloat = 14
    static let body: CGFloat = 13
    static let caption: CGFloat = 12
    static let monospace: CGFloat = 11
  }
  
  enum FontWeight {
    static let regular = Font.Weight.regular
    static let medium = Font.Weight.medium
    static let semibold = Font.Weight.semibold
  }
}

// MARK: Spacing Tokens

enum AppSpacing {
  static let xs: CGFloat = 4
  static let sm: CGFloat = 8
  static let md: CGFloat = 16
  static let lg: CGFloat = 24
  static let xl: CGFloat = 32
}

// MARK: Corner Radius Tokens

enum AppRadius {
  static let small: CGFloat = 6
  static let medium: CGFloat = 8
  static let large: CGFloat = 12
  static let full: CGFloat = 9999
}

// MARK: Theme Resolver (Respects System Appearance)

@available(macOS 12, *)
struct Theme {
  static func color(_ lightMode: Color, _ darkMode: Color) -> Color {
    // On macOS, use @Environment(\.colorScheme) in Views
    lightMode
  }
  
  static var primaryBackground: Color {
    #if DEBUG
    AppColor.Light.primary
    #else
    AppColor.Light.primary
    #endif
  }
}

// MARK: Convenience Initializers (Used in SwiftUI Views)

extension Color {
  static var appPrimaryBackground: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark:
        return NSColor(AppColor.Dark.primary)
      default:
        return NSColor(AppColor.Light.primary)
      }
    })
  }
  
  static var appAccentTeal: Color {
    Color(NSColor { appearance in
      switch appearance.name {
      case .darkAqua, .vibrantDark:
        return NSColor(AppColor.Dark.accentTeal)
      default:
        return NSColor(AppColor.Light.accentTeal)
      }
    })
  }
  
  // ... (repeat for all colors)
}
```

### 2.4 SwiftUI Theme Modifiers

**Create `Sources/CacheCleanerUI/Styling/Modifiers.swift`**:
```swift
import SwiftUI

// MARK: Custom Button Modifiers

struct PrimaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(.white)
      .frame(height: 44)
      .frame(maxWidth: .infinity)
      .background(Color.appAccentTeal)
      .cornerRadius(AppRadius.medium)
      .opacity(configuration.isPressed ? 0.8 : 1.0)
      .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
  }
}

struct DestructiveButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(.white)
      .frame(height: 44)
      .frame(maxWidth: .infinity)
      .background(Color.appAccentRed)
      .cornerRadius(AppRadius.medium)
      .opacity(configuration.isPressed ? 0.8 : 1.0)
  }
}

struct SecondaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: AppTypography.FontSize.body, weight: .medium))
      .foregroundColor(Color.appTextPrimary)
      .frame(height: 36)
      .frame(maxWidth: .infinity)
      .background(Color.appSecondaryBackground)
      .cornerRadius(AppRadius.small)
      .border(Color.appBorderTertiary, width: 0.5)
      .opacity(configuration.isPressed ? 0.7 : 1.0)
  }
}

// MARK: Custom Text Field Modifiers

struct InputFieldStyle: TextFieldStyle {
  func _body(configuration: TextField<Self.Label>) -> some View {
    configuration
      .font(.system(size: AppTypography.FontSize.body, weight: .regular))
      .padding(.horizontal, AppSpacing.md)
      .padding(.vertical, AppSpacing.sm)
      .background(Color.appSecondaryBackground)
      .border(Color.appBorderTertiary, width: 0.5)
      .cornerRadius(AppRadius.medium)
  }
}

// MARK: Shadow & Depth Modifiers

struct CardShadow: ViewModifier {
  func body(content: Content) -> some View {
    content
      .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 2)
  }
}

extension View {
  func cardShadow() -> some View {
    modifier(CardShadow())
  }
}

// MARK: Animation Modifiers

extension View {
  func fadeTransition() -> some View {
    self.transition(.opacity)
      .animation(.easeInOut(duration: 0.2), value: UUID())
  }
}
```

**Deliverables by End of Week 4**:
- ✅ GitHub repository initialized with package structure.
- ✅ `tokens.swift` with all design tokens from Figma.
- ✅ Custom SwiftUI modifiers for consistent styling.
- ✅ Theme resolver supporting light/dark mode.
- ✅ Makefile with common tasks (build, test, clean).
- ✅ CI/CD workflows skeleton (GitHub Actions YAML files).

---

## Part 3: Core Data Model & Persistence (Weeks 5–6)

### 3.1 Core Data Schema

**Create `Sources/DataPersistence/CoreData/CacheCleanerModel.xcdatamodeld`**:

**Entities**:

1. **ScanRecord**
   - Attributes:
     - `id` (UUID)
     - `timestamp` (Date)
     - `totalSize` (Int64)
     - `filesCount` (Int32)
     - `cacheEntries` (relationship to CacheEntry, delete cascade)
     - `status` (String: "completed", "cancelled", "error")
   - Indexes: `timestamp` (for sorting)

2. **CacheEntry**
   - Attributes:
     - `id` (UUID)
     - `path` (String)
     - `size` (Int64)
     - `category` (String: "browser", "system", "temp", "app", "xcode")
     - `safetyLevel` (String: "safe", "caution", "dangerous")
     - `lastModified` (Date)
     - `appName` (String, optional)
     - `excluded` (Boolean, default false)
     - `scanRecord` (relationship to ScanRecord)
   - Indexes: `category`, `safetyLevel`, `path` (for filtering & search)

3. **CleanupHistory**
   - Attributes:
     - `id` (UUID)
     - `timestamp` (Date)
     - `filesDeleted` (Int32)
     - `sizeFreed` (Int64)
     - `entries` (relationship to DeletedCacheEntry, delete cascade)
     - `status` (String: "success", "partial", "failed")
   - Indexes: `timestamp`

4. **DeletedCacheEntry**
   - Attributes:
     - `id` (UUID)
     - `path` (String)
     - `size` (Int64)
     - `deletedAt` (Date)
     - `cleanupHistory` (relationship to CleanupHistory)
   - Purpose: Allow undo/rollback (restore from trash within 30 days).

5. **ExclusionRule**
   - Attributes:
     - `id` (UUID)
     - `pattern` (String, e.g., "*.tmp", "/path/to/exclude/*")
     - `enabled` (Boolean)
     - `createdAt` (Date)
   - Indexes: `enabled` (for efficient filtering)

6. **UserPreferences** (lightweight, could use UserDefaults instead)
   - Attributes:
     - `launchAtStartup` (Boolean)
     - `showMenuBar` (Boolean)
     - `minimumFileAge` (Int32, days)
     - `defaultDeleteMethod` (String: "trash", "secure_erase")
     - `enableAutoCleanup` (Boolean)
     - `autoCleanupSchedule` (String: cron-like, "0 9 MON")

### 3.2 Core Data Stack Implementation

**Create `Sources/DataPersistence/CoreData/CoreDataStack.swift`**:
```swift
import CoreData
import Foundation

@available(macOS 12, *)
class CoreDataStack: NSObject, ObservableObject {
  static let shared = CoreDataStack()
  
  @Published var isLoading = false
  
  private(set) lazy var persistentContainer: NSPersistentContainer = {
    let container = NSPersistentContainer(name: "CacheCleanerModel")
    
    let storeURL = FileManager.default
      .urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("CacheCleaner")
    
    let description = NSPersistentStoreDescription(url: storeURL)
    description.shouldMigrateStoreAutomatically = true
    description.shouldInferMappingModelAutomatically = true
    
    container.persistentStoreDescriptions = [description]
    container.loadPersistentStores { _, error in
      if let error = error {
        fatalError("Core Data initialization failed: \(error)")
      }
    }
    
    container.viewContext.automaticallyMergesChangesFromParent = true
    return container
  }()
  
  var viewContext: NSManagedObjectContext {
    persistentContainer.viewContext
  }
  
  func save() throws {
    guard viewContext.hasChanges else { return }
    try viewContext.save()
  }
  
  func createBackgroundContext() -> NSManagedObjectContext {
    persistentContainer.newBackgroundContext()
  }
}
```

### 3.3 Repository Implementations

**Create `Sources/DataPersistence/Repositories/ScanHistoryRepository.swift`**:
```swift
import CoreData
import Foundation

protocol ScanHistoryRepositoryProtocol {
  func save(scan: ScanRecord) async throws
  func fetchRecentScans(limit: Int) async throws -> [ScanRecord]
  func deleteScan(id: UUID) async throws
  func fetchScanDetails(id: UUID) async throws -> ScanRecord?
}

@available(macOS 12, *)
class ScanHistoryRepository: ScanHistoryRepositoryProtocol {
  private let coreDataStack: CoreDataStack
  
  init(coreDataStack: CoreDataStack = .shared) {
    self.coreDataStack = coreDataStack
  }
  
  func save(scan: ScanRecord) async throws {
    let context = coreDataStack.createBackgroundContext()
    try await context.perform {
      let entity = ScanRecordEntity(context: context)
      entity.id = scan.id
      entity.timestamp = scan.timestamp
      entity.totalSize = scan.totalSize
      entity.filesCount = Int32(scan.filesCount)
      entity.status = scan.status.rawValue
      // ... map entries
      try context.save()
    }
  }
  
  func fetchRecentScans(limit: Int) async throws -> [ScanRecord] {
    let context = coreDataStack.createBackgroundContext()
    return try await context.perform {
      let request = NSFetchRequest<ScanRecordEntity>(entityName: "ScanRecord")
      request.sortDescriptors = [NSSortDescriptor(key: "timestamp", ascending: false)]
      request.fetchLimit = limit
      let results = try context.fetch(request)
      return results.map { ScanRecord(from: $0) }
    }
  }
  
  func deleteScan(id: UUID) async throws {
    let context = coreDataStack.createBackgroundContext()
    try await context.perform {
      let request = NSFetchRequest<ScanRecordEntity>(entityName: "ScanRecord")
      request.predicate = NSPredicate(format: "id == %@", id as CVarArg)
      if let entity = try context.fetch(request).first {
        context.delete(entity)
        try context.save()
      }
    }
  }
  
  func fetchScanDetails(id: UUID) async throws -> ScanRecord? {
    let context = coreDataStack.createBackgroundContext()
    return try await context.perform {
      let request = NSFetchRequest<ScanRecordEntity>(entityName: "ScanRecord")
      request.predicate = NSPredicate(format: "id == %@", id as CVarArg)
      return try context.fetch(request).first.map { ScanRecord(from: $0) }
    }
  }
}
```

**Create `Sources/DataPersistence/Repositories/PreferenceRepository.swift`**:
```swift
import Foundation

protocol PreferenceRepositoryProtocol {
  func getPreferences() -> UserPreferences
  func savePreferences(_ prefs: UserPreferences) throws
}

class PreferenceRepository: PreferenceRepositoryProtocol {
  private let defaults = UserDefaults.standard
  
  private let launchAtStartupKey = "com.cacheCleaner.launchAtStartup"
  private let showMenuBarKey = "com.cacheCleaner.showMenuBar"
  private let minimumFileAgeKey = "com.cacheCleaner.minimumFileAge"
  private let deleteMethodKey = "com.cacheCleaner.deleteMethod"
  
  func getPreferences() -> UserPreferences {
    UserPreferences(
      launchAtStartup: defaults.bool(forKey: launchAtStartupKey),
      showMenuBar: defaults.bool(forKey: showMenuBarKey),
      minimumFileAge: defaults.integer(forKey: minimumFileAgeKey),
      defaultDeleteMethod: defaults.string(forKey: deleteMethodKey) ?? "trash"
    )
  }
  
  func savePreferences(_ prefs: UserPreferences) throws {
    defaults.set(prefs.launchAtStartup, forKey: launchAtStartupKey)
    defaults.set(prefs.showMenuBar, forKey: showMenuBarKey)
    defaults.set(prefs.minimumFileAge, forKey: minimumFileAgeKey)
    defaults.set(prefs.defaultDeleteMethod, forKey: deleteMethodKey)
  }
}
```

**Deliverables by End of Week 6**:
- ✅ Core Data model (`.xcdatamodeld` file).
- ✅ All entity definitions and migrations.
- ✅ Repository implementations (ScanHistoryRepository, PreferenceRepository, etc.).
- ✅ Unit tests for repositories (100% CRUD coverage).
- ✅ Documentation on data models (ARCHITECTURE.md).

---

## Part 4: Scanner & Cleanup Logic (Weeks 7–9)

### 4.1 Cache Scanner Implementation

**Create `Sources/CacheScanner/CacheScanner.swift`**:
```swift
import Foundation

@available(macOS 12, *)
actor CacheScanner {
  enum ScanError: LocalizedError {
    case accessDenied(String)
    case enumerationFailed(String)
  }
  
  private let fileManager = FileManager.default
  private let analyzer = CacheAnalyzer()
  private var discoveredCaches: [CacheEntry] = []
  
  nonisolated let cacheLocations = [
    CacheLocation(path: "~/Library/Safari/", category: .browser, priority: 1),
    CacheLocation(path: "~/.cache/google-chrome/", category: .browser, priority: 1),
    CacheLocation(path: "~/Library/Caches/", category: .system, priority: 2),
    CacheLocation(path: "/var/tmp/", category: .temp, priority: 3),
    CacheLocation(path: "~/Library/Application Support/", category: .app, priority: 2),
    CacheLocation(path: "~/Library/Developer/Xcode/DerivedData/", category: .xcode, priority: 1),
    CacheLocation(path: "~/.Trash/", category: .temp, priority: 1),
  ]
  
  func scanAsync(
    progressHandler: @escaping (ScanProgress) -> Void
  ) async throws -> [CacheEntry] {
    discoveredCaches.removeAll()
    
    try await withTaskGroup(of: [CacheEntry].self) { [self] group in
      for location in cacheLocations {
        group.addTask {
          do {
            let entries = try await self.enumerateDirectory(
              location,
              progressHandler: progressHandler
            )
            return entries
          } catch {
            progressHandler(.error(location.category, error))
            return []
          }
        }
      }
      
      for try await entries in group {
        self.discoveredCaches.append(contentsOf: entries)
        progressHandler(.progress(self.discoveredCaches.count, self.totalSize))
      }
    }
    
    return discoveredCaches
  }
  
  private func enumerateDirectory(
    _ location: CacheLocation,
    progressHandler: @escaping (ScanProgress) -> Void
  ) async throws -> [CacheEntry] {
    guard let path = location.expandedPath else {
      throw ScanError.accessDenied(location.path)
    }
    
    var entries: [CacheEntry] = []
    let enumerator = ParallelFileEnumerator(path: path)
    
    for try await fileInfo in enumerator.enumerate() {
      let entry = CacheEntry(
        path: fileInfo.path,
        size: fileInfo.size,
        category: location.category,
        safetyLevel: analyzer.analyzeSafety(path: fileInfo.path),
        lastModified: fileInfo.modificationDate,
        appName: analyzer.detectApp(path: fileInfo.path)
      )
      entries.append(entry)
      
      // Yield progress every 50 files
      if entries.count % 50 == 0 {
        progressHandler(.categoryProgress(location.category, entries.count))
      }
    }
    
    return entries
  }
  
  var totalSize: Int64 {
    discoveredCaches.reduce(0) { $0 + $1.size }
  }
}

// MARK: - Progress Reporting

enum ScanProgress: Sendable {
  case started
  case categoryProgress(CacheCategory, Int)
  case progress(Int, Int64)
  case completed([CacheEntry])
  case error(CacheCategory, Error)
}
```

### 4.2 Parallel File Enumerator

**Create `Sources/CacheScanner/Internal/ParallelFileEnumerator.swift`**:
```swift
import Foundation

actor ParallelFileEnumerator {
  struct FileInfo: Sendable {
    let path: String
    let size: Int64
    let modificationDate: Date
    let isDirectory: Bool
  }
  
  private let rootPath: String
  private let fileManager = FileManager.default
  private let queue = DispatchQueue(label: "com.cacheCleaner.fileEnumerator", attributes: .concurrent)
  
  init(path: String) {
    self.rootPath = path
  }
  
  func enumerate() async throws -> AsyncSequence {
    return FileEnumerationSequence(rootPath: rootPath)
  }
}

struct FileEnumerationSequence: AsyncSequence {
  typealias Element = ParallelFileEnumerator.FileInfo
  
  let rootPath: String
  
  func makeAsyncIterator() -> FileEnumerationIterator {
    FileEnumerationIterator(rootPath: rootPath)
  }
}

struct FileEnumerationIterator: AsyncIterator {
  typealias Element = ParallelFileEnumerator.FileInfo
  
  private let fileManager = FileManager.default
  private let enumerator: FileManager.DirectoryEnumerator?
  
  init(rootPath: String) {
    self.enumerator = fileManager.enumerator(atPath: rootPath)
  }
  
  mutating func next() async throws -> ParallelFileEnumerator.FileInfo? {
    guard let enumerator = enumerator else { return nil }
    
    // Process files in batches for better concurrency
    while let file = enumerator.nextObject() as? String {
      let fullPath = (enumerator.fileAttributes?[.systemPath] as? String) ?? file
      
      guard let attributes = try? fileManager.attributesOfItem(atPath: fullPath) else {
        continue
      }
      
      let size = attributes[.size] as? Int64 ?? 0
      let modDate = attributes[.modificationDate] as? Date ?? Date()
      let isDir = attributes[.type] as? String == FileAttributeType.typeDirectory.rawValue
      
      return ParallelFileEnumerator.FileInfo(
        path: fullPath,
        size: size,
        modificationDate: modDate,
        isDirectory: isDir
      )
    }
    
    return nil
  }
}
```

### 4.3 Cache Analyzer

**Create `Sources/CacheScanner/Internal/CacheAnalyzer.swift`**:
```swift
import Foundation

struct CacheAnalyzer {
  private let safePatterns = [
    "\.cache",
    "\.tmp",
    "\.log",
    "Caches/",
    "Temporary Items/",
  ]
  
  private let dangerousPatterns = [
    "Library/Saved",
    "Library/Mail",
    "Library/Calendars",
    "Library/Contacts",
  ]
  
  func analyzeSafety(path: String) -> String {
    // Check dangerous patterns first
    for pattern in dangerousPatterns {
      if path.contains(pattern) {
        return "dangerous"
      }
    }
    
    // Check system daemon patterns
    if path.contains("com.apple.nsurlsessiond") || path.contains("system.") {
      return "caution"
    }
    
    return "safe"
  }
  
  func detectApp(path: String) -> String? {
    // Extract bundle name from path
    let components = path.components(separatedBy: "/")
    for component in components {
      if component.contains(".app") {
        return component
      }
    }
    return nil
  }
}
```

### 4.4 Cleanup Manager with Safety Validation

**Create `Sources/CleanupEngine/CleanupManager.swift`**:
```swift
import Foundation

@available(macOS 12, *)
class CleanupManager {
  enum CleanupError: LocalizedError {
    case validationFailed(String)
    case deletionFailed(String)
    case permissionDenied
  }
  
  private let fileManager = FileManager.default
  private let validator = SafetyValidator()
  private let permissionHandler = PermissionHandler()
  private let trashManager = TrashManager()
  
  func cleanup(
    entries: [CacheEntry],
    method: DeleteMethod = .trash,
    progressHandler: @escaping (CleanupProgress) -> Void
  ) async throws -> CleanupResult {
    // 1. Validate all entries
    try await validator.validateEntries(entries)
    
    // 2. Check permissions for protected paths
    let needsElevation = entries.contains { entry in
      entry.path.contains("/Library/") && !entry.path.contains(FileManager.default.homeDirectoryForCurrentUser.path)
    }
    
    if needsElevation {
      try await permissionHandler.requestElevation()
    }
    
    // 3. Delete entries
    var deleted = 0
    var failed = 0
    var totalFreed: Int64 = 0
    
    for entry in entries {
      do {
        switch method {
        case .trash:
          try trashManager.moveToTrash(path: entry.path)
        case .secure:
          try fileManager.removeItem(atPath: entry.path)
        }
        deleted += 1
        totalFreed += entry.size
        progressHandler(.deleted(deleted, totalFreed))
      } catch {
        failed += 1
        progressHandler(.error(entry.path, error))
      }
    }
    
    return CleanupResult(
      filesDeleted: deleted,
      filesFailed: failed,
      sizeFreed: totalFreed
    )
  }
}

enum DeleteMethod {
  case trash
  case secure
}

struct CleanupResult {
  let filesDeleted: Int
  let filesFailed: Int
  let sizeFreed: Int64
}

enum CleanupProgress {
  case deleted(Int, Int64)
  case error(String, Error)
  case completed(CleanupResult)
}
```

**Deliverables by End of Week 9**:
- ✅ `CacheScanner` with actor-based concurrency.
- ✅ `ParallelFileEnumerator` (async iterator).
- ✅ `CacheAnalyzer` for categorization and safety assessment.
- ✅ `CleanupManager` with safety validation.
- ✅ Integration tests scanning real file system (test directory).
- ✅ Performance benchmarks (target: scan 50k files in <5s).

---

## Part 5: SwiftUI Views & State Management (Weeks 10–12)

### 5.1 View Architecture

**Create `Sources/CacheCleanerUI/Views/RootView.swift`**:
```swift
import SwiftUI

@available(macOS 12, *)
struct RootView: View {
  @StateObject private var dashboardVM = DashboardViewModel()
  @State private var selectedTab: Tab = .dashboard
  
  enum Tab: String {
    case dashboard
    case results
    case settings
  }
  
  var body: some View {
    NavigationSplitView {
      SidebarView(selectedTab: $selectedTab)
    } detail: {
      ZStack {
        switch selectedTab {
        case .dashboard:
          DashboardView(viewModel: dashboardVM)
        case .results:
          ScanResultsView(viewModel: dashboardVM.resultsViewModel)
        case .settings:
          SettingsView()
        }
      }
      .animation(.easeInOut, value: selectedTab)
    }
    .frame(minWidth: 800, minHeight: 600)
  }
}

struct SidebarView: View {
  @Binding var selectedTab: RootView.Tab
  
  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      VStack(alignment: .leading, spacing: 8) {
        Text("Cache Cleaner")
          .font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold))
          .padding(.horizontal, AppSpacing.md)
          .padding(.vertical, AppSpacing.md)
      }
      .background(Color.appSecondaryBackground)
      
      Divider()
      
      NavigationLink(tag: .dashboard, selection: $selectedTab) {
        Label("Dashboard", systemImage: "house.fill")
      } label: {
        EmptyView()
      }
      
      NavigationLink(tag: .results, selection: $selectedTab) {
        Label("Scan Results", systemImage: "magnifyingglass")
      } label: {
        EmptyView()
      }
      
      NavigationLink(tag: .settings, selection: $selectedTab) {
        Label("Settings", systemImage: "gear")
      } label: {
        EmptyView()
      }
      
      Spacer()
    }
    .frame(width: 180)
  }
}
```

### 5.2 Dashboard ViewModel & View

**Create `Sources/CacheCleanerUI/ViewModels/DashboardViewModel.swift`**:
```swift
import SwiftUI
import Combine

@available(macOS 12, *)
@MainActor
class DashboardViewModel: ObservableObject {
  @Published var totalCacheSize: Int64 = 0
  @Published var filesCount: Int = 0
  @Published var estimatedRecoverable: Int64 = 0
  @Published var lastCleanupDate: Date?
  @Published var recentScans: [ScanRecord] = []
  @Published var isScanning: Bool = false
  @Published var scanProgress: ScanProgress = .started
  
  var resultsViewModel: ScanResultsViewModel {
    ScanResultsViewModel()
  }
  
  private let scanner: CacheScanner
  private let scanHistoryRepository: ScanHistoryRepositoryProtocol
  
  init(
    scanner: CacheScanner = CacheScanner(),
    scanHistoryRepository: ScanHistoryRepositoryProtocol = ScanHistoryRepository()
  ) {
    self.scanner = scanner
    self.scanHistoryRepository = scanHistoryRepository
    loadRecentScans()
  }
  
  func startScan() {
    isScanning = true
    Task {
      do {
        let entries = try await scanner.scanAsync { [weak self] progress in
          self?.handleProgress(progress)
        }
        
        let record = ScanRecord(
          entries: entries,
          totalSize: self.totalCacheSize,
          filesCount: self.filesCount
        )
        try await scanHistoryRepository.save(scan: record)
        
        isScanning = false
        loadRecentScans()
      } catch {
        print("Scan failed: \(error)")
        isScanning = false
      }
    }
  }
  
  private func handleProgress(_ progress: ScanProgress) {
    switch progress {
    case .progress(let files, let size):
      filesCount = files
      totalCacheSize = size
      estimatedRecoverable = Int64(Double(size) * 0.66) // Heuristic
    case .error:
      break
    default:
      break
    }
  }
  
  private func loadRecentScans() {
    Task {
      do {
        recentScans = try await scanHistoryRepository.fetchRecentScans(limit: 5)
      } catch {
        print("Failed to load scans: \(error)")
      }
    }
  }
}
```

**Create `Sources/CacheCleanerUI/Views/DashboardView.swift`**:
```swift
import SwiftUI

@available(macOS 12, *)
struct DashboardView: View {
  @ObservedObject var viewModel: DashboardViewModel
  @State private var showScanModal = false
  
  var body: some View {
    VStack(spacing: AppSpacing.lg) {
      // Summary Cards
      HStack(spacing: AppSpacing.md) {
        SummaryCardView(
          title: "Total Cache Found",
          value: formatBytes(viewModel.totalCacheSize),
          subtitle: "\(viewModel.filesCount) files",
          icon: "internaldrive.fill",
          color: .appAccentTeal
        )
        
        SummaryCardView(
          title: "Recoverable Space",
          value: formatBytes(viewModel.estimatedRecoverable),
          subtitle: "safe to remove",
          icon: "trash.fill",
          color: .appAccentGreen
        )
        
        SummaryCardView(
          title: "Last Cleanup",
          value: formatDate(viewModel.lastCleanupDate),
          subtitle: viewModel.lastCleanupDate != nil ? "Freed 2.1 GB" : "Never",
          icon: "checkmark.circle.fill",
          color: .appAccentTeal
        )
      }
      .padding(.horizontal, AppSpacing.md)
      .padding(.top, AppSpacing.md)
      
      // Action Button
      Button(action: { showScanModal = true }) {
        HStack {
          Image(systemName: "magnifyingglass.fill")
            .font(.system(size: 12))
          Text("Scan for Cache")
        }
      }
      .buttonStyle(PrimaryButtonStyle())
      .frame(width: 240)
      .disabled(viewModel.isScanning)
      .padding(.top, AppSpacing.md)
      
      // Recent Scans Table
      RecentScansTableView(scans: viewModel.recentScans)
        .padding(.horizontal, AppSpacing.md)
        .padding(.bottom, AppSpacing.md)
      
      Spacer()
    }
    .background(Color.appPrimaryBackground)
    .sheet(isPresented: $showScanModal) {
      ScanProgressView(
        viewModel: viewModel,
        isPresented: $showScanModal
      )
    }
  }
}

// MARK: - Summary Card Component

struct SummaryCardView: View {
  let title: String
  let value: String
  let subtitle: String
  let icon: String
  let color: Color
  
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.sm) {
      HStack {
        VStack(alignment: .leading, spacing: 4) {
          Text(title)
            .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
            .foregroundColor(.appTextSecondary)
          Text(value)
            .font(.system(size: 20, weight: .semibold))
            .foregroundColor(.appTextPrimary)
          Text(subtitle)
            .font(.system(size: AppTypography.FontSize.caption, weight: .regular))
            .foregroundColor(.appTextTertiary)
        }
        
        Spacer()
        
        Image(systemName: icon)
          .font(.system(size: 24))
          .foregroundColor(color)
      }
      .padding(AppSpacing.md)
    }
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .cardShadow()
  }
}

// MARK: - Recent Scans Table

struct RecentScansTableView: View {
  let scans: [ScanRecord]
  
  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      Text("Recent Scans")
        .font(.system(size: AppTypography.FontSize.titleSmall, weight: .semibold))
        .padding(.horizontal, AppSpacing.md)
        .padding(.vertical, AppSpacing.sm)
      
      Divider()
      
      if scans.isEmpty {
        VStack(spacing: AppSpacing.md) {
          Image(systemName: "doc.text")
            .font(.system(size: 32))
            .foregroundColor(.appTextTertiary)
          Text("No scans yet")
            .font(.system(size: AppTypography.FontSize.body, weight: .regular))
            .foregroundColor(.appTextSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(AppSpacing.lg)
      } else {
        ScrollView {
          VStack(spacing: 0) {
            ForEach(Array(scans.enumerated()), id: \.element.id) { index, scan in
              ScanRowView(scan: scan)
              if index < scans.count - 1 {
                Divider()
                  .padding(.horizontal, AppSpacing.md)
              }
            }
          }
        }
      }
    }
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
    .cardShadow()
  }
}

struct ScanRowView: View {
  let scan: ScanRecord
  
  var body: some View {
    HStack(spacing: AppSpacing.md) {
      VStack(alignment: .leading, spacing: 4) {
        Text(formatDate(scan.timestamp))
          .font(.system(size: AppTypography.FontSize.body, weight: .medium))
          .foregroundColor(.appTextPrimary)
        Text("\(scan.filesCount) files scanned")
          .font(.system(size: AppTypography.FontSize.caption, weight: .regular))
          .foregroundColor(.appTextSecondary)
      }
      
      Spacer()
      
      VStack(alignment: .trailing, spacing: 4) {
        Text(formatBytes(scan.totalSize))
          .font(.system(size: AppTypography.FontSize.body, weight: .semibold))
          .foregroundColor(.appAccentTeal)
        Text("View Details")
          .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
          .foregroundColor(.appAccentTeal)
      }
    }
    .padding(AppSpacing.md)
  }
}

// MARK: - Utility Functions

private func formatBytes(_ bytes: Int64) -> String {
  let formatter = ByteCountFormatter()
  formatter.allowedUnits = [.useGB, .useMB, .useKB]
  formatter.countStyle = .decimal
  return formatter.string(fromByteCount: bytes)
}

private func formatDate(_ date: Date?) -> String {
  guard let date = date else { return "Never" }
  return date.formatted(date: .abbreviated, time: .shortened)
}
```

### 5.3 Scan Results ViewModel & View

**Create `Sources/CacheCleanerUI/ViewModels/ScanResultsViewModel.swift`**:
```swift
import SwiftUI
import Combine

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
  
  private let cleanupManager = CleanupManager()
  private let cleanupRepository: CleanupHistoryRepositoryProtocol
  
  init(
    cleanupRepository: CleanupHistoryRepositoryProtocol = CleanupHistoryRepository()
  ) {
    self.cleanupRepository = cleanupRepository
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
      filtered = filtered.filter { entry in
        entry.path.localizedCaseInsensitiveContains(searchText)
      }
    }
    
    filteredEntries = filtered.sorted { $0.size > $1.size }
  }
  
  func toggleSelection(_ entryID: UUID) {
    if selectedEntries.contains(entryID) {
      selectedEntries.remove(entryID)
    } else {
      selectedEntries.insert(entryID)
    }
  }
  
  func selectAll() {
    selectedEntries = Set(filteredEntries.map { $0.id })
  }
  
  func clearSelection() {
    selectedEntries.removeAll()
  }
  
  func deleteSelected() {
    let entriesToDelete = filteredEntries.filter { selectedEntries.contains($0.id) }
    showConfirmation = true
    
    Task {
      do {
        isDeleting = true
        let result = try await cleanupManager.cleanup(entries: entriesToDelete) { _ in }
        
        let history = CleanupHistory(result: result)
        try await cleanupRepository.save(cleanup: history)
        
        // Remove deleted entries from display
        allEntries.removeAll { entriesToDelete.contains { $0.id == $0.id } }
        applyFilters()
        clearSelection()
        
        isDeleting = false
      } catch {
        print("Cleanup failed: \(error)")
        isDeleting = false
      }
    }
  }
}
```

**Create `Sources/CacheCleanerUI/Views/ScanResultsView.swift`**:
```swift
import SwiftUI

@available(macOS 12, *)
struct ScanResultsView: View {
  @ObservedObject var viewModel: ScanResultsViewModel
  
  var body: some View {
    VStack(spacing: 0) {
      // Header with filters
      VStack(spacing: AppSpacing.md) {
        HStack {
          TextField("Search results...", text: $viewModel.searchText)
            .textFieldStyle(InputFieldStyle())
            .onChange(of: viewModel.searchText) { _ in
              viewModel.applyFilters()
            }
          
          Button(action: { }) {
            Text("Exclude Pattern…")
          }
          .buttonStyle(SecondaryButtonStyle())
        }
        
        // Category filters
        HStack(spacing: AppSpacing.sm) {
          ForEach(CacheCategory.allCases, id: \.self) { category in
            Button(action: {
              viewModel.selectedCategory = viewModel.selectedCategory == category ? nil : category
              viewModel.applyFilters()
            }) {
              Text(category.rawValue.capitalized)
            }
            .buttonStyle(
              viewModel.selectedCategory == category ?
              PrimaryButtonStyle() : SecondaryButtonStyle()
            )
          }
          Spacer()
        }
      }
      .padding(AppSpacing.md)
      .background(Color.appSecondaryBackground)
      
      Divider()
      
      // Results table
      ResultsTableView(
        entries: viewModel.filteredEntries,
        selectedEntries: $viewModel.selectedEntries,
        onToggleSelection: viewModel.toggleSelection
      )
      .padding(AppSpacing.md)
      
      Divider()
      
      // Bottom action bar
      VStack(spacing: AppSpacing.md) {
        HStack {
          Text("Selected: \(viewModel.selectedEntries.count) files")
            .font(.system(size: AppTypography.FontSize.body, weight: .medium))
            .foregroundColor(.appAccentTeal)
          
          Button(action: viewModel.clearSelection) {
            Text("Clear Selection")
          }
          .buttonStyle(SecondaryButtonStyle())
          
          Spacer()
        }
        
        HStack(spacing: AppSpacing.md) {
          Button(action: { }) {
            HStack {
              Image(systemName: "gear")
              Text("Advanced Options")
            }
          }
          .buttonStyle(SecondaryButtonStyle())
          
          Spacer()
          
          Button(action: viewModel.deleteSelected) {
            HStack {
              Image(systemName: "trash.fill")
              Text("Delete Selected")
            }
          }
          .buttonStyle(DestructiveButtonStyle())
          .disabled(viewModel.selectedEntries.isEmpty || viewModel.isDeleting)
        }
      }
      .padding(AppSpacing.md)
      .background(Color.appSecondaryBackground)
    }
    .background(Color.appPrimaryBackground)
    .confirmationDialog(
      "Confirm Deletion",
      isPresented: $viewModel.showConfirmation,
      actions: {
        Button("Delete", role: .destructive, action: viewModel.deleteSelected)
        Button("Cancel", role: .cancel) { }
      },
      message: {
        let totalSize = viewModel.filteredEntries
          .filter { viewModel.selectedEntries.contains($0.id) }
          .reduce(0) { $0 + $1.size }
        Text("Ready to delete \(viewModel.selectedEntries.count) files?\nThis will free \(formatBytes(totalSize)) of space.")
      }
    )
  }
}

struct ResultsTableView: View {
  let entries: [CacheEntry]
  @Binding var selectedEntries: Set<UUID>
  let onToggleSelection: (UUID) -> Void
  
  var body: some View {
    Table(entries, selection: $selectedEntries) {
      TableColumn("Type") { entry in
        Image(systemName: fileTypeIcon(entry.path))
          .font(.system(size: 14))
      }
      .width(40)
      
      TableColumn("Path") { entry in
        VStack(alignment: .leading, spacing: 2) {
          Text(entry.path)
            .font(.system(size: AppTypography.FontSize.body, weight: .regular, design: .monospaced))
            .lineLimit(1)
          Text(entry.appName ?? "")
            .font(.system(size: AppTypography.FontSize.caption, weight: .regular))
            .foregroundColor(.appTextSecondary)
        }
      }
      
      TableColumn("Size", value: \.size) { size in
        Text(formatBytes(size))
          .font(.system(size: AppTypography.FontSize.body, weight: .regular, design: .monospaced))
      }
      .width(100)
      
      TableColumn("Last Modified") { entry in
        Text(entry.lastModified.formatted(date: .abbreviated, time: .omitted))
          .font(.system(size: AppTypography.FontSize.body, weight: .regular))
      }
      .width(140)
      
      TableColumn("Safety") { entry in
        SafetyBadgeView(level: entry.safetyLevel)
      }
      .width(100)
    }
  }
}

struct SafetyBadgeView: View {
  let level: SafetyLevel
  
  var body: some View {
    HStack(spacing: 4) {
      Image(systemName: badgeIcon)
        .font(.system(size: 10, weight: .semibold))
      Text(level.rawValue.capitalized)
        .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
    }
    .padding(.horizontal, AppSpacing.sm)
    .padding(.vertical, 4)
    .background(badgeColor.opacity(0.2))
    .foregroundColor(badgeColor)
    .cornerRadius(AppRadius.small)
  }
  
  var badgeColor: Color {
    switch level {
    case .safe:
      return .appAccentGreen
    case .caution:
      return .appAccentAmber
    case .dangerous:
      return .appAccentRed
    }
  }
  
  var badgeIcon: String {
    switch level {
    case .safe:
      return "checkmark.circle.fill"
    case .caution:
      return "exclamationmark.circle.fill"
    case .dangerous:
      return "xmark.circle.fill"
    }
  }
}

private func fileTypeIcon(_ path: String) -> String {
  let ext = (path as NSString).pathExtension.lowercased()
  switch ext {
  case "app":
    return "app.fill"
  case "log":
    return "doc.text.fill"
  case "tmp", "temp":
    return "folder.fill"
  default:
    return "doc.fill"
  }
}

private func formatBytes(_ bytes: Int64) -> String {
  let formatter = ByteCountFormatter()
  formatter.allowedUnits = [.useGB, .useMB, .useKB]
  formatter.countStyle = .decimal
  return formatter.string(fromByteCount: bytes)
}
```

**Deliverables by End of Week 12**:
- ✅ All SwiftUI views (Dashboard, Results, Settings, Modals).
- ✅ ViewModels with proper state management.
- ✅ Custom component library (buttons, inputs, badges, tables).
- ✅ Light/dark mode support throughout.
- ✅ Keyboard navigation & accessibility.
- ✅ UI tests for main flows (scan → results → delete).

---

## Part 6: Modals & Advanced Features (Weeks 13–14)

### 6.1 Scan Progress Modal

**Create `Sources/CacheCleanerUI/Views/Modals/ScanProgressView.swift`**:
```swift
import SwiftUI

@available(macOS 12, *)
struct ScanProgressView: View {
  @ObservedObject var viewModel: DashboardViewModel
  @Binding var isPresented: Bool
  @State private var scanStages: [ScanStage] = [
    ScanStage(category: .browser, completed: false),
    ScanStage(category: .system, completed: false),
    ScanStage(category: .temp, completed: false),
    ScanStage(category: .app, completed: false),
    ScanStage(category: .xcode, completed: false),
  ]
  
  var body: some View {
    VStack(spacing: AppSpacing.lg) {
      // Header
      VStack(alignment: .leading, spacing: AppSpacing.sm) {
        HStack {
          Text("Scanning System Cache")
            .font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold))
          Spacer()
          Button(action: { isPresented = false }) {
            Image(systemName: "xmark")
              .foregroundColor(.appTextSecondary)
          }
          .buttonStyle(PlainButtonStyle())
        }
        Text("Found Cache in:")
          .font(.system(size: AppTypography.FontSize.body, weight: .regular))
          .foregroundColor(.appTextSecondary)
      }
      
      // Progress stages
      VStack(alignment: .leading, spacing: AppSpacing.md) {
        ForEach(scanStages, id: \.category) { stage in
          HStack(spacing: AppSpacing.md) {
            if stage.completed {
              Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.appAccentGreen)
                .font(.system(size: 16))
            } else {
              ProgressView()
                .frame(width: 16, height: 16)
            }
            
            Text(stage.category.rawValue.capitalized)
              .font(.system(size: AppTypography.FontSize.body, weight: .regular))
              .foregroundColor(.appTextPrimary)
            
            Spacer()
          }
        }
      }
      
      // Stats
      VStack(spacing: AppSpacing.sm) {
        Divider()
        
        HStack(spacing: AppSpacing.lg) {
          VStack(alignment: .leading, spacing: 2) {
            Text("Files Found")
              .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
              .foregroundColor(.appTextSecondary)
            Text("\(viewModel.filesCount)")
              .font(.system(size: 18, weight: .semibold, design: .monospaced))
              .foregroundColor(.appTextPrimary)
          }
          
          VStack(alignment: .leading, spacing: 2) {
            Text("Size")
              .font(.system(size: AppTypography.FontSize.caption, weight: .medium))
              .foregroundColor(.appTextSecondary)
            Text(formatBytes(viewModel.totalCacheSize))
              .font(.system(size: 18, weight: .semibold, design: .monospaced))
              .foregroundColor(.appAccentTeal)
          }
          
          Spacer()
        }
      }
      
      // Cancel button
      HStack(spacing: AppSpacing.md) {
        Spacer()
        Button(action: { isPresented = false }) {
          Text("Cancel Scan")
            .frame(minWidth: 100)
        }
        .buttonStyle(SecondaryButtonStyle())
      }
    }
    .padding(AppSpacing.lg)
    .frame(width: 500)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
  }
}

struct ScanStage {
  let category: CacheCategory
  var completed: Bool
}

private func formatBytes(_ bytes: Int64) -> String {
  let formatter = ByteCountFormatter()
  formatter.allowedUnits = [.useGB, .useMB, .useKB]
  formatter.countStyle = .decimal
  return formatter.string(fromByteCount: bytes)
}
```

### 6.2 Confirmation Dialog

**Create `Sources/CacheCleanerUI/Views/Modals/ConfirmationDialog.swift`**:
```swift
import SwiftUI

@available(macOS 12, *)
struct ConfirmationDialogView: View {
  let title: String
  let message: String
  let primaryButtonText: String
  let primaryButtonColor: Color
  let secondaryButtonText: String = "Cancel"
  let onPrimary: () -> Void
  let onSecondary: () -> Void
  
  @State private var dontShowAgain = false
  
  var body: some View {
    VStack(spacing: AppSpacing.lg) {
      VStack(alignment: .leading, spacing: AppSpacing.md) {
        Image(systemName: "exclamationmark.triangle.fill")
          .font(.system(size: 32))
          .foregroundColor(.appAccentAmber)
        
        Text(title)
          .font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold))
          .foregroundColor(.appTextPrimary)
        
        Text(message)
          .font(.system(size: AppTypography.FontSize.body, weight: .regular))
          .foregroundColor(.appTextSecondary)
          .lineLimit(3)
      }
      
      VStack(spacing: AppSpacing.sm) {
        HStack {
          Toggle("Don't show this again", isOn: $dontShowAgain)
            .font(.system(size: AppTypography.FontSize.caption, weight: .regular))
        }
      }
      
      HStack(spacing: AppSpacing.md) {
        Button(action: onSecondary) {
          Text(secondaryButtonText)
            .frame(minWidth: 80)
        }
        .buttonStyle(SecondaryButtonStyle())
        
        Button(action: onPrimary) {
          Text(primaryButtonText)
            .frame(minWidth: 80)
        }
        .buttonStyle(DestructiveButtonStyle())
      }
    }
    .padding(AppSpacing.lg)
    .frame(width: 420)
    .background(Color.appSecondaryBackground)
    .cornerRadius(AppRadius.large)
  }
}
```

### 6.3 Settings View

**Create `Sources/CacheCleanerUI/Views/SettingsView.swift`**:
```swift
import SwiftUI

@available(macOS 12, *)
struct SettingsView: View {
  @StateObject private var viewModel = SettingsViewModel()
  @State private var selectedTab: SettingsTab = .general
  
  enum SettingsTab: String {
    case general = "General"
    case privacy = "Privacy"
    case notifications = "Notifications"
    case scheduling = "Scheduling"
    case advanced = "Advanced"
  }
  
  var body: some View {
    HStack(spacing: 0) {
      // Sidebar
      VStack(alignment: .leading, spacing: 0) {
        Text("SETTINGS")
          .font(.system(size: AppTypography.FontSize.caption, weight: .semibold))
          .foregroundColor(.appTextSecondary)
          .padding(AppSpacing.md)
        
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
          ForEach(SettingsTab.allCases, id: \.rawValue) { tab in
            Button(action: { selectedTab = tab }) {
              HStack {
                Image(systemName: tabIcon(tab))
                  .frame(width: 16)
                Text(tab.rawValue)
                Spacer()
              }
              .padding(AppSpacing.sm)
              .contentShape(Rectangle())
            }
            .buttonStyle(PlainButtonStyle())
            .background(selectedTab == tab ? Color.appAccentTeal.opacity(0.1) : Color.clear)
            .cornerRadius(AppRadius.small)
          }
        }
        .padding(AppSpacing.md)
        
        Spacer()
      }
      .frame(width: 160)
      .background(Color.appSecondaryBackground)
      
      Divider()
      
      // Content
      VStack {
        switch selectedTab {
        case .general:
          GeneralSettingsView(viewModel: viewModel)
        case .privacy:
          PrivacySettingsView(viewModel: viewModel)
        case .notifications:
          NotificationsSettingsView(viewModel: viewModel)
        case .scheduling:
          SchedulingSettingsView(viewModel: viewModel)
        case .advanced:
          AdvancedSettingsView(viewModel: viewModel)
        }
        Spacer()
      }
      .padding(AppSpacing.lg)
    }
    .frame(minWidth: 700, minHeight: 600)
  }
  
  private func tabIcon(_ tab: SettingsTab) -> String {
    switch tab {
    case .general:
      return "gear"
    case .privacy:
      return "lock.fill"
    case .notifications:
      return "bell.fill"
    case .scheduling:
      return "calendar"
    case .advanced:
      return "wrench.and.screwdriver"
    }
  }
}

struct GeneralSettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("General")
        .font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold))
      
      VStack(alignment: .leading, spacing: AppSpacing.md) {
        Text("Startup & Behavior")
          .font(.system(size: AppTypography.FontSize.body, weight: .semibold))
          .foregroundColor(.appTextPrimary)
        
        Toggle("Launch at startup", isOn: $viewModel.launchAtStartup)
        Toggle("Show menu bar icon", isOn: $viewModel.showMenuBar)
      }
      
      VStack(alignment: .leading, spacing: AppSpacing.md) {
        Text("Cache Cleanup Defaults")
          .font(.system(size: AppTypography.FontSize.body, weight: .semibold))
          .foregroundColor(.appTextPrimary)
        
        HStack {
          Text("Minimum file age:")
          Picker("", selection: $viewModel.minimumFileAge) {
            Text("7 days").tag(7)
            Text("14 days").tag(14)
            Text("30 days").tag(30)
            Text("90 days").tag(90)
          }
          Spacer()
        }
        
        HStack {
          Text("Delete method:")
          Picker("", selection: $viewModel.deleteMethod) {
            Text("Trash").tag("trash")
            Text("Secure Erase").tag("secure")
          }
          Spacer()
        }
      }
    }
  }
}

struct PrivacySettingsView: View {
  @ObservedObject var viewModel: SettingsViewModel
  
  var body: some View {
    VStack(alignment: .leading, spacing: AppSpacing.lg) {
      Text("Privacy")
        .font(.system(size: AppTypography.FontSize.titleMedium, weight: .semibold))
      
      Toggle(
        "Help improve Cache Cleaner",
        isOn: $viewModel.enableTelemetry
      )
      
      Text("Anonymously share cleanup statistics to help us improve.")
        .font(.system(size: AppTypography.FontSize.caption, weight: .regular))
        .foregroundColor(.appTextSecondary)
    }
  }
}

// ... (NotificationsSettingsView, SchedulingSettingsView, AdvancedSettingsView)
```

**Deliverables by End of Week 14**:
- ✅ Scan progress modal with live updates.
- ✅ Confirmation dialogs (deletion, password).
- ✅ Settings window with all tabs.
- ✅ Exclusion rules modal (pattern editor).
- ✅ All animations and transitions.
- ✅ Full accessibility coverage.

---

## Part 7: Testing, Performance & Polish (Weeks 15–16)

### 7.1 Comprehensive Testing

**Test Categories**:

1. **Unit Tests** (Cache Scanner, Analyzer, Safety Validator)
   - Target: 90% code coverage.
   - Mock file system using test fixtures.
   - Run on every commit (GitHub Actions).

2. **Integration Tests** (Full scan → cleanup → persistence)
   - Real file system with test directory.
   - Verify data persistence in Core Data.
   - Test elevated permission flows.

3. **UI Tests** (SwiftUI views, user interactions)
   - Main flow: Dashboard → Scan → Results → Delete.
   - Settings navigation & preference persistence.
   - Dark/light mode rendering.

4. **Performance Benchmarks**
   - Scan 50k files: target <5s.
   - Cleanup 10k files: target <2s.
   - Memory footprint: <150 MB during peak scan.
   - Profile with Instruments (Allocations, System Trace).

**CI/CD Pipeline** (GitHub Actions):
```yaml
name: Test & Build

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v3
      - name: Run Unit Tests
        run: swift test --configuration debug
      - name: Run UI Tests
        run: xcodebuild test -scheme CacheCleanerApp -destination 'generic/platform=macOS'
      - name: Build Release
        run: swift build --configuration release

  lint:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v3
      - name: SwiftLint
        run: |
          brew install swiftlint
          swiftlint lint Sources/ --strict
```

### 7.2 Performance Optimization

**Profiling & Improvements**:

1. **File System Operations**
   - Use `AsyncSequence` for lazy enumeration (avoid loading all files into memory).
   - Batch file attribute lookups.
   - Cache permission checks.

2. **UI Rendering**
   - Use `@FetchRequest` with proper predicates (avoid large datasets in tables).
   - Implement table row virtualization for large result sets.
   - Lazy-load scan history.

3. **Memory Management**
   - Actor-based concurrency prevents data race leaks.
   - Periodic cleanup of temporary objects during scan.
   - Release scanner resources after scan completes.

### 7.3 Code Signing & Notarization

**macOS Notarization Workflow** (GitHub Actions):
```yaml
name: Notarize & Release

on:
  push:
    tags:
      - 'v*'

jobs:
  notarize:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v3
      
      - name: Build App
        run: swift build --configuration release
      
      - name: Code Sign
        env:
          SIGNING_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE_P12 }}
          SIGNING_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
        run: |
          echo "$SIGNING_CERTIFICATE" | base64 -d > cert.p12
          security import cert.p12 -P "$SIGNING_PASSWORD" -A
          codesign -s "Developer ID Application" --deep --strict .build/release/CacheCleaner
      
      - name: Notarize with Apple
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_APP_PASSWORD }}
        run: |
          xcrun notarytool submit .build/release/CacheCleaner.app \
            --apple-id "$APPLE_ID" \
            --password "$APPLE_PASSWORD" \
            --team-id "YOUR_TEAM_ID" \
            --wait
      
      - name: Create DMG
        run: |
          hdiutil create -volname "Cache Cleaner" \
            -srcfolder .build/release/ \
            -ov -format UDZO CacheCleaner.dmg
      
      - name: Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: "Cache Cleaner ${{ github.ref }}"
          files: CacheCleaner.dmg
```

### 7.4 Documentation & Release

**Documentation Deliverables**:

1. **User Guide** (PDF, in-app help)
   - Installation instructions.
   - Feature overview (scanning, exclusion rules, settings).
   - FAQs & troubleshooting.

2. **Developer Documentation** (GitHub Wiki)
   - Architecture overview.
   - Module descriptions.
   - Contributing guidelines.
   - Build & test instructions.

3. **Release Notes**
   - Changelog for v1.0 (features, fixes, known issues).
   - Installation steps.
   - System requirements (macOS 12.0+).

**Release Checklist**:
- ✅ All tests passing.
- ✅ Code signed & notarized.
- ✅ DMG installer created.
- ✅ Release notes finalized.
- ✅ GitHub release published.
- ✅ Website updated with download link.

---

## Part 8: Design-to-Code Workflow Summary

### 8.1 Design File Organization

Each screen in Figma maps to a corresponding Swift view:

| Figma Screen | Swift File | Components Used |
|---|---|---|
| Dashboard | `DashboardView.swift` | SummaryCardView, RecentScansTableView |
| Scan Progress Modal | `ScanProgressView.swift` | ProgressView, custom badge |
| Scan Results | `ScanResultsView.swift` | ResultsTableView, SafetyBadgeView, filters |
| Settings - General | `SettingsView.swift` + `GeneralSettingsView` | Toggle, Picker, Text |
| Confirmation Dialog | `ConfirmationDialog.swift` | Custom dialog, button styles |

### 8.2 Design Tokens → Code

**Figma Design Tokens** ↓ (exported as JSON)  
**`Assets/DesignTokens/tokens.json`** ↓ (manual conversion)  
**`Assets/DesignTokens/tokens.swift`** (source of truth in code)  
**SwiftUI Modifiers** (apply tokens via `Color.appAccentTeal`, `AppSpacing.md`, etc.)

### 8.3 Component Library Mapping

**Figma Components** → **Swift Modifiers & Styles**:

- Button (Primary) → `PrimaryButtonStyle()`
- Button (Secondary) → `SecondaryButtonStyle()`
- Button (Destructive) → `DestructiveButtonStyle()`
- Input Field → `InputFieldStyle()`
- Checkbox → `Toggle()`
- Dropdown → `Picker()`
- Table Row → Custom `Table()`
- Safety Badge → `SafetyBadgeView`
- Summary Card → `SummaryCardView`

---

## Deployment & Distribution

### Version Strategy

**v1.0** (Weeks 16, Release Candidate):
- Core features: Scan, analyze, delete.
- Dashboard, Results view, Settings.
- Basic exclusion rules.
- Light/dark mode.

**v1.1** (Post-release, 4 weeks):
- Scheduled cleanup (LaunchAgent).
- Advanced filters (file age, app-specific).
- Import/export scan history.
- Statistics & trends.

**v1.2** (8 weeks):
- Duplicate file detection (SHA256 hashing).
- System monitoring & real-time alerts.
- Pro features (encrypted backups, cloud sync).

### Distribution Channels

1. **Direct Download** (GitHub Releases): DMG installer, code-signed & notarized.
2. **Homebrew**: `brew install cache-cleaner` (via homebrew-cask).
3. **Mac App Store** (optional, future): Submission for wider reach.

---

## Success Metrics & KPIs

- **Performance**: Scan 50k files in <5s, cleanup 10k files in <2s.
- **Quality**: 90%+ test coverage, 0 data loss incidents.
- **UX**: First-time user understands app in <2 minutes.
- **Stability**: <1% crash rate in production.
- **Adoption**: 1,000+ downloads in first month.

---

## Summary Timeline

| Week | Phase | Deliverables |
|---|---|---|
| 1–2 | Design | Figma file, tokens, prototypes |
| 3–4 | Setup | Repository, package structure, theme system |
| 5–6 | Data | Core Data schema, repositories |
| 7–9 | Logic | Scanner, analyzer, cleanup engine |
| 10–12 | UI | Dashboard, Results, Settings views |
| 13–14 | Polish | Modals, animations, accessibility |
| 15–16 | Testing | Comprehensive tests, performance tuning, release |

**Total: 16 weeks (4 months) to production-ready v1.0.**

---

End of Implementation Plan
