from pathlib import Path
s=Path('../qual-timer/timer.css').read_text(encoding='utf-8')
s=s.replace('#settingsFields .color-settings{display:flex;flex-wrap:wrap;gap:12px;margin:0;padding:12px 0 0;border:0;min-width:0}', '#settingsFields .color-settings{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 20px;margin:0;padding:12px 0 0;border:0;min-width:0}')
s=s.replace('#settingsFields .color-settings label{flex:1 0 70px;max-width:100px;justify-content:space-between;gap:8px;font-size:12px;line-height:1.4}', '#settingsFields .color-settings label{min-width:0;justify-content:space-between;gap:8px;font-size:12px;line-height:1.4}')
Path('.tmp/qual-update/timer.css').write_text(s,encoding='utf-8')
