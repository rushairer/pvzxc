import test from 'node:test';
import assert from 'node:assert/strict';
import {FUSIONS_V10} from '../src/fusions10.js';
import {SEEDS,RECIPES,recipeFor,getPlant,costFor,fusionKey} from '../src/model.js';
import {DEFAULT_DECK} from '../src/deck.js';
import {newGame,plantHere,tick,spawn} from '../src/engine.js';
import {makeSnapshot,restoreSnapshot} from '../src/save.js';

test('48 new experimental formulas are unique, resolvable and correctly registered',()=>{
 assert.equal(SEEDS.length,49);
 assert.equal(FUSIONS_V10.length,48);
 assert.equal(RECIPES.length,421);
 const keys=RECIPES.map(r=>r.ordered?r.inputs.join('>'):fusionKey(...r.inputs));
 assert.equal(new Set(keys).size,421);
 const ids=new Set(RECIPES.map(r=>r.id));
 assert.equal(ids.size,421);
 for(const recipe of FUSIONS_V10){
  assert.equal(recipe.inputs.length,2);
  assert.ok(recipe.inputs.every(id=>getPlant(id)),recipe.id);
  assert.equal(recipeFor(...recipe.inputs)?.id,recipe.id);
  assert.equal(recipeFor(recipe.inputs[1],recipe.inputs[0])?.id,recipe.id);
  assert.ok(recipe.hp>0&&costFor(recipe.id)>=0);
  assert.equal(recipe.approximate,true);
  assert.equal(recipe.source,'experimental');
 }
});
test('all 48 new cards can be planted, simulated, and restored with ten-card loadouts',()=>{
 for(const recipe of FUSIONS_V10){
  const ids=[recipe.id,...DEFAULT_DECK.filter(id=>id!==recipe.id)].slice(0,10);
  const s=newGame(ids);
  s.sun=10000000;s.spawnTimer=1e7;s.skyTimer=1e7;
  assert.equal(plantHere(s,2,2,recipe.id),true,recipe.id);
  assert.equal(s.grid[2][2].id,recipe.id);
  spawn(s,2,'normal',1150);
  for(let i=0;i<12;i++)tick(s,.05);
  const restored=restoreSnapshot(makeSnapshot(s));
  assert.equal(restored.grid[2][2].id,recipe.id);
  assert.deepEqual(restored.decks.map(card=>card.id),ids);
 }
});
test('new recipes provide distinct winter, three-line, fume and squash mechanics',()=>{
 const p=id=>getPlant('v10-'+id);
 assert.equal(p('ice-repeater').shots,2);
 assert.equal(p('ice-repeater').freezeHit,22);
 assert.equal(p('three-kernel').triple,true);
 assert.equal(p('three-kernel').lob,true);
 assert.equal(p('fume-gatling').shots,4);
 assert.equal(p('fume-gatling').pierce,true);
 assert.ok(p('squash-wall').miniSquash?.damage>0);
 assert.equal(p('ice-jalapeno').instant.kind,'ice-doom');
 assert.equal(recipeFor('ice-doom','fume')?.id,'v10-super-fume');
});
test('fused plant can become an ingredient of the advanced super fume recipe',()=>{
 const deck=['ice-doom','fume','ice-shroom',...DEFAULT_DECK.filter(id=>!['ice-doom','fume','ice-shroom'].includes(id))].slice(0,10);
 const s=newGame(deck);
 s.sun=10000000;
 assert.equal(plantHere(s,2,2,'ice-doom'),true);
 assert.equal(plantHere(s,2,2,'fume'),true);
 assert.equal(s.grid[2][2].id,'v10-super-fume');
 assert.ok(s.solved.has('v10-super-fume'));
});
