(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore;
const copy=v=>C.clone(v),footprint=a=>C.cells(a.type,a.rotation).map(([dx,dy])=>(a.x+dx)+','+(a.y+dy)).sort().join(';');
function after(board,pose,tileOverrides=[]){const frame={board,active:pose,tileOverrides},result=C.compose(frame,18),rows=C.fullRows(result),tiles=C.visualTiles(frame,18),settled=rows.length?C.collapseRows(result,rows):result,settledTiles=rows.length?C.collapseRows(tiles,rows,C.ROM.emptyId):tiles,overrides=[];settled.forEach((row,y)=>row.forEach((type,x)=>{if(type==='I')overrides.push({x,y,tile:settledTiles[y][x]});}));return {board:settled,rows,tileOverrides:overrides};}
function validPose(board,p){if(!p||!['L','J','I','O','Z','S','T'].includes(p.type)||![p.x,p.y,p.rotation].every(Number.isInteger)||p.rotation<0||p.rotation>3)return false;const cells=C.cells(p.type,p.rotation);return cells.every(([dx,dy])=>p.x+dx>=0&&p.x+dx<10&&p.y+dy>=0&&p.y+dy<18&&board[p.y+dy][p.x+dx]==='.')&&cells.some(([dx,dy])=>p.y+dy===17||board[p.y+dy+1]?.[p.x+dx]!=='.');}
function cleanRecord(r){if(!Array.isArray(r.board)||r.board.length!==18||r.board.some(row=>row.length!==10||[...row].some(c=>!'.LJIOZST'.includes(c))))throw Error('A puzzle needs a valid 10 by 18 stack.');const board=r.board.map(row=>[...row]);if(!validPose(board,r.recommended))throw Error('Invalid first placement.');const result=after(board,r.recommended);if(!validPose(result.board,r.next))throw Error('Invalid next placement.');return {board,recommended:copy(r.recommended),next:copy(r.next),nextType:r.next.type,tileOverrides:(r.tileOverrides||[]).filter(o=>Number.isInteger(o.x)&&o.x>=0&&o.x<10&&Number.isInteger(o.y)&&o.y>=0&&o.y<18&&Number.isInteger(o.tile)&&C.ROM.tiles[o.tile]).map(o=>({x:o.x,y:o.y,tile:o.tile})),level:Math.min(20,Math.max(0,Number(r.level)||0))};}
class Collection{
 constructor(name,records){if(!records.length||records.length>500)throw Error('Choose between 1 and 500 puzzles.');this.name=String(name||'My puzzles').slice(0,80);this.entries=records.map((r,i)=>({id:i+1,record:cleanRecord(r.record||r),score:Number.isInteger(r.score)?r.score:0}));this.current=null;this.previous=null;this.round=0;this.lastSeen=new Map();}
 get available(){return this.entries.filter(e=>e.score<5);}
 choose(random=Math.random){const available=this.available;let pool=available.filter(e=>!this.lastSeen.has(e.id)||this.round-this.lastSeen.get(e.id)>15);if(!pool.length&&available.length){const oldest=Math.min(...available.map(e=>this.lastSeen.get(e.id)??-Infinity));pool=available.filter(e=>(this.lastSeen.get(e.id)??-Infinity)===oldest);}this.current=pool[Math.floor(random()*pool.length)]||null;this.previous=this.current?.id;this.graded=false;if(this.current){this.lastSeen.set(this.current.id,this.round);this.round++;}return this.current;}

 grade(correct){if(!this.current||this.graded)return null;this.graded=true;const old=this.current.score;this.current.score+=correct?1:-1;return {old,value:this.current.score,delta:correct?1:-1,successful:this.current.score>=5};}
 export(){return JSON.stringify({format:'gb-tetris-puzzles',version:1,name:this.name,entries:this.entries.map(e=>({record:e.record,score:e.score}))},null,2);}
 static parse(text){const data=JSON.parse(text);if(data.format!=='gb-tetris-puzzles'||data.version!==1||!Array.isArray(data.entries))throw Error('Not a puzzle collection.');return new Collection(data.name,data.entries);}
}
function createAttemptClass(Base){return class PuzzleAttempt extends Base{
 constructor(entry,gravity){const r=entry.record||entry;super({height:18,adjustment:{adjusted:r.recommended,next:r.next},frames:[{board:r.board,active:C.spawn(r.recommended.type),tileOverrides:r.tileOverrides}]},gravity);this.tileOverrides=copy(r.tileOverrides||[]);this.puzzle=true;this.matches=true;this.placements=0;this.identicalPieces=r.recommended.type===r.next.type;if(this.identicalPieces){const first=after(r.board,r.recommended),second=after(first.board,r.next);this.expectedFinal=second.board.map(row=>row.map(c=>c==='.'?'.':'#').join('')).join('/');this.expectedClears=first.rows.length+second.rows.length;}}
 lock(){if(this.done||!this.active)return;const expected=this.goal;this.matches=this.matches&&this.active.type===expected.type&&footprint(this.active)===footprint(expected);this.goal=copy(this.active);super.lock();this.placements++;this.goal=this.pendingPiece?this.goals[this.pieceIndex]:expected;if(this.done){let matches=this.matches;if(this.identicalPieces){const rows=C.fullRows(this.board),settled=rows.length?C.collapseRows(this.board,rows):this.board;matches=settled.map(row=>row.map(c=>c==='.'?'.':'#').join('')).join('/')===this.expectedFinal&&(this.totalRows||0)===this.expectedClears&&!this.hiddenRows.some(row=>row.some(c=>c!=='.'));}this.correct=matches&&this.placements===2;}}

};}
const SOLUTION_COLORS=['#e04444','#35a35c'];
function solution(entry,ms){
 const r=entry.record||entry,clear=C.fullRows(C.compose({board:r.board,active:r.recommended},18)),clearMs=clear.length?C.LINE_CLEAR.ticks*1000/C.HZ:0;
 if(ms<900+clearMs){const clearing=ms>=900&&clear.length;return {frame:{board:r.board,tileOverrides:r.tileOverrides,active:r.recommended,highlight:false,...(!clearing?{placementHighlights:[r.recommended],placementColors:[SOLUTION_COLORS[0]]}:{}),...(clearing?{clear:true,clearRows:clear}:{})},ticks:Math.max(0,ms-900)*C.HZ/1000};}
 const first=after(r.board,r.recommended,r.tileOverrides),cells=C.cells(r.recommended.type,r.recommended.rotation).map(([dx,dy])=>[r.recommended.x+dx,r.recommended.y+dy]).filter(([,y])=>!clear.includes(y)).map(([x,y])=>[x,y+clear.filter(row=>row>y).length]);
 return {frame:{board:first.board,tileOverrides:first.tileOverrides,active:r.next,highlight:false,motif:{cells,color:SOLUTION_COLORS[0]},placementHighlights:[r.next],placementColors:[SOLUTION_COLORS[1]]},ticks:0};
}

const api={Collection,createAttemptClass,cleanRecord,solution,after};if(typeof module!=='undefined')module.exports=api;else root.TetrisPuzzles=api;
})(globalThis);
