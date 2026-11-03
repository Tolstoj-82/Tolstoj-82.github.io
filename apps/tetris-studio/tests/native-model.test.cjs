const assert=require('node:assert/strict'),C=require('../js/core'),P=require('../js/playable'),F=require('../js/free-play'),rom=require('../fixtures/rom-turn-vectors.json');
const ordered=p=>p.map(v=>v.join(',')).sort();
for(const [index,type]of F.ORDER.entries()){
 const spawn=C.spawn(type),native=rom.descriptors[index*4];
 assert.deepEqual(ordered(C.cells(type,0).map(([x,y],i)=>[x+spawn.x,y+spawn.y,C.pieceLayout(type,0)[i][2]])),ordered(native.spawnCells),type+' actual ROM renderer spawn cells');
 const study=C.normalize({title:type,frames:[{active:spawn}]});
 for(let r=0;r<4;r++)for(const [action,button]of [['a',1],['b',2]]){
  const raw=index*4+C.STATE_LAYOUTS[type][r],record=rom.turns.find(t=>t.pieceId===raw&&t.button===button),next=C.nativeTurn(type,r,action);
  assert.deepEqual(C.pieceLayout(type,next),rom.layouts[record.after],type+' native '+r+' '+action);
  for(const a of [new P.Attempt(study),new F.FreeGame({rng:new F.RomRandom({phase:0})})]){
   a.board=C.empty(18);a.active={type,x:3,y:4,rotation:r};assert(a.input(action));assert.equal(a.active.rotation,next);
   const before={type,x:3,y:4,rotation:r},old=new Set(C.cells(type,r).map(([x,y])=>[x+3,y+4].join(','))),newCell=C.cells(type,next).find(([x,y])=>!old.has([x+3,y+4].join(',')));
   if(newCell){a.active={...before};a.board[newCell[1]+4][newCell[0]+3]='L';assert.equal(a.input(action),false);assert.deepEqual(a.active,before,type+' blocked turn has no kick');}
  }
 }
}
const t=C.cells('T',0);assert.deepEqual(t,[[0,1],[1,1],[2,1],[1,2]]);assert.equal(C.nativeTurn('T',0,'a'),1);assert.equal(C.nativeTurn('T',0,'b'),3);
const i=new P.Attempt(C.normalize({title:'I hidden spawn turn',frames:[{active:C.spawn('I')}]}));assert.deepEqual(i.active,{type:'I',x:3,y:-1,rotation:0});assert(i.input('a'));assert(i.fits(i.active));assert(C.cells('I',i.active.rotation).some(([,y])=>y+i.active.y===-1));C.visualTiles(i.view(),18);assert(i.input('b'));assert.deepEqual(i.active,C.spawn('I'));
for(const type of F.ORDER){const s=C.normalize({title:'Second '+type,adjustment:{default:{type:'O',x:0,y:15,rotation:0},adjusted:{type:'O',x:0,y:15,rotation:0},next:{type,x:3,y:10,rotation:0}},frames:[{active:C.spawn('O')}]});const a=new P.Attempt(s);a.active={...s.adjustment.adjusted};a.lock();a.advance(C.ENTRY_DELAY*1000/C.HZ);assert.deepEqual(a.active,C.spawn(type),type+' second-piece spawn');}
console.log('PASS original ROM renderer coordinates for all seven spawns, all 56 A/B transitions in both engines, blocked rotations without kicks, I hidden-row turn and all second-piece spawns');

for(const s of C.demos()){const first=s.frames.find(f=>f.active);assert.deepEqual(first.active,C.spawn(first.active.type),s.title+' first piece always uses ROM entry pose');}
require('../js/course');const double=C.normalize(require('../situations/adjustment-double-bar')),clean=global.TetrisCourse.cleanMotion(double),locked=clean.frames.findLast(f=>f.tileOverrides&&f.board);assert(locked);const previous=clean.frames.at(-2),last=clean.frames.at(-1);assert.deepEqual(C.visualTiles(last,18),C.visualTiles(previous,18),'clean playback preserves locked I segment tiles');
console.log('PASS all '+C.demos().length+' authored entry poses and clean playback I tile preservation');
