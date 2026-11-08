import test from 'node:test';
import assert from 'node:assert/strict';
import {SEEDS,RECIPES,getPlant,recipeFor,createPlant,fusionKey,unlockedSeeds} from '../src/model.js';
import {BOARD,ENDLESS,ZOMBIE_TYPES,ZOMBIE_IDS,newGame,plantHere,collectAt,spawn,tick} from '../src/engine.js';
import {SAVE_VERSION,makeSnapshot,restoreSnapshot,saveGame,loadGame,listSaves,deleteSave} from '../src/save.js';
import {drawScene} from '../src/render.js';
const memoryStore=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
function step(s,seconds){for(let i=0;i<Math.ceil(seconds/.05);i++)tick(s,.05);}
function generous(){const s=newGame();s.sun=100000;return s;}
const canvasMethods=new Set(['beginPath','closePath','roundRect','fill','stroke','arc','ellipse','moveTo','lineTo','strokeRect','fillRect','clearRect','save','restore','translate','scale','rotate','fillText','drawImage','quadraticCurveTo','bezierCurveTo']);
function mockCtx(){return new Proxy({},{get(o,k){if(k==='createLinearGradient'||k==='createRadialGradient')return()=>({addColorStop(){}});if(canvasMethods.has(k))return()=>{};return o[k];},set(o,k,v){o[k]=v;return true;}});}
const renderOptions={BOARD,SEEDS,RECIPES,ENDLESS,ZOMBIE_IDS,getPlant,recipeFor};

