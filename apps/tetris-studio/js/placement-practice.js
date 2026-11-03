(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore,H=typeof module!=='undefined'?require('./placement-hint.js'):root.TetrisPlacementHint;
const copy=value=>value===undefined?undefined:C.clone(value);
const excluded=new Set(['rng','practiceFrozen','lockGuard','onSpawn']);
function capture(game){const data={},rng={};for(const[k,v]of Object.entries(game))if(!excluded.has(k)&&typeof v!=='function')data[k]=copy(v);for(const[k,v]of Object.entries(game.rng))if(typeof v!=='function')rng[k]=copy(v);return {data,rng};}
function restore(game,snapshot){for(const[k,v]of Object.entries(game))if(!excluded.has(k)&&typeof v!=='function'&&!(k in snapshot.data))delete game[k];for(const[k,v]of Object.entries(snapshot.data))game[k]=copy(v);for(const[k,v]of Object.entries(game.rng))if(typeof v!=='function'&&!(k in snapshot.rng))delete game.rng[k];for(const[k,v]of Object.entries(snapshot.rng))game.rng[k]=copy(v);}
const footprint=a=>a?C.cells(a.type,a.rotation).map(([dx,dy])=>(a.x+dx)+','+(a.y+dy)).sort().join(';'):'';
class RewindPractice{
 constructor(game,{clientFactory=(receive,fail)=>H.createClient(receive,fail),onChange=()=>{},duration=950,repeatCount=3,onMistake=()=>{},acceptPlacement=()=>false}={}){
  this.acceptPlacement=acceptPlacement;this.game=game;this.onChange=onChange;this.onMistake=onMistake;this.duration=duration;this.phase='idle';this.token=0;this.history=[];this.target=null;this.disposed=false;this.retries=0;this.setRepeatCount(repeatCount);this.successes=0;this.hadMistake=false;
  this.originalInput=game.input;this.originalGuard=game.lockGuard;this.originalSpawn=game.onSpawn;
  this.inputHook=action=>{const result=this.originalInput.call(game,action);this.record();return result;};
  this.guard=placement=>this.judge(placement);this.spawnHook=()=>{this.originalSpawn?.call(game);this.begin();};
  game.input=this.inputHook;game.lockGuard=this.guard;game.onSpawn=this.spawnHook;
  this.client=clientFactory((result,snapshot)=>this.receive(result,snapshot),()=>this.receive(null,{trainingToken:this.token}));
 }
 setRepeatCount(value){const n=Number(value);this.repeatCount=Number.isInteger(n)&&n>=1&&n<=10?n:3;}
 get requiredSuccesses(){return this.hadMistake?this.repeatCount:1;}
 get blocked(){return this.phase==='searching'||this.phase==='rewinding';}
 begin(){
  if(this.disposed||!this.game.active||this.game.done)return;
  this.client.stop();this.token++;this.target=null;this.history=[];this.retries=0;this.successes=0;this.hadMistake=false;this.rewindReason=null;
  const spawn=C.spawn(this.game.active.type);
  if(!this.game.fits(spawn)){this.phase='skipped';this.game.practiceFrozen=false;this.onChange('skipped');return;}
  this.game.active=spawn;this.game.elapsed=0;this.game.softCounter=0;this.checkpoint=capture(this.game);this.game.practiceFrozen=true;this.phase='searching';
  const game=this.game;this.client.request({board:copy(game.board),hiddenRows:copy(game.hiddenRows),active:{...spawn},nextPiece:game.nextPiece,gravityFrames:Math.round(game.gravity*C.HZ/1000),elapsedFrames:0,level:game.level,heart:game.heart,lines:game.lines,trainingToken:this.token});
  this.onChange('searching');
 }
 receive(result,snapshot){
  if(this.disposed||this.phase!=='searching'||snapshot.trainingToken!==this.token)return;
  // Check the returned goal again before making it the immutable target for this piece.
  const g=this.game,valid=result?.placement&&H.plan(g.board,g.active,result.placement,{gravityFrames:Math.round(g.gravity*C.HZ/1000),elapsedFrames:0,hiddenRows:g.hiddenRows,record:false});
  this.target=valid?copy(result.placement):null;this.nextTarget=valid?copy(result.next||null):null;this.phase=valid?'playing':'skipped';g.practiceFrozen=false;this.record();this.onChange(valid?'ready':'skipped');
 }
 record(placement=this.game.active){if(this.phase!=='playing'||!placement)return;const last=this.history.at(-1);if(!last||last.x!==placement.x||last.y!==placement.y||last.rotation!==placement.rotation){this.history.push({...placement});if(this.history.length>2048)this.history.splice(1,1);}}
 judge(placement){
  if(this.disposed)return this.originalGuard?this.originalGuard.call(this.game,placement):true;
  if(this.phase==='skipped'||!this.target)return !this.blocked;
  if(this.phase!=='playing')return false;
  if((placement.type===this.target.type&&footprint(placement)===footprint(this.target))||this.acceptPlacement(this.checkpoint.data.board,placement,this.checkpoint.data.nextPiece)){
   if(this.originalGuard&&this.originalGuard.call(this.game,placement)===false)return false;
   this.successes++;
   if(this.successes>=this.requiredSuccesses){this.phase='committing';this.onChange('correct');return true;}
   this.startRewind(placement,'repeat');return false;
  }
  this.onMistake({board:copy(this.checkpoint.data.board),tileOverrides:copy(this.checkpoint.data.tileOverrides),actual:copy(placement),recommended:copy(this.target),next:copy(this.nextTarget),nextType:this.checkpoint.data.nextPiece,gravityFrames:Math.round(this.checkpoint.data.gravity*C.HZ/1000),level:this.checkpoint.data.level,displayLevel:this.game.displayLevel});this.hadMistake=true;this.startRewind(placement,'mistake');return false;
 }
 startRewind(placement,reason){this.record(placement);this.rewindReason=reason;this.phase='rewinding';this.elapsed=0;this.game.practiceFrozen=true;this.onChange(reason==='repeat'?'repeat':'rewind');}
 advance(ms){
  if(this.phase!=='rewinding')return;this.elapsed+=Math.max(0,ms);
  if(this.elapsed>=this.duration){restore(this.game,this.checkpoint);this.game.practiceFrozen=false;this.phase='playing';this.retries++;this.history=[];this.record();this.onChange('retry');}
 }
 view(){
  if(this.phase!=='rewinding')return this.game.view();
  const progress=Math.min(1,this.elapsed/this.duration),index=Math.max(0,this.history.length-1-Math.floor(progress*(this.history.length-1)));
  return {board:this.checkpoint.data.board,tileOverrides:this.checkpoint.data.tileOverrides,active:this.history[index]||this.checkpoint.data.active,buttons:[],highlight:false,vhsRewind:{progress}};
 }
 dispose(){
  if(this.disposed)return;this.disposed=true;this.token++;this.client.stop();
  if(this.phase==='rewinding')restore(this.game,this.checkpoint);
  if(this.game.input===this.inputHook)this.game.input=this.originalInput;
  if(this.game.lockGuard===this.guard){if(this.originalGuard)this.game.lockGuard=this.originalGuard;else delete this.game.lockGuard;}
  if(this.game.onSpawn===this.spawnHook){if(this.originalSpawn)this.game.onSpawn=this.originalSpawn;else delete this.game.onSpawn;}
  this.game.practiceFrozen=false;this.phase='disposed';
 }
}
const api={RewindPractice,capture,restore,footprint};if(typeof module!=='undefined')module.exports=api;else root.TetrisPlacementPractice=api;
})(globalThis);
