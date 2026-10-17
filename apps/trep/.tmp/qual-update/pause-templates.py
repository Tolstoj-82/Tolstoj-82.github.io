from pathlib import Path
root=Path('../qual-timer');p=Path('.tmp/qual-update')
s=(root/'index.html').read_text(encoding='utf-8');inline=s.split('<script>')[1].split('</script>')[0]
entry=inline[inline.index("let editDigits="):inline.index("start.addEventListener('click'")]
entry=entry.replace("if(running){tick();stop();render()}", "if(running){if(!canPause()){time.blur();return}pauseTimer()}")
entry=entry.replace("function showDigits(){", "let editedTime=false;const originalEnter=()=>{};function showDigits(){editedTime=true;")
entry=entry.replace("freshEntry=true;editDigits='';time.select()", "freshEntry=true;editDigits='';editedTime=false;time.select()")
entry=entry.replace("time.addEventListener('blur',()=>{commit();time.value=fmt(remaining)});", "time.addEventListener('blur',()=>{if(editedTime)commit();time.value=fmt(remaining)});")
calc=inline[inline.index('function calc(){'):inline.index("calc();render()")]
head='''(()=>{
'use strict';
const $=id=>document.getElementById(id),time=$('time'),start=$('start'),s1=$('s1'),s2=$('s2'),s3=$('s3'),avg=$('avg');
const saved=window.qualState||{};let total=Number(saved.total)||5400,remaining=Number(saved.remaining??total),running=false,paused=!!saved.paused,pauseUsed=Number(saved.pauseUsed)||0,deadline=0,wallDeadline=0,pauseStarted=performance.now(),interval=null,alarmPlayed=false;
const limit=()=>Math.max(1,Math.min(120,Number(window.qualAppearance?.pauseMinutes)||5))*60;
const enabled=()=>window.qualAppearance?.pauseEnabled!==false;
const used=()=>pauseUsed+(paused?(performance.now()-pauseStarted)/1000:0);
const canPause=()=>enabled()&&used()<limit();
function fmt(n){n=Math.max(0,Math.ceil(n));return Math.floor(n/3600)+':'+String(Math.floor(n%3600/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function parse(v){const m=/^(\\d{1,3}):(\\d{2}):(\\d{2})$/.exec(v.trim());return m?Number(m[1])*3600+Number(m[2])*60+Number(m[3]):null}
function stop(){running=false;paused=false;if(interval!==null){clearInterval(interval);interval=null}}
function schedule(){if(interval===null)interval=setInterval(tick,100)}
function render(){const blocked=running&&!canPause();start.disabled=blocked;$('modalStart').disabled=blocked;start.textContent=running?'Ⅱ PAUSE':paused?'▶ RESUME':'▶ START';$('modalStart').textContent=running?'Pause timer':paused?'Resume timer':'Start timer';time.readOnly=running&&!canPause();time.setAttribute('aria-readonly',String(time.readOnly));if(document.activeElement!==time)time.value=fmt(remaining);const label=$('pauseStatus');label.hidden=!paused;label.textContent=paused?'PAUSED · '+fmt(Math.max(0,limit()-used())).replace(/^0:/,''):'';window.qualSaveTimer?.({total,remaining,running,paused,pauseUsed:used(),pausedAt:paused?Date.now():null,wallDeadline:running?wallDeadline:null})}
function sound(){window.qualAudio?.play(window.qualAppearance).catch(()=>{})}
function done(){stop();remaining=0;if(!alarmPlayed){alarmPlayed=true;sound();time.classList.remove('flash');void time.offsetWidth;time.classList.add('flash')}render()}
function resume(at=performance.now()){if(paused)pauseUsed=Math.min(limit(),used());paused=false;running=true;deadline=at+remaining*1000;wallDeadline=Date.now()+(deadline-performance.now());schedule();tick()}
function pauseTimer(){if(!running||!canPause())return;remaining=Math.max(0,(deadline-performance.now())/1000);if(remaining<=0){done();return}running=false;paused=true;pauseStarted=performance.now();schedule();render()}
function tick(){if(paused){const expires=pauseStarted+Math.max(0,limit()-pauseUsed)*1000;if(!enabled()||performance.now()>=expires){resume(enabled()?expires:performance.now());return}render();return}if(!running)return;remaining=Math.max(0,(deadline-performance.now())/1000);if(remaining<=0)done();else render()}
function commit(){const n=parse(time.value);if(n!==null){total=n;remaining=n;alarmPlayed=false;time.classList.remove('flash')}render()}
'''
foot='''
start.addEventListener('click',()=>{if(document.activeElement===time)time.blur();if(running){pauseTimer();return}if(remaining<=0){render();return}window.qualAudio?.stop();window.qualAudio?.unlock();resume()});
function resetDuration(value=total){window.qualAudio?.stop();stop();total=value;remaining=total;pauseUsed=0;alarmPlayed=false;time.classList.remove('flash');if(document.activeElement===time){editedTime=false;time.blur()}render()}
$('reset').addEventListener('click',()=>resetDuration());$('modalStart').addEventListener('click',()=>start.click());$('modalReset').addEventListener('click',()=>resetDuration());
window.qualTimerSettingsChanged=()=>{if(paused)tick();render()};window.qualLoadDuration=value=>resetDuration(Math.max(0,Number(value)||0));
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||$('settings').open||e.target.closest('input,textarea,select,button,[contenteditable]'))return;if(e.code==='Space'){e.preventDefault();start.click()}else if(e.key.toLowerCase()==='r'){e.preventDefault();resetDuration()}});
document.addEventListener('visibilitychange',()=>{if(running||paused)tick()});
'''
bootstrap='''
calc();
if(paused){pauseUsed+=Math.max(0,(Date.now()-Number(saved.pausedAt||Date.now()))/1000);pauseStarted=performance.now();if(pauseUsed>=limit()||!enabled()){const overdue=enabled()?Math.max(0,pauseUsed-limit()):0;pauseUsed=Math.min(limit(),pauseUsed);remaining=Math.max(0,remaining-overdue);paused=false;if(remaining>0)resume();else done()}else{schedule();render()}}
else if(saved.running&&Number(saved.wallDeadline)){remaining=Math.max(0,(saved.wallDeadline-Date.now())/1000);if(remaining>0)resume();else done()}else render();
})();
'''
(p/'timer.js').write_text(head+entry+foot+calc+bootstrap,encoding='utf-8')
s=s.replace('<script>'+inline+'</script>', '<script src="timer.js"></script>')
s=s.replace('<input class="time"', '<div class="time-field"><span id="pauseStatus" role="status" hidden></span><input class="time"').replace('aria-describedby="timeHint">','aria-describedby="timeHint"></div>')
s=s.replace('<script src="settings.js">','<script src="templates.js"></script><script src="settings.js">')
(p/'index.html').write_text(s,encoding='utf-8')
s=(root/'settings.js').read_text(encoding='utf-8').replace('flat:false,','pauseEnabled:true,pauseMinutes:5,flat:false,')
a=s.index('window.qualState=state;window.qualSaveTimer=');b=s.index("const frame=",a)
s=s[:a]+'''window.qualState=state;let lastTimerSave='';window.qualSaveTimer=value=>{const marker=JSON.stringify({...value,remaining:Math.ceil(value.remaining),pauseUsed:Math.floor(value.pauseUsed||0),pausedAt:null});Object.assign(state,value);if(marker!==lastTimerSave){lastTimerSave=marker;persist()}};
'''+s[b:]
s=s.replace('window.qualScoreEditorSync?.();','window.qualScoreEditorSync?.();window.qualTimerSettingsChanged?.();')
s=s.replace("prop==='height'?300:8", "prop==='height'?300:prop==='pauseMinutes'?1:8").replace("prop==='height'?1400:100", "prop==='height'?1400:prop==='pauseMinutes'?120:100")
s=s.replace("field('Timer heading','title');", "field('Timer heading','title');field('Allow pausing','pauseEnabled','checkbox');field('Total pause allowance (minutes)','pauseMinutes','number');")
s=s.replace("const preset=document.createElement('label');", "window.qualTemplates.mount(fields,()=>({appearance:{...appearance},name:name.value,total:state.total||5400}),snapshot=>{appearance={...defaults,...snapshot.appearance};name.value=String(snapshot.name||'DOT MATRIX').toUpperCase();saveName();apply();sync();window.qualLoadDuration?.(snapshot.total);});\nconst preset=document.createElement('label');")
(p/'settings.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''
.time-field{position:relative;min-width:0}.time-field .time{display:block}
#pauseStatus{position:absolute;bottom:100%;left:0;width:100%;text-align:center;font:600 11px system-ui;letter-spacing:1px;color:var(--ink);pointer-events:none}
#pauseStatus[hidden]{display:none}
.frame .name:focus,.frame .time:focus,.frame .score-row input:focus,.frame .heading[contenteditable]:focus{background:color-mix(in srgb,var(--screen),white 38%);color:var(--ink);outline:1px solid var(--ink);outline-offset:0;border-radius:3px;box-shadow:inset 0 1px 3px #0003}
.frame .name:focus{background:color-mix(in srgb,var(--bezel),white 18%);color:white;outline-color:#ddd}
.frame .time[readonly]{cursor:default}.actions button:disabled{opacity:.55;cursor:default;transform:none}
.template-settings{display:grid;gap:12px;margin:0 0 8px;padding:0 0 20px;border-bottom:1px solid #e0e4da}.template-settings h3,.template-settings p{margin:0}.template-actions{display:flex;gap:8px;flex-wrap:wrap}
'''
(p/'timer.css').write_text(s,encoding='utf-8')
