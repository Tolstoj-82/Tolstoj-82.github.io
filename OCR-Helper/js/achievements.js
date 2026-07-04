function createAchievement(index = 0) {
  return {
    id: Date.now() + index,
    metric: "",
    comparer: "=",
    value: "",
    message: "",
    tier: "beginner",
    resetScreen: "self",
    _metricCommitted: false,
  };
}

let achievementReadableScreenId = null;
let achievementRuntimeStates = new Map();
let achievementToastQueue = [];
let achievementToastShowing = false;
let openAchievementId = null;

addAchievementButton.onclick = () => {
  const screen = getActiveScreen();

  if (!screen) {
    showAlert("Add or select a screen first.");
    return;
  }

  if (!Array.isArray(screen.achievements)) {
    screen.achievements = [];
  }

  if (hasUnassignedAchievement(screen)) {
    showAlert("Assign a metric and close the current achievement first.");
    return;
  }

  const achievement = createAchievement(screen.achievements.length);

  screen.achievements.push(achievement);
  openAchievementId = achievement.id;

  renderAchievementList();
  updateWorkflowUI();
};

function renderAchievementList() {
  const screen = getActiveScreen();

  achievementList.innerHTML = "";
  addAchievementButton.disabled = !screen;

  if (!screen) {
    return;
  }

  if (!Array.isArray(screen.achievements)) {
    screen.achievements = [];
  }

  updateAddAchievementButton(screen);

  if (screen.achievements.length === 0) {
    const empty = document.createElement("div");

    empty.className = "achievementEmpty";
    empty.textContent = "No achievements";

    achievementList.appendChild(empty);
    return;
  }

  groupAchievementsByMetric(screen.achievements).forEach((group) => {
    const section = document.createElement("div");
    section.className = "achievementGroup";

    const heading = document.createElement("div");
    heading.className = "achievementGroupTitle";
    heading.textContent = group.metric || "Metric";

    section.appendChild(heading);

    group.achievements.forEach((achievement) => {
      section.appendChild(createAchievementItem(screen, achievement));
    });

    achievementList.appendChild(section);
  });
}

function updateAddAchievementButton(screen = getActiveScreen()) {
  const disabled = !screen || hasUnassignedAchievement(screen);

  addAchievementButton.disabled = disabled;
  addAchievementButton.title =
    screen && hasUnassignedAchievement(screen)
      ? "Assign a metric and close the current achievement first."
      : "";
}

function hasUnassignedAchievement(screen) {
  return Boolean(
    screen?.achievements?.some((achievement) => {
      return !achievement.metric || !achievement._metricCommitted;
    }),
  );
}

