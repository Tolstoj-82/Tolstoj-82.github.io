(()=>{
'use strict';
const toast=document.createElement('aside');toast.className='site-toast';toast.hidden=true;toast.setAttribute('aria-label','Notification');const message=document.createElement('span');message.setAttribute('role','status');const actions=document.createElement('div');actions.className='toast-actions';const undo=document.createElement('button');undo.type='button';undo.textContent='Undo';const shortcut=document.createElement('span');shortcut.textContent=/Mac|iPhone|iPad/.test(navigator.platform)?'⌘Z':'Ctrl+Z';actions.append(undo,shortcut);const progress=document.createElement('div');progress.className='toast-progress';progress.setAttribute('aria-hidden','true');toast.append(message,actions,progress);document.body.append(toast);let timeout=null;
const overlaps=(a,b)=>a.left<b.right+10&&a.right>b.left-10&&a.top<b.bottom+10&&a.bottom>b.top-10;
function hide(){clearTimeout(timeout);timeout=null;toast.hidden=true}
function fits(){const rect=toast.getBoundingClientRect();if(rect.left<8||rect.top<8||document.querySelector('dialog[open]'))return false;return ![...document.querySelectorAll('#timerFrame,.score-editor')].some(node=>!node.hidden&&node.getClientRects().length&&overlaps(rect,node.getBoundingClientRect()))}
function check(){if(!toast.hidden&&!fits())hide()}
window.qualToast={show(text,onUndo){hide();message.textContent=window.qualI18n?.t(text)||text;actions.hidden=!onUndo;undo.onclick=()=>{hide();onUndo?.()};toast.hidden=false;if(!fits()){hide();return}progress.style.animation='none';void progress.offsetWidth;progress.style.animation='toast-countdown 6s linear forwards';timeout=setTimeout(hide,6000)},hide};
window.addEventListener('resize',check);window.addEventListener('scroll',check,{passive:true});new ResizeObserver(check).observe(document.getElementById('timerFrame'));new MutationObserver(check).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open','style']});
})();
