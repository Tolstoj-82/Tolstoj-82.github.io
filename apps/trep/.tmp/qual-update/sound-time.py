from pathlib import Path
stage=Path('.tmp/qual-update');root=Path('../qual-timer')
s=(root/'settings.js').read_text(encoding='utf-8').replace("scoreCount:2,", "scoreCount:2,sound:'chime',soundVolume:0.6,")
s=s.replace('function sync(){', "window.qualAudio.mount(fields,()=>appearance,(key,value)=>{appearance[key]=value;apply()});\nfunction sync(){window.qualSoundSync?.();")
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(stage/'sound.js').read_text(encoding='utf-8').replace("upload.disabled=true;try{", "upload.disabled=true;try{if(loading)await loading;")
s=s.replace("volumeLabel.append(volume);group.append(volumeLabel);", "volumeLabel.append(volume);group.append(volumeLabel);window.qualSoundSync=()=>{select.value=getSettings().sound||'chime';volume.value=getSettings().soundVolume??.6};")
(stage/'sound.js').write_text(s,encoding='utf-8')
s=(root/'index.html').read_text(encoding='utf-8').replace('<script src="settings.js">', '<script src="sound.js"></script><script src="settings.js">')
s=s.replace('aria-label="Hours minutes seconds"','aria-label="Hours minutes seconds" inputmode="numeric" autocomplete="off" spellcheck="false" aria-describedby="timeHint"')
s=s.replace('<div class="rule"></div>', '<span id="timeHint" class="sr-only">Type digits from right to left: 13000 sets 1 hour 30 minutes. Colons are automatic. Enter confirms.</span><div class="rule"></div>')
a=s.index('function sound(){');b=s.index('function done(){',a)
s=s[:a]+"function sound(){window.qualAudio?.play(window.qualAppearance).catch(()=>{});} "+s[b:]
# Replace strict parsing with duration normalization (90 seconds becomes 1:30).
a=s.index('function parse(v){');b=s.index('function stop(){',a)
s=s[:a]+"function parse(v){const m=/^(\\d{1,3}):(\\d{2}):(\\d{2})$/.exec(v.trim());return m?Number(m[1])*3600+Number(m[2])*60+Number(m[3]):null}"+s[b:]
a=s.index("time.addEventListener('focus'");b=s.index("start.addEventListener('click'",a)
s=s[:a]+'''let editDigits='',freshEntry=true;
function showDigits(){const digits=editDigits.padStart(6,'0');time.value=Number(digits.slice(0,-4))+':'+digits.slice(-4,-2)+':'+digits.slice(-2);time.setSelectionRange(time.value.length,time.value.length)}
function enterDigits(value){if(freshEntry||time.selectionEnd-time.selectionStart===time.value.length)editDigits='';freshEntry=false;editDigits=(editDigits+value.replace(/\\D/g,'')).replace(/^0+(?=\\d)/,'').slice(-7);showDigits()}
function deleteDigit(){if(freshEntry){editDigits=String(time.value.replace(/\\D/g,'')).replace(/^0+/,'');freshEntry=false}if(time.selectionEnd-time.selectionStart===time.value.length)editDigits='';else editDigits=editDigits.slice(0,-1);showDigits()}
time.addEventListener('focus',()=>{if(running){tick();stop();render()}window.qualAudio?.stop();time.classList.remove('flash');freshEntry=true;editDigits='';time.select()});
time.addEventListener('blur',()=>{commit();time.value=fmt(remaining)});
time.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(/^\\d$/.test(e.key)){e.preventDefault();enterDigits(e.key)}else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();deleteDigit()}else if(e.key==='Enter'){e.preventDefault();time.blur()}else if(e.key===':'){e.preventDefault()}});
time.addEventListener('beforeinput',e=>{if(e.inputType==='insertText'&&e.data){e.preventDefault();enterDigits(e.data)}else if(e.inputType==='deleteContentBackward'||e.inputType==='deleteContentForward'){e.preventDefault();deleteDigit()}});
time.addEventListener('input',()=>{editDigits=time.value.replace(/\\D/g,'').slice(-7);freshEntry=false;showDigits()});
time.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text').trim();freshEntry=true;if(/^\\d{1,3}:\\d{1,2}(:\\d{1,2})?$/.test(text)){const parts=text.split(':');editDigits=(parts.length===3?parts[0]+parts[1].padStart(2,'0')+parts[2].padStart(2,'0'):parts[0]+parts[1].padStart(2,'0')).slice(-7);freshEntry=false;showDigits()}else enterDigits(text)});
'''+s[b:]
a=s.index('try{const C=window.AudioContext',s.index("start.addEventListener('click'"));b=s.index('running=true;',a)
s=s[:a]+"window.qualAudio?.stop();window.qualAudio?.unlock();"+s[b:]
s=s.replace("$('reset').addEventListener('click',()=>{stop();", "$('reset').addEventListener('click',()=>{window.qualAudio?.stop();stop();")
(stage/'index.html').write_text(s,encoding='utf-8');(stage/'timer-inline.js').write_text(s.split('<script>')[1].split('</script>')[0],encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''\n.sound-settings{display:grid;gap:16px;border-top:1px solid #e0e4da;padding-top:16px}.sound-settings h3,.sound-settings p{margin:0}.sound-settings .modal-timer-controls{gap:8px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}\n'''
(stage/'timer.css').write_text(s,encoding='utf-8')
