import {SEEDS,RECIPES,getPlant,createPlant} from './model.js';
import {newGame,ZOMBIE_TYPES} from './engine.js';

export const SAVE_VERSION=1;
export const SAVE_PREFIX='pvzxc.endless.v1.';
export const SAVE_SLOTS=['auto','slot1','slot2','slot3'];
const number=(value,defaultValue=0,min=-1e7,max=1e7)=>typeof value==='number'&&Number.isFinite(value)?Math.min(max,Math.max(min,value)):defaultValue;
const integer=(value,defaultValue=0,min=0,max=1e7)=>Math.round(number(value,defaultValue,min,max));
const clonePlain=(value)=>JSON.parse(JSON.stringify(value));
const safeId=(slot)=>SAVE_SLOTS.includes(slot)?slot:null;
function asObject(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
function worldPlant(p){
 if(!p||!getPlant(p.id))return null;
 const base=createPlant(p.id,Array.isArray(p.parts)?p.parts.filter(id=>typeof id==='string').slice(0,8):[p.id]);
 for(const key of Object.keys(base)){
  if(key==='parts'||key==='id'||key==='name'||key==='icon')continue;
  if(typeof base[key]==='number'){
   base[key]=number(p[key],base[key],0,1e8);
  }else if(typeof base[key]==='string'&&typeof p[key]==='string')base[key]=p[key];
 }
 base.hp=number(p.hp,base.hp,1,base.maxHp);
 base.cover=number(p.cover,0,0,4000);
 return base;
}
function worldZombie(z,index){
 if(!z||typeof z.type!=='string'||!ZOMBIE_TYPES[z.type])return null;
 const spec=ZOMBIE_TYPES[z.type];
 return {...asObject(z),id:integer(z.id,index),type:z.type,row:integer(z.row,0,0,4),
  x:number(z.x,1400,-100,1700),y:0,hp:number(z.hp,spec.hp,-1e4,1e7),
  maxHp:number(z.maxHp,spec.hp,1,1e7),speed:number(z.speed,spec.speed,0,200),
  attack:number(z.attack,spec.attack,0,1e4),period:number(z.period,spec.period,.2,30),
  armor:number(z.armor,0,0,2e4),biting:number(z.biting,0,-1,30),
  slow:number(z.slow,0,0,100),frozen:number(z.frozen,0,0,30),
  burn:number(z.burn,0,0,100),poison:number(z.poison,0,0,100),
  specialTimer:number(z.specialTimer,2,-5,60),anim:number(z.anim,0,0,1e7),
  charmed:!!z.charmed,airborne:!!z.airborne,dead:false};
}
function projectile(b){
 const copy={...asObject(b)};
 copy.hit=Array.from(b?.hit||[]).filter(x=>Number.isInteger(x)).slice(0,150);
 copy.torchCells=Array.from(b?.torchCells||[]).filter(x=>Number.isInteger(x)).slice(0,9);
 if(copy.hitSun?.owner){
  copy.hitSun={row:integer(copy.hitSun.row,0,0,4),col:integer(copy.hitSun.col,0,0,8),each:integer(copy.hitSun.each,3,1,50)};
 }
 return copy;
}
function restoreProjectile(b){
 const copy={...asObject(b)};
 copy.hit=new Set(Array.isArray(b.hit)?b.hit:[]);
 copy.torchCells=new Set(Array.isArray(b.torchCells)?b.torchCells:[]);
 if(!Number.isFinite(copy.range))copy.range=Infinity;
 return copy;
}
export function makeSnapshot(s,now=Date.now()){
 if(!s||s.mode!=='endless')throw new Error('无效的无尽模式状态');
 const source={
  mode:'endless',phase:s.phase==='lost'?'lost':'playing',
  t:s.t,sun:s.sun,grid:s.grid,zombies:s.zombies,
  bullets:s.bullets.slice(0,600).map(projectile),
  suns:s.suns.slice(0,200),mowers:s.mowers,
  craters:s.craters,graves:s.graves||[],iceTrails:s.iceTrails||[],coins:s.coins,cooldowns:s.cooldowns,
  kills:s.kills,spawnCount:s.spawnCount,spawnTimer:s.spawnTimer,skyTimer:s.skyTimer,
  wave:s.wave,waveClock:s.waveClock,flags:s.flags,uid:s.uid,solved:Array.from(s.solved),
  totalSuns:s.totalSuns,page:s.page,lastPlanted:s.lastPlanted,record:s.record,
  quickRecipe:s.quickRecipe,selected:s.selected
 };
 return {version:SAVE_VERSION,savedAt:now,state:clonePlain(source)};
}
export function restoreSnapshot(snapshot){
 if(!snapshot||snapshot.version!==SAVE_VERSION||!snapshot.state||snapshot.state.mode!=='endless')
  throw new Error('存档格式不受支持');
 const raw=asObject(snapshot.state),s=newGame();
 if(!Array.isArray(raw.grid)||raw.grid.length!==5||raw.grid.some(r=>!Array.isArray(r)||r.length!==9))
  throw new Error('存档草坪结构无效');
 s.grid=raw.grid.map(row=>row.map(worldPlant));
 s.zombies=(Array.isArray(raw.zombies)?raw.zombies:[]).slice(0,400).map(worldZombie).filter(Boolean);
 for(const z of s.zombies)z.y=188+(z.row+.55)*108;
 s.bullets=(Array.isArray(raw.bullets)?raw.bullets:[]).slice(0,600).map(restoreProjectile).filter(b=>typeof b.x==='number'&&typeof b.y==='number');
 for(const b of s.bullets)if(b.hitSun){
  const owner=s.grid[b.hitSun.row]?.[b.hitSun.col];
  b.hitSun=owner?{owner,each:integer(b.hitSun.each,3,1,50)}:null;
 }
 s.suns=(Array.isArray(raw.suns)?raw.suns:[]).slice(0,200).map(asObject);
 s.mowers=Array.isArray(raw.mowers)&&raw.mowers.length===5?raw.mowers.map(Boolean):Array(5).fill(true);
 s.craters=(Array.isArray(raw.craters)?raw.craters:[]).slice(0,45).map(asObject).filter(c=>number(c.life,0)>0);
 s.graves=(Array.isArray(raw.graves)?raw.graves:[]).slice(0,20).map(asObject).filter(g=>Number.isInteger(g.row)&&g.row>=0&&g.row<5&&Number.isInteger(g.col)&&g.col>=0&&g.col<9);
 s.iceTrails=(Array.isArray(raw.iceTrails)?raw.iceTrails:[]).slice(0,100).map(asObject).filter(t=>number(t.life,0)>0);
 s.coins=number(raw.coins,0,0,1e9);
 const cooldowns=asObject(raw.cooldowns);
 s.cooldowns=Object.fromEntries(SEEDS.map(p=>[p.id,number(cooldowns[p.id],0,0,120)]));
 s.sun=number(raw.sun,500,0,1e9);s.t=number(raw.t,0,0,1e9);
 s.kills=integer(raw.kills);s.spawnCount=integer(raw.spawnCount);
 s.spawnTimer=number(raw.spawnTimer,4,-1,50);s.skyTimer=number(raw.skyTimer,8,-1,30);
 s.wave=integer(raw.wave,1,1,1e7);s.waveClock=number(raw.waveClock,0,0,3600);
 s.flags=integer(raw.flags);s.uid=integer(raw.uid,1);
 s.totalSuns=integer(raw.totalSuns);s.page=integer(raw.page,0,0,Math.ceil(SEEDS.length/7)-1);
 s.lastPlanted=getPlant(raw.lastPlanted)?.id||null;
 s.quickRecipe=RECIPES.some(recipe=>recipe.id===raw.quickRecipe)?raw.quickRecipe:null;
 s.selected=getPlant(raw.selected)?.id||null;
 if(s.selected&&!SEEDS.some(seed=>seed.id===s.selected)&&s.selected!==s.quickRecipe)s.selected=null;
 s.record=integer(raw.record,s.wave,0);s.solved=new Set((Array.isArray(raw.solved)?raw.solved:[]).filter(x=>RECIPES.some(r=>r.id===x)));
 s.phase=raw.phase==='lost'?'lost':'playing';s.paused=false;s.hover=null;
 s.message='存档已载入 · 第 '+s.wave+' 波';s.messageLeft=4;
 return s;
}
export function saveGame(s,slot='slot1',storage=globalThis.localStorage){
 if(!safeId(slot))throw new Error('无效存档槽位');
 const snapshot=makeSnapshot(s);
 storage.setItem(SAVE_PREFIX+slot,JSON.stringify(snapshot));
 return snapshot;
}
export function loadGame(slot='slot1',storage=globalThis.localStorage){
 if(!safeId(slot))throw new Error('无效存档槽位');
 const raw=storage.getItem(SAVE_PREFIX+slot);
 if(!raw)return null;
 try{return restoreSnapshot(JSON.parse(raw));}
 catch(error){throw new Error('存档读取失败：'+error.message);}
}
export function listSaves(storage=globalThis.localStorage){
 return SAVE_SLOTS.map(slot=>{
  try{
   const raw=storage.getItem(SAVE_PREFIX+slot);
   if(!raw)return {slot,exists:false};
   const snap=JSON.parse(raw);
   return {slot,exists:snap.version===SAVE_VERSION,savedAt:snap.savedAt,
    wave:snap.state?.wave||1,kills:snap.state?.kills||0,phase:snap.state?.phase||'playing'};
  }catch{return {slot,exists:false,invalid:true};}
 });
}
export function deleteSave(slot,storage=globalThis.localStorage){
 if(!safeId(slot))throw new Error('无效存档槽位');
 storage.removeItem(SAVE_PREFIX+slot);
}