test('all 49 classic seed plants are available immediately',()=>{
 assert.equal(SEEDS.length,49);
 assert.equal(unlockedSeeds().length,49);
 const ids=SEEDS.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);
 const s=newGame();assert.equal(s.mode,'endless');
 assert.equal(s.decks.length,49);assert.equal(s.sun,ENDLESS.initialSun);
 assert.ok(SEEDS.every(x=>x.cost>=0&&x.cooldown>0&&x.hp>0));
});
test('all 26 classic zombie categories are registered',()=>{
 assert.equal(ZOMBIE_IDS.length,26);
 assert.equal(new Set(ZOMBIE_IDS).size,26);
 for(const id of ZOMBIE_IDS){
  const s=newGame();spawn(s,2,id);
  assert.equal(s.zombies.length,1,id);
  assert.equal(s.zombies[0].type,id);
  assert.ok(s.zombies[0].hp>0);
 }
});
test('115 distinct fusion recipes have resolvable ingredients and products',()=>{
 assert.equal(RECIPES.length,115);
 const ids=new Set(SEEDS.map(s=>s.id)),recipeIds=RECIPES.map(r=>r.id);
 assert.equal(new Set(recipeIds).size,recipeIds.length);
 assert.equal(recipeIds.filter(x=>ids.has(x)).length,0);
 const keys=RECIPES.map(r=>r.ordered?r.inputs.join('>'):fusionKey(...r.inputs));
 assert.equal(new Set(keys).size,keys.length);
 for(const r of RECIPES){
  assert.equal(recipeFor(r.inputs[0],r.inputs[1])?.id,r.id,r.id);
  assert.ok(getPlant(r.id)&&r.hp>0);
  assert.ok(getPlant(r.inputs[0])&&getPlant(r.inputs[1]),r.id);
 }
});
test('endless mode does not end after the previous 5-wave campaign duration',()=>{
 const s=newGame();s.spawnTimer=1e6;s.skyTimer=1e6;
 // Clear flag zombies as they spawn: this is a wave longevity test, not a defense test.
 for(let i=0;i<Math.ceil(310/.05);i++){tick(s,.05);s.zombies.length=0;}
 assert.ok(s.wave>=10);assert.equal(s.phase,'playing');
});
test('all cards can be planted from the beginning',()=>{
 for(const seed of SEEDS){
  const s=generous();
  if(seed.graveBuster)s.graves=[{row:2,col:4}];
  if(seed.coffee){plantHere(s,2,2,'pea');s.cooldowns.pea=0;}
  if(seed.imitater){plantHere(s,2,2,'pea');s.cooldowns.pea=0;}
  assert.equal(plantHere(s,2,seed.coffee||seed.imitater?2:4,seed.id),true,seed.id);
 }
});
test('fusion recipes are enabled at the start',()=>{
 const s=generous();
 plantHere(s,2,1,'pea');s.cooldowns.pea=0;
 assert.ok(plantHere(s,2,1,'pea'));assert.equal(s.grid[2][1].id,'repeater');
 s.cooldowns.pea=0;plantHere(s,2,1,'pea');assert.equal(s.grid[2][1].id,'split-pea');
 assert.ok(s.solved.has('repeater'));
});
test('pumpkin armor can be planted on another plant and repaired',()=>{
 const s=generous();plantHere(s,2,2,'pea');
 assert.ok(plantHere(s,2,2,'pumpkin'));
 s.grid[2][2].cover=1200;s.cooldowns.pumpkin=0;
 assert.ok(plantHere(s,2,2,'pumpkin'));assert.equal(s.grid[2][2].cover,4000);
});
test('imitater copies last planted plant but cannot copy an empty history',()=>{
 const s=generous();
 assert.equal(plantHere(s,2,2,'imitater'),false);
 plantHere(s,2,2,'pea');s.cooldowns.imitater=0;
 assert.ok(plantHere(s,2,3,'imitater'));
 assert.equal(s.grid[2][3].id,'pea');
 assert.equal(s.cooldowns.imitater,getPlant('imitater').cooldown);
});
test('gravebuster only works on gravestones',()=>{
 const s=generous();
 assert.equal(plantHere(s,2,1,'gravebuster'),false);
 s.graves.push({row:2,col:1});
 assert.equal(plantHere(s,2,1,'gravebuster'),true);
 assert.equal(s.graves.length,0);
});
test('coffee bean requires existing plant',()=>{
 const s=generous();assert.equal(plantHere(s,1,2,'coffeebean'),false);
 plantHere(s,1,2,'pea');assert.equal(plantHere(s,1,2,'coffeebean'),true);
 assert.ok(s.grid[1][2].boostLeft>0);
});
test('cattail fires across lanes',()=>{
 const s=generous();plantHere(s,0,0,'cattail');spawn(s,4,'normal',1050);
 s.spawnTimer=1e6;s.skyTimer=1e6;step(s,1.3);
 assert.ok(s.bullets.some(b=>b.homing), 'Expected cross-lane homing bullet');
});
test('cob cannon auto blasts enemies after recharge',()=>{
 const s=generous();plantHere(s,2,1,'cobcannon');spawn(s,2,'garg',1120);
 s.spawnTimer=1e6;s.skyTimer=1e6;step(s,6);
 assert.ok(!s.zombies.length||s.zombies[0].hp<3100);
});
test('zombie specials work: bungee steals only if unprotected',()=>{
 const s=generous();plantHere(s,2,2,'pea');
 spawn(s,2,'bungee');s.spawnTimer=1e6;s.skyTimer=1e6;step(s,.8);
 assert.equal(s.grid[2][2],null);
 const other=generous();plantHere(other,2,2,'pea');plantHere(other,2,3,'umbrella');
 spawn(other,2,'bungee');other.spawnTimer=1e6;other.skyTimer=1e6;step(other,.8);
 assert.ok(other.grid[2][2]);
});
test('zombie movement and game over still work',()=>{
 const s=newGame();s.mowers[0]=false;spawn(s,0,'normal',BOARD.x-100);
 tick(s,.05);assert.equal(s.phase,'lost');
});
test('solar economy and wave progress persist over time',()=>{
 const s=generous();plantHere(s,1,1,'sun');s.spawnTimer=1e6;
 const start=s.sun;step(s,7);assert.ok(s.suns.length>0);
 const amount=s.suns[0].amount,x=s.suns[0].x,y=s.suns[0].y;
 assert.ok(collectAt(s,x,y));assert.equal(s.sun,start+amount);
});
test('save roundtrip restores entire battle and can continue simulation',()=>{
 const s=generous();s.sun=777;plantHere(s,1,1,'pea');s.cooldowns.pea=0;plantHere(s,1,1,'pea');
 plantHere(s,2,2,'sun');plantHere(s,2,2,'pumpkin');
 spawn(s,2,'bucket',1230);s.spawnTimer=999;s.skyTimer=999;
 step(s,1);
 s.wave=8;s.record=8;s.page=4;s.coins=1200;s.mowers=[true,false,true,false,true];
 const snapshot=JSON.parse(JSON.stringify(makeSnapshot(s)));
 const r=restoreSnapshot(snapshot);
 assert.equal(r.sun,s.sun);assert.equal(r.wave,8);assert.equal(r.page,4);
 assert.equal(r.grid[1][1].id,'repeater');assert.equal(r.grid[2][2].cover,4000);
 assert.equal(r.zombies[0].type,'bucket');assert.equal(r.zombies.length,s.zombies.length);
 assert.deepEqual(r.mowers,s.mowers);assert.equal(r.solved.has('repeater'),true);
 assert.doesNotThrow(()=>step(r,1.5));
});
test('projectile hit Sets survive storage serialization',()=>{
 const s=generous();plantHere(s,2,1,'pea');spawn(s,2,'bucket',1250);
 s.spawnTimer=1e6;s.skyTimer=1e6;step(s,.8);
 assert.ok(s.bullets.length>0);
 const r=restoreSnapshot(makeSnapshot(s));
 assert.ok(r.bullets[0].hit instanceof Set);
 assert.doesNotThrow(()=>tick(r,.05));
});
test('auto slot and three manual slots load independently',()=>{
 const storage=memoryStore(),s=newGame();
 saveGame(s,'auto',storage);s.wave=3;saveGame(s,'slot1',storage);
 s.wave=7;saveGame(s,'slot2',storage);s.wave=11;saveGame(s,'slot3',storage);
 assert.equal(listSaves(storage).filter(v=>v.exists).length,4);
 assert.equal(loadGame('auto',storage).wave,1);
 assert.equal(loadGame('slot1',storage).wave,3);
 assert.equal(loadGame('slot2',storage).wave,7);
 assert.equal(loadGame('slot3',storage).wave,11);
 deleteSave('slot2',storage);assert.equal(loadGame('slot2',storage),null);
});
test('corrupt or incompatible snapshots reject cleanly',()=>{
 const storage=memoryStore();storage.setItem('pvzxc.endless.v1.slot1','{broken json');
 assert.throws(()=>loadGame('slot1',storage),/读取失败/);
 assert.throws(()=>restoreSnapshot({version:SAVE_VERSION+1,state:{}}),/不受支持/);
});
test('render all 49 base plants and 115 fusion species without exceptions',()=>{
 const all=[...SEEDS,...RECIPES],ctx=mockCtx();
 for(let i=0;i<all.length;i+=45){
  const s=newGame();for(let n=0;n<45&&i+n<all.length;n++){
   const spec=all[i+n];s.grid[Math.floor(n/9)][n%9]=createPlant(spec,spec.inputs||[spec.id]);
  }
  assert.doesNotThrow(()=>drawScene(ctx,s,renderOptions),'plant group '+i);
 }
});
test('render all 26 enemy visual classes without exceptions',()=>{
 const ctx=mockCtx();const s=newGame();
 for(let i=0;i<ZOMBIE_IDS.length;i++)spawn(s,i%5,ZOMBIE_IDS[i],600+i*16);
 assert.doesNotThrow(()=>drawScene(ctx,s,renderOptions));
});
