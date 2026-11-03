(function(root){
'use strict';
function normalize(text){return String(text||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function text(node){return node.textContent||Array.from(node.children||[]).map(text).join(' ');}
function matches(value,terms){const haystack=normalize(value);return terms.every(term=>haystack.includes(term));}
let refresh=()=>{};
function init(){const d=root.document,input=d.getElementById('courseSearch'),clear=d.getElementById('courseSearchClear'),icon=d.getElementById('courseSearchIcon'),status=d.getElementById('courseSearchStatus'),list=d.getElementById('situationList');if(!input||input.dataset.initialized)return;input.dataset.initialized='true';const utilities=['freePlay','puzzleCollectionsMenu','mistakeCollectionMenu'].map(id=>d.getElementById(id)).filter(Boolean);let saved=null,pages=[];
 function remember(node){if(!saved.has(node))saved.set(node,{hidden:node.hidden,open:node.open});for(const child of Array.from(node.children||[]))remember(child);}
 function apply(){const terms=normalize(input.value).split(' ').filter(Boolean);pages=[];clear.hidden=!input.value;icon.hidden=!!input.value;if(!terms.length){if(saved)for(const[node,state]of saved){node.hidden=state.hidden;if(node.tagName==='DETAILS')node.open=state.open;}saved=null;status.textContent='';status.hidden=true;return;}
  if(!saved)saved=new Map();remember(list);for(const node of utilities)remember(node);let sections=0;
  function visit(node,ancestors){if(node.tagName==='SUMMARY')return false;const children=Array.from(node.children||[]);
   if(node.tagName==='DETAILS'){const name=text(children[0]),path=[...ancestors,name],own=matches(path.join(' '),terms);let found=false;for(const child of children.slice(1))if(visit(child,path))found=true;node.hidden=!(own||found);if(!node.hidden){node.open=true;sections++;}return !node.hidden;}
   if(node.tagName==='BUTTON'||node.tagName==='A'){const found=matches([...ancestors,text(node)].join(' '),terms);node.hidden=!found;if(found)pages.push(node);return found;}
   if(children.length){const heading=children.find(child=>/^H[1-6]$/.test(child.tagName)),path=heading?[...ancestors,text(heading)]:ancestors;let found=false;for(const child of children)if(visit(child,path))found=true;node.hidden=!found;return found;}
   const found=matches([...ancestors,text(node)].join(' '),terms);node.hidden=!found;return found;
  }
  for(const child of Array.from(list.children))visit(child,[]);for(const node of utilities)visit(node,[]);status.hidden=false;status.textContent=pages.length?pages.length+(pages.length===1?' page':' pages'):sections?sections+(sections===1?' chapter':' chapters'):'No pages or chapters found.';
 }
 input.oninput=apply;input.onsearch=apply;clear.onclick=()=>{input.value='';apply();input.focus?.();};input.onkeydown=e=>{if(e.key==='Escape'&&input.value){e.preventDefault();e.stopPropagation?.();clear.onclick();}else if((e.key==='Enter'||e.key==='ArrowDown')&&pages.length){e.preventDefault();pages[0].focus?.();if(e.key==='Enter')pages[0].click();}};refresh=apply;apply();
}
const api={normalize,matches,init,refresh:()=>refresh()};if(typeof module!=='undefined')module.exports=api;else root.TetrisCourseSearch=api;
})(globalThis);
