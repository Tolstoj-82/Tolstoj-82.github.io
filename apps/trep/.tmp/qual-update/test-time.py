from pathlib import Path
p=Path('.tmp/qual-update/check-averages.cjs')
s=p.read_text(encoding='utf-8').replace('select(){},setSelectionRange(){}', 'select(){this.selectionStart=0;this.selectionEnd=this.value.length},setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}')
s+='''
elements.time.handlers.focus();for(const digit of '13000')elements.time.handlers.keydown({key:digit,preventDefault(){}});assert.equal(elements.time.value,'1:30:00');elements.time.handlers.keydown({key:'Backspace',preventDefault(){}});assert.equal(elements.time.value,'0:13:00');elements.time.handlers.blur();assert.equal(saved.at(-1).total,780);
elements.time.handlers.focus();for(const digit of '90')elements.time.handlers.keydown({key:digit,preventDefault(){}});assert.equal(elements.time.value,'0:00:90');elements.time.handlers.blur();assert.equal(elements.time.value,'0:01:30');
elements.time.handlers.focus();elements.time.handlers.paste({preventDefault(){},clipboardData:{getData:()=> '1:02:03'}});assert.equal(elements.time.value,'1:02:03');elements.time.handlers.blur();assert.equal(saved.at(-1).total,3723);
elements.time.handlers.focus();elements.time.handlers.beforeinput({inputType:'insertText',data:'5',preventDefault(){}});assert.equal(elements.time.value,'0:00:05');elements.time.handlers.beforeinput({inputType:'deleteContentBackward',preventDefault(){}});assert.equal(elements.time.value,'0:00:00');
console.log('PASS: right-to-left typing, automatic colons, deletion, duration normalization, paste and mobile input');
'''
Path('.tmp/qual-update/check-time-entry.cjs').write_text(s,encoding='utf-8')
