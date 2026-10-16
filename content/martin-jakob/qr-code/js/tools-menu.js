(() => {
  'use strict';
  const button=document.getElementById('toolsMenuButton');
  const menu=document.getElementById('toolsMenu');
  const items=[...menu.querySelectorAll('button')];
  function close(focus=false){menu.hidden=true;button.setAttribute('aria-expanded','false');if(focus)button.focus();}
  function open(){menu.hidden=false;button.setAttribute('aria-expanded','true');items[0].focus();}
  button.addEventListener('click',()=>menu.hidden?open():close());
  button.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open();if(event.key==='ArrowUp')items.at(-1).focus();}});
  menu.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close(true);}
    const index=items.indexOf(document.activeElement);
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();items[event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowDown'?1:items.length-1))%items.length].focus();}
  });
  menu.addEventListener('click',event=>{
    const item=event.target.closest('button');
    if(!item)return;
    close();
    if(item.id==='openQRReader'){
      try{window.QRGenerator['qr-reader'].open();}
      catch(error){
        console.error('Unable to open QR reader',error);
        window.QRGenerator.notifications.toast(window.QRGenerator.i18n.t('Der QR-Code-Leser konnte nicht geladen werden.'),'error');
      }
    }
  });
  document.addEventListener('click',event=>{if(!event.target.closest('.tools-menu'))close();});
  menu.parentElement.addEventListener('focusout',event=>{
    // During focusout activeElement can still be the body. Use the destination
    // instead, so moving focus between menu items cannot hide the clicked item.
    if(event.relatedTarget&& !menu.parentElement.contains(event.relatedTarget))close();
  });
})();
