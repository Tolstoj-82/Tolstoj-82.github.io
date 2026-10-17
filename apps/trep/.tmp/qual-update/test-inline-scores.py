from pathlib import Path
p=Path('.tmp/qual-update/check-score-editor.cjs');s=p.read_text(encoding='utf-8')
s=s.replace('addEventListener(k,v){this.handlers[k]=v}', 'addEventListener(k,v){const previous=this.handlers[k];this.handlers[k]=e=>{previous?.(e);v(e)}}')
s+='''
window.qualAppearance.showScoreEditor=false;window.qualScoreEditorSync();assert.equal(panel.hidden,true);window.qualAppearance.showScoreEditor=true;window.qualScoreEditorSync();assert.equal(panel.hidden,false);elements.s1.value='123456';elements.s1.dispatchEvent({type:'input'});assert.equal(input.value,'123,456');assert.equal(elements.s1.value,'123,456');console.log('PASS: outside-panel visibility toggle and inline-to-outside score synchronization');
'''
Path('.tmp/qual-update/check-inline-scores.cjs').write_text(s,encoding='utf-8')