function createAchievementItem(screen, achievement) {
  const details = document.createElement("details");
  details.className = "achievementItem";
  details.dataset.tier = normalizeAchievementTier(achievement.tier);
  details.dataset.achievementId = achievement.id;
  details.open = achievement.id === openAchievementId;

  const summary = document.createElement("summary");
  summary.className = "achievementSummary";

  const dragHandle = document.createElement("span");
  dragHandle.className = "dragHandle achievementDragHandle";
  dragHandle.title = "Drag to reorder";
  dragHandle.draggable = true;

  const title = document.createElement("span");
  title.className = "achievementSummaryTitle";
  title.textContent = getAchievementTitle(achievement);

  const del = document.createElement("button");
  del.textContent = "×";
  del.className = "roiDeleteButton";
  del.title = "Delete achievement";
  del.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    showConfirm(
      `Delete achievement "${achievement.message || achievement.metric}"?`,
      () => {
        screen.achievements = screen.achievements.filter(
          (item) => item.id !== achievement.id,
        );

        renderAchievementList();
        updateWorkflowUI();
      },
      null,
      "Delete",
      "Cancel",
    );
  };

  summary.append(dragHandle, title, del);
  bindAchievementDrag(details, dragHandle, screen, achievement);
  bindAchievementToggle(details);

  const body = document.createElement("div");
  body.className = "achievementBody";

  body.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  body.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  });

  const metric = createAchievementMetricSelect(screen, achievement, () => {
    title.textContent = getAchievementTitle(achievement);
  });
  metric.className = "achievementMetricSelect";

  const comparer = createAchievementSelect(
    achievementComparers,
    achievement.comparer,
    (value) => {
      achievement.comparer = value;
      resetAchievementRuntime({ clearQueue: true });
      title.textContent = getAchievementTitle(achievement);
      updateWorkflowUI();
    },
  );
  comparer.className = "achievementComparerSelect";

  const target = document.createElement("input");
  target.type = "text";
  target.value = achievement.value;
  target.placeholder = "Value";
  target.className = "achievementValueInput";
  target.oninput = () => {
    achievement.value = target.value;
    resetAchievementRuntime({ clearQueue: true });
    title.textContent = getAchievementTitle(achievement);
    updateWorkflowUI();
  };

  const message = document.createElement("input");
  message.type = "text";
  message.value = achievement.message;
  message.placeholder = "Achievement Message";
  message.className = "achievementMessageInput";
  message.oninput = () => {
    achievement.message = message.value;
    updateWorkflowUI();
  };

  const tier = createAchievementSelect(
    achievementTiers.map((item) => ({ value: item, label: item })),
    achievement.tier,
    (value) => {
      achievement.tier = value;
      details.dataset.tier = normalizeAchievementTier(value);
      updateWorkflowUI();
    },
  );
  tier.className = "achievementTierSelect";

  const lifecycle = createAchievementLifecycleSelect(screen, achievement);
  lifecycle.className = "achievementLifecycleSelect";

  body.append(
    metric,
    comparer,
    target,
    message,
    createAchievementLabeledControl("Tier", tier),
    createAchievementLabeledControl("Lifecycle", lifecycle),
  );
  details.append(summary, body);

  return details;
}

function createAchievementLabeledControl(labelText, control) {
  const label = document.createElement("label");
  const text = document.createElement("span");

  label.className = "achievementField";
  text.textContent = labelText;

  label.append(text, control);

  return label;
}

function bindAchievementToggle(details) {
  details.addEventListener("toggle", () => {
    if (!details.open) {
      if (openAchievementId === Number(details.dataset.achievementId)) {
        openAchievementId = null;
      }

      const screen = getActiveScreen();
      const achievement = screen?.achievements?.find((item) => {
        return item.id === Number(details.dataset.achievementId);
      });

      if (achievement?.metric && !achievement._metricCommitted) {
        achievement._metricCommitted = true;
        renderAchievementList();
        updateWorkflowUI();
      }

      return;
    }

    openAchievementId = Number(details.dataset.achievementId);

    achievementList.querySelectorAll(".achievementItem[open]").forEach((item) => {
      if (item !== details) {
        item.open = false;
      }
    });
  });
}

function bindAchievementDrag(details, dragHandle, screen, achievement) {
  dragHandle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  dragHandle.addEventListener("dragstart", (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(achievement.id));
    e.dataTransfer.setData("application/x-achievement-drag", "true");
    e.dataTransfer.setDragImage(
      details,
      details.offsetWidth / 2,
      Math.min(24, details.offsetHeight / 2),
    );
    details.classList.add("dragging");
  });

  dragHandle.addEventListener("dragend", () => {
    clearAchievementDropIndicators();
  });

  details.addEventListener("dragover", (e) => {
    if (!isAchievementDragEvent(e)) return;

    const draggedId = Number(e.dataTransfer.getData("text/plain"));

    if (!canDropAchievement(screen, draggedId, achievement)) return;

    e.preventDefault();

    const rect = details.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;

    details.classList.add("drag-over");
    details.classList.toggle("drop-before", !isAfter);
    details.classList.toggle("drop-after", isAfter);
  });

  details.addEventListener("dragleave", () => {
    details.classList.remove("drag-over", "drop-before", "drop-after");
  });

  details.addEventListener("drop", (e) => {
    if (!isAchievementDragEvent(e)) return;

    const draggedId = Number(e.dataTransfer.getData("text/plain"));

    if (!canDropAchievement(screen, draggedId, achievement)) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = details.getBoundingClientRect();
    const insertAfter = e.clientY > rect.top + rect.height / 2;

    reorderAchievementsWithinMetric(screen, draggedId, achievement.id, insertAfter);
    clearAchievementDropIndicators();
    renderAchievementList();
    updateWorkflowUI();
  });
}

