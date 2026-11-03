const assert=require('node:assert/strict'),vm=require('node:vm'),C=require('../js/core'),P=require('../js/playable'),F=require('../js/free-play'),H=require('../js/placement-hint');
const frameMs=1000/C.HZ;
function snapshot(type,next,gravityFrames=53,board=C.empty(18),elapsedFrames=0){return {board,active:C.spawn(type),nextPiece:next,gravityFrames,elapsedFrames,hiddenRows:C.empty(2),level:gravityFrames===1?22:gravityFrames===2?21:gravityFrames===3?20:gravityFrames===11?9:0,lines:0,heart:false};}
function replay(s,target,plan){
 assert(plan,'a recommendation must have a replayable input plan');
 const game=new F.FreeGame({level:s.level,rng:new F.LfsrRandom({seed:'123456'})});game.board=C.clone(s.board);game.hiddenRows=C.clone(s.hiddenRows);game.active={...s.active};game.nextPiece=s.nextPiece;game.gravity=s.gravityFrames*frameMs;game.elapsed=s.elapsedFrames*frameMs;
 let locked=null;const lock=game.lock.bind(game);game.lock=()=>{locked={...game.active};lock();};
 const clock=new P.InputClock(game);
 for(const action of plan.inputs){clock.held.clear();if(action)clock.press(action);clock.advance(frameMs);}
 assert(locked,'plan must end by locking, without artificial hard drops');assert.equal(P.Attempt.prototype.fits.call({...game,board:s.board,hiddenRows:s.hiddenRows,height:18},target),true);
 assert.deepEqual(locked,target,'native InputClock and FreeGame must lock in the advertised pose');
 const rows=C.fullRows(game.board);assert.deepEqual(rows.length,H.apply(s.board,target).cleared);
 return game;
}
// Include high gravity and the frame immediately before a gravity tick.
for(const gravity of [53,11,3,2,1])for(const type of F.ORDER){
 const s=snapshot(type,'T',gravity,C.empty(18),gravity-1),result=H.compute(s);
 assert(result,type+' at gravity '+gravity+' should have a verified continuation');
 replay(s,result.placement,result.plan);
 const after=H.apply(s.board,result.placement);assert(result.next);const next={...s,board:after.board,active:C.spawn('T'),elapsedFrames:0};
 replay(next,result.next,H.plan(next.board,next.active,result.next,next));
}
console.log('PASS current and next placements replay through native input and gravity for all seven pieces at five speeds');
const well=C.empty(18);for(let y=14;y<18;y++)for(let x=1;x<10;x++)well[y][x]='L';
const tetris=snapshot('I','O',53,well),best=H.compute(tetris);assert.equal(best.cleared,4);replay(tetris,best.placement,best.plan);
const after=H.apply(well,best.placement);assert(after.board.every(row=>row.every(c=>c==='.')));assert(best.next.y>=15,'the next placement must use the collapsed board');
console.log('PASS Tetris preference and next-piece search after four-row collapse');
// Both the modern worker and file-only fallback use exactly the same engine.
const isolated={};vm.createContext(isolated);vm.runInContext('engine=('+H.createEngine.toString()+')('+JSON.stringify(H.model)+')',isolated);
const s=snapshot('L','Z');assert.equal(JSON.stringify(isolated.engine.compute(s).placement),JSON.stringify(H.compute(s).placement));
const noSpawn=C.empty(18);noSpawn[0]=Array(10).fill('L');noSpawn[1]=Array(10).fill('L');assert.equal(H.compute(snapshot('O','T',3,noSpawn)),null);
const blocked=C.empty(18);blocked[16][4]='L';blocked[17][4]='L';assert.equal(H.plan(blocked,{type:'T',x:3,y:14,rotation:0},{type:'T',x:3,y:16,rotation:0},{gravityFrames:1}),null);
console.log('PASS worker engine parity, blocked spawns and rejection of impossible ghosts');
// Search never advances the live RNG or edits the supplied game state.
const before=JSON.stringify(s);H.compute(s);assert.equal(JSON.stringify(s),before);
const samples=[H.compute(snapshot('O','L')),H.compute(snapshot('O','J'))];assert(samples.every(Boolean));assert.notDeepEqual(samples[0].placement,samples[1].placement,'the preview must change the recommended current placement');
console.log('PASS search is pure and considers the supplied next piece');

