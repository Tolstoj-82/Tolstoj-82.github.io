(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore,H=typeof module!=='undefined'?require('./placement-hint.js'):root.TetrisPlacementHint;
const copy=value=>value===undefined?undefined:C.clone(value),footprint=a=>a?C.cells(a.type,a.rotation).map(([dx,dy])=>(a.x+dx)+','+(a.y+dy)).sort().join(';'):'';
const COLLECTION_MAX_HEIGHT=8;
function stackHeight(board){const first=board.findIndex(row=>[...row].some(c=>c!=='.'));return first<0?0:board.length-first;}
function withinCollectionHeight(record,maxHeight=COLLECTION_MAX_HEIGHT){return stackHeight(record.board)<=maxHeight&&!record.hiddenRows?.some(row=>[...row].some(c=>c!=='.'));}
function label(a){if(!a)return 'No verified placement';const columns=[...new Set(C.cells(a.type,a.rotation).map(([dx])=>a.x+dx+1))].sort((a,b)=>a-b);return a.type+(['L','J','T'].includes(a.type)?['d','l','u','r'][a.rotation]:'')+' '+columns.map(c=>c===10?'0':c).join('');}
function nextBoard(record){const frame={board:record.board,active:record.recommended,tileOverrides:record.tileOverrides},tiles=C.visualTiles(frame,18),board=C.compose(frame,18),rows=C.fullRows(board),overrides=[];board.forEach((row,y)=>row.forEach((c,x)=>{if(c==='I'&&!rows.includes(y))overrides.push({x,y:y+rows.filter(row=>row>y).length,tile:tiles[y][x]});}));return {board:rows.length?C.collapseRows(board,rows):board,tileOverrides:overrides,cleared:rows.length};}
class MistakeJournal{
 constructor({clientFactory=(receive,fail)=>H.createClient(receive,fail),onChange=()=>{},acceptPlacement=()=>false,maxHeight=COLLECTION_MAX_HEIGHT}={}){this.maxHeight=maxHeight;this.acceptPlacement=acceptPlacement;this.entries=[];this.queue=[];this.activeJob=null;this.serial=0;this.onChange=onChange;this.client=clientFactory((result,snapshot)=>this.receive(result,snapshot),()=>this.receive(null,{journalId:this.activeJob?.id}));}
 record(record){
  if(!withinCollectionHeight(record,this.maxHeight))return null;
  if(this.acceptPlacement(record.board,record.actual,record.nextType))return null;
  if(!record.actual||!record.recommended||record.actual.type!==record.recommended.type||footprint(record.actual)===footprint(record.recommended))return null;
  const signature=record.board.map(row=>[...row].join('')).join('/')+'|'+record.actual.type+'|'+footprint(record.actual)+'|'+footprint(record.recommended)+'|'+(record.next?.type||record.nextType)+'|'+footprint(record.next);
  const existing=this.entries.find(entry=>entry.signature===signature);if(existing){existing.count++;this.onChange();return existing;}
  const entry={...copy(record),id:++this.serial,count:1,signature};this.entries.push(entry);this.onChange();return entry;
 }
 watch(game){
  this.stopWatching();const journal=this,originalGuard=game.lockGuard,originalSpawn=game.onSpawn;
  let snapshot;function capture(){if(!game.active)return;snapshot={reviewId:game.reviewId,placementIndex:game.pieces,board:copy(game.board),tileOverrides:copy(game.tileOverrides),hiddenRows:copy(game.hiddenRows),active:C.spawn(game.active.type),nextPiece:game.nextPiece,gravityFrames:Math.round(game.gravity*C.HZ/1000),elapsedFrames:0,level:game.level,heart:game.heart,lines:game.lines,displayLevel:game.displayLevel};}
  const guard=placement=>{if(originalGuard&&originalGuard.call(game,placement)===false)return false;if(snapshot)journal.enqueue({...copy(snapshot),actual:copy(placement)});return true;};
  const spawnHook=()=>{originalSpawn?.call(game);capture();};game.lockGuard=guard;game.onSpawn=spawnHook;capture();
  this.detach=()=>{if(game.lockGuard===guard){if(originalGuard)game.lockGuard=originalGuard;else delete game.lockGuard;}if(game.onSpawn===spawnHook){if(originalSpawn)game.onSpawn=originalSpawn;else delete game.onSpawn;}};
 }
 stopWatching(){this.detach?.();this.detach=null;}
 enqueue(snapshot){if(!withinCollectionHeight(snapshot,this.maxHeight))return;const job={id:++this.serial,snapshot};this.queue.push(job);this.onChange();this.pump();}
 pump(){if(this.activeJob||!this.queue.length)return;this.activeJob=this.queue.shift();this.client.request({...this.activeJob.snapshot,journalId:this.activeJob.id});}
 receive(result,snapshot){if(!this.activeJob||snapshot.journalId!==this.activeJob.id)return;const job=this.activeJob;this.activeJob=null;if(result?.placement)this.record({reviewId:job.snapshot.reviewId,placementIndex:job.snapshot.placementIndex,board:job.snapshot.board,tileOverrides:job.snapshot.tileOverrides,actual:job.snapshot.actual,recommended:result.placement,next:result.next||null,nextType:job.snapshot.nextPiece,gravityFrames:job.snapshot.gravityFrames,level:job.snapshot.level,displayLevel:job.snapshot.displayLevel});this.onChange();this.pump();}
 remove(id){const i=this.entries.findIndex(e=>e.id===id);if(i<0)return;this.entries.splice(i,1);this.onChange();}
 move(id,delta){const i=this.entries.findIndex(e=>e.id===id),to=i+delta;if(i<0||to<0||to>=this.entries.length)return;const [entry]=this.entries.splice(i,1);this.entries.splice(to,0,entry);this.onChange();}
 get pending(){return this.queue.length+(this.activeJob?1:0);}
 cancelPending(){this.client.stop();this.queue=[];this.activeJob=null;this.serial++;}
 clear(){this.client.stop();this.queue=[];this.activeJob=null;this.entries=[];this.serial++;this.onChange();}
 dispose(){this.stopWatching();this.client.stop();this.queue=[];this.activeJob=null;}
}
// Records committed locks without pausing play or running an advisor during the game.
class GameReview{
 constructor({clientFactory=(receive,fail)=>H.createClient(receive,fail),onRecord=()=>{},onProgress=()=>{},maxHeight=COLLECTION_MAX_HEIGHT}={}){this.maxHeight=maxHeight;this.skippedHeight=0;this.placements=[];this.status='idle';this.completed=0;this.total=0;this.failed=0;this.onRecord=onRecord;this.onProgress=onProgress;this.serial=0;this.client=clientFactory((r,s)=>this.receive(r,s),()=>this.receive(null,{reviewToken:this.serial}));}
 watch(game){this.detach?.();const review=this,original=game.lock;const hook=function(){const actual=copy(game.active),snapshot=actual&&{reviewId:game.reviewId,placementIndex:review.placements.length,board:copy(game.board),hiddenRows:copy(game.hiddenRows),tileOverrides:copy(game.tileOverrides),active:C.spawn(actual.type),actual,nextPiece:game.nextPiece,gravityFrames:Math.round(game.gravity*C.HZ/1000),elapsedFrames:0,level:game.level,heart:game.heart,lines:game.lines,displayLevel:game.displayLevel},before=game.pieces;const result=original.call(game);if(snapshot&&game.pieces>before)review.record(snapshot);return result;};game.lock=hook;this.detach=()=>{if(game.lock===hook)game.lock=original;};}
 record(snapshot){if(this.status==='idle'&&snapshot?.actual)this.placements.push(copy(snapshot));}
 start({excludeLast=2}={}){if(this.status!=='idle')return;this.detach?.();this.detach=null;const candidates=this.placements.slice(0,Math.max(0,this.placements.length-excludeLast));this.queue=candidates.filter(record=>withinCollectionHeight(record,this.maxHeight));this.skippedHeight=candidates.length-this.queue.length;this.total=this.queue.length;this.completed=0;this.status=this.total?'running':'done';if(!this.total){this.finish();return;}this.onProgress();this.pump();}
 finish(){this.client.stop();this.placements=[];this.queue=[];this.current=null;this.status='done';this.onProgress();}
 pump(){if(this.status!=='running')return;if(!this.queue.length){this.finish();return;}this.current=this.queue.shift();const token=++this.serial;this.client.request({...copy(this.current),analysis:'review',reviewToken:token});}
 receive(result,snapshot){if(this.status!=='running'||snapshot.reviewToken!==this.serial||!this.current)return;const job=this.current;this.current=null;if(result?.placement)this.onRecord({reviewId:job.reviewId,placementIndex:job.placementIndex,board:job.board,tileOverrides:job.tileOverrides,actual:job.actual,recommended:result.placement,next:result.next||null,nextType:job.nextPiece,gravityFrames:job.gravityFrames,level:job.level,displayLevel:job.displayLevel});else this.failed++;this.completed++;this.onProgress();this.pump();}
 cancel(){this.serial++;this.client.stop();this.queue=[];this.current=null;this.status='idle';this.completed=0;this.total=0;this.failed=0;this.skippedHeight=0;this.onProgress();}
 dispose(){this.detach?.();this.detach=null;this.serial++;this.client.stop();this.placements=[];this.queue=[];this.current=null;this.status='cancelled';}
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function notationText(text){return escape(text).replace(/\b([LJT])([dlur])(?=\s)/g,'$1<tspan baseline-shift="sub" font-size="70%">$2</tspan>');}
// Small lossless PNG encoder. Stored DEFLATE blocks need no browser or dependencies.
function png(width,height,pixels){
 const bytes=[],u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
 function chunk(type,data){const t=[...type].map(c=>c.charCodeAt(0)),all=[...t,...data];let crc=0xffffffff;for(const n of all){crc^=n;for(let b=0;b<8;b++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}bytes.push(...u32(data.length),...all,...u32((crc^0xffffffff)>>>0));}
 bytes.push(137,80,78,71,13,10,26,10);chunk('IHDR',[...u32(width),...u32(height),8,2,0,0,0]);
 const raw=[];for(let y=0;y<height;y++){raw.push(0);for(let x=0;x<width;x++)raw.push(...pixels[y*width+x]);}
 const zipped=[120,1];for(let i=0;i<raw.length;i+=65535){const part=raw.slice(i,i+65535),n=part.length;zipped.push(i+n===raw.length?1:0,n&255,n>>>8,(~n)&255,((~n)>>>8)&255,...part);}
 let a=1,b=0;for(const n of raw){a=(a+n)%65521;b=(b+a)%65521;}zipped.push(...u32(((b<<16)|a)>>>0));chunk('IDAT',zipped);chunk('IEND',[]);
 const binary=bytes.map(n=>String.fromCharCode(n)).join('');return 'data:image/png;base64,'+(typeof btoa==='function'?btoa(binary):Buffer.from(bytes).toString('base64'));
}
function svg(record,{fontData=root.TetrisImageFont||''}={}){
 const shades=[[166,183,121],[130,149,96],[83,108,62],[38,53,30]],bg=[187,201,145];
 function tile(pixels,width,height,id,x,y){const pattern=C.ROM.tiles[id];for(let py=0;py<8;py++)for(let px=0;px<8;px++)if(x+px>=0&&x+px<width&&y+py>=0&&y+py<height)pixels[(y+py)*width+x+px]=shades[+pattern[py][px]].slice();}
 function board(frame,red,green){const pixels=Array.from({length:96*144},()=>shades[0].slice());C.ROM.aTypeMap.forEach((id,i)=>{const x=(i%20)*8-8,y=Math.floor(i/20)*8;if(x>=0&&x<96&&y<144)tile(pixels,96,144,id,x,y);});C.displayTiles({...frame,highlight:false},18,0).forEach((row,y)=>row.forEach((id,x)=>tile(pixels,96,144,id,8+x*8,y*8)));
  for(const [pose,color]of [[red,[224,68,68]],[green,[53,163,92]]])if(pose)for(const[dx,dy]of C.cells(pose.type,pose.rotation))for(let py=0;py<8;py++)for(let px=0;px<8;px++){const x=8+(pose.x+dx)*8+px,y=(pose.y+dy)*8+py;if(x>=8&&x<88&&y>=0&&y<144){const i=y*96+x;pixels[i]=pixels[i].map((n,k)=>Math.round(n*.6+color[k]*.4));}}
  return '<image width="96" height="144" href="'+png(96,144,pixels)+'" style="image-rendering:pixelated"/>';
 }
 function nextBox(type){const pixels=Array.from({length:48*32},()=>bg.slice()),cells=C.cells(type,0),minX=Math.min(...cells.map(c=>c[0])),maxX=Math.max(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1])),maxY=Math.max(...cells.map(c=>c[1])),left=(48-(maxX-minX+1)*8)/2,top=(32-(maxY-minY+1)*8)/2;
  for(const[x,y]of cells)tile(pixels,48,32,C.ROM.minoIds[type],left+(x-minX)*8,top+(y-minY)*8);
  // Preserve the I's proper horizontal ROM segments rather than repeating its dotted middle.
  if(type==='I'){const f={board:C.empty(18),active:{...C.spawn(type),x:0,y:0}},tiles=C.visualTiles(f,18);for(const[x,y]of cells)tile(pixels,48,32,tiles[y][x],left+(x-minX)*8,top+(y-minY)*8);}
  return '<g data-next-box="true"><rect x="61" y="6" width="26" height="27" rx="2.5" fill="#bbc991" stroke="#536c3e" stroke-width="1.3"/><text x="74" y="13" text-anchor="middle" font-size="4.3" font-weight="600" fill="#536c3e">NEXT</text><image x="63" y="15" width="22" height="15" href="'+png(48,32,pixels)+'" style="image-rendering:pixelated"/></g>';
 }
 const after=nextBoard(record),first=C.spawn(record.actual.type),panels=[{title:'This and next',frame:{board:record.board,active:first,tileOverrides:record.tileOverrides},red:first,green:null},{title:'Best placements',frame:{board:after.board,active:record.next||undefined,tileOverrides:after.tileOverrides},red:after.cleared?null:record.recommended,green:record.next}];
 let body='<rect width="432" height="382" fill="#fff"/><text x="16" y="26" font-size="17" font-weight="600">'+notationText(label(record.recommended)+' → '+(record.next?label(record.next):record.nextType))+'</text>';
 panels.forEach((p,i)=>{const x=16+i*208;body+='<text x="'+x+'" y="53" font-size="14" font-weight="600">'+p.title+'</text><svg x="'+x+'" y="64" width="192" height="288" viewBox="0 0 96 144" data-panel="'+i+'">'+board(p.frame,p.red,p.green)+(i===0?nextBox(record.nextType):'')+'</svg>';});
 body+='<text x="16" y="375" font-size="11">Level '+escape(record.displayLevel??record.level??0)+'</text>';
 const font=fontData?'<style>@font-face{font-family:Outfit;src:url("'+fontData+'") format("truetype");font-weight:100 900}</style>':'';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="432" height="382" viewBox="0 0 432 382" font-family="Outfit,sans-serif" fill="#334155"><title>Missed placement: current and next</title><defs>'+font+'</defs>'+body+'</svg>';
}

function isOpenerPlacement(situations,board,actual,nextType){
 if(!actual)return false;const mask=b=>b.map(r=>[...r].map(c=>c==='.'?'.':'#').join('')).join('/'),empty=board.every(r=>[...r].every(c=>c==='.'));
 return situations.some(s=>{const a=s.adjustment;if(!a)return false;const first=C.compose({board:C.empty(18),active:a.adjusted},18),rows=C.fullRows(first),afterFirst=rows.length?C.collapseRows(first,rows):first,combined=C.compose({board:afterFirst,active:a.next},18),clears=C.fullRows(combined),target=clears.length?C.collapseRows(combined,clears):combined;
  if(empty){if(actual.type!==a.adjusted.type||nextType!==a.next.type)return false;if(footprint(actual)===footprint(a.adjusted))return true;if(actual.type!==a.next.type)return false;
   const placed=C.compose({board,active:actual},18),missing=[];for(let y=0;y<18;y++)for(let x=0;x<10;x++){if(placed[y][x]!=='.'&&target[y][x]==='.')return false;if(placed[y][x]==='.'&&target[y][x]!=='.')missing.push(x+','+y);}if(missing.length!==4)return false;const wanted=missing.sort().join(';');return H.explore(placed,C.spawn(nextType)).some(p=>footprint(p)===wanted&&H.plan(placed,C.spawn(nextType),p,{gravityFrames:53,record:false}));
  }
  if(actual.type!==a.next.type)return false;const occupied=board.flatMap(row=>[...row].filter(c=>c!=='.'));if(occupied.length!==4||a.adjusted.type!==a.next.type&&mask(board)!==mask(afterFirst))return false;const placed=C.compose({board,active:actual},18),cleared=C.fullRows(placed);return mask(cleared.length?C.collapseRows(placed,cleared):placed)===mask(target);
 });
}

const api={COLLECTION_MAX_HEIGHT,stackHeight,withinCollectionHeight,png,isOpenerPlacement,MistakeJournal,GameReview,nextBoard,label,svg};if(typeof module!=='undefined')module.exports=api;else root.TetrisMistakeJournal=api;
})(globalThis);
