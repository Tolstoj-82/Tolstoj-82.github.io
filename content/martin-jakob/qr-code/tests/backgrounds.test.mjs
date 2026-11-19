import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createApp} from './helpers/dom.mjs';
const require=createRequire(import.meta.url);
const {createCanvas,loadImage}=require('@napi-rs/canvas');

test('backgrounds: dark colors, real transparency and PNG/SVG parity',async t=>{
 const {win,downloads}=await createApp();
 const doc=win.document,get=id=>doc.getElementById(id);
 const {renderQRCode,toSVG}=win.QRGenerator['qr-renderer'];
 const payload='https://example.org/background-test';
 const settings={shape:'square',finderShape:'square',color:'#ffffff',finderColor:'#ffffff',backgroundColor:'#102030',transparentBackground:false};
 const rgba=(c,x,y)=>Array.from(c.getContext('2d').getImageData(x,y,1,1).data);
 const decode=(c,bg)=>{
   const flat=createCanvas(c.width,c.height),ctx=flat.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);
   // Export DOM canvases to PNG so native compositing sees exactly their pixels.
   return loadImage(c.toDataURL()).then(image=>{ctx.drawImage(image,0,0);const p=ctx.getImageData(0,0,c.width,c.height);return win.jsQR(p.data,p.width,p.height,{inversionAttempts:'attemptBoth'})?.data;});
 };
 const rasterSVG=async svg=>{const image=await loadImage(Buffer.from(svg));const c=createCanvas(image.width,image.height);c.getContext('2d').drawImage(image,0,0);return c;};
 try {
  await t.test('light QR on a chosen dark background decodes in PNG and SVG',async()=>{
   const c=doc.createElement('canvas');renderQRCode(c,payload,{...settings,vector:true});
   assert.deepEqual(rgba(c,0,0),[16,32,48,255]);
   assert.equal(await decode(c,settings.backgroundColor),payload);
   const svg=await rasterSVG(toSVG(c));assert.deepEqual(rgba(svg,0,0),[16,32,48,255]);
   assert.equal(await decode(svg,settings.backgroundColor),payload);
  });
  await t.test('every finder style has transparent quiet zones and marker gaps in SVG and PNG',async()=>{
   const qr=win.qrcode(0,'H');qr.addData(payload);qr.make();const m=Math.floor(800/qr.getModuleCount()),pad=Math.floor((1000-m*qr.getModuleCount())/2);
   for(const finderShape of ['square','circle','circular','rounded-square','diamond','ring','square-circle','circle-square']){
    const c=doc.createElement('canvas');renderQRCode(c,payload,{...settings,finderShape,transparentBackground:true,vector:true});
    const svg=await rasterSVG(toSVG(c));
    for(const image of [c,svg]){
      assert.equal(rgba(image,0,0)[3],0,finderShape+' quiet zone');
      assert.equal(rgba(image,Math.floor(pad+1.5*m),Math.floor(pad+3.5*m))[3],0,finderShape+' gap');
    }
    if(finderShape==='square'||finderShape==='rounded-square'){
      assert.equal(await decode(c,settings.backgroundColor),payload);
      assert.equal(await decode(svg,settings.backgroundColor),payload);
    }
   }
  });
  await t.test('logo verification handles inverted colors and transparent restoration',async()=>{
   const logo=doc.createElement('canvas');logo.width=logo.height=80;const ctx=logo.getContext('2d');ctx.fillStyle='#55aaff';ctx.fillRect(0,0,80,80);
   for(const transparentBackground of [false,true]){
    const c=doc.createElement('canvas');renderQRCode(c,payload,{...settings,transparentBackground,logo,vector:true});
    assert.equal(rgba(c,0,0)[3],transparentBackground?0:255);
    assert.equal(await decode(c,settings.backgroundColor),payload);
    assert.equal(await decode(await rasterSVG(toSVG(c)),settings.backgroundColor),payload);
   }
  });
  await t.test('appearance Apply/Cancel and simple mode retain background preferences',async()=>{
   get('singleCartToggle').closest('.cart-panel').querySelector('.qr-edit-button').click();
   await new Promise(r=>setTimeout(r,40));
   get('invertQRColors').click();
   assert.equal(get('colorPicker').value,'#ffffff');assert.equal(get('backgroundColorPicker').value,'#000000');
   get('transparentBackground').checked=true;get('transparentBackground').dispatchEvent(new win.Event('input'));
   get('applyQRAppearance').click();await new Promise(r=>setTimeout(r,40));
   assert.equal(rgba(get('qrCanvas'),0,0)[3],0,'Cart composition preserves alpha');
   assert.equal(get('qrCanvas').style.backgroundColor,'#000000');
   get('singleCartToggle').closest('.cart-panel').querySelector('.qr-edit-button').click();await new Promise(r=>setTimeout(r,40));
   assert.equal(get('transparentBackground').checked,true);assert.equal(get('backgroundColorPicker').value,'#000000');
   get('invertQRColors').click();get('cancelQRAppearance').click();await new Promise(r=>setTimeout(r,40));
   assert.equal(get('qrCanvas').style.backgroundColor,'#000000');
   get('simpleModeToggle').checked=true;get('simpleModeToggle').dispatchEvent(new win.Event('change'));
   const simple=get('simpleQRTools');get('simple-invertQRColors').click();
   assert.equal(get('simple-color').value,'#ffffff');
   get('simple-transparentBackground').checked=true;get('simple-transparentBackground').dispatchEvent(new win.Event('input'));
   assert.equal(rgba(get('qrCanvas'),0,0)[3],0);
   const saved=JSON.parse(win.localStorage.getItem('qr-generator.simple-mode.v1'));
   assert.equal(saved.appearance.transparentBackground,true);assert.equal(saved.appearance.backgroundColor,'#000000');
  });
  await t.test('single and bulk downloads preserve transparent backgrounds',async()=>{
   const pause=()=>new Promise(r=>setTimeout(r,30));
   const wait=async fn=>{for(let i=0;i<100;i++){if(fn())return;await pause();}assert.fail('Download did not complete');};
   get('qrInput').value=payload;get('qrInput').dispatchEvent(new win.Event('input'));
   for(const format of ['png','svg']){
     get('singleFormat').value=format;
     const before=downloads.length;get('downloadBtn').click();
     get('downloadName').value='transparent';get('downloadName').closest('form').dispatchEvent(new win.Event('submit',{cancelable:true}));
     await wait(()=>downloads.length>before);
     const blob=downloads.at(-1).blob;
     const image=await loadImage(Buffer.isBuffer(blob)?blob:Buffer.from(await blob.arrayBuffer()));
     const c=createCanvas(image.width,image.height);c.getContext('2d').drawImage(image,0,0);
     assert.equal(rgba(c,0,0)[3],0,format);
     assert.equal(await decode(c,'#000000'),payload);
   }
   get('simpleModeToggle').checked=false;get('simpleModeToggle').dispatchEvent(new win.Event('change'));
   get('toggleImportBtn').click();
   const file=new win.File([JSON.stringify([{ID:'001',URL:payload}])],'backgrounds.json',{type:'application/json'});
   Object.defineProperty(get('fileInput'),'files',{configurable:true,value:[file]});get('fileInput').dispatchEvent(new win.Event('change'));
   await wait(()=>get('layoutDialog').open);get('applyLayoutBtn').click();await wait(()=>!get('layoutDialog').open);
   get('bulkPreviewButton').closest('.cart-panel').querySelector('.qr-edit-button').click();await wait(()=>get('qrAppearanceDialog').open);
   get('invertQRColors').click();get('transparentBackground').checked=true;get('transparentBackground').dispatchEvent(new win.Event('input'));
   get('applyQRAppearance').click();await wait(()=>!get('qrAppearanceDialog').open);
   get('editFilenames').click();get('filenameMode').value='custom';get('filenameMode').dispatchEvent(new win.Event('change'));
   get('filename-qrContentExpression').value='{{"ID"}}';get('filename-qrContentExpression').dispatchEvent(new win.Event('input'));get('applyFilenames').click();
   get('bulkQrOnly').checked=true;get('showBulkPreview').checked=false;
   for(const format of ['png','svg']){
     get('exportFormat').value=format;const before=downloads.length;get('generateBtn').click();await wait(()=>downloads.length>before);
     const zip=await win.JSZip.loadAsync(await downloads.at(-1).blob.arrayBuffer());
     const image=await loadImage(await zip.file('001.'+format).async('nodebuffer'));
     const c=createCanvas(image.width,image.height);c.getContext('2d').drawImage(image,0,0);
     assert.equal(rgba(c,0,0)[3],0,format+' bulk');assert.equal(await decode(c,'#000000'),payload);
   }
   const storage=Object.fromEntries(Array.from({length:win.localStorage.length},(_,i)=>{const key=win.localStorage.key(i);return [key,win.localStorage.getItem(key)];}));
   const restored=await createApp({storage});
   try {
    const saved=JSON.parse(restored.win.localStorage.getItem('qr-generator.single-layout.v1'));
    assert.equal(saved.qrAppearance.appearance.backgroundColor,'#000000');assert.equal(saved.qrAppearance.appearance.transparentBackground,true);
    assert.equal(rgba(restored.win.document.getElementById('qrCanvas'),0,0)[3],0);
   }finally{await restored.win.happyDOM.abort();}
  });
 }finally{await win.happyDOM.abort();}
});
