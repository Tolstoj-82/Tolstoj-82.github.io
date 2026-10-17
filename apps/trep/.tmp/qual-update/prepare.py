from pathlib import Path
p=Path('.tmp/qual-update')
s=(p/'original.html').read_text()
s=s.replace('</style>', '</style><link rel="stylesheet" href="timer.css">')
s=s.replace('<main class="frame">','<main class="frame" id="timerFrame"><button class="settings-button" id="openSettings" aria-label="Open appearance settings">⚙</button>')
s=s.replace('<input class="name"', '<div class="name-picker"><input class="name" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="savedNames" autocomplete="off"')
s=s.replace('aria-label="Custom name">','aria-label="Custom name"><button id="toggleNames" aria-label="Show saved timer names" aria-expanded="false">▾</button><div id="savedNames" role="listbox" hidden></div></div>')
s=s.replace('</main><script>', '<span class="resize-handle east" data-resize="e" aria-hidden="true"></span><span class="resize-handle south" data-resize="s" aria-hidden="true"></span><span class="resize-handle corner" data-resize="se" aria-hidden="true"></span></main><dialog id="settings"><form method="dialog"><header><h2>Timer settings</h2><button aria-label="Close settings">✕</button></header></form><p class="hint">Changes are saved on this browser.</p><div id="settingsFields"></div><button id="restoreAppearance" type="button">Restore default appearance</button></dialog><script>')
s=s.replace("name.addEventListener('input',()=>name.value=name.value.toUpperCase());",'')
s=s.replace("let total=5400,remaining=5400", "let total=Number(window.qualState?.total)||5400,remaining=Number(window.qualState?.remaining ?? window.qualState?.total ?? 5400)")
s=s.replace("function render(){", "function render(){window.qualSaveTimer?.({total,remaining});")
s=s.replace("function sound(){try", "function sound(){if(window.qualAppearance?.mute)return;try")
s=s.replace("s2.addEventListener('input',calc);render()", "s2.addEventListener('input',calc);calc();render()")
s=s.replace('<script>\n', '<script src="settings.js"></script><script>\n')
(p/'index.html').write_text(s)
site=Path('../../index.html').read_text()
site=site.replace('<li><a href="apps/gb-ocr/index.html">GB OCR</a></li>', '<li><a href="apps/gb-ocr/index.html">GB OCR</a></li>\n          <li><a href="apps/qual-timer/index.html">Qual timer</a></li>')
site=site.replace('<a href="apps/gb-ocr/index.html">GB OCR</a>', '<a href="apps/gb-ocr/index.html">GB OCR</a>\n            <a href="apps/qual-timer/index.html">Qual timer</a>') if False else site
marker='            <div class="grid-item">'
pos=site.index(marker, site.index('id="projects-panel"'))
card='''            <div class="grid-item">
              <div class="grid-item-wrapper">
                <a href="apps/qual-timer/index.html" class="grid-item-clickable">
                  <img src="apps/qual-timer/preview.svg" alt="Game Boy style qualification timer showing 1:30:00" />
                  <h3>Qual timer</h3>
                  <div class="card-labels" aria-label="Status and optimized devices">
                    <span class="card-label status-working">Working</span>
                    <span class="card-label device-label device-desktop">Desktop</span>
                  </div>
                  <p>A customizable qualification timer with two scores and their average. Save timer names, adjust the appearance, and resize it to fit your stream.</p>
                </a>
              </div>
            </div>

'''
site=site[:pos]+card+site[pos:]
site=site.replace('            <a href="apps/gb-ocr/index.html">GB OCR</a>', '            <a href="apps/gb-ocr/index.html">GB OCR</a>\n            <a href="apps/qual-timer/index.html">Qual timer</a>')
(p/'site-index.html').write_text(site)
