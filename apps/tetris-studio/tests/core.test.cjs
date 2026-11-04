const assert=require('node:assert/strict');
const C=require('../js/core.js');
const test=(name,fn)=>{fn();console.log('PASS '+name);};
test('Z input demonstrates B or A as alternatives without changing the approach',()=>{
 for(const s of C.demos().filter(s=>s.title.startsWith('Z-Spin'))){const f=s.frames.find(f=>f.reveal==='input');assert.deepEqual(f.buttonOptions,['B','A']);assert.deepEqual(C.frameAt(f,0).buttons,['B']);assert.deepEqual(C.frameAt(f,12).buttons,[]);assert.deepEqual(C.frameAt(f,24).buttons,[]);assert.deepEqual(C.frameAt(f,48).buttons,[]);assert.deepEqual(C.frameAt(f,60).buttons,[]);assert.deepEqual(C.frameAt(f,72).buttons,['A']);assert.deepEqual(C.frameAt(f,84).buttons,[]);assert.deepEqual(C.frameAt(f,96).buttons,[]);assert.deepEqual(C.frameAt(f,108).buttons,[]);assert.deepEqual(C.frameAt(f,24).active,f.active);assert.deepEqual(C.normalize(C.compact(s)),s);}
});
test('Z-spin well and center match the reference pocket and have safe paths',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('Z-Spin'));assert.equal(variants.length,2);
 for(const[sIndex,s]of variants.entries()){
  const shift=sIndex*3;assert.deepEqual(s.frames.map(f=>f.step),['1','1a','1b','2','3','4','5','6']);
  assert.deepEqual(s.frames[1].motif.cells,[[2+shift,16],[3+shift,16],[3+shift,17]]);assert.equal(s.frames[1].motif.mandatory.length,2);assert.equal(s.frames[4].trigger.target,'stack');assert.equal(s.frames[3].active.x,shift);assert.equal(s.frames[3].active.rotation,1);
  const f=s.frames[3],background=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[dx,dy]of C.cells(a.type,a.rotation))assert.equal(background[a.y+dy][a.x+dx],'.');}
  const pivot=f=>{const[x,y]=C.pivotCell(f.active);return[x+f.active.x,y+f.active.y];};assert.deepEqual(pivot(s.frames[5]),pivot(s.frames[6]));
  assert.deepEqual(s.frames[5].buttons,['B']);assert.equal(s.frames[6].active.rotation,2);assert.equal(s.frames[7].active,undefined);assert(s.frames[7].clear);assert.deepEqual(s.frames[7].clearRows,[16]);
  assert.deepEqual(C.compose(s.frames[6],18),C.compose(s.frames[7],18));assert.equal(C.compose(s.frames[7],18).flat().filter(c=>c==='Z').length,4);
 }
});
test('CW mirrors the motif, counter-motif, trigger and approach, then uses A',()=>{
 const [ccw,cw]=C.demos();assert.equal(cw.title,'T-Spin (CW)');assert.deepEqual(cw.frames.map(f=>f.step),['1','1a','1b','2','3','4','5','6']);
 const mirrored=points=>points.map(([x,y])=>[9-x,y]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 assert.deepEqual(cw.frames[1].motif.cells,mirrored(ccw.frames[1].motif.cells));assert.deepEqual(cw.frames[1].motif.mandatory,mirrored(ccw.frames[1].motif.mandatory));assert.deepEqual(cw.frames[2].counterMotif.cells,mirrored(ccw.frames[2].counterMotif.cells));
 assert.equal(cw.frames[5].active.rotation,3);assert.deepEqual(cw.frames[5].buttons,['A']);assert.equal(cw.frames[6].active.rotation,0);assert.deepEqual(cw.frames[4].trigger,{hole:[2,16],button:'A'});assert.deepEqual(cw.frames[7].clearRows,[16,17]);
 const f=cw.frames[3],stack=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[dx,dy]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+dy][a.x+dx],'.');}
});
test('dollar cells are mandatory L-texture motif minos and survive export',()=>{
 const raw={title:'Mandatory',height:2,stack:['S$s.......'],frames:[{motif:true},{}]},s=C.normalize(raw),f=s.frames[0];
 assert.equal(f.board[1],'LLL.......');assert.deepEqual(f.motif.cells,[[1,1],[2,1]]);assert.deepEqual(f.motif.mandatory,[[1,1]]);assert.equal(C.visualTiles(f,2)[1][1],C.ROM.minoIds.L);
 const data=C.compact(s);assert.deepEqual(data.stack,raw.stack);assert.equal(data.frames[0].motif,true);assert.deepEqual(C.normalize(data),s);
 assert.equal(C.demos()[0].frames.find(f=>f.motif).motif.mandatory.length,3);
});
test('CCW T-spin ends at its line clear without alternative boards',()=>{const s=C.demos()[0];assert.equal(s.frames.length,8);assert(s.frames.at(-1).clear);assert(!s.frames.some(f=>f.example));});

