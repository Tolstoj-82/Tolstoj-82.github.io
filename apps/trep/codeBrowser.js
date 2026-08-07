const codeBrowserState = { bytes: null, symbols: [], routines: [] };

const gbRegisters = ["b", "c", "d", "e", "h", "l", "[hl]", "a"];
const gbRegisterPairs = ["bc", "de", "hl", "sp"];
const gbConditions = ["nz", "z", "nc", "c"];
const gbAlu = ["add a,", "adc a,", "sub", "sbc a,", "and", "xor", "or", "cp"];
const gbRotates = ["rlc", "rrc", "rl", "rr", "sla", "sra", "swap", "srl"];

function hexValue(value, width = 2) {
  return `$${value.toString(16).toUpperCase().padStart(width, "0")}`;
}

function readWord(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function relativeTarget(offset, displacement) {
  return offset + 2 + (displacement < 0x80 ? displacement : displacement - 0x100);
}

function decodeCbOpcode(opcode) {
  const x = opcode >> 6;
  const y = opcode >> 3 & 7;
  const register = gbRegisters[opcode & 7];
  if (x === 0) return `${gbRotates[y]} ${register}`;
  if (x === 1) return `bit ${y}, ${register}`;
  if (x === 2) return `res ${y}, ${register}`;
  return `set ${y}, ${register}`;
}

function decodeGbInstruction(bytes, offset) {
  const opcode = bytes[offset];
  if (opcode === undefined) return null;
  if (opcode === 0xCB && bytes[offset + 1] !== undefined) {
    return { size: 2, text: decodeCbOpcode(bytes[offset + 1]) };
  }
  if (opcode >= 0x40 && opcode <= 0x7F) {
    if (opcode === 0x76) return { size: 1, text: "halt" };
    return { size: 1, text: `ld ${gbRegisters[opcode >> 3 & 7]}, ${gbRegisters[opcode & 7]}` };
  }
  if (opcode >= 0x80 && opcode <= 0xBF) {
    return { size: 1, text: `${gbAlu[opcode >> 3 & 7]} ${gbRegisters[opcode & 7]}` };
  }
  if ((opcode & 0xC7) === 0x04) return { size: 1, text: `inc ${gbRegisters[opcode >> 3 & 7]}` };
  if ((opcode & 0xC7) === 0x05) return { size: 1, text: `dec ${gbRegisters[opcode >> 3 & 7]}` };
  if ((opcode & 0xC7) === 0x06) return { size: 2, text: `ld ${gbRegisters[opcode >> 3 & 7]}, ${hexValue(bytes[offset + 1])}` };
  if ((opcode & 0xCF) === 0x01) return { size: 3, text: `ld ${gbRegisterPairs[opcode >> 4 & 3]}, ${hexValue(readWord(bytes, offset + 1), 4)}` };
  if ((opcode & 0xCF) === 0x03) return { size: 1, text: `inc ${gbRegisterPairs[opcode >> 4 & 3]}` };
  if ((opcode & 0xCF) === 0x0B) return { size: 1, text: `dec ${gbRegisterPairs[opcode >> 4 & 3]}` };
  if ((opcode & 0xCF) === 0x09) return { size: 1, text: `add hl, ${gbRegisterPairs[opcode >> 4 & 3]}` };
  if ([0x20, 0x28, 0x30, 0x38].includes(opcode)) {
    const target = relativeTarget(offset, bytes[offset + 1]);
    return { size: 2, text: `jr ${gbConditions[opcode >> 3 & 3]}, ${hexValue(target, 4)}`, target, targetIsOffset: true };
  }
  const fixed = {
    0x00:[1,"nop"],0x02:[1,"ld [bc], a"],0x07:[1,"rlca"],0x08:[3,"ld [@word], sp"],0x0A:[1,"ld a, [bc]"],0x0F:[1,"rrca"],
    0x10:[2,"stop"],0x12:[1,"ld [de], a"],0x17:[1,"rla"],0x18:[2,"jr @relative"],0x1A:[1,"ld a, [de]"],0x1F:[1,"rra"],
    0x22:[1,"ld [hl+], a"],0x27:[1,"daa"],0x2A:[1,"ld a, [hl+]"],0x2F:[1,"cpl"],0x32:[1,"ld [hl-], a"],0x37:[1,"scf"],0x3A:[1,"ld a, [hl-]"],0x3F:[1,"ccf"],
    0xC0:[1,"ret nz"],0xC1:[1,"pop bc"],0xC2:[3,"jp nz, @word"],0xC3:[3,"jp @word"],0xC4:[3,"call nz, @word"],0xC5:[1,"push bc"],0xC6:[2,"add a, @byte"],0xC7:[1,"rst $00"],0xC8:[1,"ret z"],0xC9:[1,"ret"],0xCA:[3,"jp z, @word"],0xCC:[3,"call z, @word"],0xCD:[3,"call @word"],0xCE:[2,"adc a, @byte"],0xCF:[1,"rst $08"],
    0xD0:[1,"ret nc"],0xD1:[1,"pop de"],0xD2:[3,"jp nc, @word"],0xD4:[3,"call nc, @word"],0xD5:[1,"push de"],0xD6:[2,"sub @byte"],0xD7:[1,"rst $10"],0xD8:[1,"ret c"],0xD9:[1,"reti"],0xDA:[3,"jp c, @word"],0xDC:[3,"call c, @word"],0xDE:[2,"sbc a, @byte"],0xDF:[1,"rst $18"],
    0xE0:[2,"ldh [$ff00+@byte], a"],0xE1:[1,"pop hl"],0xE2:[1,"ldh [$ff00+c], a"],0xE5:[1,"push hl"],0xE6:[2,"and @byte"],0xE7:[1,"rst $20"],0xE8:[2,"add sp, @signed"],0xE9:[1,"jp hl"],0xEA:[3,"ld [@word], a"],0xEE:[2,"xor @byte"],0xEF:[1,"rst $28"],
    0xF0:[2,"ldh a, [$ff00+@byte]"],0xF1:[1,"pop af"],0xF2:[1,"ldh a, [$ff00+c]"],0xF3:[1,"di"],0xF5:[1,"push af"],0xF6:[2,"or @byte"],0xF7:[1,"rst $30"],0xF8:[2,"ld hl, sp+@signed"],0xF9:[1,"ld sp, hl"],0xFA:[3,"ld a, [@word]"],0xFB:[1,"ei"],0xFE:[2,"cp @byte"],0xFF:[1,"rst $38"]
  }[opcode];
  if (!fixed) return { size: 1, text: `db ${hexValue(opcode)}`, invalid: true };
  let [size, text] = fixed;
  let target = null;
  if (text.includes("@word")) {
    target = readWord(bytes, offset + 1);
    text = text.replace("@word", hexValue(target, 4));
  }
  if (text.includes("@relative")) {
    target = relativeTarget(offset, bytes[offset + 1]);
    text = text.replace("@relative", hexValue(target, 4));
    return { size, text, target, targetIsOffset: true };
  }
  text = text.replace("@byte", hexValue(bytes[offset + 1]));
  if (text.includes("@signed")) {
    const value = bytes[offset + 1] < 0x80 ? bytes[offset + 1] : bytes[offset + 1] - 0x100;
    text = text.replace("@signed", `${value < 0 ? "-" : "+"}${hexValue(Math.abs(value))}`);
  }
  return { size, text, target };
}

function isLikelyCodeSymbol(name) {
  if (name.includes(".")) return false;
  return !/(?:gfx|layout|music|song|sound|audio|sprite|tiledata|data$|table|text|coords?|palette|header|wram|hram|oam|charmap)/i.test(name);
}

function buildCodeRoutines(bytes, symbols) {
  const globals = symbols
    .map(([name, offset]) => ({ name, offset }))
    .filter(item => item.offset < bytes.length && isLikelyCodeSymbol(item.name))
    .sort((a, b) => a.offset - b.offset || a.name.localeCompare(b.name));
  return globals.filter((item, index) => {
    if (index && globals[index - 1].offset === item.offset) return false;
    const decoded = decodeGbInstruction(bytes, item.offset);
    return decoded && !decoded.invalid && bytes[item.offset] !== 0xFF;
  }).map((item, index, accepted) => ({
    ...item,
    end: Math.min(bytes.length, accepted[index + 1]?.offset || item.offset + 256, item.offset + 1024)
  }));
}

function escapeAssembly(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightAssemblyInstruction(text) {
  const escaped = escapeAssembly(text);
  const split = escaped.match(/^(\S+)(.*)$/);
  if (!split) return escaped;
  let operands = split[2]
    .replace(/(\$[0-9A-F]+)/g, '<span class="asm-number">$1</span>')
    .replace(/\b(af|bc|de|hl|sp|a|b|c|d|e|h|l|nz|nc|z)\b/gi, '<span class="asm-register">$1</span>');
  return `<span class="asm-mnemonic">${split[1]}</span>${operands}`;
}

function displayScopedLabel(label, routineScopes) {
  for (const scope of routineScopes) {
    const prefix = `${scope}.`;
    if (label.startsWith(prefix)) return `.${label.slice(prefix.length)}`;
  }
  return label;
}

function renderRoutine(routine) {
  const { bytes, symbols } = codeBrowserState;
  const labels = new Map(symbols.map(([name, offset]) => [offset, name]));
  const routineScopes = new Set([
    routine.name,
    ...symbols.filter(([name, offset]) => offset === routine.offset && !name.includes(".")).map(([name]) => name)
  ]);
  const lines = [];
  let offset = routine.offset;
  while (offset < routine.end) {
    if (labels.has(offset)) {
      lines.push(`<span class="asm-label">${escapeAssembly(displayScopedLabel(labels.get(offset), routineScopes))}:</span>`);
    }
    const decoded = decodeGbInstruction(bytes, offset);
    if (!decoded || offset + decoded.size > routine.end) break;
    let text = decoded.text;
    if (decoded.target !== null && decoded.target !== undefined) {
      const bank = Math.floor(offset / 0x4000);
      const targetOffset = decoded.targetIsOffset
        ? decoded.target
        : decoded.target < 0x4000 ? decoded.target : bank * 0x4000 + decoded.target - 0x4000;
      const label = labels.get(targetOffset);
      if (label) text = text.replace(/\$[0-9A-F]{4}/, displayScopedLabel(label, routineScopes));
    }
    lines.push(`<span class="asm-line" data-address="${offset}" data-size="${decoded.size}"><span class="asm-address">${offset.toString(16).toUpperCase().padStart(5, "0")}</span>      ${highlightAssemblyInstruction(text)}</span>`);
    offset += decoded.size;
    if (["ret", "reti"].includes(decoded.text) && offset > routine.offset + 1 && !labels.has(offset)) break;
  }
  return lines.join("");
}

function populateCodeSymbolList() {
  const list = document.getElementById("codeSymbolList");
  const filter = document.getElementById("codeSymbolFilter").value.trim().toLowerCase();
  list.replaceChildren();
  codeBrowserState.routines.filter(routine => routine.name.toLowerCase().includes(filter)).forEach(routine => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-symbol-entry secondary";
    const name = document.createElement("span");
    name.textContent = routine.name;
    const address = document.createElement("small");
    address.textContent = hexValue(routine.offset, Math.max(4, routine.offset.toString(16).length));
    button.append(name, address);
    button.addEventListener("click", () => openAssemblyRoutine(routine));
    list.appendChild(button);
  });
}

function openAssemblyRoutine(routine) {
  document.getElementById("assemblyCodeTitle").textContent = routine.name;
  document.getElementById("assemblyCodeAddress").textContent = hexValue(routine.offset, Math.max(4, routine.offset.toString(16).length));
  document.getElementById("assemblyCodeOutput").innerHTML = renderRoutine(routine);
  const dialog = document.getElementById("assemblyCodeDialog");
  if (!dialog.open) dialog.show();
}

function navigateToCodeBytes(address, size) {
  window.scrollToAddress?.(address.toString(16).toUpperCase(), size);
}

function initializeAssemblyResize() {
  const dialog = document.getElementById("assemblyCodeDialog");
  const handle = document.getElementById("assemblyResizeHandle");
  let resizeState = null;
  handle.addEventListener("pointerdown", event => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    resizeState = { x: event.clientX, width: dialog.getBoundingClientRect().width };
    dialog.classList.add("resizing");
  });
  handle.addEventListener("pointermove", event => {
    if (!resizeState) return;
    const width = Math.max(360, Math.min(window.innerWidth - 24, resizeState.width + resizeState.x - event.clientX));
    dialog.style.setProperty("--assembly-panel-width", `${width}px`);
  });
  const finishResize = () => {
    resizeState = null;
    dialog.classList.remove("resizing");
  };
  handle.addEventListener("pointerup", finishResize);
  handle.addEventListener("pointercancel", finishResize);
}

document.addEventListener("trepromloaded", event => {
  codeBrowserState.bytes = event.detail.bytes;
  codeBrowserState.symbols = event.detail.symbols;
  codeBrowserState.routines = buildCodeRoutines(event.detail.bytes, event.detail.symbols);
  const available = codeBrowserState.routines.length > 0;
  document.getElementById("codeTabButton").hidden = !available;
  if (available) populateCodeSymbolList();
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("codeSymbolFilter").addEventListener("input", populateCodeSymbolList);
  document.getElementById("closeAssemblyCode").addEventListener("click", () => document.getElementById("assemblyCodeDialog").close());
  document.getElementById("assemblyCodeOutput").addEventListener("click", event => {
    const line = event.target.closest(".asm-line");
    if (line) navigateToCodeBytes(Number(line.dataset.address), Number(line.dataset.size));
  });
  initializeAssemblyResize();
});
