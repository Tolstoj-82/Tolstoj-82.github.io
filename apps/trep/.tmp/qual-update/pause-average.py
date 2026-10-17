from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'index.html').read_text(encoding='utf-8');marker='<button type="button" id="pauseResume">';assert marker in s
s=s.replace(marker,'<div class="pause-average"><span id="pauseAverageLabel">AO2</span><strong id="pauseAverage">—</strong></div>'+marker,1)
(stage/'index.html').write_text(s,encoding='utf-8')
s=(root/'timer.js').read_text(encoding='utf-8');marker="maximumFractionDigits:1}):'—'}window.qualRecalculate=calc;";assert marker in s
s=s.replace(marker,"maximumFractionDigits:1}):'—';$('pauseAverageLabel').textContent='AO'+count+' AVERAGE';$('pauseAverage').textContent=avg.textContent;window.qualPlacePause?.()}window.qualRecalculate=calc;")
(stage/'timer.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'''
.pause-average{display:flex;flex-direction:column;align-items:center;gap:5px;width:100%;padding:10px 0;border-top:1px solid #d6d9cd;border-bottom:1px solid #d6d9cd}
#pauseAverageLabel{font:600 12px system-ui;letter-spacing:.08em}
#pauseAverage{font:700 30px var(--average-font,system-ui);font-variant-numeric:tabular-nums;line-height:1.3;overflow-wrap:anywhere;max-width:100%}
'''
(stage/'timer.css').write_text(s,encoding='utf-8')
s=(stage/'check-pause-overlay.cjs').read_text(encoding='utf-8').replace("'pauseRemaining','pauseResume']", "'pauseRemaining','pauseResume','pauseAverageLabel','pauseAverage']")
s+="\nassert.equal(t.els.pauseAverage.textContent,t.els.avg.textContent);t.els.s1.value='200000';t.els.s2.value='300000';t.els.s1.handlers.input();assert.equal(t.els.pauseAverage.textContent,'250,000');t.window.qualAppearance.scoreCount=3;t.window.qualRecalculate();assert.equal(t.els.pauseAverage.textContent,'—');assert.equal(t.els.pauseAverageLabel.textContent,'AO3 AVERAGE');t.els.s3.value='400000';t.els.s3.handlers.input();assert.equal(t.els.pauseAverage.textContent,'300,000');console.log('PASS: live pause-window average, AO2/AO3 labels and missing-score handling');\n"
(stage/'check-pause-average.cjs').write_text(s,encoding='utf-8')
