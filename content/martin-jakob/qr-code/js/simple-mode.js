(() => {
  'use strict';
  const {t}=window.QRGenerator.i18n;
  function create(context) {
    const key='qr-generator.simple-mode.v1';
    let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
    if (context.initialAppearance) saved={...saved,...context.initialAppearance};
    let enabled=new URLSearchParams(location.search).get('simple')==='1'||saved.enabled===true;
    const appearance={shape:'square',finderShape:'square',color:'#000000',finderColor:'#000000'};
    const controls=new Map();
    const layout={above:[],below:[],headingsMovable:true,styles:{},labels:{},custom:{},ribbon:{enabled:false,rules:[]},qrAppearance:{appearance,logoData:''}};
    if(typeof saved.logoData==='string'&&saved.logoData.length<500000&&/^data:image\/png;base64,/.test(saved.logoData))layout.qrAppearance.logoData=saved.logoData;
    const section=document.getElementById('singleSection');
    const toggleLabel=document.createElement('label');toggleLabel.className='preview-switch simple-mode-switch';
    const toggle=document.createElement('input');toggle.type='checkbox';toggle.id='simpleModeToggle';toggle.setAttribute('role','switch');
    const toggleText=document.createElement('span');toggleLabel.append(toggle,toggleText);
    const title=document.querySelector('.page-title');
    const titleGroup=document.createElement('div');titleGroup.className='page-title-group';title.before(titleGroup);titleGroup.append(title,toggleLabel);
    const panel=document.createElement('section');panel.id='simpleQRTools';panel.className='simple-qr-tools';
    section.querySelector('.cart-panel').after(panel);
    const groupedNodes=[section.querySelector('.address-field'),section.querySelector('.cart-panel'),section.querySelector('.single-download'),document.getElementById('renderNotice'),document.getElementById('qrError')];
    const originalPositions=groupedNodes.map(node=>{const marker=document.createComment('single-code position');node.before(marker);return marker;});
    const fields=document.createElement('div');fields.className='appearance-fields';panel.append(fields);
    for(const [setting,sourceId,label] of [['shape','shapeSelect','QR-Code'],['color','colorPicker','Farbe des QR-Codes'],['finderShape','finderShapeSelect','Positionsmarkierungen'],['finderColor','finderColorPicker','Farbe der Positionsmarkierungen']]){
      const source=document.getElementById(sourceId),control=source.cloneNode(true);control.id='simple-'+setting;control.removeAttribute('aria-label');
      const wrapper=document.createElement('label');wrapper.dataset.label=label;wrapper.append(document.createTextNode(t(label)),control);fields.append(wrapper);
      if(control.tagName==='SELECT'){if([...control.options].some(option=>option.value===saved.appearance?.[setting]))appearance[setting]=saved.appearance[setting];}
      else if(/^#[0-9a-f]{6}$/i.test(saved.appearance?.[setting]||''))appearance[setting]=saved.appearance[setting];
      control.value=appearance[setting];controls.set(setting,{control,source});
      control.addEventListener('input',()=>{appearance[setting]=control.value;persist();context.refresh();});
    }
    const logos=document.createElement('div');logos.className='simple-logo-list';panel.append(logos);
    const reordering=window.QRGenerator.logos.createLogoReordering(logos,context.logos,context.saveLogoOrder,renderLogos);
    function persist(){try{localStorage.setItem(key,JSON.stringify({enabled,...layout.qrAppearance}));}catch{}}
    function renderLogos(){
      logos.replaceChildren();
      const upload=document.createElement('button');upload.type='button';upload.className='logo-add';upload.setAttribute('aria-label',t('Logo hochladen'));logos.append(upload);
      const file=document.createElement('input');file.type='file';file.accept='image/png,image/jpeg';file.multiple=true;file.hidden=true;logos.append(file);upload.addEventListener('click',()=>file.click());
      file.addEventListener('change',async()=>{const previous=context.logoData();await context.upload(file.files);if(context.logoData()!==previous){layout.qrAppearance.logoData=context.logoData();persist();}renderLogos();context.refresh();});
      for(const logo of [{name:t('Kein Logo'),data:''},...context.logos()]){
        const button=document.createElement('button');button.type='button';button.className='saved-logo-select';button.classList.toggle('empty-logo',!logo.data);button.title=logo.name;button.setAttribute('aria-label',logo.data?t('Logo auswählen: ')+logo.name:logo.name);button.setAttribute('aria-pressed',String(layout.qrAppearance.logoData===logo.data));
        if(logo.data){const image=document.createElement('img');image.src=logo.data;image.alt='';image.draggable=false;button.append(image);}
        button.addEventListener('click',()=>{layout.qrAppearance.logoData=logo.data;persist();renderLogos();context.refresh();});
        if(logo.data){const tile=document.createElement('div');tile.className='saved-logo';tile.draggable=true;tile.logoItem=logo;tile.append(button);
          const remove=document.createElement('button');remove.type='button';remove.className='saved-logo-delete';remove.textContent='×';
          remove.setAttribute('aria-label',t('Gespeichertes Logo löschen: ')+logo.name);
          remove.addEventListener('click',async()=>{
            if(!(await context.removeLogo(logo)))return;
            if(layout.qrAppearance.logoData===logo.data){layout.qrAppearance.logoData='';persist();}
            renderLogos();context.refresh();
          });
          tile.append(remove);reordering.bind(tile,button,logo);logos.append(tile);}else logos.append(button);
      }
    }
    function render(){
      section.classList.toggle('simple-mode',enabled);panel.hidden=!enabled;
      toggleText.textContent=t('Einfach');toggle.checked=enabled;
      document.body.classList.toggle('simple-mode-active',enabled);
      document.getElementById('editSingleTemplateBtn').disabled=enabled;
      if(enabled){
        if(groupedNodes[0].parentElement!==panel)panel.insertBefore(groupedNodes[0],fields);
        if(groupedNodes[1].parentElement!==panel)panel.insertBefore(groupedNodes[1],fields);
        for(const node of groupedNodes.slice(2))if(node.parentElement!==panel)panel.append(node);
      }else groupedNodes.forEach((node,index)=>{const marker=originalPositions[index];if(node.previousSibling!==marker)marker.after(node);});
      for(const label of fields.querySelectorAll('label'))label.firstChild.textContent=t(label.dataset.label);
      for(const {control,source} of controls.values())if(control.tagName==='SELECT') [...control.options].forEach((option,i)=>option.textContent=source.options[i].textContent);
      if(enabled)renderLogos();
    }
    toggle.addEventListener('change',()=>{enabled=toggle.checked;persist();render();if(enabled)context.activate();context.refresh();});
    render();return {get enabled(){return enabled;},layout,render,focus(){panel.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});controls.get('shape').control.focus({preventScroll:true});}};
  }
  window.QRGenerator['simple-mode']={create};
})();
