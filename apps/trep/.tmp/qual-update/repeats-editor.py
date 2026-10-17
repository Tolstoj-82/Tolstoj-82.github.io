from pathlib import Path
p=Path('.tmp/qual-update');root=Path('../qual-timer')
s=(root/'sound.js').read_text(encoding='utf-8').replace('pending=false,generation=0;', 'pending=false,generation=0,repeatTimer=null;')
s=s.replace('function stop(){generation++;', 'function stop(){clearTimeout(repeatTimer);repeatTimer=null;generation++;')
s=s.replace('function track(node){', 'function track(node,ended){').replace('active=active.filter(n=>n!==node);notify()', 'active=active.filter(n=>n!==node);ended?.();notify()')
a=s.index('async function play(');b=s.index('function saveFiles',a)
s=s[:a]+'''async function play(settings={},preview=false){stop();if(settings.mute&&!preview)return;const token=generation;pending=true;notify();try{await unlock();if(token!==generation)return;const c=ctx(),volume=Number(settings.soundVolume??.6),file=files.find(f=>f.id===settings.sound);const buffer=file?await decode(file):null;if(token!==generation)return;if(!file&&!builtins.some(([id])=>id===settings.sound)&&settings.sound)throw Error('Choose a sound or upload an MP3 first.');let remaining=settings.soundRepeat==='infinite'?Infinity:Math.max(1,Math.min(3,Number(settings.soundRepeat)||1));
const ended=()=>{if(token!==generation||active.length)return;if(--remaining>0){pending=true;repeatTimer=setTimeout(cycle,250)}else pending=false};
function cycle(){if(token!==generation)return;pending=false;repeatTimer=null;if(buffer){const source=c.createBufferSource(),gain=c.createGain();source.buffer=buffer;gain.gain.value=volume;source.connect(gain).connect(c.destination);track(source,ended);source.start();source.stop(c.currentTime+Math.min(20,buffer.duration))}else{const tunes={chime:[[660,0,.28],[880,.3,.35],[1100,.65,.65]],beeps:[[880,0,.18],[880,.3,.18],[880,.6,.18],[880,.9,.4]],arcade:[[523,0,.12],[659,.13,.12],[784,.26,.12],[1047,.4,.55]],bell:[[880,0,1.8],[1320,.02,1.4],[1760,.04,1.1]]};for(const [frequency,offset,duration]of tunes[settings.sound]||tunes.chime){const osc=c.createOscillator(),gain=c.createGain(),t=c.currentTime+offset;osc.type=settings.sound==='arcade'?'square':'sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume*(settings.sound==='arcade'?.09:.18),t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain).connect(c.destination);track(osc,ended);osc.start(t);osc.stop(t+duration+.03)}}notify()}
cycle();}finally{if(token===generation){pending=false;notify()}}}
'''+s[b:]
s=s.replace('group.append(preview);', '''const previewRow=el('div','sound-preview-row');const repeatLabel=el('label','sound-repeat','Repeat');const repeat=el('select');repeat.id='soundRepeat';for(const [value,text]of [['1','1×'],['2','2×'],['3','3×'],['infinite','∞']]){const option=el('option',null,text);option.value=value;repeat.append(option)}repeat.value=getSettings().soundRepeat||'1';repeat.onchange=()=>{stop();save('soundRepeat',repeat.value)};repeatLabel.append(repeat);previewRow.append(preview,repeatLabel);group.append(previewRow);''')
s=s.replace('window.qualSoundSync=()=>{render();', "window.qualSoundSync=()=>{repeat.value=getSettings().soundRepeat||'1';render();")
(p/'sound.js').write_text(s,encoding='utf-8')
s=(root/'settings.js').read_text(encoding='utf-8').replace("sound:'chime',", "sound:'chime',soundRepeat:'1',")
s=s.replace('window.qualRecalculate?.();', 'window.qualRecalculate?.();window.qualScoreEditorSync?.();')
(p/'settings.js').write_text(s,encoding='utf-8')
s=(root/'index.html').read_text(encoding='utf-8').replace('</body>', '<script src="score-editor.js"></script></body>')
for id in ['s1','s2','s3']:s=s.replace('id="'+id+'" type="text"', 'id="'+id+'" readonly tabindex="-1" type="text"')
(p/'index.html').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''
.sound-preview-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:-8px}
#settings .sound-preview-row .sound-preview{margin-top:0}
#settingsFields .sound-repeat{display:flex;flex-direction:row;align-items:center;gap:8px;font-size:14px}
#settingsFields .sound-repeat select{width:68px;min-height:34px}
.score-row input[readonly]{border-bottom:0;cursor:default}
.score-row input[readonly]:focus{background:transparent;outline:none}
.score-editor{position:absolute;display:grid;gap:14px;width:220px;padding:18px;background:#f8f9f5;border:1px solid #b7beaf;border-radius:12px;color:#34402e;font:14px system-ui;box-sizing:border-box}
.score-editor h2{margin:0;font-size:16px}.score-editor p{margin:0;color:#657062;font-size:12px;line-height:1.5}
.score-editor label{display:grid;gap:6px}.score-editor label[hidden]{display:none}
.score-editor input{box-sizing:border-box;width:100%;min-width:0;padding:9px 10px;border:1px solid #b2bba9;border-radius:6px;color:#293f24;background:white;font:16px system-ui;font-variant-numeric:tabular-nums}
'''
(p/'timer.css').write_text(s,encoding='utf-8')
