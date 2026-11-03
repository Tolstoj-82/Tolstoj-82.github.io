const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const A=require('../js/rom-assets.js');
const C=require('../js/core.js');
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
test('all mino textures are the extracted ROM tiles',()=>{for(const [type,id] of Object.entries(A.minoIds))assert.deepEqual(C.TILES[type],A.tiles[id]);assert.deepEqual(C.TILES['.'],A.tiles[47]);});
test('original brick walls and blank well come from the tilemap',()=>{assert.equal(A.aTypeMap.length,360);for(let y=0;y<18;y++){assert.equal(A.aTypeMap[y*20+1],123+y%3);assert.equal(A.aTypeMap[y*20+12],123+y%3);for(let x=2;x<12;x++)assert.equal(A.aTypeMap[y*20+x],47);}});
test('horizontal I uses original left, middle, middle, right segments',()=>{const f=C.normalize({title:'I',frames:[{active:{type:'I',rotation:0,x:2,y:3}}]}).frames[0];const t=C.visualTiles(f,18);assert.deepEqual(t[5].slice(2,6),[138,139,139,143]);});
test('vertical I uses original top, middle, middle, bottom segments',()=>{const f=C.normalize({title:'I',frames:[{active:{type:'I',rotation:1,x:2,y:3}}]}).frames[0];const t=C.visualTiles(f,18);assert.deepEqual([3,4,5,6].map(y=>t[y][3]),[128,136,136,137]);});
test('tile overrides preserve fragments and round-trip through JSON',()=>{const s=C.normalize({title:'Fragment',height:2,frames:[{board:['...I......'],tileOverrides:[{x:3,y:1,tile:139}]}]});assert.equal(C.visualTiles(s.frames[0],2)[1][3],139);assert.deepEqual(C.normalize(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>C.normalize({...s,frames:[{tileOverrides:[{x:10,y:0,tile:139}]}]}));assert.throws(()=>C.normalize({...s,frames:[{tileOverrides:[{x:0,y:0,tile:47}]}]}));});
test('active pieces use all four original per-mino tile identities',()=>{for(const type of Object.keys(C.SHAPES))for(let rotation=0;rotation<4;rotation++){const f=C.normalize({title:type,frames:[{active:{type,rotation,x:2,y:2}}]}).frames[0];const tiles=C.visualTiles(f,18);C.cells(type,rotation).forEach(([x,y],i)=>assert.equal(tiles[y+2][x+2],C.pieceLayout(type,rotation)[i][2]));}});
test('curtain uses original tile $87 throughout',()=>{const s=C.normalize({title:'Curtain',frames:[{board:Array(18).fill('XXXXXXXXXX')}]});assert(C.visualTiles(s.frames.at(-1),18).flat().every(id=>id===135));});
if(process.argv[2]){
 const rom=fs.readFileSync(process.argv[2]);
 test('source ROM checksum matches recorded provenance',()=>assert.equal(crypto.createHash('sha256').update(rom).digest('hex'),A.source.sha256));
 test('all 15,680 tile pixels match the source ROM bitplanes',()=>{let tile=0;for(const {offset,count,bpp} of A.source.tileSets){const start=parseInt(offset,16);for(let i=0;i<count;i++,tile++)for(let y=0;y<8;y++)for(let x=0;x<8;x++){const lo=(rom[start+i*8*bpp+y*bpp]>>(7-x))&1;const hi=bpp===2?(rom[start+i*16+y*2+1]>>(7-x))&1:0;const pixel=bpp===1?lo*3:lo|(hi<<1);assert.equal(Number(A.tiles[tile][y][x]),pixel,`Tile ${tile}, pixel ${x},${y}`);}}assert.equal(tile,245);});
 test('entire 20x18 map matches original bytes',()=>assert.deepEqual(A.aTypeMap,[...rom.subarray(0x3e8f,0x3e8f+360)]));
 test('all 28 orientation records match ROM positions and tile IDs',()=>{let index=0;const records=Array.from({length:28},(_,i)=>rom.readUInt16LE(0x2c20+i*4)+2);assert.equal(records.length,28);for(const type of ['L','J','I','O','Z','S','T'])for(const minos of A.pieceLayouts[type]){const start=records[index++],expected=[];for(let i=0;i<16&&rom[start+i]!==255;i++)if(rom[start+i]!==254)expected.push([i%4,Math.floor(i/4),rom[start+i]]);assert.deepEqual(minos,expected);}});
 test('identity background palette and curtain tile are confirmed in ROM code',()=>{assert.deepEqual([...rom.subarray(0x23d,0x241)],[0x3e,0xe4,0xe0,0x47]);assert.deepEqual([...rom.subarray(0x1cf8,0x1cfd)],[0x3e,0x87,0xcd,0xd7,0x1f]);});
}
console.log(`${count} asset checks passed.`);
