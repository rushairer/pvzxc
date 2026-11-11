import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {BOARD,newGame,plantHere,spawn,tick} from '../src/engine.js';
import {DEFAULT_DECK} from '../src/deck.js';
import {RECIPES,getPlant,createPlant} from '../src/model.js';
import {FUSIONS_V9} from '../src/fusions9.js';
import {makeSnapshot,restoreSnapshot} from '../src/save.js';

const LAST16=[
 'ice-magnet-cannon','nightmare-chomper','volcanic-aurora','frostfire-star',
 'doom-spikerock','electric-cannon','glacial-emperor','titan-homing',
 'shadow-queen','solar-meteor','crystal-spike','butter-void',
 'inferno-star','prism-armor','doom-emperor','golden-garden'
];
function chosen(...ids){
 return [...new Set([...ids,...DEFAULT_DECK])].slice(0,10);
}
test('Alpha 1.3 completes custom artwork coverage for all 24 Alpha 1.2 recipes',async()=>{
 assert.equal(RECIPES.length,373);
 assert.equal(FUSIONS_V9.length,24);
 const old=await import('../src/fusion-sprites9.js');
 const extra=await import('../src/fusion-sprites10.js');
 assert.deepEqual(extra.FUSION_V10_SPRITE_IDS,LAST16);
 const all=[...old.FUSION_V9_SPRITE_IDS,...extra.FUSION_V10_SPRITE_IDS];
 const covered=all.filter(id=>FUSIONS_V9.some(spec=>spec.id===id));
 assert.equal(covered.length,24);
 assert.equal(new Set(covered).size,24);
 for(const r of FUSIONS_V9)assert.ok(covered.includes(r.id),r.id);
});
test('16 new portraits have their own 256px 4x4 atlas tile',async()=>{
 const svg=await readFile(new URL('../assets/fusions-v10.svg',import.meta.url),'utf8');
 assert.match(svg,/width="1024" height="1024"/);
 assert.equal((svg.match(/<g id="/g)||[]).length,16);
 assert.ok(!svg.includes('<image'));
 const atlas=await import('../src/fusion-sprites10.js');
 assert.equal(atlas.FUSION_V10_SPRITE_IDS.length,16);
 assert.equal(new Set(LAST16.map(id=>atlas.fusionV10SpriteRect(id).join(','))).size,16);
 for(const id of LAST16)assert.ok(getPlant(id),id);
});
test('new portraits draw and gracefully fall back on image loading failure',async()=>{
 const previous=globalThis.Image;
 class MockImage{
  naturalWidth=1024;naturalHeight=1024;
  set src(url){this.url=url;this.onload?.();}
 }
 globalThis.Image=MockImage;
 try{
  const atlas=await import('../src/fusion-sprites10.js?alpha13-loaded');
  const calls=[],ctx={save(){},restore(){},drawImage(...a){calls.push(a);}};
  assert.equal(atlas.fusionV10SpriteStatus().loaded,true);
  for(const id of LAST16)assert.equal(atlas.drawFusionV10Sprite(ctx,{id,age:2},3),true);
  assert.equal(calls.length,16);
  assert.ok(calls.every(x=>x.length===9&&x[3]===256&&x[4]===256));
  assert.equal(atlas.drawFusionV10Sprite(ctx,{id:'pea'},3),false);
 }finally{if(previous===undefined)delete globalThis.Image;else globalThis.Image=previous;}
 const old=globalThis.Image;
 class Failed{set src(url){this.onerror?.();}}
 globalThis.Image=Failed;
 try{
  const atlas=await import('../src/fusion-sprites10.js?alpha13-failed');
  assert.equal(atlas.fusionV10SpriteStatus().failed,true);
  assert.equal(atlas.drawFusionV10Sprite({}, {id:LAST16[0]}),false);
 }finally{if(old===undefined)delete globalThis.Image;else globalThis.Image=old;}
});
test('a legitimate existing plant + pumpkin recipe takes precedence over armor',()=>{
 const s=newGame(chosen('wall','pumpkin'));
 s.sun=1e5;
 assert.equal(plantHere(s,1,1,'wall'),true);
 assert.equal(plantHere(s,1,1,'pumpkin'),true);
 assert.equal(s.grid[1][1].id,'v6-wall-pumpkin');
 assert.ok(s.solved.has('v6-wall-pumpkin'));
 assert.equal(s.grid[1][1].cover,1200);
});
test('attack recoil animation is set on firing and eventually expires',()=>{
 const s=newGame(chosen('pea'));s.sun=10000;
 assert.ok(plantHere(s,2,2,'pea'));
 spawn(s,2,'normal',1100);s.skyTimer=1e7;s.spawnTimer=1e7;
 for(let i=0;i<14;i++)tick(s,.05);
 const p=s.grid[2][2];
 assert.ok(p.attackFx>0,'shot recoil not triggered');
 assert.ok(s.bullets.length>0,'projectile not fired');
 for(let i=0;i<7;i++)tick(s,.05);
 assert.equal(p.attackFx,0);
 const restored=restoreSnapshot(makeSnapshot(s));
 assert.equal(restored.grid[2][2].attackFx,0);
});
test('zombie bites cause temporary hurt animation and preserve it across save',()=>{
 const s=newGame(chosen('wall'));s.sun=10000;
 assert.ok(plantHere(s,2,6,'wall'));
 const x=BOARD.x+(6+.5)*BOARD.cw;
 spawn(s,2,'normal',x);
 s.skyTimer=1e7;s.spawnTimer=1e7;
 tick(s,.05);
 const p=s.grid[2][6];
 assert.ok(p.hurtFx>0);
 const restored=restoreSnapshot(makeSnapshot(s));
 assert.ok(restored.grid[2][6].hurtFx>0);
 for(let i=0;i<7;i++)tick(s,.05);
 assert.equal(p.hurtFx,0);
});

test('high-tier fusion shield durability above 4000 survives save/load',()=>{
 const s=newGame(chosen('prism-armor'));
 s.sun=10000000;
 assert.equal(plantHere(s,1,1,'prism-armor'),true);
 const before=s.grid[1][1].cover;
 assert.equal(before,5200);
 const restored=restoreSnapshot(makeSnapshot(s));
 assert.equal(restored.grid[1][1].cover,5200);
});
