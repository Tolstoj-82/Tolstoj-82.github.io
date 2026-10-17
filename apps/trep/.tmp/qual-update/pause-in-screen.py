from pathlib import Path
root=Path('../qual-timer');p=Path('.tmp/qual-update')
s=(root/'timer.css').read_text(encoding='utf-8').replace('#pauseStatus{position:absolute;left:20px;top:20px;width:300px;', '#pauseStatus{position:absolute;left:0;top:0;width:300px;transform-origin:center top;')
(p/'timer.css').write_text(s,encoding='utf-8')
s=(root/'score-editor.js').read_text(encoding='utf-8')
s=s.replace("const popup=document.getElementById('pauseStatus');if(!beside&&popup&&!popup.hidden&&popup.dataset.position==='below')top=Math.max(top,popup.getBoundingClientRect().bottom+scrollY+gap);",'')
(p/'score-editor.js').write_text(s,encoding='utf-8')
