from pathlib import Path
p=Path('../qual-timer/timer.css');s=p.read_text(encoding='utf-8')
a=s.index('.resize-handle{');b=s.index('dialog{',a)
s=s[:a]+'''.resize-handle{position:absolute;display:grid;place-items:center;opacity:0;touch-action:none;z-index:2;background:#f3f4f5;border:1px solid #9aa0a6;border-radius:6px;box-shadow:0 1px 2px #0002}
.resize-handle::before{content:'';display:block;background-image:radial-gradient(circle at 3px 3px,#51585e 1.25px,transparent 1.5px);background-size:6px 6px;pointer-events:none}
.frame:hover .resize-handle,.frame:focus-within .resize-handle,.resize-handle:active{opacity:1}
.resize-handle:hover,.resize-handle:active{background:#fff;border-color:#51585e}
.east{right:-12px;top:50%;height:44px;width:18px;transform:translateY(-50%);cursor:ew-resize}
.east::before{width:12px;height:30px}
.south{bottom:-12px;left:50%;width:44px;height:18px;transform:translateX(-50%);cursor:ns-resize}
.south::before{width:30px;height:12px}
.corner{bottom:-12px;right:-12px;width:24px;height:24px;cursor:nwse-resize}
.corner::before{width:12px;height:12px}
'''+s[b:]
Path('.tmp/qual-update/timer.css').write_text(s,encoding='utf-8')