function isAchievementDragEvent(e) {
  return e.dataTransfer.types.includes("application/x-achievement-drag");
}

function canDropAchievement(screen, draggedId, targetAchievement) {
  if (!draggedId || draggedId === targetAchievement.id) return false;

  const dragged = screen.achievements.find((item) => item.id === draggedId);

  return dragged && dragged.metric === targetAchievement.metric;
}

function clearAchievementDropIndicators() {
  achievementList.querySelectorAll(".achievementItem").forEach((item) => {
    item.classList.remove("dragging", "drag-over", "drop-before", "drop-after");
  });
}

function reorderAchievementsWithinMetric(
  screen,
  sourceId,
  targetId,
  insertAfter,
) {
  const source = screen.achievements.find((item) => item.id === sourceId);
  const target = screen.achievements.find((item) => item.id === targetId);

  if (!source || !target || source.metric !== target.metric) return;

  reorderArrayItem(
    screen.achievements,
    sourceId,
    targetId,
    insertAfter,
    (achievement) => achievement.id,
  );
}

function groupAchievementsByMetric(achievements) {
  const groups = [];
  const groupByMetric = new Map();

  achievements.forEach((achievement) => {
    const metric =
      achievement.metric && achievement._metricCommitted
        ? achievement.metric
        : "Unassigned";

    if (!groupByMetric.has(metric)) {
      const group = {
        metric,
        achievements: [],
      };

      groupByMetric.set(metric, group);
      groups.push(group);
    }

    groupByMetric.get(metric).achievements.push(achievement);
  });

  return groups.sort((a, b) => {
    if (a.metric === "Unassigned") return -1;
    if (b.metric === "Unassigned") return 1;
    return 0;
  });
}

function createAchievementMetricSelect(screen, achievement, onMetricChange) {
  const metrics = screen.rois.map((roi) => roi.name).filter(Boolean);
  const options = [
    {
      value: "",
      label: "Metric...",
      disabled: true,
    },
    ...metrics.map((name) => ({ value: name, label: name })),
  ];

  if (
    achievement.metric &&
    !options.some((option) => option.value === achievement.metric)
  ) {
    options.push({
      value: achievement.metric,
      label: achievement.metric,
    });
  }

  return createAchievementSelect(
    options,
    achievement.metric,
    (value) => {
      achievement.metric = value;
      resetAchievementRuntime({ clearQueue: true });
      openAchievementId = achievement.id;

      if (onMetricChange) {
        onMetricChange();
      }

      if (achievement._metricCommitted) {
        renderAchievementList();
      } else {
        updateAddAchievementButton(screen);
      }

      updateWorkflowUI();
    },
  );
}

function createAchievementLifecycleSelect(screen, achievement) {
  const options = [
    {
      value: "self",
      label: "This screen",
    },
    ...game.screens
      .filter((item) => item.id !== screen.id)
      .map((item) => ({
        value: item.name,
        label: item.name,
      })),
  ];
  const resetScreen = normalizeAchievementResetScreen(achievement.resetScreen);

  if (
    resetScreen !== "self" &&
    !options.some((option) => option.value === resetScreen)
  ) {
    options.push({
      value: resetScreen,
      label: resetScreen,
    });
  }

  return createAchievementSelect(options, resetScreen, (value) => {
    achievement.resetScreen = value;
    resetAchievementRuntime({ clearQueue: true });
    updateWorkflowUI();
  });
}

