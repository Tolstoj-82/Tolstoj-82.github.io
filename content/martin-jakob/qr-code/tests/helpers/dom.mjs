import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const { Window } = await import(pathToFileURL(require.resolve('happy-dom')).href);
const {createCanvas}=require('@napi-rs/canvas');
const work=fileURLToPath(new URL('../../', import.meta.url));
export async function createApp({url="http://localhost:8765",storage={}} = {}) {
const win=new Window({url,settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
for(const [key,value] of Object.entries(storage))win.localStorage.setItem(key,value);
win.structuredClone=structuredClone;
win.confirm=()=>true;
win.Option=function(text,value){const node=win.document.createElement('option');node.textContent=text;node.value=value;return node;};
win.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
win.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new win.Event('close'));};
win.fetch=fetch;
win.console=console;
win.document.fonts={ready:Promise.resolve(),load:async()=>[{}]};
const canvases=new WeakMap();
// Browsers clear a canvas even when its dimensions are assigned the same value.
// This matters when replacing an opaque preview with a transparent one.
for (const dimension of ['width','height']) {
 const descriptor=Object.getOwnPropertyDescriptor(win.HTMLCanvasElement.prototype,dimension);
 Object.defineProperty(win.HTMLCanvasElement.prototype,dimension,{
  ...descriptor,
  set(value){descriptor.set.call(this,value);const entry=canvases.get(this);if(entry)entry.native[dimension]=this[dimension];},
 });
}
win.HTMLCanvasElement.prototype.getContext=function(){
 let entry=canvases.get(this);
 if(!entry){const native=createCanvas(this.width,this.height);const context=native.getContext('2d');entry={native,context};canvases.set(this,entry);}
 if(entry.native.width!==this.width)entry.native.width=this.width;
 if(entry.native.height!==this.height)entry.native.height=this.height;
 const sync=()=>{if(entry.native.width!==this.width)entry.native.width=this.width;if(entry.native.height!==this.height)entry.native.height=this.height;};
 return new Proxy(entry.context,{get:(t,k)=>{sync();if(k==='drawImage')return (image,...args)=>t.drawImage(canvases.get(image)?.native||image,...args);const v=t[k];return typeof v==='function'?v.bind(t):v;},set:(t,k,v)=>{sync();t[k]=v;return true;}});
};
// JSZip accepts Buffer in Node; the browser receives the same PNG bytes in a Blob.
win.HTMLCanvasElement.prototype.toBlob=function(cb){this.getContext('2d');cb(canvases.get(this).native.toBuffer('image/png'));};
win.HTMLCanvasElement.prototype.toDataURL=function(){this.getContext('2d');return canvases.get(this).native.toDataURL();};
const html=fs.readFileSync(work+'/index.html','utf8');
win.document.write(html.replace(/<script\b[\s\S]*?<\/script>/g,''));
win.eval(fs.readFileSync(require.resolve('qrcode-generator'),'utf8'));
win.eval(fs.readFileSync(require.resolve('jsqr'),'utf8'));
win.JSZip=require('jszip');
const downloads=[];win.saveAs=(blob,name)=>downloads.push({blob,name});
for(const match of html.matchAll(/<script\b[^>]*src="([^"?]+)[^"]*"[^>]*><\/script>/g)){
 if(match[1].startsWith('https:'))continue;
 try{win.eval(fs.readFileSync(work+'/'+match[1],'utf8'));}catch(e){console.error('SCRIPT FAILED',match[1],e);throw e;}
}
await new Promise(r=>setTimeout(r,100));
return {win,canvases,downloads};
}
