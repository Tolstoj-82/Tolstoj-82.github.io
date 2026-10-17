from pathlib import Path
s=Path('../qual-timer/index.html').read_text(encoding='utf-8').split('<script>')[1].split('</script>')[0]
Path('.tmp/qual-update/timer-inline.js').write_text(s,encoding='utf-8')
p=Path('.tmp/qual-update/check-time-entry.cjs').read_text(encoding='utf-8')
p+='''
// Check the actual deadline calculation with deliberately irregular update intervals.
now=10000;elements.time.value='1:30:00';elements.time.handlers.blur();elements.start.click();const deadline=now+5400000;
for(const elapsed of [0,37,997,1001,45321,600000,2345678,5399999]){now=10000+elapsed;callback();assert.ok(Math.abs(saved.at(-1).remaining-(deadline-now)/1000)<1e-9);}
// No updates for longer than the complete countdown: it catches up immediately.
now=deadline+30000;callback();assert.equal(elements.time.value,'0:00:00');assert.equal(elements.start.textContent,'▶ START');
// Pausing/resuming repeatedly retains fractional seconds; paused time is excluded.
now=6000000;elements.time.value='0:01:00';elements.time.handlers.blur();elements.start.click();let elapsedRunning=0;
for(let i=0;i<100;i++){now+=137;elapsedRunning+=.137;elements.start.click();assert.ok(Math.abs(saved.at(-1).remaining-(60-elapsedRunning))<1e-8);now+=10000;elements.start.click()}
console.log('PASS: 90-minute irregular scheduling with no cumulative drift, overdue callback catch-up, 100 fractional pause/resume cycles');
'''
Path('.tmp/qual-update/check-accuracy.cjs').write_text(p,encoding='utf-8')
