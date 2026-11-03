const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..')),out=path.resolve(process.argv[3]||path.join(root,'downloads/adjustment-cards')),C=require(path.join(root,'js/core')),J=require(path.join(root,'js/mistake-journal')),Q=require(path.join(root,'js/puzzles')),library=require(path.join(root,'js/situations'));
const sandbox={TetrisCore:C};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'js/course.js'),'utf8'),sandbox);const course=sandbox.TetrisCourse,shades=[[166,183,121],[130,149,96],[83,108,62],[38,53,30]],colors=[null,[224,68,68],[53,163,92]],font=fs.readFileSync(path.join(root,'assets/fonts/Outfit-Variable.ttf')).toString('base64'),jobs=[];
const jobsPath=path.join(root,'.work','exports','adjustment-cards','render-jobs.json');fs.mkdirSync(path.dirname(jobsPath),{recursive:true});
const previousJobs=fs.existsSync(jobsPath)?JSON.parse(fs.readFileSync(jobsPath,'utf8')).jobs:JSON.parse(fs.readFileSync(path.join(root,'fixtures/card-export-names.json'),'utf8')).adjustment,previousNames=new Map(previousJobs.map(j=>[j.sourceTitle+'|'+j.nextType,j.name]));
fs.mkdirSync(path.join(out,'svg'),{recursive:true});fs.mkdirSync(path.join(out,'png'),{recursive:true});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])),slug=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
function cells(p){return C.cells(p.type,p.rotation).map(([dx,dy])=>[p.x+dx,p.y+dy]);}
function fits(b,p){return cells(p).every(([x,y])=>x>=0&&x<10&&y>=0&&y<18&&b[y][x]==='.');}
function panel(frame,owners,topRow){const board=C.compose(frame,18),tiles=C.visualTiles(frame,18),pixels=[];for(let y=topRow*8;y<144;y++)for(let x=0;x<80;x++){const cx=Math.floor(x/8),cy=Math.floor(y/8),id=tiles[cy][cx],tone=+C.ROM.tiles[id][y%8][x%8],color=colors[owners[cy][cx]];if(color)assert.notEqual(board[cy][cx],'.','colored cells must belong to a piece');const rgb=shades[tone];pixels.push(color?rgb.map((n,i)=>Math.round(n*.45+color[i]*.55)):rgb.slice());}return J.png(80,(18-topRow)*8,pixels);}
function wrap(title,max=60){const lines=[];for(const word of title.split(/\s+/)){if(!lines.length||lines.at(-1).length+1+word.length>max)lines.push(word);else lines[lines.length-1]+=' '+word;}return lines;}
function names(title){
 let original='';let main=title.replace(/\s*\(Ori:\s*([^)]*)\)/g,(_,value)=>{original=value.trim();return '';}).trim(),aliases=[];
 if(main==='Pump Fake Passer Upper'){main='Pump Fake';aliases=['Passer Upper'];}
 else if(main==='Amogus / Dengler thing'){main='Amogus';aliases=['Dengler thing'];}
 main=main.replace(/\s*\((Richard L|Lorange juice)\)/,(_,value)=>{aliases.push(value);return '';});
 const at=main.indexOf(':');if(at>=0){const head=main.slice(0,at).trim(),tail=main.slice(at+1).trim(),qualifier=['3-wide hole','secondary','T for L/J','89','S/J'].includes(tail)||tail.startsWith('level 25 adjustment')||(head==='VITS'&&tail!=='Palito Tuck');if(!qualifier){main=head;aliases.push(...(tail==='Hanging Feet Dangler'?['Hanging Feet','Dangler']:tail.split(' / ')));}}
 return {main,aliases,original};
}
for(const raw of library.situations.filter(s=>s.chapter==='Adjustments')){
 const original=C.normalize(raw),alternatives=original.adjustment.alternatives||[original.adjustment.next];
 for(const choice of alternatives){const s=C.normalize(course.variant(original,choice.type)),a=s.adjustment,base=C.compose({...s.frames[0],active:undefined},18),baseOverrides=s.frames[0].tileOverrides||[];assert(fits(base,a.default),s.title+' default overlaps the stack');assert(fits(base,a.adjusted),s.title+' adjusted placement overlaps the stack');
  const leftOwners=Array.from({length:18},()=>Array(10).fill(0));for(const[x,y]of cells(a.default))leftOwners[y][x]=1;
  const first=Q.after(base,a.adjusted,baseOverrides);assert(fits(first.board,a.next),s.title+' next placement overlaps the settled board');let rightOwners=Array.from({length:18},()=>Array(10).fill(0));for(const[x,y]of cells(a.adjusted))rightOwners[y][x]=1;if(first.rows.length)rightOwners=C.collapseRows(rightOwners,first.rows,0);for(const[x,y]of cells(a.next))rightOwners[y][x]=2;
  const stackFrame={board:base,tileOverrides:baseOverrides},leftFrame={board:base,active:a.default,tileOverrides:baseOverrides},rightFrame={board:first.board,active:a.next,tileOverrides:first.tileOverrides},firstOccupied=frame=>C.compose(frame,18).findIndex(row=>row.some(c=>c!=='.')),topRow=Math.max(0,Math.min(firstOccupied(stackFrame),firstOccupied(leftFrame),firstOccupied(rightFrame))-1),boardRows=18-topRow,boardHeight=boardRows*24;
  const title=s.title+(alternatives.length>1?' (next '+choice.type+')':''),nameInfo=names(s.title),width=792,number=String(jobs.length+1).padStart(3,'0'),name=previousNames.get(s.title+'|'+choice.type)||number+'-'+slug(title),texts=[];let y=12;
  function header(value,size,bold,color,max){for(const line of wrap(value,max)){texts.push({value:line,x:12,y,width:width-24,size,bold,color});y+=size+4;}}
  header(nameInfo.main+(alternatives.length>1?' (next '+choice.type+')':''),24,true,'#334155',60);
  if(nameInfo.aliases.length)header(nameInfo.aliases.join(', '),18,false,'#526177',82);
  if(nameInfo.original)header('(Original name in NES Tetris: '+nameInfo.original+')',14,false,'#64748b',105);
  y+=12;for(const[i,value]of ['Stack','Default','Adjusted'].entries())texts.push({value,x:12+i*264,y,width:240,size:16,bold:true,color:'#526177'});
  const boardY=y+28,height=boardY+boardHeight+12,panels=[panel(stackFrame,Array.from({length:18},()=>Array(10).fill(0)),topRow),panel(leftFrame,leftOwners,topRow),panel(rightFrame,rightOwners,topRow)];
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><style>@font-face{font-family:Outfit;src:url(data:font/ttf;base64,'+font+') format("truetype");font-weight:100 900}</style><rect width="100%" height="100%" fill="white"/>'+texts.map(t=>'<text x="'+(t.x+t.width/2)+'" y="'+(t.y+t.size*.95)+'" text-anchor="middle" font-family="Outfit,sans-serif" font-size="'+t.size+'" font-weight="'+(t.bold?600:400)+'" fill="'+t.color+'">'+escape(t.value)+'</text>').join('')+panels.map((png,i)=>'<image x="'+(12+i*264)+'" y="'+boardY+'" width="240" height="'+boardHeight+'" href="'+png+'" style="image-rendering:pixelated"/>').join('')+'</svg>';
  assert.equal((svg.match(/<image /g)||[]).length,3);fs.writeFileSync(path.join(out,'svg',name+'.svg'),svg);jobs.push({name,title,nameInfo,texts,width,height,boardY,boardRows,panels,sourceTitle:s.title,nextType:choice.type,firstClearRows:first.rows,default:a.default,adjusted:a.adjusted,next:a.next,redCells:rightOwners.flat().filter(x=>x===1).length,greenCells:rightOwners.flat().filter(x=>x===2).length});assert.equal(jobs.at(-1).greenCells,4);

 }
}
assert.equal(new Set(jobs.map(j=>j.name)).size,jobs.length);fs.writeFileSync(jobsPath,JSON.stringify({fontFile:path.join(root,'assets/fonts/Outfit-Variable.ttf'),output:out,jobs}));console.log(JSON.stringify({adjustments:library.situations.filter(s=>s.chapter==='Adjustments').length,images:jobs.length,output:out,firstClears:jobs.filter(j=>j.firstClearRows.length).map(j=>j.title)}));
