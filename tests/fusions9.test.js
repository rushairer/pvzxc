import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SEEDS,RECIPES,recipeFor,getPlant,costFor,fusionKey} from '../src/model.js';
import {FUSIONS_V9} from '../src/fusions9.js';
import {DEFAULT_DECK} from '../src/deck.js';
import {newGame,plantHere,tick} from '../src/engine.js';
import {makeSnapshot,restoreSnapshot} from '../src/save.js';

test('24 new high-tier recipes exist, have unique formulas and are playable',()=>{
 assert.equal(FUSIONS_V9.length,24);
 assert.equal(RECIPES.length,373);
 const ids=new Set(),pairs=new Set();
 for(const recipe of FUSIONS_V9){
  assert.ok(!ids.has(recipe.id));ids.add(recipe.id);
  const k=fusionKey(...recipe.inputs);
  assert.ok(!pairs.has(k));pairs.add(k);
  assert.equal(recipeFor(...recipe.inputs)?.id,recipe.id);
  assert.ok(recipe.inputs.every(id=>getPlant(id)),recipe.id);
  assert.ok(costFor(recipe.id)>0,recipe.id);
  assert.equal(recipe.approximate,true);
  assert.equal(recipe.source,'experimental');
 }
});
test('each new recipe is selectable in a 10-card deck and survives simulation and saving',()=>{
 for(const recipe of FUSIONS_V9){
  const chosen=[recipe.id,...DEFAULT_DECK.filter(id=>id!==recipe.id)].slice(0,10);
  const s=newGame(chosen);
  s.sun=10000000;s.skyTimer=1e8;s.spawnTimer=1e8;
  assert.equal(plantHere(s,2,2,recipe.id),true,recipe.id);
  assert.equal(s.grid[2][2].id,recipe.id);
  for(let i=0;i<10;i++)tick(s,.05);
  const resumed=restoreSnapshot(makeSnapshot(s));
  assert.equal(resumed.grid[2][2].id,recipe.id);
  assert.deepEqual(resumed.decks.map(x=>x.id),chosen);
 }
});
test('16 SVG cells contain complete art and no external image references',async()=>{
 const svg=await readFile(new URL('../assets/fusions-v9.svg',import.meta.url),'utf8');
 assert.match(svg,/width="1024" height="1024"/);
 assert.equal((svg.match(/<g id="/g)||[]).length,16);
 assert.ok(svg.includes('<radialGradient'));
 assert.ok(!svg.includes('<image'));
 const {FUSION_V9_SPRITE_IDS,fusionV9SpriteRect}=await import('../src/fusion-sprites9.js');
 assert.equal(FUSION_V9_SPRITE_IDS.length,16);
 assert.equal(new Set(FUSION_V9_SPRITE_IDS).size,16);
 const rects=FUSION_V9_SPRITE_IDS.map(id=>fusionV9SpriteRect(id).join(','));
 assert.equal(new Set(rects).size,16);
 for(const id of FUSION_V9_SPRITE_IDS)assert.ok(getPlant(id),id);
});
test('new SVG sprites render all sixteen cell crops and gracefully ignore unknown types',async()=>{
 const previous=globalThis.Image;
 class MockImage{
  naturalWidth=1024;naturalHeight=1024;
  set src(x){this.url=x;this.onload?.();}
 }
 globalThis.Image=MockImage;
 try{
  const atlas=await import('../src/fusion-sprites9.js?loaded-test');
  assert.equal(atlas.fusionV9SpriteStatus().loaded,true);
  const calls=[],ctx={save(){},restore(){},drawImage(...args){calls.push(args);}};
  for(const id of atlas.FUSION_V9_SPRITE_IDS){
   assert.equal(atlas.drawFusionV9Sprite(ctx,{id,age:1},1),true,id);
  }
  assert.equal(calls.length,16);
  for(let i=0;i<calls.length;i++)
   assert.deepEqual(calls[i].slice(1,5),[(i%4)*256,Math.floor(i/4)*256,256,256]);
  assert.equal(atlas.drawFusionV9Sprite(ctx,{id:'pea'},1),false);
 }finally{if(previous===undefined)delete globalThis.Image;else globalThis.Image=previous;}
});
test('failed SVG load falls back to old composition artwork',async()=>{
 const previous=globalThis.Image;
 class MissingImage{set src(x){this.onerror?.();}}
 globalThis.Image=MissingImage;
 try{
  const atlas=await import('../src/fusion-sprites9.js?failed-test');
  assert.equal(atlas.fusionV9SpriteStatus().loaded,false);
  assert.equal(atlas.fusionV9SpriteStatus().failed,true);
  assert.equal(atlas.drawFusionV9Sprite({}, {id:'prism-cobcannon'}),false);
 }finally{if(previous===undefined)delete globalThis.Image;else globalThis.Image=previous;}
});
