from pathlib import Path
p=Path('.tmp/qual-update/check-sound-picker.cjs');s=p.read_text(encoding='utf-8')
s=s.replace('const nodes=[],audio=[];', 'const nodes=[],audio=[],timers=new Map();let timerId=0;')
s=s.replace('crypto:{randomUUID:', 'setTimeout:fn=>{timers.set(++timerId,fn);return timerId},clearTimeout:id=>timers.delete(id),crypto:{randomUUID:')
s=s.replace('preview=group.children[2],', 'preview=group.children[2].children[0],')
needle="assert.ok(!nodes.some(n=>['Stop sound','Remove MP3'].includes(n.textContent)));"
extra='''
for(const repeats of [1,2,3,'infinite']){window.qualAudio.stop();timers.clear();let offset=audio.length;await window.qualAudio.play({sound:'chime',soundRepeat:String(repeats)});let count=0;const limit=repeats==='infinite'?5:repeats;while(count<limit){const batch=audio.slice(offset);offset=audio.length;for(const n of batch)n.onended?.();count++;if(count<limit){assert.equal(timers.size,1);const [id,fn]=[...timers][0];timers.delete(id);fn()}}if(repeats==='infinite'){assert.equal(timers.size,1);window.qualAudio.stop();assert.equal(timers.size,0)}else assert.equal(timers.size,0)}
console.log('PASS: 1/2/3 repeats, infinite looping and cancellation');
'''
s=s.replace(needle,extra+needle)
Path('.tmp/qual-update/check-repeats.cjs').write_text(s,encoding='utf-8')
