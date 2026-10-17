(() => {
  'use strict';
  const {t} = window.QRGenerator.i18n;
  function initialize() {
    const preview = document.querySelector('#layoutDialog .template-qr-preview');
    const home = document.getElementById('cartAppearanceHome');
    const below = document.getElementById('layoutBelow');
    const stage = document.createElement('div');stage.className='cart-qr-stage';
    preview.before(stage);stage.append(preview);
    const pane=document.createElement('div');pane.className='cart-qr-settings-pane';pane.id='cartQRSideSettings';
    stage.append(pane);
    const cog=document.createElement('button');cog.type='button';cog.className='cart-view-toggle cart-qr-cog';
    cog.setAttribute('aria-controls',pane.id);
    cog.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 2-.5 3-2 .9L5 4.5 2.5 9l2.5 1.5v3L2.5 15 5 19.5l2.5-1.4 2 .9.5 3h4l.5-3 2-.9 2.5 1.4 2.5-4.5-2.5-1.5v-3L21.5 9 19 4.5l-2.5 1.4-2-.9L14 2Z"/><circle cx="12" cy="12" r="3"/></svg>';
    preview.append(cog);
    const close=document.createElement('button');close.type='button';close.className='modal-close cart-qr-close';
    close.textContent='×';pane.append(close);
    const host=document.getElementById('cartAppearance');
    const details=document.getElementById('cartQROptions');
    const templateControls=[host.querySelector('label[for="cartQRTemplate"]'),document.getElementById('cartQRTemplate'),document.getElementById('qrPresetSaveControls')];
    const templateBlock=document.createElement('div');templateBlock.className='cart-qr-template-below';preview.append(templateBlock);
    const dialog=document.getElementById('layoutDialog');
    const desktop=matchMedia('(min-width: 761px)');let expanded=false;
    function render(){
      stage.classList.toggle('settings-open',desktop.matches&&expanded);
      cog.hidden=!desktop.matches||expanded;
      cog.setAttribute('aria-expanded',String(expanded));
      cog.title=t('QR-Code-Einstellungen');cog.setAttribute('aria-label',cog.title);
      close.setAttribute('aria-label',t('Schliessen'));
      pane.inert=!desktop.matches||!expanded;
      const separate=desktop.matches&&dialog.open&&home.contains(host);
      templateBlock.hidden=!separate;
      for(const control of templateControls){
        if(control.id==='qrPresetSaveControls'&&!host.contains(control)&&!templateBlock.contains(control))continue;
        if(separate){if(control.parentElement!==templateBlock)templateBlock.append(control);}
        else if(control.parentElement!==host)host.insertBefore(control,details);
      }
      if(desktop.matches){if(home.parentElement!==pane)pane.append(home);}
      else if(home.previousElementSibling!==below)below.after(home);
    }
    function open(){expanded=true;details.open=true;render();}
    cog.addEventListener('click',open);
    document.getElementById('layoutDialog').addEventListener('show-qr-settings',open);
    close.addEventListener('click',()=>{expanded=false;render();cog.focus();});
    desktop.addEventListener('change',render);
    new MutationObserver(render).observe(dialog,{attributes:true,attributeFilter:['open']});
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    render();return {open,reset(){expanded=false;render();}};
  }
  window.QRGenerator['cart-dock']={initialize};
})();
