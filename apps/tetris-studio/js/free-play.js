(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore,P=typeof module!=='undefined'?require('./playable.js'):root.TetrisPlayable;
const ORDER=Object.freeze(['L','J','I','O','Z','S','T']),CPU_HZ=4194304,FRAME_CYCLES=70224,FRAME_MS=FRAME_CYCLES/CPU_HZ*1000;
function seedPhase(){const a=new Uint16Array(1);if(root.crypto?.getRandomValues){root.crypto.getRandomValues(a);return a[0];}return Math.floor((root.performance?.now?.()??Date.now())*CPU_HZ/1000)&65535;}
class RomRandom{
 constructor({phase=seedPhase(),hidden=0,preview=0,readDivider=null}={}){this.cycles=phase&65535;this.hidden=hidden&252;this.preview=preview&252;this.readDivider=readDivider;this.lastTrace=null;}
 tick(cycles){this.cycles+=cycles;}
 divider(){return this.readDivider?this.readDivider(this.cycles)&255:(Math.floor(this.cycles/256)&255);}
 select(){const c=this.preview&252,oldHidden=this.hidden;let h=3,d=0;const reads=[];this.tick(8); // LD H,3 at $2041
  for(;;){this.tick(12);let b=this.divider();reads.push(b);this.tick(4);let a=0;this.tick(4); // LD B,A / XOR A
   for(;;){b=(b-1)&255;this.tick(4);if(b===0){this.tick(12);break;}this.tick(8);a=(a+4)&255;this.tick(16);this.tick(8);if(a===28){this.tick(12);a=0;this.tick(4);}else this.tick(20);}
   d=a;this.tick(4);this.tick(12);this.tick(4);h--;this.tick(4);if(h===0){this.tick(12);break;}this.tick(8);const reject=((oldHidden|d|c)&252)===c;this.tick(20);this.tick(reject?12:8);if(!reject)break;
  }
  this.tick(4);this.hidden=d;this.tick(12);this.tick(4);this.preview=oldHidden;this.tick(16);
  this.lastTrace={reads,current:c,previousHidden:oldHidden,candidate:d,preview:this.preview,cycles:this.cycles};return ORDER[c>>2];
 }
 beginGame(){this.preview=0;let active;for(let n=0;n<3;n++)active=this.select();return active;}
 get next(){return ORDER[this.preview>>2];}
}
function parseLfsrSeed(value){if(typeof value==='number'&&Number.isInteger(value)&&value>0&&value<=0xffffff)return value;const text=String(value).trim();if(!/^[0-9a-fA-F]{6}$/.test(text)||parseInt(text,16)===0)throw Error('Enter a non-zero six-digit hexadecimal seed.');return parseInt(text,16);}
class LfsrRandom extends RomRandom{
 constructor({seed='000001'}={}){super({phase:0});this.seed=parseLfsrSeed(seed);this.state=this.seed;this.seeded=true;this.readDivider=()=>this.step();}
 step(){let taps=this.state&0x87,feedback=0;while(taps){feedback^=taps&1;taps>>>=1;}this.state=((this.state>>>1)|(feedback<<23))&0xffffff;return this.state&255;}
 beginGame(){this.state=this.seed;this.hidden=0;this.preview=0;return super.beginGame();}
}
// Stationary probabilities of the 49-state OR-rejection chain with uniform candidates.
// They round to Hard Drop's 10.7 / 13.7 / 16.1 percent reference.
const EXPECTED=Object.freeze({L:0.10740213324398115,J:0.1368443749495845,I:0.13684437494958454,O:0.16068824730242076,Z:0.1368443749495845,S:0.16068824730242076,T:0.16068824730242076});
function samplingModel(n){const expectedOverlap=n>0?Math.max(0,1-.896/Math.sqrt(n)):0,colourProgress=expectedOverlap**4;return {expectedOverlap,colourProgress,colour:'hsl('+(120*colourProgress).toFixed(3)+' 55% 43%)'};}
function distributionSummary(counts){const total=ORDER.reduce((n,t)=>n+(counts[t]||0),0),shares=ORDER.map(t=>total?100*(counts[t]||0)/total:0),scale=Math.min(100,Math.max(25,Math.ceil(Math.max(...shares)/5)*5)),overlap=total?Math.max(0,1-ORDER.reduce((sum,t,i)=>sum+Math.abs(shares[i]/100-EXPECTED[t]),0)/2):null;return {total,scale,overlap,...samplingModel(total)};}
function distribution(counts){const summary=distributionSummary(counts);return ORDER.map(type=>{const count=counts[type]||0,share=summary.total?100*count/summary.total:0,expected=100*EXPECTED[type];return {type,count,normalized:100*share/summary.scale,share,expected,expectedNormalized:100*expected/summary.scale,delta:share-expected,colour:summary.colour};});}
function nativeTurn(type,rotation,action){return C.nativeTurn(type,rotation,action);}
const spawn=type=>C.spawn(type);
function levelAfterLines(level,lines){return level<20&&lines<1000&&Math.floor(lines/10)>level?level+1:level;}
function freeGravity(level,heart=false){return (level===21?2:level===22?1:P.GRAVITY_FRAMES[Math.min(20,level+(heart?10:0))])*1000/C.HZ;}
function levelLabel(level){return level<10?String(level):String.fromCharCode(65+level-10);}
class FreeGame extends P.Attempt{
 constructor({level=0,heart=false,rng=new RomRandom()}={}){super({height:18,frames:[{board:C.empty(18),active:spawn('L')}]},P.gravityForLevel(level));this.freePlay=true;this.rng=rng;this.startLevel=Math.max(0,Math.min(22,Number(level)||0));this.level=this.startLevel;this.heart=!!heart&&this.level<=20;this.initialAlias=this.level>=10;this.gravity=freeGravity(this.level,this.heart);this.softDropDisabled=this.level>20;this.score=0;this.lines=0;this.pieces=0;this.goals=[];this.active=spawn(rng.beginGame());this.dealtCounts=Object.fromEntries(ORDER.map(t=>[t,0]));this.dealtCounts[this.active.type]++;this.nextPiece=rng.next;this.done=false;this.correct=false;this.frame=null;this.softCounter=0;this.gravityInput=false;this.frames=0;this.epoch=rng.cycles;this.spawnLocks=0;}
 onInputFrame({down,horizontal}){if(this.practiceFrozen)return;this.frames++;this.rng.cycles=this.epoch+this.frames*FRAME_CYCLES;if(!down||horizontal)this.softCounter=0;}
 input(action){if(this.practiceFrozen)return false;if(action==='down'&&this.softDropDisabled&&!this.gravityInput)return false;if((action==='a'||action==='b')&&!this.done&&this.active){const next={...this.active,rotation:nativeTurn(this.active.type,this.active.rotation,action)};if(!this.fits(next))return false;this.active=next;return true;}if(action==='down'&&!this.gravityInput&&!this.done&&!this.pendingPiece)this.softCounter++;return super.input(action);}
 get displayLevel(){return (this.level>=21||this.initialAlias?levelLabel(this.level):String(this.level))+(this.heart?' ♥':'');}
 setLevel(level){this.startLevel=Math.max(0,Math.min(22,Number(level)||0));this.level=this.startLevel>20?this.startLevel:Math.max(this.startLevel,Math.min(20,Math.floor(this.lines/10)));this.initialAlias=this.level>=10;this.softDropDisabled=this.level>20;if(this.softDropDisabled)this.heart=false;this.gravity=freeGravity(this.level,this.heart);this.elapsed=0;}

 lock(){if(!this.active||this.done)return;if(this.lockGuard?.(this.active)===false)return;const p=this.active;for(const [dx,dy]of C.cells(p.type,p.rotation))if(p.y+dy<0)this.hiddenRows[p.y+dy+2][p.x+dx]=p.type;const tiles=C.visualTiles({board:this.board,active:p,tileOverrides:this.tileOverrides},18);this.board=C.compose({board:this.board,active:p},18);this.pieces++;const rows=C.fullRows(this.board);this.rows=rows.length;this.totalRows=this.lines=Math.min(9999,this.lines+rows.length);this.score=(this.score+[0,40,100,300,1200][rows.length]*(Math.min(20,this.level)+1)+Math.max(0,this.softCounter-1))%1000000;this.softCounter=0;
  this.tileOverrides=[];this.board.forEach((row,y)=>row.forEach((type,x)=>{if(type==='I')this.tileOverrides.push({x,y,tile:tiles[y][x]});}));
  this.frame={board:this.board,buttons:[],highlight:false,tileOverrides:this.tileOverrides,...(rows.length?{clear:true,clearRows:rows}:{})};this.active=null;this.pendingRows=rows;this.transitionApplied=false;this.clearTicks=0;this.spawnElapsed=0;this.spawnDelay=(rows.length?C.LINE_CLEAR.ticks:C.ENTRY_DELAY)*1000/C.HZ;this.pendingPiece=this.nextPiece;
  if(p.x===3&&p.y===C.spawn(p.type).y){if(++this.spawnLocks>=2){this.done=true;this.pendingPiece=null;}}this.pendingLevel=rows.length?levelAfterLines(this.level,this.lines):this.level;
 }
 advance(ms){if(this.practiceFrozen)return;if(this.pendingPiece){this.spawnElapsed+=ms;if(this.pendingRows.length){this.clearTicks=Math.min(C.LINE_CLEAR.ticks,this.spawnElapsed*C.HZ/1000);if(!this.transitionApplied&&this.clearTicks+1e-7>=C.LINE_CLEAR.ticks-3){if(this.pendingLevel!==this.level)this.initialAlias=false;this.level=this.pendingLevel;this.gravity=freeGravity(this.level,this.heart);this.transitionApplied=true;}}if(this.spawnElapsed+1e-7>=this.spawnDelay){if(this.pendingRows.length){this.board=C.collapseRows(this.board,this.pendingRows);this.tileOverrides=this.tileOverrides.filter(o=>!this.pendingRows.includes(o.y)).map(o=>({...o,y:o.y+this.pendingRows.filter(y=>y>o.y).length}));}this.pendingRows=[];if(this.pendingLevel!==undefined){if(this.pendingLevel!==this.level)this.initialAlias=false;this.level=this.pendingLevel;this.gravity=freeGravity(this.level,this.heart);}const type=this.rng.select();this.nextPiece=this.rng.next;this.active=spawn(type);this.dealtCounts[type]++;this.pendingPiece=null;this.frame=null;this.elapsed=0;this.onSpawn?.();}return;}
  this.gravityInput=true;try{super.advance(ms);}finally{this.gravityInput=false;}
 }
 idle(ms){if(this.practiceFrozen)return;const cycles=Math.max(0,Math.floor(ms*CPU_HZ/1000));this.epoch+=cycles;this.rng.cycles+=cycles;}
}
const api={LfsrRandom,parseLfsrSeed,freeGravity,levelLabel,EXPECTED,samplingModel,distributionSummary,distribution,RomRandom,FreeGame,ORDER,spawn,nativeTurn,levelAfterLines,CPU_HZ,FRAME_CYCLES,FRAME_MS};if(typeof module!=='undefined')module.exports=api;else root.TetrisFreePlay=api;
})(globalThis);
