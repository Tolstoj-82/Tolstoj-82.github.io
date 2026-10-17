from pathlib import Path
p=Path('../qual-timer/timer.css');s=p.read_text(encoding='utf-8')
a=s.index('#pauseStatus{');b=s.index('#pauseStatus[hidden]',a)
s=s[:a]+'''#pauseStatus{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(86%,360px);z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,2cqh,18px);padding:clamp(12px,3cqw,24px);background:#faf9f2;color:#34402e;border:1px solid #c3c6b8;border-radius:14px;box-shadow:0 8px 28px #23301c35,0 2px 5px #23301c20;text-align:center;font-family:system-ui,sans-serif}
.pause-heading{font-size:clamp(24px,7cqw,42px);line-height:1;letter-spacing:.08em}
#pauseRemaining{font-size:clamp(38px,12cqw,72px);font-weight:750;font-variant-numeric:tabular-nums;line-height:1.1;letter-spacing:.02em}
#pauseResume{border:1px solid #a8b29b;border-radius:7px;background:#e6ebdf;color:#34402e;padding:9px 16px;font:600 14px system-ui;cursor:pointer}
#pauseResume:hover{background:#dbe4d1}
'''+s[b:]
Path('.tmp/qual-update/timer.css').write_text(s,encoding='utf-8')
