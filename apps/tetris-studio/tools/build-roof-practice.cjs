// Reposition practice openings while retaining the lesson's exact illustrated boards.
const fs=require('node:fs'),path=require('node:path'),C=require('../js/core'),P=require('../js/playable'),R=require('../js/roof-burns'),H=require('../js/placement-hint'),D=require('../js/roof-practice');
const root=path.resolve(__dirname,'..'),idleKeys=['roof-burn-l-0-spike','roof-burn-i-0-1-general','roof-burn-o-0-2-general'],entries=[];
function passive(scene,b){const a=new P.Attempt(scene,P.gravityForLevel(6));for(let f=0;f<2000&&!a.done;f++)a.advance(1000/C.HZ);return D.grade(b,a);}
function withoutHorizontal(board,type){for(let rotation=0;rotation<({O:1,I:2,S:2,Z:2}[type]||4);rotation++)for(let y=-2;y<18;y++){const a={type,rotation,x:C.spawn(type).x,y};if(!H.fits(board,a)||H.fits(board,{...a,y:y+1}))continue;const placed=C.compose({board,active:a},18),rows=C.fullRows(placed);if(rows.length&&D.grade(board,{board:placed,frame:{clearRows:rows}}))return true;}return false;}
let retainedMovement=0,totalVariants=0;
for(const source of R.studies()){
 const b=C.compose({...source.frames[0],active:undefined},18);if(idleKeys.includes(source.roofBurn.key)){if(!passive(source,b))throw Error('Expected a simple drop');continue;}
 const candidates=[];
 for(const dx of [-3,-2,-1,1,2,3]){
  const target={...source.roofBurn.target,x:source.roofBurn.target.x+dx};if(C.cells(target.type,target.rotation).some(([x])=>target.x+x<1||target.x+x>8))continue;
  const board=b.map(row=>row.map((c,x)=>x===0||x===9?c:(x-dx>=1&&x-dx<=8?row[x-dx]:row[9])));
  if(board.flat().filter(c=>c!=='.').length%2||C.fullRows(board).length||!H.fits(board,target)||H.fits(board,{...target,y:target.y+1}))continue;
  const placed=C.compose({board,active:target},18),rows=C.fullRows(placed),after=C.collapseRows(placed,rows),opened=R.openedCells(board,after,rows),quality=H.features(after);if(rows.length!==source.roofBurn.clears||!opened.length||quality.holes||quality.heights[9]<quality.heights[8])continue;
  const plan=H.plan(board,C.spawn(target.type),target,{gravityFrames:28});if(!plan||!plan.inputs.some(i=>i==='left'||i==='right'))continue;
  const scene=C.normalize({title:'Practice validation',frames:[{board,active:C.spawn(target.type)},{active:target}]});if(passive(scene,board)||withoutHorizontal(board,target.type))continue;
  const attempt=new P.Attempt(scene,P.gravityForLevel(6));for(const input of plan.inputs){if(input)attempt.input(input);attempt.advance(1000/C.HZ);}if(!attempt.done||!attempt.correct||!D.grade(board,attempt))throw Error(source.title+' native replay failed');
  candidates.push({dx,board:board.map(row=>row.join('')),target,rows,opened:opened.map(p=>p.after),originalHoles:opened.map(p=>p.before),inputs:plan.inputs.filter(Boolean)});
 }
 if(!candidates.length){const plan=H.plan(b,C.spawn(source.roofBurn.target.type),source.roofBurn.target,{gravityFrames:28});if(passive(source,b)||withoutHorizontal(b,source.roofBurn.target.type)||!plan?.inputs.some(i=>i==='left'||i==='right'))throw Error(source.title+' has no movement variant');retainedMovement++;continue;}
 // Include at most two distances on each side, with shorter taps and longer moves mixed.
 const selected=[...candidates.filter(c=>c.dx<0).sort((a,b)=>Math.abs(a.dx)-Math.abs(b.dx)).slice(0,2),...candidates.filter(c=>c.dx>0).sort((a,b)=>a.dx-b.dx).slice(0,2)];entries.push({key:source.roofBurn.key,variants:selected});totalVariants+=selected.length;
}
const data={level:6,idleKeys,stats:{sources:R.studies().length,automaticDrops:idleKeys.length,requireHorizontalMovement:entries.length+retainedMovement,translatedSources:entries.length,retainedMovementSources:retainedMovement,translatedVariants:totalVariants},entries};
fs.writeFileSync(path.join(root,'js/roof-practice-data.js'),'// Generated and replayed by tools/build-roof-practice.cjs.\n(function(root){const data='+JSON.stringify(data)+';if(typeof module!=="undefined")module.exports=data;else root.TetrisRoofPracticeData=data;})(globalThis);\n');console.log(JSON.stringify(data.stats));
