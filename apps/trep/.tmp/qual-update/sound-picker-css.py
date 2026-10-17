from pathlib import Path
p=Path('../qual-timer/timer.css');s=p.read_text(encoding='utf-8')+'''
.sound-picker{position:relative;display:grid;gap:7px}
#settings .sound-select{width:100%;min-height:38px;text-align:left;padding:8px 36px 8px 10px;background:#fff;color:#252c25;border:1px solid #a5aa9c;overflow-wrap:anywhere;position:relative}
.sound-select::after{content:'';position:absolute;right:14px;top:12px;width:7px;height:7px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg)}
.sound-options{position:absolute;top:100%;left:0;right:0;z-index:5;max-height:240px;overflow:auto;margin-top:4px;padding:4px;background:#fff;border:1px solid #a5aa9c;border-radius:7px;box-shadow:0 6px 18px #0002}
.sound-options[hidden]{display:none}.sound-option{display:flex;align-items:center;gap:4px}
#settings .sound-option-name{flex:1;min-width:0;text-align:left;border:0;background:#fff;overflow-wrap:anywhere;font:inherit;padding:10px}
#settings .sound-option-name[aria-pressed=true]{background:#e5ecd9;font-weight:600}
#settings .sound-option-name:hover{background:#eef2e8}
#settings .sound-option-remove{flex:none;width:32px;height:32px;padding:0;border:0;background:transparent;color:#754339;font-size:23px;margin-left:auto}
#settings .sound-option-remove:hover{background:#f7e8e4}
#settings .sound-preview{display:inline-flex;align-items:center;justify-self:start;gap:8px;margin-top:-8px;padding:8px 12px;border:1px solid #a5aa9c;border-radius:7px;background:#f1f5eb;color:#354b2d;font:600 14px system-ui}
.sound-preview-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;font-size:13px}.sound-preview.playing{background:#e5ecd9}
''';Path('.tmp/qual-update/timer.css').write_text(s,encoding='utf-8')
