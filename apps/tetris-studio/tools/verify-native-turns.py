from pathlib import Path
import hashlib,json
import argparse
parser=argparse.ArgumentParser(description='Verify Game Boy Tetris ROM behavior and regenerate test vectors.')
parser.add_argument('rom',type=Path)
parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parent.parent/'fixtures'/'rom-turn-vectors.json')
args=parser.parse_args()
r=args.rom.read_bytes()
assert hashlib.sha1(r).hexdigest()=='74591cc9501af93873f9a5d3eb12da12c0723bbc'
start=r.find(bytes.fromhex('2100c27efe80c82e037ee0a0f08147'));stop=start+51
assert start==0x24bb and r[stop:stop+2]==bytes([0x3e,3])
def rotate(piece,button):
 mem={0xc200:0,0xc203:piece};pc=start;a=b=hl=0;z=False
 while pc!=stop:
  op=r[pc];pc+=1
  if op==0x21:hl=r[pc]+256*r[pc+1];pc+=2
  elif op==0x7e:a=mem[hl]
  elif op==0xfe:z=a==r[pc];pc+=1
  elif op==0xc8:
   if z:return mem[0xc203]
  elif op==0x2e:hl=(hl&0xff00)|r[pc];pc+=1
  elif op==0xe0:pc+=1
  elif op==0xf0:assert r[pc]==0x81;pc+=1;a=button
  elif op==0x47:b=a
  elif op==0xcb:bit=(r[pc]>>3)&7;pc+=1;z=(b&(1<<bit))==0
  elif op in (0x20,0x28,0x18):
   d=r[pc];pc+=1;d=d if d<128 else d-256
   if op==0x18 or (op==0x28 and z) or (op==0x20 and not z):pc+=d
  elif op==0xe6:a&=r[pc];pc+=1;z=a==0
  elif op==0xf6:a|=r[pc];pc+=1;z=a==0
  elif op==0x35:mem[hl]=(mem[hl]-1)&255;z=mem[hl]==0
  elif op==0x34:mem[hl]=(mem[hl]+1)&255;z=mem[hl]==0
  elif op==0x77:mem[hl]=a
  else:raise ValueError(hex(op))
 return mem[0xc203]
starts=[int.from_bytes(r[0x2c20+i*4:0x2c22+i*4],'little')+2 for i in range(28)]
layouts=[]
for at in starts:
 data=list(r[at:at+16]);end=data.index(255) if 255 in data else len(data);data=data[:end]+[254]*(16-end)
 layouts.append([[i%4,i//4,v] for i,v in enumerate(data) if v!=254])
descriptors=[]
for i,patternStart in enumerate(starts):
 d=0x2c20+i*4;pattern=patternStart-2;coords=int.from_bytes(r[pattern:pattern+2],'little');oy,ox=r[d+2:d+4];points=[]
 for n,v in enumerate(r[patternStart:patternStart+16]):
  if v==255:break
  if v==254:continue
  cy,cx=r[coords+2*n:coords+2*n+2]
  sy=((oy+24)&255)+cy+int(oy+24>255)-16
  sx=((ox+63)&255)+cx+int(ox+63>255)-8
  assert (sx-16)%8==0 and sy%8==0
  points.append([(sx-16)//8,sy//8,v])
 descriptors.append({'id':i,'pointer':pattern,'offsetY':oy,'offsetX':ox,'spawnCells':points})
rows=[{'pieceId':p,'button':b,'after':rotate(p,b)} for p in range(28) for b in [1,2,3]]
args.output.write_text(json.dumps({'sha1':hashlib.sha1(r).hexdigest(),'rotationRoutine':hex(start),'spawnRoutine':'0x2007','layouts':layouts,'descriptors':descriptors,'turns':rows},separators=(',',':')))
print('Verified native turn branch for all 28 sprites, A/B/both; extracted all native layouts.')


