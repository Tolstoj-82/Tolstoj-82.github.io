(() => {
"use strict";
const {t, LocalizedError} = window.QRGenerator["i18n"];
const EXPORT_SIZE = 1000;
function xml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
}
// Record the same paths used by Canvas, so SVG exports retain every chosen shape.
function vectorContext(native) {
  const elements = [];
  let path = "",
    transform = "";
  const transforms = [];
  const wrap = (content) =>
    transform
      ? '<g transform="' + transform + '">' + content + "</g>"
      : content;
  const proxy = new Proxy(native, {
    get(target, key) {
      if (key === "svgContent") return elements.join("");
      const original = target[key];
      if (typeof original !== "function") return original;
      return (...args) => {
        const [x, y, w, h] = args;
        if (key === "beginPath") path = "";
        if (key === "moveTo") path += "M" + x + " " + y + " ";
        if (key === "lineTo") path += "L" + x + " " + y + " ";
        if (key === "quadraticCurveTo") path += "Q" + args.join(" ") + " ";
        if (key === "closePath") path += "Z ";
        if (key === "arc") {
          const r = w,
            start = h,
            end = args[4];
          const sx = x + r * Math.cos(start),
            sy = y + r * Math.sin(start);
          path += "M" + sx + " " + sy + " ";
          if (Math.abs(end - start) >= Math.PI * 2 - 0.001) {
            path +=
              "A" +
              r +
              " " +
              r +
              " 0 1 1 " +
              (x - r) +
              " " +
              y +
              " A" +
              r +
              " " +
              r +
              " 0 1 1 " +
              sx +
              " " +
              sy +
              " ";
          } else
            path +=
              "A" +
              r +
              " " +
              r +
              " 0 " +
              (end - start > Math.PI ? 1 : 0) +
              " 1 " +
              (x + r * Math.cos(end)) +
              " " +
              (y + r * Math.sin(end)) +
              " ";
        }
        if (key === "fill")
          elements.push(
            wrap(
              '<path d="' + path + '" fill="' + xml(target.fillStyle) + '"/>',
            ),
          );
        if (key === "fillRect")
          elements.push(
            wrap(
              '<rect x="' +
                x +
                '" y="' +
                y +
                '" width="' +
                w +
                '" height="' +
                h +
                '" fill="' +
                xml(target.fillStyle) +
                '"/>',
            ),
          );
        if (key === "save") transforms.push(transform);
        if (key === "restore") transform = transforms.pop() || "";
        if (key === "translate")
          transform += " translate(" + x + " " + y + ")";
        if (key === "rotate")
          transform += " rotate(" + (x * 180) / Math.PI + ")";
        if (key === "fillText") {
          const fontSize = /([\d.]+)px/.exec(target.font)?.[1] || "16";
          const fit =
            args[3] && target.measureText(x).width > args[3]
              ? ' textLength="' +
                args[3] +
                '" lengthAdjust="spacingAndGlyphs"'
              : "";
          elements.push(
            wrap(
              '<text x="' +
                y +
                '" y="' +
                w +
                '" fill="' +
                xml(target.fillStyle) +
                '" font-family="Arial, sans-serif" font-size="' +
                fontSize +
                '" font-weight="' +
                (target.font.includes("bold") ? "700" : "400") +
                '" text-anchor="middle" dominant-baseline="central"' +
                fit +
                ">" +
                xml(x) +
                "</text>",
            ),
          );
        }
        if (key === "drawImage") {
          const image = x,
            dx = y,
            dy = w,
            width = args.length === 5 ? args[3] : image.width,
            height = args.length === 5 ? args[4] : image.height;
          if (image.svgContent)
            elements.push(
              wrap(
                '<svg x="' +
                  dx +
                  '" y="' +
                  dy +
                  '" width="' +
                  width +
                  '" height="' +
                  height +
                  '" viewBox="0 0 ' +
                  image.width +
                  " " +
                  image.height +
                  '">' +
                  image.svgContent +
                  "</svg>",
              ),
            );
          else {
            const data = image.toDataURL
              ? image.toDataURL("image/png")
              : image.src;
            elements.push(
              wrap(
                '<image x="' +
                  dx +
                  '" y="' +
                  dy +
                  '" width="' +
                  width +
                  '" height="' +
                  height +
                  '" href="' +
                  xml(data) +
                  '"/>',
              ),
            );
          }
        }
        return original.apply(target, args);
      };
    },
    set(target, key, value) {
      target[key] = value;
      return true;
    },
  });
  return proxy;
}
function toSVG(source) {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    source.width +
    '" height="' +
    source.height +
    '" viewBox="0 0 ' +
    source.width +
    " " +
    source.height +
    '">' +
    source.svgContent +
    "</svg>"
  );
}

function renderQRCode(canvas, inputText, settings) {
  const verifiedLogo = drawQRCode(canvas, inputText, {
    ...settings,
    size: EXPORT_SIZE,
  });
  if (settings.logo && !verifiedLogo) {
    // The logo renderer restores the original, styled QR code on failure.
    return t(
      "Das Logo wurde für diesen Code weggelassen. Die gewählten Formen und Farben bleiben erhalten. Bitte den Code vor Verwendung scannen.",
    );
  }
  return "";
}