test('animated descent turns, falls through each row and preserves one authored step',()=>{

 const s=C.demos()[0],f=s.frames[3],stack=C.compose({...f,active:undefined},18);assert.equal(s.frames.length,8);assert.equal(C.frameAt(f,20).active.rotation,0);assert(C.frameAt(f,20).active.y>0);
 const rows=new Set();let previousY=0;for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;assert(a.y>=previousY);previousY=a.y;rows.add(a.y);for(const[dx,dy]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+dy][a.x+dx],'.');}
 assert.equal(rows.size,16);assert.deepEqual(C.frameAt(f,f.ticks).active,f.active);assert.deepEqual(f.active,{type:'T',x:5,y:15,rotation:1});assert.deepEqual(C.normalize(C.compact(s)),s);

});
test('lowercase stack letters define the motif once and remain normal minos',()=>{
 const raw={title:'Lowercase',height:3,stack:['Ss..t.....'],frames:[{motif:true},{active:{type:'O',x:5,y:0}},{motif:{color:'#112233'}}]};
 const s=C.normalize(raw);assert.equal(s.frames[0].board[2],'LL..T.....');assert.deepEqual(s.frames[0].motif.cells,[[1,2],[4,2]]);assert.equal(s.frames[1].motif,undefined);assert.equal(s.frames[2].motif.color,'#112233');
 const data=C.compact(s);assert.deepEqual(data.stack,raw.stack);assert.equal(data.frames[0].motif,true);assert.deepEqual(data.frames[2].motif,{color:'#112233'});assert.deepEqual(C.normalize(data),s);
 assert.deepEqual(C.visualTiles(s.frames[0],3)[2].slice(0,2),[C.ROM.minoIds.L,C.ROM.minoIds.L]);
 const falling=C.normalize({title:'S piece',stack:['S.........'],frames:[{active:{type:'S',x:3,y:2}}]});assert.equal(falling.frames[0].active.type,'S');assert.equal(C.visualTiles(falling.frames[0],18)[3][4],C.ROM.minoIds.S);
 assert.throws(()=>C.normalize({...raw,stack:['q.........']}));
});
test('piece, motif and counter-motif are separate labeled board steps',()=>{
 const s=C.demos()[0];assert.deepEqual(s.frames.slice(0,7).map(f=>f.step),['1','1a','1b','2','3','4','5']);
 assert.equal(C.frameAt(s.frames[0],0).highlight,true);assert.equal(C.frameAt(s.frames[0],12).highlight,false);
 assert(C.frameAt(s.frames[1],0).motif);assert.equal(C.frameAt(s.frames[1],12).motif,undefined);assert(C.frameAt(s.frames[2],0).counterMotif);assert.equal(C.frameAt(s.frames[2],12).counterMotif,undefined);
 assert.deepEqual(C.normalize(C.compact(s)),s);
});
test('T-spin clear locks the piece and stays one compact event',()=>{
 const s=C.demos()[0],f=s.frames[7];assert.equal(s.frames.length,8);assert.equal(f.clear,true);assert.equal(f.active,undefined);assert.deepEqual(f.clearRows,[16,17]);assert.equal(f.ticks,93);
 const data=C.compact(s);assert.deepEqual(data.frames[7],{caption:'6: Line clear.',clear:true,step:'6'});
 const copy=C.normalize(data);for(const t of [0,2,12,22,52,62,74,75,76,92,93])assert.deepEqual(C.displayTiles(copy.frames[7],18,t),C.displayTiles(f,18,t));
 const next=C.normalize({...data,frames:[...data.frames.slice(0,8),{}]});assert.deepEqual(C.compose(next.frames[8],18),C.clearAfterBoard(f,18));
});
test('clear detection validates complete rows and preserves native top-row behavior',()=>{
 const b=C.empty(18);b[0].fill('J');b[1].fill('L');b[17].fill('T');assert.deepEqual(C.fullRows(b),[17]);
 assert.deepEqual(C.fullRows([Array(10).fill('J')]),[0]);
 assert.throws(()=>C.normalize({title:'No clear',frames:[{clear:true}]}));
 assert.throws(()=>C.normalize({title:'Too many',stack:Array(5).fill('JJJJJJJJJJ'),frames:[{clear:true}]}));
 const full=C.empty(18);full[0][0]='J';full[16].fill('T');full[17].fill('L');const after=C.collapseRows(full,[16,17]);assert.equal(after[0][0],'.');assert.equal(after[1][0],'J');assert.equal(after[2][0],'J');
});
test('clear phases use the ROM solid tile, blank interval and bottom-up redraw',()=>{
 const f=C.demos()[0].frames[7],before=C.visualTiles(f,18),after=C.collapseRows(before,f.clearRows,47);
 assert.deepEqual(C.displayTiles(f,18,1),before);assert(C.displayTiles(f,18,2)[17].every(t=>t===140));assert.deepEqual(C.displayTiles(f,18,12),before);
 assert(C.displayTiles(f,18,62)[17].every(t=>t===47));assert.deepEqual(C.displayTiles(f,18,75)[17],after[17]);assert(C.displayTiles(f,18,75)[16].every(t=>t===47));assert.deepEqual(C.displayTiles(f,18,92),after);
});
test('all demo frames validate and active pieces do not overlap the stack',()=>{for(const s of C.demos()){assert.deepEqual(C.normalize(JSON.parse(JSON.stringify(s))),s);for(const f of s.frames){const b=C.compose({...f,active:undefined},s.height);if(f.active)for(const [dx,dy] of C.cells(f.active.type,f.active.rotation))assert.equal((f.active.y+dy<0?'.':b[f.active.y+dy][f.active.x+dx]),'.',s.title+': '+f.caption);}}});
test('bottom alignment and transparent fragments compose correctly',()=>{const s=C.normalize({title:'Fragments',height:6,frames:[{board:['JJJJJJJJJJ'],parts:[{x:3,y:2,rows:['OO','O.']},{x:3,y:2,rows:['.T']}]}]});const b=C.compose(s.frames[0],6);assert.equal(b[0].join(''),'..........');assert.equal(b[5].join(''),'JJJJJJJJJJ');assert.equal(b[2].join(''),'...OT.....');assert.equal(b[3].join(''),'...O......');});
test('empty, null, zero and space normalize to empty cells',()=>{const s=C.normalize({title:'Empty',frames:[{board:[[null,0,' ','.','.','.','.','.','.','.']]}]});assert.equal(s.frames[0].board[0],'..........');});
test('active piece overlays four cells',()=>{const s=C.normalize({title:'Piece',height:5,frames:[{active:{type:'T',x:2,y:1,rotation:2}}]});assert.equal(C.compose(s.frames[0],5).flat().filter(c=>c==='T').length,4);});
test('invalid bounds, cells, durations, inputs, and statistics are rejected',()=>{const valid={title:'Validation',height:4,frames:[{}]};for(const bad of [{height:19},{frames:[]},{title:''},{frames:[{ticks:0}]},{frames:[{ticks:1.5}]},{frames:[{buttons:['Fire']}]},{frames:[{board:['..........','..........','..........','..........','..........']}]},{frames:[{board:['GGGGGGGGGG']}]},{frames:[{parts:[{x:9,y:0,rows:['OO']}]}]},{frames:[{active:{type:'I',x:8,y:0}}]},{frames:[{score:-1}]},{frames:[{next:'X'}]}])assert.throws(()=>C.normalize({...valid,...bad}));});
test('collection formats and exported round trips preserve data',()=>{const demo=C.demos();assert.equal(C.parseCollection(demo[0]).length,1);assert.equal(C.parseCollection(demo).length,demo.length);assert.deepEqual(C.parseCollection(JSON.parse(JSON.stringify({situations:demo}))),demo);});
test('every tetromino orientation has four distinct minos',()=>{for(const rotations of Object.values(C.SHAPES))for(const shape of rotations)assert.equal(new Set(shape.map(p=>p.join(','))).size,4);});
test('curtain ends with a complete background board',()=>{const s=C.normalize({title:'Curtain',frames:[{board:Array(18).fill('XXXXXXXXXX')}]});assert(C.compose(s.frames.at(-1),s.height).flat().every(c=>c==='X'));});

