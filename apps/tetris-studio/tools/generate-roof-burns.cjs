const fs=require('node:fs'),path=require('node:path'),C=require('../js/core'),H=require('../js/placement-hint');
const root=path.resolve(__dirname,'..'),types=['L','J','I','O','Z','S','T'],counts={L:4,J:4,I:2,O:1,Z:2,S:2,T:4};
function covered(b,x,y){return b[y][x]==='.'&&b.slice(0,y).some(r=>r[x]!=='.');}
function openings(before,after,rows){const out=[];for(let y=0;y<18;y++)for(let x=0;x<10;x++){if(rows.includes(y)||!covered(before,x,y))continue;const yy=y+rows.filter(r=>r>y).length;if(yy<18&&after[yy][x]==='.'&&!covered(after,x,yy))out.push({before:[x,y],after:[x,yy]});}return out;}
const stats={orientations:19,candidates:0,fit:0,realRoofBurns:0,cleanResults:0,nativeChecks:0,nativeVerified:0},buckets=new Map();
for(const type of types)for(let rotation=0;rotation<counts[type];rotation++){
 const shape=C.cells(type,rotation),minY=Math.min(...shape.map(p=>p[1])),maxY=Math.max(...shape.map(p=>p[1])),maxX=Math.max(...shape.map(p=>p[0]));
 for(let first=minY;first<=maxY;first++)for(let n=1;n<=Math.min(4,maxY-first+1);n++)for(const roofHeight of [5,6,7])for(let x=1;x+maxX<9;x++)for(const width of [1,2,3])for(const depth of [1,2,3])for(let holeX=1;holeX+width<=9;holeX++){
  stats.candidates++;const y=18-roofHeight-first,top=y+first,bottom=top+n-1;if(bottom+depth>=18)continue;
  const target={type,rotation,x,y},board=C.empty(18);
  for(let row=top;row<18;row++)for(let col=0;col<10;col++)if(col!==0||row<=bottom)board[row][col]='L';
  for(const[dx,dy]of shape)if(y+dy>=0&&y+dy<18)board[y+dy][x+dx]='.';
  const focus=[];for(let row=bottom+1;row<=bottom+depth;row++)for(let col=holeX;col<holeX+width;col++){board[row][col]='.';focus.push([col,row]);}
  if(board.flat().filter(c=>c!=='.').length%2){if(board[top][9]==='.')continue;board[top-1][9]='L';}
  if(C.fullRows(board).length||!H.fits(board,target)||H.fits(board,{...target,y:y+1}))continue;stats.fit++;
  const result=H.apply(board,target);if(!result||result.cleared!==n)continue;const rows=C.fullRows(C.compose({board,active:target},18));if(rows.some(r=>r<top||r>bottom))continue;
  const opened=openings(board,result.board,rows),focusOpened=opened.filter(p=>focus.some(q=>q[0]===p.before[0]&&q[1]===p.before[1]));if(!focusOpened.length)continue;stats.realRoofBurns++;
  const f=H.features(result.board);if(f.holes||f.heights[9]<f.heights[8])continue;stats.cleanResults++;
  const spike=['L','J','T'].includes(type)?shape.find(cell=>{const rest=shape.filter(p=>p!==cell);return rest.every(p=>p[0]===rest[0][0])||rest.every(p=>p[1]===rest[0][1]);}):null,special=spike&&rows.includes(y+spike[1])?'spike':['S','Z'].includes(type)&&rotation===1&&n===2?'vertical-zigzag':null;
  const group=special?type+'-'+rotation+'-'+special:type+'-'+rotation+'-'+n+'-general';
  const score=(special==='spike'?n*5:0)+Math.abs(x-3)*2+Math.abs(roofHeight-6)+Math.abs(width-2)*3+Math.abs(depth-2)+Math.abs(holeX-(x+maxX+1))*.2+f.surface*.01;
  const list=buckets.get(group)||[];list.push({group,special,board,target,rows,opened,focusOpened,score});list.sort((a,b)=>a.score-b.score);if(list.length>5)list.length=5;buckets.set(group,list);
 }
}
const selected=[];
for(const[type,rotation,kind,n]of [...['L','J','T'].flatMap(t=>[0,1,2,3].map(r=>[t,r,'spike',null])),['Z',1,'vertical-zigzag',2],['S',1,'vertical-zigzag',2],['I',0,null,1],['I',1,null,1],['I',1,null,2],['I',1,null,3],['I',1,null,4],['O',0,null,1],['O',0,null,2],['Z',0,null,1],['S',0,null,1],['L',2,null,1],['J',2,null,1],['T',2,null,1]]){
 const key=kind?type+'-'+rotation+'-'+kind:type+'-'+rotation+'-'+n+'-general',list=buckets.get(key)||[];let chosen=null;
 for(const candidate of list){stats.nativeChecks++;const plan=H.plan(candidate.board,C.spawn(type),candidate.target,{gravityFrames:11});if(plan){chosen={...candidate,plan};stats.nativeVerified++;break;}}
 if(!chosen)continue;selected.push(chosen);
}
selected.sort((a,b)=>Number(!a.special)-Number(!b.special)||types.indexOf(a.target.type)-types.indexOf(b.target.type)||a.target.rotation-b.target.rotation||a.rows.length-b.rows.length);
fs.mkdirSync(path.join(root,'fixtures'),{recursive:true});fs.writeFileSync(path.join(root,'fixtures/roof-burn-search.json'),JSON.stringify({definition:'A tracked pre-existing covered empty cell survives the clear and becomes vertically open. No new covered holes remain.',scope:'All 19 unique orientations, every contiguous occupied-row band, low roofs at heights 5 to 7, interior landings, cavity widths and depths 1 to 3. Best five candidates per family receive native timed reachability checks. Not an exhaustive search of arbitrary boards.',stats,selected:selected.map(({plan,...s})=>s)},null,2));
fs.mkdirSync(path.join(root,'.work'),{recursive:true});fs.writeFileSync(path.join(root,'.work/roof-burn-selected.json'),JSON.stringify({stats,selected}));console.log(JSON.stringify({stats,selected:selected.map(s=>({group:s.group,clears:s.rows.length,opened:s.opened.length}))}));
module.exports={openings,covered};

