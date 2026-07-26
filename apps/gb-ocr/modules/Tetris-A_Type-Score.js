(function () {
  const module = {
    id: "Tetris-A_Type-Score",
    name: "Get leaderboard name (A-Type)",
    attachAnywhere: true,
    toggleable: true,
    screen: "A-Type",
    metric: "Score",
    configFields: [
      {
        key: "scoreboardScreen",
        label: "Scoreboard screen",
        type: "screen",
        defaultValue: "Scorebord",
      },
      {
        key: "score1",
        label: "Score 1",
        type: "roi",
        screenKey: "scoreboardScreen",
        defaultValue: "score1",
      },
      {
        key: "name1",
        label: "Name 1",
        type: "roi",
        screenKey: "scoreboardScreen",
        defaultValue: "name1",
      },
      {
        key: "score2",
        label: "Score 2",
        type: "roi",
        screenKey: "scoreboardScreen",
        defaultValue: "score2",
      },
      {
        key: "name2",
        label: "Name 2",
        type: "roi",
        screenKey: "scoreboardScreen",
        defaultValue: "name2",
      },
      {
        key: "score3",
        label: "Score 3",
        type: "roi",
        screenKey: "scoreboardScreen",
        defaultValue: "score3",
      },
      {
        key: "name3",
        label: "Name 3",
        type: "roi",
        screenKey: "scoreboardScreen",
        defaultValue: "name3",
      },
    ],

    canAttach(context) {
      return context.gameName?.toLowerCase().includes("tetris");
    },

    matches(context) {
      return (
        context.selectedScreen === "A-Type" &&
        context.selectedMetric?.toLowerCase() === "score"
      );
    },

    onNameEntryTick(context) {
      const config = context.getModuleConfig(module);

      if (/rocket/i.test(context.activeScreenName || "")) {
        context.keepNameEntryAlive();
        return;
      }

      if (context.activeScreenName !== config.scoreboardScreen) return;

      // Name-entry cursor/blink pixels can break full 8x8 tile matching.
      // This module deliberately uses the tilesets' stable scan pixels even
      // when the game's global Fast OCR toggle is disabled.
      const scoreboardValues = context.getScreenValues(
        config.scoreboardScreen,
        { fastOCR: true },
      );

      const matchedIndex = findMatchingScoreIndex(
        scoreboardValues,
        context.entry.gameScore ?? context.entry.score,
        config,
      );

      if (!matchedIndex) {
        context.entry.moduleState ||= {};
        context.entry.moduleState[module.id] ||= {};
        context.entry.moduleState[module.id].scoreboardMisses =
          (context.entry.moduleState[module.id].scoreboardMisses || 0) + 1;

        if (context.entry.moduleState[module.id].scoreboardMisses < 6) {
          context.keepNameEntryAlive(3);
          return;
        }

        context.finishNameEntry();
        return;
      }

      if (context.entry.moduleState?.[module.id]) {
        context.entry.moduleState[module.id].scoreboardMisses = 0;
      }

      context.keepNameEntryAlive();

      const name = getValue(scoreboardValues, config[`name${matchedIndex}`]);

      if (!name || name === "--" || /^[-\s]+$/.test(name)) return;

      context.setNameValue(name);
    },
  };

  function findMatchingScoreIndex(values, score, config) {
    const expected = normalizeScore(score);

    if (!expected) return null;

    for (let index = 1; index <= 3; index += 1) {
      const roiName = config[`score${index}`];

      if (normalizeScore(getValue(values, roiName)) === expected) {
        return index;
      }
    }

    return null;
  }

  function getValue(values, name) {
    const match = values.find((item) => {
      return String(item.name || "").trim().toLowerCase() ===
        String(name || "").trim().toLowerCase();
    });

    return String(match?.value || "").trim();
  }

  function normalizeScore(value) {
    return String(value || "").replace(/[^\d-]/g, "");
  }

  window.OcrGameModules?.register(module);
})();
