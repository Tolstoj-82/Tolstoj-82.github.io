from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'index.html').read_text(encoding='utf-8').replace(' readonly tabindex="-1"','')
(stage/'index.html').write_text(s,encoding='utf-8')
s=(root/'settings.js').read_text(encoding='utf-8').replace('flat:false,hideScores:false,','flat:false,hideScores:false,showScoreEditor:true,').replace("['hideScores','Hide scores'],", "['hideScores','Hide scores'],['showScoreEditor','Show outside score editor'],")
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(root/'score-editor.js').read_text(encoding='utf-8')
s=s.replace('rows.push({label,input,display});', "rows.push({label,input,display});display.addEventListener('input',()=>{if(document.activeElement!==input)input.value=display.value});display.addEventListener('keydown',event=>{if(event.key==='Enter')display.blur()});")
s=s.replace('function place(){const rect=', 'function place(){if(panel.hidden)return;const rect=')
s=s.replace('window.qualScoreEditorSync=()=>{', 'window.qualScoreEditorSync=()=>{panel.hidden=window.qualAppearance?.showScoreEditor===false;')
(stage/'score-editor.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')
s=s.replace('.score-row input[readonly]{border-bottom:0;cursor:default}\n.score-row input[readonly]:focus{background:transparent;outline:none}', '''.score-row input{border-bottom:1px dashed transparent;cursor:text}
.score-row input:hover,.score-row input:focus{border-bottom-color:var(--ink);background:color-mix(in srgb,var(--screen),white 12%)}
.score-row input:focus{outline:2px solid color-mix(in srgb,var(--ink),transparent 45%);outline-offset:2px}
.score-editor[hidden]{display:none}''')
(stage/'timer.css').write_text(s,encoding='utf-8')
