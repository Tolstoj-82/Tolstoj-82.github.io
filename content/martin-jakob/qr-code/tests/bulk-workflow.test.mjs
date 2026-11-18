import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './helpers/dom.mjs';

test('bulk workflow: Cart, unsaved appearance, custom filenames, QR-only SVG with previews',async()=>{
 const {win,downloads}=await createApp();
 const doc=win.document,get=id=>doc.getElementById(id);
 const pause=()=>new Promise(r=>setTimeout(r,30));
 const wait=async fn=>{for(let n=0;n<100;n++){if(fn())return;await pause();}assert.fail('Expected workflow transition did not finish');};
 const input=(id,value)=>{get(id).value=value;get(id).dispatchEvent(new win.Event('input',{bubbles:true}));};
 const change=(id,value)=>{get(id).value=value;get(id).dispatchEvent(new win.Event('change',{bubbles:true}));};
 const shown=[];
 const show=win.HTMLDialogElement.prototype.showModal;
 win.HTMLDialogElement.prototype.showModal=function(){shown.push(this.id);return show.call(this);};
 try {
  get('toggleImportBtn').click();
  // No title field: naming is deliberately configured AFTER the Cart.
  const file=new win.File([JSON.stringify([{ID:'001',URL:'https://example.org/one'},{ID:'002',URL:'https://example.org/two'}])],'batch.json',{type:'application/json'});
  Object.defineProperty(get('fileInput'),'files',{configurable:true,value:[file]});
  get('fileInput').dispatchEvent(new win.Event('change'));
  await wait(()=>get('layoutDialog').open);
  input('qrContentExpression','Stop {{"ID"}}');
  get('applyLayoutBtn').click();
  await wait(()=>!get('layoutDialog').open);
  assert.equal(get('qrContentExpression').value,'Stop {{"ID"}}');

  get('bulkPreviewButton').closest('.cart-panel').querySelector('.qr-edit-button').click();
  await wait(()=>get('qrAppearanceDialog').open);
  input('shapeSelect','rounded');input('colorPicker','#123456');
  get('applyQRAppearance').click();
  await wait(()=>!get('qrAppearanceDialog').open);
  assert.equal(doc.querySelector('dialog[open]'),null,'Applying appearance must not open a template menu');

  // A missing default filename must be reported without reopening the Cart.
  shown.length=0;get('generateBtn').click();await pause();
  assert.equal(downloads.length,0);
  assert.deepEqual(shown,[]);
  assert.notEqual(get('status').textContent,'');

  get('editFilenames').click();change('filenameMode','custom');
  input('filename-qrContentExpression','batch-{{"ID"}}');get('applyFilenames').click();
  assert.equal(get('filenameDialog').open,false);
  get('bulkQrOnly').checked=true;get('showBulkPreview').checked=true;change('exportFormat','svg');
  win.QRGenerator['cart-fonts'].ready=()=>{throw Error('QR-only export must not load Cart fonts');};
  const frames=[];
  const raf=win.requestAnimationFrame.bind(win);
  win.requestAnimationFrame=callback=>raf(time=>{
    if(get('bulkPreview').open){const c=get('bulkCanvas'),p=c.getContext('2d').getImageData(0,0,c.width,c.height);frames.push(win.jsQR(p.data,p.width,p.height)?.data);}
    callback(time);
  });
  shown.length=0;get('generateBtn').click();
  await wait(()=>downloads.length===1);
  assert.deepEqual(shown,['bulkPreview'],'Export must not reopen editors');
  assert.ok(frames.includes('Stop 001'));
  assert.ok(frames.includes('Stop 002'));
  assert.equal(get('bulkPreview').open,true,'Keep the completed preview visible');
  assert.match(get('previewStatus').textContent,/2/);
  const zip=await win.JSZip.loadAsync(await downloads[0].blob.arrayBuffer());
  assert.deepEqual(Object.keys(zip.files),['batch-001.svg','batch-002.svg']);
  const svg=await zip.file('batch-001.svg').async('string');
  assert.match(svg,/#123456/);
  assert.doesNotMatch(svg,/<(?:text|style)\b/);
  get('closePreviewBtn').click();
  assert.equal(get('showBulkPreview').checked,true,'Closing the dialog must not disable future previews');
  // Explicitly disabling previews should still export without opening any menus.
  get('showBulkPreview').checked=false;
  get('showBulkPreview').dispatchEvent(new win.Event('change'));
  shown.length=0;get('generateBtn').click();await wait(()=>downloads.length===2);
  assert.deepEqual(shown,[]);
 } finally {await win.happyDOM.abort();}
});
