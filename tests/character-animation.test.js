import test from 'node:test';
import assert from 'node:assert/strict';
import {plantPose,zombiePose,ZOMBIE_DEATH_DURATION} from '../src/animation.js';
import {BOARD,newGame,spawn,plantHere,tick} from '../src/engine.js';
import {makeSnapshot,restoreSnapshot} from '../src/save.js';
import {DEFAULT_DECK} from '../src/deck.js';

function quiet(s){s.spawnTimer=1e8;s.skyTimer=1e8;}
const approx=(a,b,epsilon=1e-7)=>Math.abs(a-b)<epsilon;

test('living plants breathe and attack with a planted-foot pivot',()=>{
 const p={id:'pea',age:0,attackFx:0,hurtFx:0};
 const a=plantPose(p,0),b=plantPose({...p,age:1.4},1.4);
 assert.ok(!approx(a.angle,b.angle)||!approx(a.y,b.y));
 const attack=plantPose({...p,attackFx:.3},0);
 assert.ok(attack.x<a.x);
 assert.ok(attack.scaleX>a.scaleX);
 const hurt=plantPose({...p,hurtFx:.26},.13);
 assert.ok(hurt.hurt>0);
 assert.ok(Object.values(hurt).every(x=>Number.isFinite(x)));
});
test('reduced-motion animation preserves combat states without idle sway',()=>{
 const p=plantPose({id:'pea',age:4},2,true);
 assert.equal(p.angle,0);
 assert.equal(p.y,0);
 const z=zombiePose({type:'normal',anim:4,hitFx:0},3,true);
 assert.equal(z.x,0);assert.equal(z.y,0);assert.equal(z.angle,0);
});
test('zombie gait, eating, freezing, bite, hurt and death poses differ',()=>{
 const walking=zombiePose({type:'normal',anim:.34},.34);
 const later=zombiePose({type:'normal',anim:.70},.70);
 assert.ok(walking.walking);
 assert.ok(!approx(walking.angle,later.angle));
 const frozen=zombiePose({type:'normal',anim:.34,frozen:2},.34);
 assert.equal(frozen.walking,false);
 assert.equal(frozen.angle,0);
 const eating=zombiePose({type:'normal',anim:.34,eating:true,biteFx:.3},.34);
 assert.equal(eating.walking,false);
 assert.ok(eating.x<0&&eating.angle<0);
 const hurt=zombiePose({type:'normal',anim:.34,hitFx:.26},.13);
 assert.ok(hurt.hit>0);
 const dying=zombiePose({type:'normal',anim:1,deathElapsed:ZOMBIE_DEATH_DURATION*.6},1);
 assert.ok(dying.death>.5&&dying.angle<-.2);
 const gone=zombiePose({type:'normal',deathElapsed:ZOMBIE_DEATH_DURATION},1);
 assert.equal(gone.opacity,0);
});
test('every zombie type receives a finite valid animation pose',()=>{
 const types=['normal','flag','cone','bucket','football','garg','zomboss','digger','balloon'];
 for(const type of types){
  for(const state of [{anim:3},{anim:3,eating:true,biteFx:.2},{anim:3,slow:3},{anim:3,frozen:2},{anim:3,deathElapsed:.4}]){
   const pose=zombiePose({type,...state},3.4);
   assert.ok(Object.values(pose).every(x=>typeof x==='boolean'||Number.isFinite(x)),type);
   assert.ok(pose.opacity>=0&&pose.opacity<=1);
  }
 }
});
test('dead enemies animate briefly without changing combat counts or save format',()=>{
 const s=newGame();quiet(s);
 spawn(s,2,'normal',700);
 s.zombies[0].hp=0;
 tick(s,.05);
 assert.equal(s.zombies.length,0);
 assert.equal(s.deadZombies.length,1);
 assert.equal(s.kills,1);
 assert.ok(s.deadZombies[0].deathElapsed===0);
 const snapshot=makeSnapshot(s);
 assert.equal(snapshot.state.deadZombies,undefined);
 const saved=restoreSnapshot(snapshot);
 assert.equal(saved.zombies.length,0);
 assert.equal(saved.deadZombies.length,0);
 s.paused=true;tick(s,.05);
 assert.equal(s.deadZombies[0].deathElapsed,0);
 s.paused=false;
 for(let i=0;i<18;i++)tick(s,.05);
 assert.equal(s.deadZombies.length,0);
 assert.equal(s.kills,1);
});
test('zombies trigger actual bite animation and stop when plant is gone',()=>{
 const s=newGame(DEFAULT_DECK);quiet(s);s.sun=10000;
 assert.ok(plantHere(s,2,4,'wall'));
 const x=BOARD.x+(4+.5)*BOARD.cw;
 spawn(s,2,'normal',x);
 tick(s,.05);
 const z=s.zombies[0];
 assert.equal(z.eating,true);
 assert.ok(z.biteFx>0);
 const health=s.grid[2][4].hp;
 assert.ok(health<s.grid[2][4].maxHp);
 assert.ok(s.grid[2][4].hurtFx>0);
 s.grid[2][4]=null;
 tick(s,.05);
 assert.equal(z.eating,false);
});
test('zombie movement and transient effects restore from a saved battle',()=>{
 const s=newGame();quiet(s);
 spawn(s,1,'normal',1100);
 const z=s.zombies[0];
 z.hitFx=.26;z.biteFx=.24;z.anim=1.25;
 const restored=restoreSnapshot(makeSnapshot(s));
 const copy=restored.zombies[0];
 assert.equal(copy.hitFx,.26);
 assert.equal(copy.biteFx,.24);
 assert.equal(copy.anim,1.25);
 tick(restored,.05);
 assert.ok(copy.hitFx<.26);
 assert.ok(copy.anim>1.25);
});
