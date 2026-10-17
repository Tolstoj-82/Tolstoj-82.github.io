from pathlib import Path
root=Path('../qual-timer');stage=Path('.tmp/qual-update')
s=(root/'index.html').read_text(encoding='utf-8')
handle='<span class="resize-handle corner" data-resize="se" aria-hidden="true"></span>'
assert handle in s
(stage/'index.html').write_text(s.replace(handle,''),encoding='utf-8')
s=(root/'timer.css').read_text(encoding='utf-8')
s=s.replace('.corner{bottom:-12px;right:-12px;width:24px;height:24px;cursor:nwse-resize}\n.corner::before{width:12px;height:12px}\n','')
(stage/'timer.css').write_text(s,encoding='utf-8')
