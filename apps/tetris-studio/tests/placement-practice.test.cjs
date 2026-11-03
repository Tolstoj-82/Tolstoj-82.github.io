const assert=require('node:assert/strict'),C=require('../js/core'),F=require('../js/free-play'),P=require('../js/playable'),H=require('../js/placement-hint'),R=require('../js/placement-practice');
function harness(game,options={}){const requests=[],events=[];let receive,fail;const practice=new R.RewindPractice(game,{duration:950,repeatCount:1,...options,onChange:event=>events.push(event),clientFactory(onResult,onError){receive=onResult;fail=onError;return{request(snapshot){requests.push(snapshot);},stop(){}};}});practice.begin();return {game,practice,requests,events,finish(result){receive(result,requests.at(-1));},stale(result,snapshot){receive(result,snapshot);},fail};}
function game(type='T'){const g=new F.FreeGame({rng:new F.LfsrRandom({seed:'123456'})});g.active=C.spawn(type);g.nextPiece='I';return g;}
const g=game(),h=harness(g),initial=R.capture(g);assert.equal(h.practice.phase,'searching');
const frames=g.frames,rng=g.rng.cycles;new P.InputClock(g).advance(1000);g.idle(1000);assert.equal(g.frames,frames);assert.equal(g.rng.cycles,rng);assert.deepEqual(g.active,C.spawn('T'));
const recommendation=H.compute(h.requests[0]);h.finish(recommendation);assert.equal(h.practice.phase,'playing');assert.equal(g.practiceFrozen,false);
const target=C.clone(h.practice.target),wrong=H.explore(g.board,g.active).find(p=>R.footprint(p)!==R.footprint(target));assert(wrong);
// Record actual downward and sideways input history, then reject a different grounded pose.
for(let i=0;i<5;i++)g.input('down');g.input('right');g.active=C.clone(wrong);g.softCounter=20;g.lock();
assert.equal(h.practice.phase,'rewinding');assert.deepEqual(g.board,initial.data.board);assert.equal(g.score,initial.data.score);assert.equal(g.lines,initial.data.lines);assert.equal(g.pieces,initial.data.pieces);assert.equal(g.pendingPiece,initial.data.pendingPiece);assert.equal(g.practiceFrozen,true);assert.equal(h.practice.view().vhsRewind.progress,0);assert.deepEqual(h.practice.view().active,wrong);
const blocked=R.capture(g);new P.InputClock(g).advance(1000);assert.deepEqual(R.capture(g),blocked,'gravity and RNG do not run while rewinding');
h.practice.advance(475);assert(h.practice.view().vhsRewind.progress===.5);assert(h.practice.view().active.y<=wrong.y);h.practice.advance(475);
assert.equal(h.practice.phase,'playing');assert.equal(h.practice.retries,1);assert.deepEqual(R.capture(g),initial,'entire game and RNG return to the spawn checkpoint');assert.deepEqual(h.practice.target,target);assert.equal(h.requests.length,1,'retry does not replace the recommendation or consume another piece');
g.active=C.clone(wrong);g.lock();h.practice.advance(950);assert.equal(h.practice.retries,2);assert.deepEqual(R.capture(g),initial);
g.active=C.clone(target);g.lock();assert.equal(h.practice.phase,'committing');assert(h.events.includes('correct'));assert.equal(g.pieces,initial.data.pieces+1);assert(g.pendingPiece);assert.equal(g.practiceFrozen,false);
g.advance(C.ENTRY_DELAY*1000/C.HZ);assert.equal(h.practice.phase,'searching');assert.equal(h.requests.length,2);assert.equal(g.practiceFrozen,true);assert.equal(g.dealtCounts[g.active.type],initial.data.dealtCounts[g.active.type]+1);
const staleTarget=C.clone(target);h.stale({placement:staleTarget},h.requests[0]);assert.equal(h.practice.phase,'searching','late result for the preceding piece is ignored');
h.practice.dispose();assert.equal(g.practiceFrozen,false);assert.equal(g.lockGuard,undefined);assert.equal(g.onSpawn,undefined);h.finish(recommendation);assert.equal(h.practice.phase,'disposed');
console.log('PASS frozen recommendation, repeated VHS retries, identical checkpoint/RNG, input blocking, commit and next-piece analysis');

// Rejected line clears must not award points, change levels or start a clear animation.
const clearing=game('I');for(let y=14;y<18;y++)for(let x=1;x<10;x++)clearing.board[y][x]='L';clearing.lines=6;
const ch=harness(clearing),landing=H.compute(ch.requests[0]);assert.equal(landing.cleared,4);
const other=H.explore(clearing.board,clearing.active).find(p=>p.rotation===0);ch.finish({placement:other});const clearCheckpoint=R.capture(clearing);clearing.active=C.clone(landing.placement);clearing.lock();assert.equal(ch.practice.phase,'rewinding');assert.equal(clearing.lines,6);assert.equal(clearing.score,0);assert.equal(clearing.frame,null);ch.practice.advance(950);assert.deepEqual(R.capture(clearing),clearCheckpoint);ch.practice.dispose();
// An accepted Tetris keeps the normal animation and transition; next analysis starts afterward.
const correct=harness(clearing);const best=H.compute(correct.requests[0]);correct.finish(best);clearing.active=C.clone(best.placement);clearing.lock();assert.equal(clearing.lines,10);assert.equal(clearing.score,1200);assert.equal(correct.practice.phase,'committing');clearing.advance((C.LINE_CLEAR.ticks-1)*1000/C.HZ);assert.equal(correct.practice.phase,'committing');assert.equal(correct.requests.length,1);clearing.advance(1000/C.HZ);assert.equal(correct.practice.phase,'searching');assert.equal(clearing.level,1);assert(clearing.board.every(row=>row.every(c=>c==='.')));correct.practice.dispose();
console.log('PASS wrong clears never commit; correct clears retain native animation, scoring and level transition');