// Real authored overhangs, including a spin and a spin-tuck, must stay reachable.
for(const file of ['tuck-o-north-right','tuck-l-south-left','t-spin-ccw','t-spuck-right']){
 const scene=C.normalize(require('../situations/'+file+'.js')),board=C.compose({...scene.frames[0],active:undefined},18);
 const target=scene.tuck?.target||scene.frames.filter(f=>f.active).at(-1).active;
 const s=snapshot(target.type,'O',53,board),route=H.plan(board,s.active,target,s);
 assert(route,file+' should have a verified route from spawn');replay(s,target,route);
}
console.log('PASS routes through real tuck, double-tuck, spin and spin-tuck overhangs');

const transition={...tetris,lines:6},transitionHint=H.compute(transition);assert.equal(transitionHint.cleared,4);assert.equal(transitionHint.nextGravityFrames,49);
const heart=snapshot('O','L',10);heart.heart=true;assert.equal(H.compute(heart).nextGravityFrames,10);
console.log('PASS next-piece timing includes a cleared-line transition and heart gravity');

// Tetris readiness outranks generic flatness, small clears and accommodation bonuses.
for(const type of F.ORDER){const s=snapshot(type,'T'),hint=H.compute(s);assert(hint);const first=H.apply(s.board,hint.placement);assert.equal(H.tetrisReadiness(first.board).blockers,0,type+' must leave column 1 open');const final=H.apply(first.board,hint.next);assert.equal(H.tetrisReadiness(final.board).blockers,0,'preview must preserve the well too');assert.equal(H.tetrisReadiness(final.board).holes,0);}
const almost=C.empty(18),heights=[0,4,4,4,4,4,4,4,2,2];for(let x=0;x<10;x++)for(let y=18-heights[x];y<18;y++)almost[y][x]='L';
const setup=snapshot('O','I',53,almost),setupHint=H.compute(setup),setupBoard=H.apply(almost,setupHint.placement);assert.equal(H.tetrisReadiness(setupBoard.board).ready,true,'O must complete the fourth row beside the well');assert.equal(setupHint.nextCleared,4,'the preview I must take the prepared Tetris');replay(setup,setupHint.placement,setupHint.plan);
const triple=C.empty(18);for(let y=15;y<18;y++)for(let x=1;x<10;x++)triple[y][x]='L';const keep=H.compute(snapshot('I','O',53,triple));assert.notEqual(keep.cleared,3,'do not spend I on a triple when the well can stay open');assert.equal(H.tetrisReadiness(H.apply(triple,keep.placement).board).blockers,0);
console.log('PASS Tetris-first strategy: open column-1 well, four-row setup with preview I, no avoidable triple');

