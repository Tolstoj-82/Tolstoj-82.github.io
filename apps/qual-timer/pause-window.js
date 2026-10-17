(()=>{
'use strict';
const screen=document.querySelector('.lcd'),time=document.querySelector('.time-field'),popup=document.getElementById('pauseStatus');
function place(){if(popup.hidden)return;const bounds=screen.getBoundingClientRect(),clock=time.getBoundingClientRect(),inset=10,gap=10;const above={top:inset,height:Math.max(0,clock.top-bounds.top-inset-gap)},below={top:clock.bottom-bounds.top+gap,height:Math.max(0,bounds.height-(clock.bottom-bounds.top)-gap-inset)};const region=below.height>=above.height?below:above;popup.style.width=Math.min(300,Math.max(100,screen.clientWidth-inset*2))+'px';const height=popup.offsetHeight,width=popup.offsetWidth;const scale=Math.min(1,region.height/Math.max(1,height));popup.style.left=(screen.clientWidth-width)/2+'px';popup.style.top=region.top+Math.max(0,(region.height-height*scale)/2)+'px';popup.style.transform='scale('+scale+')';popup.dataset.position=region===below?'screen-below-time':'screen-above-time'}
window.qualPlacePause=place;const observer=new ResizeObserver(place);observer.observe(screen);observer.observe(time);window.addEventListener('resize',place);place();
})();
