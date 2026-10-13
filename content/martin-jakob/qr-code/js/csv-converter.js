(() => {
  'use strict';
  const {t}=window.QRGenerator.i18n;
  const storageKey='qr-generator.csv-keys.v1';
  function convert(records,columns){
    const selected=columns.filter(column=>column.enabled);
    if(!selected.length)throw Error(t('Bitte mindestens ein Feld auswählen.'));
    const names=selected.map(column=>column.name.trim());
    if(names.some(name=>!name)||new Set(names).size!==names.length)throw Error(t('Die ausgewählten Schlüssel müssen eindeutig und nicht leer sein.'));
    return records.map(record=>Object.fromEntries(selected.map((column,index)=>[names[index],record[column.key]])));
  }
  function initialize({confirmDeletion}) {
    let records=[],columns=[],filename='Daten',loadVersion=0;
    let saved=[];try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(data))saved=data.filter(key=>typeof key==='string'&&key.length<=200).slice(0,300);}catch{}
    const dialog=document.createElement('dialog');dialog.className='csv-converter-dialog modal-frame';dialog.setAttribute('aria-labelledby','csvConverterHeading');
    dialog.innerHTML='<div class="preview-header"><h2 id="csvConverterHeading">CSV → JSON</h2><button class="modal-close" type="button">×</button></div><div class="modal-scroll-body"><label class="csv-drop-zone" tabindex="0"><strong></strong><input type="file" accept=".csv,text/csv" hidden></label><p class="csv-file-info"></p><div class="csv-column-list"></div><details class="csv-saved-keys"><summary></summary><div></div></details><p class="csv-error" role="alert"></p><label class="csv-preview-label"></label><pre class="csv-json-preview"></pre></div><div class="template-export-footer"><div class="modal-actions"><button class="action-button secondary csv-cancel" type="button"></button><button class="action-button csv-download" type="button"></button></div></div>';
    document.body.append(dialog);
    const close=dialog.querySelector('.modal-close'),file=dialog.querySelector('input'),drop=dialog.querySelector('.csv-drop-zone'),list=dialog.querySelector('.csv-column-list'),error=dialog.querySelector('.csv-error'),preview=dialog.querySelector('pre'),download=dialog.querySelector('.csv-download'),savedHost=dialog.querySelector('.csv-saved-keys > div');
    function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{window.QRGenerator.notifications.toast(t('Schlüssel konnten nicht gespeichert werden.'),'warning');}}
    function renderSaved(){
      savedHost.replaceChildren();
      for(const key of saved){const pill=document.createElement('span');pill.className='csv-saved-key';const text=document.createElement('span');text.textContent=key;const remove=document.createElement('button');remove.type='button';remove.className='saved-logo-delete';remove.setAttribute('aria-label',t('Schlüssel löschen: ')+key);remove.addEventListener('click',async()=>{if(!await confirmDeletion(key,{kind:'data'}))return;saved=saved.filter(item=>item!==key);persist();renderSaved();updateSuggestions();});pill.append(text,remove);savedHost.append(pill);}
      if(!saved.length)savedHost.textContent=t('Noch keine gespeicherten Schlüssel.');
    }
    const suggestions=document.createElement('datalist');suggestions.id='csvKeySuggestions';dialog.append(suggestions);
    function updateSuggestions(){suggestions.replaceChildren(...saved.map(key=>new Option(key,key)));}
    function refresh(){
      download.disabled=true;error.textContent='';preview.textContent='';
      if(!records.length)return;
      try{const result=convert(records,columns);preview.textContent=JSON.stringify(result.slice(0,3),null,2);download.disabled=false;}catch(reason){error.textContent=reason.message;}
    }
    function renderColumns(){
      list.replaceChildren();
      for(const column of columns){
        const row=document.createElement('div');row.className='csv-column';
        const include=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=column.enabled;include.append(check,document.createTextNode(column.key));
        const name=document.createElement('input');name.type='text';name.value=column.name;name.maxLength=200;name.setAttribute('list','csvKeySuggestions');name.setAttribute('aria-label',t('JSON-Schlüssel für ')+column.key);
        const sample=document.createElement('small');sample.textContent=String(records[0]?.[column.key]??'');sample.title=sample.textContent;
        check.addEventListener('change',()=>{column.enabled=check.checked;name.disabled=!check.checked;refresh();});name.addEventListener('input',()=>{column.name=name.value;refresh();});row.append(include,name,sample);list.append(row);
      }
      refresh();
    }
    async function load(input){
      if(!input)return;const attempt=++loadVersion;download.disabled=true;records=[];columns=[];list.replaceChildren();preview.textContent='';error.textContent='';
      try{if(input.size>20*1024*1024)throw Error(t('Die CSV-Datei darf höchstens 20 MB gross sein.'));const text=await input.text();if(attempt!==loadVersion)return;records=window.QRGenerator['qr-content'].recordsFromCSV(text);filename=input.name.replace(/\.csv$/i,'');columns=Object.keys(records[0]).map(key=>({key,name:key,enabled:true}));dialog.querySelector('.csv-file-info').textContent=input.name+' · '+records.length+' '+t('Einträge');renderColumns();}
      catch(reason){if(attempt!==loadVersion)return;records=[];columns=[];list.replaceChildren();preview.textContent='';error.textContent=reason.message;}finally{file.value='';}
    }
    file.addEventListener('change',()=>load(file.files[0]));drop.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();file.click();}});
    drop.addEventListener('dragover',event=>{event.preventDefault();drop.classList.add('dragover');});drop.addEventListener('dragleave',()=>drop.classList.remove('dragover'));drop.addEventListener('drop',event=>{event.preventDefault();drop.classList.remove('dragover');load(event.dataTransfer.files[0]);});
    download.addEventListener('click',()=>{
      try{const result=convert(records,columns);saved=[...new Set([...saved,...columns.filter(column=>column.enabled).map(column=>column.name.trim())])].slice(-300);persist();renderSaved();updateSuggestions();const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=(filename||'Daten')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(reason){error.textContent=reason.message;}
    });
    const cancel=dialog.querySelector('.csv-cancel');close.addEventListener('click',()=>dialog.close());cancel.addEventListener('click',()=>dialog.close());
    document.getElementById('openCSVConverter').addEventListener('click',()=>{
      close.setAttribute('aria-label',t('Schliessen'));drop.querySelector('strong').textContent=t('CSV-Datei hierher ziehen oder auswählen');dialog.querySelector('.csv-saved-keys summary').textContent=t('Gespeicherte Schlüssel');dialog.querySelector('.csv-preview-label').textContent=t('Vorschau: erste drei Einträge');cancel.textContent=t('Abbrechen');download.textContent=t('JSON herunterladen');renderSaved();updateSuggestions();if(records.length)renderColumns();else refresh();dialog.showModal();
    });
    return {load,convert};
  }
  window.QRGenerator['csv-converter']={initialize,convert};
})();
