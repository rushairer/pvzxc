import test from 'node:test';
import assert from 'node:assert/strict';
import {SEEDS,RECIPES,getPlant,recipeFor,createPlant,fusionKey,unlockedSeeds} from '../src/model.js';
import {BOARD,LEVELS,newGame,plantHere,collectAt,spawn,tick} from '../src/engine.js';
import {drawScene} from '../src/render.js';

test('six core day plants have wiki-matched anchor statistics',()=>{
 assert.equal(SEEDS.length,6);
 assert.equal(getPlant('pea').cost,100);
 assert.equal(getPlant('pea').damage,20);
 assert.equal(getPlant('pea').interval,1.5);
 assert.equal(getPlant('sun').cost,50);
 assert.equal(getPlant('sun').sun,25);
 assert.equal(getPlant('sun').sunInterval,25);
 assert.equal(getPlant('wall').hp,4000);
 assert.equal(getPlant('wall').cooldown,30);
 assert.equal(getPlant('cherry').explosion.damage,1800);
 assert.equal(getPlant('cherry').cooldown,50);
});
test('fusion graph has no ambiguous input combinations',()=>{
 const keys=RECIPES.map(r=>fusionKey(...r.inputs));
 assert.equal(keys.length,new Set(keys).size);
 for(const recipe of RECIPES){
  const [a,b]=recipe.inputs;
  assert.equal(recipeFor(a,b)?.id,recipe.id);
  assert.equal(recipeFor(b,a)?.id,recipe.id);
  assert.ok(getPlant(recipe.id));
 }
 assert.equal(recipeFor('pea','sun').name,'豌豆向日葵');
 assert.equal(recipeFor('pea','pea').name,'双发射手');
 assert.equal(recipeFor('repeater','repeater').name,'机枪射手');
});
test('advancing fusion does not mutate base plant catalog',()=>{
 const p=createPlant(recipeFor('repeater','pea'),['pea','pea','pea']);
 assert.equal(p.id,'split-pea');
 assert.equal(p.hp,300);
 assert.equal(getPlant('pea').damage,20);
});
test('first level restricts seeds, later level unlocks base deck',()=>{
 assert.equal(unlockedSeeds(1).length,2);
 assert.equal(unlockedSeeds(5).length,6);
 assert.equal(LEVELS.length,5);
});
test('planting and repeated plant fusion consume correct sun',()=>{
 const s=newGame(5);
 s.sun=700;
 assert.ok(plantHere(s,2,1,'pea'));
 assert.equal(s.sun,600);
 s.cooldowns.pea=0;
 assert.ok(plantHere(s,2,1,'pea'));
 assert.equal(s.grid[2][1].id,'repeater');
 s.cooldowns.pea=0;
 assert.ok(plantHere(s,2,1,'pea'));
 assert.equal(s.grid[2][1].id,'split-pea');
 assert.equal(s.sun,400);
 assert.equal(s.solved.size,2);
});
test('invalid recipes preserve sun and existing plant',()=>{
 const s=newGame(5);
 plantHere(s,0,0,'potato');
 const before=s.sun;
 s.cooldowns.potato=0;
 assert.equal(plantHere(s,0,0,'potato'),false);
 assert.equal(s.sun,before);
});
test('projectiles can kill zombies and victory remains deterministic',()=>{
 const s=newGame(5);
 s.sun=999;
 plantHere(s,0,8,'pea');
 spawn(s,0,'normal',BOARD.x+BOARD.w+20);
 s.spawnTimer=9999;s.skyTimer=9999;
 for(let i=0;i<2200;i++)tick(s,.05);
 assert.ok(s.kills>=1);
});
test('sun collection increases balance',()=>{
 const s=newGame(2);
 const amount=25,x=400,y=300;
 s.suns.push({x,y,target:y,amount,life:10,phase:0});
 assert.equal(collectAt(s,x,y),true);
 assert.equal(s.sun,200);
 assert.equal(s.suns.length,0);
});
test('canvas render function is exported for browser use',()=>{
 assert.equal(typeof drawScene,'function');
});

test('real render path completes without Canvas exceptions',()=>{
 const methods=new Set(['beginPath','roundRect','fill','stroke','arc','ellipse','moveTo','lineTo','strokeRect','fillRect','clearRect','save','restore','translate','scale','rotate','fillText']);
 const ctx=new Proxy({},{
   get(obj,key){
     if(key==='createLinearGradient')return()=>({addColorStop(){}});
     if(methods.has(key))return()=>{};
     return obj[key];
   },
   set(obj,key,value){obj[key]=value;return true;}
 });
 const options={BOARD,SEEDS,RECIPES,LEVELS,best:1,getPlant,recipeFor};
 const s=newGame(5);s.sun=999;
 plantHere(s,2,2,'pea');spawn(s,2,'normal',1200);tick(s,.1);
 assert.doesNotThrow(()=>drawScene(ctx,s,options));
 assert.doesNotThrow(()=>drawScene(ctx,null,options));
});

test('zombies cannot move in paused game',()=>{
 const s=newGame(1);spawn(s,0,'normal',900);s.paused=true;
 tick(s,1);assert.equal(s.zombies[0].x,900);
});
