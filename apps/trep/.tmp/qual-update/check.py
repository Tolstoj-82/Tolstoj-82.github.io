from pathlib import Path
p=Path('.tmp/qual-update/index.html')
s=p.read_text(encoding='utf-8').replace('\\\\d','\\d').replace('\\\\D','\\D')
p.write_text(s,encoding='utf-8')
script=s.split('<script>')[1].split('</script>')[0]
Path('.tmp/qual-update/timer-inline.js').write_text(script,encoding='utf-8')
