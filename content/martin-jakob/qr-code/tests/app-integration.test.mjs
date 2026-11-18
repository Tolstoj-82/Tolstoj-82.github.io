import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createApp} from './helpers/dom.mjs';
const require=createRequire(import.meta.url);
const {createCanvas,loadImage}=require('@napi-rs/canvas');

test('complete app: import, previews, filename edits and optimized downloads', async t=>{
  const {win,downloads}=await createApp();
  const doc=win.document, get=id=>doc.getElementById(id);
  const settle=()=>new Promise(resolve=>setTimeout(resolve,100));
  const input=(id,value)=>{get(id).value=value;get(id).dispatchEvent(new win.Event('input',{bubbles:true}));};
  const change=(id,value)=>{get(id).value=value;get(id).dispatchEvent(new win.Event('change',{bubbles:true}));};
  const decodeCanvas=canvas=>{const p=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);return win.jsQR(p.data,p.width,p.height)?.data;};
  const decode=id=>decodeCanvas(get(id));
  const waitFor=async predicate=>{for(let i=0;i<50;i++){if(predicate())return;await settle();}assert.fail('Timed out waiting for application state');};
  try {
    assert.ok(win.QRGenerator.app);
    await t.test('single-code preview contains the current input',()=>{
      input('qrInput','https://example.org/single');
      assert.equal(decode('qrCanvas'),'https://example.org/single');
      assert.equal(get('qrError').textContent,'');
    });
    await t.test('bulk import refreshes main, Cart and settings previews together',async()=>{
      get('toggleImportBtn').click();
      const file=new win.File([JSON.stringify([
        {Title:'First',ID:'001',URL:'https://example.org/one'},
        {Title:'Second',ID:'002',URL:'https://example.org/two'},
      ])],'sample.json',{type:'application/json'});
      Object.defineProperty(get('fileInput'),'files',{configurable:true,value:[file]});
      get('fileInput').dispatchEvent(new win.Event('change'));
      await waitFor(()=>get('layoutDialog').open);
      for(const id of ['bulkPageCanvas','layoutQR','settingsQR'])assert.equal(decode(id),'https://example.org/one',id);
      input('qrContentExpression','Stop {{"ID"}}');
      for(const id of ['bulkPageCanvas','layoutQR','settingsQR'])assert.equal(decode(id),'Stop 001',id);
      input('qrContentExpression','{{"Missing"}}');
      assert.equal(get('generateBtn').disabled,true);
      for(const id of ['bulkPageCanvas','layoutQR','settingsQR'])assert.equal(decode(id),undefined,id);
      input('qrContentExpression','Stop {{"ID"}}');
      assert.equal(get('generateBtn').disabled,false);
    });
    await t.test('filename Apply and Cancel preserve QR content',()=>{
      get('editFilenames').click();
      change('filenameMode','custom');
      input('filename-qrContentExpression','code-{{"ID"}}');
      get('applyFilenames').click();
      assert.equal(get('filenameDialog').open,false);
      assert.equal(get('bulkFilenamePattern').value,'code-{{"ID"}}');
      assert.match(get('bulkFilenamePreview').textContent,/code-001.png/);
      assert.equal(get('qrContentExpression').value,'Stop {{"ID"}}');
      assert.equal(decode('bulkPageCanvas'),'Stop 001');
      get('editFilenames').click();
      input('filename-qrContentExpression','discard-this');
      get('cancelFilenames').click();
      assert.equal(get('bulkFilenamePattern').value,'code-{{"ID"}}');
      get('editFilenames').click();
      assert.equal(get('filename-qrContentExpression').value,'code-{{"ID"}}');
      get('cancelFilenames').click();
    });
    for(const format of ['svg','png'])await t.test(`${format.toUpperCase()} ZIP retains names and decodable QR payloads`,async()=>{
      get('bulkQrOnly').checked=true;
      change('exportFormat',format);
      const previous=downloads.length;
      get('generateBtn').click();
      await waitFor(()=>downloads.length>previous);
      const download=downloads.at(-1);
      assert.equal(download.name,'QR-Codes.zip');
      const zip=await win.JSZip.loadAsync(await download.blob.arrayBuffer());
      assert.deepEqual(Object.keys(zip.files),[`code-001.${format}`,`code-002.${format}`]);
      for(const [i,file] of Object.values(zip.files).entries()){
        const bytes=await file.async('nodebuffer');
        if(format==='svg'){
          const svg=bytes.toString();
          assert.doesNotMatch(svg,/<(?:text|style)\b/);
          assert.ok(bytes.length<25000,`Compact QR is ${bytes.length} bytes`);
        }
        const image=await loadImage(bytes),canvas=createCanvas(image.width,image.height);
        canvas.getContext('2d').drawImage(image,0,0);
        assert.equal(decodeCanvas(canvas),`Stop 00${i+1}`);
      }
      get('closePreviewBtn').click();
    });
    await t.test('single SVG download accepts a filename using the existing dialog',async()=>{
      get('layoutDialog').close();
      get('toggleSingleBtn').click();
      change('singleFormat','svg');
      const previous=downloads.length;
      get('downloadBtn').click();
      const field=get('downloadName');assert.ok(field);
      field.value='My code';
      field.closest('form').dispatchEvent(new win.Event('submit',{cancelable:true}));
      await waitFor(()=>downloads.length>previous);
      assert.match(downloads.at(-1).name,/My.code\.svg/);
      assert.equal(get('qrError').textContent,'');
    });
  } finally {await win.happyDOM.abort();}
});
