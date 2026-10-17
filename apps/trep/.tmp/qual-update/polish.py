from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'settings.js').read_text(encoding='utf-8')
s=s.replace("if(type==='checkbox')input.checked=!!appearance[prop];", "if(type==='checkbox'){wrap.classList.add('toggle-setting');input.setAttribute('role','switch');input.checked=!!appearance[prop];}")
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(root/'index.html').read_text(encoding='utf-8').replace('<form method="dialog">','<form method="dialog" class="modal-header">')
(stage/'index.html').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')
s+='''
/* Keep the full header opaque while the settings scroll beneath it. */
#settings{padding:0;background:#fff;overflow-y:auto;overscroll-behavior:contain;isolation:isolate}
#settings .modal-header{position:sticky;top:0;z-index:10;margin:0;padding:20px 24px;background:#fff;border-bottom:1px solid #e0e4da}
#settings>.hint,#settings>.modal-timer-controls{margin:16px 24px}
#settings #settingsFields{margin:24px}
#settings>#restoreAppearance{margin:0 24px 24px}
#settingsFields label.toggle-setting{flex-direction:row;align-items:center;justify-content:space-between;gap:20px;min-height:36px;cursor:pointer}
#settingsFields input[role=switch]{appearance:none;-webkit-appearance:none;position:relative;display:block;flex:none;width:46px;height:26px;min-height:26px;padding:0;margin:0;border:1px solid #777f76;border-radius:999px;background:#858e82;cursor:pointer;transition:background .15s}
#settingsFields input[role=switch]::before{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0003;transition:transform .15s}
#settingsFields input[role=switch]:checked{background:#47683a;border-color:#47683a}
#settingsFields input[role=switch]:checked::before{transform:translateX(20px)}
.name-picker .name{font-size:18px}
.name-chevron{opacity:0;transition:opacity .15s}
.name-picker:hover .name-chevron,.name-picker:focus-within .name-chevron{opacity:1}
@media(prefers-reduced-motion:reduce){#settingsFields input[role=switch],#settingsFields input[role=switch]::before,.name-chevron{transition:none}}
'''
(stage/'timer.css').write_text(s,encoding='utf-8')