function drawQRCode(canvas, inputText, settings) {
  const nativeContext = canvas.getContext("2d");
  const ctx = settings.vector ? vectorContext(nativeContext) : nativeContext;
  canvas.svgContent = "";
  canvas.logoPlacement = null;
  const qr = qrcode(0, "H");
  qr.addData(inputText);
  qr.make();

  const modules = qr.getModuleCount();
  const shape = settings.shape;
  const finderShape = settings.finderShape;
  const color = settings.color;
  const finderColor = settings.finderColor;
  const size = settings.size;

  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const moduleSize =
    Math.floor((size * 0.8) / modules) || size / (modules + 8);
  const actualQRSize = moduleSize * modules;
  const padding = Math.floor((canvas.width - actualQRSize) / 2);

  function drawFinderPattern(style, column, row) {
    const x = padding + column * moduleSize;
    const y = padding + row * moduleSize;
    const centerX = padding + (column + 3.5) * moduleSize;
    const centerY = padding + (row + 3.5) * moduleSize;

    ctx.fillStyle = finderColor;
    if (style === "rounded-square") {
      roundedRectPath(
        ctx,
        x,
        y,
        moduleSize * 7,
        moduleSize * 7,
        moduleSize * 1.25,
      );
      ctx.fill();
      ctx.fillStyle = "white";
      roundedRectPath(
        ctx,
        x + moduleSize,
        y + moduleSize,
        moduleSize * 5,
        moduleSize * 5,
        moduleSize * 0.8,
      );
      ctx.fill();
      ctx.fillStyle = finderColor;
      roundedRectPath(
        ctx,
        x + moduleSize * 2,
        y + moduleSize * 2,
        moduleSize * 3,
        moduleSize * 3,
        moduleSize * 0.5,
      );
      ctx.fill();
    } else if (style === "diamond") {
      diamondPath(ctx, centerX, centerY, moduleSize * 3.5);
      ctx.fill();
      ctx.fillStyle = "white";
      diamondPath(ctx, centerX, centerY, moduleSize * 2.5);
      ctx.fill();
      ctx.fillStyle = finderColor;
      diamondPath(ctx, centerX, centerY, moduleSize * 1.5);
      ctx.fill();
    } else if (style === "square-circle") {
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
      ctx.fillStyle = "white";
      ctx.fillRect(
        x + moduleSize,
        y + moduleSize,
        moduleSize * 5,
        moduleSize * 5,
      );
      ctx.fillStyle = finderColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, moduleSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "circle-square") {
      ctx.beginPath();
      ctx.arc(centerX, centerY, moduleSize * 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.fillRect(
        x + moduleSize,
        y + moduleSize,
        moduleSize * 5,
        moduleSize * 5,
      );
      ctx.fillStyle = finderColor;
      ctx.fillRect(
        x + moduleSize * 2,
        y + moduleSize * 2,
        moduleSize * 3,
        moduleSize * 3,
      );
    } else {
      ctx.beginPath();
      ctx.arc(centerX, centerY, moduleSize * 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(centerX, centerY, moduleSize * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = finderColor;

      if (style === "ring") {
        ctx.fillRect(
          centerX - moduleSize * 1.5,
          centerY - moduleSize * 1.5,
          moduleSize * 3,
          moduleSize * 3,
        );
      } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, moduleSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const customFinderStyles = new Set([
    "circular",
    "rounded-square",
    "diamond",
    "ring",
    "square-circle",
    "circle-square",
  ]);

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qr.isDark(row, col)) continue;

      const x = padding + col * moduleSize;
      const y = padding + row * moduleSize;
      const isFinderPattern =
        (row < 7 && col < 7) ||
        (row < 7 && col > modules - 8) ||
        (row > modules - 8 && col < 7);

      if (isFinderPattern && customFinderStyles.has(finderShape)) continue;

      const drawShape = isFinderPattern ? finderShape : shape;
      ctx.fillStyle = isFinderPattern ? finderColor : color;

      drawModule(ctx, drawShape, x, y, moduleSize);
    }
  }

  if (customFinderStyles.has(finderShape)) {
    drawFinderPattern(finderShape, 0, 0);
    drawFinderPattern(finderShape, modules - 7, 0);
    drawFinderPattern(finderShape, 0, modules - 7);
  }

  const verifiedLogo = settings.logo
    ? drawVerifiedLogo(
        canvas,
        nativeContext,
        settings.logo,
        inputText,
        modules,
        moduleSize,
        padding,
      )
    : false;
  if (settings.vector) {
    if (canvas.logoPlacement) {
      const { x, edge } = canvas.logoPlacement;
      ctx.fillStyle = "white";
      ctx.fillRect(x, x, edge, edge);
      ctx.drawImage(
        settings.logo,
        x + moduleSize,
        x + moduleSize,
        edge - 2 * moduleSize,
        edge - 2 * moduleSize,
      );
    }
    canvas.svgContent = ctx.svgContent;
  }
  return verifiedLogo;
}

// Reuse verification buffers and a successful footprint as a starting point.
// Payloads differ, so every logo-bearing code still needs its own check.
const logoFootprints = new WeakMap();
let verificationCanvas;
let logoBackupCanvas;
function drawVerifiedLogo(
  canvas,
  context,
  logo,
  inputText,
  modules,
  moduleSize,
  padding,
) {
  if (typeof jsQR !== "function")
    throw new LocalizedError(() =>
      t(
        "Die QR-Leseprüfung ist nicht verfügbar. Bitte die Seite neu laden oder das Logo entfernen.",
      ),
    );
  if (!Number.isInteger(moduleSize)) return false;
  if (!verificationCanvas)
    verificationCanvas = document.createElement("canvas");
  if (!logoBackupCanvas) logoBackupCanvas = document.createElement("canvas");
  let maxModules = Math.floor(modules * 0.27);
  if (maxModules % 2 === 0) maxModules--;
  const odd = (value) => {
    const n = Math.max(5, Math.floor(value));
    return n % 2 ? n : n - 1;
  };
  const footprintCache = logoFootprints.get(logo) || new Map();
  logoFootprints.set(logo, footprintCache);
  const cached = footprintCache.get(modules);
  const candidates = [
    ...new Set([cached || maxModules, odd(modules * 0.18), 5]),
  ]
    .filter((value) => value >= 5 && value <= maxModules)
    .sort((a, b) => b - a);
  const backupEdge = maxModules * moduleSize;
  const backupStart = padding + ((modules - maxModules) / 2) * moduleSize;
  logoBackupCanvas.width = logoBackupCanvas.height = backupEdge;
  logoBackupCanvas
    .getContext("2d")
    .drawImage(
      canvas,
      backupStart,
      backupStart,
      backupEdge,
      backupEdge,
      0,
      0,
      backupEdge,
      backupEdge,
    );
  const restore = () =>
    context.drawImage(logoBackupCanvas, backupStart, backupStart);
  // Four pixels per module keeps decoding work proportional to QR complexity,
  // rather than scanning the full 1000 px export for every attempt.
  const testModule = Math.min(moduleSize, 4);
  verificationCanvas.width = verificationCanvas.height =
    (modules + 8) * testModule;
  const testContext = verificationCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  for (const covered of candidates) {
    restore();
    const x = padding + ((modules - covered) / 2) * moduleSize;
    const edge = covered * moduleSize;
    context.fillStyle = "white";
    context.fillRect(x, x, edge, edge);
    context.drawImage(
      logo,
      x + moduleSize,
      x + moduleSize,
      edge - 2 * moduleSize,
      edge - 2 * moduleSize,
    );
    testContext.fillStyle = "white";
    testContext.fillRect(
      0,
      0,
      verificationCanvas.width,
      verificationCanvas.height,
    );
    testContext.imageSmoothingEnabled = true;
    testContext.drawImage(
      canvas,
      padding,
      padding,
      modules * moduleSize,
      modules * moduleSize,
      4 * testModule,
      4 * testModule,
      modules * testModule,
      modules * testModule,
    );
    const pixels = testContext.getImageData(
      0,
      0,
      verificationCanvas.width,
      verificationCanvas.height,
    );
    const decoded = jsQR(pixels.data, pixels.width, pixels.height, {
      inversionAttempts: "dontInvert",
    });
    if (decoded && decoded.data === inputText) {
      canvas.logoPlacement = { x, edge };
      footprintCache.set(modules, covered);
      return true;
    }
  }
  restore();
  return false;
}

// Wrap at word boundaries, splitting long words when necessary.
function wrapText(context, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      const candidate = line ? line + " " + word : word;
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      for (const character of word) {
        if (line && context.measureText(line + character).width > maxWidth) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    lines.push(line);
  }
  return lines;
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  );
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function diamondPath(context, centerX, centerY, radius) {
  context.beginPath();
  context.moveTo(centerX, centerY - radius);
  context.lineTo(centerX + radius, centerY);
  context.lineTo(centerX, centerY + radius);
  context.lineTo(centerX - radius, centerY);
  context.closePath();
}

function drawModule(ctx, shape, x, y, size) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  switch (shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "rounded":
      roundedRectPath(ctx, x, y, size, size, size * 0.3);
      ctx.fill();
      break;
    case "diamond":
      diamondPath(ctx, centerX, centerY, size / 2);
      ctx.fill();
      break;
    case "horizontal":
      roundedRectPath(ctx, x, y + size * 0.15, size, size * 0.7, size * 0.35);
      ctx.fill();
      break;
    case "vertical":
      roundedRectPath(ctx, x + size * 0.15, y, size * 0.7, size, size * 0.35);
      ctx.fill();
      break;
    case "dot":
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.fillRect(x, y, size, size);
  }
}

window.QRGenerator["qr-renderer"] = {EXPORT_SIZE, renderQRCode, vectorContext, toSVG, wrapText};
})();
