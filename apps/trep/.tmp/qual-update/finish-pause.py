from pathlib import Path
p=Path('.tmp/qual-update')
s=(p/'timer.js').read_text(encoding='utf-8').replace("if(!canPause()){time.blur();return}", "if(!canPause()){editedTime=false;time.blur();return}").replace("let editedTime=false;const originalEnter=()=>{};", "let editedTime=false;")
(p/'timer.js').write_text(s,encoding='utf-8')
s=(p/'settings.js').read_text(encoding='utf-8').replace('total:state.total||5400','total:state.total??5400').replace('saveName();apply();sync();window.qualLoadDuration?.(snapshot.total);','saveName();window.qualLoadDuration?.(snapshot.total);apply();sync();')
(p/'settings.js').write_text(s,encoding='utf-8')
s=(p/'timer.css').read_text(encoding='utf-8').replace('.time-field{position:relative;min-width:0}', '.time-field{position:relative;min-width:0;padding-top:16px}').replace('#pauseStatus{position:absolute;bottom:100%;', '#pauseStatus{position:absolute;top:0;')
(p/'timer.css').write_text(s,encoding='utf-8')
