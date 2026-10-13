(() => {
  "use strict";
  const {
    t,
    setLanguage,
    LocalizedError,
    localizedMessages,
    setMessage,
    captureTranslations,
    translateInterface,
  } = window.QRGenerator["i18n"];
  const { toast } = window.QRGenerator["notifications"];
  const { createLogoManager } = window.QRGenerator["logos"];
  const { EXPORT_SIZE, renderQRCode, vectorContext, toSVG, wrapText } =
    window.QRGenerator["qr-renderer"];
  const { createTemplateLibrary } = window.QRGenerator["templates"];
  captureTranslations();
  translateInterface();
  // All translations are presentation-only: imported data and custom labels stay unchanged.
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const info = document.getElementById("info");
  const statusDiv = document.getElementById("status");
  const generateBtn = document.getElementById("generateBtn");

  const qrInput = document.getElementById("qrInput");
  const shapeSelect = document.getElementById("shapeSelect");
  const colorPicker = document.getElementById("colorPicker");
  const finderShapeSelect = document.getElementById("finderShapeSelect");
  const finderColorPicker = document.getElementById("finderColorPicker");
  const canvas = document.getElementById("qrCanvas");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrTitle = document.getElementById("qrTitle");
  const qrSubtitle = document.getElementById("qrSubtitle");
  const ctx = canvas.getContext("2d");

  let editorSnapshot = null;
  const { logoState, readSavedLogos, renderSavedLogos, addTemplateLogos } =
    createLogoManager({
      saveSettings,
      generateQRCode,
      confirmDeletion: (...args) => confirmDeletion(...args),
      getLogoTemplates: (data) => [
        ...qrPresets.getLogoUsage(data),
        ...templateLibrary
          .getEntries()
          .filter(
            (entry) => entry.payload.layout?.qrAppearance?.logoData === data,
          )
          .map((entry) => entry.name),
      ],
    });

  let loadedData = null;
  let isGenerating = false;
  let fileLoadVersion = 0;
  const bulkImport = document.getElementById("bulkImport");
  const qrError = document.getElementById("qrError");
  const toggleImportBtn = document.getElementById("toggleImportBtn");

  const DEMO_QR_CONTENT =
    "https://tolstoj-82.github.io/content/martin-jakob/qr-code/index.html";
  let clearedDefaultURL = false;
  qrInput.addEventListener("click", () => {
    if (qrInput.value !== DEMO_QR_CONTENT) return;
    clearedDefaultURL = true;
    qrInput.value = "";
    generateQRCode();
  });
  qrInput.addEventListener("input", () => {
    clearedDefaultURL = false;
  });
  qrInput.addEventListener("blur", () => {
    if (clearedDefaultURL && qrInput.value === "") {
      qrInput.value = DEMO_QR_CONTENT;
      generateQRCode();
    }
    clearedDefaultURL = false;
  });
  let templateTestContent = DEMO_QR_CONTENT;
  let activeMode = "single";
  let galleryVersion = 0;
  let editingCartGallery = false;
  function missingCartKeys(layout, records = loadedData, mode = "bulk") {
    if (!records?.length) return [];
    const keyFor = (key) =>
      layout.sources?.[key] ??
      (key === "heading:title"
        ? mode === "single"
          ? "title"
          : "Titel"
        : key === "heading:subtitle"
          ? mode === "single"
            ? "subtitle"
            : "Untertitel"
          : key);
    const keys = [...(layout.above || []), ...(layout.below || [])]
      .filter(
        (key) =>
          key !== "date:current" && !Object.hasOwn(layout.custom || {}, key),
      )
      .map(keyFor);
    if (mode === "bulk") {
      if (Array.isArray(layout.contentCards))
        keys.push(
          ...layout.contentCards
            .filter((card) => card.kind === "field")
            .map((card) => card.value),
        );
      else
        for (const match of (layout.contentExpression || "").matchAll(
          /\{\{("(?:\\.|[^"\\])*"|[^{}]*?)\}\}/g,
        )) {
          try {
            keys.push(
              match[1].startsWith('"') ? JSON.parse(match[1]) : match[1].trim(),
            );
          } catch {}
        }
    }
    return [...new Set(keys)].filter(
      (key) =>
        key &&
        records.some((record) => !Object.hasOwn(record.Raw || record, key)),
    );
  }
  function warnCartCompatibility(layout, name) {
    const missing = missingCartKeys(layout);
    if (missing.length)
      toast(
        t("Cart passt nicht zu den Daten: ") +
          (name ? name + " — " : "") +
          t("Fehlende Felder: ") +
          missing.join(", "),
        "warning",
      );
    return missing;
  }
  function checkImportedCarts() {
    const entries = templateLibrary
      .getEntries()
      .filter((entry) => entry.kind === "bulk");
    const incompatible = entries
      .map((entry) => ({
        entry,
        missing: missingCartKeys(entry.payload.layout || {}),
      }))
      .filter((item) => item.missing.length);
    if (incompatible.length)
      toast(
        t("Nicht passende Carts: ") +
          incompatible
            .map(
              ({ entry, missing }) =>
                entry.name + " (" + missing.join(", ") + ")",
            )
            .join("; "),
        "warning",
      );
    const matching = entries.filter(
      (entry) => !missingCartKeys(entry.payload.layout || {}).length,
    );
    if (matching.length)
      toast(
        t("Passende Carts: ") + matching.map((entry) => entry.name).join(", "),
      );
  }
  async function openCartTemplate(entry, kind) {
    if (layoutDialog.open) layoutDialog.close();
    editingCartGallery = true;
    await openLayoutEditor(kind);
    if (entry) await templateLibrary.choose(entry);
    else {
      const layout = kind === "single" ? singleLayout : bulkLayout;
      Object.assign(layout, {
        above: [],
        below: ["heading:title", "heading:subtitle"],
        labels: {},
        custom: {},
        styles: {},
        headingsMovable: true,
      });
      templateLibrary.createNew();
      await openLayoutEditor(kind);
      templateLibrary.markBaseline();
    }
  }
  let newQRTemplate = false;
  let qrTemplateSearch = "";
  function enableTemplateReordering(
    grid,
    persistOrder = (ids) => qrPresets.reorder(ids),
  ) {
    let drag = null;
    const cards = () => [...grid.querySelectorAll(".qr-template-card")];
    const persist = () => persistOrder(cards().map((card) => card.dataset.id));
    const restore = () => {
      for (const card of drag.original)
        grid.insertBefore(card, grid.querySelector(".qr-template-no-results"));
    };
    function move(active, target, after) {
      const nodes = cards(),
        before = new Map(
          nodes.map((node) => [node, node.getBoundingClientRect()]),
        );
      grid.insertBefore(active, after ? target.nextSibling : target);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        for (const node of nodes) {
          if (node === active) continue;
          const old = before.get(node),
            next = node.getBoundingClientRect();
          node.getAnimations?.().forEach((animation) => animation.cancel());
          node.animate(
            [
              {
                transform: `translate(${old.left - next.left}px,${old.top - next.top}px)`,
              },
              { transform: "translate(0,0)" },
            ],
            { duration: 180, easing: "ease-out" },
          );
        }
    }
    grid.addEventListener("dragstart", (event) => {
      const card = event.target.closest(".qr-template-card");
      if (!card) return;
      drag = { card, original: cards(), committed: false };
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.id);
      requestAnimationFrame(() => {
        if (drag?.card === card) card.classList.add("dragging");
      });
    });
    grid.addEventListener("dragover", (event) => {
      if (!drag) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const bounds = grid.getBoundingClientRect();
      if (event.clientY < bounds.top + 40) grid.scrollTop -= 12;
      else if (event.clientY > bounds.bottom - 40) grid.scrollTop += 12;
      const target = event.target.closest(".qr-template-card");
      if (!target || target === drag.card) return;
      const nodes = cards(),
        forward = nodes.indexOf(drag.card) < nodes.indexOf(target),
        rect = target.getBoundingClientRect();
      if (
        (forward && event.clientX < rect.left + rect.width / 2) ||
        (!forward && event.clientX > rect.left + rect.width / 2)
      )
        return;
      move(drag.card, target, forward);
    });
    grid.addEventListener("drop", (event) => {
      if (!drag) return;
      event.preventDefault();
      drag.committed = persist();
    });
    grid.addEventListener("dragend", () => {
      if (!drag) return;
      if (!drag.committed) restore();
      drag.card.classList.remove("dragging");
      drag = null;
    });
    grid.addEventListener("keydown", (event) => {
      if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key))
        return;
      const card = event.target.closest(".qr-template-card");
      if (!card) return;
      event.preventDefault();
      const nodes = cards(),
        forward = event.key === "ArrowRight",
        target = nodes[nodes.indexOf(card) + (forward ? 1 : -1)];
      if (!target) return;
      move(card, target, forward);
      if (!persist()) move(card, target, !forward);
      card.querySelector(".qr-template-choice, .cart-template-choice").focus();
    });
  }
  async function renderQRTemplateWorkspace(host, version) {
    const entries = qrPresets.getEntries();
    if (
      !newQRTemplate &&
      !entries.some((entry) => entry.id === qrPresets.getSelected()) &&
      entries.length
    )
      await qrPresets.choose(entries[0]);
    if (version !== galleryVersion || activeMode !== "templates") return;
    const heading = document.createElement("h2");
    heading.textContent = t("QR-Code-Templates");
    const headingRow = document.createElement("div");
    headingRow.className = "template-gallery-heading";
    const transfer = document.createElement("div");
    transfer.className = "template-transfer";
    const upload = document.createElement("input");
    upload.type = "file";
    upload.accept = ".json";
    upload.hidden = true;
    upload.addEventListener("change", async () => {
      if (upload.files[0]) await qrPresets.importFile(upload.files[0]);
      upload.value = "";
    });
    for (const [direction, label, action] of [
      ["up", "QR-Code-Templates importieren", () => upload.click()],
      ["down", "QR-Code-Templates exportieren", () => qrPresets.exportFile()],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.title = t(label);
      button.setAttribute("aria-label", t(label));
      button.addEventListener("click", action);
      if (direction === "down") button.disabled = !entries.length;
      const icon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("focusable", "false");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute(
        "d",
        direction === "up"
          ? "M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5"
          : "M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5",
      );
      icon.append(path);
      button.append(icon);
      transfer.append(button);
    }
    transfer.append(upload);
    headingRow.append(heading, transfer);
    const workspace = document.createElement("div");
    workspace.className = "qr-template-workspace";
    const panel = document.getElementById("qrSettings");
    panel.hidden = false;
    if (!document.getElementById("templateTestContent")) {
      const testGroup = document.createElement("div");
      testGroup.className = "template-test-content template-library";
      const label = document.createElement("label");
      label.htmlFor = "templateTestContent";
      label.textContent = t("Testinhalt");
      const input = document.createElement("input");
      input.type = "text";
      input.id = "templateTestContent";
      input.value = templateTestContent;
      input.placeholder = DEMO_QR_CONTENT;
      const error = document.createElement("p");
      error.setAttribute("role", "status");
      let timer;
      input.addEventListener("input", () => {
        templateTestContent = input.value;
        clearTimeout(timer);
        timer = setTimeout(() => {
          error.textContent = "";
          try {
            renderQRCode(
              document.getElementById("settingsQR"),
              templateTestContent || DEMO_QR_CONTENT,
              readSettings(),
            );
            for (const canvas of document.querySelectorAll(
              ".qr-template-choice canvas",
            ))
              if (canvas.templateAppearance)
                renderQRCode(
                  canvas,
                  templateTestContent || DEMO_QR_CONTENT,
                  canvas.templateAppearance,
                );
          } catch (problem) {
            error.textContent = problem.message;
          }
        }, 180);
      });
      testGroup.append(label, input, error);
      panel.querySelector(".appearance-workbench").prepend(testGroup);
    }
    document.querySelector(".template-test-content label").textContent =
      t("Testinhalt");
    const grid = document.createElement("div");
    grid.className = "qr-template-choices";
    const search = document.createElement("input");
    search.type = "search";
    search.className = "qr-template-search";
    search.value = qrTemplateSearch;
    search.id = "qrTemplateSearch";
    const searchGroup = document.createElement("div");
    searchGroup.className = "qr-template-search-group template-library";
    const searchLabel = document.createElement("label");
    searchLabel.htmlFor = search.id;
    searchLabel.textContent = t("Templates suchen");
    const searchField = document.createElement("div");
    searchField.className = "qr-template-search-field";
    searchField.append(search);
    searchGroup.append(searchLabel, searchField);
    search.placeholder = t("QR-Code-Templates suchen …");
    search.setAttribute("aria-label", t("QR-Code-Templates suchen …"));
    const empty = document.createElement("p");
    empty.className = "qr-template-no-results";
    empty.setAttribute("role", "status");
    empty.textContent = t("Keine passenden Templates.");
    empty.hidden = true;
    function filterCards() {
      const query = qrTemplateSearch.trim().toLocaleLowerCase();
      let matches = 0;
      for (const card of grid.querySelectorAll(".qr-template-card")) {
        card.hidden = !card.dataset.name.toLocaleLowerCase().includes(query);
        if (!card.hidden) matches++;
      }
      empty.hidden = !query || matches > 0;
    }
    search.addEventListener("input", () => {
      qrTemplateSearch = search.value;
      filterCards();
      grid.scrollTop = 0;
    });
    enableTemplateReordering(grid);
    const testContentGroup = panel.querySelector(".template-test-content");
    workspace.append(searchGroup, panel, grid);
    host.prepend(headingRow, testContentGroup, workspace);
    generateQRCode();
    qrPresets.beginEditing();
    const add = document.createElement("button");
    add.type = "button";
    add.className = "qr-template-new";
    add.setAttribute("aria-label", t("Neues Template erstellen"));
    const addIcon = document.createElement("span");
    addIcon.className = "logo-add";
    addIcon.setAttribute("aria-hidden", "true");
    add.append(addIcon);
    const createTemplate = async () => {
      if ((await qrPresets.createNew()) === false) return;
      qrTemplateSearch = "";
      newQRTemplate = true;
      renderTemplateGallery();
    };
    add.addEventListener("click", createTemplate);
    grid.prepend(add);
    grid.append(empty);
    filterCards();
    for (const entry of entries) {
      const card = document.createElement("article");
      card.className = "qr-template-card";
      card.classList.toggle(
        "is-selected",
        entry.id === qrPresets.getSelected(),
      );
      card.dataset.id = entry.id;
      card.dataset.name = entry.name;
      card.draggable = true;
      const select = document.createElement("button");
      select.type = "button";
      select.className = "qr-template-choice";
      select.setAttribute(
        "aria-pressed",
        String(entry.id === qrPresets.getSelected()),
      );
      const preview = document.createElement("canvas");
      const name = document.createElement("span");
      name.textContent = entry.name;
      select.append(preview, name);
      select.addEventListener("click", async () => {
        if ((await qrPresets.choose(entry)) === false) return;
        newQRTemplate = false;
        for (const item of grid.querySelectorAll(".qr-template-card")) {
          const selected = item.dataset.id === qrPresets.getSelected();
          item.classList.toggle("is-selected", selected);
          item
            .querySelector(".qr-template-choice")
            .setAttribute("aria-pressed", String(selected));
        }
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "saved-logo-delete";
      remove.setAttribute("aria-label", t("Template löschen: ") + entry.name);
      remove.addEventListener("click", async () => {
        await qrPresets.remove(entry);
        if (activeMode === "templates") renderTemplateGallery();
      });
      card.append(select, remove);
      grid.insertBefore(card, empty);
      filterCards();
      try {
        let logo = null;
        if (entry.payload.logoData) {
          logo = new Image();
          logo.src = entry.payload.logoData;
          await logo.decode();
        }
        if (version !== galleryVersion) return;
        preview.templateAppearance = {
          ...entry.payload.appearance,
          size: EXPORT_SIZE,
          logo,
        };
        renderQRCode(
          preview,
          templateTestContent || DEMO_QR_CONTENT,
          preview.templateAppearance,
        );
      } catch {
        preview.replaceWith(
          Object.assign(document.createElement("span"), {
            textContent: t("Vorschau nicht verfügbar."),
          }),
        );
      }
    }
    const previewHost = panel.querySelector(".settings-live-preview");
    previewHost.querySelector(".qr-preview-add")?.remove();
    const previewAdd = document.createElement("button");
    previewAdd.type = "button";
    previewAdd.className = "logo-add qr-preview-add";
    previewAdd.textContent = "+";
    previewAdd.title = t("Neues Template erstellen");
    previewAdd.setAttribute("aria-label", t("Neues Template erstellen"));
    previewAdd.addEventListener("click", createTemplate);
    previewHost.append(previewAdd);
  }
  document.addEventListener("qr-templates-changed", () => {
    newQRTemplate = false;
    if (activeMode === "templates") renderTemplateGallery();
  });
  async function renderTemplateGallery() {
    const version = ++galleryVersion;
    const host = document.getElementById("templatesSection");
    const settings = document.getElementById("qrSettings");
    if (host.contains(settings))
      document.getElementById("singleEditorSlot").append(settings);
    host.replaceChildren();
    await renderQRTemplateWorkspace(host, version);
    if (version !== galleryVersion || activeMode !== "templates") return;
  }
  let cartSearch = "";
  function renderCartGallery() {
    const host = document.getElementById("cartsSection");
    host.replaceChildren();
    const transfer = document.createElement("div");
    transfer.className = "template-transfer cart-transfer";
    const upload = document.createElement("input");
    upload.type = "file";
    upload.accept = ".json";
    upload.hidden = true;
    upload.addEventListener("change", async () => {
      if (upload.files[0]) {
        await templateLibrary.importFile(upload.files[0]);
        renderCartGallery();
      }
    });
    for (const [label, action, pathData] of [
      [
        "Carts importieren",
        () => upload.click(),
        "M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5",
      ],
      [
        "Carts exportieren",
        () => templateLibrary.exportFile(),
        "M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5",
      ],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.title = t(label);
      button.setAttribute("aria-label", t(label));
      button.addEventListener("click", action);
      if (label === "Carts exportieren")
        button.disabled = !templateLibrary.getEntries().length;
      button.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
        pathData +
        '"/></svg>';
      transfer.append(button);
    }
    transfer.append(upload);
    host.append(transfer);
    const searchGroup = document.createElement("div");
    searchGroup.className = "qr-template-search-group template-library";
    const searchLabel = document.createElement("label");
    searchLabel.textContent = t("Carts suchen");
    searchLabel.htmlFor = "cartSearch";
    const searchField = document.createElement("div");
    searchField.className = "qr-template-search-field";
    const search = document.createElement("input");
    search.type = "search";
    search.id = "cartSearch";
    search.className = "qr-template-search";
    search.value = cartSearch;
    search.setAttribute("aria-label", t("Carts suchen"));
    search.addEventListener("input", () => {
      cartSearch = search.value;
      for (const card of host.querySelectorAll(".template-card"))
        card.hidden = !card.dataset.name.includes(
          cartSearch.toLocaleLowerCase(),
        );
    });
    searchField.append(search);
    searchGroup.append(searchLabel, searchField);
    host.append(searchGroup);
    const groups = [
      [
        t("Carts: Einzelner QR-Code"),
        templateLibrary.getEntries().filter((item) => item.kind === "single"),
        "single",
      ],
      [
        t("Carts: Massenexport"),
        templateLibrary.getEntries().filter((item) => item.kind === "bulk"),
        "bulk",
      ],
    ];
    for (const [title, entries, kind] of groups) {
      const heading = document.createElement("h2");
      heading.textContent = title;
      host.append(heading);

      const grid = document.createElement("div");
      grid.className = "template-gallery";
      host.append(grid);
      enableTemplateReordering(grid, (ids) =>
        templateLibrary.reorder(kind, ids),
      );

      for (const entry of entries) {
        const card = document.createElement("article");
        card.className = "template-card qr-template-card";
        card.dataset.id = entry.id;
        card.dataset.name = entry.name.toLocaleLowerCase();
        card.hidden = !card.dataset.name.includes(
          cartSearch.toLocaleLowerCase(),
        );
        card.draggable = true;
        const preview = document.createElement("canvas");
        preview.setAttribute("aria-label", entry.name);
        const name = document.createElement("h3");
        name.textContent = entry.name;
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "cart-template-choice";
        edit.setAttribute("aria-label", t("Cart anpassen") + ": " + entry.name);
        edit.append(preview, name);
        edit.addEventListener("click", () => openCartTemplate(entry, kind));
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "saved-logo-delete";
        remove.setAttribute("aria-label", t("Template löschen: ") + entry.name);
        remove.addEventListener("click", async () => {
          await templateLibrary.remove(entry);
          renderCartGallery();
        });
        card.append(edit, remove);
        grid.append(card);
        try {
          let appearance = {
            ...cartAppearance.settings(entry.payload.layout),
            size: 360,
          };
          const qr = document.createElement("canvas");
          renderQRCode(qr, DEMO_QR_CONTENT, appearance);
          let result = qr;
          if (kind !== "qr") {
            const layout = structuredClone(entry.payload.layout);
            layout.styles ||= {};
            layout.custom ||= {};
            layout.labels ||= {};
            const record = {
              URL: DEMO_QR_CONTENT,
              Titel: kind === "single" ? "{title}" : "{Titel}",
              Untertitel: kind === "single" ? "{subtitle}" : "{Untertitel}",
              Metrics: {},
            };
            for (const key of [...layout.above, ...layout.below])
              record.Metrics[key] = "{" + key + "}";
            record.Raw = Object.fromEntries(
              [
                ...new Set([
                  "Titel",
                  "Untertitel",
                  ...Object.keys(record.Metrics),
                  ...Object.values(layout.sources || {}),
                ]),
              ]
                .filter(Boolean)
                .map((key) => [key, "{" + key + "}"]),
            );
            result = createLabeledCanvas(
              qr,
              record.Titel,
              record.Untertitel,
              "",
              "",
              record,
              layout,
            );
          }
          preview.width = result.width;
          preview.height = result.height;
          preview.getContext("2d").drawImage(result, 0, 0);
        } catch {
          preview.replaceWith(
            Object.assign(document.createElement("p"), {
              textContent: t("Vorschau nicht verfügbar."),
            }),
          );
        }
      }
    }
  }
  function setImportVisible(visible) {
    activeMode = ["templates", "carts"].includes(visible)
      ? visible
      : visible
        ? "bulk"
        : "single";
    const pageURL = new URL(location.href);
    pageURL.searchParams.set("tab", activeMode);
    try {
      history.replaceState(history.state, "", pageURL);
    } catch {
      /* Some file:// environments restrict History API updates. */
    }
    document.getElementById("templatesSection").hidden =
      activeMode !== "templates";
    document.getElementById("cartsSection").hidden = activeMode !== "carts";
    bulkImport.hidden = activeMode !== "bulk";
    document.getElementById("openCSVConverter").hidden = activeMode !== "bulk";
    document.getElementById("singleSection").hidden = activeMode !== "single";
    for (const [id, selected] of [
      ["toggleImportBtn", activeMode === "bulk"],
      ["toggleSingleBtn", activeMode === "single"],
      ["toggleTemplatesBtn", activeMode === "templates"],
      ["toggleCartsBtn", activeMode === "carts"],
    ]) {
      const tab = document.getElementById(id);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    if (layoutDialog.open) {
      editorSnapshot = null;
      layoutDialog.close();
      saveLayout();
    }
    document.getElementById("qrSettings").hidden = true;
    showMainPreviews();
    generateQRCode();
    saveSettings();
    if (activeMode === "templates") renderTemplateGallery();
    if (activeMode === "carts") renderCartGallery();
  }
  toggleImportBtn.addEventListener("click", () => setImportVisible(true));
  document
    .getElementById("toggleSingleBtn")
    .addEventListener("click", () => setImportVisible(false));
  document
    .getElementById("toggleTemplatesBtn")
    .addEventListener("click", () => setImportVisible("templates"));
  document
    .getElementById("toggleCartsBtn")
    .addEventListener("click", () => setImportVisible("carts"));
  document.querySelector(".mode-tabs").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const modes = ["single", "bulk", "templates", "carts"];
    const index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 3
          : (modes.indexOf(activeMode) + (event.key === "ArrowRight" ? 1 : 3)) %
            4;
    setImportVisible(index > 1 ? modes[index] : index === 1);
    document.querySelector('.mode-tabs [aria-selected="true"]').focus();
  });
  dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });

  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      loadFile(e.target.files[0]);
    }
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if (file) {
      loadFile(file);
    }
  });

  const mappingDialog = document.getElementById("mappingDialog");
  const mappingError = document.getElementById("mappingError");
  const mappingForm = document.getElementById("mappingForm");
  const mappingSubmitBtn = document.getElementById("mappingSubmitBtn");
  const manualBaseURL = document.getElementById("manualBaseURL");
  const baseURLStorageKey = "qr-generator.base-urls.v1";
  const savedBaseURLs = document.getElementById("savedBaseURLs");
  const baseURLStorageStatus = document.getElementById("baseURLStorageStatus");

  function readSavedBaseURLs() {
    try {
      const values = JSON.parse(
        localStorage.getItem(baseURLStorageKey) || "[]",
      );
      return Array.isArray(values) ? [...new Set(values.filter(isWebURL))] : [];
    } catch {
      return [];
    }
  }

  function writeSavedBaseURLs(values) {
    try {
      localStorage.setItem(baseURLStorageKey, JSON.stringify(values));
      setMessage(baseURLStorageStatus, () => "");
      return true;
    } catch {
      setMessage(
        baseURLStorageStatus,
        () =>
          t(
            "Die gespeicherten Basis-URLs konnten nicht aktualisiert werden. Der Import ist trotzdem möglich.",
          ),
        "warning",
      );
      return false;
    }
  }

  const baseURLCombo = document.getElementById("baseURLCombo");
  function closeSavedBaseURLs() {
    savedBaseURLs.hidden = true;
    manualBaseURL.setAttribute("aria-expanded", "false");
    document
      .getElementById("baseURLDropdownBtn")
      .setAttribute("aria-expanded", "false");
    baseURLCombo.classList.remove("is-open");
  }
  manualBaseURL.addEventListener("click", () => renderSavedBaseURLs(true));
  document
    .getElementById("baseURLDropdownBtn")
    .addEventListener("click", () => {
      if (savedBaseURLs.hidden) renderSavedBaseURLs(true);
      else closeSavedBaseURLs();
      manualBaseURL.focus();
    });
  manualBaseURL.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      renderSavedBaseURLs(true);
      savedBaseURLs.querySelector("button")?.focus();
    }
  });
  baseURLCombo.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !savedBaseURLs.hidden) {
      event.preventDefault();
      event.stopPropagation();
      closeSavedBaseURLs();
      manualBaseURL.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!baseURLCombo.contains(event.target)) closeSavedBaseURLs();
  });
  baseURLCombo.addEventListener("focusout", (event) => {
    if (!baseURLCombo.contains(event.relatedTarget)) closeSavedBaseURLs();
  });

  function renderSavedBaseURLs(open = false) {
    const values = readSavedBaseURLs();
    document.getElementById("baseURLDropdownBtn").hidden = values.length === 0;
    baseURLCombo.classList.toggle("has-suggestions", values.length > 0);
    savedBaseURLs.replaceChildren();
    const expanded = open && values.length > 0;
    savedBaseURLs.hidden = !expanded;
    manualBaseURL.setAttribute("aria-expanded", String(expanded));
    document
      .getElementById("baseURLDropdownBtn")
      .setAttribute("aria-expanded", String(expanded));
    baseURLCombo.classList.toggle("is-open", expanded);
    for (const url of values) {
      const row = document.createElement("div");
      row.className = "saved-base-url";
      const select = document.createElement("button");
      select.type = "button";
      select.className = "saved-base-url-select";
      select.textContent = url;
      select.addEventListener("click", () => {
        manualBaseURL.value = url;
        updateMappingSubmit();
        closeSavedBaseURLs();
        manualBaseURL.focus();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "saved-base-url-remove";
      remove.textContent = "×";
      remove.setAttribute(
        "aria-label",
        t("Gespeicherte Basis-URL löschen: ") + url,
      );
      remove.title = t("Basis-URL löschen");
      remove.addEventListener("click", async () => {
        if (!(await confirmDeletion())) return;
        if (
          writeSavedBaseURLs(
            readSavedBaseURLs().filter((value) => value !== url),
          )
        ) {
          renderSavedBaseURLs(true);
          manualBaseURL.focus();
        }
      });
      row.append(select, remove);
      savedBaseURLs.append(row);
    }
  }

  function saveBaseURL(value) {
    const url = value.trim().replace(/\/+$/, "") + "/";
    const others = readSavedBaseURLs().filter(
      (saved) => saved.replace(/\/+$/, "") !== url.replace(/\/+$/, ""),
    );
    writeSavedBaseURLs([url, ...others]);
  }
  const mappingFields = Object.fromEntries(
    ["Titel", "Untertitel", "URL", "Base_URL", "Interne_ID"].map((key) => [
      key,
      document.getElementById("map" + key),
    ]),
  );
  let pendingImport = null;
  let urlMode = "full";
  function setURLMode(mode) {
    urlMode = mode;
    closeSavedBaseURLs();
    for (const [name, radioId, groupId, input] of [
      ["full", "urlModeFull", "fullURLGroup", mappingFields.URL],
      ["base", "urlModeBase", "baseURLGroup", mappingFields.Base_URL],
      ["manual", "urlModeManual", "manualBaseURLGroup", manualBaseURL],
    ]) {
      const active = name === mode;
      document.getElementById(radioId).checked = active;
      document.getElementById(groupId).hidden = !active;
      input.disabled = !active;
      input.required = active;
    }
    mappingFields.Interne_ID.required = mode !== "full";
    setMessage(mappingError, () => "");
    updateMappingSubmit();
  }
  for (const [id, mode] of [
    ["urlModeFull", "full"],
    ["urlModeBase", "base"],
    ["urlModeManual", "manual"],
  ]) {
    document
      .getElementById(id)
      .addEventListener("change", () => setURLMode(mode));
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function extractRecords(data) {
    if (isRecord(data)) {
      const lists = Object.values(data).filter(Array.isArray);
      if (lists.length !== 1)
        throw new LocalizedError(() =>
          t(
            "Erwartet wird eine Liste von Einträgen oder ein Objekt mit genau einer solchen Liste.",
          ),
        );
      data = lists[0];
    }
    if (!Array.isArray(data) || !data.length || !data.every(isRecord)) {
      throw new LocalizedError(() =>
        t("Die Datei muss eine nicht leere Liste von Objekten enthalten."),
      );
    }
    if (data.some((row) => !Object.keys(row).length))
      throw new LocalizedError(() => t("Die Liste enthält leere Einträge."));
    return data;
  }

  function isWebURL(value) {
    if (
      typeof value !== "string" ||
      !/^https?:\/\//i.test(value.trim()) ||
      /\s/.test(value.trim())
    )
      return false;
    try {
      const url = new URL(value.trim());
      return Boolean(url.hostname);
    } catch {
      return false;
    }
  }

  function flattenMetrics(record, prefix = "", depth = 0) {
    const result = {};
    for (const [key, value] of Object.entries(record)) {
      const path = prefix ? prefix + " > " + key : key;
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        depth < 12
      )
        Object.assign(result, flattenMetrics(value, path, depth + 1));
      else if (
        Array.isArray(value) &&
        value.some((item) => item && typeof item === "object") &&
        depth < 12
      )
        Object.assign(result, flattenMetrics(value, path, depth + 1));
      else result[path] = value;
    }
    return result;
  }
  function normalizeRecords(records, mapping, enteredBaseURL = "") {
    if (!mapping.URL && !mapping.Base_URL && !enteredBaseURL.trim())
      throw new LocalizedError(() =>
        t(
          "Bitte wählen Sie ein URL-Feld aus oder geben Sie eine Basis-URL ein und wählen Sie das ID-Feld.",
        ),
      );
    return records.map((row, index) => {
      const fullURL = mapping.URL ? row[mapping.URL] : null;
      let url = fullURL;
      if (fullURL == null || (typeof fullURL === "string" && !fullURL.trim())) {
        const mappedBase = mapping.Base_URL ? row[mapping.Base_URL] : null;
        const base =
          mappedBase == null ||
          (typeof mappedBase === "string" && !mappedBase.trim())
            ? enteredBaseURL.trim()
            : mappedBase;
        const id = mapping.Interne_ID ? row[mapping.Interne_ID] : null;
        if (
          !isWebURL(base) ||
          !["string", "number"].includes(typeof id) ||
          (typeof id === "number" && !Number.isFinite(id)) ||
          !String(id).trim()
        ) {
          throw new LocalizedError(
            () =>
              t("Eintrag ") +
              (index + 1) +
              t(
                ": Eine vollständige URL oder eine gültige Basis-URL mit ID ist erforderlich.",
              ),
          );
        }
        const parsedBase = new URL(base.trim());
        if (parsedBase.search || parsedBase.hash)
          throw new LocalizedError(
            () =>
              t("Eintrag ") +
              (index + 1) +
              t(
                ": Die Basis-URL darf keine Abfrageparameter oder Sprungmarke enthalten.",
              ),
          );
        const encodedId = encodeURIComponent(String(id).trim());
        if (encodedId === "." || encodedId === "..")
          throw new LocalizedError(
            () => t("Eintrag ") + (index + 1) + t(": Ungültige ID."),
          );
        url = base.trim().replace(/\/+$/, "") + "/" + encodedId;
      }
      if (!isWebURL(url))
        throw new LocalizedError(
          () =>
            t("Eintrag ") +
            (index + 1) +
            t(
              ": Das gewählte URL-Feld muss eine vollständige HTTP- oder HTTPS-Adresse enthalten.",
            ),
        );
      const result = { URL: url.trim() };
      for (const field of ["Titel", "Untertitel", "Interne_ID"]) {
        const value = mapping[field] ? row[mapping[field]] : null;
        if (
          value != null &&
          typeof value !== "string" &&
          !(typeof value === "number" && Number.isFinite(value))
        ) {
          throw new LocalizedError(
            () =>
              t("Eintrag ") +
              (index + 1) +
              t(": Das Feld für ") +
              field +
              t(
                " muss Text oder eine Zahl enthalten. Sie können es auch weglassen.",
              ),
          );
        }
        result[field] = value == null ? "" : String(value).trim();
      }
      result.Linien = formatLines(row.Linien);
      result.FixedMetrics = [mapping.Titel, mapping.Untertitel].filter(Boolean);
      result.Metrics = flattenMetrics(
        Object.fromEntries(
          Object.entries(row).filter(
            ([key]) => !result.FixedMetrics.includes(key),
          ),
        ),
      );
      if (Object.hasOwn(row, "Linien")) result.Metrics.Linien = result.Linien;
      return result;
    });
  }

  function acceptImport(records, filename) {
    loadedData = records;
    setMessage(
      info,
      () =>
        t("Dateiname: ") +
        filename +
        "\n" +
        t("Anzahl der Einträge: ") +
        records.length,
    );
    generateBtn.disabled = true;
    setMessage(statusDiv, () => "");
    pendingImport = null;
    mappingDialog.close();
    generateQRCode();
    renderVariableChips();
    checkImportedCarts();
  }

  function selectedMapping() {
    const mapping = Object.fromEntries(
      Object.entries(mappingFields).map(([field, select]) => [
        field,
        select.value,
      ]),
    );
    if (urlMode !== "full") mapping.URL = "";
    if (urlMode !== "base") mapping.Base_URL = "";
    return mapping;
  }

  function updateMappingSubmit() {
    mappingSubmitBtn.disabled = !pendingImport;
    if (!pendingImport) return;
    try {
      normalizeRecords(
        pendingImport.records,
        selectedMapping(),
        urlMode === "manual" ? manualBaseURL.value : "",
      );
      mappingSubmitBtn.disabled = false;
    } catch {
      mappingSubmitBtn.disabled = true;
    }
  }
  mappingForm.addEventListener("input", updateMappingSubmit);
  mappingForm.addEventListener("change", updateMappingSubmit);

  function cancelMapping() {
    pendingImport = null;
    mappingDialog.close();
    setMessage(statusDiv, () =>
      t("Import abgebrochen. Bitte wählen Sie eine JSON-Datei aus."),
    );
  }
  document
    .getElementById("cancelMappingBtn")
    .addEventListener("click", cancelMapping);
  mappingDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    cancelMapping();
  });
  mappingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!pendingImport) return;
    try {
      const records = normalizeRecords(
        pendingImport.records,
        selectedMapping(),
        urlMode === "manual" ? manualBaseURL.value : "",
      );
      if (urlMode === "manual") saveBaseURL(manualBaseURL.value);
      acceptImport(records, pendingImport.filename);
    } catch (error) {
      setMessage(mappingError, () => error.message);
    }
  });

  function showMapping(records, filename, keys, mapping, reason) {
    pendingImport = { records, filename };
    manualBaseURL.value = "";
    setMessage(baseURLStorageStatus, () => "");
    renderSavedBaseURLs();
    for (const [field, select] of Object.entries(mappingFields)) {
      select.replaceChildren();
      const empty = document.createElement("option");
      empty.value = "";
      empty.textContent =
        field === "URL" ? t("URL-Feld auswählen …") : t("Nicht verwenden");
      select.append(empty);
      for (const key of keys) {
        const option = document.createElement("option");
        option.value = key;
        const example = records.find(
          (row) => row[key] != null && row[key] !== "",
        )?.[key];
        option.textContent =
          key + (example == null ? "" : " — " + String(example).slice(0, 70));
        select.append(option);
      }
      select.value = mapping[field] || "";
    }
    const simple =
      !mapping.URL &&
      !mapping.Base_URL &&
      ["Titel", "Untertitel", "Interne_ID"].every((field) => mapping[field]) &&
      records.every((row) =>
        ["Titel", "Untertitel", "Interne_ID"].every((field) =>
          row[mapping[field]] == null
            ? field !== "Interne_ID"
            : ["string", "number"].includes(typeof row[mapping[field]]) &&
              (field !== "Interne_ID" ||
                String(row[mapping[field]]).trim() !== ""),
        ),
      );
    document.getElementById("urlModeChoices").hidden = simple;
    document.getElementById("recordMappingFields").hidden = simple;
    setMessage(document.getElementById("mappingHeading"), () =>
      simple ? t("Basis-URL ergänzen") : t("JSON-Felder zuordnen"),
    );
    setMessage(document.getElementById("mappingHelp"), () =>
      simple
        ? t(
            "Titel, Untertitel und interne ID wurden erkannt. Bitte ergänzen Sie nur die Basis-URL.",
          )
        : t(
            "Wählen Sie genau eine der drei Möglichkeiten für die URL. Titel und Untertitel sind optional.",
          ),
    );
    setURLMode(mapping.URL ? "full" : mapping.Base_URL ? "base" : "manual");
    setMessage(mappingError, () => (simple ? "" : reason()));
    setMessage(statusDiv, () => t("Bitte ordnen Sie die JSON-Felder zu."));
    mappingDialog.showModal();
    if (simple) manualBaseURL.focus();
  }

  async function loadFile(file) {
    if (isGenerating) return;
    const version = ++fileLoadVersion;
    pendingImport = null;
    mappingDialog.close();
    loadedData = null;
    layoutSample = null;
    generateQRCode();
    generateBtn.disabled = true;
    setMessage(info, () => "");
    setMessage(statusDiv, () => t("Datei wird geladen …"));
    try {
      const { text } = await window.QRGenerator["qr-content"].readTextFile(file);
      const data = /\.(csv|tsv)$/i.test(file.name)
        ? window.QRGenerator["qr-content"].recordsFromCSV(text)
        : JSON.parse(text);
      if (version !== fileLoadVersion) return;
      const rows = window.QRGenerator["qr-content"].recordsFromJSON(data);
      if (!bulkLayout.contentExpression)
        bulkLayout.contentExpression =
          window.QRGenerator["qr-content"].defaultExpression(rows);
      window.QRGenerator["cart-fields"].detect(bulkLayout, rows);
      document.getElementById("clearBulkData").hidden = true;
      const records = rows.map((row) => ({
        Raw: row,
        URL: "",
        Titel: metricValue(row.Titel),
        Untertitel: metricValue(row.Untertitel),
        Interne_ID: metricValue(row.Interne_ID),
        Linien: formatLines(row.Linien),
        FixedMetrics: ["Titel", "Untertitel"].filter((key) =>
          Object.hasOwn(row, key),
        ),
        Metrics: { ...row },
      }));
      acceptImport(records, file.name);
      contentEditor.validate();
      await openLayoutEditor("bulk");
      if (!window.QRGenerator["cart-fields"].titleValid(bulkLayout, loadedData))
        document.getElementById("cartTitleSource").focus();
    } catch (error) {
      if (version !== fileLoadVersion) return;
      setMessage(
        statusDiv,
        () =>
          t("Ungültige Datei: ") +
          (error instanceof SyntaxError
            ? t("Ungültige JSON-Syntax. Bitte prüfen Sie die Datei.")
            : error.message),
      );
    } finally {
      if (version === fileLoadVersion) fileInput.value = "";
    }
  }

  function sanitizeFilename(text) {
    return (
      String(text || "QR")
        .normalize("NFC")
        .replace(/,/g, "")
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 120)
        .replace(/[. ]+$/g, "") || "QR"
    );
  }

  const settingsStorageKey = "qr-generator.settings.v1";
  function saveSettings() {
    if (editorSnapshot) return;
    try {
      const { logo, ...appearance } = readSettings();
      localStorage.setItem(
        settingsStorageKey,
        JSON.stringify({
          ...appearance,
          preview: showBulkPreview.checked,
          logoData: logoState.data,
          format: document.getElementById("exportFormat").value,
          singleFormat: document.getElementById("singleFormat").value,
        }),
      );
    } catch {
      /* Preferences are optional when browser storage is unavailable. */
    }
  }
  function restoreSettings() {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(settingsStorageKey) || "null");
    } catch {
      return;
    }
    if (!saved || typeof saved !== "object") return;
    for (const [key, control] of [
      ["shape", shapeSelect],
      ["finderShape", finderShapeSelect],
    ]) {
      if (
        Array.from(control.options).some(
          (option) => option.value === saved[key],
        )
      )
        control.value = saved[key];
    }
    for (const [key, control] of [
      ["color", colorPicker],
      ["finderColor", finderColorPicker],
    ]) {
      if (typeof saved[key] === "string" && /^#[0-9a-f]{6}$/i.test(saved[key]))
        control.value = saved[key];
    }

    if (["png", "svg"].includes(saved.format))
      document.getElementById("exportFormat").value = saved.format;
    if (["png", "svg"].includes(saved.singleFormat))
      document.getElementById("singleFormat").value = saved.singleFormat;
    if (typeof saved.preview === "boolean")
      showBulkPreview.checked = saved.preview;
    const storedLogo =
      readSavedLogos().find((item) => item.data === saved.logoData) ||
      (typeof saved.logoData === "string" &&
      saved.logoData.length < 500000 &&
      /^data:image\/png;base64,/.test(saved.logoData)
        ? { data: saved.logoData }
        : null);
    if (storedLogo) {
      const version = ++logoState.version;
      const image = new Image();
      image.src = storedLogo.data;
      image
        .decode()
        .then(() => {
          if (
            version !== logoState.version ||
            !image.naturalWidth ||
            image.naturalWidth !== image.naturalHeight ||
            image.naturalWidth > 256
          )
            return;
          logoState.image = image;
          logoState.data = storedLogo.data;

          renderSavedLogos();
          generateQRCode();
        })
        .catch(() => {});
    }
  }

  function readSettings() {
    return {
      shape: shapeSelect.value,
      finderShape: finderShapeSelect.value,
      color: colorPicker.value,
      finderColor: finderColorPicker.value,
      logo: logoState.image,
      size: EXPORT_SIZE,
    };
  }

  const bulkLayout = {
    above: [],
    below: ["Interne_ID", "Linien"],
    labels: {},
    custom: {},
    styles: {},
    ribbon: {
      enabled: true,
      rules: [
        {
          id: "test",
          match: "contains",
          pattern: ".test.",
          text: "TST",
          color: "#2563eb",
        },
      ],
    },
  };
  const singleLayout = {
    above: [],
    below: [],
    labels: {},
    custom: {},
    styles: {},
    ribbon: bulkLayout.ribbon,
  };
  let metricLayout = bulkLayout;
  let editorMode = "bulk";
  const layoutStorageKey = "qr-generator.layout.v1";
  function saveLayout() {
    renderVariableChips();
    renderBulkPreview();
    if (editorSnapshot) return;
    try {
      localStorage.setItem(layoutStorageKey, JSON.stringify(bulkLayout));
      localStorage.setItem(
        "qr-generator.single-layout.v1",
        JSON.stringify(singleLayout),
      );
    } catch {
      /* Optional local preferences. */
    }
  }
  function restoreLayout() {
    for (const [layout, storageKey] of [
      [bulkLayout, layoutStorageKey],
      [singleLayout, "qr-generator.single-layout.v1"],
    ]) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (
          !saved ||
          !Array.isArray(saved.above) ||
          !Array.isArray(saved.below)
        )
          continue;
        if (
          layout === bulkLayout &&
          typeof saved.contentExpression === "string"
        ) {
          layout.contentExpression = saved.contentExpression;
          if (Array.isArray(saved.contentCards))
            layout.contentCards = saved.contentCards.filter(
              (card) =>
                card &&
                ["free", "url", "field"].includes(card.kind) &&
                typeof card.value === "string",
            );
        }
        Object.assign(layout, window.QRGenerator["cart-fields"].clean(saved));
        layout.dateFormat = saved.dateFormat === "us" ? "us" : "eu";
        layout.qrAppearance = saved.qrAppearance;
        layout.qrTemplateId = saved.qrTemplateId;
        layout.headingsMovable = saved.headingsMovable === true;
        const used = new Set();
        for (const area of ["above", "below"])
          layout[area] = saved[area].filter(
            (key) => typeof key === "string" && !used.has(key) && used.add(key),
          );
        for (const prop of ["labels", "custom"])
          layout[prop] = Object.fromEntries(
            Object.entries(saved[prop] || {}).filter(
              ([key, value]) => typeof value === "string",
            ),
          );
        layout.styles = Object.fromEntries(
          Object.entries(saved.styles || {})
            .filter(([key, value]) => value && typeof value === "object")
            .map(([key, value]) => [
              key,
              {
                bold: value.bold === true,
                large: value.large === true,
                black: value.black === true,
              },
            ]),
        );
        if (layout === bulkLayout && saved.ribbon) {
          const ribbon = saved.ribbon;
          if (Array.isArray(ribbon.rules)) {
            layout.ribbon = {
              enabled: ribbon.enabled !== false,
              rules: ribbon.rules
                .filter(
                  (rule) =>
                    rule &&
                    typeof rule.pattern === "string" &&
                    typeof rule.text === "string" &&
                    /^#[0-9a-f]{6}$/i.test(rule.color),
                )
                .map((rule) => ({
                  id: crypto.randomUUID(),
                  match: rule.match === "always" ? "always" : "contains",
                  pattern: rule.pattern,
                  text: Array.from(rule.text).slice(0, 5).join(""),
                  color: rule.color,
                })),
            };
          } else {
            layout.ribbon = {
              enabled: ribbon.mode !== "off",
              rules: [
                {
                  id: crypto.randomUUID(),
                  match:
                    ribbon.mode === "always" || ribbon.previousMode === "always"
                      ? "always"
                      : "contains",
                  pattern: ".test.",
                  text: Array.from(ribbon.text || "TST")
                    .slice(0, 5)
                    .join(""),
                  color: /^#[0-9a-f]{6}$/i.test(ribbon.color)
                    ? ribbon.color
                    : "#2563eb",
                },
              ],
            };
          }
        }
      } catch {
        /* Ignore invalid stored preferences. */
      }
    }
    singleLayout.ribbon = bulkLayout.ribbon;
    for (const area of ["above", "below"])
      singleLayout[area] = singleLayout[area].filter(
        (key) => !["title", "subtitle"].includes(key),
      );
  }
  function matchingRibbon(url, layout = metricLayout) {
    if (!layout.ribbon?.enabled) return null;
    const text = String(url || "").toLowerCase();
    return (
      layout.ribbon.rules.find(
        (rule) =>
          rule.text.trim() &&
          (rule.match === "always" ||
            (rule.pattern.trim() && text.includes(rule.pattern.toLowerCase()))),
      ) || null
    );
  }
  function ribbonVisible(url, layout = metricLayout) {
    return Boolean(matchingRibbon(url, layout));
  }
  function updateRibbonUI() {
    const ribbon = document.getElementById("layoutRibbon");
    const match = matchingRibbon(layoutSample?.URL, metricLayout);
    const fallback = metricLayout.ribbon.rules[0];
    ribbon.textContent = match?.text || fallback?.text || "+";
    ribbon.style.backgroundColor = match?.color || fallback?.color || "#888888";
    ribbon.hidden = false;
    ribbon.classList.toggle("inactive", !match);
    document.getElementById("ribbonEnabled").checked =
      metricLayout.ribbon.enabled;
    document.getElementById("ribbonRulesEnabled").checked =
      metricLayout.ribbon.enabled;
    const count = document.getElementById("ribbonCount");
    count.textContent = String(metricLayout.ribbon.rules.length);
    count.hidden = metricLayout.ribbon.rules.length === 0;
    const bulkCount = document.getElementById("bulkRibbonCount");
    bulkCount.textContent = count.textContent;
    bulkCount.hidden = count.hidden;
  }
  const ribbonDialog = document.getElementById("ribbonDialog");
  function openRibbonEditor() {
    if (!layoutDialog.open) metricLayout = bulkLayout;
    renderRibbonRules();
    ribbonDialog.showModal();
  }
  document
    .getElementById("layoutRibbon")
    .addEventListener("click", openRibbonEditor);
  document
    .getElementById("singleRibbonBtn")
    .addEventListener("click", openRibbonEditor);
  document
    .getElementById("closeRibbonBtn")
    .addEventListener("click", () => ribbonDialog.close());
  document
    .getElementById("applyRibbonBtn")
    .addEventListener("click", () => ribbonDialog.close());
  for (const id of ["ribbonEnabled", "ribbonRulesEnabled"])
    document.getElementById(id).addEventListener("change", (event) => {
      metricLayout.ribbon.enabled = event.target.checked;
      saveLayout();
      updateRibbonUI();
      generateQRCode();
    });
  document.getElementById("addRibbonBtn").addEventListener("click", () => {
    metricLayout.ribbon.rules.push({
      id: crypto.randomUUID(),
      match: "contains",
      pattern: "",
      text: "TST",
      color: "#2563eb",
    });
    saveLayout();
    renderRibbonRules();
    document
      .querySelector("#ribbonRules .ribbon-rule:last-child input[type=text]")
      ?.focus();
  });
  function renderRibbonRules() {
    updateRibbonUI();
    const list = document.getElementById("ribbonRules");
    list.replaceChildren();
    for (const rule of metricLayout.ribbon.rules) {
      const row = document.createElement("div");
      row.className = "metric-row ribbon-rule";
      row.dataset.key = rule.id;
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "metric-handle";
      handle.textContent = "⠿";
      handle.setAttribute("aria-label", t("Eckband verschieben"));
      const fields = document.createElement("div");
      fields.className = "ribbon-rule-fields";
      const mode = document.createElement("select");
      mode.setAttribute("aria-label", t("Eckband"));
      for (const [value, label] of [
        ["contains", "URL enthält"],
        ["always", "Immer verwenden"],
      ]) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = t(label);
        mode.append(option);
      }
      mode.value = rule.match;
      const pattern = document.createElement("input");
      pattern.type = "text";
      pattern.value = rule.pattern;
      pattern.placeholder = "test";
      pattern.setAttribute("aria-label", t("URL enthält"));
      pattern.hidden = rule.match === "always";
      const text = document.createElement("input");
      text.type = "text";
      text.value = rule.text;
      text.maxLength = 5;
      text.placeholder = "TST";
      text.setAttribute(
        "aria-label",
        t("Text") + " — " + t("Maximal 5 Zeichen"),
      );
      const color = document.createElement("input");
      color.type = "color";
      color.value = rule.color;
      color.setAttribute("aria-label", t("Farbe"));
      for (const [control, property] of [
        [mode, "match"],
        [pattern, "pattern"],
        [text, "text"],
        [color, "color"],
      ])
        control.addEventListener("input", () => {
          rule[property] =
            property === "text"
              ? Array.from(control.value).slice(0, 5).join("")
              : control.value;
          if (property === "text") control.value = rule.text;
          pattern.hidden = rule.match === "always";
          saveLayout();
          updateRibbonUI();
          generateQRCode();
        });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "metric-remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", t("Eckband entfernen"));
      remove.addEventListener("click", async () => {
        if (!(await confirmDeletion())) return;
        metricLayout.ribbon.rules = metricLayout.ribbon.rules.filter(
          (item) => item !== rule,
        );
        saveLayout();
        renderRibbonRules();
        updateRibbonUI();
        generateQRCode();
      });
      fields.append(mode, pattern, text, color);
      row.append(handle, fields, remove);
      list.append(row);
      attachRibbonDrag(handle, row, list);
    }
  }
  function attachRibbonDrag(handle, row, list) {
    handle.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const rules = metricLayout.ribbon.rules,
        index = rules.findIndex((rule) => rule.id === row.dataset.key);
      const next = index + (event.key === "ArrowUp" ? -1 : 1);
      if (next < 0 || next >= rules.length) return;
      [rules[index], rules[next]] = [rules[next], rules[index]];
      saveLayout();
      renderRibbonRules();
      updateRibbonUI();
      generateQRCode();
      [...list.children]
        .find((item) => item.dataset.key === row.dataset.key)
        ?.querySelector("button")
        .focus();
    });
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const original = [...list.children],
        bounds = row.getBoundingClientRect(),
        dy = event.clientY - bounds.top;
      const ghost = row.cloneNode(true);
      ghost.classList.add("ribbon-drag-ghost");
      ghost.setAttribute("aria-hidden", "true");
      Object.assign(ghost.style, {
        position: "fixed",
        top: bounds.top + "px",
        left: bounds.left + "px",
        width: bounds.width + "px",
        pointerEvents: "none",
        zIndex: "20",
      });
      ribbonDialog.append(ghost);
      row.classList.add("ribbon-drag-placeholder");
      const move = (e) => {
        if (e.pointerId !== event.pointerId) return;
        ghost.style.top = e.clientY - dy + "px";
        const others = [...list.children].filter((item) => item !== row);
        const next = others.find((item) => {
          const r = item.getBoundingClientRect(),
            transform = getComputedStyle(item).transform;
          const offset =
            !transform || transform === "none"
              ? 0
              : new DOMMatrixReadOnly(transform).m42;
          return e.clientY < r.top - offset + r.height / 2;
        });
        if (row.nextElementSibling !== (next || null)) {
          const before = new Map(
            [...list.children].map((item) => [
              item,
              item.getBoundingClientRect().top,
            ]),
          );
          for (const item of list.children)
            for (const animation of item.getAnimations()) animation.cancel();
          list.insertBefore(row, next || null);
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
            for (const item of list.children)
              if (item !== row)
                item.animate(
                  [
                    {
                      transform:
                        "translateY(" +
                        (before.get(item) - item.getBoundingClientRect().top) +
                        "px)",
                    },
                    { transform: "translateY(0)" },
                  ],
                  { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
                );
        }
        const body = ribbonDialog.querySelector(".modal-scroll-body"),
          rect = body.getBoundingClientRect();
        if (e.clientY < rect.top + 40) body.scrollBy(0, -12);
        if (e.clientY > rect.bottom - 40) body.scrollBy(0, 12);
      };
      const finish = (cancelled = false) => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", cancel);
        document.removeEventListener("keydown", escape);
        ghost.remove();
        row.classList.remove("ribbon-drag-placeholder");
        for (const item of list.children)
          for (const animation of item.getAnimations()) animation.cancel();
        if (cancelled) list.append(...original);
        else {
          const rules = metricLayout.ribbon.rules;
          metricLayout.ribbon.rules = [...list.children].map((item) =>
            rules.find((rule) => rule.id === item.dataset.key),
          );
          saveLayout();
          updateRibbonUI();
          generateQRCode();
        }
      };
      const up = (e) => {
          if (e.pointerId === event.pointerId) finish();
        },
        cancel = (e) => {
          if (e.pointerId === event.pointerId) finish(true);
        };
      const escape = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          finish(true);
        }
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", cancel);
      document.addEventListener("keydown", escape);
    });
  }
  const layoutDialog = document.getElementById("layoutDialog");
  const inlineBody = layoutDialog.querySelector(".modal-scroll-body");
  const ribbonActions = document.createElement("div");
  ribbonActions.className = "cart-ribbon-controls";
  ribbonActions.append(
    layoutDialog.querySelector(".ribbon-switch"),
    document.getElementById("singleRibbonBtn"),
  );
  layoutDialog.querySelector(".preview-ribbon-actions").remove();
  layoutDialog
    .querySelector(".layout-sheet")
    .insertBefore(ribbonActions, document.getElementById("layoutAbove"));
  let layoutSample;
  let availableMetricKeys = [];
  function metricValue(value) {
    if (value == null) return "";
    if (["string", "number", "boolean"].includes(typeof value))
      return String(value).trim();
    if (Array.isArray(value))
      return value
        .filter((item) => ["string", "number"].includes(typeof item))
        .join(", ");
    return "";
  }
  function metricLabel(key, layout = metricLayout) {
    if (["heading:title", "heading:subtitle"].includes(key)) return "";
    return Object.hasOwn(layout.labels || {}, key)
      ? layout.labels[key]
      : key === "Interne_ID"
        ? ""
        : key === "date:current"
          ? t("Datum")
          : key;
  }
  function currentDateText(layout = metricLayout) {
    return new Intl.DateTimeFormat(
      layout.dateFormat === "us" ? "en-US" : "de-CH",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    ).format(new Date());
  }
  function metricValueFor(record, key, layout = metricLayout) {
    if (
      key.startsWith("heading:") &&
      Object.hasOwn(layout.headingText || {}, key)
    )
      return layout.headingText[key];
    if (
      record.Raw &&
      (key.startsWith("heading:") || Object.hasOwn(layout.sources || {}, key))
    ) {
      const source = window.QRGenerator["cart-fields"].source(layout, key);
      return metricValue(record.Raw[source]);
    }
    if (Object.hasOwn(layout.sources || {}, key)) {
      const source=layout.sources[key];
      if(source==='title')return record.Titel || '';
      if(source==='subtitle')return record.Untertitel || '';
      return metricValue(record.Metrics?.[source]);
    }
    if (key === "heading:title") return record.Titel || "";
    if (key === "heading:subtitle") return record.Untertitel || "";
    if (key === "date:current")
      return layout.dateText || currentDateText(layout);
    if (Object.hasOwn(layout.custom || {}, key)) return layout.custom[key];
    return key === "Linien"
      ? formatLines(record.Metrics?.[key])
      : metricValue(record.Metrics?.[key]);
  }
  function metricStyle(key, layout = metricLayout, scale = 1) {
    ensureMovableHeadings(layout);
    const style = layout.styles?.[key] || {};
    const size = Math.round(
      (style.large ? (key === "heading:title" ? 72 : 48) : 36) * scale,
    );
    return {
      font:
        (style.bold ? "bold " : "") +
        size +
        'px "' +
        (window.QRGenerator["cart-fields"].supported.includes(layout.font)
          ? layout.font
          : "Roboto") + '"',
      lineHeight: Math.ceil(size * 1.4),
      color: style.black ? "#111" : "#666",
      size,
    };
  }
  function metricText(record, key, layout = metricLayout) {
    if (layout.hiddenFields?.includes(key)) return "";
    if (Object.hasOwn(layout.custom || {}, key)) return layout.custom[key];
    const value = metricValueFor(record, key, layout);
    if (!value) return "";
    const label = metricLabel(key, layout);
    return label ? label + ": " + value : value;
  }
  function isTestURL(value) {
    return typeof value === "string" && value.toLowerCase().includes(".test.");
  }
  function drawTestRibbon(context, width, layout = metricLayout, url = "") {
    const ribbon = matchingRibbon(url, layout);
    if (!ribbon) return;
    const size = width * 0.13;
    context.save();
    context.fillStyle = ribbon.color;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(size, 0);
    context.lineTo(0, size);
    context.closePath();
    context.fill();
    context.translate(size * 0.32, size * 0.32);
    context.rotate(-Math.PI / 4);
    context.font = "bold " + Math.round(width * 0.028) + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.fillText(ribbon.text, 0, 0, size * 0.7);
    context.restore();
  }
  function singleRecord() {
    const metrics = Object.fromEntries(new URLSearchParams(location.search));
    const title = metrics.title || "",
      subtitle = metrics.subtitle || "";
    delete metrics.title;
    delete metrics.subtitle;
    delete metrics.tab;
    for (const key of ["qrShape", "qrFinderShape", "qrColor", "qrFinderColor", "qrTemplate", "preview"]) delete metrics[key];
    if (Object.hasOwn(metrics, "url")) metrics.url = qrInput.value.trim();
    return {
      URL: qrInput.value.trim() || DEMO_QR_CONTENT,
      Titel: title,
      Untertitel: subtitle,
      Metrics: metrics,
    };
  }
  function updateUnusedParameters() {
    const used = new Set([
      "tab", "qrShape", "qrFinderShape", "qrColor", "qrFinderColor", "qrTemplate", "preview",
      "url",
      "title",
      "subtitle",
      ...singleLayout.above,
      ...singleLayout.below,
    ]);
    const unused = [
      ...new Set(new URLSearchParams(location.search).keys()),
    ].filter((key) => !used.has(key));
    for (const id of ["unusedQueryParameters", "unusedTemplateParameters"]) {
      const node = document.getElementById(id);
      node.hidden =
        !unused.length ||
        (id === "unusedTemplateParameters" && editorMode !== "single");
      node.textContent = unused.length
        ? t("Ungenutzte URL-Parameter: ") + unused.map((key) => "{" + key + "}").join(", ")
        : "";
    }
  }
  async function openLayoutEditor(mode = "bulk") {
    if (typeof mode !== "string") mode = "bulk";
    if (mode === "bulk" && loadedData) contentEditor.validate();
    editorMode = mode;
    document.getElementById("singleRibbonBtn").parentElement.hidden = false;
    if (layoutDialog.parentElement !== document.body)
      document.body.append(layoutDialog);
    layoutDialog.classList.remove("inline-template");
    layoutDialog.classList.add("cart-template-modal");
    document.getElementById("qrSettings").hidden = true;
    updateCartToggle(mode, true);
    metricLayout = mode === "single" ? singleLayout : bulkLayout;
    if (!layoutDialog.open)
      editorSnapshot = {
        layout: structuredClone(metricLayout),
        singleFormat: document.getElementById("singleFormat").value,
        bulkFormat: document.getElementById("exportFormat").value,
      };
    await cartAppearance.attach(metricLayout);
    templateLibrary.renderTemplates();
    const cartLabel = document.getElementById("textTemplateLabel");
    cartLabel.textContent = "Cart Template";
    const cartControls = document.getElementById("cartTemplateControls");
    layoutDialog.querySelector(".modal-scroll-body").prepend(cartControls);
    if (!layoutDialog.open) templateLibrary.markBaseline();
    const demo = {
      URL: DEMO_QR_CONTENT,
      Titel: t("Bern, Bahnhof"),
      Untertitel: t("Kante A"),
      Metrics: {
        Interne_ID: "M-BEISPIEL",
        Linien: "3, 9, 10, 12, 332",
        Hst_SLOID: "ch:1:sloid:7000",
        Hst_DiDok: "8507000",
        Kt_SLOID: "ch:1:sloid:7000:0:1",
        Interner_Bezeichner: t("Richtung Zentrum"),
      },
    };
    if (mode === "single") {
      layoutSample = singleRecord();
      availableMetricKeys = Object.keys(layoutSample.Metrics);
    } else if (loadedData?.length) {
      availableMetricKeys = [
        ...new Set(
          loadedData.flatMap((record) => Object.keys(record.Metrics || {})),
        ),
      ];
      const richest = loadedData.reduce((best, record) =>
        Object.values(record.Metrics).filter(metricValue).length >
        Object.values(best.Metrics).filter(metricValue).length
          ? record
          : best,
      );
      layoutSample = { ...richest, Metrics: { ...richest.Metrics } };
      for (const key of availableMetricKeys) {
        if (!metricValue(layoutSample.Metrics[key]))
          layoutSample.Metrics[key] =
            loadedData.find((record) => metricValue(record.Metrics[key]))
              ?.Metrics[key] || "";
      }
      for (const key of ["Titel", "Untertitel"])
        if (!layoutSample[key])
          layoutSample[key] =
            loadedData.find((record) => record[key])?.[key] || "";
    } else {
      layoutSample = demo;
      availableMetricKeys = Object.keys(demo.Metrics);
    }

    if (editingCartGallery) {
      const keys = [
        ...new Set([
          ...metricLayout.above,
          ...metricLayout.below,
          ...(availableMetricKeys || []),
        ]),
      ].filter(
        (key) =>
          !key.startsWith("heading:") &&
          !key.startsWith("custom:") &&
          key !== "date:current",
      );
      layoutSample = {
        URL: DEMO_QR_CONTENT,
        Titel: mode === "single" ? "title" : "Titel",
        Untertitel: mode === "single" ? "subtitle" : "Untertitel",
        Metrics: Object.fromEntries(keys.map((key) => [key, "{" + key + "}"])),
        Raw: Object.fromEntries(
          [
            ...new Set([
              "Titel",
              "Untertitel",
              ...keys,
              ...Object.values(metricLayout.sources || {}),
            ]),
          ]
            .filter(Boolean)
            .map((key) => [key, "{" + key + "}"]),
        ),
      };
      availableMetricKeys = keys;
    }
    document.getElementById("cancelLayoutBtn").hidden = false;
    ensureMovableHeadings(metricLayout);
    if (mode === "bulk")
      for (const key of ["heading:title", "heading:subtitle"])
        if (![...metricLayout.above, ...metricLayout.below].includes(key))
          metricLayout.below.push(key);
    availableMetricKeys.push(
      ...["heading:title", "heading:subtitle"].filter((key) =>
        metricValueFor(layoutSample, key),
      ),
    );
    updateRibbonUI();
    setMessage(document.getElementById("layoutError"), () => "");
    try {
      const preview = document.getElementById("layoutQR");
      preview.width = preview.height = EXPORT_SIZE;
      preview.getContext("2d").clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
      if (layoutSample.URL)
        setMessage(document.getElementById("layoutError"), () =>
          renderQRCode(
            document.getElementById("layoutQR"),
            layoutSample.URL,
            cartAppearance.settings(metricLayout),
          ),
        );
    } catch (error) {
      setMessage(document.getElementById("layoutError"), () => error.message);
    }
    const fields = window.QRGenerator["cart-fields"];
    fields.render(
      document.getElementById("cartFieldSettings"),
      metricLayout,
      [
        ...new Set(
          [
            ...(loadedData || []).flatMap((record) =>
              Object.keys(record.Raw || {}),
            ),
            ...Object.values(metricLayout.sources || {}),
          ].filter(Boolean),
        ),
      ],
      () => {
        saveLayout();
        renderMetricEditor();
        generateQRCode();
      },
      mode === "bulk",
    );
    contentEditor.render(mode);
    if (editingCartGallery)
      document.getElementById("qrContentEditor").hidden = true;
    if (mode === "bulk") {
      const valid = Boolean(loadedData) && contentEditor.validate();
      generateBtn.disabled = !valid || isGenerating;
    }
    renderMetricEditor();
    if (!layoutDialog.open) layoutDialog.showModal();
    saveLayout();
  }
  function moveMetric(key, destination, position) {
    const source = ["above", "below"].find((area) =>
      metricLayout[area].includes(key),
    );
    if (!source || !["above", "below"].includes(destination)) return;
    const oldIndex = metricLayout[source].indexOf(key);
    metricLayout[source].splice(oldIndex, 1);
    if (source === destination && oldIndex < position) position--;
    metricLayout[destination].splice(
      Math.max(0, Math.min(position, metricLayout[destination].length)),
      0,
      key,
    );
    renderMetricEditor();
    saveLayout();
    [...layoutDialog.querySelectorAll(".metric-handle")]
      .find((handle) => handle.dataset.key === key)
      ?.focus();
  }
  function attachMetricDrag(handle, row, key, area, index) {
    let pointer = null,
      placeholder,
      separator,
      origin,
      finishing = false;
    let offsetX = 0,
      offsetY = 0;
    const containers = [
      document.getElementById("layoutAbove"),
      document.getElementById("layoutBelow"),
    ];
    const reducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animatedItems = () => [
      ...layoutDialog.querySelectorAll(
        ".metric-row:not(.is-dragging), .metric-add, .metric-placeholder, .qr-edit-button",
      ),
    ];
    const rearrange = (change) => {
      const items = animatedItems();
      const before = new Map(
        items.map((item) => [item, item.getBoundingClientRect()]),
      );
      for (const item of items)
        for (const animation of item.getAnimations()) animation.cancel();
      change();
      if (reducedMotion()) return;
      for (const item of items) {
        const from = before.get(item),
          to = item.getBoundingClientRect();
        const dx = from.left - to.left,
          dy = from.top - to.top;
        if (dx || dy)
          item.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0, 0)" },
            ],
            { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
          );
      }
    };
    // Collision tests use final layout positions, not intermediate animated positions.
    const layoutBounds = (item) => {
      const rect = item.getBoundingClientRect();
      const transform = getComputedStyle(item).transform;
      const offset =
        transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
      return {
        top: rect.top - offset,
        bottom: rect.bottom - offset,
        height: rect.height,
      };
    };
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || pointer !== null || finishing) return;
      event.preventDefault();
      pointer = event.pointerId;
      const bounds = row.getBoundingClientRect();
      offsetX = event.clientX - bounds.left;
      offsetY = event.clientY - bounds.top;
      separator = row.nextElementSibling;
      origin = document.createComment("drag origin");
      row.before(origin);
      placeholder = document.createElement("div");
      placeholder.className = "metric-placeholder";
      placeholder.style.height = bounds.height + "px";
      row.before(placeholder);
      Object.assign(row.style, {
        position: "fixed",
        left: bounds.left + "px",
        top: bounds.top + "px",
        width: bounds.width + "px",
        zIndex: "20",
        pointerEvents: "none",
      });
      row.classList.add("is-dragging");
      layoutDialog.append(row);
      handle.setPointerCapture(pointer);
      layoutDialog.classList.add("is-sorting");
      document.addEventListener("keydown", cancelWithEscape);
    });
    handle.addEventListener("pointermove", (event) => {
      if (pointer !== event.pointerId || finishing) return;
      row.style.left = event.clientX - offsetX + "px";
      row.style.top = event.clientY - offsetY + "px";
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const container = containers.find((item) => item.contains(hit));
      if (container && !placeholder.contains(hit) && !separator.contains(hit)) {
        const rows = [...container.children].filter((item) =>
          item.matches(".metric-row"),
        );
        const next = rows.find((item) => {
          const bounds = layoutBounds(item);
          return event.clientY < bounds.top + bounds.height / 2;
        });
        // Each row travels with its trailing + line. The leading + stays at the top.
        const anchor = next || null;
        const currentNext = separator.nextElementSibling;
        if (placeholder.parentElement !== container || currentNext !== anchor)
          rearrange(() => {
            const pair = document.createDocumentFragment();
            pair.append(placeholder, separator);
            container.insertBefore(pair, anchor);
          });
      }
      const scrollBody = layoutDialog.querySelector(".modal-scroll-body");
      const bounds = scrollBody.getBoundingClientRect();
      if (event.clientY < bounds.top + 45) scrollBody.scrollBy(0, -14);
      if (event.clientY > bounds.bottom - 45) scrollBody.scrollBy(0, 14);
    });
    const finish = async (event, cancelled) => {
      if (pointer !== event.pointerId || finishing) return;
      finishing = true;
      document.removeEventListener("keydown", cancelWithEscape);
      if (cancelled) rearrange(() => origin.after(placeholder, separator));
      const destination =
        placeholder.parentElement.id === "layoutAbove" ? "above" : "below";
      const next = separator.nextElementSibling;
      const position = next
        ? metricLayout[destination].indexOf(next.dataset.key)
        : metricLayout[destination].length;
      const to = placeholder.getBoundingClientRect(),
        from = row.getBoundingClientRect();
      if (!reducedMotion()) {
        try {
          await row.animate(
            [
              { transform: "translate(0, 0)" },
              {
                transform: `translate(${to.left - from.left}px, ${to.top - from.top}px)`,
              },
            ],
            {
              duration: 170,
              easing: "cubic-bezier(.2,.8,.2,1)",
              fill: "forwards",
            },
          ).finished;
        } catch {
          /* Interrupted animation. */
        }
      }
      if (handle.hasPointerCapture(pointer))
        handle.releasePointerCapture(pointer);
      pointer = null;
      for (const item of [...animatedItems(), row])
        for (const animation of item.getAnimations()) animation.cancel();
      placeholder.replaceWith(row);
      origin.remove();
      row.classList.remove("is-dragging");
      row.removeAttribute("style");
      layoutDialog.classList.remove("is-sorting");
      finishing = false;
      if (!cancelled) moveMetric(key, destination, position);
    };
    const cancelWithEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finish({ pointerId: pointer }, true);
      }
    };
    handle.addEventListener("pointerup", (event) => finish(event, false));
    handle.addEventListener("pointercancel", (event) => finish(event, true));
    handle.addEventListener("lostpointercapture", (event) => {
      if (!finishing) finish(event, true);
    });
    handle.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowUp") {
        if (index > 0) moveMetric(key, area, index - 1);
        else if (area === "below")
          moveMetric(key, "above", metricLayout.above.length);
      } else {
        if (index < metricLayout[area].length - 1)
          moveMetric(key, area, index + 2);
        else if (area === "above") moveMetric(key, "below", 0);
      }
    });
  }
  function renderMetricEditor() {
    ensureMovableHeadings(metricLayout);
    updateUnusedParameters();
    renderVariableChips();
    const used = new Set([...metricLayout.above, ...metricLayout.below]);
    const remaining = availableMetricKeys.filter(
      (key) =>
        !used.has(key) &&
        !Object.entries(metricLayout.sources || {}).some(
          ([slot, source]) => source === key && used.has(slot),
        ),
    );
    for (const [area, target] of [
      ["above", "layoutAbove"],
      ["below", "layoutBelow"],
    ]) {
      const container = document.getElementById(target);
      container.replaceChildren();
      const addControl = (index) => {
        const slot = document.createElement("div");
        slot.className = "metric-add";
        slot.dataset.area = area;
        slot.dataset.index = String(index);
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "+";
        button.className = "metric-plus";
        button.setAttribute(
          "aria-label",
          t("Feld ") +
            (area === "above" ? t("oberhalb") : t("unterhalb")) +
            t(" des QR-Codes hinzufügen"),
        );
        button.setAttribute("aria-expanded", "false");
        const dropdown = document.createElement("div");
        dropdown.className = "metric-options";
        dropdown.hidden = true;
        dropdown.setAttribute("role", "group");
        dropdown.setAttribute("aria-label", t("Verfügbare Felder"));
        const close = () => {
          dropdown.hidden = true;
          button.setAttribute("aria-expanded", "false");
        };
        for (const key of [
          ...remaining,
          ...(!used.has("date:current") ? ["date:current"] : []),
          "__add_custom__",
        ]) {
          const option = document.createElement("button");
          option.type = "button";
          option.textContent =
            key === "__add_custom__"
              ? t("+ Eigener Text")
              : key === "date:current"
                ? t("Aktuelles Datum")
                : key === "heading:title"
                  ? t("Titel")
                  : key === "heading:subtitle"
                    ? t("Untertitel")
                    : "{" + key + "}";
          option.addEventListener("click", () => {
            if ([...metricLayout.above, ...metricLayout.below].includes(key))
              return;
            const addedKey =
              key === "__add_custom__" ? "custom:" + crypto.randomUUID() : key;
            if (key === "__add_custom__")
              metricLayout.custom[addedKey] = t("Eigener Text");
            metricLayout[area].splice(index, 0, addedKey);
            saveLayout();
            renderMetricEditor();
            [...layoutDialog.querySelectorAll(".metric-handle")]
              .find((handle) => handle.dataset.key === addedKey)
              ?.focus();
            if (key === "__add_custom__")
              [...layoutDialog.querySelectorAll(".metric-row")]
                .find((row) => row.dataset.key === addedKey)
                ?.querySelector(".metric-label")
                ?.click();
          });
          dropdown.append(option);
        }
        button.addEventListener("click", () => {
          const open = dropdown.hidden;
          for (const other of layoutDialog.querySelectorAll(
            ".metric-options",
          )) {
            other.hidden = true;
            other.previousElementSibling?.setAttribute(
              "aria-expanded",
              "false",
            );
          }
          dropdown.hidden = !open;
          button.setAttribute("aria-expanded", String(open));
          if (open) dropdown.querySelector("button")?.focus();
        });
        slot.addEventListener("focusout", (event) => {
          if (!slot.contains(event.relatedTarget)) close();
        });
        slot.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && !dropdown.hidden) {
            event.preventDefault();
            event.stopPropagation();
            close();
            button.focus();
          }
        });
        slot.append(button, dropdown);
        container.append(slot);
      };
      addControl(0);
      metricLayout[area].forEach((key, index) => {
        const row = document.createElement("div");
        row.className = "metric-row";
        row.dataset.key = key;
        row.classList.toggle(
          "is-hidden-field",
          metricLayout.hiddenFields?.includes(key),
        );
        const records =
          editorMode === "bulk"
            ? loadedData
            : [
                {
                  Raw: Object.fromEntries(new URLSearchParams(location.search)),
                },
              ];
        const missing = missingCartKeys(
          {
            above: [key],
            below: [],
            custom: metricLayout.custom,
            sources: metricLayout.sources,
          },
          records,
          editorMode,
        );
        if (missing.length) {
          row.classList.add("is-missing");
          row.title = t("Fehlende Felder: ") + missing.join(", ");
        }
        const handle = document.createElement("button");
        handle.type = "button";
        handle.className = "metric-handle";
        handle.textContent = "⠿";
        handle.dataset.key = key;
        handle.setAttribute(
          "aria-label",
          key + t(" verschieben (ziehen oder Pfeiltasten verwenden)"),
        );
        handle.title = t("Ziehen oder mit den Pfeiltasten verschieben");
        attachMetricDrag(handle, row, key, area, index);
        const text = document.createElement("span");
        text.className = "metric-content";
        const label = document.createElement("button");
        label.type = "button";
        label.className = "metric-label";
        const isCustom = Object.hasOwn(metricLayout.custom, key);
        label.textContent = isCustom
          ? metricLayout.custom[key]
          : metricLabel(key) || t("Beschriftung hinzufügen");
        const heading = key.startsWith("heading:");
        if (heading) {
          label.textContent =
            metricLayout.labels[key] ??
            t(key === "heading:title" ? "Titel" : "Untertitel");
        }
        label.title = t("Beschriftung ändern");
        label.setAttribute(
          "aria-label",
          t("Beschriftung für ") + key + t(" ändern"),
        );
        const value = document.createElement("span");
        value.className = "metric-value";
        value.textContent = isCustom
          ? ""
          : (metricLabel(key) ? ": " : " ") + metricValueFor(layoutSample, key);
        if (heading && !metricValueFor(layoutSample, key))
          value.textContent = t(
            key === "heading:title" ? "Titel" : "Untertitel",
          );
        if (missing.length && !metricValueFor(layoutSample, key))
          value.textContent = missing[0] + " — " + t("Feld fehlt");
        label.addEventListener("click", () => {
          const input = document.createElement("input");
          input.type = "text";
          input.className = "metric-label-input";
          input.value = heading
            ? (metricLayout.headingText?.[key] ??
              metricValueFor(layoutSample, key))
            : isCustom
              ? metricLayout.custom[key]
              : metricLabel(key);
          input.placeholder = t("Beschriftung");
          input.setAttribute("aria-label", t("Beschriftung für ") + key);
          let finished = false;
          const finish = (save) => {
            if (finished) return;
            finished = true;
            if (save) {
              if (heading) {
                if (input.value.trim())
                  (metricLayout.headingText ||= {})[key] = input.value.trim();
                else delete metricLayout.headingText?.[key];
              } else if (isCustom)
                metricLayout.custom[key] = input.value.trim();
              else metricLayout.labels[key] = input.value.trim();
              saveLayout();
            }
            label.textContent = heading ? t(key==='heading:title'?'Titel':'Untertitel') : isCustom
              ? metricLayout.custom[key] || t("Text eingeben")
              : metricLabel(key) || t("Beschriftung hinzufügen");
            value.textContent = isCustom
              ? ""
              : (metricLabel(key) ? ": " : " ") +
                metricValueFor(layoutSample, key);
            input.replaceWith(label);
            generateQRCode();
          };
          input.addEventListener("blur", () => finish(true));
          input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              finish(event.key === "Enter");
              label.focus();
            }
          });
          label.replaceWith(input);
          input.focus();
          input.select();
        });
        text.append(label, value);
        if (!isCustom && !key.startsWith("date:")) {
          const keys = [
            ...new Set(
              [
                ...(editorMode === "bulk"
                  ? (loadedData || []).flatMap((record) =>
                      Object.keys(record.Raw || {}),
                    )
                  : [
                      "title",
                      "subtitle",
                      ...Object.keys(layoutSample.Metrics || {}),
                    ]),
                ...Object.values(metricLayout.sources || {}),
                ...(!heading ? [key] : []),
              ].filter(Boolean),
            ),
          ];
          const current =
            metricLayout.sources?.[key] ??
            (heading
              ? editorMode === "single"
                ? key === "heading:title"
                  ? "title"
                  : "subtitle"
                : key === "heading:title"
                  ? "Titel"
                  : "Untertitel"
              : key);
          const sourceButton = document.createElement("button");
          sourceButton.type = "button";
          sourceButton.className = "metric-source-key";
          sourceButton.textContent = current ? "{" + current + "}" : t("Feld auswählen …");
          sourceButton.title = t("Quellfeld ändern");
          sourceButton.setAttribute("aria-expanded", "false");
          if (heading && editorMode === "bulk")
            sourceButton.id =
              key === "heading:title"
                ? "cartTitleSource"
                : "cartSubtitleSource";
          const menu = document.createElement("div");
          menu.className = "metric-source-menu";
          menu.hidden = true;
          const source = document.createElement("select");
          source.setAttribute("aria-label", t("Quellfeld"));
          source.add(new Option(t("Feld auswählen …"), ""));
          for (const name of keys) source.add(new Option("{" + name + "}", name));
          source.value = current;
          source.addEventListener("change", () => {
            (metricLayout.sources ||= {})[key] = source.value;
            if (heading) delete metricLayout.headingText?.[key];
            saveLayout();
            renderMetricEditor();
            generateQRCode();
          });
          sourceButton.addEventListener("click", () => {
            menu.hidden = !menu.hidden;
            sourceButton.setAttribute("aria-expanded", String(!menu.hidden));
            if (!menu.hidden) source.focus();
          });
          menu.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              menu.hidden = true;
              sourceButton.setAttribute("aria-expanded", "false");
              sourceButton.focus();
            }
          });
          const sourceWrap = document.createElement("span");
          sourceWrap.className = "metric-source-wrap";
          menu.append(source);
          sourceWrap.append(sourceButton, menu);
          text.prepend(sourceWrap);
          sourceWrap.addEventListener("focusout", (event) => {
            if (!sourceWrap.contains(event.relatedTarget)) {
              menu.hidden = true;
              sourceButton.setAttribute("aria-expanded", "false");
            }
          });
        }
        const toolbar = document.createElement("span");
        toolbar.className = "metric-toolbar";
        if (heading) {
          const shown = document.createElement("label");
          shown.className = "preview-switch metric-visibility";
          shown.title = t("Auf dem Cart anzeigen");
          const toggle = document.createElement("input");
          toggle.type = "checkbox";
          toggle.setAttribute("role", "switch");
          toggle.setAttribute("aria-label", t("Auf dem Cart anzeigen"));
          toggle.checked = !(metricLayout.hiddenFields || []).includes(key);
          toggle.addEventListener("change", () => {
            metricLayout.hiddenFields = (
              metricLayout.hiddenFields || []
            ).filter((item) => item !== key);
            if (!toggle.checked) metricLayout.hiddenFields.push(key);
            saveLayout();
            renderMetricEditor();
            generateQRCode();
          });
          shown.append(toggle);
          toolbar.append(shown);
        }
        const controls = [];
        const refreshStyle = () => {
          const style = metricLayout.styles[key] || {};
          text.style.fontFamily = '"' + (metricLayout.font || 'Roboto') + '"';
          text.style.fontWeight = style.bold ? "700" : "400";
          text.style.fontSize = style.large ? "17px" : "14px";
          text.style.color = style.black ? "var(--color-text)" : "var(--color-muted)";
          for (const [button, property, activeValue] of controls)
            button.setAttribute(
              "aria-pressed",
              String(Boolean(style[property]) === activeValue),
            );
        };
        for (const [caption, description, property, activeValue] of [
          ["B", t("Fett"), "bold", true],
          ["A", t("Kleine Schrift"), "large", false],
          ["A", t("Grosse Schrift"), "large", true],
          ["●", t("Schwarz statt Grau"), "black", true],
        ]) {
          const button = document.createElement("button");
          button.type = "button";
          button.className =
            "metric-format" +
            (property === "large"
              ? activeValue
                ? " font-large"
                : " font-small"
              : property === "black"
                ? " color-toggle"
                : " font-bold");
          button.textContent = caption;
          button.title = description;
          button.setAttribute("aria-label", description);
          controls.push([button, property, activeValue]);
          button.addEventListener("click", () => {
            const style = (metricLayout.styles[key] ||= {});
            style[property] =
              property === "large" ? activeValue : !style[property];
            refreshStyle();
            saveLayout();
          });
          toolbar.append(button);
        }
        refreshStyle();
        if (key === "date:current") {
          const format = document.createElement("select");
          format.className = "metric-date-format";
          format.setAttribute("aria-label", t("Datumsformat"));
          format.title = t("Datumsformat");
          format.add(new Option("EU · 31.12.2026", "eu"));
          format.add(new Option("US · 12/31/2026", "us"));
          format.value = metricLayout.dateFormat === "us" ? "us" : "eu";
          format.addEventListener("change", () => {
            metricLayout.dateFormat = format.value;
            delete metricLayout.dateText;
            saveLayout();
            renderMetricEditor();
            generateQRCode();
          });
          toolbar.append(format);
        }
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.className = "metric-remove";
        if (editorMode === "bulk" && heading) remove.hidden = true;
        remove.setAttribute("aria-label", key + t(" entfernen"));
        remove.addEventListener("click", async () => {
          if (!(await confirmDeletion())) return;
          metricLayout[area].splice(index, 1);
          if (isCustom) delete metricLayout.custom[key];
          delete metricLayout.styles[key];
          saveLayout();
          renderMetricEditor();
        });
        row.append(handle, text, toolbar, remove);
        container.append(row);
        addControl(index + 1);
      });
    }
  }
  document
    .getElementById("editLayoutBtn")
    .addEventListener("click", () => toggleCartEditor("bulk"));
  document
    .getElementById("closeLayoutBtn")
    .addEventListener("click", () => closeLayoutEditor(false));
  document
    .getElementById("cancelLayoutBtn")
    .addEventListener("click", () => closeLayoutEditor(false));
  layoutDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLayoutEditor(false);
  });
  document
    .getElementById("editSingleTemplateBtn")
    .addEventListener("click", (event) =>
      previewClick(event, "single", canvas),
    );
  document
    .getElementById("applyLayoutBtn")
    .addEventListener("click", () => closeLayoutEditor(true));
  async function closeLayoutEditor(apply) {
    if (
      apply &&
      !editingCartGallery &&
      editorMode === "bulk" &&
      loadedData &&
      !validateBulkTitle()
    )
      return false;
    if (apply && !cartAppearance.validate(metricLayout)) return false;
    if (
      apply &&
      editingCartGallery &&
      templateChanged() &&
      (await requestTemplateSave(true)) === "cancel"
    )
      return false;
    if (
      !editingCartGallery &&
      apply &&
      editorMode === "bulk" &&
      loadedData &&
      !contentEditor.validate()
    ) {
      document.getElementById("addContentCard").focus();
      return false;
    }

    if (!apply && editorSnapshot) {
      for (const key of Object.keys(metricLayout)) delete metricLayout[key];
      Object.assign(metricLayout, editorSnapshot.layout);
      document.getElementById("exportFormat").value = editorSnapshot.bulkFormat;
      document.getElementById("singleFormat").value =
        editorSnapshot.singleFormat;
    }
    await cartAppearance.detach();
    editorSnapshot = null;
    metricLayout = bulkLayout;
    layoutDialog.close();
    if (editingCartGallery) {
      editingCartGallery = false;
      renderCartGallery();
    }
    showMainPreviews();
    saveLayout();
    saveSettings();
    renderSavedLogos();
    generateQRCode();
  }

  function formatLines(value) {
    const values = Array.isArray(value) ? value : [value];
    const lines = values.flatMap((item) => {
      if (typeof item !== "string" && typeof item !== "number") return [];
      return String(item)
        .split(/[,;\s]+/)
        .filter(Boolean)
        .map((line) =>
          /^\d+$/.test(line) ? line.replace(/^0+(?=\d)/, "") : line,
        );
    });
    return [...new Set(lines)]
      .sort((a, b) => a.localeCompare(b, "de", { numeric: true }))
      .join(", ");
  }

  function ensureMovableHeadings(layout) {
    if (layout.headingsMovable) return;
    layout.below = [
      "heading:title",
      "heading:subtitle",
      ...layout.below.filter((key) => !key.startsWith("heading:")),
    ];
    layout.styles["heading:title"] ||= { bold: true, large: true, black: true };
    layout.styles["heading:subtitle"] ||= { large: true };
    layout.headingsMovable = true;
  }

  function createLabeledCanvas(
    qrCanvas,
    title,
    subtitle,
    internalId = "",
    lines = "",
    record = null,
    layout = metricLayout,
  ) {
    if (record) ensureMovableHeadings(layout);
    const output = document.createElement("canvas");
    const nativeContext = output.getContext("2d");
    const context = qrCanvas.svgContent
      ? vectorContext(nativeContext)
      : nativeContext;
    const margin = Math.max(12, Math.round(qrCanvas.width * 0.05));
    const maxWidth = qrCanvas.width - margin * 2;
    const scale = qrCanvas.width / 1000;
    const titleSize = Math.round(72 * scale);
    const subtitleSize = Math.round(48 * scale);
    const idSize = Math.round(36 * scale);
    const idLineHeight = Math.ceil(idSize * 1.4);
    const titleBlocks = [];
    const blocks = [];
    for (const [text, font, lineHeight, color] of [
      [title, `bold ${titleSize}px Arial`, Math.ceil(titleSize * 1.3), "#222"],
      [
        subtitle,
        `${subtitleSize}px Arial`,
        Math.ceil(subtitleSize * 1.4),
        "#666",
      ],
    ]) {
      if (!text.trim()) continue;
      context.font = font;
      titleBlocks.push({
        font,
        lineHeight,
        color,
        lines: wrapText(context, text, maxWidth),
      });
    }
    if (record) {
      context.font = `${idSize}px Arial`;
      for (const key of layout.above) {
        const text = metricText(record, key, layout);
        if (text) {
          const style = metricStyle(key, layout, scale);
          context.font = style.font;
          blocks.push({ ...style, lines: wrapText(context, text, maxWidth) });
        }
      }
    }
    const ribbonHeight =
      record && ribbonVisible(record.URL, layout) ? Math.round(110 * scale) : 0;
    const headerHeight =
      ribbonHeight +
      (blocks.length
        ? margin * 2 +
          blocks.reduce(
            (height, block) => height + block.lines.length * block.lineHeight,
            0,
          )
        : 0);
    const idText = String(internalId ?? "").trim();
    context.font = `${idSize}px Arial`;
    const idLines = idText ? wrapText(context, idText, maxWidth) : [];
    const lineText = formatLines(lines);
    const footerBlocks = record
      ? layout.below.flatMap((key) => {
          const text = metricText(record, key, layout);
          if (!text) return [];
          const style = metricStyle(key, layout, scale);
          context.font = style.font;
          return [{ ...style, lines: wrapText(context, text, maxWidth) }];
        })
      : [
          {
            font: idSize + "px Arial",
            color: "#666",
            lineHeight: idLineHeight,
            lines: [
              ...idLines,
              ...(lineText
                ? wrapText(context, "Linien: " + lineText, maxWidth)
                : []),
            ],
          },
        ].filter((block) => block.lines.length);
    if (!record) footerBlocks.unshift(...titleBlocks);
    const footerHeight = footerBlocks.length
      ? margin * 2 +
        footerBlocks.reduce(
          (height, block) => height + block.lines.length * block.lineHeight,
          0,
        )
      : 0;
    output.width = qrCanvas.width;
    output.height = qrCanvas.height + headerHeight + footerHeight;
    // Browsers impose canvas size limits; fail clearly instead of exporting clipped text.
    if (output.height > 16384)
      throw new LocalizedError(() =>
        t("Die Beschriftung ist zu lang. Bitte kürzen Sie den Text."),
      );
    context.fillStyle = "white";
    context.fillRect(0, 0, output.width, output.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    let y = margin + ribbonHeight;
    for (const block of blocks) {
      context.font = block.font;
      context.fillStyle = block.color;
      for (const line of block.lines) {
        context.fillText(
          line,
          output.width / 2,
          y + block.lineHeight / 2,
          maxWidth,
        );
        y += block.lineHeight;
      }
    }
    output.qrHitBox = { y: headerHeight, height: qrCanvas.height };
    context.drawImage(qrCanvas, 0, headerHeight);
    context.font = `${idSize}px Arial`;
    context.fillStyle = "#666";
    y = headerHeight + qrCanvas.height + margin;
    for (const block of footerBlocks) {
      context.font = block.font;
      context.fillStyle = block.color;
      for (const line of block.lines) {
        context.fillText(
          line,
          output.width / 2,
          y + block.lineHeight / 2,
          maxWidth,
        );
        y += block.lineHeight;
      }
    }
    if (ribbonHeight) drawTestRibbon(context, output.width, layout, record.URL);
    if (qrCanvas.svgContent) output.svgContent = context.svgContent;
    return output;
  }

  function toPNG(source) {
    return new Promise((resolve, reject) =>
      source.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Die PNG-Datei konnte nicht erstellt werden."));
      }, "image/png"),
    );
  }

  const showBulkPreview = document.getElementById("showBulkPreview");
  const bulkPreview = document.getElementById("bulkPreview");
  const bulkCanvas = document.getElementById("bulkCanvas");
  const previewStatus = document.getElementById("previewStatus");
  function dismissPreview() {
    showBulkPreview.checked = false;
    saveSettings();
    bulkPreview.close();
  }
  document
    .getElementById("closePreviewBtn")
    .addEventListener("click", dismissPreview);
  bulkPreview.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismissPreview();
  });
  showBulkPreview.addEventListener("change", () => {
    if (!showBulkPreview.checked) bulkPreview.close();
    saveSettings();
  });

  generateBtn.addEventListener("click", generateZip);
  const cancelExportBtn = document.getElementById("cancelExportBtn");
  let cancelExportRequested = false;
  const exportCancelled = new Error("Export abgebrochen");
  document
    .getElementById("clearBulkData")
    .addEventListener("click", async () => {
      if (
        isGenerating ||
        !(await confirmDeletion(t("Importierte Daten"), { kind: "data" }))
      )
        return;
      ++fileLoadVersion;
      loadedData = null;
      layoutSample = null;
      fileInput.value = "";
      document.getElementById("clearBulkData").hidden = true;
      setMessage(info, () => "");
      setMessage(statusDiv, () => "");
      generateBtn.disabled = true;
      generateQRCode();
    });
  cancelExportBtn.addEventListener("click", () => {
    if (!isGenerating) return;
    cancelExportRequested = true;
    cancelExportBtn.disabled = true;
    setMessage(statusDiv, () => t("Export wird abgebrochen …"));
  });

  function checkExportCancelled() {
    if (cancelExportRequested) throw exportCancelled;
  }

  function validateBulkTitle() {
    if (window.QRGenerator["cart-fields"].titleValid(bulkLayout, loadedData))
      return true;
    toast(
      t(
        "Bitte ein Titelfeld mit einem Wert für jeden Eintrag auswählen. Es bestimmt die Dateinamen.",
      ),
      "warning",
    );
    const field = document.getElementById("cartTitleSource");
    field?.scrollIntoView({ block: "center" });
    field?.focus();
    return false;
  }
  async function generateZip() {
    if (!loadedData || isGenerating) return;
    if (!validateBulkTitle()) {
      await openLayoutEditor("bulk");
      document.getElementById("cartTitleSource").focus();
      return;
    }
    if (!contentEditor.validate()) {
      openLayoutEditor("bulk");
      document.getElementById("addContentCard").focus();
      return;
    }
    try {
      await cartAppearance.ready(bulkLayout);
      await window.QRGenerator["cart-fonts"].ready(bulkLayout.font);
    } catch (error) {
      toast(t("Export fehlgeschlagen: ") + error.message, "warning");
      return;
    }
    if (isGenerating) return;
    isGenerating = true;
    cancelExportRequested = false;
    cancelExportBtn.hidden = false;
    cancelExportBtn.disabled = false;
    generateBtn.disabled = true;
    fileInput.disabled = true;
    dropZone.setAttribute("aria-disabled", "true");
    bulkPreview.close();
    const entries = structuredClone(loadedData);
    const format = document.getElementById("exportFormat").value;
    const settings = {
      ...cartAppearance.settings(bulkLayout),
      vector: format === "svg",
    };
    const exportLayout = {
      ...structuredClone(bulkLayout),
      dateText: currentDateText(bulkLayout),
    };
    // Keep one language throughout this ZIP even if the interface language changes.
    for (const key of [...exportLayout.above, ...exportLayout.below])
      exportLayout.labels[key] = metricLabel(key, bulkLayout);
    try {
      const fontStyle =
        format === "svg"
          ? await window.QRGenerator["cart-fonts"].svgStyle(bulkLayout.font)
          : "";
      let adjustedCount = 0;
      const filenames = new Set();
      const zip = new JSZip();
      const qrCanvas = document.createElement("canvas");
      for (let i = 0; i < entries.length; i++) {
        checkExportCancelled();
        const entry = entries[i];
        setMessage(
          statusDiv,
          () =>
            t("QR-Code ") +
            (i + 1) +
            t(" von ") +
            entries.length +
            t(" wird erstellt …"),
        );
        const adjustment = renderQRCode(qrCanvas, entry.URL, settings);
        if (adjustment) adjustedCount++;
        const output = createLabeledCanvas(
          qrCanvas,
          entry.Titel,
          entry.Untertitel,
          entry.Interne_ID,
          entry.Linien,
          entry,
          exportLayout,
        );
        if (showBulkPreview.checked) {
          bulkCanvas.width = output.width;
          bulkCanvas.height = output.height;
          bulkCanvas.getContext("2d").drawImage(output, 0, 0);
          setMessage(previewStatus, () => statusDiv.textContent);
          if (!bulkPreview.open) bulkPreview.showModal();
          // Yield for painting/cancellation without adding a delay per image.
          await new Promise((resolve) => setTimeout(resolve, 0));
        } else {
          // Allow cancellation and other UI events between images.
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
        checkExportCancelled();
        if(format === "svg")output.svgContent=fontStyle+output.svgContent;
        const image = format === "svg" ? toSVG(output) : await toPNG(output);
        checkExportCancelled();
        const baseName = sanitizeFilename(
          metricValue(
            entry.Raw[
              window.QRGenerator["cart-fields"].source(
                exportLayout,
                "heading:title",
              )
            ],
          ),
        );
        let fileName = baseName + "." + format;
        let suffix = 2;
        while (filenames.has(fileName.toLowerCase()))
          fileName = baseName + "_" + suffix++ + "." + format;
        filenames.add(fileName.toLowerCase());
        zip.file(fileName, image);
      }
      setMessage(statusDiv, () => t("ZIP-Datei wird erstellt …"));
      setMessage(previewStatus, () => statusDiv.textContent);
      checkExportCancelled();
      const zipBlob = await zip.generateAsync(
        { type: "blob" },
        checkExportCancelled,
      );
      checkExportCancelled();
      saveAs(zipBlob, "QR-Codes.zip");
      document.getElementById("clearBulkData").hidden = false;
      renderBulkPreview();
      bulkPreview.close();
      bulkCanvas.width = bulkCanvas.height = 0;
      setMessage(statusDiv, () => "");
      toast(
        entries.length +
          t(" QR-Codes exportiert.") +
          (adjustedCount ? " " + adjustedCount + t(" ohne Logo.") : ""),
      );
    } catch (error) {
      if (error === exportCancelled) {
        setMessage(statusDiv, () =>
          t(
            "Export abgebrochen. Die importierten Daten bleiben für einen erneuten Export erhalten.",
          ),
        );
      } else {
        console.error(error);
        setMessage(
          statusDiv,
          () => t("Export fehlgeschlagen: ") + error.message,
        );
      }
    } finally {
      bulkPreview.close();
      bulkCanvas.width = bulkCanvas.height = 0;
      cancelExportBtn.hidden = true;
      isGenerating = false;
      fileInput.disabled = false;
      dropZone.setAttribute("aria-disabled", "false");
      generateBtn.disabled = !loadedData;
    }
  }

  function clearQRCode() {
    canvas.width = EXPORT_SIZE;
    canvas.height = canvas.width;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    downloadBtn.hidden = false;
    downloadBtn.disabled = true;
  }

  function loadQueryParameters() {
    qrInput.value = DEMO_QR_CONTENT;
    const params = new URLSearchParams(window.location.search);

    const url = params.get("url");
    const title = params.get("title");
    const subtitle = params.get("subtitle");

    if (url) {
      qrInput.value = url;
    }

    const preset = qrPresets.getEntries().find(entry => entry.id === params.get('qrTemplate') || entry.name === params.get('qrTemplate'));
    if (preset) { singleLayout.qrAppearance = structuredClone(preset.payload); singleLayout.qrTemplateId = preset.id; }
    const appearance = structuredClone(singleLayout.qrAppearance || {appearance:{shape:'square',finderShape:'square',color:'#000000',finderColor:'#000000'},logoData:''});
    let changed = false;
    for (const [param,key,control] of [['qrShape','shape',shapeSelect],['qrFinderShape','finderShape',finderShapeSelect]]) {
      const value=params.get(param);if(value && Array.from(control.options).some(option=>option.value===value)){appearance.appearance[key]=value;changed=true;}
    }
    for (const [param,key] of [['qrColor','color'],['qrFinderColor','finderColor']]) {
      const value=(params.get(param)||'').replace(/^#/, '');if(/^[0-9a-f]{6}$/i.test(value)){appearance.appearance[key]='#'+value;changed=true;}
    }
    if(changed){singleLayout.qrAppearance=appearance;singleLayout.qrTemplateId='';}
    qrTitle.textContent = title || "";
    qrSubtitle.textContent = subtitle || "";

    if (title) {
      document.title = title;
    }
  }

  function renderBulkPreview() {
    document.getElementById("bulkLoadedContent").hidden = !loadedData?.length;
    const record = loadedData?.[0] || {
      URL: DEMO_QR_CONTENT,
      Titel: "",
      Untertitel: "",
      Metrics: {},
    };
    const target = document.getElementById("bulkPageCanvas");
    target.classList.toggle("is-example", !loadedData);
    if (typeof qrcode !== "function") return;
    try {
      if (!record.URL) {
        target.width = target.height = EXPORT_SIZE;
        const ctx = target.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, target.width, target.height);
        return;
      }
      const qr = document.createElement("canvas");
      renderQRCode(qr, record.URL, cartAppearance.settings(bulkLayout));
      const image = createLabeledCanvas(
        qr,
        record.Titel,
        record.Untertitel,
        "",
        "",
        record,
        bulkLayout,
      );
      target.qrHitBox = image.qrHitBox;
      target.width = image.width;
      target.height = image.height;
      target.getContext("2d").drawImage(image, 0, 0);
    } catch (error) {
      setMessage(qrError, () => error.message);
    }
  }
  function renderVariableChips() {
    for (const [id, mode] of [["templateVariables", editorMode]]) {
      const host = document.getElementById(id),
        layout = mode === "single" ? singleLayout : bulkLayout;
      const records = mode === "single" ? [singleRecord()] : loadedData || [];
      const fixed =
        mode === "single"
          ? ["title", "subtitle"].filter((key) =>
              new URLSearchParams(location.search).has(key),
            )
          : [
              ...new Set(
                records.flatMap((record) => record.FixedMetrics || []),
              ),
            ];
      const keys = [
        ...new Set(
          records.flatMap((record) => Object.keys(record.Metrics || {})),
        ),
      ];
      const used = new Set([...layout.above, ...layout.below]);
      const layoutKey = (key) =>
        Object.entries(layout.sources || {}).find(
          ([slot, source]) => source === key && used.has(slot),
        )?.[0] ||
        (fixed.includes(key)
          ? key === "subtitle" || key === "Untertitel"
            ? "heading:subtitle"
            : "heading:title"
          : key);
      host.replaceChildren();
      host.hidden = !records.length;
      const legend = document.createElement("span");
      legend.className = "variable-chip-legend";
      legend.textContent = t("Verfügbare Kategorien");
      host.append(legend);
      for (const key of [
        ...fixed,
        ...keys.filter((key) => !fixed.includes(key)),
      ].sort(
        (a, b) =>
          Number(used.has(layoutKey(b))) - Number(used.has(layoutKey(a))),
      )) {
        const targetKey = layoutKey(key);
        const chip = document.createElement(
          used.has(targetKey) ? "span" : "button",
        );
        chip.className =
          "variable-chip" + (used.has(targetKey) ? " is-used" : "");
        chip.textContent = (used.has(targetKey) ? "✓ " : "+ ") + "{" + key + "}";
        chip.title = t(
          used.has(targetKey) ? "Bereits verwendet" : "Zum Cart hinzufügen",
        );
        if (!used.has(targetKey)) {
          chip.type = "button";
          chip.addEventListener("click", () => {
            if (![...layout.above, ...layout.below].includes(targetKey))
              layout.below.push(targetKey);
            saveLayout();
            generateQRCode();
            if (layoutDialog.open) openLayoutEditor(mode);
          });
        }
        host.append(chip);
      }
    }
  }

  function generateQRCode() {
    cartAppearance.refresh();
    document.querySelectorAll('.copy-qr-link').forEach(button => {
      button.disabled = button.dataset.mode === 'bulk' ? !loadedData?.[0]?.URL : !qrInput.value.trim();
      button.title = t('Link mit QR-Code-Parametern kopieren');
      button.setAttribute('aria-label', button.title);
    });
    qrInput.classList.toggle("has-content", Boolean(qrInput.value.trim()));
    updateUnusedParameters();
    setMessage(qrError, () => "");
    setMessage(document.getElementById("renderNotice"), () => "");
    const isExample = !qrInput.value.trim();
    canvas.classList.toggle("is-example", isExample);
    canvas.setAttribute(
      "aria-label",
      isExample
        ? t("Beispiel-QR-Code ohne eigene Daten")
        : t("Erstellter QR-Code"),
    );

    const inputText =
      qrInput.value.trim() || (isExample ? DEMO_QR_CONTENT : "");
    updateRibbonUI();

    if (inputText === "") {
      clearQRCode();
      return;
    }

    if (typeof qrcode !== "function") {
      downloadBtn.hidden = false;
      downloadBtn.disabled = true;
      clearQRCode();
      setMessage(qrError, () =>
        t(
          "Die QR-Code-Bibliothek konnte nicht geladen werden. Bitte die Seite neu laden.",
        ),
      );
      return;
    }

    try {
      // Verify off-screen; failed logo checks must not erase the visible preview.
      const nextCanvas = document.createElement("canvas");
      const adjustment = renderQRCode(
        nextCanvas,
        inputText,
        cartAppearance.settings(singleLayout),
      );
      const settingsCanvas = document.getElementById("settingsQR");
      const bulkSettings = document
        .getElementById("bulkEditorSlot")
        .contains(settingsCanvas);
      const settingsText =
        cartAppearance.content() ||
        (activeMode === "templates"
          ? templateTestContent || DEMO_QR_CONTENT
          : bulkSettings
            ? loadedData?.[0]?.URL || (!loadedData ? DEMO_QR_CONTENT : "")
            : inputText);
      if (settingsText)
        renderQRCode(settingsCanvas, settingsText, readSettings());
      else {
        settingsCanvas.width = settingsCanvas.height = EXPORT_SIZE;
        settingsCanvas
          .getContext("2d")
          .clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
      }
      setMessage(document.getElementById("renderNotice"), () => adjustment);
      const record = singleRecord();
      const output = createLabeledCanvas(
        nextCanvas,
        record.Titel,
        record.Untertitel,
        "",
        "",
        record,
        singleLayout,
      );
      renderBulkPreview();
      renderVariableChips();
      canvas.qrHitBox = output.qrHitBox;
      canvas.width = output.width;
      canvas.height = output.height;
      ctx.drawImage(output, 0, 0);
      const enlarged = document.querySelector('#largeQRPreview[open] canvas');
      if (enlarged) { enlarged.width = canvas.width; enlarged.height = canvas.height; enlarged.getContext('2d').drawImage(canvas, 0, 0); }
      if (layoutDialog.open && layoutSample && !layoutSample.URL) {
        const target = document.getElementById("layoutQR");
        target.getContext("2d").clearRect(0, 0, target.width, target.height);
      }
      if (layoutDialog.open && layoutSample?.URL)
        renderQRCode(
          document.getElementById("layoutQR"),
          layoutSample.URL,
          cartAppearance.settings(metricLayout),
        );
      downloadBtn.hidden = false;
      downloadBtn.disabled = isExample;
    } catch (error) {
      downloadBtn.hidden = false;
      downloadBtn.disabled = true;
      setMessage(
        qrError,
        () =>
          (error instanceof Error
            ? error.message
            : t(
                "Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.",
              )) + t(" Die letzte erfolgreiche Vorschau bleibt erhalten."),
      );
      console.error(error);
    }
  }

  async function downloadQRCode() {
    if (downloadBtn.disabled || !qrInput.value.trim()) return;
    try {
      await cartAppearance.ready(singleLayout);
      await window.QRGenerator["cart-fonts"].ready(singleLayout.font);
      const format = document.getElementById("singleFormat").value;
      const qr = document.createElement("canvas");
      renderQRCode(qr, qrInput.value.trim(), {
        ...cartAppearance.settings(singleLayout),
        vector: format === "svg",
      });
      const record = singleRecord();
      const output = createLabeledCanvas(
        qr,
        record.Titel,
        record.Untertitel,
        "",
        "",
        record,
        singleLayout,
      );
      if(format === "svg")output.svgContent=(await window.QRGenerator['cart-fonts'].svgStyle(singleLayout.font))+output.svgContent;
      const blob =
        format === "svg"
          ? new Blob([toSVG(output)], { type: "image/svg+xml;charset=utf-8" })
          : await toPNG(output);
      saveAs(
        blob,
        sanitizeFilename(qrTitle.textContent || t("QR-Code")) + "." + format,
      );
    } catch (error) {
      setMessage(qrError, () => t("Export fehlgeschlagen: ") + error.message);
    }
  }

  [
    qrInput,
    shapeSelect,
    colorPicker,
    finderShapeSelect,
    finderColorPicker,
  ].forEach((control) =>
    control.addEventListener("input", () => {
      generateQRCode();
      if (control !== qrInput) saveSettings();
    }),
  );

  downloadBtn.addEventListener("click", downloadQRCode);

  const appearanceControls = document.querySelector(".appearance-fields");
  const logoControls = document.querySelector(".logo-controls");
  document.getElementById("pageAppearanceControls").append(appearanceControls);
  document.getElementById("pageLogoControls").append(logoControls);

  document.getElementById("labelContainer").hidden = true;
  function updateCartToggle(mode, editing) {
    const button = document.getElementById(
      mode === "single" ? "singleCartToggle" : "editLayoutBtn",
    );
    if (!button) return;
    button.setAttribute("aria-pressed", String(editing));
    button.title = t(editing ? "Vorschau anzeigen" : "Cart anpassen");
    button.setAttribute("aria-label", button.title);
    button.querySelector(".cart-eye").hidden = !editing;
    button.querySelector(".cart-edit").hidden = editing;
  }
  function hideMainPreview(mode) {
    document.getElementById(
      mode === "single" ? "editSingleTemplateBtn" : "bulkPreviewButton",
    ).hidden = true;
    updateCartToggle(mode, true);
  }
  function showMainPreviews() {
    document.getElementById("editSingleTemplateBtn").hidden = false;
    document.getElementById("bulkPreviewButton").hidden = false;
    for (const mode of ["single", "bulk"]) updateCartToggle(mode, false);
  }
  async function toggleCartEditor(mode) {
    if (layoutDialog.open && editorMode === mode) await closeLayoutEditor(true);
    else openLayoutEditor(mode);
  }
  function initializeCartPanels() {
    for (const mode of ["single", "bulk"]) {
      const preview = document.getElementById(
        mode === "single" ? "editSingleTemplateBtn" : "bulkPreviewButton",
      );
      const card = document.createElement("section");
      card.className = "cart-panel";
      preview.before(card);
      const toolbar = document.createElement("div");
      toolbar.className = "cart-panel-toolbar";
      const button =
        mode === "bulk"
          ? document.getElementById("editLayoutBtn")
          : document.createElement("button");
      button.id = mode === "bulk" ? "editLayoutBtn" : "singleCartToggle";
      button.type = "button";
      button.className = "cart-view-toggle";
      button.replaceChildren();
      button.setAttribute("aria-controls", mode + "EditorSlot");
      for (const [className, pathData] of [
        [
          "cart-eye",
          "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
        ],
        [
          "cart-edit",
          "M14 3H4v18h16V11M7 7h3M7 11h3M7 15h2M12 16l1-4 6-6 3 3-6 6-4 1Z",
        ],
      ]) {
        const icon = document.createElement("span");
        icon.className = className;
        icon.setAttribute("aria-hidden", "true");
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        svg.setAttribute("viewBox", "0 0 24 24");
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute("d", pathData);
        svg.append(path);
        icon.append(svg);
        button.append(icon);
      }
      if (mode === "single")
        button.addEventListener("click", () => toggleCartEditor(mode));
      const qrButton = document.createElement("button");
      qrButton.type = "button";
      qrButton.className = "cart-view-toggle qr-edit-button";
      qrButton.setAttribute("aria-label", t("QR-Code-Gestaltung anpassen"));
      qrButton.title = t("QR-Code-Gestaltung anpassen");
      qrButton.addEventListener("click", () => openQRSettings(mode));
      qrButton.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM14 13h3v4h4v4h-7zM20 12v2M10 12h2M12 19v2"/></svg>';
      toolbar.append(button, qrButton);
      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'cart-view-toggle copy-qr-link';
      copyButton.dataset.mode = mode;
      copyButton.title = t('Link mit QR-Code-Parametern kopieren');
      copyButton.setAttribute('aria-label', copyButton.title);
      copyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/></svg>';
      copyButton.addEventListener('click', () => copyQRLink(mode));
      toolbar.append(copyButton);
      if(mode==='single' && new URLSearchParams(location.search).has('url')) {
        const eye=document.createElement('button');eye.type='button';eye.className='cart-view-toggle';eye.id='largeQRPreviewButton';
        eye.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/></svg>';
        eye.addEventListener('click',openLargeQRPreview);toolbar.append(eye);
      }
      card.append(
        toolbar,
        preview,
        document.getElementById(mode + "EditorSlot"),
      );
      updateCartToggle(mode, false);
      preview.setAttribute("aria-label", t("QR-Code-Gestaltung anpassen"));
      const target = preview.querySelector("canvas"),
        hover = document.createElement("span");
      hover.className = "qr-hover-zone";
      hover.setAttribute("aria-hidden", "true");
      preview.append(hover);
      const align = () => {
        const hit = target.qrHitBox;
        if (!hit || !target.height) return;
        const top = (hit.y / target.height) * target.clientHeight,
          height = (hit.height / target.height) * target.clientHeight;
        toolbar.style.top = preview.offsetTop + top + height / 2 + "px";
        hover.style.top = top + "px";
        hover.style.height = height + "px";
      };
      if (window.ResizeObserver) new ResizeObserver(align).observe(target);
      new MutationObserver(() => requestAnimationFrame(align)).observe(target, {
        attributes: true,
        attributeFilter: ["width", "height"],
      });
      preview.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect(),
          hit = target.qrHitBox,
          y = ((event.clientY - rect.top) * target.height) / rect.height;
        preview.classList.toggle(
          "qr-is-hovered",
          Boolean(hit && y >= hit.y && y <= hit.y + hit.height),
        );
      });
      preview.addEventListener("pointerleave", () =>
        preview.classList.remove("qr-is-hovered"),
      );
      requestAnimationFrame(align);
    }
    document.getElementById("bulkRibbonBtn").parentElement.hidden = true;
  }
  function qrShareURL(mode) {
    const layout = mode === 'bulk' ? bulkLayout : singleLayout;
    const record = mode === 'bulk' ? loadedData?.[0] : singleRecord();
    const content = mode === 'bulk' ? record?.URL : qrInput.value.trim();
    if (!content) return null;
    const url = new URL(location.href);
    url.search = ''; url.hash = '';
    // Only include fields intentionally placed on this Cart, not the whole imported record.
    for (const key of [...layout.above, ...layout.below]) {
      if (key.startsWith('heading:') || key.startsWith('custom:') || key === 'date:current' || layout.hiddenFields?.includes(key)) continue;
      const source = layout.sources?.[key] || key;
      if (['url','title','subtitle','tab','preview','qrShape','qrFinderShape','qrColor','qrFinderColor','qrTemplate'].includes(source)) continue;
      url.searchParams.set(source, metricValueFor(record, key, layout));
    }
    url.searchParams.set('url', content);
    for (const [key, param] of [['heading:title','title'],['heading:subtitle','subtitle']]) {
      if (!layout.hiddenFields?.includes(key)) {
        const value = metricValueFor(record, key, layout);
        if (value) url.searchParams.set(param, value);
      }
    }
    const settings = cartAppearance.settings(layout);
    for (const [param,key] of [['qrShape','shape'],['qrFinderShape','finderShape'],['qrColor','color'],['qrFinderColor','finderColor']])
      url.searchParams.set(param, settings[key].replace(/^#/, ''));
    const preset = qrPresets.getEntries().find(entry => entry.id === layout.qrTemplateId);
    if (preset) url.searchParams.set('qrTemplate', preset.name);
    url.searchParams.set('preview', '1');
    return url.href;
  }
  async function copyQRLink(mode) {
    const link = qrShareURL(mode);
    if (!link) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
      else {
        const field = document.createElement('textarea');
        field.value = link;field.style.cssText = 'position:fixed;opacity:0;left:0;top:0';
        const previous = document.activeElement;
        document.body.append(field);field.select();
        let copied;
        try { copied = document.execCommand('copy'); } finally { field.remove();previous?.focus(); }
        if (!copied) throw new Error('Clipboard unavailable');
      }
      toast(t('Link kopiert.'));
    } catch { toast(t('Der Link konnte nicht kopiert werden. Bitte den Zugriff auf die Zwischenablage erlauben.'), 'warning'); }
  }
  function openLargeQRPreview() {
    let dialog=document.getElementById('largeQRPreview');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='largeQRPreview';dialog.className='large-qr-preview modal-frame';dialog.innerHTML='<div class="preview-header"><h2></h2><button type="button" class="modal-close">×</button></div><div class="modal-scroll-body"><canvas></canvas></div>';dialog.setAttribute('aria-label',t('QR-Code-Vorschau'));document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());}
    dialog.querySelector('h2').textContent=t('QR-Code-Vorschau');dialog.querySelector('button').setAttribute('aria-label',t('Schliessen'));
    generateQRCode();const target=dialog.querySelector('canvas');target.width=canvas.width;target.height=canvas.height;target.getContext('2d').drawImage(canvas,0,0);
    if(!dialog.open)dialog.showModal();
  }
  function openQRSettings(mode = activeMode) {
    cartAppearance.open(mode === "bulk" ? bulkLayout : singleLayout);
  }
  function previewClick(event, mode, target) {
    const rect = target.getBoundingClientRect(),
      hit = target.qrHitBox;
    const y = ((event.clientY - rect.top) * target.height) / rect.height;
    if (event.detail === 0 || (hit && y >= hit.y && y <= hit.y + hit.height))
      openQRSettings(mode);
  }

  document
    .getElementById("closeQRSettingsBtn")
    .addEventListener("click", () => {
      document.getElementById("qrSettings").hidden = true;
      showMainPreviews();
      generateQRCode();
    });

  document
    .getElementById("bulkRibbonBtn")
    .addEventListener("click", openRibbonEditor);
  document
    .getElementById("bulkPreviewButton")
    .addEventListener("click", (event) =>
      previewClick(event, "bulk", document.getElementById("bulkPageCanvas")),
    );
  document
    .getElementById("exportFormat")
    .addEventListener("change", saveSettings);
  document
    .getElementById("singleFormat")
    .addEventListener("change", saveSettings);

  const templateLibrary = createTemplateLibrary({
    importLogos: addTemplateLogos,
    validateAppearance: () => cartAppearance.validate(metricLayout),
    checkCompatibility: warnCartCompatibility,
    readSettings,
    saveLayout,
    saveSettings,
    renderSavedLogos,
    openLayoutEditor,
    generateQRCode,
    bulkLayout,
    singleLayout,
    getMode: () => editorMode,
    getSnapshot: () => editorSnapshot,
    getLayout: () => metricLayout,
    getLogoData: () => logoState.data,
    setLogo: (image, data) => {
      ++logoState.version;
      logoState.image = image;
      logoState.data = data;
    },
  });
  const {
    confirmDeletion,
    templateChanged,
    requestTemplateSave,
    renderTemplates,
  } = templateLibrary;

  const contentEditor = window.QRGenerator["qr-content"].createContentEditor({
    confirmDeletion,
    getRecords: () => loadedData,
    getExpression: () => bulkLayout.contentExpression || "",
    getCards: () => bulkLayout.contentCards,
    setExpression: (value, cards) => {
      bulkLayout.contentExpression = value;
      bulkLayout.contentCards = cards;
    },
    changed: () => {
      const valid = contentEditor.validate();
      generateBtn.disabled = !valid || isGenerating;
      if (layoutSample?.Raw) {
        try {
          layoutSample.URL = window.QRGenerator["qr-content"].resolveContent(
            bulkLayout.contentExpression,
            layoutSample.Raw,
            bulkLayout.contentCards,
          );
        } catch {
          layoutSample.URL = "";
        }
      }
      saveLayout();
      generateQRCode();
    },
  });
  const qrPresets = window.QRGenerator["qr-presets"].createQRPresets({
    confirmDeletion,
    importLogos: addTemplateLogos,
    read: () => {
      const { logo, ...appearance } = readSettings();
      return {
        appearance,
        logoData: logoState.data,
        ribbon: structuredClone(bulkLayout.ribbon),
      };
    },
    apply: (payload, image) => {
      for (const [key, id] of [
        ["shape", "shapeSelect"],
        ["finderShape", "finderShapeSelect"],
        ["color", "colorPicker"],
        ["finderColor", "finderColorPicker"],
      ])
        document.getElementById(id).value = payload.appearance[key];
      ++logoState.version;
      logoState.image = image;
      logoState.data = payload.logoData || "";
      if (
        !cartAppearance.active() &&
        payload.ribbon &&
        Array.isArray(payload.ribbon.rules)
      ) {
        const ribbon = {
          enabled: payload.ribbon.enabled !== false,
          rules: payload.ribbon.rules
            .filter(
              (rule) =>
                rule &&
                typeof rule.text === "string" &&
                typeof rule.pattern === "string" &&
                /^#[0-9a-f]{6}$/i.test(rule.color),
            )
            .map((rule) => ({
              ...rule,
              id: crypto.randomUUID(),
              text: Array.from(rule.text).slice(0, 5).join(""),
              match: rule.match === "always" ? "always" : "contains",
            })),
        };
        bulkLayout.ribbon = ribbon;
        singleLayout.ribbon = ribbon;
      }
      saveSettings();
      saveLayout();
      renderSavedLogos();
      generateQRCode();
    },
  });
  const cartAppearance = window.QRGenerator[
    "cart-appearance"
  ].createCartAppearance({
    size: EXPORT_SIZE,
    content: (layout) =>
      layout === bulkLayout
        ? loadedData?.[0]?.URL || DEMO_QR_CONTENT
        : qrInput.value.trim() || DEMO_QR_CONTENT,
    read: () => {
      const { logo, ...appearance } = readSettings();
      return { appearance, logoData: logoState.data };
    },
    logo: () => logoState.image,
    entries: () => qrPresets.getEntries(),
    baseline: (payload) => qrPresets.syncSelection(payload),
    confirmDiscard: () => qrPresets.confirmDiscard(),
    apply: (payload, image) => {
      for (const [key, id] of [
        ["shape", "shapeSelect"],
        ["finderShape", "finderShapeSelect"],
        ["color", "colorPicker"],
        ["finderColor", "finderColorPicker"],
      ])
        document.getElementById(id).value = payload.appearance[key];
      ++logoState.version;
      logoState.image = image;
      logoState.data = payload.logoData || "";
      renderSavedLogos();
    },
    refresh: () => {
      generateQRCode();
      if (activeMode === "carts" && !layoutDialog.open) renderCartGallery();
    },
    persist: () => {
      saveLayout();
      saveSettings();
    },
  });

  document.querySelectorAll("[data-language]").forEach((button) =>
    button.addEventListener("click", () => {
      if (window.QRGenerator.i18n.language === button.dataset.language) return;
      setLanguage(button.dataset.language);
      // Updating in place preserves imported records, user input and all open dialogs.
      translateInterface();
      for (const [node, render] of localizedMessages)
        if (node.isConnected) node.textContent = render();
      for (const [field, select] of Object.entries(mappingFields))
        if (select.options.length)
          select.options[0].textContent =
            field === "URL" ? t("URL-Feld auswählen …") : t("Nicht verwenden");
      renderSavedLogos();
      renderTemplates();
      qrPresets.render();
      if (activeMode === "templates") renderTemplateGallery();
      if (activeMode === "carts") renderCartGallery();
      renderSavedBaseURLs();
      if (layoutDialog.open) openLayoutEditor(editorMode);
      if (ribbonDialog.open) renderRibbonRules();
      generateQRCode();
    }),
  );
  window.QRGenerator["csv-converter"].initialize({
    confirmDeletion: (...args) => confirmDeletion(...args),
  });
  initializeCartPanels();
  restoreLayout();
  restoreSettings();
  try {
    if (!localStorage.getItem("qr-generator.template-logos-migrated.v1")) {
      addTemplateLogos([
        ...qrPresets
          .getEntries()
          .map((entry) => ({ name: entry.name, data: entry.payload.logoData })),
        ...templateLibrary
          .getEntries()
          .map((entry) => ({
            name: entry.name,
            data: entry.payload.layout?.qrAppearance?.logoData,
          })),
      ]);
      localStorage.setItem("qr-generator.template-logos-migrated.v1", "true");
    }
  } catch {
    /* Logo imports remain available for this session. */
  }
  renderSavedLogos();
  loadQueryParameters();
  document.fonts?.ready.then(() => generateQRCode());

  const initialTab = new URLSearchParams(location.search).get("tab");
  setImportVisible(
    new URLSearchParams(location.search).has("url") ? false : ["templates", "carts"].includes(initialTab)
      ? initialTab
      : initialTab === "bulk",
  );

  const largePreviewButton=document.getElementById('largeQRPreviewButton');
  if(largePreviewButton){largePreviewButton.title=t('QR-Code vergrössern');largePreviewButton.setAttribute('aria-label',largePreviewButton.title);if(new URLSearchParams(location.search).get('preview')!=='0')requestAnimationFrame(openLargeQRPreview);}
  window.QRGenerator["app"] = {};
})();
