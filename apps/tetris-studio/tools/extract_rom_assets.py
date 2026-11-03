from pathlib import Path
import json,hashlib
import argparse
parser=argparse.ArgumentParser(description='Extract the original graphics from the supplied Tetris v1.1 ROM.')
parser.add_argument('rom',type=Path)
args=parser.parse_args()
r=args.rom.read_bytes()
expected='0d6535aef23969c7e5af2b077acaddb4a445b3d0df7bf34c8acef07b51b015c3'
if hashlib.sha256(r).hexdigest()!=expected:
 raise SystemExit('Unexpected ROM checksum. This extractor supports the supplied Tetris JUE v1.1 revision only.')
tiles=[]
for start,count,bpp in [(0x415f,39,1),(0x4297,9,2),(0x323f,197,2)]:
 for i in range(count):
  b=r[start+i*8*bpp:start+(i+1)*8*bpp]
  tiles.append([''.join(str((((b[y*bpp]>>(7-x))&1)*(3 if bpp==1 else 1)) | ((((b[y*bpp+1]>>(7-x))&1)<<1) if bpp==2 else 0)) for x in range(8)) for y in range(8)])
layout=list(r[0x3e8f:0x3e8f+360])
# Native sprite IDs index descriptors, whose pattern pointers are not sorted.
starts=[int.from_bytes(r[0x2c20+i*4:0x2c22+i*4], 'little')+2 for i in range(28)]
assert len(starts)==28
pieceLayouts={}
for n,typ in enumerate(['L','J','I','O','Z','S','T']):
 pieceLayouts[typ]=[]
 for start in starts[n*4:n*4+4]:
  data=[]
  for val in r[start:start+16]:
   if val==0xff:break
   data.append(val)
  data += [0xfe]*(16-len(data))
  assert sum(t!=0xfe for t in data)==4
  pieceLayouts[typ].append([[i%4,i//4,t] for i,t in enumerate(data) if t!=0xfe])
a={'source':{'title':r[0x134:0x144].decode('ascii').strip('\x00'),'sha256':hashlib.sha256(r).hexdigest(),'revision':r[0x14c],'tileSets':[{'offset':hex(o),'count':n,'bpp':b} for o,n,b in [(0x415f,39,1),(0x4297,9,2),(0x323f,197,2)]],'aTypeMapOffset':'0x3e8f','pieceLayoutRange':['0x2d5a','0x2f2b'],'bgPaletteRegister':'0xe4'},'tiles':tiles,'aTypeMap':layout,'pieceLayouts':pieceLayouts,'minoIds':{'I':128,'J':129,'Z':130,'O':131,'L':132,'T':133,'S':134,'X':135},'emptyId':47,'iHorizontal':[138,139,139,143],'iVertical':[128,136,136,137]}
(Path(__file__).resolve().parent.parent/'js'/'rom-assets.js').write_text('// Original graphics decoded from the user-supplied Tetris v1.1 ROM. See docs/ASSETS.md.\n(function(root){const assets='+json.dumps(a,separators=(',',':'))+';if(typeof module!=="undefined")module.exports=assets;root.TetrisRomAssets=assets;})(typeof window!=="undefined"?window:globalThis);\n',encoding='utf-8')
print('Extracted 245 original tiles, the A-type tilemap and 28 piece orientations.')