function getAchievementTitle(achievement) {
  const metric = achievement.metric || "Metric";
  const comparer = achievement.comparer || "=";
  const value = achievement.value === "" ? "Value" : achievement.value;

  return `${metric} ${comparer} ${value}`;
}

function createAchievementSelect(options, value, onChange) {
  const select = document.createElement("select");
  let previousValue = value;

  options.forEach((option) => {
    const item = document.createElement("option");

    item.value = option.value;
    item.textContent = option.label;
    item.disabled = Boolean(option.disabled);

    select.appendChild(item);
  });

  select.value = value;

  const handleChange = () => {
    if (select.value === previousValue) return;

    previousValue = select.value;
    onChange(select.value);
  };

  select.oninput = handleChange;
  select.onchange = handleChange;

  return select;
}

function evaluateAchievements(screen, ocrValues) {
  if (!screen || !Array.isArray(screen.achievements)) return;

  screen.achievements.forEach((achievement) => {
    if (!achievement.metric) return;

    const state = getAchievementRuntimeState(screen, achievement);

    const currentValue = getAchievementOCRValue(ocrValues, achievement.metric);

    if (currentValue === undefined) return;

    const isMet = achievementConditionMet(currentValue, achievement);

    if (!state.initialized) {
      state.initialized = true;
      state.wasMet = isMet;
      return;
    }

    if (!state.fired && isMet && !state.wasMet) {
      state.fired = true;
      enqueueAchievementToast(achievement);
    }

    state.wasMet = isMet;
  });
}

function updateAchievementScreenRun(screen, canReadScreen) {
  if (!screen || !canReadScreen) {
    achievementReadableScreenId = null;
    return;
  }

  if (achievementReadableScreenId === screen.id) return;

  achievementReadableScreenId = screen.id;
  resetAchievementRuntimeForLifecycleScreen(screen, { clearQueue: true });
}

function resetAchievementRuntime(options = {}) {
  const { clearQueue = false } = options;

  achievementRuntimeStates = new Map();

  if (clearQueue) {
    achievementToastQueue = [];
  }
}

function getAchievementRuntimeState(screen, achievement) {
  const key = getAchievementRuntimeKey(screen, achievement);

  if (!achievementRuntimeStates.has(key)) {
    achievementRuntimeStates.set(key, {
      initialized: false,
      fired: false,
      wasMet: false,
    });
  }

  return achievementRuntimeStates.get(key);
}

function resetAchievementRuntimeForLifecycleScreen(
  lifecycleScreen,
  options = {},
) {
  const { clearQueue = false } = options;

  game.screens.forEach((screen) => {
    (screen.achievements || []).forEach((achievement) => {
      if (
        getAchievementLifecycleScreen(screen, achievement) !== lifecycleScreen
      ) {
        return;
      }

      achievementRuntimeStates.delete(
        getAchievementRuntimeKey(screen, achievement),
      );
    });
  });

  if (clearQueue) {
    achievementToastQueue = [];
  }
}

function getAchievementRuntimeKey(screen, achievement) {
  return `${screen.id}:${achievement.id}`;
}

function getAchievementLifecycleScreen(screen, achievement) {
  const resetScreen = normalizeAchievementResetScreen(achievement.resetScreen);

  if (resetScreen === "self") return screen;

  return game.screens.find((item) => item.name === resetScreen) || screen;
}

function updateAchievementLifecycleScreenName(oldName, newName) {
  if (!oldName || oldName === newName) return;

  game.screens.forEach((screen) => {
    (screen.achievements || []).forEach((achievement) => {
      if (achievement.resetScreen === oldName) {
        achievement.resetScreen = newName;
      }
    });
  });
}

