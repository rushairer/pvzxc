import test from 'node:test';
import assert from 'node:assert/strict';
import { SEEDS, RECIPES, createPlant, recipeFor, fusionKey } from '../src/model.js';

test('all eight original seed types are present', () => {
  assert.equal(SEEDS.length, 8);
  assert.equal(new Set(SEEDS.map(p => p.id)).size, 8);
  assert.ok(SEEDS.every(p => p.cost > 0 && p.cooldown > 0));
});

test('36 unique two-plant recipes cover all pairs', () => {
  assert.equal(RECIPES.length, 36);
  const unique = new Set(RECIPES.map(p => fusionKey(...p.inputs)));
  assert.equal(unique.size, 36);
  for (const left of SEEDS) for (const right of SEEDS) {
    const recipe = recipeFor([left.id], right.id);
    assert.ok(recipe, left.id + '+' + right.id + ' should fuse');
    assert.deepEqual(recipe, recipeFor([right.id], left.id));
  }
});

test('fusion rejects three-component plants', () => {
  assert.equal(recipeFor(['pea','sun'],'wall'), null);
});

test('fusion plant can attack and generate sun independently', () => {
  const recipe = recipeFor(['pea'],'sun');
  const plant = createPlant(recipe,['pea','sun']);
  assert.ok(plant.damage > 0);
  assert.ok(plant.production > 0);
  assert.ok(Number.isFinite(plant.sunTimer));
  assert.ok(Number.isFinite(plant.timer));
});

test('plants always have positive health', () => {
  for (const seed of SEEDS) assert.ok(createPlant(seed,[seed.id]).hp > 0);
  for (const recipe of RECIPES) assert.ok(createPlant(recipe,recipe.inputs).hp > 0);
});
