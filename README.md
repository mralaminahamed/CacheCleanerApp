# Cache Cleaner

A native macOS app for scanning and reclaiming disk space from system, browser, app, and developer caches.

![macOS 13+](https://img.shields.io/badge/macOS-13%2B-blue) ![Swift 5.9](https://img.shields.io/badge/Swift-5.9-orange) ![SPM](https://img.shields.io/badge/SPM-ready-green)

## Features

- **Full-disk cache scan** — parallel async enumeration of `~/Library/Caches`, `/private/tmp`, Safari, App Support, Xcode DerivedData
- **Safety classification** — marks each file as Safe / Caution / Dangerous before deletion
- **Bulk delete** — move to Trash or permanently delete selected entries
- **Category filters** — Browser, System, Temp, App, Xcode
- **Statistics** — lifetime space freed, files deleted, scan history
- **Settings** — configurable file age threshold, delete method, auto-cleanup schedule, notifications
- **Light/dark mode** — adaptive design tokens from Figma

## Architecture

```
CacheCleanerApp          ← @main entry point
CacheCleanerUI           ← SwiftUI views + ViewModels
DataPersistence          ← Repositories (scan history, cleanup history, preferences, stats)
CleanupEngine            ← File deletion, safety validation, permission handling
CacheScanner             ← Async file enumeration actor, cache models
```

All targets are Swift Package Manager modules with explicit dependency graph and no circular imports.

## Requirements

- macOS 13 Ventura or later
- Xcode 15+ (for development)

## Running

```bash
# Build
swift build

# Run (CLI)
swift run CacheCleaner

# Open in Xcode
open Package.swift
```

## Full Disk Access

To scan system-wide caches the app requests **Full Disk Access** via System Settings → Privacy & Security → Full Disk Access. Without it, only user-space caches (`~/Library/`) are accessible.

## Project Structure

```
Sources/
  CacheScanner/
    Models/          CacheEntry, ScanResult
    Internal/        CacheAnalyzer, CacheLocation, ParallelFileEnumerator
    Public/          CacheScanner actor
  CleanupEngine/
    Internal/        SafetyValidator, PermissionHandler, TrashManager, RollbackManager
    Public/          CleanupManager
  DataPersistence/
    Models/          CleanupHistory, UserPreferences
    Repositories/    ScanHistory, CleanupHistory, Statistics, Preference
    CoreData/        CoreDataStack (future migration)
  CacheCleanerUI/
    Styling/         DesignTokens, Modifiers, Theme
    Views/           Dashboard, ScanResults, Stats, Settings + modals
    ViewModels/      Dashboard, ScanResults, Settings
  CacheCleanerApp/   App entry point
Assets/
  DesignTokens/      Figma-exported tokens (source of truth)
resources/
  plan/              16-week implementation plan
```

## Design

An interactive HTML/React prototype (`index.html` + `app.jsx`) ships alongside the native app for design reference. Open in any browser — no build step needed.

## License

MIT