// The forecast uses the GB rejection rule, verified independently through RomRandom.
for(const current of F.ORDER)for(const next of F.ORDER){
 const counts=Array(7).fill(0);
 for(let v=0;v<343;v++){const draws=[v%7,Math.floor(v/7)%7,Math.floor(v/49)],r=new F.RomRandom({preview:F.ORDER.indexOf(current)<<2,hidden:F.ORDER.indexOf(next)<<2,readDivider:()=>draws.shift()+1});r.select();counts[r.hidden>>2]++;}
 const distribution=H.futureProbabilities(current,next);assert(Math.abs(distribution.reduce((a,b)=>a+b.weight,0)-1)<1e-12);
 distribution.forEach((p,i)=>assert(Math.abs(p.weight-counts[i]/343)<1e-12,current+' '+next+' '+p.type));
}
const futures=H.futureScenarios('T','L');assert.equal(futures.length,14);assert.equal(new Set(futures.map(s=>s.pieces[0])).size,7);assert(Math.abs(futures.reduce((n,s)=>n+s.weight,0)-1)<1e-12);assert(futures.every(s=>s.pieces.length===2));
console.log('PASS future weights match all 49 GB OR states under independent uniform candidate reads');
// A high-scoring current move must not consume the whole beam with preview variants.
const fake=[];for(let x=0;x<6;x++)for(let n=0;n<30;n++)fake.push({placement:{x,y:16,rotation:0},value:1000-x*100-n});const diverse=H.diverseShortlist(fake,5,2);assert.equal(diverse.length,10);assert.equal(new Set(diverse.map(p=>p.placement.x)).size,5);for(let x=0;x<5;x++)assert.equal(diverse.filter(p=>p.placement.x===x).length,2);
const slow=H.compute(snapshot('T','O'));assert.equal(slow.searchStats.futureDepth,2);assert.equal(slow.searchStats.scenarios,14);assert(slow.searchStats.distinctCurrentMoves>1);assert(slow.searchStats.branches>0);assert(slow.searchStats.cacheHits>0);
const fast=H.compute(snapshot('T','O',1));assert.equal(fast.searchStats.futureDepth,1);assert.equal(fast.searchStats.scenarios,7);assert(fast.searchStats.branches>0);
console.log('PASS diverse current-move pruning, multi-step future simulation, caching and faster training budget');
// With a high stack, a useful double-well burn must beat refusing to reduce height.
const danger=C.empty(18);for(let y=4;y<18;y++)for(let x=2;x<10;x++)danger[y][x]='L';
const rescue=snapshot('O','T',53,danger),rescueHint=H.compute(rescue);assert.equal(rescueHint.searchStats.mode,'survival');assert.equal(rescueHint.cleared,2);replay(rescue,rescueHint.placement,rescueHint.plan);
const dirty=C.empty(18);dirty[17][3]='L';dirty[15][3]='L';assert.equal(H.context(dirty).mode,'dig');assert.equal(H.context(C.empty(18)).mode,'tetris');
console.log('PASS context-sensitive recovery and a necessary tactical double burn');

// GB has only 18 visible rows, and most pieces already occupy rows 1 and 2 at spawn.
const emptyFeatures=H.features(C.empty(18));assert.equal(emptyFeatures.spawnClearance,15);assert.equal(emptyFeatures.blockedSpawns,0);assert.equal(H.context(C.empty(18)).spawnBand,3);
function heightsBoard(heights){const b=C.empty(18);for(let x=0;x<10;x++)for(let y=18-heights[x];y<18;y++)b[y][x]='L';return b;}
const centred=heightsBoard([0,4,4,4,11,4,4,4,4,4]),edgeTower=heightsBoard([0,4,4,4,4,4,4,4,4,11]);
assert.equal(H.features(centred).spawnClearance,4);assert.equal(H.features(edgeTower).spawnClearance,11);assert.equal(H.context(centred).mode,'survival');assert(H.evaluate(centred)<H.evaluate(edgeTower),'a tower under the actual spawn footprint needs an additional penalty');
const capped=heightsBoard([0,4,4,4,16,4,4,4,4,4]);assert(H.features(capped).blockedSpawns>0);assert(H.evaluate(capped)<H.evaluate(centred));
const calm=heightsBoard([0,4,4,4,4,4,4,4,4,4]),high=heightsBoard([0,10,10,10,10,10,10,10,10,10]);assert(H.evaluate(calm)>H.evaluate(high),'Tetris-ready does not justify consuming GB headroom');assert.equal(H.context(calm).safeHeight,9);assert.equal(H.context(calm,{gravityFrames:1}).safeHeight,7);
console.log('PASS 18-row GB headroom, actual spawn footprint clearance and earlier high-speed safety');
