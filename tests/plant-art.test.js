import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SEEDS,RECIPES,createPlant} from '../src/model.js';
import {PLANT_ATLAS_IDS,resolvePlantRoots,resolvePlantSpriteId,plantTileRect} from '../src/plant-sprites.js';

test('49 basic plants all have distinct raster atlas tiles',()=>{
 assert.equal(SEEDS.length,49);
 assert.equal(PLANT_ATLAS_IDS.length,49);
 assert.deepEqual(PLANT_ATLAS_IDS,SEEDS.map(x=>x.id));
 assert.equal(new Set(PLANT_ATLAS_IDS).size,49);
 assert.equal(new Set(PLANT_ATLAS_IDS.map(id=>plantTileRect(id).join(','))).size,49);
 for(const item of SEEDS)assert.equal(resolvePlantSpriteId(item),item.id,item.name);
});
test('all 373 fusions resolve their source materials into atlas art',()=>{
 assert.equal(RECIPES.length,373);
 for(const spec of RECIPES){
  const roots=resolvePlantRoots(spec);
  assert.ok(roots.length>=2,'no fusion material for '+spec.id);
  assert.ok(PLANT_ATLAS_IDS.includes(resolvePlantSpriteId(spec)),'no image for '+spec.id);
  assert.ok(roots.every(id=>PLANT_ATLAS_IDS.includes(id)),'unknown leaf '+spec.id);
  const p=createPlant(spec,spec.inputs);
  assert.equal(resolvePlantSpriteId(p),roots[0]);
 }
});
test('the committed 7×7 WebP atlas is complete',async()=>{
 const bytes=await readFile(new URL('../assets/plants-49.webp',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(bytes.length>200000&&bytes.length<1500000);
});
test('sprites and fusion branches draw correctly with an image-loaded canvas',async()=>{
 const old=globalThis.Image;
 class MockImage{
  naturalWidth=1792; naturalHeight=1792;
  set src(value){this.url=value;this.onload?.();}
 }
 globalThis.Image=MockImage;
 try{
  const sprites=await import('../src/plant-sprites.js?test=loaded');
  assert.ok(sprites.isPlantAtlasReady());
  const drawCalls=[];
  const c={
   save(){},restore(){},beginPath(){},moveTo(){},bezierCurveTo(){},
   stroke(){},ellipse(){},fill(){},arc(){},
   drawImage(...args){drawCalls.push(args);}
  };
  for(const spec of SEEDS)assert.equal(sprites.drawPlantSprite(c,spec,1.1),true,spec.id);
  for(const spec of RECIPES){
   const p=createPlant(spec,spec.inputs);
   assert.equal(sprites.drawPlantSprite(c,p,1),true,spec.id);
   assert.equal(sprites.drawFusionSpriteParts(c,p,1),true,spec.id);
  }
  assert.ok(drawCalls.length>SEEDS.length+RECIPES.length*2);
  assert.ok(drawCalls.every(x=>x.length===9),'all drawImage calls need tile cropping');
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
test('missing sprite file gracefully preserves original procedural fallback',async()=>{
 const old=globalThis.Image;
 class MockFailure{set src(value){this.onerror?.();}}
 globalThis.Image=MockFailure;
 try{
  const sprites=await import('../src/plant-sprites.js?test=failed');
  assert.equal(sprites.isPlantAtlasReady(),false);
  assert.equal(sprites.drawPlantSprite({save(){},restore(){}},SEEDS[0]),false);
  assert.equal(sprites.drawFusionSpriteParts({},RECIPES[0]),false);
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
