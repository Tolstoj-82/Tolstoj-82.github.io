(() => {
  "use strict";
  const { t, setMessage } = window.QRGenerator["i18n"];
  function createTemplateLibrary(context) {
    const {
      readSettings,
      saveLayout,
      saveSettings,
      renderSavedLogos,
      openLayoutEditor,
      generateQRCode,
      bulkLayout,
      singleLayout,
    } = context;
    const shapeSelect = document.getElementById("shapeSelect"),
      finderShapeSelect = document.getElementById("finderShapeSelect"),
      colorPicker = document.getElementById("colorPicker"),
      finderColorPicker = document.getElementById("finderColorPicker"),
      layoutDialog = document.getElementById("layoutDialog");
    const templateStorageKey = "qr-generator.text-templates.v2";
    const { createTemplateCombo, confirmOverwrite, requestTemplateName } =
      window.QRGenerator["template-combo"];
    const templateName = document.getElementById("templateName");
    let templates = [];
    try {
      const saved = JSON.parse(
        localStorage.getItem(templateStorageKey) ||
          localStorage.getItem("qr-generator.templates.v1") ||
          "[]",
      );
      if (Array.isArray(saved))
        templates = saved.filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            item.payload &&
            typeof item.payload === "object",
        );
      templates = templates.flatMap((item) =>
        item.kind
          ? [item]
          : ["single", "bulk"].map((kind) => ({
              ...item,
              id: item.id + ":" + kind,
              kind,
            })),
      );
    } catch {
      /* A damaged library must not prevent QR creation. */
    }

    let selectedTemplateId = "",
      templateBaseline = "",
      saveTemplateResolve = null,
      deleteResolve = null;
    const saveTemplateDialog = document.getElementById("saveTemplateDialog");
    const deleteConfirmDialog = document.getElementById("deleteConfirmDialog");
    function confirmDeletion(name = "", options = {}) {
      if (deleteResolve) return Promise.resolve(false);
      setMessage(document.getElementById("deleteConfirmText"), () =>
        name
          ? t(
              options.kind === "data"
                ? "Entfernen: "
                : options.kind === "logo"
                  ? "Logo löschen: "
                  : "Template löschen: ",
            ) +
            name +
            "?"
          : t("Diesen Eintrag wirklich löschen?"),
      );
      const usage = document.getElementById("deleteLogoUsage"),
        list = document.getElementById("deleteLogoTemplates"),
        ack = document.getElementById("deleteLogoAcknowledgement");
      const names = options.templates || [];
      usage.hidden = names.length === 0;
      list.replaceChildren();
      for (const name of names) {
        const item = document.createElement("li");
        item.textContent = name;
        list.append(item);
      }
      ack.checked = false;
      document.getElementById("confirmDeleteBtn").disabled = names.length > 0;
      deleteConfirmDialog.showModal();
      document.getElementById("cancelDeleteConfirmBtn").focus();
      return new Promise((resolve) => {
        deleteResolve = resolve;
      });
    }
    document
      .getElementById("deleteLogoAcknowledgement")
      .addEventListener("change", (event) => {
        document.getElementById("confirmDeleteBtn").disabled =
          !event.target.checked;
      });
    function finishDeletion(confirmed) {
      if (confirmed && document.getElementById("confirmDeleteBtn").disabled)
        return;
      const resolve = deleteResolve;
      deleteResolve = null;
      deleteConfirmDialog.close();
      resolve?.(confirmed);
    }
    document
      .getElementById("confirmDeleteBtn")
      .addEventListener("click", () => finishDeletion(true));
    for (const id of ["cancelDeleteConfirmBtn", "closeDeleteConfirmBtn"])
      document
        .getElementById(id)
        .addEventListener("click", () => finishDeletion(false));
    deleteConfirmDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finishDeletion(false);
    });
    const selectedByMode = { single: "", bulk: "" },
      namesByMode = { single: "", bulk: "" };
    let currentMode = context.getMode();
    const combo = createTemplateCombo({
      host: document.getElementById("templateSelect").parentElement,
      id: "templateSelect",
      getItems: () =>
        templates.filter((item) => item.kind === context.getMode()),
      choose: async (item) => {
        if (!layoutDialog.open) await openLayoutEditor(context.getMode());
        if (templateChanged() && (await requestTemplateSave(true)) === "cancel")
          return false;
        const previous = selectedTemplateId;
        selectedTemplateId = item.id;
        if (!(await loadTemplate())) {
          selectedTemplateId = previous;
          return false;
        }
        combo.input.value = item.name;
        renderTemplates();
        return true;
      },
      remove: async (item) => {
        if (!(await confirmDeletion(item.name))) return;
        if (
          persistTemplates(
            templates.filter((entry) => entry.id !== item.id),
            selectedTemplateId === item.id ? "" : selectedTemplateId,
            "Template gelöscht.",
          ) &&
          combo.input.value === item.name
        )
          combo.input.value = "";
      },
      save: () => saveCurrentTemplate(),
    });
    const saveAs=document.createElement('button');saveAs.type='button';saveAs.className='action-button secondary';
    document.getElementById('saveTemplateBtn').after(saveAs);
    saveAs.addEventListener('click',()=>saveCurrentTemplate(true));
    async function saveCurrentTemplate(asNew=false){
      if(!context.validateAppearance())return false;
      const current=templates.find(item=>item.id===selectedTemplateId&&item.kind===context.getMode());
      const name=asNew||!current ? await requestTemplateName(asNew&&current?current.name+' '+t('Kopie'):'',templates.filter(item=>item.kind===context.getMode()).map(item=>item.name)) : current.name;
      return name?saveNamedTemplate(name):false;
    }
    function closeTemplateOptions() {
      combo.close();
    }
    function renderTemplates(selected = selectedTemplateId) {
      saveAs.textContent=t("Speichern unter …");
      const mode = context.getMode();
      if (mode !== currentMode) {
        selectedByMode[currentMode] = selectedTemplateId;
        namesByMode[currentMode] = combo.input.value;
        selected = selectedByMode[mode];
        combo.input.value = namesByMode[mode];
        currentMode = mode;
      }
      selectedTemplateId = templates.some(
        (item) => item.kind === mode && item.id === selected,
      )
        ? selected
        : "";
      combo.render();
    }
    let saving = false;
    async function saveNamedTemplate(value) {
      if (saving) return false;
      if (!context.validateAppearance()) return false;
      const name = value.trim().slice(0, 80),
        mode = context.getMode();
      if (!name) {
        templateFeedback("Bitte einen Template-Namen eingeben.", true);
        combo.input.focus();
        return false;
      }
      saving = true;
      try {
        const existing = templates.find(
          (item) =>
            item.kind === mode &&
            item.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
        );
        const payload = templatePayload();
        if (existing && !(await confirmOverwrite(existing.name))) return false;
        const item = {
          id: existing?.id || crypto.randomUUID(),
          name: existing?.name || name,
          kind: mode,
          payload,
        };
        const next = existing
          ? templates.map((entry) => (entry.id === existing.id ? item : entry))
          : [...templates, item];
        if (!persistTemplates(next, item.id, "Template gespeichert."))
          return false;
        combo.input.value = item.name;
        combo.close();
        templateBaseline = templateSignature();
        window.QRGenerator.notifications.toast(t("Template gespeichert."));
        return true;
      } finally {
        saving = false;
      }
    }
    function templateFeedback(message, error = false) {
      setMessage(document.getElementById("templateStatus"), () => t(message));
      document
        .getElementById("templateStatus")
        .classList.toggle("is-error", error);
      if (saveTemplateDialog.open)
        setMessage(document.getElementById("saveTemplateError"), () =>
          error ? t(message) : "",
        );
    }
    function persistTemplates(next, selected, message) {
      try {
        localStorage.setItem(templateStorageKey, JSON.stringify(next));
      } catch {
        templateFeedback(
          "Templates konnten nicht gespeichert werden. Der lokale Speicher ist voll oder nicht verfügbar.",
          true,
        );
        return false;
      }
      templates = next;
      renderTemplates(selected);
      templateFeedback(message);
      return true;
    }
    function templatePayload() {
      const layout = context.getLayout();
      return {
        version: 2,
        layout: structuredClone(layout),
        format: document.getElementById(
          context.getMode() === "single" ? "singleFormat" : "exportFormat",
        ).value,
      };
    }
    function templateSignature() {
      return JSON.stringify(templatePayload());
    }
    function templateChanged() {
      return (
        Boolean(templateBaseline) && templateSignature() !== templateBaseline
      );
    }
    function requestTemplateSave(automatic = false) {
      if (saveTemplateResolve) return Promise.resolve("cancel");
      closeTemplateOptions();
      templateName.value = templates.find(item=>item.id===selectedTemplateId)?.name || "";
      document.getElementById("skipSaveTemplateBtn").hidden = !automatic;
      setMessage(document.getElementById("saveTemplateError"), () => "");
      saveTemplateDialog.showModal();
      templateName.focus();
      return new Promise((resolve) => {
        saveTemplateResolve = resolve;
      });
    }
    function finishTemplateSave(result) {
      const resolve = saveTemplateResolve;
      saveTemplateResolve = null;
      saveTemplateDialog.close();
      resolve?.(result);
    }
    document
      .getElementById("saveTemplateBtn")
      .addEventListener("click", () => saveCurrentTemplate());
    for (const id of ["cancelSaveTemplateBtn", "closeSaveTemplateBtn"])
      document
        .getElementById(id)
        .addEventListener("click", () => finishTemplateSave("cancel"));
    document
      .getElementById("skipSaveTemplateBtn")
      .addEventListener("click", () => {
        templateBaseline = templateSignature();
        finishTemplateSave("skip");
      });
    saveTemplateDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finishTemplateSave("cancel");
    });
    document
      .getElementById("confirmSaveTemplateBtn")
      .addEventListener("click", async () => {
        if (await saveNamedTemplate(templateName.value))
          finishTemplateSave("saved");
      });
    let templateLoadVersion = 0;
    async function loadTemplate() {
      const selected = templates.find((item) => item.id === selectedTemplateId);
      if (!selected) return;
      const version = ++templateLoadVersion,
        mode = context.getMode(),
        snapshot = context.getSnapshot();
      try {
        const payload = selected.payload,
          saved = payload.layout;
        if (
          !saved ||
          !Array.isArray(saved.above) ||
          !Array.isArray(saved.below)
        )
          throw Error();
        const used = new Set(),
          clean = { above: [], below: [], labels: {}, custom: {}, styles: {} };
        for (const area of ["above", "below"])
          clean[area] = saved[area].filter(
            (key) => typeof key === "string" && !used.has(key) && used.add(key),
          );
        for (const property of ["labels", "custom"])
          clean[property] = Object.fromEntries(
            Object.entries(saved[property] || {}).filter(
              ([key, value]) => typeof value === "string",
            ),
          );
        clean.styles = Object.fromEntries(
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
        if (
          version !== templateLoadVersion ||
          !layoutDialog.open ||
          mode !== context.getMode()
        )
          return;
        if (mode === "bulk")
          clean.contentExpression =
            typeof saved.contentExpression === "string"
              ? saved.contentExpression
              : context.getLayout().contentExpression || "";
        if (mode === "bulk")
          clean.contentCards = Array.isArray(saved.contentCards)
            ? saved.contentCards.filter(
                (card) =>
                  card &&
                  ["free", "url", "field"].includes(card.kind) &&
                  typeof card.value === "string",
              )
            : undefined;
        Object.assign(clean, window.QRGenerator["cart-fields"].clean(saved));
        clean.dateFormat = saved.dateFormat === "us" ? "us" : "eu";
        clean.qrAppearance = saved.qrAppearance;
        clean.qrTemplateId = saved.qrTemplateId;
        if (saved.ribbon) clean.ribbon = structuredClone(saved.ribbon);
        clean.headingsMovable = saved.headingsMovable === true;
        Object.assign(context.getLayout(), clean);
        if (mode === "bulk") context.checkCompatibility?.(clean, selected.name);
        if (["png", "svg"].includes(payload.format))
          document.getElementById(
            mode === "single" ? "singleFormat" : "exportFormat",
          ).value = payload.format;
        saveLayout();
        saveSettings();
        renderSavedLogos();
        await openLayoutEditor(mode);
        generateQRCode();
        templateFeedback("Template angewendet.");
        templateBaseline = templateSignature();
        return true;
      } catch {
        templateFeedback("Ungültiges Template.", true);
        return false;
      }
    }
    async function exportFile() {
      const selected = await window.QRGenerator["template-export"].choose(
        templates,
        "Carts exportieren",
      );
      if (!selected.length) return;
      const blob = new Blob(
        [
          JSON.stringify(
            { format: "qr-generator-carts", version: 1, templates: selected },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = "Carts.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    async function importFile(file) {
      try {
        if (file.size > 20 * 1024 * 1024) throw Error();
        const data = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
        if (
          data.format !== "qr-generator-carts" ||
          data.version !== 1 ||
          !Array.isArray(data.templates) ||
          !data.templates.length ||
          data.templates.length > 200
        )
          throw Error();
        const imported = [];
        for (const item of data.templates) {
          const layout = item?.payload?.layout;
          if (
            !["single", "bulk"].includes(item?.kind) ||
            typeof item.name !== "string" ||
            !item.name.trim() ||
            item.name.length > 80 ||
            !layout
          )
            throw Error();
          for (const area of ["above", "below"])
            if (
              !Array.isArray(layout[area]) ||
              layout[area].length > 200 ||
              layout[area].some(
                (key) => typeof key !== "string" || key.length > 500,
              )
            )
              throw Error();
          for (const field of ["labels", "custom"])
            if (
              layout[field] &&
              (typeof layout[field] !== "object" ||
                Array.isArray(layout[field]) ||
                Object.values(layout[field]).some(
                  (value) => typeof value !== "string",
                ))
            )
              throw Error();
          if (
            layout.styles &&
            (typeof layout.styles !== "object" ||
              Array.isArray(layout.styles) ||
              Object.values(layout.styles).some(
                (value) => !value || typeof value !== "object",
              ))
          )
            throw Error();
          if (
            layout.contentExpression !== undefined &&
            typeof layout.contentExpression !== "string"
          )
            throw Error();
          if (
            layout.contentCards &&
            (!Array.isArray(layout.contentCards) ||
              layout.contentCards.some(
                (card) =>
                  !card ||
                  !["free", "field", "url"].includes(card.kind) ||
                  typeof card.value !== "string",
              ))
          )
            throw Error();
          if (
            layout.ribbon &&
            (!Array.isArray(layout.ribbon.rules) ||
              layout.ribbon.rules.length > 100 ||
              layout.ribbon.rules.some(
                (rule) =>
                  !rule ||
                  typeof rule.text !== "string" ||
                  Array.from(rule.text).length > 5 ||
                  typeof rule.pattern !== "string" ||
                  !["always", "contains"].includes(rule.match) ||
                  !/^#[0-9a-f]{6}$/i.test(rule.color),
              ))
          )
            throw Error();
          if (layout.qrAppearance) {
            const { appearance, logoData } = layout.qrAppearance;
            if (!appearance) throw Error();
            for (const [key, id] of [
              ["shape", "shapeSelect"],
              ["finderShape", "finderShapeSelect"],
            ])
              if (
                ![...document.getElementById(id).options].some(
                  (option) => option.value === appearance[key],
                )
              )
                throw Error();
            for (const key of ["color", "finderColor"])
              if (!/^#[0-9a-f]{6}$/i.test(appearance[key])) throw Error();
            if (logoData) {
              if (
                typeof logoData !== "string" ||
                !/^data:image\/png;base64,/.test(logoData) ||
                logoData.length > 500000
              )
                throw Error();
              const image = new Image();
              image.src = logoData;
              await image.decode();
              if (
                image.naturalWidth > 256 ||
                !image.naturalWidth ||
                image.naturalWidth !== image.naturalHeight
              )
                throw Error();
            }
          }
          imported.push({
            id: crypto.randomUUID(),
            name: item.name.trim(),
            kind: item.kind,
            payload: structuredClone(item.payload),
          });
        }
        // Import is additive. Conflicting names receive a suffix instead of replacing local Carts.
        const names = new Set(
          templates.map(
            (item) => item.kind + ":" + item.name.toLocaleLowerCase(),
          ),
        );
        for (const item of imported) {
          const base = item.name;
          let suffix = 2;
          while (names.has(item.kind + ":" + item.name.toLocaleLowerCase()))
            item.name = base.slice(0, 70) + " (" + suffix++ + ")";
          names.add(item.kind + ":" + item.name.toLocaleLowerCase());
        }
        if (
          persistTemplates(
            [...templates, ...imported],
            selectedTemplateId,
            "Carts importiert.",
          )
        ) {
          context.importLogos(
            imported.map((item) => ({
              name: item.name,
              data: item.payload.layout?.qrAppearance?.logoData,
            })),
          );
          window.QRGenerator.notifications.toast(t("Carts importiert."));
        }
      } catch {
        window.QRGenerator.notifications.toast(
          t("Ungültige Cart-Datei."),
          "warning",
        );
      }
    }
    renderTemplates();

    return {
      reorder: (kind, ids) => {
        const group = templates.filter((item) => item.kind === kind);
        if (
          ids.length !== group.length ||
          new Set(ids).size !== ids.length ||
          ids.some((id) => !group.some((item) => item.id === id))
        )
          return false;
        const ordered = ids.map((id) => group.find((item) => item.id === id));
        let index = 0;
        return persistTemplates(
          templates.map((item) =>
            item.kind === kind ? ordered[index++] : item,
          ),
          selectedTemplateId,
          "",
        );
      },
      importFile,
      exportFile,
      createNew: () => {
        selectedTemplateId = "";
        combo.input.value = "";
        templateBaseline = "";
      },
      getEntries: () => templates,
      choose: (item) => combo.choose(item),
      remove: (item) => combo.remove(item),
      confirmDeletion,
      templateChanged,
      requestTemplateSave,
      renderTemplates,
      markBaseline: () => {
        templateBaseline = templateSignature();
      },
    };
  }

  window.QRGenerator["templates"] = { createTemplateLibrary };
})();
