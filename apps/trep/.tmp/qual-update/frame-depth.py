from pathlib import Path
p=Path('../qual-timer/timer.css')
s=p.read_text(encoding='utf-8')
old='background:var(--shell);padding:18px;container-type:size'
new='''background:var(--shell);padding:18px;container-type:size;
--shell-edge:color-mix(in srgb,var(--shell),black 25%);
--shell-highlight:color-mix(in srgb,var(--shell),white 40%);
border-color:color-mix(in srgb,var(--shell),black 15%);
box-shadow:inset 2px 2px 0 var(--shell-highlight),inset -2px -2px 0 color-mix(in srgb,var(--shell),black 10%),1px 1px 0 var(--shell-edge),2px 2px 0 var(--shell-edge),3px 3px 0 var(--shell-edge),4px 4px 0 var(--shell-edge),5px 5px 0 var(--shell-edge),6px 6px 0 var(--shell-edge)'''
assert old in s
s=s.replace(old,new,1)
Path('.tmp/qual-update/timer.css').write_text(s,encoding='utf-8')
print('Prepared frame bevel and solid extrusion, all derived from --shell; flat-frame override preserved.')
