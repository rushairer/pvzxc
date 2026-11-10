import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SEEDS,RECIPES,getPlant,recipeFor,createPlant,costFor,fusionKey} from '../src/model.js';
import {DEFAULT_DECK} from '../src/deck.js';
import {newGame,plantHere,tick} from '../src/engine.js';
import {makeSnapshot,restoreSnapshot} from '../src/save.js';
import {FUSIONS_V7} from '../src/fusions7.js';
import {FUSIONS_ULTIMATE} from '../src/fusions-ultimate.js';

const IDS=[
 'hypno-emperor','ultimate-cherry-shooter','ultimate-flame-torch','cherry-warrior',
 'ultimate-fume','sun-emperor-nut','steel-spikerock','doom-gatling',
 'frost-gatling-puff','star-emperor','ultimate-gloom','laser-pumpkin',
 'cob-ice','gold-magnet-nut','ultimate-gatling','ultimate-pumpkin'
];
function gameWith(...ids){
 const deck=[...new Set([...ids,...DEFAULT_DECK,...SEEDS.map(x=>x.id)])].slice(0,10);
 const s=newGame(deck);s.sun=1e7;s.spawnTimer=1e8;s.skyTimer=1e8;return s;
}
test('all 72 newly added recipes are registered and have unambiguous formulas',()=>{
 assert.equal(FUSIONS_V7.length,60);
 assert.equal(FUSIONS_ULTIMATE.length,12);
 assert.equal(RECIPES.length,325);
 const all=[...FUSIONS_V7,...FUSIONS_ULTIMATE];
 const unique=new Set(all.map(x=>fusionKey(...x.inputs)));
 assert.equal(unique.size,72);
 for(const recipe of all){
  assert.equal(recipeFor(recipe.inputs[0],recipe.inputs[1])?.id,recipe.id,recipe.name);
  assert.ok(getPlant(recipe.id));
  assert.ok(recipe.hp>0&&costFor(recipe.id)>0);
  assert.ok(recipe.approximate);
 }
});
test('new fusion cards can be planted and saved without altering the ten-card game rules',()=>{
 for(const recipe of [...FUSIONS_V7,...FUSIONS_ULTIMATE]){
  const s=gameWith(recipe.id);
  assert.equal(s.decks.length,10);
  assert.equal(plantHere(s,2,2,recipe.id),true,recipe.id);
  assert.equal(s.grid[2][2].id,recipe.id);
  for(let i=0;i<4;i++)tick(s,.05);
  const restored=restoreSnapshot(makeSnapshot(s));
  assert.equal(restored.grid[2][2].id,recipe.id);
  assert.equal(restored.decks.length,10);
 }
});
test('hypno emperor eventually summons a friendly football zombie',()=>{
 const s=gameWith('hypno-emperor');
 assert.ok(plantHere(s,2,2,'hypno-emperor'));
 for(let i=0;i<610;i++)tick(s,.05);
 assert.ok(s.zombies.some(z=>z.type==='football'&&z.charmed),'missing summoned ally');
 const saved=restoreSnapshot(makeSnapshot(s));
 assert.ok(saved.grid[2][2].summonTimer>0);
});
test('all 16 named high-tier characters map to unique sprite tiles',async()=>{
 const m=await import('../src/fusion-sprites.js');
 assert.deepEqual(m.FUSION_SPRITE_IDS,IDS);
 assert.equal(new Set(IDS).size,16);
 for(const id of IDS){assert.ok(getPlant(id),'missing named fusion '+id);assert.equal(m.fusionTileRect(id).length,4);}
 assert.equal(m.fusionTileRect('pea'),null);
});
test('the committed fusion artwork is a real WebP atlas',async()=>{
 const bytes=await readFile(new URL('../assets/fusions-16.webp',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(bytes.byteLength>150000&&bytes.byteLength<1500000);
});
test('sprite loader crops all 16 characters when asset decodes',async()=>{
 const old=globalThis.Image;
 class MockImage{
  naturalWidth=1024;naturalHeight=1024;
  set src(v){this.url=v;this.onload?.();}
 }
 globalThis.Image=MockImage;
 try{
  const m=await import('../src/fusion-sprites.js?test=loaded');
  assert.equal(m.fusionSpriteStatus().ready,true);
  const calls=[],ctx={save(){},restore(){},drawImage(...args){calls.push(args);}};
  for(const id of IDS)assert.equal(m.drawFusionPlantSprite(ctx,{id,age:1},1),true,id);
  assert.equal(calls.length,16);
  assert.ok(calls.every(c=>c.length===9&&c[3]===256&&c[4]===256));
  assert.equal(m.drawFusionPlantSprite(ctx,{id:'pea'},1),false);
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
test('missing high-tier atlas uses preexisting composite sprite fallback',async()=>{
 const old=globalThis.Image;
 class FailImage{set src(v){this.onerror?.();}}
 globalThis.Image=FailImage;
 try{
  const m=await import('../src/fusion-sprites.js?test=failed');
  assert.equal(m.fusionSpriteStatus().ready,false);
  assert.equal(m.fusionSpriteStatus().failed,true);
  assert.equal(m.drawFusionPlantSprite({},{id:'hypno-emperor'}),false);
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
