const assert=require('node:assert/strict'),C=require('../js/core.js'),N=require('../js/notation.js'),{Attempt}=require('../js/playable.js');
global.TetrisCore=C;require('../js/course.js');const tasks=N.exercises();assert.equal(tasks.length,69);
assert(tasks.some(s=>s.title==='L 234, T 89'));
for(const s of tasks){const a=new Attempt(s);for(const goal of a.goals){
 const path=global.TetrisCourse.legalPath(a.board,goal,a.active);for(const action of path)assert(a.input(action),s.title+' illegal '+action);
 assert(!a.fits({...a.active,y:a.active.y+1}),s.title+' is not resting');
 // Every column of the piece has uninterrupted support below its lowest mino.
 const cells=C.cells(goal.type,goal.rotation);for(const dx of new Set(cells.map(c=>c[0]))){const bottom=goal.y+Math.max(...cells.filter(c=>c[0]===dx).map(c=>c[1]));for(let y=bottom+1;y<18;y++)assert.notEqual(a.board[y][goal.x+dx],'.',s.title+' hole below piece');}
 a.input('down');if(a.pendingPiece)a.advance(100);
 }assert(a.done&&a.correct,s.title+' not solved');}
const rotations=['d','l','u','r'];for(const type of ['L','J','T'])for(let r=0;r<4;r++){const s=N.build([[type,r,2]]);assert(s.title.startsWith(type+' '));assert(N.token(s.notationTargets[0],true).startsWith(type+rotations[r]+' '));}
assert.equal(N.token({type:'I',rotation:1,x:8}),'I 0');assert.equal(N.build([['I',0,7]]).title,'I 7890');assert.equal(N.build([['O',0,9]]).title,'O 90');
console.log('PASS 69 notation drills: legal routes, exact landings, supported surfaces, two-piece order and all spike labels');
