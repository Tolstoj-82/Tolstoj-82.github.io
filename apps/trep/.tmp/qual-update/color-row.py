from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'settings.js').read_text(encoding='utf-8')
s=s.replace("const fields=$('settingsFields');function field", "const fields=$('settingsFields');let colors;function field")
s=s.replace('wrap.append(input);fields.append(wrap)', "wrap.append(input);if(type==='color'){if(!colors){colors=document.createElement('fieldset');colors.className='color-settings';const legend=document.createElement('legend');legend.textContent='Colors';colors.append(legend);fields.append(colors)}colors.append(wrap)}else fields.append(wrap)")
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''
#settingsFields .color-settings{display:flex;flex-wrap:wrap;gap:12px;margin:0;padding:12px 0 0;border:0;min-width:0}
.color-settings legend{padding:0;font-weight:600}
#settingsFields .color-settings label{flex:1 0 70px;max-width:100px;justify-content:space-between;gap:8px;font-size:12px;line-height:1.4}
'''
(stage/'timer.css').write_text(s,encoding='utf-8')
