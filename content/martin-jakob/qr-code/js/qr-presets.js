(() => {
  "use strict";
  const {t} = window.QRGenerator.i18n;
  function createQRPresets(context) {
    const key = "qr-generator.qr-templates.v1";
    let entries = [], selected = "", version = 0;
    try {
      const saved = localStorage.getItem(key);
      entries = saved ? JSON.parse(saved) : JSON.parse(localStorage.getItem("qr-generator.templates.v1") || "[]").filter(item => item.payload?.appearance).map(item => ({id:item.id,name:item.name,payload:{appearance:item.payload.appearance,logoData:item.payload.logoData,ribbon:item.payload.layout?.ribbon}}));
      if (!Array.isArray(entries)) entries = [];
      entries = entries.filter(item => item && typeof item.id === "string" && typeof item.name === "string" && item.payload && typeof item.payload === "object");
    } catch { entries = []; }
    const host = document.getElementById("qrPresetControls");
    host.classList.add("template-library");
    const {createTemplateCombo, confirmOverwrite} = window.QRGenerator["template-combo"];
    const error = document.createElement("p"); error.setAttribute("role","status");
    function persist() {
      try { localStorage.setItem(key, JSON.stringify(entries)); return true; }
      catch { error.textContent = t("Templates konnten nicht gespeichert werden. Der lokale Speicher ist voll oder nicht verfügbar."); window.QRGenerator.notifications.toast(error.textContent, "warning"); return false; }
    }
    const label=document.createElement("label");label.htmlFor="qrPresetSelect";
    const row=document.createElement("div");row.className="template-library-row";
    const comboHost=document.createElement("div");
    const save=document.createElement("button");save.type="button";save.className="action-button secondary";
    row.append(comboHost);host.append(label,row);
    const saveHost=document.getElementById('qrPresetSaveControls'),saveLabel=document.createElement('label');saveLabel.htmlFor='qrPresetSaveName';
    const saveName=document.createElement('input');saveName.id='qrPresetSaveName';saveName.type='text';saveName.maxLength=80;
    let baseline=null, pendingDiscard=null;
    const signature=()=>JSON.stringify({payload:context.read(),name:saveName.value},(key,value)=>key==='id'?undefined:value);
    const markBaseline=()=>{baseline=signature();};
    const hasChanges=()=>baseline!==null&&baseline!==signature();
    const unsaved=document.getElementById('qrUnsavedDialog');
    function confirmDiscard(){
      if(!hasChanges())return Promise.resolve(true);
      if(pendingDiscard)return Promise.resolve(false);
      unsaved.showModal();document.getElementById('keepQREditing').focus();
      return new Promise(resolve=>{pendingDiscard=resolve;});
    }
    function finishDiscard(value){const resolve=pendingDiscard;pendingDiscard=null;unsaved.close();resolve?.(value);}
    for(const id of ['keepQREditing','closeQRUnsaved'])document.getElementById(id).addEventListener('click',()=>finishDiscard(false));
    document.getElementById('discardQREdits').addEventListener('click',()=>finishDiscard(true));
    unsaved.addEventListener('cancel',event=>{event.preventDefault();finishDiscard(false);});
    const saveRow=document.createElement('div');saveRow.className='template-library-row';saveRow.append(saveName,save);saveHost.append(saveLabel,saveRow,error);
    const combo=createTemplateCombo({host:comboHost,id:"qrPresetSelect",getItems:()=>entries,
      choose: async entry => {
        if(!await confirmDiscard())return false;
        const attempt=++version;
        try {
          const payload=entry.payload,appearance=payload.appearance;
          for(const [field,id] of [["shape","shapeSelect"],["finderShape","finderShapeSelect"]])if(![...document.getElementById(id).options].some(option=>option.value===appearance[field]))throw Error();
          for(const field of ["color","finderColor"])if(!/^#[0-9a-f]{6}$/i.test(appearance[field]))throw Error();
          let image=null;
          if(payload.logoData){if(!/^data:image\/png;base64,/.test(payload.logoData)||payload.logoData.length>500000)throw Error();image=new Image();image.src=payload.logoData;await image.decode();if(image.naturalWidth>256||image.naturalWidth!==image.naturalHeight)throw Error();}
          if(attempt!==version)return false;
          context.apply(payload,image);selected=entry.id;saveName.value=entry.name;error.textContent="";markBaseline();return true;
        }catch{window.QRGenerator.notifications.toast(t("Ungültiges Template."),"warning");return false;}
      },
      remove: async entry => {if(!await context.confirmDeletion(entry.name))return;const previous=entries;entries=entries.filter(item=>item.id!==entry.id);if(!persist())entries=previous;else{if(selected===entry.id)selected="";if(combo.input.value===entry.name)combo.input.value="";}},
      save: () => saveTemplate()
    });
    let saving=false;
    async function saveTemplate(){
      if(saving)return;
      const name=saveName.value.trim();
      if(!name){error.textContent=t("Bitte einen Template-Namen eingeben.");saveName.focus();return;}
      saving=true;
      try{
        const existing=entries.find(item=>item.name.toLocaleLowerCase()===name.toLocaleLowerCase());
        const payload=context.read();
        if(existing&&!await confirmOverwrite(existing.name))return;
        const next={id:existing?.id||crypto.randomUUID(),name:existing?.name||name,payload},previous=entries;
        entries=existing?entries.map(item=>item.id===existing.id?next:item):[...entries,next];
        if(persist()){selected=next.id;combo.input.value=next.name;saveName.value=next.name;combo.close();error.textContent="";markBaseline();render();window.QRGenerator.notifications.toast(t("Template gespeichert."));document.dispatchEvent(new Event('qr-templates-changed'));}else entries=previous;
      }finally{saving=false;}
    }
    function reorder(ids) {
      if(ids.length!==entries.length || new Set(ids).size!==entries.length || ids.some(id=>!entries.some(entry=>entry.id===id)))return false;
      const previous=entries;entries=ids.map(id=>previous.find(entry=>entry.id===id));
      if(!persist()){entries=previous;return false;}combo.render();return true;
    }
    function exportFile() {
      const blob=new Blob([JSON.stringify({format:'qr-generator-templates',version:1,templates:entries},null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='QR-Code-Templates.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    async function importFile(file) {
      try {
        if(file.size>20*1024*1024)throw Error();
        const data=JSON.parse((await file.text()).replace(/^\uFEFF/,''));
        if(data.format!=='qr-generator-templates'||data.version!==1||!Array.isArray(data.templates)||!data.templates.length||data.templates.length>200)throw Error();
        const imported=[];
        for(const item of data.templates){
          const appearance=item?.payload?.appearance;
          if(typeof item?.name!=='string'||!item.name.trim()||item.name.length>80||!appearance)throw Error();
          for(const [field,id] of [['shape','shapeSelect'],['finderShape','finderShapeSelect']])if(![...document.getElementById(id).options].some(option=>option.value===appearance[field]))throw Error();
          for(const field of ['color','finderColor'])if(!/^#[0-9a-f]{6}$/i.test(appearance[field]))throw Error();
          const logoData=item.payload.logoData||'';
          if(logoData){if(typeof logoData!=='string'||!/^data:image\/png;base64,/.test(logoData)||logoData.length>500000)throw Error();const image=new Image();image.src=logoData;await image.decode();if(!image.naturalWidth||image.naturalWidth>256||image.naturalWidth!==image.naturalHeight)throw Error();}
          const ribbon=item.payload.ribbon;
          if(ribbon&&(!Array.isArray(ribbon.rules)||ribbon.rules.length>100||ribbon.rules.some(rule=>!rule||typeof rule.pattern!=='string'||typeof rule.text!=='string'||Array.from(rule.text).length>5||!['always','contains'].includes(rule.match)||!/^#[0-9a-f]{6}$/i.test(rule.color))))throw Error();
          imported.push({name:item.name.trim(),payload:{appearance:Object.fromEntries(['shape','finderShape','color','finderColor'].map(key=>[key,appearance[key]])),logoData,...(ribbon?{ribbon}: {})}});
        }
        const names=new Set(entries.map(entry=>entry.name.toLocaleLowerCase()));
        for(const item of imported){const base=item.name;let index=2;while(names.has(item.name.toLocaleLowerCase()))item.name=base.slice(0,70)+' ('+(index++)+')';names.add(item.name.toLocaleLowerCase());item.id=crypto.randomUUID();}
        const previous=entries;entries=[...entries,...imported];if(!persist()){entries=previous;return;}
        render();document.dispatchEvent(new Event('qr-templates-changed'));window.QRGenerator.notifications.toast(t('QR-Code-Templates importiert.'));
      }catch{window.QRGenerator.notifications.toast(t('Ungültige QR-Code-Template-Datei.'),'warning');}
    }
    save.addEventListener("click",saveTemplate);
    function render(){label.textContent=t("QR-Code-Template");saveLabel.textContent=t("Template speichern");save.textContent=t("Speichern");combo.render();}
    render(); return {render, confirmDiscard, syncSelection:payload=>{const shape=p=>JSON.stringify([p.appearance.shape,p.appearance.finderShape,p.appearance.color,p.appearance.finderColor,p.logoData||'']);const item=entries.find(entry=>shape(entry.payload)===shape(payload));selected=item?.id||'';saveName.value=item?.name||'';combo.input.value=item?.name||'';markBaseline();}, resetBaseline:markBaseline, beginEditing:()=>{if(baseline===null)markBaseline();}, hasChanges, reorder, importFile, exportFile, getSelected:()=>selected, createNew:async()=>{if(!await confirmDiscard())return false;++version;selected='';combo.input.value='';saveName.value='';error.textContent='';context.apply({appearance:{shape:'square',finderShape:'square',color:'#000000',finderColor:'#000000'},logoData:''},null);markBaseline();saveName.focus();return true;}, getEntries:()=>entries, choose:entry=>combo.choose(entry), remove:entry=>combo.remove(entry), getLogoUsage: data => [...new Set(entries.filter(entry=>entry.payload.logoData===data).map(entry=>entry.name))]};
  }
  window.QRGenerator["qr-presets"] = {createQRPresets};
})();
