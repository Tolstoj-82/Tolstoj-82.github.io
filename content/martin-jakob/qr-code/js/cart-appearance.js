(() => {
  "use strict";
  const { t } = window.QRGenerator.i18n;
  const standard = {
    appearance: {
      shape: "square",
      finderShape: "square",
      color: "#000000",
      finderColor: "#000000",
    },
    logoData: "",
  };
  const signature = (payload) =>
    JSON.stringify([
      ...["shape", "finderShape", "color", "finderColor"].map(
        (key) => payload.appearance[key],
      ),
      payload.logoData || "",
    ]);
  function createCartAppearance(context) {
    const panel = document.getElementById("qrSettings"),
      host = document.getElementById("cartAppearance"),
      select = document.getElementById("cartQRTemplate");
    const details = document.getElementById("cartQROptions"),
      slot = document.getElementById("cartQRSettingsSlot"),
      dialog = document.getElementById("qrAppearanceDialog");
    const home = document.getElementById("cartAppearanceHome"),
      cache = new Map(),
      pending = new Map();
    const templateActions=document.getElementById('qrPresetSaveControls');
    const actionsHome=document.createComment('QR template actions home');
    templateActions.before(actionsHome);
    let target = null,
      snapshot = null,
      globalDraft = null,
      applying = false,
      loadVersion = 0;
    function payload() {
      return structuredClone(context.read());
    }
    async function imageFor(data) {
      if (!data) return null;
      if (cache.has(data)) return cache.get(data);
      if (!pending.has(data))
        pending.set(
          data,
          (async () => {
            const image = new Image();
            image.src = data;
            await image.decode();
            cache.set(data, image);
            return image;
          })(),
        );
      try {
        return await pending.get(data);
      } finally {
        pending.delete(data);
      }
    }
    function settings(layout) {
      const value = layout.qrAppearance || standard;
      if (
        value.logoData &&
        !cache.has(value.logoData) &&
        !pending.has(value.logoData)
      ) {
        imageFor(value.logoData)
          .then(() => context.refresh())
          .catch(() => cache.set(value.logoData, null));
      }
      return {
        ...value.appearance,
        logo: cache.get(value.logoData) || null,
        size: context.size,
      };
    }
    function capture() {
      if (target && !applying) {
        target.qrAppearance = payload();
        if (context.logo())
          cache.set(target.qrAppearance.logoData, context.logo());
      }
    }
    function renderOptions() {
      select.replaceChildren(new Option(t("Standard"), "standard"));
      for (const entry of context.entries())
        select.add(new Option(entry.name, entry.id));
      const current = target?.qrAppearance || standard;
      const match = context
        .entries()
        .find((entry) => signature(entry.payload) === signature(current));
      const id =
        signature(current) === signature(standard) ? "standard" : match?.id;
      if (!id) select.add(new Option(t("Nicht gespeichertes Aussehen"), ""));
      select.value = id || "";
      if (target) target.qrTemplateId = id || "";
    }
    async function use(value) {
      applying = true;
      const attempt = ++loadVersion;
      try {
        const image = await imageFor(value.logoData);
        if (attempt !== loadVersion) return;
        await context.apply(value, image);
        context.baseline(value);
      } finally {
        if (attempt === loadVersion) applying = false;
      }
    }
    async function attach(layout) {
      layout.qrAppearance ||= structuredClone(standard);
      if (target === layout) {
        host.hidden = false;
        panel.hidden = false;
        await use(layout.qrAppearance || standard);
        renderOptions();
        return;
      }
      if (target) await detach();
      document
        .getElementById("qrPresetSaveControls")
        .classList.remove("needs-save");
      target = layout;
      globalDraft = payload();
      host.hidden = false;
      home.append(host);
      slot.append(panel);
      host.insertBefore(templateActions,details);
      panel.hidden = false;
      details.open = false;
      await use(layout.qrAppearance || standard);
      renderOptions();
    }
    async function detach() {
      target = null;
      actionsHome.after(templateActions);
      panel
        .querySelector(".appearance-workbench")
        .prepend(document.querySelector(".settings-live-preview"));
      host.hidden = true;
      home.append(host);
      panel.hidden = true;
      document.getElementById("singleEditorSlot").append(panel);
      if (globalDraft) {
        const previous = globalDraft;
        globalDraft = null;
        await use(previous);
      }
    }
    function validate(layout = target) {
      capture();
      const value = layout?.qrAppearance || standard;
      const match = context
        .entries()
        .find((entry) => signature(entry.payload) === signature(value));
      if (signature(value) === signature(standard)) {
        layout.qrTemplateId = "standard";
        return true;
      }
      if (match) {
        layout.qrTemplateId = match.id;
        return true;
      }
      details.open = true;
      document.getElementById("layoutDialog").dispatchEvent(new Event("show-qr-settings"));
      window.QRGenerator.notifications.toast(
        t(
          "Bitte dieses Aussehen zuerst als QR-Code-Template speichern oder ein vorhandenes Template auswählen.",
        ),
        "warning",
      );
      const save = document.getElementById("qrPresetSaveControls");
      save.classList.remove("needs-save");
      void save.offsetWidth;
      save.classList.add("needs-save");
      requestAnimationFrame(() => {
        save.scrollIntoView({
          block: "center",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
        document
          .querySelector("#qrPresetSaveControls .action-button")
          .focus({ preventScroll: true });
      });
      return false;
    }
    select.addEventListener("change", async () => {
      const value =
        select.value === "standard"
          ? standard
          : context.entries().find((entry) => entry.id === select.value)
              ?.payload;
      if (!value) return;
      if (!(await context.confirmDiscard())) {
        renderOptions();
        return;
      }
      document
        .getElementById("qrPresetSaveControls")
        .classList.remove("needs-save");
      await use(value);
      target.qrAppearance = structuredClone(value);
      target.qrTemplateId = select.value;
      context.refresh();
    });
    async function open(layout) {
      snapshot = structuredClone(layout);
      await attach(layout);
      document.getElementById("qrAppearanceBody").prepend(host);
      host.prepend(panel.querySelector(".settings-live-preview"));
      details.open = true;
      dialog.showModal();
      context.refresh();
    }
    async function close(apply) {
      if (apply && !validate()) return;
      if (!apply && snapshot) {
        for (const key of Object.keys(target)) delete target[key];
        Object.assign(target, snapshot);
      }
      snapshot = null;
      dialog.close();
      await detach();
      context.persist();
      context.refresh();
    }
    document
      .getElementById("applyQRAppearance")
      .addEventListener("click", () => close(true));
    for (const id of ["cancelQRAppearance", "closeQRAppearance"])
      document.getElementById(id).addEventListener("click", () => close(false));
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close(false);
    });
    document.addEventListener("qr-templates-changed", () => {
      if (target) {
        capture();
        renderOptions();
        document
          .getElementById("qrPresetSaveControls")
          .classList.remove("needs-save");
      }
    });
    return {
      ready: (layout) => imageFor(layout.qrAppearance?.logoData),
      settings,
      capture,
      attach,
      detach,
      open,
      validate,
      renderOptions,
      active: () => Boolean(target),
      content: () => (target ? context.content(target) : null),
      refresh: () => {
        if (target) {
          capture();
          renderOptions();
        }
      },
    };
  }
  window.QRGenerator["cart-appearance"] = { createCartAppearance };
})();
