from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'settings.js').read_text(encoding='utf-8')
marker="name.value=typeof state.name==='string'?state.name.toUpperCase():'DOT MATRIX';"
new=marker+"const nameMeasure=document.createElement('span');nameMeasure.className='name-measure';nameMeasure.setAttribute('aria-hidden','true');name.parentElement.append(nameMeasure);function sizeName(){const style=getComputedStyle(name);nameMeasure.style.font=style.font;nameMeasure.style.letterSpacing=style.letterSpacing;nameMeasure.textContent=name.value||' ';name.parentElement.style.width=Math.ceil(nameMeasure.getBoundingClientRect().width+4)+'px'}sizeName();name.addEventListener('input',sizeName);name.addEventListener('change',sizeName);"
assert marker in s;s=s.replace(marker,new,1)
s=s.replace('function openNames(open){', 'function openNames(open){if(!open)sizeName();')
s=s.replace('name.value=value;state.name=value;persist();openNames(false)', 'name.value=value;state.name=value;persist();openNames(false)')
s=s.replace('name.value=value;state.name=value;if(value', 'name.value=value;sizeName();state.name=value;if(value')
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''
.stripe{gap:6px}
.name-picker{flex:none;max-width:65%}
.name-picker .name{flex:1;padding-left:1px;padding-right:1px}
.name-measure{position:absolute;visibility:hidden;white-space:pre;pointer-events:none}
.name-picker>button{position:absolute;left:calc(100% + 2px);top:50%;transform:translateY(-50%);z-index:1;opacity:0;background:var(--bezel);border-radius:3px}
.name-picker:hover>button,.name-picker:focus-within>button{opacity:1}
#savedNames{left:50%;right:auto;transform:translateX(-50%);width:260px;max-width:80vw}
'''
(stage/'timer.css').write_text(s,encoding='utf-8')