const failed=harness(game());failed.finish(null);assert.equal(failed.practice.phase,'skipped');assert.equal(failed.game.practiceFrozen,false);failed.game.active=H.explore(failed.game.board,failed.game.active)[0];failed.game.lock();assert.equal(failed.game.pieces,1,'no fabricated goal if search cannot verify one');failed.practice.dispose();
const quitting=harness(game());quitting.finish(H.compute(quitting.requests[0]));const q=R.capture(quitting.game);quitting.game.active=H.explore(quitting.game.board,quitting.game.active).find(p=>R.footprint(p)!==R.footprint(quitting.practice.target));quitting.game.lock();assert.equal(quitting.practice.phase,'rewinding');quitting.practice.dispose();assert.equal(quitting.game.practiceFrozen,false);assert.deepEqual(R.capture(quitting.game),q);
console.log('PASS unavailable recommendations and cancellation leave free play usable');

// Only missed placements get a repetition quota; clean first tries progress normally.
for(const count of Array.from({length:10},(_,i)=>i+1)){
 const fresh=harness(game(),{repeatCount:count});fresh.finish(recommendation);fresh.game.active=C.clone(fresh.practice.target);fresh.game.lock();assert.equal(fresh.practice.phase,'committing');assert.equal(fresh.game.pieces,1);fresh.practice.dispose();
 const drill=harness(game(),{repeatCount:count});drill.finish(recommendation);const checkpoint=R.capture(drill.game),goal=C.clone(drill.practice.target),bad=H.explore(drill.game.board,drill.game.active).find(p=>R.footprint(p)!==R.footprint(goal));
 drill.game.active=C.clone(bad);drill.game.lock();assert.equal(drill.practice.successes,0);assert.equal(drill.practice.requiredSuccesses,count);drill.practice.advance(950);
 for(let n=1;n<=count;n++){
  if(n===2){drill.game.active=C.clone(bad);drill.game.lock();assert.equal(drill.practice.successes,1,'another failure does not count or erase earned successes');drill.practice.advance(950);}
  drill.game.active=C.clone(goal);drill.game.lock();assert.equal(drill.practice.successes,n);
  if(n<count){assert.equal(drill.practice.phase,'rewinding');assert.equal(drill.practice.rewindReason,'repeat');assert.equal(drill.game.pieces,0);assert.equal(drill.game.score,0);drill.practice.advance(950);assert.deepEqual(R.capture(drill.game),checkpoint,'intermediate success restores exactly the same board, preview and RNG');}
  else{assert.equal(drill.practice.phase,'committing');assert.equal(drill.game.pieces,1,'only the final success commits');}
 }
 assert.equal(drill.requests.length,1);drill.practice.dispose();
}
console.log('PASS 1–10 successful repeats after mistakes, no repetition for clean first tries, and failed attempts do not count');
const live=harness(game(),{repeatCount:3});live.finish(recommendation);const liveWrong=H.explore(live.game.board,live.game.active).find(p=>R.footprint(p)!==R.footprint(live.practice.target));live.game.active=liveWrong;live.game.lock();live.practice.advance(950);live.game.active=C.clone(live.practice.target);live.game.lock();live.practice.advance(950);live.practice.setRepeatCount(5);assert.equal(live.practice.requiredSuccesses,5);assert.equal(live.practice.successes,1);for(let n=2;n<=5;n++){live.game.active=C.clone(live.practice.target);live.game.lock();if(n<5)live.practice.advance(950);}assert.equal(live.game.pieces,1);live.practice.dispose();
console.log('PASS changing repeat count during play preserves earned progress');
const multiClear=game('I');for(let y=14;y<18;y++)for(let x=1;x<10;x++)multiClear.board[y][x]='L';multiClear.lines=6;const mc=harness(multiClear,{repeatCount:3}),bestClear=H.compute(mc.requests[0]);mc.finish(bestClear);const miss=H.explore(multiClear.board,multiClear.active).find(p=>p.rotation===0);multiClear.active=miss;multiClear.lock();mc.practice.advance(950);
for(let n=1;n<=3;n++){multiClear.active=C.clone(bestClear.placement);multiClear.lock();if(n<3){assert.equal(multiClear.lines,6);assert.equal(multiClear.score,0);assert.equal(multiClear.frame,null);mc.practice.advance(950);}}
assert.equal(multiClear.lines,10);assert.equal(multiClear.score,1200);assert.equal(multiClear.pieces,1);assert.equal(multiClear.frame.clear,true);mc.practice.dispose();
console.log('PASS repeated Tetrises award points and clear lines exactly once on final success');

{const p=harness(game(),{repeatCount:7});assert.equal(p.practice.repeatCount,7);for(const n of [0,11,-1,2.5,NaN]){p.practice.setRepeatCount(n);assert.equal(p.practice.repeatCount,3);}p.practice.dispose();console.log('PASS all repeat counts 1–10 and invalid count fallback');}

{const practice=new R.RewindPractice(game());assert.equal(practice.repeatCount,3);practice.dispose();console.log('PASS default repeat count is 3');}
