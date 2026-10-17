from pathlib import Path
p=Path('.tmp/qual-update'); root=Path('../qual-timer')
s=(root/'index.html').read_text(encoding='utf-8')
button='<button class="settings-button" id="openSettings" aria-label="Open appearance settings">⚙</button>'
s=s.replace('<body><main class="frame" id="timerFrame">'+button,'<body>'+button+'<main class="frame" id="timerFrame">')
s=s.replace('aria-expanded="false">▾</button>', 'aria-expanded="false" title="Saved timer names"><span class="name-chevron" aria-hidden="true"></span></button>')
s=s.replace('<div id="settingsFields"></div>', '<div class="modal-timer-controls"><button type="button" id="modalStart">Start / pause</button><button type="button" id="modalReset">Reset timer</button></div><p class="hint">Keyboard: Space starts or pauses; R resets (outside text fields). These work when timer buttons are hidden.</p><div id="settingsFields"></div>')
s=s.replace("function render(){window.qualSaveTimer", "function render(){const modalStart=$('modalStart');if(modalStart)modalStart.textContent=running?'Pause timer':'Start timer';window.qualSaveTimer")
s=s.replace("document.addEventListener('visibilitychange'", "$('modalStart').addEventListener('click',()=>start.click());$('modalReset').addEventListener('click',()=>$('reset').click());document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||$('settings').open||e.target.closest('input,textarea,select,button,[contenteditable]'))return;if(e.code==='Space'){e.preventDefault();start.click()}else if(e.key.toLowerCase()==='r'){e.preventDefault();$('reset').click()}});document.addEventListener('visibilitychange'")
# Normalize legacy over-escaped regexes, if present.
s=s.replace('\\\\d','\\d').replace('\\\\D','\\D')
(p/'index.html').write_text(s,encoding='utf-8')
(p/'timer-inline.js').write_text(s.split('<script>')[1].split('</script>')[0],encoding='utf-8')
s=(root/'settings.js').read_text(encoding='utf-8')
s=s.replace("let names=Array.isArray(state.names)?state.names.filter(n=>typeof n==='string').slice(0,50):[];", "let names=Array.isArray(state.names)?[...new Set(state.names.filter(n=>typeof n==='string').map(n=>n.toUpperCase()))].slice(0,50):[];")
s=s.replace("name.value=typeof state.name==='string'?state.name:'DOT MATRIX';", "name.value=typeof state.name==='string'?state.name.toUpperCase():'DOT MATRIX';")
s=s.replace("let appearance={...defaults,...state.appearance};", "let appearance={...defaults,...state.appearance};for(const part of ['heading','time','score','average'])appearance[part+'Font']??=appearance.font;appearance.averageSize??=appearance.scoreSize;")
s=s.replace("for(const prop of ['heading','time','label','score'])", "for(const part of ['heading','time','score','average'])document.body.style.setProperty('--'+part+'-font',appearance[part+'Font']);document.body.style.setProperty('--average-size',appearance.averageSize+'px');for(const prop of ['heading','time','label','score'])")
s=s.replace("const value=name.value.trim();state.name=value;", "const value=name.value.trim().toUpperCase();name.value=value;state.name=value;")
s=s.replace("name.addEventListener('input',()=>{state.name=name.value;", "name.addEventListener('input',()=>{const start=name.selectionStart,end=name.selectionEnd;name.value=name.value.toUpperCase();name.setSelectionRange(start,end);state.name=name.value;")
start=s.index("field('Font face','font'")
end=s.index("for(const [p,t]of [['heading','Heading']",start)
s=s[:start]+"const fonts=[[\"'Press Start 2P'\",'Pixel / Game Boy'],['Arial','Arial'],[\"'Courier New'\",'Courier New'],['Georgia','Georgia'],['system-ui','System'],['monospace','Monospace']];for(const [part,label]of [['heading','Heading'],['time','Countdown'],['score','Scores'],['average','Average']])field(label+' font',part+'Font','text',fonts);"+s[end:]
s=s.replace("['score','Score numbers']", "['score','Score numbers'],['average','Average']")
s=s.replace("appearance={...defaults};apply();sync()", "appearance={...defaults};for(const part of ['heading','time','score','average'])appearance[part+'Font']=defaults.font;appearance.averageSize=defaults.scoreSize;apply();sync()")
(p/'settings.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8').replace('position:absolute;right:-14px;top:-14px','position:fixed;right:20px;top:20px').replace('grid-template-columns:1fr 1fr','grid-template-columns:1fr').replace('text-transform:none','text-transform:uppercase').replace('font-family:var(--font,Arial)','font-family:Arial,sans-serif')
s+='''\n.heading{font-family:var(--heading-font,monospace)}.time{font-family:var(--time-font,monospace)}.score-row{font-family:var(--score-font,monospace)}.average{font-family:var(--average-font,monospace);font-size:var(--average-size,23px)}
#settingsFields input[type=color]{width:36px;height:36px;min-height:36px;padding:0;border-radius:4px;overflow:hidden;cursor:pointer;flex:none}#settingsFields input[type=color]::-webkit-color-swatch-wrapper{padding:0}#settingsFields input[type=color]::-webkit-color-swatch{border:0}#settingsFields input[type=color]::-moz-color-swatch{border:0}
.name-picker>button{display:flex;align-items:center;justify-content:center;width:24px;height:24px;flex:none;appearance:none;border-radius:0;background:none}.name-chevron{display:block;width:7px;height:7px;border-right:2px solid white;border-bottom:2px solid white;transform:translateY(-2px) rotate(45deg)}.modal-timer-controls{display:flex;gap:10px;flex-wrap:wrap}
@container(max-width:390px){.average{font-size:min(var(--average-size,23px),6cqw)}}@container(max-height:420px){.average{font-size:min(var(--average-size,23px),6cqh)}}
'''
(p/'timer.css').write_text(s,encoding='utf-8')
