(() => {
  'use strict';
  const {t}=window.QRGenerator.i18n;
  const imagePattern=/\.(png|jpe?g|webp|gif|bmp|svg)$/i;
  // JSZip retains the compressed archive; decoded images are processed one at a time.
  const MAX_IMAGE=20*1024*1024, MAX_ZIP=1024*1024*1024;
  const cancelled=()=>new Error('cancelled');
  const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
  // Spreadsheet exports are literal text, never formulas; JSON preserves exact strings.
  function spreadsheetValue(value){const text=String(value??'');return /^[\s\u0000-\u001f]*[=+@-]/.test(text)?"'"+text:text;}
  function delimited(rows,separator){
    const quote=value=>'"'+spreadsheetValue(value).replaceAll('"','""')+'"';
    return [['filename','text','status'],...rows.map(row=>[row.filename,row.text,row.status])].map(row=>row.map(quote).join(separator)).join('\r\n');
  }
  function boundedZipBlob(entry,check){
    return new Promise((resolve,reject)=>{
      const chunks=[];let size=0,finished=false;
      const stream=entry.internalStream('uint8array');
      stream.on('data',chunk=>{
        if(finished)return;
        try{check();size+=chunk.length;if(size>MAX_IMAGE)throw Error(t('Das Bild darf höchstens 20 MB gross sein.'));chunks.push(chunk);}
        catch(error){finished=true;stream.pause();reject(error);}
      }).on('error',error=>{if(!finished){finished=true;reject(error);}}).on('end',()=>{if(!finished){finished=true;resolve(new Blob(chunks));}}).resume();
    });
  }
  async function scanImage(blob,check){
    if(blob.size>MAX_IMAGE)throw Error(t('Das Bild darf höchstens 20 MB gross sein.'));
    if(typeof window.jsQR!=='function')throw Error(t('Der QR-Code-Leser konnte nicht geladen werden.'));
    const url=URL.createObjectURL(blob),image=new Image();
    try{
      image.src=url;await image.decode();check();
      const width=image.naturalWidth,height=image.naturalHeight;
      if(!width||!height||width*height>40000000||Math.max(width,height)>8192)throw Error(t('Das Bild darf höchstens 8192 Pixel pro Seite und 40 Megapixel gross sein.'));
      const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d',{willReadFrequently:true});
      const values=[];
      for(const maxSide of [1800,4096]){
        const scale=Math.min(1,maxSide/Math.max(width,height));
        canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
        ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
        const seen=new Set();
        for(let index=0;index<32;index++){
          await pause();check();
          const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
          const code=window.jsQR(pixels.data,pixels.width,pixels.height,{inversionAttempts:'attemptBoth'});
          if(!code)break;
          const corners=['topLeftCorner','topRightCorner','bottomRightCorner','bottomLeftCorner'].map(key=>code.location[key]);
          const position=corners.map(point=>Math.round(point.x)+','+Math.round(point.y)).join(';');
          if(seen.has(position))break;seen.add(position);values.push(code.data);
          // Remove each decoded symbol before looking for another in the same image.
          const center=corners.reduce((sum,p)=>({x:sum.x+p.x/4,y:sum.y+p.y/4}),{x:0,y:0});
          ctx.beginPath();corners.forEach((point,i)=>{const x=center.x+(point.x-center.x)*1.08,y=center.y+(point.y-center.y)*1.08;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fillStyle='white';ctx.fill();
        }
        if(values.length||scale===1)break;
      }
      canvas.width=canvas.height=1;
      return values;
    }finally{URL.revokeObjectURL(url);}
  }
  function initialize(){
    const dialog=document.createElement('dialog');dialog.id='qrReaderDialog';dialog.className='qr-reader-dialog modal-frame';dialog.setAttribute('aria-labelledby','qrReaderTitle');
    dialog.innerHTML='<div class="preview-header"><h2 id="qrReaderTitle"></h2><button type="button" class="modal-close">×</button></div><div class="modal-scroll-body"><label class="csv-drop-zone qr-reader-drop" tabindex="0"><strong></strong><input type="file" accept=".png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.zip" multiple hidden></label><div class="qr-reader-info"><span class="logo-info"><button type="button" class="info-button" aria-describedby="qrReaderHelp">i</button><span id="qrReaderHelp" class="qr-reader-help" role="tooltip"></span></span></div><div class="qr-reader-table-wrap" tabindex="0"><table class="qr-reader-table"><thead><tr><th scope="col"></th><th scope="col"></th><th scope="col"></th></tr></thead><tbody></tbody></table></div></div><div class="template-export-footer"><div class="qr-reader-progress-area" hidden><div class="qr-reader-progress-row"><p class="qr-reader-progress" role="status" aria-live="polite"></p><button type="button" class="action-button secondary qr-reader-cancel" hidden></button></div><progress class="qr-reader-bar" max="1" value="0" aria-labelledby="qrReaderProgress"></progress></div><div class="modal-actions"><button type="button" class="action-button secondary qr-reader-clear"></button><button type="button" class="action-button secondary qr-reader-copy"></button><label class="qr-reader-format"><span></span><select><option value="csv">CSV</option><option value="json">JSON</option></select></label><button type="button" class="action-button qr-reader-download"></button></div></div>';
    document.body.append(dialog);
    const find=selector=>dialog.querySelector(selector),drop=find('.qr-reader-drop'),input=find('input'),body=find('tbody'),progress=find('.qr-reader-progress');
    const copy=find('.qr-reader-copy'),download=find('.qr-reader-download'),clear=find('.qr-reader-clear'),cancel=find('.qr-reader-cancel');
    const progressArea=find('.qr-reader-progress-area'),bar=find('.qr-reader-bar');
    progress.id='qrReaderProgress';
    let rows=[],busy=false,version=0,completed=0,total=0,preparing=false,stopped=false;
    const statusText=row=>t({ok:'Gelesen',no_qr:'Kein QR-Code gefunden',unsupported:'Nicht unterstütztes Format',error:'Fehler'}[row.status])+(row.error?': '+row.error:'');
    function controls(){
      copy.disabled=download.disabled=busy||!rows.length;clear.disabled=busy||!rows.length;
      cancel.hidden=!busy;input.disabled=busy;drop.setAttribute('aria-disabled',String(busy));
      progressArea.hidden=!total;
      bar.max=Math.max(1,total);
      if(busy&&preparing)bar.removeAttribute('value');else bar.value=completed;
      const count=completed+' / '+total;
      progress.textContent=busy?(preparing?t('ZIP-Datei wird geöffnet …'):t('Bilder werden gelesen …')+' '+count):
        (stopped?t('Abgebrochen'):t('Fertig'))+' · '+count+' · '+rows.length+' '+t('Ergebnisse');
    }
    function append(row){rows.push(row);const tr=document.createElement('tr');for(const text of [row.filename,row.text,statusText(row)]){const cell=document.createElement('td');cell.textContent=text;tr.append(cell);}tr.dataset.status=row.status;body.append(tr);}
    function localize(){
      find('h2').textContent=t('QR-Codes → Tabelle');find('.modal-close').setAttribute('aria-label',t('Schliessen'));
      drop.querySelector('strong').textContent=t('Bilder oder ZIP-Dateien hierher ziehen oder auswählen');
      find('.qr-reader-info .info-button').setAttribute('aria-label',t('Hinweise zum Import'));
      find('.qr-reader-help').textContent=t('PNG, JPEG, WebP, GIF, BMP oder SVG · Bilder bis 20 MB, ZIP bis 1 GB. Verarbeitung lokal im Browser.');
      ['Dateiname','Inhalt','Status'].forEach((text,index)=>dialog.querySelectorAll('th')[index].textContent=t(text));
      copy.textContent=t('Tabelle kopieren');download.textContent=t('Herunterladen');clear.textContent=t('Liste leeren');cancel.textContent=t('Abbrechen');find('.qr-reader-format span').textContent=t('Dateiformat');
      [...body.rows].forEach((tr,index)=>tr.cells[2].textContent=statusText(rows[index]));controls();
    }
    async function process(files){
      if(busy||!files.length)return;
      busy=true;stopped=false;preparing=false;const attempt=++version;completed=0;total=files.length;controls();
      await pause();
      const check=()=>{if(version!==attempt)throw cancelled();};
      async function read(filename,getBlob){
        check();
        if(!imagePattern.test(filename)){append({filename,text:'',status:'unsupported'});completed++;controls();await pause();check();return;}
        try{const raw=await getBlob();
          const extension=filename.split('.').pop().toLowerCase();
          const mime={svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',bmp:'image/bmp'}[extension];
          const blob=raw.type?raw:new Blob([raw],{type:mime});
          const values=await scanImage(blob,check);check();if(!values.length)append({filename,text:'',status:'no_qr'});for(const text of values)append({filename,text,status:'ok'});}
        catch(error){check();append({filename,text:'',status:'error',error:error.message});}
        completed++;controls();await pause();
      }
      try{
        for(const file of files){
          check();
          if(/\.zip$/i.test(file.name)){
            try{
              if(file.size>MAX_ZIP)throw Error(t('Die ZIP-Datei darf höchstens 1 GB gross sein.'));
              if(typeof JSZip==='undefined')throw Error(t('Die ZIP-Bibliothek konnte nicht geladen werden.'));
              preparing=true;controls();await pause();check();
              const zip=await JSZip.loadAsync(file);check();preparing=false;
              const entries=Object.values(zip.files).filter(entry=>!entry.dir&&!entry.name.startsWith('__MACOSX/'));
              if(!entries.length)throw Error(t('Die ZIP-Datei enthält keine Dateien.'));
              total+=entries.length-1;controls();
              for(const entry of entries){check();await read(entry.name.split(/[\\/]/).pop(),()=>boundedZipBlob(entry,check));}
            }catch(error){check();preparing=false;append({filename:file.name,text:'',status:'error',error:error.message});completed++;controls();}
          }else await read(file.name,async()=>file);
        }
      }catch(error){if(version===attempt)window.QRGenerator.notifications.toast(error.message,'warning');}
      finally{if(version===attempt){busy=false;preparing=false;controls();input.value='';}}
    }
    function stop(){if(!busy)return;++version;busy=false;preparing=false;stopped=true;input.value='';controls();}
    input.addEventListener('change',()=>process([...input.files]));
    drop.addEventListener('keydown',event=>{if(!busy&&['Enter',' '].includes(event.key)){event.preventDefault();input.click();}});
    drop.addEventListener('dragover',event=>{event.preventDefault();if(!busy)drop.classList.add('dragover');});
    drop.addEventListener('dragleave',()=>drop.classList.remove('dragover'));
    drop.addEventListener('drop',event=>{event.preventDefault();drop.classList.remove('dragover');process([...event.dataTransfer.files]);});
    cancel.addEventListener('click',stop);
    find('.modal-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',stop);
    clear.addEventListener('click',()=>{rows=[];total=completed=0;stopped=false;body.replaceChildren();controls();});
    const exportRows=()=>rows.map(row=>({filename:row.filename,text:row.text,status:statusText(row)}));
    download.addEventListener('click',()=>{
      const format=find('select').value,data=exportRows();
      const blob=new Blob([format==='json'?JSON.stringify(data,null,2):'\uFEFF'+delimited(data,';')],{type:format==='json'?'application/json':'text/csv;charset=utf-8'});
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='qr-codes.'+format;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    copy.addEventListener('click',async()=>{
      try{
        const text=delimited(exportRows(),'\t');
        if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
        else{const field=document.createElement('textarea');field.value=text;field.className='clipboard-helper';dialog.append(field);field.select();let ok;try{ok=document.execCommand('copy');}finally{field.remove();copy.focus();}if(!ok)throw Error();}
        window.QRGenerator.notifications.toast(t('Tabelle kopiert.'));
      }catch{window.QRGenerator.notifications.toast(t('Die Tabelle konnte nicht kopiert werden. Bitte CSV herunterladen.'),'warning');}
    });
    return {process,dialog,getRows:()=>rows,open(){localize();if(!dialog.open)dialog.showModal();}};
  }
  let reader;
  function open(){
    reader??=initialize();
    reader.open();
  }
  window.QRGenerator['qr-reader']={open,scanImage,delimited,boundedZipBlob};
})();
