from pathlib import Path
import json,hashlib,argparse
p=argparse.ArgumentParser();p.add_argument('rom',type=Path);p.add_argument('--output',type=Path,required=True);args=p.parse_args();rom=args.rom.read_bytes()
assert hashlib.sha256(rom).hexdigest()=='23ca94634acf0320b9a0621b2678cb04591667da437fdf22061246aedb9c764c'
def execute(seed):
 memory={0xd8aa:seed>>16,0xd8ab:(seed>>8)&255,0xd8ac:seed&255};a=b=c=0;pc=0x52d;z=False;carry=False
 while True:
  op=rom[pc];pc+=1
  if op in (0xc5,0xd5,0xe5,0xe1,0xd1,0xc1):continue
  if op==0xc9:break
  if op in (0x3e,0x06,0x0e):
   v=rom[pc];pc+=1
   if op==0x3e:a=v
   elif op==6:b=v
   else:c=v
  elif op==0xfa:addr=int.from_bytes(rom[pc:pc+2],'little');pc+=2;a=memory[addr]
  elif op==0xea:addr=int.from_bytes(rom[pc:pc+2],'little');pc+=2;memory[addr]=a
  elif op==0xa1:a&=c;z=a==0;carry=False
  elif op==0xb0:a|=b;z=a==0;carry=False
  elif op==0x47:b=a
  elif op==0x4f:c=a
  elif op==0x78:a=b
  elif op==0x79:a=c
  elif op==0x04:b=(b+1)&255;z=b==0
  elif op==0x0d:c=(c-1)&255;z=c==0
  elif op==0xe6:a&=rom[pc];pc+=1;z=a==0;carry=False
  elif op==0xcb:
   code=rom[pc];pc+=1;old=a
   if code==0x3f:a>>=1
   elif code==0x0f:a=(a>>1)|((a&1)<<7)
   elif code==0x2f:a=(a>>1)|(a&128)
   else:raise ValueError(hex(code))
   carry=bool(old&1);z=a==0
  elif op in (0x30,0x20):
   d=rom[pc];pc+=1;d=d if d<128 else d-256
   if (op==0x30 and not carry) or (op==0x20 and not z):pc+=d
  else:raise ValueError((hex(pc-1),hex(op)))
 return (memory[0xd8aa]<<16)|(memory[0xd8ab]<<8)|memory[0xd8ac],a
vectors=[]
for seed in [1,2,3,0x80,0x87,0x123456,0xabcdef,0xffffff]+[1<<b for b in range(24)]:
 state=seed;values=[]
 for _ in range(32):state,byte=execute(state);values.append({'state':state,'byte':byte})
 vectors.append({'seed':seed,'steps':values})
args.output.write_text(json.dumps({'sha256':hashlib.sha256(rom).hexdigest(),'routine':'0x052d','vectors':vectors},indent=2));print('Executed supplied ROM LFSR instructions for',len(vectors)*32,'steps')
