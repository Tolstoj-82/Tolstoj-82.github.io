class LocalStorageManager {
  static LOCAL_STORAGE_KEY = "gbOcrHelper.games";

  // Returns true if data is no null/undefined/"" andthe
  // attributes screens and tilesets are arrays
  static isValidProjectData(data) {
    return data && Array.isArray(data.screens) && Array.isArray(data.tilesets);
  }

  static getSavedGames() {
    try {
      const games = JSON.parse(localStorage.getItem(LocalStorageManager.LOCAL_STORAGE_KEY)) || {};

      return Object.fromEntries(
        Object.entries(games)
          .filter(([, data]) => LocalStorageManager.isValidProjectData(data))
          .map(([name, data]) => [name, Normalizer.normalizeProjectData(data)]),
      );
    } catch {
      return {};
    }
  }
}
