(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore;
// Self-contained so the exact same search can run in a Blob worker on file://.
function createEngine(model){
 const shapes=model.shapes,spawn=model.spawn,turns=model.turns;
 const spawnProfiles=Object.keys(shapes).map(type=>({type,cells:shapes[type][0].map(([dx,dy])=>[spawn[type].x+dx,spawn[type].y+dy])}));
 const spawnBand=Math.max(...spawnProfiles.flatMap(p=>p.cells.map(([,y])=>y)))+1;
 const same=(a,b)=>a.x===b.x&&a.y===b.y&&a.rotation===b.rotation;
 const key=a=>a.x+','+a.y+','+a.rotation;
 function fits(board,a,hidden){return shapes[a.type][a.rotation].every(([dx,dy])=>{const x=a.x+dx,y=a.y+dy;return x>=0&&x<10&&y>=-2&&y<18&&(y<0?(!hidden||hidden[y+2][x]==='.'):board[y][x]==='.');});}
 function move(a,action){const p={...a};if(action==='left')p.x--;else if(action==='right')p.x++;else if(action==='down')p.y++;else p.rotation=turns[a.type][a.rotation][action];return p;}
 function explore(board,active,hidden,target){
  if(!fits(board,active,hidden))return target?null:[];
  const nodes=[{a:{...active},parent:-1,action:null}],seen=new Set([key(active)]),landings=[];
  for(let i=0;i<nodes.length;i++){
   const node=nodes[i],a=node.a;
   if(target&&same(a,target)){const path=[];for(let n=i;nodes[n].parent>=0;n=nodes[n].parent)path.push({action:nodes[n].action,a:nodes[n].a});return path.reverse();}
   if(!target&&!fits(board,move(a,'down'),hidden)&&shapes[a.type][a.rotation].every(([,dy])=>a.y+dy>=0))landings.push(a);
   for(const action of ['left','right','a','b','down']){const next=move(a,action),k=key(next);if(!seen.has(k)&&fits(board,next,hidden)){seen.add(k);nodes.push({a:next,parent:i,action});}}
  }
  return target?null:landings;
 }
 // Construct and replay a conservative tapping route, with gravity on every native frame.
 // A failed route is omitted rather than advertised as an achievable placement.
 function plan(board,active,target,{gravityFrames=53,elapsedFrames=0,hiddenRows=null,tapFrames=5,record=true}={}){
  if(!active||active.type!==target.type)return null;
  let a={...active},route=explore(board,a,hiddenRows,target),index=0,cooldown=0,phase=elapsedFrames,reroutes=0;
  if(!route)return null;const inputs=[],positions=[],g=Math.max(1,gravityFrames);
  for(let frame=0;frame<22*g+120;frame++){
   let action=null;
   if(index<route.length&&route[index].action!=='down'&&cooldown<=0)action=route[index].action;
   if(action){const next=move(a,action);if(!fits(board,next,hiddenRows))return null;a=next;cooldown=tapFrames;}
   cooldown--;if(index<route.length&&same(a,route[index].a))index++;
   phase++;let locked=false;
   if(phase+1e-7>=g){phase=Math.max(0,phase-g);const down=move(a,'down');if(fits(board,down,hiddenRows))a=down;else locked=true;}
   if(record){inputs.push(action);positions.push({...a});}
   if(locked)return same(a,target)?{inputs,positions,frames:frame+1}:null;
   if(index<route.length&&same(a,route[index].a))index++;
   else if(index<route.length&&phase<1e-6&&route[index].action!=='down'){
    if(++reroutes>6)return null;route=explore(board,a,hiddenRows,target);index=0;if(!route)return null;
   }
  }
  return null;
 }
 function apply(board,a){const b=board.map(r=>[...r]);for(const[dx,dy]of shapes[a.type][a.rotation]){if(a.y+dy<0)return null;b[a.y+dy][a.x+dx]=a.type;}const rows=[];for(let y=0;y<18;y++)if(b[y].every(c=>c!=='.'))rows.push(y);const kept=b.filter((_,y)=>!rows.includes(y));while(kept.length<18)kept.unshift(Array(10).fill('.'));return {board:kept,cleared:rows.length};}
 // Independent GB evaluation informed by StackRabbit's feature-based design.
 // These weights are calibrated locally, not its NES coefficients or learned ranks.
 function features(board){
  const heights=Array(10).fill(0);let holes=0,burial=0,parity=0,blockers=0;
  for(let x=0;x<10;x++){let above=0;for(let y=0;y<18;y++){if(board[y][x]!=='.'){if(!above)heights[x]=18-y;above++;parity+=(x+y)%2?1:-1;if(x===0)blockers++;}else if(above){holes++;burial+=above;}}}
  const max=Math.max(...heights),average=heights.slice(1).reduce((a,b)=>a+b,0)/9;
  let surface=0,dependencies=0,flat=false;
  for(let x=1;x<9;x++){const d=heights[x]-heights[x+1];surface+=Math.abs(d)**1.5;if(!d)flat=true;}
  for(let x=1;x<10;x++){const depth=Math.min(heights[x-1],x===9?18:heights[x+1])-heights[x];if(depth>=2)dependencies+=(depth===2?1:3*(depth-2)+2);}
  const base=heights[0];let readyRows=0,missing=0;
  for(let y=17-base;y>=0;y--){if(board[y][0]!=='.'||board[y].slice(1).some(c=>c==='.'))break;readyRows++;}
  for(let y=Math.max(0,14-base);y<18-base;y++)for(let x=1;x<10;x++)if(board[y][x]==='.')missing++;
  // Measure actual downward room from every ROM-defined spawn footprint.
  // This includes the lower GB spawn band, rather than treating all 18 rows as fall time.
  let spawnClearance=18,blockedSpawns=0;
  for(const profile of spawnProfiles){let free=18,blocked=false;for(const[x,y]of profile.cells){if(board[y]?.[x]!=='.')blocked=true;const top=18-heights[x];let distance=top-y-1;if(top<=y){let row=y+1;while(row<18&&board[row][x]==='.')row++;distance=row-y-1;}free=Math.min(free,distance);}if(blocked){blockedSpawns++;free=-1;}spawnClearance=Math.min(spawnClearance,free);}
  return {heights,max,average,holes,burial,parity,blockers,base,readyRows,missing,surface,dependencies,flat,spawnClearance,blockedSpawns,ready:readyRows>=4};
 }
 function tetrisReadiness(board){const f=features(board);return {blockers:f.blockers,holes:f.holes,readyRows:f.readyRows,missing:f.missing,ready:f.ready&&f.blockers===0};}
 function context(board,{gravityFrames=53}={}){const f=features(board),reserveRows=gravityFrames<4?8:gravityFrames<8?7:6,safeHeight=18-spawnBand-reserveRows;return {mode:f.max>=safeHeight+2||f.spawnClearance<=reserveRows-2||f.average>=7.5?'survival':f.holes?'dig':'tetris',safeHeight,reserveRows,spawnBand};}
 function evaluate(board,ctx=context(board)){
  const f=features(board),recover=ctx.mode!=='tetris';
  const excess=Math.max(0,f.average-4.5),heightDanger=Math.max(0,f.max-ctx.safeHeight),spawnDanger=Math.max(0,ctx.reserveRows-f.spawnClearance);
  const covered=f.blockers?Math.max(1,f.base/4)**2:0;
  const rightLow=Math.max(0,f.heights[8]-f.heights[9]);
  const builtRight=Math.max(-4,Math.min(4,f.heights[9]-f.average));
  return -f.holes*140-f.burial*3-f.surface*2.6-f.dependencies*9-(f.flat?0:16)
   -excess**2*10-heightDanger**2*10-spawnDanger**2*14-f.blockedSpawns*1000-f.average*1.5-Math.abs(f.parity)*.5
   -covered*(recover?9:32)-f.blockers*(recover?2:12)-rightLow**2*5+builtRight
   +(f.ready?38:0)+Math.min(4,f.readyRows)*5-f.missing*.9;
 }
 function accommodation(board){let count=0;for(const type of Object.keys(shapes)){let found=false;for(let r=0;r<shapes[type].length&&!found;r++)for(let x=-2;x<10&&!found;x++){let a={...spawn[type],rotation:r,x};if(!fits(board,a))continue;while(fits(board,move(a,'down')))a=move(a,'down');const cells=shapes[type][r];found=cells.every(([dx,dy])=>cells.some(([cx,cy])=>cx===dx&&cy===dy+1)||a.y+dy===17||(a.y+dy+1>=0&&board[a.y+dy+1]?.[a.x+dx]!=='.'));}if(found)count++;}return count;}
 function reward(n,ctx){return n===4?240:n*(ctx.mode==='survival'?32:ctx.mode==='dig'?12:-18);}
 function nextTiming(snapshot,cleared){const level=snapshot.level??0,lines=(snapshot.lines??0)+cleared,nextLevel=level<20&&lines<1000&&Math.floor(lines/10)>level?level+1:level;return {level:nextLevel,lines,gravityFrames:nextLevel===21?2:nextLevel===22?1:model.gravity[Math.min(20,nextLevel+(snapshot.heart?10:0))],heart:!!snapshot.heart};}
 function diverseShortlist(pairs,firstLimit=5,perFirst=2){
  const groups=new Map();for(const p of [...pairs].sort((a,b)=>b.value-a.value)){const k=key(p.placement);if(!groups.has(k))groups.set(k,[]);if(groups.get(k).length<perFirst)groups.get(k).push(p);}
  return [...groups.values()].sort((a,b)=>b[0].value-a[0].value).slice(0,firstLimit).flat();
 }
 // Distribution of the next hidden candidate under independent uniform candidate reads.
 // Matches the GB OR-rejection rule, not a bag or the NES randomizer. The actual
 // timer-based cartridge process is not claimed to be an independent Markov chain.
 function futureProbabilities(current,next){
  const order=Object.keys(shapes),c=order.indexOf(current)<<2,n=order.indexOf(next)<<2;
  const rejected=order.map((_,i)=>(c|n|(i<<2))===c),q=rejected.filter(Boolean).length/7;
  return order.map((type,i)=>({type,weight:(rejected[i]?q*q:1+q+q*q)/7}));
 }
 function quantile(distribution,q){let sum=0;for(const item of distribution){sum+=item.weight;if(q<sum)return item.type;}return distribution.at(-1).type;}
 function futureScenarios(current,next,depth=2){
  const out=[];for(const item of futureProbabilities(current,next))for(const q of depth===2?[.25,.75]:[.5])out.push({pieces:depth===2?[item.type,quantile(futureProbabilities(next,item.type),q)]:[item.type],weight:item.weight/(depth===2?2:1)});return out;
 }
 function rolloutStep(board,type,timing,hiddenRows,ctx){
  const moves=[];
  for(let rotation=0;rotation<shapes[type].length;rotation++){
   const shape=shapes[type][rotation],min=Math.min(...shape.map(p=>p[0])),max=Math.max(...shape.map(p=>p[0]));
   for(let x=-min;x+max<10;x++){const a={...spawn[type],rotation,x};if(!fits(board,a,hiddenRows))continue;while(fits(board,{...a,y:a.y+1},hiddenRows))a.y++;if(shape.some(([,dy])=>a.y+dy<0))continue;const result=apply(board,a);moves.push({a,result,value:evaluate(result.board,ctx)+reward(result.cleared,ctx)});}
  }
  moves.sort((a,b)=>b.value-a.value);
  for(const m of moves)if(plan(board,spawn[type],m.a,{...timing,elapsedFrames:0,hiddenRows,record:false}))return m;
  // Digging sometimes needs a tuck. Expand geometric routes only when simple drops fail.
  for(const a of explore(board,spawn[type],hiddenRows)){const result=apply(board,a);if(result)moves.push({a,result,value:evaluate(result.board,ctx)+reward(result.cleared,ctx)});}
  moves.sort((a,b)=>b.value-a.value);for(const m of moves)if(plan(board,spawn[type],m.a,{...timing,elapsedFrames:0,hiddenRows,record:false}))return m;
  return null;
 }
 function* search(snapshot){
  const {board,active,nextPiece,hiddenRows}=snapshot;if(!active)return null;
  const timing={gravityFrames:snapshot.gravityFrames,elapsedFrames:snapshot.elapsedFrames,hiddenRows},ctx=context(board,snapshot),first=explore(board,active,hiddenRows),pairs=[],firstPlans=new Map();
  for(const placement of first){
   const route=plan(board,active,placement,timing);if(!route){yield;continue;}firstPlans.set(key(placement),route);
   const after=apply(board,placement);if(!after)continue;
   const nextState=nextTiming(snapshot,after.cleared),seconds=explore(after.board,spawn[nextPiece],hiddenRows);
   for(const next of seconds){const result=apply(after.board,next);if(result)pairs.push({placement,next,nextState,nextGravity:nextState.gravityFrames,after,result,value:evaluate(result.board,ctx)+evaluate(after.board,ctx)*.1+reward(after.cleared,ctx)+reward(result.cleared,ctx)});}
   if(!seconds.length)pairs.push({placement,next:null,nextState,after,result:after,value:evaluate(after.board,ctx)-100000+reward(after.cleared,ctx)});
   yield;
  }
  // Preserve several distinct current moves, instead of filling the beam with
  // near-identical preview variations of one move.
  const grouped=new Map();for(const p of [...pairs].sort((a,b)=>b.value-a.value)){const k=key(p.placement);if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(p);}const valid=[];
  const currentTetris=pairs.some(p=>p.after.cleared===4);
  for(const group of grouped.values()){
   let retained=0;
   for(const p of group){
    if(currentTetris&&p.after.cleared!==4)continue;
    if(p.next&&!plan(p.after.board,spawn[nextPiece],p.next,{...timing,gravityFrames:p.nextGravity,elapsedFrames:0,record:false})){yield;continue;}
    p.value+=accommodation(p.result.board)*9;valid.push(p);yield;if(++retained===2)break;
   }
  }
  // If no shortlisted preview was reachable, broaden rather than pretending
  // that there is no legal recommendation.
  if(!valid.length){for(const p of [...pairs].sort((a,b)=>b.value-a.value)){if(currentTetris&&p.after.cleared!==4)continue;if(!p.next||plan(p.after.board,spawn[nextPiece],p.next,{...timing,gravityFrames:p.nextGravity,elapsedFrames:0})){valid.push(p);break;}yield;}}
  if(!valid.length)return null;
  const fast=snapshot.gravityFrames<4,review=snapshot.analysis==='review',candidates=diverseShortlist(valid,review?8:fast?4:5,review?3:2),depth=review?2:fast?1:2,scenarios=futureScenarios(active.type,nextPiece,depth);
  let branches=0,cacheHits=0;const rolloutCache=new Map();
  for(const p of candidates){
   if(!p.next){p.refined=p.value;continue;}
   let expected=0,worst=Infinity;
   const start=nextTiming(p.nextState,p.result.cleared);
   for(const scenario of scenarios){
    let futureBoard=p.result.board,futureState=start,earned=0,value=-100000;
    for(const type of scenario.pieces){const cacheKey=type+'|'+futureState.gravityFrames+'|'+futureBoard.map(row=>row.map(c=>c==='.'?'.':'#').join('')).join('/');let step;if(rolloutCache.has(cacheKey)){step=rolloutCache.get(cacheKey);cacheHits++;}else{step=rolloutStep(futureBoard,type,futureState,hiddenRows,ctx);rolloutCache.set(cacheKey,step);}branches++;if(!step){value=-100000;break;}earned+=reward(step.result.cleared,ctx);futureBoard=step.result.board;futureState=nextTiming(futureState,step.result.cleared);value=earned+evaluate(futureBoard,ctx);}
    expected+=scenario.weight*value;worst=Math.min(worst,value);yield;
   }
   // Common scenarios for every candidate: value is about the board, not lucky draws.
   // A modest downside term guards fragile setups; it is not a worst-case guarantee.
   p.refined=reward(p.after.cleared,ctx)+reward(p.result.cleared,ctx)+expected*.7+p.value*.3+Math.max(-400,worst)*.08;
  }
  candidates.sort((a,b)=>b.refined-a.refined);
  const p=candidates[0];return {placement:p.placement,next:p.next,value:p.refined,cleared:p.after.cleared,nextCleared:p.next?p.result.cleared:0,nextGravityFrames:p.nextGravity,readiness:tetrisReadiness(p.result.board),plan:firstPlans.get(key(p.placement)),considered:pairs.length,searchStats:{mode:ctx.mode,distinctCurrentMoves:new Set(candidates.map(p=>key(p.placement))).size,candidates:candidates.length,futureDepth:depth,scenarios:scenarios.length,branches,cacheHits,model:'GB OR rejection with independent uniform candidate reads'}};
 }
 function compute(snapshot){const job=search(snapshot);let n;do{n=job.next();}while(!n.done);return n.value;}
 return {fits,move,explore,plan,apply,evaluate,features,context,tetrisReadiness,accommodation,diverseShortlist,futureProbabilities,futureScenarios,search,compute};
}
const types=['L','J','I','O','Z','S','T'],counts={L:4,J:4,I:2,O:1,Z:2,S:2,T:4};
const model={gravity:[53,49,45,41,37,33,28,22,17,11,10,9,8,7,6,6,5,5,4,4,3],shapes:Object.fromEntries(types.map(t=>[t,Array.from({length:counts[t]},(_,r)=>C.cells(t,r))])),spawn:Object.fromEntries(types.map(t=>[t,C.spawn(t)])),turns:Object.fromEntries(types.map(t=>[t,Array.from({length:counts[t]},(_,r)=>({a:C.nativeTurn(t,r,'a'),b:C.nativeTurn(t,r,'b')}))]))};
const engine=createEngine(model);
function createClient(onResult,onError=()=>{}){
 let worker=null,url=null,job=null,timer=null,serial=0;
 function stop(){serial++;if(worker)worker.terminate();worker=null;if(url)URL.revokeObjectURL(url);url=null;if(timer!==null)clearTimeout(timer);timer=null;job=null;}
 function request(snapshot){stop();const id=serial;
  if(typeof root.Worker==='function'){
   try{url=URL.createObjectURL(new Blob(['const engine=('+createEngine.toString()+')('+JSON.stringify(model)+');onmessage=e=>{try{postMessage({result:engine.compute(e.data)});}catch(error){postMessage({error:String(error)});}};'],{type:'text/javascript'}));worker=new root.Worker(url);worker.onmessage=e=>{if(id!==serial)return;if(e.data.error)onError(e.data.error);else onResult(e.data.result,snapshot);};worker.onerror=()=>{if(id!==serial)return;stop();cooperative(snapshot,serial);};worker.postMessage(snapshot);return;}catch{stop();}
  }
  cooperative(snapshot,serial);
 }
 // Classic-script fallback also works without Worker support. Yield between candidates.
 function cooperative(snapshot,id){job=engine.search(snapshot);function step(){if(id!==serial||!job)return;try{const n=job.next();if(n.done){job=null;onResult(n.value,snapshot);}else timer=setTimeout(step,0);}catch(error){job=null;onError(String(error));}}timer=setTimeout(step,0);}
 return {request,stop};
}
const api={...engine,createClient,createEngine,model};if(typeof module!=='undefined')module.exports=api;else root.TetrisPlacementHint=api;
})(globalThis);
