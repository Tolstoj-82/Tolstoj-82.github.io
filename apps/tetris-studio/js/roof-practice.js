(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./core'):root.TetrisCore,P=typeof module!=='undefined'?require('./playable'):root.TetrisPlayable,R=typeof module!=='undefined'?require('./roof-burns'):root.TetrisRoofBurns;
const DATA=typeof module!=='undefined'?require('./roof-practice-data'):root.TetrisRoofPracticeData;
const LEVEL=6,COUNTDOWN=3000,FEEDBACK=700;
const variantRecords=new Map(DATA.entries.map(entry=>[entry.key,entry.variants])),variantCache=new WeakMap();
function variants(source){if(variantCache.has(source))return variantCache.get(source);const records=variantRecords.get(source.roofBurn?.key);if(!records)return [source];const result=records.map(v=>C.normalize({title:'Roof-burn practice',chapter:'Save stacking',section:'Rooftop burning',qualityWell:0,roofBurn:{...source.roofBurn,target:v.target,clears:v.rows.length,originalHoles:v.originalHoles,opened:v.opened,focusOpened:v.opened,note:'Open the covered holes without adding an overhang.'},frames:[{board:v.board,active:C.spawn(v.target.type),highlight:false},{active:v.target,highlight:false},{active:v.target,clear:true,highlight:false},{highlight:false}]}));variantCache.set(source,result);return result;}
function grade(before,attempt){
 const rows=attempt.frame?.clearRows||[],after=C.collapseRows(attempt.board,rows),opened=R.openedCells(before,after,rows),old=new Set();
 for(let y=0;y<18;y++)for(let x=0;x<10;x++)if(!rows.includes(y)&&R.covered(before,x,y))old.add([x,y+rows.filter(r=>r>y).length].join(','));
 for(let y=0;y<18;y++)for(let x=0;x<10;x++)if(R.covered(after,x,y)&&!old.has([x,y].join(',')))return false;
 return rows.length>0&&opened.length>0;
}
class Session{
 constructor(situations,{random=Math.random,continuous=false,assess=grade}={}){this.assess=assess;if(!situations.length)throw Error('No roof-burn situations');this.situations=situations;this.random=random;this.continuous=continuous;this.bag=[];this.lastScene=null;this.round=0;this.correct=0;this.failed=0;this.next();}
 choose(){if(!this.continuous)return this.situations[0];if(!this.bag.length){this.bag=[...this.situations];for(let i=this.bag.length-1;i>0;i--){const n=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[n]]=[this.bag[n],this.bag[i]];}if(this.bag.length>1&&this.bag.at(-1)===this.lastScene)[this.bag[0],this.bag[this.bag.length-1]]=[this.bag.at(-1),this.bag[0]];}return this.bag.pop();}
 next(){this.sourceScene=this.choose();this.lastScene=this.sourceScene;const choices=this.continuous?variants(this.sourceScene):[this.sourceScene];this.scene=choices[Math.floor(this.random()*choices.length)];this.before=C.compose({...this.scene.frames[0],active:undefined},18);this.attempt=new P.Attempt(this.scene,P.gravityForLevel(LEVEL));this.held=new Map();this.clock=new P.InputClock(this.attempt,this.held);this.stage='countdown';this.elapsed=0;this.round++;}
 release(){this.held.clear();}
 press(action){if(this.stage!=='playing')return false;return this.clock.press(action);}
 advance(ms){
  if(this.stage==='countdown'){this.elapsed+=ms;if(this.elapsed>=COUNTDOWN){const rest=this.elapsed-COUNTDOWN;this.stage='playing';this.elapsed=0;if(rest)this.advance(rest);}return;}
  if(this.stage==='feedback'){this.elapsed+=ms;if(this.continuous&&this.elapsed>=FEEDBACK)this.next();return;}
  this.clock.advance(ms);
  if(this.attempt.done){this.release();if(!this.attempt.frame?.clear||this.attempt.clearTicks>=C.LINE_CLEAR.ticks){this.result=this.assess(this.before,this.attempt);this.attempt.correct=this.result;this.result?this.correct++:this.failed++;this.stage='feedback';this.elapsed=0;}}
 }
}
let bridge,active=null,frameId=0,modal=null,returnFocus=null;
function element(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text)e.textContent=text;return e;}
function bindings(){return root.liveAttempt?.getBindings?.()||{left:'ArrowLeft',right:'ArrowRight',down:'ArrowDown',b:'KeyZ',a:'KeyX'};}
function release(){if(active){active.session.release();active.keys.clear();}}
function close(){if(!active)return;const a=active;active=null;frameId++;releaseSession(a);if(a.modal){modal.hidden=true;modal.replaceChildren();document.body.classList.remove('roof-modal-open');returnFocus?.focus?.();}else a.host.replaceChildren();}
function releaseSession(a){a.session.release();a.keys.clear();}
function dispose(){close();}
function draw(){if(!active)return;const a=active,s=a.session,f=s.attempt.view();bridge.draw(a.canvas,C.compose(f,18),18,f,s.attempt.clearTicks);const countdown=s.stage==='countdown';a.overlay.hidden=!countdown&&s.stage!=='feedback';a.overlay.className='roof-game-overlay '+(countdown?'countdown':s.result?'correct':'incorrect');a.status.textContent=s.continuous?'Round '+s.round+'   Correct '+s.correct+'   Fail '+s.failed:'Level 6';a.overlay.textContent=countdown?String(Math.max(1,Math.ceil((COUNTDOWN-s.elapsed)/1000))):s.result?'Correct':'Fail';if(countdown){const beat=s.elapsed%1000,scale=beat<160?.05+.95*beat/160:1+(beat-160)/1000;a.overlay.style.transform='scale('+scale.toFixed(3)+')';a.overlay.style.opacity=String(beat<650?.4:0);}else{a.overlay.style.transform='none';a.overlay.style.opacity='1';}a.retry.hidden=s.continuous||s.stage!=='feedback';for(const[key,el]of a.buttons){const action={Left:'left',Right:'right',Down:'down',A:'a',B:'b'}[key];el.classList.toggle('lit',s.held.has(action));}}
function tick(time,id){if(!active||id!==frameId)return;const dt=active.last===null?0:Math.min(1000,Math.max(0,time-active.last));active.last=time;active.session.advance(dt);draw();requestAnimationFrame(t=>tick(t,id));}
function controls(){
 const host=element('div','controller roof-game-controller'),svg=(document.createElementNS?document.createElementNS('http://www.w3.org/2000/svg','svg'):document.createElement('svg'));svg.setAttribute('viewBox','0 0 242 128');svg.setAttribute('width','242');svg.setAttribute('height','128');svg.setAttribute('class','controller-viewport');
 const object=document.createElementNS?document.createElementNS('http://www.w3.org/2000/svg','foreignObject'):document.createElement('foreignObject');object.setAttribute('width','242');object.setAttribute('height','128');
 const body=element('div','controller-body'),pad=element('div','dpad'),ab=element('div','ab'),buttons=new Map();body.setAttribute('xmlns','http://www.w3.org/1999/xhtml');pad.append(element('span','dpad-shape'));
 for(const [key,cls]of [['Left','dpad-segment left'],['Right','dpad-segment right'],['Down','dpad-segment down'],['B','action-button'],['A','action-button']]){
  const button=element('span',cls);button.dataset.key=key;button.dataset.roofKey=key;button.setAttribute('role','button');button.setAttribute('tabindex','0');button.setAttribute('aria-label',key);const action={Left:'left',Right:'right',Down:'down',A:'a',B:'b'}[key];
  button.onpointerdown=e=>{e.preventDefault();e.stopPropagation();if(!active||active.session.stage!=='playing')return;button.setPointerCapture?.(e.pointerId);active.session.press(action);draw();};const up=e=>{e?.preventDefault?.();active?.session.held.delete(action);draw();};button.onpointerup=up;button.onpointercancel=up;button.onlostpointercapture=up;
  if(key==='A'||key==='B'){ab.append(button,element('span','action-letter letter-'+key.toLowerCase(),key));}else pad.append(button);buttons.set(key,button);
 }
 const up=element('span','dpad-segment up');pad.append(up,element('span','dpad-center'));body.append(pad,ab);object.append(body);svg.append(object);host.append(svg);return {host,buttons};
}
function mount(host,{scene=null,continuous=false,modalMode=false,assess=grade}={}){
 close();bridge.stop();root.liveAttempt?.isOpen?.()&&root.liveAttempt.leave();const situations=scene?[scene]:R.studies(),session=new Session(situations,{continuous,assess});const game=element('div','roof-game'),hardware=element('div','roof-game-hardware'),screen=element('div','roof-game-screen'),canvas=element('canvas'),overlay=element('div','roof-game-overlay'),controller=controls(),status=element('p','roof-game-status'),retry=element('button',null,'Try again');canvas.width=96;canvas.height=144;canvas.setAttribute('tabindex','0');canvas.setAttribute('aria-label','Play roof burn');overlay.setAttribute('role','status');retry.hidden=true;retry.onclick=()=>{if(active){release();active.session.next();active.last=null;draw();canvas.focus?.();}};
 const actions=element('div','roof-game-actions');actions.hidden=continuous;actions.append(retry);screen.append(canvas,overlay);hardware.append(screen,controller.host);game.append(status,hardware,actions);host.append(game);active={host,modal:modalMode,session,canvas,overlay,retry,status,buttons:controller.buttons,last:null,keys:new Set()};const id=++frameId;draw();requestAnimationFrame(t=>tick(t,id));canvas.focus?.();return session;
}
function open(scene,{assess=grade}={}){
 if(!bridge)return;returnFocus=document.activeElement;close();if(!modal){modal=element('section','roof-example-modal');modal.id='roofExampleModal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','roofExampleTitle');document.body.append(modal);}modal.hidden=false;const card=element('div','roof-example-dialog'),title=element('h2',null,'Try it yourself'),exit=element('button','roof-example-close','×');title.id='roofExampleTitle';exit.setAttribute('aria-label','Close example');exit.onclick=close;card.append(title,exit);modal.append(card);mount(card,{scene,modalMode:true,assess});document.body.classList.add('roof-modal-open');
}
function practice(container){const intro=element('p',null,'Open the covered holes without adding a new buried hole. Play at level 6. After each result, a new random board starts. Stop whenever you like.'),host=element('div','roof-practice-page'),exit=element('button',null,'Back to roof burns');exit.onclick=()=>root.TetrisCourse.openLesson('roof-burns');container.append(intro,host,exit);mount(host,{continuous:true});}
function init(b){bridge=b;document.addEventListener('keydown',e=>{
 if(!active)return;if(e.code==='Escape'&&active.modal){e.preventDefault();close();return;}
 if(active.modal&&e.key==='Tab'){const exit=modal.querySelector?.('.roof-example-close'),first=exit,last=active.retry.hidden?[...active.buttons.values()].at(-1):active.retry,focused=document.activeElement;if(e.shiftKey&&focused===first){e.preventDefault();last.focus?.();}else if(!e.shiftKey&&focused===last){e.preventDefault();first.focus?.();}return;}
 let action=Object.entries(bindings()).find(([a,code])=>a!=='pause'&&code===e.code)?.[0];if(!action&&['Enter','Space'].includes(e.code)&&e.target?.dataset?.roofKey)action={Left:'left',Right:'right',Down:'down',A:'a',B:'b'}[e.target.dataset.roofKey];if(!action||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;e.preventDefault();if(!e.repeat&&!active.keys.has(e.code)){active.keys.add(e.code);active.session.press(action);draw();}
 });document.addEventListener('keyup',e=>{if(!active)return;const action=Object.entries(bindings()).find(([,code])=>code===e.code)?.[0]||({Left:'left',Right:'right',Down:'down',A:'a',B:'b'}[e.target?.dataset?.roofKey]);active.keys.delete(e.code);if(action)active.session.held.delete(action);draw();});root.addEventListener?.('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden){release();if(active)active.last=null;}});}
const api={LEVEL,COUNTDOWN,FEEDBACK,Session,grade,variants,init,open,practice,dispose,isOpen:()=>!!active};if(typeof module!=='undefined')module.exports=api;else root.TetrisRoofPractice=api;
})(globalThis);
