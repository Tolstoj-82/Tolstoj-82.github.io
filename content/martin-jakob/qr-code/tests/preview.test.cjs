const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../js/app.js'), 'utf8');
function extract(name) {
  const start = source.indexOf(`  function ${name}(`);
  const end = source.indexOf('\n  function ', start + 1);
  return source.slice(start, end);
}
function setup() {
  function canvas() {
    return { width: 300, height: 150, pixels: 'previous', style: {},
      classList: { toggle() {} }, setAttribute() {},
      getContext() { return {
        drawImage: image => { this.pixels = image.pixels; },
        fillRect: () => { this.pixels = 'blank'; },
        clearRect: () => { this.pixels = 'blank'; },
      }; },
    };
  }
  const nodes = Object.fromEntries(['settingsQR', 'layoutQR', 'bulkPageCanvas', 'bulkPreviewError', 'renderNotice', 'layoutError', 'bulkLoadedContent'].map(id => [id, canvas()]));
  nodes.bulkEditorSlot = { contains: () => false };
  const main = canvas();
  const env = {
    document: { createElement: canvas, getElementById: id => nodes[id], querySelectorAll: () => [], querySelector: () => null },
    console: { error() {} }, Error, EXPORT_SIZE: 1000,
    t: text => text, setMessage: (node, render) => { node.textContent = render(); },
    canvas: main, ctx: main.getContext('2d'), qrError: {}, downloadBtn: {},
    qrInput: { value: 'single', classList: { toggle() {} } },
    qrcode() {}, cartAppearance: { refresh() {}, content: () => 'settings', settings: () => ({}) },
    readSettings: () => ({}), currentSingleLayout: () => ({}),
    updateUnusedParameters() {}, updateRibbonUI() {}, renderVariableChips() {},
    singleRecord: () => ({}), createLabeledCanvas: image => image,
    simpleEditor: null, activeMode: 'single', templateTestContent: '',
    loadedData: [{ URL: 'bulk' }], bulkLayout: {}, metricLayout: {},
    layoutDialog: { open: true }, layoutSample: { URL: 'layout' }, DEMO_QR_CONTENT: 'demo',
    clearQRCode() {},
    failures: new Set(),
  };
  env.renderQRCode = (target, text) => {
    target.pixels = 'partial';
    if (env.failures.has(text)) throw new Error(`Cannot render ${text}`);
    target.width = target.height = 1000;
    target.pixels = text;
    return '';
  };
  vm.createContext(env);
  vm.runInContext(['renderBulkPreview', 'updateQRPreview', 'renderSecondaryPreviews', 'generateQRCode'].map(extract).join('\n'), env);
  return { env, nodes, main };
}
test('settings failure does not block the main, bulk or Cart preview', () => {
  const { env, nodes, main } = setup();
  env.failures.add('settings');
  env.generateQRCode();
  assert.equal(main.pixels, 'single');
  assert.equal(nodes.bulkPageCanvas.pixels, 'bulk');
  assert.equal(nodes.layoutQR.pixels, 'layout');
  assert.equal(nodes.settingsQR.pixels, 'previous');
  assert.equal(env.downloadBtn.disabled, false);
});
test('single-code failure does not block bulk or Cart and recovers on correction', () => {
  const { env, nodes, main } = setup();
  env.failures.add('single');
  env.generateQRCode();
  assert.equal(main.pixels, 'previous');
  assert.equal(nodes.bulkPageCanvas.pixels, 'bulk');
  assert.equal(nodes.layoutQR.pixels, 'layout');
  assert.equal(env.downloadBtn.disabled, true);
  env.failures.clear();
  env.generateQRCode();
  assert.equal(main.pixels, 'single');
  assert.equal(env.downloadBtn.disabled, false);
  assert.equal(env.qrError.textContent, '');
});
test('bulk error is displayed locally and clears after recovery', () => {
  const { env, nodes, main } = setup();
  env.failures.add('bulk');
  env.generateQRCode();
  assert.equal(main.pixels, 'single');
  assert.equal(nodes.bulkPageCanvas.pixels, 'previous');
  assert.equal(nodes.bulkPreviewError.textContent, 'Cannot render bulk');
  env.failures.clear();
  env.generateQRCode();
  assert.equal(nodes.bulkPageCanvas.pixels, 'bulk');
  assert.equal(nodes.bulkPreviewError.textContent, '');
});
test('Cart failure preserves its previous image without disabling the main code', () => {
  const { env, nodes, main } = setup();
  env.failures.add('layout');
  env.generateQRCode();
  assert.equal(main.pixels, 'single');
  assert.equal(nodes.layoutQR.pixels, 'previous');
  assert.equal(env.downloadBtn.disabled, false);
});

test('empty active Cart content clears the settings QR instead of showing the single code', () => {
  const { env, nodes } = setup();
  env.cartAppearance.content = () => '';
  env.generateQRCode();
  assert.equal(nodes.settingsQR.pixels, 'blank');
});
