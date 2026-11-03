(function(root){
'use strict';
const TYPES=['L','J','I','O','Z','S','T','X'];
const KEYS=['Up','Down','Left','Right','A','B','Start','Select'];
const HZ=59.7275;
const ENTRY_DELAY=2;
// Original pixel data and orientation tables extracted from the supplied v1.1 ROM.
const ROM=typeof module!=='undefined'?require('./rom-assets.js'):root.TetrisRomAssets;
if(!ROM)throw Error('Original ROM graphics are missing. Load rom-assets.js before core.js.');
// Public states retain the course chart; all play converts through native ROM sprite IDs.
const STATES=['North','East','South','West'];
const STATE_LAYOUTS={I:[0,1,0,1],O:[0,0,0,0],J:[0,3,2,1],L:[0,3,2,1],S:[0,1,0,1],Z:[0,1,0,1],T:[0,3,2,1]};
function nativeTurn(type,rotation,action){const map=STATE_LAYOUTS[type],raw=map[((rotation%4)+4)%4],next=(raw+(action==='a'?3:1))%4,physical=['I','S','Z'].includes(type)?next%2:type==='O'?0:next;return map.indexOf(physical);}
function spawn(type){return {type,x:3,y:type==='I'?-1:0,rotation:0};}
function rotationInputs(type,from,to){const queue=[[from,[]]],seen=new Set();for(let n=0;n<queue.length;n++){const [r,inputs]=queue[n];if(pieceLayout(type,r).map(p=>p.join(',')).join(';')===pieceLayout(type,to).map(p=>p.join(',')).join(';'))return inputs;if(seen.has(r))continue;seen.add(r);for(const action of ['a','b'])queue.push([nativeTurn(type,r,action),[...inputs,action]]);}throw Error('Unreachable orientation');}
function pieceLayout(type,rotation=0){return ROM.pieceLayouts[type][STATE_LAYOUTS[type][((rotation%4)+4)%4]];}
const SHAPES=Object.fromEntries(Object.keys(STATE_LAYOUTS).map(type=>[type,STATES.map((_,rotation)=>pieceLayout(type,rotation).map(([x,y])=>[x,y-(type==='I'?0:1)]))]));
const TILES=Object.fromEntries(Object.entries(ROM.minoIds).map(([type,id])=>[type,ROM.tiles[id]]));
TILES['.']=ROM.tiles[ROM.emptyId];
const I_TILE_IDS=[128,136,137,138,139,143];
function visualTiles(frame,height){
 const board=compose(frame,height);
 const result=board.map(row=>row.map(type=>type==='.'?ROM.emptyId:ROM.minoIds[type]));
 // Imported boards can omit tile metadata. Infer intact I bars from their neighbours.
 for(let y=0;y<height;y++)for(let x=0;x<10;x++)if(board[y][x]==='I'){
  if((x>0&&board[y][x-1]==='I')||(x<9&&board[y][x+1]==='I'))result[y][x]=(x===0||board[y][x-1]!=='I')?138:(x===9||board[y][x+1]!=='I')?143:139;
  else if((y>0&&board[y-1][x]==='I')||(y<height-1&&board[y+1][x]==='I'))result[y][x]=(y===0||board[y-1][x]!=='I')?128:(y===height-1||board[y+1][x]!=='I')?137:136;
 }
 for(const o of frame.tileOverrides||[])if(board[o.y]?.[o.x]==='I')result[o.y][o.x]=o.tile;
 if(frame.active){const a=frame.active,shape=cells(a.type,a.rotation);const original=pieceLayout(a.type,a.rotation);shape.forEach(([dx,dy],i)=>{if(result[a.y+dy]&&a.x+dx>=0&&a.x+dx<10)result[a.y+dy][a.x+dx]=original[i][2];});}
 return result;
}
const clone=v=>JSON.parse(JSON.stringify(v));
const empty=h=>Array.from({length:h},()=>Array(10).fill('.'));
function integer(v,min,max,name){if(!Number.isInteger(v)||v<min||v>max)throw Error(`${name} must be an integer from ${min} to ${max}.`);return v;}
function grid(v,name,partial=false){if(!Array.isArray(v)||v.length>18)throw Error(`${name} must be an array of up to 18 rows.`);return v.map((r,y)=>{if(typeof r==='string')r=[...r];if(!Array.isArray(r)||(partial?(r.length<1||r.length>10):r.length!==10))throw Error(`${name} row ${y+1} must contain ${partial?"1–10":"10"} cells (got ${Array.isArray(r)?r.length:'an invalid row'}).`);return r.map(c=>{if(c===0||c===null||c===' ')return '.';if(c!=='.'&&!TYPES.includes(c))throw Error(`Unknown cell ${String(c)} in ${name}. Use . I O T S Z J L X.`);return c;});});}
function cells(type,r=0){const ss=SHAPES[type];return ss?ss[((r%ss.length)+ss.length)%ss.length]:[[0,0]];}
function pivotCell(active){
 const shape=cells(active.type,active.rotation);
 if(active.pivot!==undefined)return shape[active.pivot];
 if(active.type==='O')return null;
 if(active.type==='I')return [1,2];
 return [1,1];
}
function compose(frame,height){const b=empty(height);const put=(rows,x,y)=>rows.forEach((row,dy)=>[...row].forEach((c,dx)=>{if(c!=='.'&&b[y+dy]&&x+dx>=0&&x+dx<10)b[y+dy][x+dx]=c;}));put(frame.board||[],0,height-(frame.board||[]).length);for(const p of frame.parts||[])put(p.rows,p.x,p.y);if(frame.active)for(const [dx,dy]of cells(frame.active.type,frame.active.rotation))put([[frame.active.type]],frame.active.x+dx,frame.active.y+dy);return b;}
// Verified against the supplied v1.1 ROM, routines $213E-$24BA.
const LINE_CLEAR={lead:2,interval:10,hold:13,redraw:18,flashTile:0x8c};
LINE_CLEAR.ticks=LINE_CLEAR.lead+6*LINE_CLEAR.interval+LINE_CLEAR.hold+LINE_CLEAR.redraw;
function fullRows(board){
 // The cartridge checks only native playfield rows 2..17, not its top two rows.
 return board.map((row,y)=>y>=Math.max(0,board.length-16)&&row.every(c=>c!=='.')?y:-1).filter(y=>y>=0);
}
function collapseRows(board,rows,blank='.'){
 const h=board.length,offset=18-h,result=Array.from({length:offset},()=>Array(10).fill(blank)).concat(board.map(row=>[...row]));
 // Match the cartridge's sequential copies, including its multi-clear top-row quirk.
 for(const row of rows)for(let y=row+offset;y>0;y--)result[y]=[...result[y-1]];
 result[0]=Array(10).fill(blank);return result.slice(-h);
}
function clearAfterBoard(frame,height){return collapseRows(compose(frame,height),frame.clearRows||fullRows(compose(frame,height)));}
function iOverrides(board,tiles){const result=[];board.forEach((row,y)=>row.forEach((type,x)=>{if(type==='I')result.push({x,y,tile:tiles[y][x]});}));return result;}
function displayTiles(frame,height,ticks=0){
 const before=visualTiles(frame,height);if(!frame.clear)return before;
 const rows=frame.clearRows||fullRows(compose(frame,height)),t=Math.max(0,Math.floor(ticks));
 if(t<LINE_CLEAR.lead)return before;
 const phase=Math.floor((t-LINE_CLEAR.lead)/LINE_CLEAR.interval);
 if(phase<6){if(phase%2===0)for(const y of rows)before[y]=Array(10).fill(LINE_CLEAR.flashTile);return before;}
 for(const y of rows)before[y]=Array(10).fill(ROM.emptyId);
 const redrawStart=LINE_CLEAR.lead+6*LINE_CLEAR.interval+LINE_CLEAR.hold;
 if(t<redrawStart)return before;
 const after=collapseRows(visualTiles(frame,height),rows,ROM.emptyId),copied=Math.min(18,t-redrawStart+1);
 for(let y=0;y<height;y++)if(y+18-height>=18-copied)before[y]=after[y];
 return before;
}
function frameAt(frame,ticks=0){
 let view=frame;const t=Math.max(0,ticks);
 if(frame.intro){
  const phase=t<60?0:t<156?1:t<252?2:3;
  const captions=['1: A piece in its starting position.','1a: A matching motif.','1: The piece that fits the motif.','1b: A matching counter-motif.'];
  view={...frame,introPhase:phase,caption:captions[phase],motif:phase===1?frame.motif:undefined,counterMotif:phase===3?frame.counterMotif:undefined,highlight:phase===2?'blink':false};
 }
 if(frame.accommodationPulse){const phase=t;view={...view,placementHighlights:phase>=168||phase<60&&phase%24<12?frame.placementHighlights:undefined,motif:phase>=168||phase>=84&&phase<144&&(phase-84)%24<12?frame.motif:undefined};}
 const blinkTime=frame.intro?t-[0,60,156,252][view.introPhase]:t;
 if(frame.animate&&frame.animationFrom&&frame.active){
  const from=frame.animationFrom,to=frame.active,dx=to.x-from.x,dy=to.y-from.y,first=frame.fallFirst||0;
  const distance=Math.abs(dx)+Math.abs(dy),step=Math.max(1,(frame.ticks-22)/Math.max(1,distance)),turn=6+first*step;
  const moved=Math.min(distance,Math.floor(Math.max(0,t-6-(t>=turn?Math.min(6,t-turn):0))/step));
  const initial=Math.min(first,moved),mx=Math.min(Math.abs(dx),Math.max(0,moved-first)),my=initial+Math.max(0,moved-first-Math.abs(dx));
  const buttons=t>=turn&&t<turn+6?frame.buttons:(mx>0&&mx<Math.abs(dx)&&t>=turn+6?[dx>0?'Right':'Left']:[]);
  view={...frame,active:{...to,x:from.x+Math.sign(dx)*mx,y:from.y+Math.sign(dy)*my,rotation:t<turn?from.rotation:to.rotation},buttons};
 }
 if(frame.buttonOptions?.length){
  const phase=Math.floor(t/72),local=t%72;
  const lit=phase<frame.buttonOptions.length&&local<12;
  view={...view,buttons:lit?[frame.buttonOptions[phase]]:[]};
 }
 const on=(!frame.blink&&view.highlight!=='blink')||Math.floor(blinkTime/12)%2===0;
 const mandatoryPhase=frame.mandatoryAfter!==undefined&&t>=frame.mandatoryAfter;
 const mandatoryStart=(frame.mandatoryAfter??0)+24;
 if(frame.mandatoryAfter!==undefined&&view.motif){
  const bright=mandatoryPhase&&t>=mandatoryStart&&Math.floor((t-mandatoryStart)/12)%2===0;
  if(!bright)view={...view,motif:{...view.motif,mandatory:[]}};
 }
 if(frame.hold)view.buttons=[...frame.buttons];
 return {...view,ghost:!view.ghostBlink||on?view.ghost:undefined,placementHighlights:!view.placementBlink||on?view.placementHighlights:undefined,nextPreviewVisible:!view.nextBlink||on,trigger:on?view.trigger:undefined,buttons:view.buttons,motif:on||mandatoryPhase?view.motif:undefined,counterMotif:on?view.counterMotif:undefined,highlight:view.highlight==='blink'?on:view.highlight};
}
function lessonPose(a,name,height){
 if(!a||!Object.hasOwn(SHAPES,a.type))throw Error(name+' needs a piece type.');
 const x=integer(a.x,-3,9,name+' x'),y=integer(a.y,-2,height-1,name+' y'),rotation=integer(a.rotation??0,0,3,name+' rotation');
 if(cells(a.type,rotation).some(([dx,dy])=>x+dx<0||x+dx>=10||y+dy< -2||y+dy>=height))throw Error(name+' extends outside the board.');return{type:a.type,x,y,rotation};
}
function normalize(raw){
 if(!raw||typeof raw!=='object')throw Error('A situation must be an object.');
 const height=integer(raw.height??18,1,18,'height');
 if(typeof raw.title!=='string'||!raw.title.trim())throw Error('Each situation needs a title.');
 if(raw.title.length>100)throw Error('Title is limited to 100 characters.');
 if(raw.description!==undefined&&typeof raw.description!=='string')throw Error('Description must be text.');
 if((raw.description||'').length>500)throw Error('Description is limited to 500 characters.');
 if(!Array.isArray(raw.frames)||!raw.frames.length||raw.frames.length>2000)throw Error('A situation needs 1–2000 frames.');
 if(raw.piece!==undefined&&!Object.hasOwn(SHAPES,raw.piece))throw Error('piece must name one of the seven pieces.');
 const usesStack=raw.stack!==undefined||raw.piece!==undefined||raw.frames.some(f=>f&&(f.rows!==undefined||f.clear));
 let stack=empty(height),previousFrame=null,inheritedOverrides=raw.tileOverrides;
 function replaceStack(rows,name){const parsed=grid(rows,name);if(parsed.length>height)throw Error('Stack exceeds situation height.');stack=empty(height-parsed.length).concat(parsed);}
 const stackMotif=[],stackCounter=[],stackMandatory=[];
 if(raw.stack!==undefined){
  if(!Array.isArray(raw.stack))throw Error('stack must be an array of rows.');
  const offset=height-raw.stack.length;
  const rows=raw.stack.map((row,y)=>{
   if(typeof row!=='string'&&!Array.isArray(row))return row;
   return [...row].map((c,x)=>{if(c==='$'){stackMotif.push([x,y+offset]);stackMandatory.push([x,y+offset]);return 'L';}if(c===','){stackCounter.push([x,y+offset]);return '.';}if(typeof c==='string'&&/^[iotszjlx]$/.test(c)){stackMotif.push([x,y+offset]);c=c.toUpperCase();}return c==='S'?'L':c;});
  });replaceStack(rows,'stack');
 }
 const frames=raw.frames.map((input,i)=>{
  if(!input||typeof input!=='object')throw Error(`Frame ${i+1} must be an object.`);
  const f={...input};
  if(f.stack!==undefined){
   const nested={...f};delete nested.stack;
   Object.assign(f,normalize({title:raw.title,height,stack:f.stack,piece:raw.piece,frames:[nested]}).frames[0]);if(f.motif)f.motif.mandatory??=[];delete f.stack;
  }
  if(f.clear!==undefined&&typeof f.clear!=='boolean')throw Error('clear must be true or false.');
  if(f.clear&&f.board===undefined&&previousFrame){
   const before=previousFrame.clear?clearAfterBoard(previousFrame,height):compose(previousFrame,height);
   const tiles=previousFrame.clear?collapseRows(visualTiles(previousFrame,height),previousFrame.clearRows,ROM.emptyId):visualTiles(previousFrame,height);
   replaceStack(before,'locked stack');inheritedOverrides=iOverrides(before,tiles);
  }
  if(usesStack){
   if(f.board!==undefined)replaceStack(f.board,`Frame ${i+1} board`);
   if(f.rows!==undefined){
    if(!f.rows||typeof f.rows!=='object'||Array.isArray(f.rows))throw Error('rows must map row numbers to 10-cell rows.');
    for(const[key,row]of Object.entries(f.rows)){
     if(!/^(0|[1-9][0-9]*)$/.test(key))throw Error('Row numbers must be non-negative integers.');
     const y=integer(Number(key),0,height-1,'row number');stack[y]=grid([row],'changed row')[0];
    }
   }
   f.board=stack.map(row=>row.join(''));
  }
  const b=grid(f.board||[],`Frame ${i+1} board`);if(b.length>height)throw Error('Board exceeds situation height.');
  const buttons=f.buttons??[];if(!Array.isArray(buttons)||buttons.some(k=>!KEYS.includes(k)))throw Error(`Frame ${i+1}: invalid button name.`);
  const frame={caption:String(f.caption||'').slice(0,150),ticks:integer(f.ticks??(f.clear?LINE_CLEAR.ticks:30),f.clear?LINE_CLEAR.ticks:1,36000,'ticks'),board:b.map(r=>r.join('')),buttons:[...new Set(buttons)],score:integer(f.score??0,0,999999,'score'),level:integer(f.level??0,0,99,'level'),lines:integer(f.lines??0,0,999,'lines'),next:f.next??'T'};
  if(!Object.hasOwn(SHAPES,frame.next))throw Error('next must name one of the seven pieces.');
  if(f.parts!==undefined){
   if(!Array.isArray(f.parts)||f.parts.length>500)throw Error('parts must be an array of at most 500 fragments.');
   frame.parts=f.parts.map(p=>{const rows=grid(p.rows,'part',true),x=integer(p.x??0,0,9,'part x'),y=integer(p.y??0,0,height-1,'part y');if(rows.some(r=>x+r.length>10))throw Error('Part extends beyond board width.');if(y+rows.length>height)throw Error('Part extends below board.');return{x,y,rows};});
  }
  const overrides=f.tileOverrides??inheritedOverrides;
  if(overrides!==undefined){
   if(!Array.isArray(overrides)||overrides.length>180)throw Error('tileOverrides must contain at most 180 entries.');
   frame.tileOverrides=overrides.map(o=>{const x=integer(o.x,0,9,'tile override x'),y=integer(o.y,0,height-1,'tile override y');if(!I_TILE_IDS.includes(o.tile))throw Error('Invalid I tile override.');return{x,y,tile:o.tile};});
  }
  if(f.active){
   const a=f.active,type=a.type??raw.piece;if(!Object.hasOwn(SHAPES,type))throw Error('active.type or situation piece must name a piece.');
   const rotation=integer(a.rotation??0,0,3,'rotation'),x=integer(a.x,-3,9,'active x'),y=integer(a.y,-2,height-1,'active y');
   if(cells(type,rotation).some(([dx,dy])=>x+dx<0||x+dx>=10||y+dy< -2||y+dy>=height))throw Error('Active piece extends outside board.');
   frame.active={type,x,y,rotation};if(a.pivot!==undefined)frame.active.pivot=integer(a.pivot,0,3,'active pivot mino');
  }
  if(f.referenceGhost){frame.referenceGhost=lessonPose(f.referenceGhost,'Reference ghost',height);frame.referenceGhost.label=String(f.referenceGhost.label||'Adjusted').slice(0,20);}
  if(f.ghost){frame.ghost=lessonPose(f.ghost,'Ghost',height);frame.ghost.label=String(f.ghost.label||'Default').slice(0,20);}
  if(f.placementColors!==undefined){if(!Array.isArray(f.placementColors)||f.placementColors.length!==f.placementHighlights?.length||f.placementColors.some(c=>typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c)))throw Error('Placement colors must match the highlighted pieces.');frame.placementColors=[...f.placementColors];}
  if(f.placementHighlights!==undefined){if(!Array.isArray(f.placementHighlights)||f.placementHighlights.length>2)throw Error('Use up to two placement highlights.');frame.placementHighlights=f.placementHighlights.map(a=>lessonPose(a,'Placement',height));}
  for(const key of ['ghostBlink','nextBlink','showNext','placementBlink','hold'])if(f[key]!==undefined){if(typeof f[key]!=='boolean')throw Error('Invalid '+key);frame[key]=f[key];}
  if(f.lessonStage!==undefined)frame.lessonStage=integer(f.lessonStage,1,7,'lesson stage');
  if(f.animate!==undefined&&typeof f.animate!=='boolean')throw Error('animate must be true or false.');
  if(f.animate){
   if(f.clear||!frame.active)throw Error('An animated descent needs a falling piece and cannot clear lines.');
   const from=f.animationFrom??previousFrame?.active;
   if(!from||from.type!==frame.active.type)throw Error('An animated descent needs the same falling piece in the previous step.');
   const x=integer(from.x,-3,9,'animation start x'),y=integer(from.y,-2,height-1,'animation start y'),rotation=integer(from.rotation??0,0,3,'animation start rotation');
   if(cells(from.type,rotation).some(([dx,dy])=>x+dx<0||x+dx>=10||y+dy< -2||y+dy>=height))throw Error('Animation start extends outside board.');
   if(frame.ticks<24)throw Error('Animated steps need at least 24 ticks.');
   frame.animate=true;frame.animationFrom={type:from.type,x,y,rotation};
  }
  if(f.fallFirst!==undefined){if(!frame.animate)throw Error('fallFirst requires animate.');frame.fallFirst=integer(f.fallFirst,0,Math.max(0,frame.active.y-frame.animationFrom.y),'fallFirst');}
  if(f.intro!==undefined){if(typeof f.intro!=='boolean'||(f.intro&&frame.ticks<348))throw Error('An intro needs at least 348 ticks.');if(f.intro)frame.intro=true;}
  if(f.step!==undefined){if(typeof f.step!=='string'||!/^([1-9][0-9]*)([a-z])?$/.test(f.step))throw Error('Invalid step label.');frame.step=f.step;}
  if(f.example!==undefined)frame.example=integer(f.example,1,2000,'example number');
  if(f.buttonOptions!==undefined){if(!Array.isArray(f.buttonOptions)||!f.buttonOptions.length||f.buttonOptions.length>2||f.buttonOptions.some(b=>!['A','B'].includes(b)))throw Error('buttonOptions must contain A and/or B.');frame.buttonOptions=[...new Set(f.buttonOptions)];}
  if(f.reveal!==undefined){if(!['piece','match','counter','rotation','trigger','input','spin'].includes(f.reveal))throw Error('Unknown spin concept.');frame.reveal=f.reveal;}
  if(f.highlight!==undefined){if(![true,false,'blink'].includes(f.highlight))throw Error('highlight must be true, false or blink.');frame.highlight=f.highlight;}
  if(f.mandatoryAfter!==undefined)frame.mandatoryAfter=integer(f.mandatoryAfter,0,frame.ticks-1,'mandatoryAfter');
  if(f.blink!==undefined){if(typeof f.blink!=='boolean')throw Error('blink must be true or false.');frame.blink=f.blink;}
  if(f.trigger!==undefined){
   const tr=f.trigger,pivot=frame.active&&pivotCell(frame.active);
   if(!tr||!Array.isArray(tr.hole)||tr.hole.length!==2||!pivot)throw Error('A trigger needs a pivot and a hole [x,y].');
   const x=integer(tr.hole[0],0,9,'trigger hole x'),y=integer(tr.hole[1],0,height-1,'trigger hole y'),button=tr.button??'A';
   if(!['A','B'].includes(button))throw Error('Trigger button must be A or B.');
   if(y!==frame.active.y+pivot[1]||x===frame.active.x+pivot[0])throw Error('Trigger hole must align beside the pivot.');
   const target=tr.target??'empty';if(!['empty','stack'].includes(target))throw Error('Trigger target must be empty or stack.');
   const occupied=compose({...frame,active:undefined},height)[y][x]!=='.';
   if(target==='empty'&&occupied)throw Error('Trigger target is occupied. Use target: "stack" to align with a stack mino.');
   if(target==='stack'&&!occupied)throw Error('Trigger stack target is empty.');
   frame.trigger={hole:[x,y],button};if(target==='stack')frame.trigger.target='stack';
  }
  if(f.counterMotif!==undefined){
   const m=f.counterMotif===true?{cells:stackCounter}:f.counterMotif;
   if(!m||!Array.isArray(m.cells)||m.cells.length>180)throw Error('Invalid counterMotif.');
   const background=compose({...frame,active:undefined},height);
   const cells=m.cells.map(p=>{if(!Array.isArray(p)||p.length!==2)throw Error('Counter-motif cells must be [x,y].');const x=integer(p[0],0,9,'counter x'),y=integer(p[1],0,height-1,'counter y');if(background[y][x]!=='.')throw Error('Counter-motif cells must be empty.');return[x,y];});
   if(cells.length)frame.counterMotif={cells};
  }
  if(f.clear){
   const locked=compose(frame,height),tiles=visualTiles(frame,height),rows=fullRows(locked);
   if(!rows.length)throw Error('No complete rows to clear.');
   if(rows.length>4)throw Error('A single Game Boy line clear supports at most four rows.');
   frame.board=locked.map(row=>row.join(''));delete frame.active;delete frame.parts;
   frame.tileOverrides=iOverrides(locked,tiles);frame.clear=true;frame.clearRows=rows;
   stack=collapseRows(locked,rows);inheritedOverrides=iOverrides(stack,collapseRows(tiles,rows,ROM.emptyId));
  }
  if(f.motif!==undefined){
   const m=f.motif===true?{cells:stackMotif}:f.motif;
   if(!m||typeof m!=='object')throw Error('motif must be true or an object.');
   if(m.space!==undefined&&typeof m.space!=='boolean')throw Error('motif.space must be true or false.');
   const motifCells=m.cells??(m.space?stackCounter:stackMotif);
   if(!Array.isArray(motifCells)||motifCells.length>180)throw Error('motif.cells must contain up to 180 [x, y] pairs.');
   const color=m.color??'#e7a52b';if(typeof color!=='string'||!/^#[0-9a-f]{6}$/i.test(color))throw Error('Motif color must be a six-digit hex color.');
   const background=compose({...frame,active:undefined},height),seen=new Set();
   const points=motifCells.map(p=>{if(!Array.isArray(p)||p.length!==2)throw Error('Each motif cell must be [x, y].');const x=integer(p[0],0,9,'motif x'),y=integer(p[1],0,height-1,'motif y');if(m.space?background[y][x]!=='.':background[y][x]==='.')throw Error(m.space?'Space motif cells must be empty.':'Motif cells must belong to the stack.');return[x,y];}).filter(p=>{const key=p.join(',');if(seen.has(key))return false;seen.add(key);return true;});
   if(points.length){frame.motif={cells:points,color};if(m.space)frame.motif.space=true;
    const marked=m.mandatory??stackMandatory;if(!Array.isArray(marked)||marked.length>180)throw Error('Invalid mandatory motif cells.');
    const required=marked.map(p=>{if(!Array.isArray(p)||p.length!==2)throw Error('Mandatory motif cells must be [x,y].');return[integer(p[0],0,9,'mandatory x'),integer(p[1],0,height-1,'mandatory y')];}).filter(p=>points.some(q=>q[0]===p[0]&&q[1]===p[1]));
    if(required.length)frame.motif.mandatory=required;
   }
  }
  if(frame.tileOverrides&&!frame.tileOverrides.length)delete frame.tileOverrides;previousFrame=frame;return frame;
 });
 const result={version:1,title:raw.title,description:raw.description||'',height,frames};
 if(raw.qualityWell!==undefined){if(raw.qualityWell!==0&&raw.qualityWell!==9)throw Error('The designated well must be an edge column.');result.qualityWell=raw.qualityWell;}
 if(raw.motionVerified===true)result.motionVerified=true;
 if(raw.chapter!==undefined){if(!['Adjustments','Openers','Tucks','Clean stacking','Save stacking'].includes(raw.chapter))throw Error('Unknown lesson chapter.');result.chapter=raw.chapter;}
 if(raw.tuck){const t=raw.tuck;if(raw.chapter!=='Tucks'||!['Left','Right'].includes(t.direction))throw Error('Invalid tuck chapter or direction.');const orientation=integer(t.orientation,0,3,'Tuck orientation'),setup=lessonPose(t.setup,'Tuck setup',height),approach=lessonPose(t.approach,'Tuck approach',height),target=lessonPose(t.target,'Tuck destination',height);if([setup,approach,target].some(p=>p.type!==target.type||p.rotation!==orientation)||setup.x!==approach.x||setup.y>=approach.y||target.y!==approach.y||target.x-approach.x!==(t.direction==='Right'?1:-1)*(t.distance??1))throw Error('A tuck must fall in one orientation and shift its stated distance.');const distance=integer(t.distance??1,1,2,'Tuck distance');result.tuck={direction:t.direction,orientation,setup,approach,target,...(distance===2?{distance}: {})};}
 if(raw.section!==undefined){if(!({'Adjustments':['Good','Good but Situational','Dicey','Memes/Anti-Adjustments','VITS'],'Clean stacking':['Accommodation stacking','Upstacking'],'Save stacking':['Double-Well','Secondary placements','Burning and Skimming','Rooftop burning']}[raw.chapter]||[]).includes(raw.section))throw Error('Unknown adjustment section.');result.section=raw.section;}
 if(raw.doubleWell){const m=raw.doubleWell;if(raw.chapter!=='Save stacking'||raw.section!=='Double-Well'||!['skim','repair','counterexample','delayed'].includes(m.role))throw Error('Invalid Double Well lesson.');result.doubleWell={...(typeof m.key==='string'?{key:m.key}:{}),width:integer(m.width??2,2,4,'Tactical burn well width'),...(m.tetrisColumn!==undefined?{tetrisColumn:integer(m.tetrisColumn,1,10,'Tetris well column')}:{}),role:m.role,target:lessonPose(m.target,'Double Well target',height),clears:integer(m.clears,0,4,'Double Well clears'),note:String(m.note||'').slice(0,500)};}
 if(raw.accommodation){const m=raw.accommodation;if(raw.chapter!=='Clean stacking')throw Error('Accommodation belongs to Clean stacking.');const orientation=integer(m.orientation,0,3,'Accommodation orientation'),target=lessonPose(m.target,'Accommodation landing',height);if(target.rotation!==orientation||!Array.isArray(m.surface)||!Array.isArray(m.heights)||m.surface.length!==m.heights.length)throw Error('Invalid accommodation profile.');result.accommodation={orientation,target,surface:m.surface.map(p=>[integer(p[0],0,9,'Surface x'),integer(p[1],0,height-1,'Surface y')]),heights:m.heights.map(h=>integer(h,0,3,'Surface height'))};}
 if(raw.adjustment){const m=raw.adjustment;result.adjustment={default:lessonPose(m.default,'Default position',height),adjusted:lessonPose(m.adjusted,'Adjusted position',height),next:lessonPose(m.next,'Next position',height)};if(m.alternatives){if(!Array.isArray(m.alternatives)||m.alternatives.length>7)throw Error('Invalid next-piece alternatives.');result.adjustment.alternatives=m.alternatives.map(a=>({...lessonPose(a,'Alternative next position',height),...(a.adjusted?{adjusted:lessonPose(a.adjusted,'Alternative current position',height)}:{})}));}}
 return result;
}
function compact(raw){
 const s=normalize(raw),backgrounds=s.frames.map(f=>compose({...f,active:undefined},s.height).map(row=>row.join('')));
 const first=backgrounds[0];let top=0;while(top<first.length&&first[top]==='..........')top++;
 const out={title:s.title};if(s.qualityWell!==undefined)out.qualityWell=s.qualityWell;if(s.motionVerified)out.motionVerified=true;if(s.chapter)out.chapter=s.chapter;if(s.tuck)out.tuck=clone(s.tuck);if(s.accommodation)out.accommodation=clone(s.accommodation);if(s.doubleWell)out.doubleWell=clone(s.doubleWell);if(s.section)out.section=s.section;if(s.adjustment)out.adjustment=clone(s.adjustment);if(s.description)out.description=s.description;if(s.height!==18)out.height=s.height;
 out.stack=first.slice(top);
 const sharedMotif=s.frames.find(f=>f.motif?.cells.length&&f.motif.cells.every(([x,y])=>first[y][x]!=='.'))?.motif.cells||[];
 const sharedMandatory=s.frames.find(f=>f.motif&&f.motif.cells===sharedMotif)?.motif.mandatory||[];
 const motifKey=points=>points.map(p=>p.join(',')).sort().join(';'),sharedKey=motifKey(sharedMotif);
 for(const[x,y]of sharedMotif){const row=[...out.stack[y-top]];row[x]=row[x].toLowerCase();out.stack[y-top]=row.join('');}
 const sharedCounter=s.frames.find(f=>f.counterMotif?.cells.length&&f.counterMotif.cells.every(([x,y])=>first[y][x]==='.'))?.counterMotif.cells||[];
 for(const[x,y]of sharedCounter){if(y<top){out.stack=first.slice(y,top).concat(out.stack);top=y;}const row=[...out.stack[y-top]];row[x]=',';out.stack[y-top]=row.join('');}
 for(const[x,y]of sharedMandatory){const row=[...out.stack[y-top]];row[x]='$';out.stack[y-top]=row.join('');}
 out.stack=out.stack.map(row=>row.replace(/L/g,'S').replace(/l/g,'s'));
 const types=[...new Set(s.frames.filter(f=>f.active).map(f=>f.active.type))];
 if(types.length===1)out.piece=types[0];
 const baseOverrides=s.frames[0].tileOverrides||[];if(baseOverrides.length)out.tileOverrides=clone(baseOverrides);
 let previous=first;
 out.frames=s.frames.map((f,n)=>{
  const result={};if(f.caption)result.caption=f.caption;if(f.ticks!==(f.clear?LINE_CLEAR.ticks:30))result.ticks=f.ticks;if(f.clear)result.clear=true;
  const expected=f.clear&&n?(s.frames[n-1].clear?clearAfterBoard(s.frames[n-1],s.height):compose(s.frames[n-1],s.height)).map(row=>row.join('')):previous;
  if(!n){const rows=Object.fromEntries(first.map((row,y)=>[y,row]).filter(([y,row])=>row.includes('S')));if(Object.keys(rows).length)result.rows=rows;}
  if(n){const rows={};backgrounds[n].forEach((row,y)=>{if(row!==expected[y])rows[y]=row;});if(Object.keys(rows).length)result.rows=rows;}
  previous=f.clear?clearAfterBoard(f,s.height).map(row=>row.join('')):backgrounds[n];
  if(f.active){const a=f.active,active={};if(!out.piece)active.type=a.type;active.x=a.x;active.y=a.y;if(a.rotation)active.rotation=a.rotation;if(a.pivot!==undefined)active.pivot=a.pivot;result.active=active;}
  for(const key of ['referenceGhost','ghost','ghostBlink','nextBlink','showNext','placementHighlights','placementColors','placementBlink','hold','lessonStage'])if(f[key]!==undefined)result[key]=clone(f[key]);
  if(f.next!=='T')result.next=f.next;
  if(f.animate&&f.animationFrom&&n&&s.frames[n-1].active?.type!==f.active.type)result.animationFrom=clone(f.animationFrom);
  if(f.buttons.length)result.buttons=clone(f.buttons);
  if(f.buttonOptions)result.buttonOptions=clone(f.buttonOptions);
  if(f.animate)result.animate=true;
  if(f.fallFirst!==undefined)result.fallFirst=f.fallFirst;
  if(f.highlight!==undefined)result.highlight=f.highlight;
  if(f.blink)result.blink=true;
  if(f.mandatoryAfter!==undefined)result.mandatoryAfter=f.mandatoryAfter;
  if(f.reveal)result.reveal=f.reveal;
  if(f.intro)result.intro=true;
  if(f.step)result.step=f.step;
  if(f.example)result.example=f.example;
  if(f.trigger)result.trigger=clone(f.trigger);
  if(f.counterMotif)result.counterMotif=motifKey(f.counterMotif.cells)===motifKey(sharedCounter)?true:clone(f.counterMotif);
  if(f.motif?.cells.length){const shared=motifKey(f.motif.cells)===sharedKey;result.motif=shared?{}:{cells:clone(f.motif.cells)};if(f.motif.space){result.motif.space=true;if(motifKey(f.motif.cells)===motifKey(sharedCounter))delete result.motif.cells;}if(f.motif.color!=='#e7a52b')result.motif.color=f.motif.color;const expected=sharedMandatory.filter(p=>f.motif.cells.some(q=>p[0]===q[0]&&p[1]===q[1]));if(motifKey(f.motif.mandatory||[])!==motifKey(expected))result.motif.mandatory=clone(f.motif.mandatory||[]);if(shared&&!Object.keys(result.motif).length)result.motif=true;}
  const overrides=f.tileOverrides||[];if(!f.clear&&JSON.stringify(overrides)!==JSON.stringify(baseOverrides))result.tileOverrides=clone(overrides);
  return result;
 });return out;
}
function compactData(value){
 if(Array.isArray(value))return value.map(compact);
 if(value&&Array.isArray(value.situations))return{situations:value.situations.map(compact)};
 return compact(value);
}
function parseCollection(v){const list=Array.isArray(v)?v:(v&&Array.isArray(v.situations)?v.situations:[v]);if(!list.length||list.length>1000)throw Error('Import 1–1000 situations at a time.');return list.map(normalize);}
function makeFrame(board,caption,buttons=[],ticks=30,extra={}){return{board:board.map(r=>typeof r==='string'?r:r.join('')),caption,buttons,ticks,score:0,level:0,lines:0,next:'T',...extra};}
function demos(){
 const source=typeof module!=='undefined'?require('./situations.js'):root.TetrisSituations;
 if(!source)throw Error('situations.js is missing. Keep it beside index.html.');
 return parseCollection(source);
}
const api={spawn,rotationInputs,nativeTurn,ENTRY_DELAY,frameAt,LINE_CLEAR,fullRows,collapseRows,clearAfterBoard,displayTiles,compact,compactData,STATES,STATE_LAYOUTS,pieceLayout,pivotCell,ROM,I_TILE_IDS,visualTiles,TYPES,KEYS,HZ,SHAPES,TILES,clone,empty,cells,compose,normalize,parseCollection,makeFrame,demos};
if(typeof module!=='undefined')module.exports=api;root.TetrisCore=api;
})(typeof window!=='undefined'?window:globalThis);
