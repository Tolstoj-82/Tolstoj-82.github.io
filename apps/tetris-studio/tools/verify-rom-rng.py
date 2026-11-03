from pathlib import Path
import hashlib,json,random
import argparse
parser=argparse.ArgumentParser(description='Verify Game Boy Tetris ROM behavior and regenerate test vectors.')
parser.add_argument('rom',type=Path)
parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parent.parent/'fixtures'/'rom-rng-vectors.json')
args=parser.parse_args()
ROM=args.rom.read_bytes()
assert hashlib.sha1(ROM).hexdigest()=='74591cc9501af93873f9a5d3eb12da12c0723bbc'
assert ROM[0x2041:0x2069].hex()=='2603f00447af05280a3c3c3c3cfe1c28f418f357f0ae5f252807b2b1e6fcb928e17ae0ae7bea13c2'
def execute(phase,preview,hidden):
 pc=0x2041; t=phase; regs={'a':0,'b':0,'c':preview,'d':0,'e':0,'h':0}; z=False; reads=[]
 while pc<0x2069:
  op=ROM[pc];pc+=1
  if op==0x26:regs['h']=ROM[pc];pc+=1;t+=8
  elif op==0xf0:
   port=ROM[pc];pc+=1;t+=12
   regs['a']=(t//256)&255 if port==4 else hidden
   if port==4:reads.append(regs['a'])
  elif op in (0x47,0x57,0x5f):regs[{0x47:'b',0x57:'d',0x5f:'e'}[op]]=regs['a'];t+=4
  elif op==0xaf:regs['a']=0;z=True;t+=4
  elif op in (0x05,0x25):
   name='b' if op==5 else 'h';regs[name]=(regs[name]-1)&255;z=regs[name]==0;t+=4
  elif op==0x3c:regs['a']=(regs['a']+1)&255;z=regs['a']==0;t+=4
  elif op in (0xfe,0xe6):
   val=ROM[pc];pc+=1;t+=8
   if op==0xfe:z=regs['a']==val
   else:regs['a']&=val;z=regs['a']==0
  elif op in (0x28,0x18):
   displacement=ROM[pc];pc+=1;displacement=displacement if displacement<128 else displacement-256
   taken=op==0x18 or z;t+=12 if taken else 8
   if taken:pc+=displacement
  elif op in (0xb2,0xb1):regs['a']|=regs['d' if op==0xb2 else 'c'];z=regs['a']==0;t+=4
  elif op==0xb9:z=regs['a']==regs['c'];t+=4
  elif op in (0x7a,0x7b):regs['a']=regs['d' if op==0x7a else 'e'];t+=4
  elif op==0xe0:assert ROM[pc]==0xae;pc+=1;hidden=regs['a'];t+=12
  elif op==0xea:assert ROM[pc:pc+2]==bytes([0x13,0xc2]);pc+=2;preview=regs['a'];t+=16
  else:raise ValueError(hex(op))
 return dict(reads=reads,hidden=hidden,preview=preview,cycles=t)
rows=[];rng=random.Random(1989)
for n in range(4096):
 phase=(n%256)*256 if n<256 else rng.randrange(65536)
 preview=rng.randrange(7)*4;hidden=rng.randrange(7)*4
 rows.append(dict(phase=phase,preview=preview,hidden=hidden,expected=execute(phase,preview,hidden)))
args.output.write_text(json.dumps({'romSha1':hashlib.sha1(ROM).hexdigest(),'range':['0x2041','0x2069'],'vectors':rows},separators=(',',':')))
print('Executed original ROM instructions for',len(rows),'independent divider/preview/hidden-state vectors.')
