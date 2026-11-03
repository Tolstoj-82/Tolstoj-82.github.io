'use strict';
const C=TetrisCore,$=id=>document.getElementById(id);
function readOnly(value){if(value&&typeof value==='object'){Object.values(value).forEach(readOnly);Object.freeze(value);}return value;}
// The library is loaded from files only. Drafts exist only in memory until exported.
const situationKeys=new WeakMap();
const loadErrors=[...(globalThis.TetrisSituationErrors||[])];
const studies=(globalThis.TetrisSituations?.situations||[]).flatMap(raw=>{try{const situation=readOnly(C.normalize(raw));const entry=Object.entries(globalThis.TetrisSituationFiles||{}).find(([,value])=>value===raw);situationKeys.set(situation,entry?.[0]||raw.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));return[situation];}catch(error){loadErrors.push((raw?.title||'Unnamed situation')+': '+error.message);return[];}});
if(!studies.length)studies.push(readOnly(C.normalize({title:'No valid situations',frames:[{}]})));
// Keep the lesson, menu and sequential navigation ordered by well width.
const burnSlots=studies.flatMap((s,n)=>s.doubleWell?[n]:[]),orderedBurns=burnSlots.map(n=>studies[n]).sort((a,b)=>a.doubleWell.width-b.doubleWell.width||C.TYPES.indexOf(a.doubleWell.target.type)-C.TYPES.indexOf(b.doubleWell.target.type)||a.doubleWell.target.rotation-b.doubleWell.target.rotation);burnSlots.forEach((slot,n)=>studies[slot]=orderedBurns[n]);
let draft=null,watchIndex=0,draftIndex=0,clearPreview=false;
let selected=Math.max(0,studies.findIndex(s=>s.chapter==='Openers'&&s.adjustment.adjusted.type==='L'&&s.adjustment.next.type==='L'&&!s.title.includes('alternate'))),index=0,editing=false,playing=false,brush='T',mode='mino',rotation=0,painting=false,lastCell='',lastTime=0,elapsed=0,toastTimer;
function situationKey(s){return situationKeys.get(s)||s.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
let revealUrlSelection=false;
function restoreSelection(){try{const requested=new URL(location.href).searchParams.get('situation'),match=studies.findIndex(s=>situationKey(s)===requested);if(match>=0){selected=match;revealUrlSelection=true;}}catch{}}
function updateSelectionUrl(){try{const url=new URL(location.href);url.searchParams.delete('lesson');url.searchParams.delete('practice');url.searchParams.delete('play');url.searchParams.delete('next');url.searchParams.set('situation',situationKey(studies[selected]));history.replaceState(history.state,'',url.href);}catch{}}
restoreSelection();
let lessonVariant=null;try{const next=new URL(location.href).searchParams.get('next');if(studies[selected].adjustment?.alternatives?.some(a=>a.type===next)){lessonVariant=readOnly(C.normalize(TetrisCourse.variant(studies[selected],next)));situationKeys.set(lessonVariant,situationKey(studies[selected]));}}catch{}
const cleanStudies=new WeakMap();
function cleanStudy(s){if(cleanStudies.has(s))return cleanStudies.get(s);const clean=s.doubleWell?TetrisDoubleWell.clean(s):s.tuck?TetrisCourse.cleanTuck(s):TetrisCourse.cleanMotion(s);cleanStudies.set(s,clean);return clean;}
const openerViews=new WeakMap();
function isOpenerPreview(){return !editing&&((lessonVariant||studies[selected]).chapter==='Openers'||!!(lessonVariant||studies[selected]).accommodation);}
function openerPreview(s){if(!openerViews.has(s)){const view=readOnly({...s,frames:[s.accommodation?{...s.frames[0],accommodationPulse:true}:s.frames[0]]});situationKeys.set(view,situationKey(s));openerViews.set(s,view);}return openerViews.get(s);}
function openerOrder(){return studies.map((s,n)=>({s,n})).filter(({s})=>studies[selected].accommodation?!!s.accommodation:s.chapter==='Openers').sort((a,b)=>C.TYPES.indexOf(a.s.accommodation?.target.type||a.s.adjustment.adjusted.type)-C.TYPES.indexOf(b.s.accommodation?.target.type||b.s.adjustment.adjusted.type)||(a.s.accommodation?a.s.accommodation.orientation-b.s.accommodation.orientation:C.TYPES.indexOf(a.s.adjustment.next.type)-C.TYPES.indexOf(b.s.adjustment.next.type))).map(({n})=>n);}
function navigateOpener(delta){const order=openerOrder(),position=order.indexOf(selected),target=order[position+delta];if(target===undefined)return;libraryCards[target].onclick();TetrisCourse.revealGroup(studies[target].accommodation?'Accommodation stacking':studies[target].adjustment.adjusted.type+' first');}
function navigateSituation(delta){const target=selected+delta;if(target>=0&&target<studies.length)libraryCards[target].onclick();}
const current=()=>{if(editing)return draft;const s=lessonVariant||studies[selected];return (s.chapter==='Openers'||s.accommodation)?openerPreview(s):$('cleanPlayback').checked?cleanStudy(s):s;},frame=()=>current().frames[index];
const blankDraft=()=>C.normalize({title:'Untitled situation',description:'',height:18,frames:[{board:[],caption:'',ticks:60}]});
function notice(message){$('status').textContent=message;$('status').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('status').hidden=true,6000);}
const shades=['#a6b779','#829560','#536c3e','#26351e'];
function drawRomTile(ctx,id,x,y,size=8,palette=shades){const pattern=C.ROM.tiles[id];for(let py=0;py<8;py++)for(let px=0;px<8;px++){ctx.fillStyle=palette[+pattern[py][px]];ctx.fillRect(x+px*size/8,y+py*size/8,size/8,size/8);}}
function drawTile(ctx,type,x,y,size=8){drawRomTile(ctx,type==='.'?C.ROM.emptyId:C.ROM.minoIds[type],x,y,size);}
function drawActiveOverlay(ctx,f,height){
 if(!f.active||f.highlight===false)return;
 const a=f.active,originX=8+a.x*8,originY=(18-height+a.y)*8;
 ctx.save();
 ctx.globalAlpha=.36;ctx.fillStyle='#e04444';
 for(const[dx,dy]of C.cells(a.type,a.rotation))ctx.fillRect(originX+dx*8,originY+dy*8,8,8);
 ctx.globalAlpha=1;
 const pivot=C.pivotCell(a);
 if(pivot){
  const x=originX+pivot[0]*8+4,y=originY+pivot[1]*8+4;
  ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=1.6;ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.strokeStyle='#243257';ctx.lineWidth=.65;ctx.stroke();
 }
 ctx.restore();
}
function drawGrid(canvas,board,height,f,animationTicks=0){
 f=C.frameAt(f,animationTicks);
 canvas.width=96;canvas.height=144;canvas.style.height='auto';const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const offset=8;
 C.ROM.aTypeMap.forEach((id,i)=>{const x=(i%20)*8-offset,y=Math.floor(i/20)*8;if(x>=0&&x<canvas.width)drawRomTile(ctx,id,x,y);});
 const tiles=f.captureTiles||C.displayTiles(f,height,animationTicks);
 tiles.forEach((row,y)=>row.forEach((id,x)=>drawRomTile(ctx,id,16-offset+x*8,(18-height+y)*8)));
  if(f.placementHint){
   const hint=f.placementHint,shape=C.cells(hint.type,hint.rotation),sprites=C.pieceLayout(hint.type,hint.rotation),blue=['#dce9fa','#9ab9df','#477cb9','#244b7b'],active=new Set(f.active?C.cells(f.active.type,f.active.rotation).map(([dx,dy])=>[f.active.x+dx,f.active.y+dy].join(',')):[]);
   const visible=(x,y)=>y>=0&&y<height&&board[y]?.[x]==='.'&&!active.has([x,y].join(','));
   ctx.save();ctx.globalAlpha=.75;
   if(hint.type==='I'){
    const xs=shape.map(([dx])=>hint.x+dx),ys=shape.map(([,dy])=>hint.y+dy),left=Math.min(...xs),top=Math.min(...ys),w=(Math.max(...xs)-left+1)*8,h=(Math.max(...ys)-top+1)*8,px=8+left*8,py=(18-height+top)*8;
    ctx.fillStyle='#477cb9';
    if(shape.every(([dx,dy])=>visible(hint.x+dx,hint.y+dy))){ctx.fillRect(px,py,w,1);ctx.fillRect(px,py+h-1,w,1);ctx.fillRect(px,py+1,1,h-2);ctx.fillRect(px+w-1,py+1,1,h-2);}
    else for(let y=0;y<h;y++)for(let x=0;x<w;x++)if((x===0||x===w-1||y===0||y===h-1)&&visible(left+Math.floor(x/8),top+Math.floor(y/8)))ctx.fillRect(px+x,py+y,1,1);
   }else for(const[i,[dx,dy]]of shape.entries()){const x=hint.x+dx,y=hint.y+dy;if(visible(x,y))drawRomTile(ctx,sprites[i][2],8+x*8,(18-height+y)*8,8,blue);}
   ctx.restore();
  }
   if(f.motif){
   const stack=C.compose({...f,active:undefined},height);ctx.save();ctx.globalAlpha=.55;ctx.fillStyle=f.motif.color||'#e7a52b';
   for(const[x,y]of f.motif.cells)if(stack[y]?.[x]&&(f.motif.space||stack[y][x]!=='.')){const mandatory=f.motif.mandatory?.some(p=>p[0]===x&&p[1]===y);ctx.globalAlpha=mandatory?.8:.55;ctx.fillStyle=mandatory?'#fff39a':f.motif.color||'#e7a52b';ctx.fillRect(8+x*8,(18-height+y)*8,8,8);}
   ctx.restore();
  }
  if(f.counterMotif){ctx.save();ctx.globalAlpha=.55;ctx.fillStyle='#9271cf';for(const[x,y]of f.counterMotif.cells)ctx.fillRect(8+x*8,(18-height+y)*8,8,8);ctx.restore();}
  drawActiveOverlay(ctx,f,height);TetrisCourse.annotations(ctx,f,height);
  if(f.trigger&&f.active){
   const p=C.pivotCell(f.active),px=8+(f.active.x+p[0])*8,py=(18-height+f.active.y+p[1])*8,hx=8+f.trigger.hole[0]*8,hy=(18-height+f.trigger.hole[1])*8;
   ctx.save();ctx.fillStyle='#f1ac24';
   const targets=f.active.type==='I'?[-1,0,1,2].map(dx=>[px+dx*8,py]):[[px,py],[hx,hy]];
   if(f.active.type!=='I')ctx.fillRect(px+4,py+3.5,hx-px,1);
   for(const[x,y]of targets){ctx.fillRect(x,y,8,1);ctx.fillRect(x,y+7,8,1);ctx.fillRect(x,y,1,8);ctx.fillRect(x+7,y,1,8);}
   ctx.restore();
  }

 if(f.vhsRewind){const p=f.vhsRewind.progress;ctx.save();for(let y=1;y<144;y+=3){ctx.globalAlpha=.13;ctx.fillStyle='#172033';ctx.fillRect(8,y,80,1);}for(let n=0;n<4;n++){const y=Math.floor((p*311+n*37)%144);ctx.globalAlpha=.18;ctx.fillStyle='#f8fafc';ctx.fillRect(8,y,80,2);ctx.globalAlpha=.28;ctx.fillStyle='#475569';ctx.fillRect(8+((n*13+Math.floor(p*77))%55),y+2,25,1);}ctx.restore();}

}
let situationMenuOpen=false;
function setSituationMenu(open){situationMenuOpen=open;document.body.classList.toggle('situations-open',open);$('situationMenuToggle').setAttribute('aria-expanded',String(open));$('menuBackdrop').hidden=!open;}
function closeSituationMenu(){if(!situationMenuOpen)return;setSituationMenu(false);$('situationMenuToggle').focus?.();}
$('situationMenuToggle').onclick=()=>setSituationMenu(!situationMenuOpen);
$('closeSituationMenu').onclick=closeSituationMenu;$('menuBackdrop').onclick=closeSituationMenu;
let menuGesture=null;
document.addEventListener('touchstart',e=>{if(e.touches.length!==1){menuGesture=null;return;}const t=e.touches[0],width=globalThis.innerWidth||0;menuGesture=width<1000&&(situationMenuOpen||t.clientX>width-40)?{x:t.clientX,y:t.clientY,open:situationMenuOpen}:null;},{passive:true});
document.addEventListener('touchend',e=>{if(!menuGesture)return;const t=e.changedTouches[0],g=menuGesture;menuGesture=null;if(!t)return;const dx=t.clientX-g.x,dy=t.clientY-g.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4){if(!g.open&&dx<0)setSituationMenu(true);else if(g.open&&dx>0)closeSituationMenu();}},{passive:true});
document.addEventListener('touchcancel',()=>{menuGesture=null;},{passive:true});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSituationMenu();});
document.addEventListener('click',event=>{if(situationMenuOpen&&!$('situationMenuPanel').contains(event.target)&&!$('situationMenuToggle').contains(event.target))closeSituationMenu();});
let librarySnapshot=[],libraryCards=[];
function buildLibrary(){if(librarySnapshot.length===studies.length&&studies.every((s,n)=>s===librarySnapshot[n])){libraryCards.forEach((card,n)=>{card.className='study-card'+(!editing&&n===selected?' selected':'');card.setAttribute('aria-pressed',!editing&&n===selected);});return;}librarySnapshot=studies.slice();libraryCards=[];const list=$('situationList'),openGroups=new Set(),groups=new Map();
function remember(node){for(const child of node.children){if(child.open)openGroups.add(child.dataset.group);remember(child);}}remember(list);list.replaceChildren();
const categories=new Map();for(const label of ['Openers','Introduction','Clean stacking','Save stacking','Tucks','Spins','Spucks','Adjustments']){const category=document.createElement('details');category.className='spin-group situation-category';category.dataset.group=label;category.open=openGroups.has(label);const heading=document.createElement('summary');heading.textContent=label;category.append(heading);categories.set(label,category);list.append(category);}
TetrisCourse.navigation(categories);$('libraryCount').textContent=String(studies.length).padStart(2,'0');studies.forEach((s,n)=>{const card=document.createElement('button');card.className='study-card'+(!editing&&n===selected?' selected':'');card.setAttribute('aria-pressed',!editing&&n===selected);libraryCards.push(card);const copy=document.createElement('div');copy.className='card-copy';const title=document.createElement('h3');title.textContent=s.title;TetrisNotation.format(title);if(s.title.includes('(Ori:'))title.title='The name in brackets is the original NES name; the Game Boy situation is mirrored.';const desc=document.createElement('p');desc.hidden=true;const meta=document.createElement('small');meta.textContent=`${s.frames.length} steps: ${(s.frames.reduce((sum,f)=>sum+f.ticks,0)/C.HZ).toFixed(1)} s`;copy.append(title);card.append(copy);card.onclick=()=>{lessonVariant=null;TetrisCourse.leaveIntro();if(globalThis.liveAttempt?.isOpen())globalThis.liveAttempt.leave();$('stackEditor').hidden=true;closeSituationMenu();stop();selected=n;updateSelectionUrl();watchIndex=0;elapsed=0;if(editing)setEditing(false);else{index=0;render(true);}};const firstType=s.adjustment?.adjusted.type||s.frames.find(f=>f.active)?.active.type,secondType=s.adjustment?.next.type;card.dataset.wellWidth=String(s.doubleWell?.width||0);card.dataset.chapter=s.chapter||'';card.dataset.pieceRank=String(C.TYPES.indexOf(firstType));card.dataset.nextRank=String(secondType?C.TYPES.indexOf(secondType):99);const isStacking=s.chapter==='Clean stacking'||s.chapter==='Save stacking',isTuck=s.chapter==='Tucks',isOpener=s.chapter==='Openers',isAdjustment=s.chapter==='Adjustments',isSpuck=situationKey(s).includes('-spuck-')||situationKey(s).startsWith('jd-spin-'),family=situationKey(s).split('-spin')[0],label=isStacking?s.section:isTuck?(firstType+'-Tucks'):isOpener?(s.adjustment.adjusted.type+' first'):isAdjustment?(s.section||'Good'):situationKey(s).startsWith('jd-spin-')?'JD spins':isSpuck?(situationKey(s).split('-')[0].toUpperCase()+'-Spucks'):({t:'T-Spins',z:'Z-Spins',s:'S-Spins',i:'I-Spins',j:'J-Spins',l:'L-Spins',jd:'JD spin'})[family]||'Other spins';
const categoryLabel=isStacking?s.chapter:isTuck?'Tucks':isOpener?'Openers':isAdjustment?'Adjustments':isSpuck?'Spucks':'Spins';let group=groups.get(label);if(!group){group=document.createElement('details');group.className='spin-group';group.dataset.group=label;group.dataset.pieceRank=card.dataset.pieceRank;group.open=openGroups.has(label);const heading=document.createElement('summary');heading.textContent=label;group.append(heading);groups.set(label,group);categories.get(categoryLabel).append(group);}group.append(card);if(revealUrlSelection&&n===selected){group.open=true;categories.get(categoryLabel).open=true;}});for(const [label,category]of categories){if(label==='Introduction')continue;const heading=category.children[0],sections=Array.from(category.children).slice(1);for(const group of sections){const summary=group.children[0],cards=Array.from(group.children).slice(1);cards.sort((a,b)=>Number(a.dataset.wellWidth)-Number(b.dataset.wellWidth)||Number(a.dataset.pieceRank)-Number(b.dataset.pieceRank)||Number(a.dataset.nextRank)-Number(b.dataset.nextRank));group.replaceChildren(summary,...cards);}if(label!=='Adjustments')sections.sort((a,b)=>Number(a.dataset.pieceRank)-Number(b.dataset.pieceRank));category.replaceChildren(heading,...sections);}TetrisCourse.resources(categories);TetrisCourse.arrangeChapters(categories,openGroups);revealUrlSelection=false;}
function showInputs(f){$('inputChoice').hidden=!(f.buttonOptions?.length>1);document.querySelectorAll('[data-key]').forEach(b=>b.classList.toggle('lit',f.buttons.includes(b.dataset.key)));$('inputDisplay').setAttribute('aria-label','Game Boy inputs: '+(f.buttons.filter(key=>key!=='Start'&&key!=='Select').join(', ')||'none'));}
let referenceSituation=null,referenceKey=null;
function conceptImage(canvas,key,s){
 canvas.width=48;canvas.height=36;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const first=s.frames.find(f=>f.active),before=s.frames.find(f=>f.reveal==='rotation')||first,after=s.frames.find(f=>f.reveal==='spin'&&f.active)||s.frames.find(f=>f.reveal==='input')||first;
 function outline(x,y,size,color){ctx.fillStyle=color;ctx.fillRect(x,y,size,1);ctx.fillRect(x,y+size-1,size,1);ctx.fillRect(x,y,1,size);ctx.fillRect(x+size-1,y,1,size);}
 if(key==='input'){
  const options=s.frames.find(f=>f.buttonOptions)?.buttonOptions;
  const glyphs={A:['01110','11011','11011','11111','11011','11011','11011'],B:['11110','11011','11011','11110','11011','11011','11110']};
  function button(letter,cx,cy,r,scale){for(let y=0;y<36;y++)for(let x=0;x<48;x++){const d=Math.hypot(x-cx,y-cy);if(d<r){ctx.fillStyle=d>r-2?'#631735':'#92315c';ctx.fillRect(x,y,1,1);}}ctx.fillStyle='#fff';glyphs[letter].forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')ctx.fillRect(cx-2.5*scale+x*scale,cy-3.5*scale+y*scale,scale,scale);}));}
  if(options?.length===2){button(options[0],10,18,9,1);button(options[1],38,18,9,1);ctx.fillStyle='#334155';for(const[g,x0]of [[['111','101','101','101','111'],21],[['110','101','110','101','101'],25]])g.forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')ctx.fillRect(x0+x,16+y,1,1);}));}
  else button(options?.[0]||s.frames.find(f=>f.trigger)?.trigger.button||'A',23.5,17.5,13,2);
  return;
 }
 if(['piece','before','after'].includes(key)){
  const a=(key==='before'?before:key==='after'?after:first)?.active;if(!a)return;
  const shape=C.cells(a.type,a.rotation),minX=Math.min(...shape.map(p=>p[0])),minY=Math.min(...shape.map(p=>p[1])),w=Math.max(...shape.map(p=>p[0]))-minX+1,h=Math.max(...shape.map(p=>p[1]))-minY+1,size=8;
  C.pieceLayout(a.type,a.rotation).forEach((p,i)=>drawRomTile(ctx,p[2],(48-w*size)/2+(shape[i][0]-minX)*size,(36-h*size)/2+(shape[i][1]-minY)*size,size));return;
 }
 const f=s.frames.find(f=>key==='motif'?f.motif:key==='counter'?f.counterMotif:f.trigger);if(!f)return;
 if(key==='trigger'&&(f.active.type!=='T'||(situationKey(s).includes('-spuck-')||situationKey(s).startsWith('jd-spin-')))){
  const a=f.active,p=C.pivotCell(a),piece=C.cells(a.type,a.rotation).map(([x,y])=>[x+a.x,y+a.y]),motif=s.frames.find(f=>f.motif)?.motif.cells||[],all=piece.concat(motif),stack=C.compose({...f,active:undefined},s.height);
  const minX=Math.min(...all.map(p=>p[0])),minY=Math.min(...all.map(p=>p[1])),w=Math.max(...all.map(p=>p[0]))-minX+1,h=Math.max(...all.map(p=>p[1]))-minY+1;
  const originX=(48-w*8)/2,originY=(36-h*8)/2,xy=([x,y])=>[originX+(x-minX)*8,originY+(y-minY)*8];
  const surrounding=new Map();for(const[x,y]of motif)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const type=stack[y+dy]?.[x+dx];if(type&&type!=='.')surrounding.set([x+dx,y+dy].join(','),[x+dx,y+dy]);}
  for(const[x,y]of surrounding.values()){const[dx,dy]=xy([x,y]);drawRomTile(ctx,C.ROM.minoIds[stack[y][x]],dx,dy,8);}
  ctx.fillStyle='#e04444';for(const cell of piece){const[x,y]=xy(cell);ctx.fillRect(x,y,8,8);}
  const[px,py]=xy([a.x+p[0],a.y+p[1]]),[hx,hy]=xy(f.trigger.hole),left=Math.min(px,hx),right=Math.max(px,hx)+8;ctx.fillStyle='#243257';
  if(a.type==='I'){
   ctx.fillStyle='#f1ac24';for(const dx of [-1,0,1,2]){const x=px+dx*8;ctx.fillRect(x,py,8,1);ctx.fillRect(x,py+7,8,1);ctx.fillRect(x,py,1,8);ctx.fillRect(x+7,py,1,8);}return;
  }
  ctx.fillRect(left-1,py-1,right-left+2,1);ctx.fillRect(left-1,py+8,right-left+2,1);ctx.fillRect(left-1,py-1,1,10);ctx.fillRect(right,py-1,1,10);
  for(const[x,y]of [[px,py],[hx,hy]]){ctx.beginPath();ctx.arc(x+4,y+4,1.8,0,Math.PI*2);ctx.strokeStyle=x===px?'#fff':'#243257';ctx.lineWidth=1;ctx.stroke();}return;
 }
 if(key==='trigger'){
  // Upright T and reverse C share the board diagrams' eight-pixel mino scale.
  const size=8,ox=8,oy=6,flip=f.trigger.hole[0]<f.active.x+C.pivotCell(f.active)[0],column=x=>flip?3-x:x;
  ctx.fillStyle='#e04444';for(const[x,y]of [[1,0],[0,1],[1,1],[1,2]])ctx.fillRect(ox+column(x)*size,oy+y*size,size,size);
  const stack=C.compose({...f,active:undefined},s.height);
  for(const[x,y]of [[2,0],[3,0],[3,1],[2,2],[3,2]]){
   const worldX=f.active.x+column(x)-(flip?1:0),type=stack[f.active.y+y]?.[worldX]||'L';
   drawRomTile(ctx,C.ROM.minoIds[type]??C.ROM.minoIds.L,ox+column(x)*size,oy+y*size,size);
  }
  // One frame around the pivot and matching hole marks them as a pair.
  const px=ox+size,py=oy+size,hx=px+size;ctx.fillStyle='#243257';
  ctx.fillRect(px-1,py-1,18,1);ctx.fillRect(px-1,py+8,18,1);ctx.fillRect(px-1,py-1,1,10);ctx.fillRect(hx+8,py-1,1,10);ctx.fillRect(hx,py,1,8);
  ctx.beginPath();ctx.arc((flip?hx:px)+4,py+4,1.8,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();ctx.arc((flip?px:hx)+4,py+4,1.8,0,Math.PI*2);ctx.strokeStyle='#243257';ctx.lineWidth=1;ctx.stroke();return;
 }

 const cells=(key==='motif'?f.motif:f.counterMotif).cells,board=C.compose({...f,active:undefined},s.height),minX=Math.min(...cells.map(p=>p[0])),minY=Math.min(...cells.map(p=>p[1])),w=Math.max(...cells.map(p=>p[0]))-minX+1,h=Math.max(...cells.map(p=>p[1]))-minY+1,size=8;
 if(key==='counter'||f.motif?.space){
  const isCounter=key==='counter',mask=new Set(cells.map(p=>p.join(',')));
  for(const[x,y]of cells){const dx=(48-w*size)/2+(x-minX)*size,dy=(36-h*size)/2+(y-minY)*size;ctx.fillStyle=isCounter?'#a48bce':'#e7a52b';ctx.fillRect(dx,dy,size,size);}
  ctx.fillStyle=isCounter?'#7652b1':'#b07b15';for(const[x,y]of cells){const dx=(48-w*size)/2+(x-minX)*size,dy=(36-h*size)/2+(y-minY)*size;
   if(!mask.has([x,y-1].join(',')))ctx.fillRect(dx,dy,size,1);
   if(!mask.has([x,y+1].join(',')))ctx.fillRect(dx,dy+size-1,size,1);
   if(!mask.has([x-1,y].join(',')))ctx.fillRect(dx,dy,1,size);
   if(!mask.has([x+1,y].join(',')))ctx.fillRect(dx+size-1,dy,1,size);
  }return;
 }
 for(const[x,y]of cells){const dx=(48-w*size)/2+(x-minX)*size,dy=(36-h*size)/2+(y-minY)*size;
  drawRomTile(ctx,key==='motif'?C.ROM.minoIds[board[y][x]]:C.ROM.emptyId,dx,dy,size);
  const mandatory=f.motif?.mandatory?.some(p=>p[0]===x&&p[1]===y);ctx.save();ctx.globalAlpha=mandatory?.8:.4;ctx.fillStyle=mandatory?'#fff39a':key==='motif'?'#e7a52b':'#9271cf';ctx.fillRect(dx,dy,size,size);ctx.restore();if(key==='counter')outline(dx,dy,size,'#7652b1');
 }
}
function renderConcepts(){
 const lesson=current();$('spinConcepts').classList.toggle('adjustment-concepts',!!lesson.adjustment||!!lesson.tuck||!!lesson.accommodation);
 if(lesson.doubleWell){referenceSituation=null;TetrisDoubleWell.reference(lesson);return;}
 if(lesson.accommodation){referenceSituation=null;TetrisCourse.accommodationReference(lesson);return;}
 if(lesson.tuck){referenceSituation=null;TetrisCourse.tuckReference(lesson);return;}
 if(lesson.adjustment){referenceSituation=null;TetrisCourse.reference(lesson,index);return;}
 const s=current(),introduced=new Set(s.frames.slice(0,index+1).map(f=>f.reveal)),key=[...introduced].sort().join(',');
 if(!editing&&referenceSituation===s&&referenceKey===key)return;referenceSituation=s;referenceKey=key;
 const reveals={piece:'piece',motif:'match',counter:'counter',before:'rotation',trigger:'trigger',input:'input',after:'spin'};
 const labels=[['piece','The piece'],['motif','The motif'],['counter','… and counter-motif'],['before','The initial orientation'],['trigger','The trigger'],['input','The button input'],['after','The orientation after the spin']];
 $('spinConcepts').replaceChildren();
 for(const[key,label]of labels){const row=document.createElement('li'),text=document.createElement('span'),canvas=document.createElement('canvas');text.textContent=label;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label);if(introduced.has(reveals[key]))conceptImage(canvas,key,s);else{canvas.width=48;canvas.height=36;canvas.hidden=true;}row.append(text,canvas);$('spinConcepts').append(row);}
}
function stepLabel(){const s=current(),f=frame();return f.example?'Example '+String(f.example).padStart(2,'0')+' / '+String(s.frames.filter(f=>f.example).length).padStart(2,'0'):'Step '+(f.step||String(index+1).padStart(2,'0'))+' / '+(s.frames.some(f=>f.step)?Math.max(...s.frames.filter(f=>f.step).map(f=>parseInt(f.step,10))):String(s.frames.filter(f=>!f.example).length).padStart(2,'0'));}
function render(full=false){document.body.classList.toggle('opener-preview-mode',isOpenerPreview());$('leaveAttempt').textContent=isOpenerPreview()?'Back to opener':'Back to steps';renderConcepts();TetrisCourse.supplement(current(),frame(),elapsed);const s=current(),f=frame();$('startAttempt').hidden=s.doubleWell?.role==='counterexample';$('studyIndex').textContent=`STUDY ${String(selected+1).padStart(2,'0')} / ${String(studies.length).padStart(2,'0')}`;$('studyTitle').textContent=s.title;TetrisNotation.format($('studyTitle'));if(s.chapter==='Openers'){const pair=s.title.match(/^([LJIOZST])( → )([LJIOZST])(.*)$/);if(pair){const colors=s.frames[0].placementColors||['#e04444','#35a35c'];const parts=[pair[1],pair[2],pair[3],pair[4]].map((value,n)=>{const span=document.createElement('span');span.textContent=value;if(n===0||n===2){span.className=n===0?'opener-first-piece':'opener-second-piece';span.style.color=colors[n===0?0:1];}return span;});$('studyTitle').replaceChildren(...parts);}}$('studyTitle').title=s.title.includes('(Ori:')?'The name in brackets is the original NES name; the Game Boy situation is mirrored.':'';$('studyDescription').textContent=s.description;$('heightBadge').textContent=s.height;drawGrid($('board'),C.compose(f,s.height),s.height,f,elapsed);TetrisStackQuality.track(C.compose({...f,active:undefined},s.height),{well:s.qualityWell??null});showInputs(C.frameAt(f,elapsed));$('scrubber').max=s.frames.length-1;$('scrubber').value=index;$('scrubber').disabled=s.frames.length===1;$('scrubber').setAttribute('aria-valuetext',stepLabel());$('frameMarks').replaceChildren();s.frames.forEach((f,n)=>{const mark=document.createElement('span');mark.style.left=(s.frames.length===1?0:n/(s.frames.length-1)*100)+'%';mark.className=n===index?'current':'';$('frameMarks').append(mark);});$('frameCounter').textContent=stepLabel();$('frameCaption').textContent=C.frameAt(f,elapsed).caption;TetrisNotation.format($('frameCaption'));const ticks=s.frames.reduce((sum,f)=>sum+f.ticks,0),position=s.frames.slice(0,index).reduce((sum,f)=>sum+f.ticks,0);$('timeCounter').textContent=`${(position/C.HZ).toFixed(2)} / ${(ticks/C.HZ).toFixed(2)} s`;const opener=isOpenerPreview(),order=opener?openerOrder():[],openerPosition=order.indexOf(selected);$('randomOpeners').hidden=!(s.chapter==='Openers'&&openerPosition===order.length-1);$('previous').disabled=opener?openerPosition<=0:$('cleanPlayback').checked?selected===0:index===0;$('next').disabled=opener?openerPosition===order.length-1:$('cleanPlayback').checked?selected===studies.length-1:index===s.frames.length-1;$('previous').setAttribute('aria-label',opener?'Previous opener':$('cleanPlayback').checked?'Previous situation':'Previous step');$('next').setAttribute('aria-label',opener?'Next opener':$('cleanPlayback').checked?'Next situation':'Next step');$('play').setAttribute('aria-label',opener?'Try yourself':playing?'Pause':'Play');if(opener)$('play').textContent='Try yourself';$('timeline').replaceChildren();s.frames.forEach((f,n)=>{const button=document.createElement('button');button.textContent=String(n+1).padStart(2,'0');button.title=`${f.caption}: ${f.ticks} ticks`;button.setAttribute('aria-label',`Step ${n+1}: ${f.caption}`);button.setAttribute('aria-current',n===index?'step':'false');if(n===index)button.className='selected';button.onclick=()=>seek(n);$('timeline').append(button);});if(full){buildLibrary();syncInputs();$('jsonEditor').value=JSON.stringify(C.compact(s),null,2);}else if(editing)syncFrameInputs();}
function syncInputs(){const s=current();$('titleInput').value=s.title;$('descriptionInput').value=s.description;$('heightInput').value=s.height;syncFrameInputs();}
function syncFrameInputs(){const f=frame();$('animateDescent').checked=!!f.animate;$('motifColor').value=f.motif?.color||'#e7a52b';$('activeType').value=f.active?.type||'';$('activeX').value=f.active?.x??3;$('activeY').value=f.active?.y??0;$('activeRotation').value=String(f.active?.rotation??0);for(const id of ['activeX','activeY','activeRotation'])$(id).disabled=!f.active;$('pivotInput').disabled=!f.active;$('pivotInput').value=f.active&&f.active.pivot!==undefined?String(f.active.pivot):'auto';document.querySelectorAll('[data-frame-key]').forEach(input=>input.checked=f.buttons.includes(input.dataset.frameKey));$('captionInput').value=f.caption;$('ticksInput').value=f.ticks;$('ticksInput').min=f.clear?C.LINE_CLEAR.ticks:f.animate?24:1;$('deleteFrame').disabled=current().frames.length===1;$('moveEarlier').disabled=index===0;$('moveLater').disabled=index===current().frames.length-1;}
function seek(n){stop();index=Math.max(0,Math.min(current().frames.length-1,n));elapsed=0;render();if(frame().clear||frame().animate||frame().blink)clearPreview=true;}
function stop(){playing=false;clearPreview=false;lastTime=0;$('play').textContent='▶ Play';$('play').setAttribute('aria-label','Play');}
function togglePlay(){if(isOpenerPreview()){$('startAttempt').onclick();return;}if(playing){stop();return;}if(index===current().frames.length-1){index=0;render();}playing=true;lastTime=0;elapsed=0;$('play').innerHTML='<span class="pause-icon" aria-hidden="true"></span> Pause';$('play').setAttribute('aria-label','Pause');}
function tick(time){
 const accommodationPreview=elapsed<168&&!editing&&!!current().accommodation&&!globalThis.liveAttempt?.isOpen()&&$('courseIntroduction').hidden;
 if(playing||clearPreview||accommodationPreview){
  if(lastTime)elapsed+=(time-lastTime)*C.HZ/1000*Number($('speed').value);
  lastTime=time;let changed=false;
  if(playing){
   while(playing&&elapsed>=frame().ticks){elapsed-=frame().ticks;if(index<current().frames.length-1){index++;changed=true;}else if($('loop').checked){index=0;changed=true;}else{elapsed=frame().ticks;stop();}}
   if(changed)render();
  }
  if(frame().clear||frame().animate||frame().blink||accommodationPreview){
   renderConcepts();TetrisCourse.supplement(current(),frame(),elapsed);$('frameCaption').textContent=C.frameAt(frame(),elapsed).caption;
   showInputs(C.frameAt(frame(),elapsed));
   drawGrid($('board'),C.compose(frame(),current().height),current().height,frame(),elapsed);
   if(clearPreview&&elapsed>=frame().ticks){clearPreview=false;lastTime=0;}
  }
 }
 requestAnimationFrame(tick);
}
function setEditing(v,fresh=false){
 if(v===editing&&!fresh)return;
 stop();
 if(v){
  if(!editing)watchIndex=index;
  if(fresh||!draft){draft=blankDraft();draftIndex=0;}
  index=fresh||!editing?draftIndex:index;
 }else{
  if(editing)draftIndex=index;
  index=Math.min(watchIndex,studies[selected].frames.length-1);
 }
 elapsed=0;editing=v;document.body.classList.toggle('editing',v);$('configurator').hidden=!v;
 $('watchTab').classList.toggle('selected',!v);$('editTab').classList.toggle('selected',v);
 $('exportOne').textContent=v?'Export draft JSON':'Export situation';
 render(true);
}
function changed(full=false){if(editing)render(full);}
function flatten(){const f=frame(),background={...f,active:undefined},b=C.compose(background,current().height),tiles=C.visualTiles(background,current().height);f.tileOverrides=[];b.forEach((row,y)=>row.forEach((type,x)=>{if(type==='I')f.tileOverrides.push({x,y,tile:tiles[y][x]});}));f.board=b.map(r=>r.join(''));delete f.parts;return f;}
function paint(event){if(!editing)return;const rect=$('board').getBoundingClientRect(),x=Math.floor(((event.clientX-rect.left)/rect.width*96-8)/8),y=Math.floor((event.clientY-rect.top)/rect.height*18)-(18-current().height);if(x<0||x>9||y<0||y>=current().height)return;const cell=`${x},${y}`;if(cell===lastCell)return;lastCell=cell;if(mode==='motif'){
   const f=frame(),stack=C.compose({...f,active:undefined},current().height);if(stack[y][x]==='.')return;
   stop();if(!f.motif)f.motif={cells:[],color:$('motifColor').value};
   const at=f.motif.cells.findIndex(p=>p[0]===x&&p[1]===y);
   if(event.buttons===2){if(at>=0)f.motif.cells.splice(at,1);}else if(at<0)f.motif.cells.push([x,y]);
   if(!f.motif.cells.length)delete f.motif;
   drawGrid($('board'),stack,current().height,f);return;
  }
  const erase=event.buttons===2||brush==='.';const shape=mode==='piece'&&!erase&&brush!=='X'?C.cells(brush,rotation):[[0,0]];if(shape.some(([dx,dy])=>x+dx>9||y+dy>=current().height)){notice('The whole piece must fit inside the board.');return;}stop();const f=flatten(),b=f.board.map(r=>[...r]);shape.forEach(([dx,dy],i)=>{const tx=x+dx,ty=y+dy;b[ty][tx]=erase?'.':brush;f.tileOverrides=f.tileOverrides.filter(o=>o.x!==tx||o.y!==ty);if(!erase&&brush==='I'){const tile=mode==='piece'?C.pieceLayout('I',rotation)[i][2]:$('iTileInput').value==='auto'?null:Number($('iTileInput').value);if(tile!==null)f.tileOverrides.push({x:tx,y:ty,tile});}});f.board=b.map(r=>r.join(''));if(f.motif){f.motif.cells=f.motif.cells.filter(([mx,my])=>b[my][mx]!=='.');if(!f.motif.cells.length)delete f.motif;}drawGrid($('board'),b,current().height,f);}
$('board').onpointerdown=e=>{if(!editing)return;e.preventDefault();painting=true;lastCell='';$('board').setPointerCapture(e.pointerId);paint(e);};$('board').onpointermove=e=>{if(painting)paint(e);};$('board').onpointerup=()=>{if(painting){painting=false;changed(true);}};$('board').onpointercancel=()=>{painting=false;changed(true);};$('board').oncontextmenu=e=>{if(editing)e.preventDefault();};
$('cleanPlayback').onchange=()=>{stop();index=0;elapsed=0;document.body.classList.toggle('clean-playback-mode',$('cleanPlayback').checked);render(true);};
$('watchTab').onclick=()=>setEditing(false);$('editTab').onclick=()=>setEditing(true);$('play').onclick=togglePlay;$('rewind').onclick=()=>seek(0);$('previous').onclick=()=>isOpenerPreview()?navigateOpener(-1):$('cleanPlayback').checked?navigateSituation(-1):seek(index-1);$('next').onclick=()=>isOpenerPreview()?navigateOpener(1):$('cleanPlayback').checked?navigateSituation(1):seek(index+1);$('scrubber').oninput=e=>seek(+e.target.value);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
document.addEventListener('keydown',e=>{if(!$('initialLevelPicker').hidden||!$('freeStartPicker').hidden)return;if(globalThis.liveAttempt?.isRunning())return;if(!$('stackEditor').hidden||!$('mistakeGallery').hidden||!$('puzzleLibrary').hidden)return;if(['INPUT','TEXTAREA','SELECT','BUTTON','SUMMARY'].includes(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();togglePlay();}if(e.code==='ArrowLeft'){e.preventDefault();$('previous').onclick();}if(e.code==='ArrowRight'){e.preventDefault();$('next').onclick();}});
for(const key of C.KEYS.filter(key=>key!=='Start'&&key!=='Select')){
 const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');
 input.type='checkbox';input.dataset.frameKey=key;text.textContent=key;
 input.onchange=()=>{if(!editing)return;stop();const f=frame();f.buttons=input.checked?[...new Set([...f.buttons,key])]:f.buttons.filter(k=>k!==key);changed();};
 label.append(input,text);$('frameButtons').append(label);
}

for(const type of [...C.TYPES,'.']){const button=document.createElement('button');button.title=type==='X'?'Background / curtain mino':type==='.'?'Eraser':`${type} piece mino`;button.setAttribute('aria-label',button.title);button.dataset.brush=type;const canvas=document.createElement('canvas');canvas.width=canvas.height=8;drawTile(canvas.getContext('2d'),type,0,0);const text=document.createElement('span');text.textContent=type==='.'?'Erase':type==='X'?'Curtain':type;button.append(canvas,text);button.onclick=()=>{brush=type;$('iTilePicker').hidden=type!=='I';document.querySelectorAll('[data-brush]').forEach(b=>{b.classList.toggle('selected',b.dataset.brush===brush);b.setAttribute('aria-pressed',b.dataset.brush===brush);});};if(type===brush)button.className='selected';$('palette').append(button);}
$('minoMode').onclick=()=>{$('motifMode').classList.remove('selected');mode='mino';$('minoMode').classList.add('selected');$('pieceMode').classList.remove('selected');};$('pieceMode').onclick=()=>{$('motifMode').classList.remove('selected');mode='piece';$('pieceMode').classList.add('selected');$('minoMode').classList.remove('selected');};$('rotate').onclick=()=>{rotation=(rotation+1)%4;$('rotationLabel').textContent=C.STATES[rotation];};
$('titleInput').onchange=e=>{if(!e.target.value.trim()){notice('Please enter a title.');syncInputs();return;}current().title=e.target.value;changed(true);};$('descriptionInput').onchange=e=>{current().description=e.target.value;changed(true);};
$('heightInput').onchange=e=>{
 const h=+e.target.value,s=current();
 if(!Number.isInteger(h)||h<1||h>18){notice('Height must be an integer from 1 to 18.');syncInputs();return;}
 const oldHeight=s.height,shift=h-oldHeight;
 if(s.frames.some(f=>f.active&&(f.active.y+shift<0||C.cells(f.active.type,f.active.rotation).some(([,dy])=>f.active.y+shift+dy>=h)))){
  notice('That height would cut off a falling piece. Move it lower before shortening the board.');syncInputs();return;
 }
 const boards=s.frames.map(f=>C.compose({...f,active:undefined},oldHeight));
 const tiles=s.frames.map(f=>C.visualTiles({...f,active:undefined},oldHeight));
 s.height=h;
 s.frames.forEach((f,n)=>{
  const b=boards[n].slice(-h);while(b.length<h)b.unshift(Array(10).fill('.'));
  f.board=b.map(r=>r.join(''));delete f.parts;if(f.active)f.active.y+=shift;if(f.animationFrom)f.animationFrom.y+=shift;if(f.motif){f.motif.cells=f.motif.cells.map(([x,y])=>[x,y+shift]).filter(([,y])=>y>=0&&y<h);if(!f.motif.cells.length)delete f.motif;}
  f.tileOverrides=[];b.forEach((row,y)=>row.forEach((type,x)=>{const previousY=y-shift;if(type==='I'&&previousY>=0&&previousY<oldHeight)f.tileOverrides.push({x,y,tile:tiles[n][previousY][x]});}));
 });changed(true);
};

for(const [id,key,max]of[['ticksInput','ticks',36000]])$(id).onchange=e=>{const v=+e.target.value;if(!Number.isInteger(v)||v<(frame().clear?C.LINE_CLEAR.ticks:frame().animate?24:1)||v>max){notice(`Enter a whole number from ${key==='ticks'?1:0} to ${max}.`);syncFrameInputs();return;}frame()[key]=v;changed(true);};
$('captionInput').onchange=e=>{frame().caption=e.target.value;changed(true);};
$('duplicateFrame').onclick=()=>{if(current().frames.length>=2000){notice('Maximum 2000 frames per situation.');return;}stop();current().frames.splice(index+1,0,C.clone(frame()));index++;changed(true);};$('deleteFrame').onclick=()=>{if(current().frames.length===1)return;stop();current().frames.splice(index,1);index=Math.min(index,current().frames.length-1);changed(true);};
function move(delta){stop();const frames=current().frames,target=index+delta;if(target<0||target>=frames.length)return;[frames[index],frames[target]]=[frames[target],frames[index]];index=target;changed(true);}$('moveEarlier').onclick=()=>move(-1);$('moveLater').onclick=()=>move(1);
$('clearBoard').onclick=()=>{stop();const f=frame();f.board=C.empty(current().height).map(r=>r.join(''));delete f.parts;delete f.active;delete f.animate;delete f.animationFrom;delete f.tileOverrides;delete f.motif;changed(true);};
$('curtain').onclick=()=>{stop();const s=current(),f=frame();if(s.frames.length+s.height>2000){notice('The curtain would exceed 2000 frames.');return;}const b=C.compose(f,s.height),frames=[];for(let n=1;n<=s.height;n++){const board=C.clone(b);for(let y=s.height-n;y<s.height;y++)board[y]=Array(10).fill('X');frames.push(C.makeFrame(board,`Curtain: row ${n} / ${s.height}`,[],n===s.height?90:4,{score:f.score,level:f.level,lines:f.lines,next:f.next}));}s.frames.splice(index+1,0,...frames);index++;changed(true);};
$('newSituation').onclick=()=>setEditing(true,true);
$('deleteSituation').onclick=()=>setEditing(true,true);
function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(C.compactData(value),null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('exportOne').onclick=()=>download(current(),current().title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.json');$('exportAll').onclick=()=>download({version:1,situations:studies},'tetris-studies.json');
$('importFile').onchange=async e=>{const files=[...e.target.files];if(!files.length)return;try{const imported=[];for(const f of files){if(f.size>5e6)throw Error(`${f.name} exceeds the 5 MB limit.`);try{imported.push(...C.parseCollection(JSON.parse(await f.text())));}catch(err){throw Error(`${f.name}: ${err.message}`);}}if(studies.length+imported.length>1000)throw Error('Collection limit: 1000 situations.');stop();selected=studies.length;studies.push(...imported.map(readOnly));watchIndex=0;if(editing)setEditing(false);else{index=0;render(true);}notice(`Imported ${imported.length} situation${imported.length===1?'':'s'}.`);}catch(err){notice(err.message);}finally{e.target.value='';}};
$('refreshJson').onclick=()=>{$('jsonEditor').value=JSON.stringify(C.compact(current()),null,2);notice('JSON refreshed from the current situation.');};$('applyJson').onclick=()=>{try{const next=C.normalize(JSON.parse($('jsonEditor').value));stop();draft=next;draftIndex=0;index=0;changed(true);notice('JSON applied to the draft.');}catch(err){notice(err.message);}};
render(true);requestAnimationFrame(tick);
if(loadErrors.length){$('status').textContent='Could not load: '+loadErrors.join(' | ');$('status').hidden=false;}

$('exportSource').onclick=()=>{
 const text='// Edit the JSON data below, then refresh index.html. No server is needed.\n'+
  'globalThis.TetrisSituations = '+JSON.stringify(C.compactData({situations:studies}),null,2)+';\n\n'+
  'if (typeof module !== "undefined") module.exports = globalThis.TetrisSituations;\n';
 const url=URL.createObjectURL(new Blob([text],{type:'text/javascript'}));
 const link=document.createElement('a');link.href=url;link.download='situations.js';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 notice('Exported the file-backed collection. Drafts are exported separately as JSON.');
};

$('pivotInput').onchange=e=>{if(!frame().active)return;if(e.target.value==='auto')delete frame().active.pivot;else frame().active.pivot=Number(e.target.value);changed(true);};

$('exportDraft').onclick=()=>{if(draft)download(draft,draft.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.json');};
// Configurator actions must never mutate a loaded library situation.
for(const id of ['titleInput','descriptionInput','heightInput','ticksInput','captionInput','pivotInput']){
 const change=$(id).onchange;$(id).onchange=e=>{if(editing)change(e);};
}
for(const id of ['duplicateFrame','deleteFrame','moveEarlier','moveLater','clearBoard','curtain','applyJson']){
 const click=$(id).onclick;$(id).onclick=e=>{if(editing)click(e);};
}

function setActivePiece(event){
 if(!editing)return;
 const f=frame(),type=$('activeType').value;
 if(!type){delete f.animate;delete f.animationFrom;delete f.active;changed(true);return;}
 const candidate=C.clone(f);
 candidate.active={type,x:Number($('activeX').value),y:Number($('activeY').value),rotation:Number($('activeRotation').value)};
 if(f.active?.pivot!==undefined&&f.active.type===type)candidate.active.pivot=f.active.pivot;
 try{const validated=C.normalize({...current(),frames:[candidate]});current().frames[index]=validated.frames[0];changed(true);}
 catch(error){notice(error.message);syncFrameInputs();}
}
for(const id of ['activeType','activeX','activeY','activeRotation'])$(id).onchange=setActivePiece;

function selectMotifMode(){mode='motif';$('motifMode').classList.add('selected');$('minoMode').classList.remove('selected');$('pieceMode').classList.remove('selected');}
 $('motifMode').onclick=()=>{if(editing)selectMotifMode();};
 $('motifColor').oninput=()=>{if(!editing)return;if(frame().motif){frame().motif.color=$('motifColor').value;changed(true);}};
 $('clearMotif').onclick=()=>{if(!editing)return;delete frame().motif;changed(true);};
 $('addMotif').onclick=()=>{
  if(!editing)return;if(frame().clear){notice('Select a frame before the line clear.');return;}
  if(current().frames.length>=2000){notice('Maximum 2000 frames per situation.');return;}
  stop();const next=C.clone(frame());next.caption='The motif';next.ticks=90;next.buttons=[];delete next.motif;delete next.animate;delete next.animationFrom;
  current().frames.splice(index+1,0,next);index++;elapsed=0;selectMotifMode();changed(true);
  notice('Select stack minos to highlight. Right-click removes them.');
 };
 $('animateDescent').onchange=()=>{
  if(!editing)return;const candidate=C.clone(current());const f=candidate.frames[index];
  if($('animateDescent').checked){f.animate=true;delete f.animationFrom;f.ticks=Math.max(108,f.ticks);}else{delete f.animate;delete f.animationFrom;}
  try{draft=C.normalize(candidate);stop();elapsed=0;render(true);}catch(error){notice(error.message);syncFrameInputs();}
 };
 $('lineClear').onclick=()=>{
 if(!editing)return;
 const rows=C.fullRows(C.compose(frame(),current().height));
 if(!rows.length){notice('No complete rows to clear.');return;}
 if(rows.length>4){notice('A single Game Boy line clear supports at most four rows.');return;}
 if(current().frames.length>=2000){notice('Maximum 2000 frames per situation.');return;}
 try{
  const raw=C.compact(current());raw.frames.splice(index+1,0,{caption:'Line clear',clear:true});
  const next=C.normalize(raw);stop();draft=next;index++;elapsed=0;render(true);clearPreview=true;
 }catch(error){notice(error.message);}
};


// Edit an explicit copy of the selected file; browser storage is never used.
let stackEditSource=null,stackEditKey='',stackEditRows=[];
function stackCandidate(){
 const raw=C.clone(stackEditSource),rows=stackEditRows.map(r=>r.join(''));while(rows.length&&/^\.{10}$/.test(rows[0]))rows.shift();raw.stack=rows;return raw;
}
function validateStackEdit(){
 try{C.normalize(stackCandidate());$('stackEditorError').textContent='';$('downloadStack').disabled=false;return true;}
 catch(error){$('stackEditorError').textContent=error.message;$('downloadStack').disabled=true;return false;}
}

function stackKind(c){return c==='$'?'mandatory':c===','?'counter':/[a-z]/.test(c)?'motif':c==='.'?'empty':'stack';}
let stackUndo=[],stackRedo=[];
function stackSnapshot(){return stackEditRows.map(r=>r.join(''));}
function stackHistoryState(){$('undoStack').disabled=!stackUndo.length;$('redoStack').disabled=!stackRedo.length;}
function stackCheckpoint(){stackUndo.push(stackSnapshot());if(stackUndo.length>100)stackUndo.shift();stackRedo=[];stackHistoryState();}
function restoreStackSnapshot(rows){stackEditRows=rows.map(r=>[...r]);$('stackRows').value=rows.join('\n');renderStackGrid();validateStackEdit();stackHistoryState();}
function stackTile(canvas,c){
 canvas.width=24;canvas.height=24;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const type=c==='.'||c===','?'.':c==='s'||c==='$'||c==='S'?'L':c.toUpperCase();drawTile(ctx,type,0,0,24);
 if(c==='s'||c==='$'||c===','){ctx.globalAlpha=c==='$'?.8:.55;ctx.fillStyle=c==='$'?'#fff39a':c===','?'#9271cf':'#e7a52b';ctx.fillRect(0,0,24,24);ctx.globalAlpha=1;}
}
function renderStackBrushes(){
 const tools=[['S','Stack'],['s','Motif'],['$','Mandatory motif'],[',','Counter-motif'],['.','Eraser']];
 for(const[id,items]of [['stackBrushes',tools],['stackMinoBrushes',['L','J','I','O','Z','T','X'].map(c=>[c,c])]]){
  const palette=$(id);palette.replaceChildren();items.forEach(([value,label],i)=>{const b=document.createElement('button'),tile=document.createElement('canvas');b.type='button';b.dataset.brush=value;b.setAttribute('aria-pressed',String($('stackBrush').value===value));stackTile(tile,value);tile.setAttribute('aria-hidden','true');const text=document.createElement('span');text.textContent=label;b.append(tile,text);if(id==='stackBrushes'){const key=document.createElement('kbd');key.textContent=i+1;b.append(key);}b.onclick=()=>{$('stackBrush').value=value;renderStackBrushes();};palette.append(b);});
 }
}
function renderStackGrid(){
 const grid=$('stackPaintGrid');grid.replaceChildren();
 stackEditRows.forEach((row,y)=>row.forEach((cell,x)=>{
  const b=document.createElement('button'),tile=document.createElement('canvas');b.type='button';b.append(tile);
  const update=()=>{const c=stackEditRows[y][x];stackTile(tile,c);b.dataset.kind=stackKind(c);b.setAttribute('aria-label','Row '+(y+1)+', column '+(x+1)+': '+c);};update();
  const paint=(erase,record=true)=>{const next=erase?'.':($('stackBrush').value||'S');if(stackEditRows[y][x]===next)return;if(record)stackCheckpoint();stackEditRows[y][x]=next;$('stackRows').value=stackEditRows.map(r=>r.join('')).join('\n');update();validateStackEdit();};
  b.onpointerdown=e=>{e.preventDefault();paint(e.button===2);};b.onpointerenter=e=>{if(e.buttons&3)paint(!!(e.buttons&2),false);};b.onclick=()=>paint(false);b.oncontextmenu=e=>{e.preventDefault();paint(true);};grid.append(b);
 }));
}
function openStackEditor(){
 globalThis.liveAttempt?.leave();stop();stackEditKey=situationKey(studies[selected]);const raw=globalThis.TetrisSituationFiles?.[stackEditKey];
 if(!raw){notice('No source situation file available.');return;}
 stackUndo=[];stackRedo=[];stackHistoryState();stackEditSource=C.clone(raw);const height=raw.height||18;stackEditRows=Array.from({length:height-(raw.stack||[]).length},()=>Array(10).fill('.')).concat((raw.stack||[]).map(r=>[...r]));
 $('stackEditorTitle').textContent='Edit stack: '+raw.title;$('stackEditor').hidden=false;$('stackBrush').value='S';renderStackBrushes();$('stackRows').value=stackEditRows.map(r=>r.join('')).join('\n');renderStackGrid();validateStackEdit();$('stackEditor').scrollIntoView?.({behavior:'smooth',block:'start'});
}
$('openStackEditor').onclick=openStackEditor;$('resetStack').onclick=openStackEditor;$('closeStackEditor').onclick=()=>{$('stackEditor').hidden=true;};
$('stackRows').oninput=()=>{
 const rows=$('stackRows').value.replace(/\r/g,'').split('\n');
 if(rows.length>(stackEditSource.height||18)||rows.some(r=>r.length!==10)){$('stackEditorError').textContent='Use up to '+(stackEditSource.height||18)+' rows, each exactly 10 cells.';$('downloadStack').disabled=true;return;}
 stackCheckpoint();stackEditRows=Array.from({length:(stackEditSource.height||18)-rows.length},()=>Array(10).fill('.')).concat(rows.map(r=>[...r]));renderStackGrid();validateStackEdit();
};
$('downloadStack').onclick=()=>{
 if(!validateStackEdit())return;
 const raw=stackCandidate(),source='(function(root){\nconst situation = '+JSON.stringify(raw,null,2)+';\nif(typeof module!=="undefined")module.exports=situation;\nelse (root.TetrisSituationFiles??={})['+JSON.stringify(stackEditKey)+']=situation;\n})(globalThis);\n';
 const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'})),a=document.createElement('a');a.href=url;a.download=stackEditKey+'.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};

$('undoStack').onclick=()=>{if(!stackUndo.length)return;stackRedo.push(stackSnapshot());restoreStackSnapshot(stackUndo.pop());};
$('redoStack').onclick=()=>{if(!stackRedo.length)return;stackUndo.push(stackSnapshot());restoreStackSnapshot(stackRedo.pop());};
document.addEventListener('keydown',e=>{
 if($('stackEditor').hidden||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
 if(e.key==='Escape'){$('stackEditor').hidden=true;return;}
 if((e.ctrlKey||e.metaKey)&&['z','y'].includes(e.key.toLowerCase())){e.preventDefault();$(e.key.toLowerCase()==='y'||e.shiftKey?'redoStack':'undoStack').onclick();return;}
 const n=Number(e.key);if(n>=1&&n<=5){e.preventDefault();$('stackBrush').value=['S','s','$',',','.'][n-1];renderStackBrushes();}
});

$('randomOpeners').onclick=()=>{TetrisCourse.leaveIntro();closeSituationMenu();globalThis.liveAttempt.startOpeners();};
globalThis.liveAttempt=TetrisPlayable.init({closeMenu:closeSituationMenu,hasPreviousOpener:()=>openerOrder().indexOf(selected)>0,previousOpener:()=>navigateOpener(-1),hasNextOpener:()=>openerOrder().indexOf(selected)<openerOrder().length-1,nextOpener:()=>navigateOpener(1),showSolution:s=>{const n=studies.indexOf(s);if(n>=0)libraryCards[n].onclick();else globalThis.liveAttempt.leave();if(!isOpenerPreview())seek(current().frames.length-1);},showOpener:s=>{const n=studies.indexOf(s);if(n>=0)libraryCards[n].onclick();else globalThis.liveAttempt.leave();},openers:()=>studies.filter(s=>s.chapter==='Openers'),practiceUrl:on=>{try{const u=new URL(location.href);if(on){u.searchParams.delete('play');u.searchParams.delete('lesson');u.searchParams.delete('next');u.searchParams.set('practice','openers');}else{u.searchParams.delete('practice');u.searchParams.delete('play');}history.replaceState(history.state,'',u.href);}catch{}},situation:()=>lessonVariant||studies[selected],stop,render:()=>render(),draw:drawGrid,inputs:showInputs,next:TetrisCourse.practiceNext,notice});
TetrisCourse.init({stop,closeMenu:closeSituationMenu,selectSituation:key=>{const n=studies.findIndex(s=>situationKey(s)===key);if(n>=0){libraryCards[n].onclick();TetrisCourse.revealGroup('Double-Well');}},selectAlternative:type=>{if(globalThis.liveAttempt?.isOpen())globalThis.liveAttempt.leave();stop();lessonVariant=readOnly(C.normalize(TetrisCourse.variant(studies[selected],type)));situationKeys.set(lessonVariant,situationKey(studies[selected]));index=0;elapsed=0;try{const u=new URL(location.href);u.searchParams.set('next',type);history.replaceState(history.state,'',u.href);}catch{}render(true);}});

try{if(new URL(location.href).searchParams.get('play')==='free'){globalThis.liveAttempt.startFree();}else if(new URL(location.href).searchParams.get('practice')==='notation'){globalThis.liveAttempt.startNotation();TetrisCourse.revealGroup('Basics');}else if(new URL(location.href).searchParams.get('practice')==='openers'){TetrisCourse.leaveIntro();globalThis.liveAttempt.startOpeners();TetrisCourse.revealGroup('Openers');}}catch{}
