const fs=require('node:fs'),path=require('node:path'),C=require('../js/core'),H=require('../js/placement-hint'),F=require('../js/free-play'),Q=require('../js/stack-quality');
const results=[];
for(const seed of ['123456','000001','ABCDEF']){
 const rng=new F.LfsrRandom({seed}),clears={single:0,double:0,triple:0,tetris:0};let type=rng.beginGame(),board=C.empty(18),lines=0,peakHeight=0,placed=0,stoppedWithoutHint=false,firstHoles=null;
 for(;placed<60;placed++){
  const hint=H.compute({board,hiddenRows:C.empty(2),active:C.spawn(type),nextPiece:rng.next,gravityFrames:53,elapsedFrames:0,level:0,heart:false,lines:0});
  if(!hint){stoppedWithoutHint=true;break;}
  const result=H.apply(board,hint.placement);board=result.board;lines+=result.cleared;if(result.cleared)clears[['','single','double','triple','tetris'][result.cleared]]++;
  const metrics=Q.analyze(board);peakHeight=Math.max(peakHeight,metrics.height.max);
  if(metrics.holes.count&&!firstHoles)firstHoles={afterPiece:placed+1,current:type,next:rng.next,placement:hint.placement,board:board.map(row=>row.join('')),holes:metrics.holes.count,height:metrics.height.max};
  type=rng.select();
 }
 const metrics=Q.analyze(board);results.push({seed,placed,lines,clears,peakHeight,finalHeight:metrics.height.max,finalHoles:metrics.holes.count,stoppedWithoutHint,firstHoles});
}
const report={scope:'Local strategy diagnostics only; StackRabbit was not executed.',model:'Fixed level-0 gravity; current and visible next only; 60-piece limit; LFSR seed resets per sequence.',results};
const output=path.resolve(__dirname,'../fixtures/placement-hint-strategy-audit.json');fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const r of results)console.log(JSON.stringify({seed:r.seed,placed:r.placed,lines:r.lines,tetrises:r.clears.tetris,peakHeight:r.peakHeight,finalHoles:r.finalHoles,stoppedWithoutHint:r.stoppedWithoutHint}));