test('pivot marker always lands on a mino and supports explicit per-frame choices',()=>{
 for(const type of Object.keys(C.SHAPES))for(let rotation=0;rotation<4;rotation++){
  const a={type,rotation,x:2,y:2};const pivot=C.pivotCell(a);
  if(type==='O'){assert.equal(pivot,null);continue;}assert(pivot);assert(C.cells(type,rotation).some(([x,y])=>x===pivot[0]&&y===pivot[1]));
 }
 const s=C.normalize({title:'Pivot',frames:[{active:{type:'T',x:2,y:2,rotation:0,pivot:3}}]});
 assert.deepEqual(C.pivotCell(s.frames[0].active),C.cells('T',0)[3]);
 assert.deepEqual(C.normalize(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>C.normalize({title:'Bad pivot',frames:[{active:{type:'T',x:2,y:2,rotation:0,pivot:4}}]}));
});

test('North East South West match the user reference chart',()=>{
 const expected={
  I:[[[0,2],[1,2],[2,2],[3,2]],[[1,0],[1,1],[1,2],[1,3]]],
  J:[[[0,1],[1,1],[2,1],[2,2]],[[1,0],[1,1],[0,2],[1,2]],[[0,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[1,1],[1,2]]],
  L:[[[0,1],[1,1],[2,1],[0,2]],[[0,0],[1,0],[1,1],[1,2]],[[2,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[1,2],[2,2]]],
  S:[[[1,1],[2,1],[0,2],[1,2]],[[0,0],[0,1],[1,1],[1,2]]],
  T:[[[0,1],[1,1],[2,1],[1,2]],[[1,0],[0,1],[1,1],[1,2]],[[1,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[2,1],[1,2]]],
  Z:[[[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[0,2]]],
  O:[[[1,1],[2,1],[1,2],[2,2]]]
 };
 assert.deepEqual(C.STATES,['North','East','South','West']);
 for(const[type,states]of Object.entries(expected))for(let r=0;r<4;r++){
  assert.deepEqual(C.cells(type,r),states[r%states.length],type+' '+C.STATES[r]);
  const f=C.normalize({title:type,frames:[{active:{type,x:2,y:2}}]}).frames[0];
  assert.equal(f.active.rotation,0);assert.deepEqual(C.cells(type,f.active.rotation),states[0]);
 }
});
test('pivot cells use the I third vertical mino and second horizontal mino',()=>{
 for(let r=0;r<4;r++){
  assert.deepEqual(C.pivotCell({type:'I',rotation:r}),[1,2]);
  for(const type of ['J','L','S','Z','T'])assert.deepEqual(C.pivotCell({type,rotation:r}),[1,1]);
  assert.equal(C.pivotCell({type:'O',rotation:r}),null);
 }
});


test('compact situations store the stack and common piece only once',()=>{
 const s=C.demos()[0],data=C.compact(s);
 assert.equal(data.piece,'T');assert.equal(data.stack.length,3);
 assert(data.frames.every(f=>!('board'in f)&&!('stack'in f)&&!('score'in f)&&!('level'in f)&&!('lines'in f)&&!('next'in f)));
 assert(data.frames.every(f=>!f.active||!('type'in f.active)));
 const copy=C.normalize(data);
 for(let i=0;i<s.frames.length;i++){
  assert.deepEqual(C.compose(copy.frames[i],18),C.compose(s.frames[i],18));
  assert.deepEqual(C.visualTiles(copy.frames[i],18),C.visualTiles(s.frames[i],18));
  assert.deepEqual(copy.frames[i].active,s.frames[i].active);
  assert.deepEqual(copy.frames[i].buttons,s.frames[i].buttons);
  assert.equal(copy.frames[i].ticks,s.frames[i].ticks);
 }
});
test('changed rows persist and snapshots remain independent when scrubbing',()=>{
 const s=C.normalize({title:'Rows',height:4,stack:['JJJJJJJJJJ'],frames:[{}, {rows:{3:'..........',2:'OO........'}}, {}]});
 assert.equal(C.compose(s.frames[0],4)[3].join(''),'JJJJJJJJJJ');
 assert.equal(C.compose(s.frames[2],4)[3].join(''),'..........');
 assert.equal(C.compose(s.frames[2],4)[2].join(''),'OO........');
 assert.equal(C.compose(s.frames[0],4)[2].join(''),'..........');
 const data=C.compact(s);assert.deepEqual(data.frames[1].rows,{'2':'OO........','3':'..........'});assert(!('rows'in data.frames[2]));
 assert.deepEqual(C.normalize(data),s);
});
test('all examples round-trip their exact board and tile appearance in compact form',()=>{
 for(const s of C.demos()){
  const copy=C.normalize(C.compact(s));
  s.frames.forEach((f,i)=>{assert.deepEqual(C.compose(copy.frames[i],s.height),C.compose(f,s.height));assert.deepEqual(C.visualTiles(copy.frames[i],s.height),C.visualTiles(f,s.height));});
 }

});
test('compact conversion preserves fragments and explicit I segment tiles',()=>{
 const s=C.normalize({title:'Parts',height:4,frames:[{board:['...I......'],tileOverrides:[{x:3,y:3,tile:139}],parts:[{x:0,y:1,rows:['OO']}]},{board:['...I......'],tileOverrides:[]}]});
 const data=C.compact(s),copy=C.normalize(data);
 for(let i=0;i<2;i++)assert.deepEqual(C.visualTiles(copy.frames[i],4),C.visualTiles(s.frames[i],4));
 assert.deepEqual(data.frames[1].tileOverrides,[]);
});
test('compact rows and shared piece data are validated',()=>{
 for(const extra of [{piece:'Q'}, {stack:['bad']}, {frames:[{rows:[]}]}, {frames:[{rows:{'-1':'..........'}}]}, {frames:[{rows:{18:'..........'}}]}, {frames:[{rows:{0:'GGGGGGGGGG'}}]}])assert.throws(()=>C.normalize({title:'Bad compact',stack:[],frames:[{}],...extra}));
});




test('S-spin variants use a C motif, safe descent, alternate inputs and bottom-row clear',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('S-Spin'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  const shift=i*3;assert.deepEqual(s.frames.map(f=>f.step),['1','1a','1b','2','3','4','5','6']);
  assert.deepEqual(s.frames[1].motif.cells,[[2+shift,15],[3+shift,15],[3+shift,16],[2+shift,17],[3+shift,17]]);assert.equal(s.frames[1].motif.mandatory.length,2);assert.equal(s.frames[2].counterMotif.cells.length,5);
  const f=s.frames[3],stack=C.compose({...f,active:undefined},18);
  for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}
  assert.deepEqual(s.frames[4].trigger.hole,[2+shift,16]);assert.deepEqual(s.frames[5].buttonOptions,['B','A']);
  assert.deepEqual(C.frameAt(s.frames[5],0).buttons,['B']);assert.deepEqual(C.frameAt(s.frames[5],60).buttons,[]);assert.deepEqual(C.frameAt(s.frames[5],72).buttons,['A']);
  assert.deepEqual(s.frames[7].clearRows,[17]);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('I-spin variants descend safely, fit their slots and clear the reference row',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('I-Spin'));assert.equal(variants.length,5);
 for(const[i,s]of variants.entries()){
  assert.deepEqual(s.frames.map(f=>f.step),['1','1a','1b','2','3','4','5','6']);assert.equal(s.frames[2].counterMotif.cells.length,7);
  const f=s.frames[3],stack=C.compose({...f,active:undefined},18);
  for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}
  assert.deepEqual(s.frames[5].buttonOptions,['B','A']);assert.deepEqual(s.frames[7].clearRows,[[16],[15],[15],[14],[15]][i]);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('J-spin placements have safe approaches, B input and one completed row',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('J-Spin')&&!s.title.includes('suboptimal'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  assert.deepEqual(s.frames.map(f=>f.step),['1','1a','1b','2','3','4','5','6']);
  const f=s.frames[3],stack=C.compose({...f,active:undefined},18);
  for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}
  assert.deepEqual(s.frames[5].buttons,['B']);assert.equal(s.frames[5].buttonOptions,undefined);assert.equal(s.frames[6].active.rotation,i===0?0:2);assert.deepEqual(s.frames[7].clearRows,[16]);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('suboptimal J-spins descend safely and use A to fill their shorter pockets',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('J-Spin (suboptimal'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  const f=s.frames[3],stack=C.compose({...f,active:undefined},18);
  for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}
  assert.deepEqual(s.frames[5].buttons,['A']);assert.equal(s.frames[6].active.rotation,i===0?2:0);assert.deepEqual(s.frames[7].clearRows,[16]);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('optimal L-spins descend safely and rotate with A into the pictured one-row clears',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('L-Spin (optimal'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  assert.deepEqual(s.frames.map(f=>f.step),['1','1a','1b','2','3','4','5','6']);
  const f=s.frames[3],stack=C.compose({...f,active:undefined},18);
  for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}
  assert.deepEqual(s.frames[5].buttons,['A']);assert.equal(s.frames[6].active.rotation,i===0?0:2);assert.deepEqual(s.frames[7].clearRows,[16]);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('suboptimal L-spins use B for the pictured counterclockwise turn with safe paths',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('L-Spin (suboptimal'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  const f=s.frames[3],stack=C.compose({...f,active:undefined},18);
  for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}
  assert.deepEqual(s.frames[5].buttons,['B']);assert.equal(s.frames[6].active.rotation,(f.active.rotation+3)%4);assert.deepEqual(s.frames[7].clearRows,[16]);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('T-Spucks rotate then tuck sideways with safe paths and no line clear',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('T-Spuck (right')||s.title.startsWith('T-Spuck (left'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  assert.deepEqual(s.frames[5].buttons,[i===0?'A':'B']);assert.equal(s.frames[6].active.rotation,2);assert.deepEqual(s.frames[8].buttons,[i===0?'Right':'Left']);assert(s.frames[8].animate);assert(!s.frames.some(f=>f.clear));
  for(const f of s.frames.filter(f=>f.animate)){const stack=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}}
  assert.equal(s.frames[8].active.y,16);assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('suboptimal T-Spucks hug the wall, shift before turning and tuck safely',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('T-Spuck (suboptimal'));assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  assert.equal(s.frames[3].active.x,i===0?-1:8);assert.deepEqual(s.frames[4].buttons,[i===0?'Right':'Left']);assert.deepEqual(s.frames[6].buttons,[i===0?'B':'A']);
  for(const f of s.frames.filter(f=>f.animate)){const stack=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells(a.type,a.rotation)){assert(a.x+x>=0&&a.x+x<10);assert.equal(stack[a.y+y][a.x+x],'.');}}}
  assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('S-Spucks rotate with either button then tuck right once without collisions',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('S-Spuck'));assert.equal(variants.length,2);
 for(const s of variants){assert.deepEqual(s.frames[5].buttonOptions,['B','A']);assert.deepEqual(s.frames[8].buttons,['Right']);assert.equal(s.frames[8].active.x,s.frames[6].active.x+1);assert.equal(s.frames[8].active.y,s.frames[6].active.y);assert.equal(s.frames[1].motif.cells.length,6);
  for(const f of s.frames.filter(f=>f.animate)){const stack=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells('S',a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}}
  assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('Z-Spucks use the staircase stack motif, either rotation, and one right tuck',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('Z-Spuck'));assert.equal(variants.length,2);
 for(const s of variants){assert.equal(s.frames[1].motif.cells.length,4);assert.deepEqual(s.frames[5].buttonOptions,['B','A']);assert.deepEqual(s.frames[8].buttons,['Right']);assert.equal(s.frames[8].active.x,s.frames[6].active.x+1);
  for(const f of s.frames.filter(f=>f.animate)){const stack=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells('Z',a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}}
  assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('JD spins turn twice, tuck before their final rotation and fit both mirrored pockets',()=>{
 const variants=C.demos().filter(s=>s.title.startsWith('JD spin')&&!s.adjustment);assert.equal(variants.length,2);
 for(const[i,s]of variants.entries()){
  assert.equal(s.frames[3].active.rotation,1);assert.equal(s.frames[4].active.rotation,2);assert.deepEqual(s.frames[3].buttons,['A']);assert.deepEqual(s.frames[4].buttons,['A']);assert.deepEqual(s.frames[7].buttons,[i===0?'Left':'Right']);assert.deepEqual(s.frames[8].buttons,[i===0?'B':'A']);assert.deepEqual(s.frames[10].clearRows,[17]);
  for(const f of s.frames.filter(f=>f.animate)){const stack=C.compose({...f,active:undefined},18);for(let t=0;t<=f.ticks;t++){const a=C.frameAt(f,t).active;for(const[x,y]of C.cells('T',a.rotation))assert.equal(stack[a.y+y][a.x+x],'.');}}
  assert.deepEqual(C.normalize(C.compact(s)),s);
 }
});

test('every spin input produces the illustrated orientation with the piece in the same position',()=>{const {Attempt}=require('../js/playable.js'),fp=a=>C.cells(a.type,a.rotation).map(([x,y])=>[x+a.x,y+a.y].join(',')).sort().join(';'),spins=C.demos().filter(s=>/^[LJIZST]-Spin/.test(s.title));assert.equal(spins.length,19);for(const s of spins){const input=s.frames.find(f=>f.reveal==='input'),result=s.frames.find(f=>f.reveal==='spin'),valid=[];for(const button of ['A','B']){const a=new Attempt(s);a.board=C.compose({...input,active:undefined},18);a.active=C.clone(input.active);if(a.input(button.toLowerCase())&&fp(a.active)===fp(result.active))valid.push(button);}assert.deepEqual([...(input.buttonOptions||input.buttons)].sort(),valid,s.title);assert(valid.length>0);assert.equal(input.active.x,result.active.x);assert.equal(input.active.y,result.active.y);assert.equal(s.frames.find(f=>f.reveal==='trigger').trigger.button,input.buttons[0]);}});


test('Playback samples every read-only lesson frame without mutating its source',()=>{
 const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 for(const scene of C.demos()){
  const snapshot=JSON.stringify(scene);freeze(scene);
  for(const frame of scene.frames)for(const tick of [0,Math.floor(frame.ticks/2),frame.ticks]){
   const view=C.frameAt(frame,tick);
   if(frame.hold){assert.deepEqual(view.buttons,frame.buttons,scene.title);assert.notEqual(view.buttons,frame.buttons,'held inputs belong to the view');}
  }
  assert.equal(JSON.stringify(scene),snapshot,scene.title+' stays unchanged');
 }
});
