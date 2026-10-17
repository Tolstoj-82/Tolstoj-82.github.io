(()=>{
'use strict';
const $=id=>document.getElementById(id),time=$('time'),start=$('start'),s1=$('s1'),s2=$('s2'),s3=$('s3'),avg=$('avg');
const saved=window.qualState||{};let total=Number(saved.total)||5400,remaining=Number(saved.remaining??total),running=false,paused=!!saved.paused,pauseUsed=Number(saved.pauseUsed)||0,deadline=0,wallDeadline=0,pauseStarted=performance.now(),interval=null,alarmPlayed=false;
const limit=()=>Math.max(1,Math.min(120,Number(window.qualAppearance?.pauseMinutes)||5))*60;
const enabled=()=>window.qualAppearance?.pauseEnabled!==false;
const used=()=>pauseUsed+(paused?(performance.now()-pauseStarted)/1000:0);
const canPause=()=>enabled()&&used()<limit();
function fmt(n){n=Math.max(0,Math.ceil(n));return Math.floor(n/3600)+':'+String(Math.floor(n%3600/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function parse(v){const m=/^(\d{1,3}):(\d{2}):(\d{2})$/.exec(v.trim());return m?Number(m[1])*3600+Number(m[2])*60+Number(m[3]):null}
function stop(){running=false;paused=false;if(interval!==null){clearInterval(interval);interval=null}}
function schedule(){if(interval===null)interval=setInterval(tick,100)}
function render(){const blocked=running&&!canPause();start.disabled=blocked;$('modalStart').disabled=blocked;start.textContent=running?'Ⅱ PAUSE':paused?'▶ RESUME':'▶ START';$('modalStart').textContent=running?'Pause timer':paused?'Resume timer':'Start timer';time.readOnly=running&&!canPause();time.setAttribute('aria-readonly',String(time.readOnly));if(document.activeElement!==time)time.value=fmt(remaining);const label=$('pauseStatus');label.hidden=!paused;$('pauseRemaining').textContent=fmt(Math.max(0,limit()-used())).replace(/^0:/,'');window.qualPlacePause?.();window.qualSaveTimer?.({total,remaining,running,paused,pauseUsed:used(),pausedAt:paused?Date.now():null,wallDeadline:running?wallDeadline:null})}
function sound(){window.qualAudio?.play(window.qualAppearance).catch(()=>{})}
function done(){stop();remaining=0;if(!alarmPlayed){alarmPlayed=true;sound();time.classList.remove('flash');void time.offsetWidth;time.classList.add('flash')}render()}
function resume(at=performance.now()){if(paused)pauseUsed=Math.min(limit(),used());paused=false;running=true;deadline=at+remaining*1000;wallDeadline=Date.now()+(deadline-performance.now());schedule();tick()}
function pauseTimer(){if(!running||!canPause())return;remaining=Math.max(0,(deadline-performance.now())/1000);if(remaining<=0){done();return}running=false;paused=true;pauseStarted=performance.now();schedule();render()}
function tick(){if(paused){const expires=pauseStarted+Math.max(0,limit()-pauseUsed)*1000;if(!enabled()||performance.now()>=expires){resume(enabled()?expires:performance.now());return}render();return}if(!running)return;remaining=Math.max(0,(deadline-performance.now())/1000);if(remaining<=0)done();else render()}
function commit(){const n=parse(time.value);if(n!==null){total=n;remaining=n;alarmPlayed=false;time.classList.remove('flash')}render()}
let editDigits='',freshEntry=true;
let editedTime=false;function showDigits(){editedTime=true;const digits=editDigits.padStart(6,'0');time.value=Number(digits.slice(0,-4))+':'+digits.slice(-4,-2)+':'+digits.slice(-2);time.setSelectionRange(time.value.length,time.value.length)}
function enterDigits(value){if(freshEntry||time.selectionEnd-time.selectionStart===time.value.length)editDigits='';freshEntry=false;editDigits=(editDigits+value.replace(/\D/g,'')).replace(/^0+(?=\d)/,'').slice(-7);showDigits()}
function deleteDigit(){if(freshEntry){editDigits=String(time.value.replace(/\D/g,'')).replace(/^0+/,'');freshEntry=false}if(time.selectionEnd-time.selectionStart===time.value.length)editDigits='';else editDigits=editDigits.slice(0,-1);showDigits()}
time.addEventListener('focus',()=>{if(running){if(!canPause()){editedTime=false;time.blur();return}pauseTimer()}window.qualAudio?.stop();time.classList.remove('flash');freshEntry=true;editDigits='';editedTime=false;time.select()});
time.addEventListener('blur',()=>{if(editedTime)commit();time.value=fmt(remaining)});
time.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(/^\d$/.test(e.key)){e.preventDefault();enterDigits(e.key)}else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();deleteDigit()}else if(e.key==='Enter'){e.preventDefault();time.blur()}else if(e.key===':'){e.preventDefault()}});
time.addEventListener('beforeinput',e=>{if(e.inputType==='insertText'&&e.data){e.preventDefault();enterDigits(e.data)}else if(e.inputType==='deleteContentBackward'||e.inputType==='deleteContentForward'){e.preventDefault();deleteDigit()}});
time.addEventListener('input',()=>{editDigits=time.value.replace(/\D/g,'').slice(-7);freshEntry=false;showDigits()});
time.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text').trim();freshEntry=true;if(/^\d{1,3}:\d{1,2}(:\d{1,2})?$/.test(text)){const parts=text.split(':');editDigits=(parts.length===3?parts[0]+parts[1].padStart(2,'0')+parts[2].padStart(2,'0'):parts[0]+parts[1].padStart(2,'0')).slice(-7);freshEntry=false;showDigits()}else enterDigits(text)});

start.addEventListener('click',()=>{if(document.activeElement===time)time.blur();if(running){pauseTimer();return}if(remaining<=0){render();return}window.qualAudio?.stop();window.qualAudio?.unlock();resume()});
function resetDuration(value=total){window.qualAudio?.stop();stop();total=value;remaining=total;pauseUsed=0;alarmPlayed=false;time.classList.remove('flash');if(document.activeElement===time){editedTime=false;time.blur()}render()}
$('reset').addEventListener('click',()=>resetDuration());$('modalStart').addEventListener('click',()=>start.click());$('pauseResume').addEventListener('click',()=>start.click());$('modalReset').addEventListener('click',()=>resetDuration());
window.qualTimerSettingsChanged=()=>{if(paused)tick();render()};window.qualLoadDuration=value=>resetDuration(Math.max(0,Number(value)||0));
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||$('settings').open||e.target.closest('input,textarea,select,button,[contenteditable]'))return;if(e.code==='Space'){e.preventDefault();start.click()}else if(e.key.toLowerCase()==='r'){e.preventDefault();resetDuration()}});
document.addEventListener('visibilitychange',()=>{if(running||paused)tick()});
function calc(){for(const x of [s1,s2,s3]){const old=x.value,caret=x.selectionStart||0,before=old.slice(0,caret).replace(/\D/g,'').length,digits=old.replace(/\D/g,'').slice(0,7);x.value=digits?Number(digits).toLocaleString('en-US'):'';let p=0,n=0;while(p<x.value.length&&n<before){if(/\d/.test(x.value[p]))n++;p++}if(document.activeElement===x)x.setSelectionRange(p,p)}const count=Number(window.qualAppearance?.scoreCount)===3?3:2;const scores=[s1,s2,s3].slice(0,count);$('score3Row').hidden=count!==3;$('averageLabel').textContent='AO'+count+':';avg.textContent=scores.every(x=>x.value!=='')?(scores.reduce((sum,x)=>sum+Number(x.value.replace(/,/g,'')),0)/count).toLocaleString('en-US',{maximumFractionDigits:1}):'—'}window.qualRecalculate=calc;s1.addEventListener('input',calc);s2.addEventListener('input',calc);s3.addEventListener('input',calc);
calc();
if(paused){pauseUsed+=Math.max(0,(Date.now()-Number(saved.pausedAt||Date.now()))/1000);pauseStarted=performance.now();if(pauseUsed>=limit()||!enabled()){const overdue=enabled()?Math.max(0,pauseUsed-limit()):0;pauseUsed=Math.min(limit(),pauseUsed);remaining=Math.max(0,remaining-overdue);paused=false;if(remaining>0)resume();else done()}else{schedule();render()}}
else if(saved.running&&Number(saved.wallDeadline)){remaining=Math.max(0,(saved.wallDeadline-Date.now())/1000);if(remaining>0)resume();else done()}else render();
})();
