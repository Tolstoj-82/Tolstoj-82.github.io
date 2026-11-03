(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core.js'):root.TetrisCore,Q=typeof module!=='undefined'?require('./stack-quality.js'):root.TetrisStackQuality;
function seeded(seed=0x5eeda11){return()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};}
function candidate(spec,random){
 const base=2+Math.floor(random()*3),targets=spec.map(([type,rotation,left])=>{if(!Q.STATES[type]||!Number.isInteger(rotation)||rotation<0||rotation>=Q.STATES[type]||!Number.isInteger(left)||left<1||left>10)throw Error('Invalid placement specification.');const shape=C.cells(type,rotation);return {type,rotation,x:left-1-Math.min(...shape.map(p=>p[0])),y:17-base-Math.max(...shape.map(p=>p[1]))};});
 if(!targets.length||targets.length>2)throw Error('Generate one current piece and optionally one next piece.');
 const used=new Set();for(const p of targets){const columns=new Set(C.cells(p.type,p.rotation).map(([dx])=>p.x+dx));if([...columns].some(x=>x<0||x>9||used.has(x)))return null;for(const x of columns)used.add(x);}
 const well=!used.has(0)?0:!used.has(9)?9:null;if(well===null)return null;
 const fixed=new Map(),initial=new Map();for(const p of targets){const shape=C.cells(p.type,p.rotation);for(const dx of new Set(shape.map(p=>p[0]))){const col=shape.filter(c=>c[0]===dx);fixed.set(p.x+dx,18-p.y-Math.min(...col.map(c=>c[1])));initial.set(p.x+dx,17-p.y-Math.max(...col.map(c=>c[1])));}}
 const max=Math.max(...fixed.values()),heights=Array.from({length:10},(_,x)=>x===well?0:fixed.get(x)??Math.max(1,max-2+Math.floor(random()*4))),board=C.empty(18);
 for(let x=0;x<10;x++)for(let y=18-(initial.get(x)??heights[x]);y<18;y++)board[y][x]='L';return {board,targets,well};
}
function generate(spec,{random=seeded(),attempts=1500,variants=3,profile={}}={}){
 const accepted=[],seen=new Set(),rejected={},audit={tested:0,duplicates:0,rejected};
 for(let n=0;n<attempts&&accepted.length<16;n++){const c=candidate(spec,random);if(!c){rejected['unsupported or overlapping specification']=(rejected['unsupported or overlapping specification']||0)+1;continue;}const key=c.board.map(r=>r.join('')).join('');if(seen.has(key)){audit.duplicates++;continue;}seen.add(key);audit.tested++;
  const report=Q.sequence(c.board,c.targets,{well:c.well,profile,lookahead:false});if(report.accepted)accepted.push({...c,report});else for(const reason of report.reasons)rejected[reason]=(rejected[reason]||0)+1;
 }
 accepted.sort((a,b)=>b.report.score-a.report.score);const entries=[];for(const c of accepted){const report=Q.sequence(c.board,c.targets,{well:c.well,profile});if(!report.accepted){for(const reason of report.reasons)rejected[reason]=(rejected[reason]||0)+1;continue;}entries.push({spec,stack:c.board.map(r=>r.join('')),targets:c.targets,well:c.well,quality:{version:1,profile:'notation',accepted:true,score:report.score,before:report.before,stages:report.stages}});if(entries.length>=variants)break;}
 // Never substitute an unchecked board when search cannot satisfy the policy.
 return {entries,audit:{...audit,approved:entries.length,exhausted:!entries.length}};
}
const api={seeded,candidate,generate};if(typeof module!=='undefined')module.exports=api;else root.TetrisStackGenerator=api;
})(globalThis);
