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
      .appendingPathComponent("CacheCleanerModel.sqlite")

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
