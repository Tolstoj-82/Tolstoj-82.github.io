from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'index.html').read_text(encoding='utf-8').replace('<div class="heading">GBTDC Qual</div>', '<div class="heading" contenteditable="plaintext-only" role="textbox" aria-label="Timer title" aria-multiline="false" tabindex="0" spellcheck="false" title="Click to edit title">GBTDC Qual</div>')
(stage/'index.html').write_text(s,encoding='utf-8')
s=(root/'settings.js').read_text(encoding='utf-8')
marker="const frame=$('timerFrame'),name=$('name'),list=$('savedNames'),dialog=$('settings');"
s=s.replace(marker,marker+'''
const timerTitle=document.querySelector('.heading');let originalTitle='';
timerTitle.addEventListener('focus',()=>{originalTitle=appearance.title});
timerTitle.addEventListener('blur',()=>{const value=timerTitle.textContent.replace(/\\s+/g,' ').trim();appearance.title=value||originalTitle||defaults.title;timerTitle.textContent=appearance.title;const input=$('setting-title');if(input)input.value=appearance.title;state.appearance=appearance;persist()});
timerTitle.addEventListener('keydown',event=>{if(event.isComposing)return;if(event.key==='Enter'){event.preventDefault();timerTitle.blur()}else if(event.key==='Escape'){event.preventDefault();timerTitle.textContent=originalTitle;timerTitle.blur()}});
timerTitle.addEventListener('beforeinput',event=>{if(event.inputType==='insertParagraph'||event.inputType==='insertLineBreak'){event.preventDefault();timerTitle.blur()}});
''')
s=s.replace("document.querySelector('.heading').textContent=appearance.title;", "if(document.activeElement!==timerTitle)timerTitle.textContent=appearance.title;")
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''
.heading[contenteditable]{cursor:text;overflow-wrap:anywhere;min-width:0}
.heading[contenteditable]:hover{background:color-mix(in srgb,var(--screen),white 8%)}
.heading[contenteditable]:focus{background:color-mix(in srgb,var(--screen),white 12%);outline:2px dashed color-mix(in srgb,var(--ink),transparent 35%);outline-offset:3px}
'''
(stage/'timer.css').write_text(s,encoding='utf-8')
