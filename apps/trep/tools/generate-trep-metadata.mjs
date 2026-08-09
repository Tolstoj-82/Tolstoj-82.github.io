import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const [, , sourcePath, symPath, mapPath, outputPath] = process.argv;
if (!sourcePath || !symPath || !mapPath || !outputPath) {
  console.error("Usage: node generate-trep-metadata.mjs <source.json> <file.sym> <file.map> <output.trep.json>");
  process.exit(1);
}

function rgbdsRomOffset(bank, address) {
  if (bank === 0) return address < 0x4000 ? address : null;
  if (address < 0x4000 || address > 0x7fff) return null;
  return bank * 0x4000 + address - 0x4000;
}

function parseSymbols(symText, mapText) {
  const symbols = new Map();
  for (const line of symText.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9A-Fa-f]+):([0-9A-Fa-f]{4})\s+([^;\s]+)/);
    if (!match) continue;
    const offset = rgbdsRomOffset(parseInt(match[1], 16), parseInt(match[2], 16));
    if (offset !== null && !symbols.has(match[3])) symbols.set(match[3], offset);
  }
  let bank = null;
  for (const line of mapText.split(/\r?\n/)) {
    const bankMatch = line.match(/^ROM(?:0|X) bank #(\d+):/i);
    if (bankMatch) bank = Number(bankMatch[1]);
    const labelMatch = line.match(/^\s*\$([0-9A-Fa-f]{4})\s*=\s*([^\s]+)/);
    if (!labelMatch || bank === null || symbols.has(labelMatch[2])) continue;
    const offset = rgbdsRomOffset(bank, parseInt(labelMatch[1], 16));
    if (offset !== null) symbols.set(labelMatch[2], offset);
  }
  return symbols;
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));
if (source?.format !== "trep-source" || source?.version !== 1 || !Array.isArray(source.backgroundMaps)) {
  throw new Error("Source definition must use trep-source version 1 and contain backgroundMaps.");
}

const symbols = parseSymbols(
  await readFile(symPath, "utf8"),
  await readFile(mapPath, "utf8"),
);

const backgroundMaps = source.backgroundMaps.map((definition) => {
  const start = symbols.get(definition.symbol);
  if (start === undefined) throw new Error(`Missing symbol: ${definition.symbol}`);
  const result = {
    ...definition,
    start: `0x${start.toString(16).toUpperCase().padStart(4, "0")}`,
  };
  if (definition.endSymbol) {
    const end = symbols.get(definition.endSymbol);
    if (end === undefined) throw new Error(`Missing end symbol: ${definition.endSymbol}`);
    result.end = `0x${end.toString(16).toUpperCase().padStart(4, "0")}`;
  }
  return result;
});

const metadata = {
  format: "trep-metadata",
  version: 1,
  project: source.project || basename(sourcePath, ".trep-source.json"),
  generatedFrom: {
    symbols: basename(symPath),
    map: basename(mapPath),
  },
  backgroundMaps,
};

await writeFile(outputPath, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`Wrote ${backgroundMaps.length} background maps to ${outputPath}`);
