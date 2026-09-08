class Normalizer {
  static DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS = 6
  static DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS = 6
  static DEFAULT_SCREEN_DETECTION_GRACE_MS = 300
  static allTimeCarouselIntervalSeconds = Normalizer.DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS

  // transforms value to an integer between 1 and 3600
  // returns default value if value is not a number
  static normalizeAllTimeCarouselInterval(value) {
    return Normalizer.normalizeToMinMaxWithDefault(
      value,
      1,
      3600,
      Normalizer.DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS
    );
  }

  static normalizeToMinMaxWithDefault(value, min, max, defaultValue) {
    const seconds = Number(value);

    return Number.isFinite(seconds)
      ? Math.max(min, Math.min(max, Math.round(seconds)))
      : defaultValue;
  }

  // screenDetectionGraceMs: Sets to value if number and between 0 and 1000.
  // If not a number returns default value. If over/under max/min Returns
  // max/min values accordingly
  // stallOCcrOnUnknownTiles: Convert to boolean
  // Drops everything not beeing those two elements
  static normalizeGameSettings(settings = {}) {
    const grace = Number(settings.screenDetectionGraceMs);

    return {
      screenDetectionGraceMs: Normalizer.normalizeToMinMaxWithDefault(
        grace,
        0,
        1000,
        Normalizer.DEFAULT_SCREEN_DETECTION_GRACE_MS),
      stallOcrOnUnknownTiles: Boolean(settings.stallOcrOnUnknownTiles),
    };
  }

  // transforms value to an integer between 1 and interval_seconds or
  // 600 which ever is smaller.
  // returns either interval_seconds or default value if not a number
  // TODO: We are able to let this function return -1 if we pass
  // a non-integer and a value of interval_seconds to be -1
  // TODO: Why would we ever want to pass anything other than the default
  // TODO: Always call it with the standard in the code so we can remove it.
  static normalizeAllTimeCarouselDuration(
    value,
    intervalSeconds = Normalizer.allTimeCarouselIntervalSeconds,
  ) {
    const seconds = Number(value);
    const fallback = Math.min(
      Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS,
      intervalSeconds,
    );

    return Number.isFinite(seconds)
      ? Math.max(1, Math.min(600, intervalSeconds, Math.round(seconds)))
      : fallback;
  }

  static normalizeProjectData(data) {
    return {
      ...data,
      boxartImage: String(data.boxartImage || ""),
      boxartImages: Array.isArray(data.boxartImages)
        ? data.boxartImages.map((item) => String(item || "")).filter(Boolean)
        : data.boxartImage
          ? [String(data.boxartImage)]
          : [],
      demoDetector: Normalizer.normalizeImportedGameDemoDetector(data.demoDetector, data),
      recognitionScreen: String(data.recognitionScreen || ""),
      settings: Normalizer.normalizeGameSettings(data.settings),
      tilesets: (data.tilesets || []).map((tileset) => ({
        ...tileset,
        type: Normalizer.normalizeTilesetType(tileset.type),
        scanPixels: Normalizer.normalizeScanPixels(tileset.scanPixels),
        tiles: Normalizer.normalizeArray(tileset.tiles),
      })),
      screens: (data.screens || []).map((screen) => ({
        ...screen,
        identifierMatchCount: Number.isFinite(Number(screen.identifierMatchCount))
          ? Number(screen.identifierMatchCount)
          : "all",
        demoDetector: Normalizer.normalizeDemoDetectorConfig(
          screen.demoDetector,
          screen.name,
          data,
        ),
        identifiers: Normalizer.normalizeArray(screen.identifiers),
        rois: Normalizer.normalizeArray(screen.rois),
        achievements: Normalizer.normalizeArray(screen.achievements),
      })),
    };
  }

  // Returns empty array if scanPixels is not an array
  // Converts all values to Number
  // Removes all values that are smaller than 0 and larger than TILE^2
  // Removes all duplications and non-numbers like strings, null, etc.
  // Sorts all values from small to big
  static normalizeScanPixels(scanPixels) {
    if (!Array.isArray(scanPixels)) return [];

    return [...new Set(scanPixels.map(Number))] // deduplication by creating a Set (only unique values)
      .filter(
        (index) => Number.isInteger(index) && index >= 0 && index < TILE * TILE,
      )
      .sort((a, b) => a - b);
  }

  // Returns array if array.
  // Returns empty array otherwise
  static normalizeArray(arrayValue) {
    return Array.isArray(arrayValue) ? arrayValue : []
  }

  // Why would I not just use the selectedGame anyway and pass
  // it through injection
  static normalizeImportedGameDemoDetector(config, gameData = selectedGame) {
    return Normalizer.serializeDemoDetectorConfig(config, gameData);
  }

  // Returns type back if "counter"
  // Returns *text-number" otherwise.
  static normalizeTilesetType(type) {
    return type === "counter" ? "counter" : "text-number";
  }

  static normalizeScoreDemoMetric(value, screenName, gameData = selectedGame) {
    const metricName = String(value || "").trim();

    if (!metricName) return "";

    return getMetricNamesForGameScreen(gameData, screenName).includes(metricName)
      ? metricName
      : "";
  }

  static normalizeDemoDetectorConfig(
    value,
    screenName = selectedScoreScreenName,
    gameData = selectedGame,
  ) {
    const mode = value?.mode === "held" ? "held" : "sequence";
    const sequence = Normalizer.normalizeScoreDemoSequenceInput(
      value?.sequence ?? value?.demoSequence,
    );
    const rawMetric = String(value?.metric ?? value?.demoMetric ?? "").trim();
    const metric = screenName
      ? Normalizer.normalizeScoreDemoMetric(rawMetric, screenName, gameData)
      : rawMetric;
    const startValue = Normalizer.normalizeScoreDemoStartValue(
      value?.startValue ?? value?.demoStartValue,
      sequence,
    );
    const created =
      value?.created === true || value?.demoDetectorCreated === true;
    const stopScreens = Normalizer.normalizeScoreStopScreens(
      value?.stopScreens ?? value?.trackUntilScreens ?? value?.stopScreen,
      gameData,
    );
    const heldValue = String(value?.heldValue ?? value?.targetValue ?? "").trim();
    const holdMsValue = Number(value?.holdMs ?? value?.holdDurationMs);
    const holdMs = Number.isFinite(holdMsValue)
      ? Math.max(0, Math.round(holdMsValue))
      : 2000;
    const confirmOnScreenExit = value?.confirmOnScreenExit !== false;
    const hasUsableDetector = Boolean(
      metric && (mode === "held" ? heldValue : sequence),
    );

    return {
      created,
      enabled: created || hasUsableDetector,
      mode,
      metric,
      sequence,
      startValue,
      stopScreens,
      heldValue,
      holdMs,
      confirmOnScreenExit,
    };
  }

  // serialize or normalize??
  static serializeDemoDetectorConfig(config = {}, gameData = selectedGame) {
    const metric = String(config?.metric ?? config?.demoMetric ?? "").trim();
    const sequence = Normalizer.normalizeScoreDemoSequenceInput(
      config?.sequence ?? config?.demoSequence,
    );
    const startValue = Normalizer.normalizeScoreDemoStartValue(
      config?.startValue ?? config?.demoStartValue, // Why do we accept multiple values here?
      sequence,
    );
    const created =
      config?.created === true || config?.demoDetectorCreated === true;
    const stopScreens = Normalizer.normalizeScoreStopScreens(
      config?.stopScreens ?? config?.trackUntilScreens ?? config?.stopScreen,
      gameData,
    );
    const mode = config?.mode === "held" ? "held" : "sequence";
    const heldValue = String(
      config?.heldValue ?? config?.targetValue ?? "",
    ).trim();
    const holdMs = Number.isFinite(Number(config?.holdMs))
      ? Math.max(0, Math.round(Number(config.holdMs)))
      : 2000;
    const confirmOnScreenExit = config?.confirmOnScreenExit !== false;

    return {
      created,
      enabled:
        created || Boolean(metric && (mode === "held" ? heldValue : sequence)),
      metric,
      sequence,
      startValue,
      stopScreens,
      mode,
      heldValue,
      holdMs,
      confirmOnScreenExit,
    };
  }

  // value: array of strings  ["test", "test1"]
  // or strings separated by commas, eg. "test, test1"
  // makes sure that stop screens are always part of the
  // overall screens
  // makes sure that there are no duplications
  // TODO: Might remove the default and always expect the game data to be passed
  static normalizeScoreStopScreens(value, gameData = selectedGame) {
    const values = Array.isArray(value)
      ? value
      : String(value || "")
          .split(",")
          .map((item) => item.trim());
    const seen = new Set();

    return values
      .map((item) => Normalizer.normalizeScoreStopScreen(item, gameData)) // clean up screens
      .filter((screenName) => { // Remove duplications
        if (!screenName || seen.has(screenName)) return false;

        seen.add(screenName);
        return true;
      });
  }

  // Returns value as string
  // Returns value only if screens are defined in game data
  // and screen name is in screens array
  // Returns empty string otherwise
  // TODO: Might remove the default and always expect the game data to be passed
  static normalizeScoreStopScreen(value, gameData = selectedGame) {
    const screenName = String(value || "");

    if (!screenName) return "";
    if (!gameData?.screens) return "";


    return gameData.screens.some((screen) => screen.name === screenName)
      ? screenName
      : "";
  }


  // value : string, number
  // sequenceInput: string of numbers joined by commas, e.g. "1,2,3" or "[1,2,3]"
  // returns "", if sequence is empty
  // returns value as string if value is a number and in the sequenceInput
  // returns first element of sequenceInput as string otherwise
  static normalizeScoreDemoStartValue(value, sequenceInput) {
    const sequence = Normalizer.parseScoreDemoSequence(sequenceInput);
    const number = Number(value);

    if (!sequence.length) return "";
    if (Number.isFinite(number) && sequence.includes(number))
      return String(number);

    return String(sequence[0]);
  }

  // If array: Converts value in array to numbers
  // removes non-numbers
  // joins each value with to a string [1,2,3] => "1, 2, 3"
  // If string: Cleans non-number values from string
  // "[ 1, a, , 2, 3]" => "1, 2, 3"
  static normalizeScoreDemoSequenceInput(value) {
    // Array route
    // TODO: Move this to a function?
    if (Array.isArray(value)) {
      return value
        .filter((item) => item !== null) // PZA: Fix null values conversion to 0
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item))
        .join(", ");
    }

    // String route
    return Normalizer.parseScoreDemoSequence(value).join(", ");
  }

  // Replaces all opening and closing rectangular brackets
  // Splits values by comma into array
  // Trims all items
  // Removes empty string eg. [1,,2] => [1,2]
  // Converts to number (second trim is unnecessary!)
  // Removes everything that is not a finite number
  // Returns an array
  static parseScoreDemoSequence(value) {
    return String(value || "")
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
  }
}
