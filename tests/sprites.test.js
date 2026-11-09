import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('transparent hand-painted atlas is a valid local WebP and not a remote dependency',async()=>{
 const data=await readFile(new URL('../assets/character-atlas.webp',import.meta.url));
 assert.ok(data.length>50000&&data.length<600000,'atlas should be real compressed game art');
 assert.equal(data.toString('ascii',0,4),'RIFF');
 assert.equal(data.toString('ascii',8,12),'WEBP');
});
test('six plant and four zombie pictures render when loaded',async()=>{
 class MockImage{
  naturalWidth=852;naturalHeight=436;
  set src(value){this.url=value;this.onload?.();}
 }
 const old=globalThis.Image;
 globalThis.Image=MockImage;
 try{
  const atlas=await import('../src/sprite-atlas.js?test=assets-loaded');
  assert.equal(atlas.isSpriteAtlasReady(),true);
  assert.equal(atlas.SPRITE_ATLAS_IDS.plants.length,6);
  assert.equal(atlas.SPRITE_ATLAS_IDS.zombies.length,4);
  const calls=[];
  const c={save(){},restore(){},translate(){},drawImage(...args){calls.push(args);}};
  for(const id of atlas.SPRITE_ATLAS_IDS.plants){
   assert.ok(atlas.drawPlantSprite(c,{id,parts:[id]},1.5),id);
  }
  for(const type of atlas.SPRITE_ATLAS_IDS.zombies){
   assert.ok(atlas.drawZombieSprite(c,{type,anim:0},1.5),type);
  }
  assert.equal(calls.length,10);
  assert.equal(atlas.drawPlantSprite(c,{id:'ice-shroom'},0),false);
  assert.equal(atlas.drawZombieSprite(c,{type:'football'},0),false);
  assert.ok(calls.every(args=>args.length===9));
 }finally{
  if(old===undefined)delete globalThis.Image;else globalThis.Image=old;
 }
});
test('missing sprite atlas falls back to procedural art',async()=>{
 class MissingImage{set src(value){this.onerror?.(new Error('missing file'));}}
 const old=globalThis.Image;globalThis.Image=MissingImage;
 try{
  const atlas=await import('../src/sprite-atlas.js?test=missing-assets');
  assert.equal(atlas.isSpriteAtlasReady(),false);
  assert.equal(atlas.spriteAtlasStatus().failed,true);
  assert.equal(atlas.drawPlantSprite({save(){},restore(){}},{id:'sun'}),false);
 }finally{
  if(old===undefined)delete globalThis.Image;else globalThis.Image=old;
 }
});
