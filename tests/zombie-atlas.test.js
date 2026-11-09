import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const EXPECTED=[
 'normal','flag','cone','bucket',
 'pole','screen','newspaper','football',
 'dancer','backup','ladder','jack',
 'digger','balloon','snorkel','dolphin'
];

test('zombie atlas asset has correct WebP header and is reasonably compressed',async()=>{
 const bytes=await readFile(new URL('../assets/zombies-16.webp',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(bytes.length>180000&&bytes.length<700000);
});

test('all sixteen zombie types have unique 256px atlas tiles',async()=>{
 const atlas=await import('../src/sprite-atlas.js?test=zombie-id-catalog');
 assert.deepEqual(atlas.ZOMBIE_ATLAS_IDS,EXPECTED);
 assert.equal(new Set(EXPECTED).size,16);
 const rects=EXPECTED.map(id=>atlas.zombieTileRect(id));
 assert.equal(new Set(rects.map(rect=>rect.join(','))).size,16);
 for(const [i,rect] of rects.entries())
  assert.deepEqual(rect,[(i%4)*256,Math.floor(i/4)*256,256,256]);
 assert.equal(atlas.zombieTileRect('zomboss'),null);
});

test('all sixteen illustrated zombies render their correct cropped tile',async()=>{
 const oldImage=globalThis.Image;
 class MockImage{
  naturalWidth=0;naturalHeight=0;
  set src(url){
   this.url=url;
   if(url.includes('zombies-16.webp')){this.naturalWidth=1024;this.naturalHeight=1024;}
   else {this.naturalWidth=852;this.naturalHeight=436;}
   this.onload?.();
  }
 }
 globalThis.Image=MockImage;
 try{
  const atlas=await import('../src/sprite-atlas.js?test=zombies-loaded');
  assert.equal(atlas.zombieAtlasStatus().ready,true);
  const calls=[];
  const ctx={save(){},restore(){},translate(){},scale(){},drawImage(...args){calls.push(args);}};
  for(const id of EXPECTED){
   assert.equal(atlas.drawZombieSprite(ctx,{type:id,anim:1.5,returning:id==='digger'},2),true,id);
  }
  assert.equal(calls.length,16);
  assert.ok(calls.every(call=>call.length===9));
  for(let i=0;i<calls.length;i++){
   assert.deepEqual(calls[i].slice(1,5),[(i%4)*256,Math.floor(i/4)*256,256,256]);
   assert.ok(calls[i][7]>80&&calls[i][8]>150);
  }
  // Unillustrated types still use their procedural path.
  assert.equal(atlas.drawZombieSprite(ctx,{type:'garg',anim:0},0),false);
 }finally{if(oldImage===undefined)delete globalThis.Image;else globalThis.Image=oldImage;}
});

test('bad or unavailable zombie image leaves previous sprites functional',async()=>{
 const oldImage=globalThis.Image;
 class MockImage{
  naturalWidth=852;naturalHeight=436;
  set src(url){if(url.includes('zombies-16.webp'))this.onerror?.();else this.onload?.();}
 }
 globalThis.Image=MockImage;
 try{
  const atlas=await import('../src/sprite-atlas.js?test=zombies-failed');
  assert.equal(atlas.zombieAtlasStatus().ready,false);
  assert.equal(atlas.zombieAtlasStatus().failed,true);
  const ctx={save(){},restore(){},translate(){},drawImage(){}};
  assert.equal(atlas.drawZombieSprite(ctx,{type:'normal',anim:0}),true);
  assert.equal(atlas.drawZombieSprite(ctx,{type:'football',anim:0}),false);
 }finally{if(oldImage===undefined)delete globalThis.Image;else globalThis.Image=oldImage;}
});
