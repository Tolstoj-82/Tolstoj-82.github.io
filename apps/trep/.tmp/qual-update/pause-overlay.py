from pathlib import Path
root=Path('../qual-timer');p=Path('.tmp/qual-update')
s=(root/'index.html').read_text(encoding='utf-8')
s=s.replace('<span id="pauseStatus" role="status" hidden></span>','')
s=s.replace('<div class="lcd">','<div class="lcd"><div id="pauseStatus" hidden><strong class="pause-heading">PAUSED</strong><span id="pauseRemaining" role="timer" aria-label="Remaining pause allowance" aria-live="off">05:00</span><button type="button" id="pauseResume">▶ Resume timer</button></div>',1)
(p/'index.html').write_text(s,encoding='utf-8')
s=(root/'timer.js').read_text(encoding='utf-8')
s=s.replace("label.textContent=paused?'PAUSED · '+fmt(Math.max(0,limit()-used())).replace(/^0:/,''):'';", "$('pauseRemaining').textContent=fmt(Math.max(0,limit()-used())).replace(/^0:/,'');")
s=s.replace("$('modalStart').addEventListener('click',()=>start.click());", "$('modalStart').addEventListener('click',()=>start.click());$('pauseResume').addEventListener('click',()=>start.click());")
(p/'timer.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')
s=s.replace('.time-field{position:relative;min-width:0;padding-top:16px}', '.time-field{position:relative;min-width:0}')
a=s.index('#pauseStatus{');b=s.index('#pauseStatus[hidden]',a)
s=s[:a]+'''.lcd{position:relative}
#pauseStatus{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(10px,3cqh,24px);padding:16px;background:#111a16f5;color:#fff;text-align:center;font-family:system-ui,sans-serif}
.pause-heading{font-size:clamp(28px,9cqw,64px);line-height:1;letter-spacing:.08em}
#pauseRemaining{font-size:clamp(44px,15cqw,100px);font-weight:750;font-variant-numeric:tabular-nums;line-height:1.1;letter-spacing:.02em}
#pauseResume{border:1px solid #ffffff80;border-radius:7px;background:#ffffff15;color:#fff;padding:10px 16px;font:600 14px system-ui;cursor:pointer}
#pauseResume:hover{background:#ffffff28}
'''+s[b:]
(p/'timer.css').write_text(s,encoding='utf-8')
s=(p/'check-pause.cjs').read_text(encoding='utf-8').replace("'pauseStatus']", "'pauseStatus','pauseRemaining','pauseResume']").replace("assert.match(t.els.pauseStatus.textContent,/PAUSED/);", "assert.equal(t.els.pauseRemaining.textContent,'05:00');")
s+="\nt=timer();t.click();t.click();t.els.pauseResume.click();assert.equal(t.state.running,true);assert.equal(t.els.pauseStatus.hidden,true);console.log('PASS: pause overlay countdown and resume button');\n"
(p/'check-pause-overlay.cjs').write_text(s,encoding='utf-8')
