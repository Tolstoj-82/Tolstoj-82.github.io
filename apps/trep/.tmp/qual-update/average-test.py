from pathlib import Path
p=Path('.tmp/qual-update/check-revision.cjs')
s=p.read_text(encoding='utf-8').replace("'s2','avg'", "'s2','s3','score3Row','averageLabel','avg'")
s=s.replace("vm.runInNewContext(", "const timerWindow={qualAppearance:{scoreCount:2},qualSaveTimer:s=>saved.push({...s})};vm.runInNewContext(")
s=s.replace("window:{qualSaveTimer:s=>saved.push({...s})}", 'window:timerWindow')
s+='''
assert.equal(elements.score3Row.hidden,true);assert.equal(elements.averageLabel.textContent,'AO2:');
timerWindow.qualAppearance.scoreCount=3;timerWindow.qualRecalculate();assert.equal(elements.score3Row.hidden,false);assert.equal(elements.avg.textContent,'—');assert.equal(elements.averageLabel.textContent,'AO3:');
elements.s3.value='270000';elements.s3.handlers.input();assert.equal(elements.avg.textContent,'250,000');assert.equal(elements.s3.value,'270,000');
timerWindow.qualAppearance.scoreCount=2;timerWindow.qualRecalculate();assert.equal(elements.avg.textContent,'240,000');assert.equal(elements.s3.value,'270,000');assert.equal(elements.score3Row.hidden,true);
timerWindow.qualAppearance.scoreCount=3;elements.s1.value='0';elements.s2.value='0';elements.s3.value='1';elements.s3.handlers.input();assert.equal(elements.avg.textContent,'0.3');
console.log('PASS: AO2/AO3 calculation, third field visibility, missing scores, preserved third score and zero/fractional averages');
'''
Path('.tmp/qual-update/check-averages.cjs').write_text(s,encoding='utf-8')
