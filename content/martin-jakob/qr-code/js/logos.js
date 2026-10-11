(() => {
"use strict";
const {t, LocalizedError, setMessage} = window.QRGenerator["i18n"];
const {requestLogoCrop} = window.QRGenerator["logo-crop"];

function createLogoManager({saveSettings, generateQRCode, confirmDeletion, getLogoTemplates}) {
  const logoState = {image: null, version: 0, data: ""};

  const logoInput = document.getElementById("logoInput");
  const logoStatus = document.getElementById("logoStatus");
  const logoStorageKey = "qr-generator.logos.v1";
  const savedLogos = document.getElementById("savedLogos");
  let sessionLogos = null;
  document
    .getElementById("chooseLogoBtn")
    .addEventListener("click", () =>
      document.getElementById("logoInput").click(),
    );
  function readSavedLogos() {
    if (sessionLogos) return sessionLogos;
    try {
      const items = JSON.parse(localStorage.getItem(logoStorageKey) || "[]");
      return Array.isArray(items)
        ? items
            .filter(
              (item) =>
                item &&
                typeof item.name === "string" &&
                typeof item.data === "string" &&
                item.data.length < 500000 &&
                /^data:image\/png;base64,/.test(item.data),
            )
            .slice(0, 12)
        : [];
    } catch {
      return [];
    }
  }
  function writeSavedLogos(items) {
    sessionLogos = items;
    try {
      localStorage.setItem(logoStorageKey, JSON.stringify(items));
      return true;
    } catch {
      setMessage(logoStatus, () =>
        t(
          "Das Logo kann verwendet werden, aber der lokale Speicher ist voll oder nicht verfügbar.",
        ),
        "warning"
      );
      return true;
    }
  }
  let draggedLogo = null;
  savedLogos.addEventListener("dragover", event => {if(draggedLogo)event.preventDefault();});
  savedLogos.addEventListener("drop", event => {
    if(!draggedLogo)return;event.preventDefault();draggedLogo.committed=true;
    const stored = new Set(readSavedLogos().map(item=>item.data));
    writeSavedLogos([...savedLogos.querySelectorAll(".saved-logo")].map(node=>node.logoItem).filter(item=>stored.has(item.data)));
  });
  function reorderLogo(source, target) {
    const items = [...readSavedLogos()], from = items.findIndex(item => item.data === source), to = items.findIndex(item => item.data === target);
    if (from < 0 || to < 0 || from === to) return;
    items.splice(to, 0, items.splice(from, 1)[0]); writeSavedLogos(items); renderSavedLogos();
  }
  function renderSavedLogos() {
    const items = [...readSavedLogos()];
    if (logoState.data && !items.some(item => item.data === logoState.data)) items.unshift({name: t("Template-Logo"), data: logoState.data});
    savedLogos.replaceChildren(document.getElementById("chooseLogoBtn"));
    savedLogos.hidden = false;
    const empty = document.createElement("button");
    empty.type = "button";
    empty.className = "saved-logo-select empty-logo";
    empty.setAttribute("aria-label", t("Ohne Logo"));
    empty.title = t("Ohne Logo");
    empty.setAttribute("aria-pressed", String(!logoState.data));
    empty.addEventListener("click", clearLogo);
    savedLogos.append(empty);
    for (const item of items) {
      const tile = document.createElement("div");
      tile.className = "saved-logo";
      tile.draggable = readSavedLogos().some(saved=>saved.data===item.data);
      tile.logoItem = item;
      tile.addEventListener("dragstart", event => {
        draggedLogo = {tile, original: [...savedLogos.querySelectorAll(".saved-logo")], committed: false};
        event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", "logo");
        requestAnimationFrame(() => {if(draggedLogo?.tile===tile)tile.classList.add("dragging");});
      });
      tile.addEventListener("dragover", event => {
        if (!draggedLogo || draggedLogo.tile === tile) return;
        event.preventDefault();event.dataTransfer.dropEffect="move";
        const nodes=[...savedLogos.querySelectorAll(".saved-logo")], active=draggedLogo.tile;
        const before=new Map(nodes.map(node=>[node,node.getBoundingClientRect()]));
        const forward=nodes.indexOf(active)<nodes.indexOf(tile), rect=tile.getBoundingClientRect();
        if ((forward && event.clientX < rect.left + rect.width / 2) || (!forward && event.clientX > rect.left + rect.width / 2)) return;
        savedLogos.insertBefore(active, forward ? tile.nextSibling : tile);
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) for(const node of nodes) {
          if(node===active)continue;
          const old=before.get(node), next=node.getBoundingClientRect();
          node.getAnimations?.().forEach(animation=>animation.cancel());
          node.animate([{transform: "translate("+(old.left-next.left)+"px,"+(old.top-next.top)+"px)"},{transform:"translate(0,0)"}],{duration:180,easing:"ease-out"});
        }
      });
      tile.addEventListener("dragend", () => {
        if(draggedLogo && !draggedLogo.committed)for(const node of draggedLogo.original)savedLogos.append(node);
        draggedLogo=null;tile.classList.remove("dragging");
      });
      const select = document.createElement("button");
      select.addEventListener("keydown", event => {
        if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault(); const saved = readSavedLogos(), index = saved.findIndex(entry => entry.data === item.data), target = saved[index + (event.key === "ArrowLeft" ? -1 : 1)];
        if (target) {reorderLogo(item.data, target.data); [...savedLogos.querySelectorAll(".saved-logo-select")].find(button => button.getAttribute("aria-label") === t("Logo auswählen: ") + item.name)?.focus();}
      });
      select.type = "button";
      select.className = "saved-logo-select";
      select.setAttribute("aria-label", t("Logo auswählen: ") + item.name);
      select.setAttribute("aria-pressed", String(logoState.data === item.data));
      const thumbnail = document.createElement("img");
      thumbnail.draggable = false;
      thumbnail.src = item.data;
      thumbnail.alt = item.name;
      select.append(thumbnail);
      select.addEventListener("click", async () => {
        const version = ++logoState.version;
        try {
          const image = new Image();
          image.src = item.data;
          await image.decode();
          if (version !== logoState.version) return;
          if (
            !image.naturalWidth ||
            image.naturalWidth !== image.naturalHeight ||
            image.naturalWidth > 256
          )
            throw new LocalizedError(() => t("Ungültiges gespeichertes Logo."));
          logoState.image = image;
          logoState.data = item.data;
          setMessage(logoStatus, () => t("Logo ausgewählt."));
          renderSavedLogos();
          saveSettings();
          generateQRCode();
        } catch {
          if (version === logoState.version)
            setMessage(logoStatus, () =>
              t(
                "Das gespeicherte Logo konnte nicht geladen werden. Bitte löschen und erneut hochladen.",
              ),
              "warning"
            );
        }
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "saved-logo-delete";
      remove.textContent = "×";
      remove.setAttribute(
        "aria-label",
        t("Gespeichertes Logo löschen: ") + item.name,
      );
      remove.addEventListener("click", async () => {
      if (!await confirmDeletion(item.name, {kind: "logo", templates: getLogoTemplates(item.data)})) return;
        ++logoState.version;
        if (
          !writeSavedLogos(
            readSavedLogos().filter((saved) => saved.data !== item.data),
          )
        )
          return;
        if (logoState.data === item.data) {
          logoState.image = null;
          logoState.data = "";
          generateQRCode();
        }
        saveSettings();
        setMessage(logoStatus, () => t("Gespeichertes Logo gelöscht."));
        renderSavedLogos();
      });
      tile.append(select, remove);
      savedLogos.append(tile);
    }
  }
  async function uploadLogo(file) {
    if (!file) return;
    const version = ++logoState.version;
    let objectURL;
    try {
      if (!["image/png", "image/jpeg"].includes(file.type))
        throw new LocalizedError(() =>
          t("Bitte ein PNG- oder JPEG-Bild auswählen."),
        );
      if (file.size > 20 * 1024 * 1024)
        throw new LocalizedError(() =>
          t("Das Bild darf höchstens 20 MB gross sein."),
        );
      objectURL = URL.createObjectURL(file);
      const image = new Image();
      image.src = objectURL;
      await image.decode();
      if (version !== logoState.version) return;
      if (!image.naturalWidth || !image.naturalHeight)
        throw new LocalizedError(() =>
          t("Das Bild konnte nicht geladen werden."),
        );
      if (image.naturalWidth > 8192 || image.naturalHeight > 8192 || image.naturalWidth * image.naturalHeight > 40000000)
        throw new LocalizedError(() =>
          t("Das Bild darf höchstens 8192 Pixel pro Seite und 40 Megapixel gross sein."),
        );
      let logo;
      if (image.naturalWidth !== image.naturalHeight) {
        logo = await requestLogoCrop(image);
        if (!logo || version !== logoState.version) return;
      } else {
        logo = document.createElement("canvas");
        logo.width = logo.height = Math.min(256, image.naturalWidth);
        logo.getContext("2d").drawImage(image, 0, 0, logo.width, logo.height);
      }
      const data = logo.toDataURL("image/png");
      const saved = readSavedLogos().filter((item) => item.data !== data);
      if (saved.length >= 12)
        throw new LocalizedError(() =>
          t("Speicher voll: Bitte zuerst ein Logo löschen."),
        );
      logoState.image = logo;
      logoState.data = data;

      setMessage(logoStatus, () =>
        t("Logo hinzugefügt. Es wird auch im Massenexport verwendet."),
      );
      writeSavedLogos([{ name: file.name, data: logoState.data }, ...saved]);
      renderSavedLogos();
      saveSettings();
      generateQRCode();
    } catch (error) {
      if (version === logoState.version)
        setMessage(
          logoStatus,
          () =>
            (error.name === "EncodingError"
              ? t("Das Bild konnte nicht geladen werden.")
              : error.message) +
            (logoState.image ? t(" Das bisherige Bild bleibt erhalten.") : ""),
          "warning",
        );
    } finally {
      if (objectURL) URL.revokeObjectURL(objectURL);
      if (version === logoState.version) logoInput.value = "";
    }
  }
  function clearLogo() {
    ++logoState.version;
    logoState.image = null;
    logoState.data = "";
    renderSavedLogos();
    logoInput.value = "";

    setMessage(logoStatus, () => "");
    saveSettings();
    generateQRCode();
  }
  let logoUploadQueue = Promise.resolve();
  function uploadLogos(files) {
    const selected = Array.from(files);
    logoUploadQueue = logoUploadQueue.then(async () => {
      for (const file of selected) await uploadLogo(file);
    });
    return logoUploadQueue;
  }
  logoInput.addEventListener("change", () => uploadLogos(logoInput.files));

  return {logoState, readSavedLogos, renderSavedLogos};
}

window.QRGenerator["logos"] = {createLogoManager};
})();
