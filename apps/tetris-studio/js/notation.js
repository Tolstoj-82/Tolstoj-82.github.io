(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore;
const directions=['d','l','u','r'];
const G=typeof module!=='undefined'?require('./stack-generator.js'):root.TetrisStackGenerator,BANK=typeof module!=='undefined'?require('./notation-bank.js'):root.TetrisNotationBank;
function token(p,explicit=false){const shape=C.cells(p.type,p.rotation),cols=[...new Set(shape.map(([x])=>p.x+x+1))].sort((a,b)=>a-b);return p.type+(explicit&&['L','J','T'].includes(p.type)?directions[p.rotation]:'')+' '+cols.map(c=>c===10?'0':String(c)).join('');}
function build(poses,{entry=null}={}){
 const signature=JSON.stringify(poses);entry=entry||BANK.find(e=>JSON.stringify(e.spec)===signature);
 if(!entry){const seed=[...signature].reduce((n,c)=>((n*31)^c.charCodeAt(0))>>>0,1);entry=G.generate(poses,{random:G.seeded(seed),variants:1}).entries[0];}
 if(!entry||!entry.quality.accepted)throw Error('No teaching-quality stack found for this placement.');
 const targets=C.clone(entry.targets),board=entry.stack.map(r=>[...r]);
 const first=targets[0],next=targets[1],title=targets.map(p=>token(p)).join(', '),frames=[{board,active:C.spawn(first.type),ticks:2,highlight:false,showNext:!!next,next:next?.type,caption:'Place '+title+'.'}];
 let completed=board;for(const p of targets)completed=C.compose({board:completed,active:p},18);
 frames.push({board:completed,ticks:96,highlight:false,showNext:false,placementHighlights:targets,placementColors:['#e04444','#35a35c'].slice(0,targets.length),caption:'Solution: '+title+'.'});
 const s=C.normalize({title,frames,...(next?{adjustment:{default:first,adjusted:first,next}}:{})});
 s.notation=true;s.notationTargets=targets;s.stackQuality=entry.quality;s.qualityWell=entry.well;
 // Attempt takes its one-piece goal from the final active frame.
 if(!next)s.frames.push({...s.frames[0],active:first,ticks:96,caption:'Solution: '+title+'.'});
 return s;
}
function exercises(){return BANK.filter(e=>e.practice).map(entry=>build(entry.spec,{entry}));}
function lesson(container){
 const make=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return format(e);};
 const intro=make('p','Columns are numbered 1–10, from left to right. Write the piece, then the columns it occupies. In a pair, the first piece is current and the second is next.');container.append(intro);container.append(make('h3','Read the columns first'));
 const ruler=make('div');ruler.className='notation-columns';for(let n=1;n<=10;n++)ruler.append(make('span',String(n)));container.append(ruler);
 container.append(make('p','L 234, T 89 means: place the current L across columns 2, 3 and 4, then the next T across columns 8 and 9. The stack may make the orientation clear. If it does not, add the direction of the spike.'));
 container.append(make('p','The numbers name the occupied columns, not a route or a sequence of button presses. L 234 spans three columns. T 89 spans two, so the T is vertical. I 5 is a vertical bar in column 5; I 4567 is a horizontal bar across four columns. The notation does not specify a row: read the landing height from the stack.'));
 container.append(make('h3','Let the stack tell you the orientation'));
 container.append(make('p','Usually, the piece and the columns are enough. Look at the surface in those columns and choose the orientation that fits. On these practice stacks, the intended orientation lands without leaving holes. You do not need to write Ld when L 234 already makes the placement clear.'));
 container.append(make('p','The same short instruction can mean a different orientation on a different stack. The two L 234 examples below are both valid: their surfaces tell you whether the spike faces down or up. Read the stack rather than memorising one orientation for each set of columns.'));
 container.append(make('h3','Add a direction only when needed'));
 container.append(make('p','If the columns and the available stack context do not make your intention clear, add a lowercase letter after L, J or T. It describes the direction of the spike, not a movement input. These suffixes clarify an ambiguous placement; they are not a required part of every instruction.'));
 const key=make('dl');key.className='notation-key';for(const[a,b]of [['u','spike up'],['d','spike down'],['l','spike left'],['r','spike right']]){key.append(make('dt',a),make('dd',b));}container.append(key);
 container.append(make('p','For a three-column L, J or T, u/d distinguishes spike up from spike down: Lu 234 versus Ld 234. For a two-column orientation, l/r distinguishes spike left from spike right: Tl 89 versus Tr 89. Without a suffix, L 234 or T 89 is still the normal way to write a clear placement. I, S and Z have two states, and O has one, so their column span already distinguishes their orientations.'));
 const directionsGrid=make('div');directionsGrid.className='notation-orientation-examples';for(const [rotation,x,direction]of [[2,1,'up'],[0,1,'down'],[1,7,'left'],[3,6,'right']]){const pose={type:'T',rotation,x,y:0},card=make('figure'),canvas=make('canvas');canvas.width=96;canvas.height=96;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',token(pose,true)+': spike '+direction);const ctx=canvas.getContext('2d'),shades=['#a6b779','#829560','#536c3e','#26351e'];for(let y=0;y<4;y++)for(let x=0;x<4;x++){ctx.fillStyle='#edf3e5';ctx.fillRect(x*24,y*24,24,24);}for(const [dx,dy,id]of C.pieceLayout('T',rotation))for(let py=0;py<8;py++)for(let px=0;px<8;px++){ctx.fillStyle=shades[+C.ROM.tiles[id][py][px]];ctx.fillRect(dx*24+px*3,dy*24+py*3,3,3);}card.append(make('figcaption',token(pose,true)),canvas,make('p','Spike '+direction+'. '+(direction==='up'||direction==='down'?'Three columns: 2, 3 and 4.':'Two columns: 8 and 9.')));directionsGrid.append(card);}container.append(directionsGrid);
 container.append(make('h3','Current piece, then next piece'));
 container.append(make('p','In L 234, T-89, first place the current L in columns 2–4; then place the next T in columns 8–9. A space or hyphen separates the piece from its columns. Read the second placement against the stack after the first piece has landed. Red marks the first piece in the examples; green marks the second.'));
 container.append(make('p','In stack notation, column 10 is written as 0. O 90 occupies columns 9 and 10; I 7890 occupies columns 7, 8, 9 and 10. I 0 means a vertical I in column 10.'));
 container.append(make('h3','The shorter way: 234 → 90'));
 container.append(make('p','When the current and next pieces are already known, players often leave out the piece letters. With L current and T next, L234 T90 is usually shortened to 234 → 90: put L in columns 2, 3 and 4, then T in columns 9 and 10. The arrow separates the two placements; it is not a movement input. Remember that 0 means column 10. Use the full piece names or a direction suffix whenever the context is ambiguous.'));
 container.append(make('h3','Examples on matching surfaces'));
 const examples=make('div');examples.className='notation-examples';
 for(const spec of [[['L',0,2],['T',3,8]],[['L',0,2]],[['L',2,2]],[['T',1,7]],[['I',0,7]],[['O',0,9]]]){
  const s=build(spec),card=make('figure'),canvas=make('canvas');canvas.width=240;canvas.height=168;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',s.title+' on a matching stack');const ctx=canvas.getContext('2d'),final=s.frames[1],tiles=C.visualTiles(final,18);const shades=['#a6b779','#829560','#536c3e','#26351e'];
  for(let y=12;y<18;y++)for(let x=0;x<10;x++){const pattern=C.ROM.tiles[tiles[y][x]];for(let py=0;py<8;py++)for(let px=0;px<8;px++){ctx.fillStyle=shades[+pattern[py][px]];ctx.fillRect(x*24+px*3,(y-12)*24+py*3,3,3);}}
  for(const [i,p]of s.notationTargets.entries()){ctx.save();ctx.globalAlpha=.55;ctx.fillStyle=i?'#35a35c':'#e04444';for(const[dx,dy]of C.cells(p.type,p.rotation))ctx.fillRect((p.x+dx)*24,(p.y+dy-12)*24,24,24);ctx.restore();}
  ctx.fillStyle='#475569';for(let n=1;n<=10;n++)ctx.fillRect((n-1)*24,146,1,5);
  const numbers=make('div');numbers.className='notation-columns';for(let n=1;n<=10;n++)numbers.append(make('span',String(n)));
  const explanation=make('p',s.notationTargets.length>1?'First the L, then the T. The surfaces identify both orientations.':['L','J','T'].includes(s.notationTargets[0].type)?'The surface makes '+token(s.notationTargets[0],true)+' clear, so the direction suffix can be omitted.':'The occupied columns identify the orientation.');card.append(make('figcaption',s.title),canvas,numbers,explanation);examples.append(card);
 }container.append(examples);
 container.append(make('h3','Read it, then place it'));
 container.append(make('p','Try it: read the instruction, rotate if needed, and place the piece in the named columns. Pair drills ask for both pieces in order. First identify the piece, then the columns, then the orientation that fits the surface. Each stack accommodates the requested placements without tucks or spins. The prompts normally omit direction letters because the stack supplies that information.'));
 const button=make('button','Practise stack notation');button.id='startNotationPractice';button.onclick=()=>{root.TetrisCourse.leaveIntro();root.liveAttempt.startNotation();};container.append(button);
}
function format(element){const text=element.textContent||'',pattern=/\b([LJT])([udlr])(?=\s|[0-9]|$|[.,;:])/g;const matches=[...text.matchAll(pattern)];if(!matches.length)return element;const nodes=[];let end=0;for(const m of matches){const prefix=document.createElement('span');prefix.textContent=text.slice(end,m.index)+m[1];const sub=document.createElement('sub');sub.className='placement-direction';sub.textContent=m[2];nodes.push(prefix,sub);end=m.index+m[0].length;}const tail=document.createElement('span');tail.textContent=text.slice(end);nodes.push(tail);element.replaceChildren(...nodes);return element;}
const api={format,token,build,exercises,lesson};if(typeof module!=='undefined')module.exports=api;else root.TetrisNotation=api;
})(globalThis);
