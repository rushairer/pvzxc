import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SEEDS,RECIPES,recipeFor,getPlant,costFor,fusionKey} from '../src/model.js';
import {FUSIONS_V8} from '../src/fusions8.js';
import {newGame,plantHere,tick} from '../src/engine.js';
import {makeSnapshot,restoreSnapshot} from '../src/save.js';
import {DEFAULT_DECK} from '../src/deck.js';

test('24 Alpha 1.1 recipes are playable, unique and present in the 349 catalog',()=>{
 assert.equal(FUSIONS_V8.length,24);
 assert.equal(RECIPES.length,349);
 const keys=new Set(),ids=new Set();
 for(const r of FUSIONS_V8){
  const k=fusionKey(...r.inputs);
  assert.ok(!keys.has(k),k);keys.add(k);
  assert.ok(!ids.has(r.id),r.id);ids.add(r.id);
  assert.equal(recipeFor(...r.inputs)?.id,r.id);
  assert.ok(r.inputs.every(id=>getPlant(id)),r.id);
  assert.ok(costFor(r.id)>0,r.id);
  assert.equal(r.approximate,true);
 }
});
test('each new fusion can be selected, planted, animated and restored from a save',()=>{
 for(const recipe of FUSIONS_V8){
  const deck=[recipe.id,...DEFAULT_DECK.filter(id=>id!==recipe.id)].slice(0,10);
  const s=newGame(deck);
  s.sun=1000000;s.spawnTimer=1e7;s.skyTimer=1e7;
  assert.equal(plantHere(s,2,2,recipe.id),true,recipe.id);
  assert.equal(s.grid[2][2]?.id,recipe.id);
  for(let i=0;i<3;i++)tick(s,.05);
  const restored=restoreSnapshot(makeSnapshot(s));
  assert.equal(restored.grid[2][2].id,recipe.id);
  assert.deepEqual(restored.decks.map(p=>p.id),deck);
 }
});
test('new art atlas is a 4x4 transparent SVG with sixteen distinct cells',async()=>{
 const svg=await readFile(new URL('../assets/fusions-v8.svg',import.meta.url),'utf8');
 assert.match(svg,/<svg[^>]+width="1024" height="1024"/);
 assert.ok((svg.match(/<g transform="translate\(/g)||[]).length===16);
 assert.ok(!svg.includes('<image'),'all artwork is native SVG');
 const mod=await import('../src/fusion-sprites8.js');
 assert.equal(mod.FUSION_V8_SPRITE_IDS.length,16);
 const rects=mod.FUSION_V8_SPRITE_IDS.map(id=>mod.fusionV8SpriteRect(id).join(','));
 assert.equal(new Set(rects).size,16);
 for(const id of mod.FUSION_V8_SPRITE_IDS)assert.ok(getPlant(id),id);
});
test('the original fusion illustration loader draws each tile and safely falls back',async()=>{
 const old=globalThis.Image;
 class FakeImage{
  naturalWidth=1024;naturalHeight=1024;
  set src(s){this.url=s;this.onload?.();}
 }
 globalThis.Image=FakeImage;
 try{
  const mod=await import('../src/fusion-sprites8.js?test=loaded');
  assert.equal(mod.fusionV8SpriteStatus().loaded,true);
  const calls=[],ctx={save(){},restore(){},drawImage(...xs){calls.push(xs);}};
  for(const id of mod.FUSION_V8_SPRITE_IDS)assert.ok(mod.drawFusionV8Sprite(ctx,{id},1));
  assert.equal(calls.length,16);
  assert.ok(calls.every(x=>x.length===9&&x[3]===256&&x[4]===256));
  assert.equal(mod.drawFusionV8Sprite(ctx,{id:'pea'},1),false);
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
test('new fusion atlas failure leaves old sprite renderer available',async()=>{
 const old=globalThis.Image;
 class FakeErrorImage{set src(s){this.onerror?.();}}
 globalThis.Image=FakeErrorImage;
 try{
  const mod=await import('../src/fusion-sprites8.js?test=failed');
  assert.equal(mod.fusionV8SpriteStatus().loaded,false);
  assert.equal(mod.drawFusionV8Sprite({}, {id:'aurora-star'}),false);
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
