from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'timer.js').read_text(encoding='utf-8').replace('function render(){', "window.qualIsTimerRunning=()=>running;\nfunction render(){const settingsButton=$('openSettings');settingsButton.disabled=running;settingsButton.title=running?'Pause or stop the timer to open settings':'Open settings';if(running&&$('settings').open)$('settings').close();")
(stage/'timer.js').write_text(s,encoding='utf-8')
s=(root/'settings.js').read_text(encoding='utf-8').replace("$('openSettings').onclick=()=>{", "$('openSettings').onclick=()=>{if(window.qualIsTimerRunning?.())return;")
(stage/'settings.js').write_text(s,encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')+'\n.settings-button:disabled{opacity:.4;cursor:not-allowed}\n'
(stage/'timer.css').write_text(s,encoding='utf-8')
s=(stage/'check-pause-average.cjs').read_text(encoding='utf-8').replace("'pauseAverageLabel','pauseAverage']", "'pauseAverageLabel','pauseAverage','openSettings']")
s=s.replace("classList:{add(){},remove(){}},", "classList:{add(){},remove(){}},close(){this.open=false},")
s+="\nt=timer();assert.equal(t.els.openSettings.disabled,false);t.els.settings.open=true;t.click();assert.equal(t.els.openSettings.disabled,true);assert.equal(t.els.settings.open,false);t.click();assert.equal(t.els.openSettings.disabled,false);t.click();t.els.reset.click();assert.equal(t.els.openSettings.disabled,false);t.setTime(1);t.click();t.advance(1000);assert.equal(t.els.openSettings.disabled,false);console.log('PASS: settings locked while running, modal closed on start, unlocked on pause/reset/finish');\n"
(stage/'check-settings-lock.cjs').write_text(s,encoding='utf-8')