function clearMissingAchievementLifecycleScreens() {
  const screenNames = new Set(game.screens.map((screen) => screen.name));

  game.screens.forEach((screen) => {
    (screen.achievements || []).forEach((achievement) => {
      const resetScreen = normalizeAchievementResetScreen(
        achievement.resetScreen,
      );

      if (resetScreen !== "self" && !screenNames.has(resetScreen)) {
        achievement.resetScreen = "self";
      }
    });
  });
}

function getAchievementOCRValue(ocrValues, metric) {
  if (ocrValues[metric] !== undefined) {
    return ocrValues[metric];
  }

  const normalizedMetric = String(metric || "").trim();
  const key = Object.keys(ocrValues).find((name) => {
    return name.trim() === normalizedMetric;
  });

  return key ? ocrValues[key] : undefined;
}

function achievementConditionMet(currentValue, achievement) {
  const current = String(currentValue).trim();
  const expected = String(achievement.value).trim();
  const leftNumber = Number(current);
  const rightNumber = Number(expected);
  const bothNumeric =
    current !== "" &&
    expected !== "" &&
    Number.isFinite(leftNumber) &&
    Number.isFinite(rightNumber);

  const left = bothNumeric ? leftNumber : current;
  const right = bothNumeric ? rightNumber : expected;

  switch (achievement.comparer) {
    case "=":
      return left === right;
    case ">":
      return bothNumeric && left > right;
    case ">=":
      return bothNumeric && left >= right;
    case "<":
      return bothNumeric && left < right;
    case "<=":
      return bothNumeric && left <= right;
    default:
      return false;
  }
}

function enqueueAchievementToast(achievement) {
  if (!achievementToastLayer) return;

  achievementToastQueue.push(achievement);
  showNextAchievementToast();
}

function showNextAchievementToast() {
  if (achievementToastShowing) return;
  if (achievementToastQueue.length === 0) return;
  if (!achievementToastLayer) return;

  achievementToastShowing = true;
  showAchievementToast(achievementToastQueue.shift());
}

function showAchievementToast(achievement) {
  const toast = document.createElement("div");
  const tier = normalizeAchievementTier(achievement.tier);

  toast.className = "achievementToast";
  toast.dataset.tier = tier;

  const symbol = document.createElement("div");
  symbol.className = "achievementToastSymbol";
  symbol.textContent = getAchievementSymbol(tier);

  const text = document.createElement("div");

  const header = document.createElement("div");
  header.className = "achievementToastHeader";
  header.textContent = "Achievement";

  const message = document.createElement("div");
  message.className = "achievementToastMessage";
  message.textContent = achievement.message || "Achievement unlocked!";

  text.append(header, message);
  toast.append(symbol, text);
  achievementToastLayer.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("leaving");
  }, 3600);

  window.setTimeout(() => {
    toast.remove();
    achievementToastShowing = false;
    showNextAchievementToast();
  }, 4300);
}

function getAchievementSymbol(tier) {
  switch (tier) {
    case "beginner":
      return "I";
    case "novice":
      return "II";
    case "intermediate":
      return "III";
    case "advanced":
      return "IV";
    case "expert":
      return "V";
    case "pro":
      return "★";
    case "god-tier":
      return "◆";
    default:
      return "★";
  }
}

function normalizeAchievementTier(tier) {
  return achievementTiers.includes(tier) ? tier : "beginner";
}

function normalizeAchievementResetScreen(resetScreen) {
  return resetScreen || "self";
}

function normalizeImportedAchievements(achievements) {
  if (!Array.isArray(achievements)) return [];

  return achievements.map((achievement, index) => ({
    id: Date.now() + 3000 + index,
    metric: achievement.metric || "",
    comparer: achievementComparers.some(
      (item) => item.value === achievement.comparer,
    )
      ? achievement.comparer
      : "=",
    value: achievement.value ?? "",
    message: achievement.message || "",
    tier: normalizeAchievementTier(achievement.tier),
    resetScreen: normalizeAchievementResetScreen(achievement.resetScreen),
    _metricCommitted: true,
  }));
}
