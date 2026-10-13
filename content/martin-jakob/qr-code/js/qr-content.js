(() => {
  "use strict";
  const { t, setMessage } = window.QRGenerator.i18n;
  const valueText = (value) =>
    value == null
      ? ""
      : Array.isArray(value)
        ? value.join(", ")
        : String(value);
  const token = (key) => "{{" + JSON.stringify(key) + "}}";
  function recordsFromCSV(text, separator = "") {
    text = text.replace(/^\uFEFF/, "");
    const directive = text.match(/^sep=(.)\r?\n/i);
    if (directive) { separator ||= directive[1]; text = text.slice(directive[0].length); }
    const invalid = () =>
      new Error(
        t("Ungültige CSV-Datei. Bitte Spaltenüberschriften und Zeilen prüfen."),
      );
    function parse(delimiter) {
      const rows = [];
      let row = [],
        value = "",
        quoted = false,
        closed = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (quoted) {
          if (char === '"') {
            if (text[i + 1] === '"') {
              value += '"';
              i++;
            } else {
              quoted = false;
              closed = true;
            }
          } else value += char;
          continue;
        }
        if (char === '"') {
          if (value || closed) throw invalid();
          quoted = true;
        } else if (char === delimiter) {
          row.push(value);
          value = "";
          closed = false;
        } else if (char === "\r" || char === "\n") {
          if (char === "\r" && text[i + 1] === "\n") i++;
          row.push(value);
          if (row.some((v) => v !== "")) rows.push(row);
          row = [];
          value = "";
          closed = false;
        } else {
          if (closed) throw invalid();
          value += char;
        }
      }
      if (quoted) throw invalid();
      row.push(value);
      if (row.some((v) => v !== "")) rows.push(row);
      return rows;
    }
    const candidates = [];
    for (const delimiter of separator ? [separator] : [",", ";", "\t", "|", ":", "^", "~"]) {
      try {
        const rows = parse(delimiter);
        if (rows.length > 1) candidates.push(rows);
      } catch {}
    }
    candidates.sort((a, b) => b[0].length - a[0].length);
    const rows = candidates[0];
    if (!rows || !rows.every((row) => row.length === rows[0].length))
      throw invalid();
    const headers = rows.shift().map((value) => value.trim());
    if (
      headers.some((value) => !value) ||
      new Set(headers).size !== headers.length
    )
      throw invalid();
    return rows.map((row) =>
      Object.fromEntries(headers.map((key, index) => [key, row[index]])),
    );
  }
  async function readTextFile(file, encoding = "auto") {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let detected = encoding;
    if (detected === "auto") {
      if (bytes[0] === 255 && bytes[1] === 254) detected = "utf-16le";
      else if (bytes[0] === 254 && bytes[1] === 255) detected = "utf-16be";
      else {
        try { new TextDecoder("utf-8", {fatal:true}).decode(bytes); detected = "utf-8"; }
        catch { detected = "windows-1252"; }
      }
    }
    return {text:new TextDecoder(detected, {fatal:true}).decode(bytes).replace(/^\uFEFF/, ""), encoding:detected};
  }
  function recordsFromJSON(data) {
    if (data && !Array.isArray(data) && typeof data === "object") {
      const lists = Object.values(data).filter(
        (value) =>
          Array.isArray(value) &&
          value.length &&
          value.every(
            (row) => row && typeof row === "object" && !Array.isArray(row),
          ),
      );
      data = lists.length === 1 ? lists[0] : [data];
    }
    if (
      !Array.isArray(data) ||
      !data.length ||
      !data.every(
        (row) =>
          row &&
          typeof row === "object" &&
          !Array.isArray(row) &&
          Object.keys(row).length,
      )
    )
      throw Error(
        t("Erwartet wird eine nicht leere Liste flacher JSON-Objekte."),
      );
    if (
      data.some((row) =>
        Object.values(row).some(
          (value) =>
            value !== null &&
            typeof value === "object" &&
            !(
              Array.isArray(value) &&
              value.every(
                (item) =>
                  item === null ||
                  ["string", "number", "boolean"].includes(typeof item),
              )
            ),
        ),
      )
    )
      throw Error(
        t(
          "Verschachtelte Objekte werden nicht unterstützt. Bitte flache JSON-Einträge verwenden.",
        ),
      );
    return data;
  }
  function resolveContent(expression, row, typedCards) {
    if (!expression.trim())
      throw Error(t("Bitte den QR-Code-Inhalt festlegen."));
    const readField = (key) => {
      if (!Object.hasOwn(row, key)) throw Error(t("Feld fehlt: ") + key);
      return valueText(row[key]);
    };
    const matches =
      Array.isArray(typedCards) &&
      typedCards.every(
        (card) =>
          card &&
          ["free", "url", "field"].includes(card.kind) &&
          typeof card.value === "string",
      ) &&
      typedCards
        .map((card) => (card.kind === "field" ? token(card.value) : card.value))
        .join("") === expression;
    const output = matches
      ? typedCards
          .map((card) =>
            card.kind === "field" ? readField(card.value) : card.value,
          )
          .join("")
      : expression.replace(
          /\{\{("(?:\\.|[^"\\])*"|[^{}]*?)\}\}/g,
          (_, name) => {
            const key = name.startsWith('"') ? JSON.parse(name) : name.trim();
            if (!Object.hasOwn(row, key)) throw Error(t("Feld fehlt: ") + key);
            return valueText(row[key]);
          },
        );
    if (!output.trim())
      throw Error(t("Der QR-Code-Inhalt darf nicht leer sein."));
    return output;
  }
  function defaultExpression(rows) {
    const keys = [...new Set(rows.flatMap(Object.keys))];
    const url = keys.find((key) => key.toLowerCase() === "url");
    if (url) return token(url);
    if (keys.includes("Base_URL") && keys.includes("Interne_ID"))
      return token("Base_URL") + token("Interne_ID");
    return "";
  }
  function createContentEditor({
    getRecords,
    getExpression,
    setExpression,
    getCards,
    changed,
    confirmDeletion,
  }) {
    const host = document.getElementById("qrContentEditor"),
      input = document.getElementById("qrContentExpression"),
      fields = document.getElementById("qrContentFields"),
      preview = document.getElementById("qrContentPreview"),
      error = document.getElementById("qrContentError");
    const storageKey = "qr-generator.content-snippets.v1";
    let snippets = [];
    try {
      const saved = localStorage.getItem(storageKey);
      const values = JSON.parse(
        saved === null
          ? localStorage.getItem("qr-generator.base-urls.v1") || "[]"
          : saved,
      );
      if (Array.isArray(values))
        snippets = [
          ...new Set(
            values.filter(
              (value) =>
                typeof value === "string" &&
                value.trim() &&
                value.length <= 2048,
            ),
          ),
        ];
    } catch {
      /* Optional storage. */
    }
    function persistSnippets(next) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        snippets = next;
        return true;
      } catch {
        window.QRGenerator.notifications.toast(
          t(
            "Textbausteine konnten nicht gespeichert werden. Der lokale Speicher ist voll oder nicht verfügbar.",
          ),
          "warning",
        );
        return false;
      }
    }
    let cards = [],
      editing = -1,
      dragIndex = null,
      cardExpression = null;
    const cardHost = document.getElementById("contentCards"),
      drop = document.getElementById("contentCardDrop"),
      dialog = document.getElementById("contentCardDialog"),
      type = document.getElementById("contentCardType"),
      value = document.getElementById("contentCardValue");
    function parseCards(expression) {
      const result = [];
      let last = 0;
      for (const match of expression.matchAll(
        /\{\{("(?:\\.|[^"\\])*"|[^{}]*?)\}\}/g,
      )) {
        if (match.index > last) {
          const text = expression.slice(last, match.index);
          result.push({
            kind: /^https?:/i.test(text) ? "url" : "free",
            value: text,
          });
        }
        result.push({
          kind: "field",
          value: match[1].startsWith('"')
            ? JSON.parse(match[1])
            : match[1].trim(),
        });
        last = match.index + match[0].length;
      }
      if (last < expression.length) {
        const text = expression.slice(last);
        result.push({
          kind: /^https?:/i.test(text) ? "url" : "free",
          value: text,
        });
      }
      return result;
    }
    function commitCards() {
      input.value = cards
        .map((card) => (card.kind === "field" ? token(card.value) : card.value))
        .join("");
      cardExpression = input.value;
      setExpression(input.value, structuredClone(cards));
      changed();
      renderCards();
    }
    function editCard(index) {
      editing = index;
      const card = cards[index] || { kind: "free", value: "" };
      type.replaceChildren();
      for (const [key, label] of [
        ["free", t("Freier Text")],
        ...[
          ...new Set(
            (getRecords() || []).flatMap((record) => Object.keys(record.Raw)),
          ),
        ].map((key) => ["field:" + key, key]),
      ]) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key.startsWith("field:") ? "{" + label + "}" : label;
        type.append(option);
      }
      type.value = card.kind === "field" ? "field:" + card.value : card.kind;
      value.value = card.kind === "field" ? "" : card.value;
      updateCardType();
      document.getElementById("removeContentCard").hidden = index < 0;
      dialog.showModal();
      type.focus();
    }
    function updateCardType() {
      value.hidden = type.value.startsWith("field:");
      document.getElementById("contentCardValueLabel").hidden = value.hidden;
      value.placeholder = type.value === "url" ? "https://…" : t("Freier Text");
    }
    type.addEventListener("change", updateCardType);
    document
      .getElementById("applyContentCard")
      .addEventListener("click", () => {
        const card = type.value.startsWith("field:")
          ? { kind: "field", value: type.value.slice(6) }
          : { kind: type.value, value: value.value };
        if (editing < 0) cards.push(card);
        else cards[editing] = card;
        dialog.close();
        commitCards();
      });
    document
      .getElementById("removeContentCard")
      .addEventListener("click", async () => {
        if (!(await confirmDeletion())) return;
        cards.splice(editing, 1);
        dialog.close();
        commitCards();
      });
    document
      .getElementById("closeContentCard")
      .addEventListener("click", () => dialog.close());
    document
      .getElementById("addContentCard")
      .addEventListener("click", (event) => {
        event.stopPropagation();
        showPicker(event.currentTarget, -1);
      });
    const keys = () => [
      ...new Set(
        (getRecords() || []).flatMap((record) => Object.keys(record.Raw)),
      ),
    ];
    let menu = null;
    function closePicker() {
      menu?.remove();
      menu = null;
    }
    function showPicker(anchor, index) {
      closePicker();
      menu = document.createElement("div");
      menu.className = "content-pill-menu";
      menu.setAttribute("role", "group");
      const options =
        index < 0
          ? [["free", t("Freier Text")], ...keys().map((key) => ["field", key])]
          : keys().map((key) => ["field", key]);
      for (const [kind, label] of options) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = kind === "field" ? "{" + label + "}" : label;
        button.className = kind === "field" ? "content-option-field" : "content-option-free";
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const card = { kind, value: kind === "field" ? label : "" };
          if (index < 0) cards.push(card);
          else cards[index] = card;
          closePicker();
          commitCards();
          if (kind === "free")
            cardHost.lastElementChild.querySelector(".content-card").click();
        });
        menu.append(button);
      }
      anchor.parentElement.append(menu);
      menu.querySelector("button")?.focus();
    }
    document.addEventListener("click", (event) => {
      if (
        menu &&
        !menu.contains(event.target) &&
        !event.target.closest(".content-pill, #addContentCard")
      )
        closePicker();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu) {
        event.stopPropagation();
        closePicker();
      }
    });
    function renderCards() {
      closePicker();
      cardHost.replaceChildren();
      cards.forEach((card, index) => {
        const pill = document.createElement("div");
        pill.className =
          "content-pill " + (card.kind === "field" ? "is-field" : "is-free");
        pill.draggable = true;
        pill.dataset.index = index;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "content-card";
        button.textContent = card.kind === "field" ? "{" + card.value + "}" : card.value || t("Freier Text");
        button.title = t("Textkarte bearbeiten");
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          if (card.kind === "field") {
            showPicker(button, index);
            return;
          }
          closePicker();
          const originalWidth = button.getBoundingClientRect().width;
          const editor = document.createElement("input");
          editor.type = "text";
          editor.className = "content-text-input";
          editor.value = card.value;
          editor.setAttribute("aria-label", t("Freier Text"));
          editor.style.width = originalWidth + "px";
          pill.draggable = false;
          button.replaceWith(editor);
          editor.focus();
          editor.select();
          let done = false,
            suspendBlur = false;
          const measure = document.createElement("canvas").getContext("2d");
          const resize = () => {
            const style = getComputedStyle(editor);
            measure.font =
              style.font ||
              (style.fontSize || "13px") +
                " " +
                (style.fontFamily || "sans-serif");
            editor.style.width =
              Math.max(
                36,
                Math.ceil(measure.measureText(editor.value || " ").width) + 26,
              ) + "px";
          };
          const finish = (save) => {
            if (done) return;
            done = true;
            if (save) {
              cards[index] = { kind: "free", value: editor.value };
              commitCards();
            } else renderCards();
          };
          function suggestions(filter = false) {
            closePicker();
            menu = document.createElement("div");
            menu.className = "content-pill-menu saved-text-suggestions";
            menu.addEventListener("pointerdown", (event) =>
              event.preventDefault(),
            );
            for (const text of snippets.filter(
              (text) =>
                !filter ||
                text
                  .toLocaleLowerCase()
                  .includes(editor.value.toLocaleLowerCase()),
            )) {
              const row = document.createElement("div");
              row.className = "saved-text-option";
              const choose = document.createElement("button");
              choose.type = "button";
              choose.textContent = text;
              choose.addEventListener("click", () => {
                editor.value = text;
                resize();
                finish(true);
              });
              const remove = document.createElement("button");
              remove.type = "button";
              remove.className = "template-delete";
              remove.textContent = "×";
              remove.setAttribute(
                "aria-label",
                t("Textbaustein löschen: ") + text,
              );
              remove.addEventListener("click", async () => {
                suspendBlur = true;
                const confirmed = await confirmDeletion();
                if (confirmed)
                  persistSnippets(snippets.filter((item) => item !== text));
                suspendBlur = false;
                if (editor.isConnected) {
                  editor.focus();
                  suggestions();
                }
              });
              row.append(choose, remove);
              menu.append(row);
            }
            if (editor.value.trim() && !snippets.includes(editor.value)) {
              const save = document.createElement("button");
              save.type = "button";
              save.textContent = t("Text speichern");
              save.addEventListener("click", () => {
                if (persistSnippets([editor.value, ...snippets])) suggestions();
              });
              menu.append(save);
            }
            if (!menu.children.length) {
              const empty = document.createElement("span");
              empty.className = "template-empty";
              empty.textContent = t("Keine gespeicherten Texte.");
              menu.append(empty);
            }
            pill.append(menu);
            const bounds = menu.getBoundingClientRect();
            if (bounds.right > window.innerWidth - 16)
              menu.style.left =
                Math.min(0, window.innerWidth - 16 - bounds.right) + "px";
          }
          editor.addEventListener("input", () => {
            resize();
            suggestions(true);
          });
          editor.addEventListener("blur", () => {
            if (!suspendBlur) finish(true);
          });
          editor.addEventListener("keydown", (event) => {
            if (["Enter", "Escape"].includes(event.key)) {
              event.preventDefault();
              event.stopPropagation();
              finish(event.key === "Enter");
            }
          });
          suggestions();
        });
        button.addEventListener("keydown", (event) => {
          if (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            const target = index + (event.key === "ArrowLeft" ? -1 : 1);
            if (target >= 0 && target < cards.length) {
              cards.splice(target, 0, cards.splice(index, 1)[0]);
              commitCards();
              cardHost.children[target]?.querySelector(".content-card").focus();
            }
          }
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "saved-logo-delete";
        remove.setAttribute(
          "aria-label",
          t("Entfernen") + ": " + (card.value || t("Freier Text")),
        );
        remove.addEventListener("click", async () => {
          if (await confirmDeletion()) {
            cards.splice(index, 1);
            commitCards();
          }
        });
        pill.addEventListener("dragstart", (event) => {
          dragIndex = index;
          event.dataTransfer.setData("application/x-qr-card", String(index));
          event.dataTransfer.effectAllowed = "move";
          pill.classList.add("dragging");
        });
        pill.addEventListener("dragover", (event) => {
          if (dragIndex === null) return;
          event.preventDefault();
          const active = cardHost.querySelector(".dragging");
          if (!active || active === pill) return;
          const nodes = [...cardHost.children],
            before = new Map(
              nodes.map((node) => [node, node.getBoundingClientRect()]),
            );
          cardHost.insertBefore(
            active,
            nodes.indexOf(active) < nodes.indexOf(pill)
              ? pill.nextSibling
              : pill,
          );
          for (const node of nodes) {
            const old = before.get(node),
              next = node.getBoundingClientRect();
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
              node.animate(
                [
                  {
                    transform:
                      "translate(" +
                      (old.left - next.left) +
                      "px," +
                      (old.top - next.top) +
                      "px)",
                  },
                  { transform: "translate(0,0)" },
                ],
                { duration: 150 },
              );
          }
        });
        pill.addEventListener("dragend", () => {
          dragIndex = null;
          renderCards();
        });
        pill.append(button, remove);
        cardHost.append(pill);
      });
    }
    drop.addEventListener("dragover", (event) => {
      event.preventDefault();
      drop.classList.add("dragover");
    });
    drop.addEventListener("dragleave", () => drop.classList.remove("dragover"));
    drop.addEventListener("drop", (event) => {
      event.preventDefault();
      drop.classList.remove("dragover");
      const field = event.dataTransfer.getData("application/x-qr-field");
      if (field) {
        cards.push({ kind: "field", value: field });
      } else if (dragIndex !== null) {
        cards = [...cardHost.children].map(
          (node) => cards[Number(node.dataset.index)],
        );
      } else return;
      dragIndex = null;
      commitCards();
    });
    function validate() {
      const records = getRecords();
      let failure = "";
      if (!records?.length) {
        error.textContent = "";
        preview.textContent = "";
        return false;
      }
      const results = [];
      for (let index = 0; index < records.length; index++) {
        try {
          results.push(
            resolveContent(getExpression(), records[index].Raw, getCards?.()),
          );
        } catch (e) {
          failure = t("Eintrag ") + (index + 1) + ": " + e.message;
          break;
        }
      }
      error.textContent = failure;
      input.setAttribute("aria-invalid", String(Boolean(failure)));
      preview.textContent = failure ? "" : results[0];
      records.forEach((record, index) => {
        record.URL = failure ? "" : results[index];
      });
      return !failure;
    }
    function render(mode) {
      host.hidden = mode !== "bulk";
      if (host.hidden) return;
      input.value = getExpression();
      if (
        cardExpression !== input.value ||
        (getCards?.() && JSON.stringify(cards) !== JSON.stringify(getCards()))
      ) {
        cards = getCards?.()
          ? structuredClone(getCards())
          : parseCards(input.value);
        cardExpression = input.value;
      }
      renderCards();
      fields.replaceChildren();
      for (const key of [
        ...new Set(
          (getRecords() || []).flatMap((record) => Object.keys(record.Raw)),
        ),
      ]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "variable-chip";
        button.textContent = "+ {" + key + "}";
        button.draggable = true;
        button.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("application/x-qr-field", key);
          event.dataTransfer.effectAllowed = "copy";
        });
        button.addEventListener("click", () => {
          cards.push({ kind: "field", value: key });
          commitCards();
        });
        fields.append(button);
      }
      validate();
    }
    input.addEventListener("input", () => {
      cards = parseCards(input.value);
      commitCards();
    });
    return { render, validate };
  }
  window.QRGenerator["qr-content"] = {
    recordsFromCSV,
    readTextFile,
    recordsFromJSON,
    resolveContent,
    defaultExpression,
    createContentEditor,
  };
})();
