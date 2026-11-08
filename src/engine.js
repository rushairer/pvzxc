import {SEEDS,RECIPES,getPlant,recipeFor,createPlant,unlockedSeeds} from './model.js';
export const BOARD={x:184,y:188,w:1053,h:540,rows:5,cols:9,cw:117,ch:108};
export const LEVELS=[
  {name:'草坪序章',intro:'先用向日葵积攒阳光，再用豌豆射手守住草坪。',waves:3,length:115,initialSun:150,spawn:11,zombieMax:1},
  {name:'草坪融合',intro:'将植物种到其他植物上，体验真正的双发与产光融合。',waves:4,length:145,initialSun:175,spawn:9,zombieMax:2},
  {name:'坚果前线',intro:'坚果抵御尸潮；结合豌豆射手可得到坚果射手。',waves:4,length:165,initialSun:200,spawn:8,zombieMax:3},
  {name:'樱桃风暴',intro:'樱桃炸弹会立即引爆。注意冷却时间与资源。',waves:5,length:175,initialSun:200,spawn:7.2,zombieMax:3},
  {name:'融合试炼',intro:'利用全部六种基础植物和多级融合抵挡大波僵尸。',waves:5,length:185,initialSun:250,spawn:6.4,zombieMax:4}
];
export const ZOMBIE_TYPES={
  normal:{name:'普通僵尸',hp:270,speed:19,attack:100,period:1.0},
  cone:{name:'路障僵尸',hp:640,speed:19,attack:100,period:1.0},
  bucket:{name:'铁桶僵尸',hp:1370,speed:19,attack:100,period:1.0},
  runner:{name:'路障快跑僵尸',hp:270,speed:30,attack:100,period:1.0}
};
let seedIndex=1;
function rnd(a,b){return a+Math.random()*(b-a);}
export function newGame(level=1,freeMode=false){
 const def=LEVELS[Math.max(0,Math.min(LEVELS.length-1,level-1))];
 return {level,def,freeMode,phase:'playing',paused:false,t:0,sun:freeMode?1000:def.initialSun,
  grid:Array.from({length:5},()=>Array(9).fill(null)), zombies:[],bullets:[],suns:[],effects:[],mowers:Array(5).fill(true),
  decks:unlockedSeeds(level,freeMode),cooldowns:{},selected:null,shovel:false,hover:null,
  kills:0,spawnCount:0,spawnTimer:9,skyTimer:8,wave:1,flags:0,message:def.intro,messageLeft:6,
  shake:0,uid:0,winTimer:0,totalSuns:0,solved:new Set(),pendingGameOver:false};
}
export function message(s,t,seconds=2.8){s.message=t;s.messageLeft=seconds;}
function center(r,c){return{x:BOARD.x+(c+.5)*BOARD.cw,y:BOARD.y+(r+.55)*BOARD.ch};}
export function addSun(s,x,y,amount=25,sky=false){
 s.suns.push({id:seedIndex++,x,y:sky?-30:y-22,target:y,amount,life:11,phase:rnd(0,5)});
}
export function particles(s,x,y,color='#fee48e',count=12){
 for(let i=0;i<count;i++){let a=rnd(0,Math.PI*2),speed=rnd(35,130);
 s.effects.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-30,life:rnd(.3,.8),color,size:rnd(2,6)});}
}
export function plantHere(s,row,col,id){
 if(s.phase!=='playing'||s.paused)return false;
 if(row<0||row>4||col<0||col>8)return false;
 const cur=s.grid[row][col];
 if(s.shovel){
   if(!cur)return false;
   s.grid[row][col]=null;s.shovel=false;message(s,'植物已移除');return true;
 }
 const item=getPlant(id);
 if(!item||!s.decks.some(x=>x.id===id))return false;
 if(s.cooldowns[id]>0){message(s,'植物尚在冷却');return false;}
 if(s.sun<item.cost){message(s,'阳光不足');return false;}
 const fusion=cur?recipeFor(cur.id,id):null;
 if(cur&&!fusion){message(s,'这两种植物没有对应融合配方',3);return false;}
 const created=createPlant(fusion||item,cur?[...cur.parts,id]:[id]);
 if(fusion){
   // Fusion inherits the surviving existing plant's damage and planting age only where appropriate.
   s.solved.add(fusion.id);
   message(s,'融合成功：'+fusion.name,3);
 }
 s.grid[row][col]=created;s.sun-=item.cost;s.cooldowns[id]=item.cooldown;
 const {x,y}=center(row,col);particles(s,x,y-26,fusion?'#ffe17a':'#d0ef84',fusion?22:8);
 return true;
}
export function collectAt(s,x,y){
 for(let i=s.suns.length-1;i>=0;i--){
  const u=s.suns[i];
  if(Math.hypot(u.x-x,u.y-y)<44){
   s.sun+=u.amount;s.totalSuns+=u.amount;s.suns.splice(i,1);particles(s,x,y,'#ffdd62',6);return true;
  }
 }
 return false;
}
export function spawn(s,row,type='normal',x=1418){
 const spec=ZOMBIE_TYPES[type]||ZOMBIE_TYPES.normal;
 s.zombies.push({id:s.uid++,row,x,y:BOARD.y+(row+.55)*BOARD.ch,type,hp:spec.hp,maxHp:spec.hp,speed:spec.speed,
  attack:spec.attack,period:spec.period,biting:0,slow:0,burn:0,dead:false,anim:rnd(0,6)});
}
function boom(s,x,y,damage,radius){
 for(const z of s.zombies)if(!z.dead&&Math.hypot(z.x-x,(z.y-y)*1.22)<radius*BOARD.cw){z.hp-=damage;}
 particles(s,x,y,'#fcb04e',28);s.shake=12;
}
function removePlant(s,r,c,p){
 const {x,y}=center(r,c),spec=getPlant(p.id);
 if(spec.sunOnDeath)addSun(s,x,y-23,spec.sunOnDeath);
 if(spec.onDeathExplosion)boom(s,x,y,spec.onDeathExplosion.damage,spec.onDeathExplosion.radius);
 particles(s,x,y,'#c4dc88',10);s.grid[r][c]=null;
}
function shoot(s,p,spec,row,col){
 const {x,y}=center(row,col);let count=spec.shots||1;
 for(let k=0;k<count;k++){
  s.bullets.push({x:x+37-(count>2?k%2*8:0),y:y-25+(k-(count-1)/2)*14,row,
   damage:spec.damage,life:4.5,speed:315,icon:spec.icon,through:!!spec.pierce,
   hit:new Set(),splash:spec.splash,hitSun:spec.hitSunEvery?{owner:p,each:spec.hitSunEvery}:null});
 }
 if(spec.backShot)s.bullets.push({x:x-26,y:y-20,row,damage:20,life:3.8,speed:-280,icon:'pea',hit:new Set()});
}
function zombieCanBeEaten(z){return !z.dead&&z.hp>0;}
function updatePlant(s,p,r,c,dt){
 const spec=getPlant(p.id),{x,y}=center(r,c);
 if(!spec)return;
 p.age+=dt;
 if(spec.sun){
  p.sunTimer-=dt;
  if(p.sunTimer<=0){
   const num=Math.max(1,Math.floor(spec.sun/25));
   for(let n=0;n<num;n++)addSun(s,x+(n-(num-1)/2)*24,y-45,25);
   p.sunTimer+=spec.sunInterval||25;
  }
 }
 if(spec.explosion){
  p.fuseTimer-=dt;
  if(p.fuseTimer<=0){
   boom(s,x,y,spec.explosion.damage,spec.explosion.radius);
   if(spec.explosion.sunOnHit){
    const within=s.zombies.filter(z=>Math.hypot(z.x-x,(z.y-y)*1.22)<spec.explosion.radius*BOARD.cw);
    for(const z of within)addSun(s,z.x,z.y-55,spec.explosion.sunOnHit);
   }
   s.grid[r][c]=null;return;
  }
 }
 if(spec.mine&&p.age>=spec.mine.arm){
  const enemy=s.zombies.find(z=>!z.dead&&z.row===r&&Math.abs(z.x-x)<43);
  if(enemy){
   boom(s,x,y,spec.mine.damage,spec.mine.radius);
   if(spec.sunOnExplode)addSun(s,x,y-40,spec.sunOnExplode);
   s.grid[r][c]=null;return;
  }
 }
 if(spec.chomp){
  p.digestTimer=Math.max(0,p.digestTimer-dt);
  if(p.digestTimer===0){
   const enemy=s.zombies.find(z=>zombieCanBeEaten(z)&&z.row===r&&z.x>=x-14&&z.x<x+spec.chomp.range*BOARD.cw);
   if(enemy){enemy.hp=0;p.digestTimer=spec.chomp.digest;
    if(spec.sunOnChomp)addSun(s,x,y-40,spec.sunOnChomp);
    if(spec.onChompExplosion)boom(s,enemy.x,enemy.y,spec.onChompExplosion.damage,spec.onChompExplosion.radius);
    particles(s,enemy.x,enemy.y-30,'#a6d95d',12);
   }
  }
 }
 if(spec.damage){
  p.fireTimer-=dt;
  if(p.fireTimer<=0){
   const target=s.zombies.some(z=>!z.dead&&z.row===r&&(z.x>x+8||spec.backShot&&z.x<x));
   if(target){shoot(s,p,spec,r,c);p.fireTimer=(spec.interval||1.5)*(spec.accelerateNear?.7:1);}
   else p.fireTimer=0;
  }
 }
}
function advanceProjectiles(s,dt){
 for(const b of s.bullets){
  b.x+=b.speed*dt;b.life-=dt;
  for(const z of s.zombies){
   if(z.dead||z.hp<=0||z.row!==b.row||b.hit.has(z.id))continue;
   if(Math.abs(z.x-b.x)>22||Math.abs(z.y-b.y)>58)continue;
   b.hit.add(z.id);z.hp-=b.damage;particles(s,b.x,b.y,'#c3dc7b',4);
   if(b.splash)boom(s,z.x,z.y,b.splash.damage,b.splash.radius);
   if(b.hitSun){b.hitSun.owner.shotsHit++;if(b.hitSun.owner.shotsHit%b.hitSun.each===0)addSun(s,z.x,z.y-38,5);}
   if(!b.through){b.life=-1;break;}
  }
 }
 s.bullets=s.bullets.filter(b=>b.life>0&&b.x>70&&b.x<1480);
}
function advanceZombies(s,dt){
 for(const z of s.zombies){
  if(z.hp<=0)continue;
  z.anim+=dt;z.slow=Math.max(0,z.slow-dt);
  const c=Math.floor((z.x-BOARD.x)/BOARD.cw);
  const plant=c>=0&&c<9?s.grid[z.row][c]:null;
  const px=BOARD.x+(c+.5)*BOARD.cw;
  if(plant&&Math.abs(z.x-px)<49){
   z.biting-=dt;
   if(z.biting<=0){
    const was=plant.hp,now=plant.hp-z.attack;
    plant.hp=now;z.biting=z.period;
    const spec=getPlant(plant.id);
    if(spec.sunOnCrack&&Math.floor(was/(plant.maxHp/4))>Math.floor(Math.max(0,now)/(plant.maxHp/4))){
      addSun(s,px,z.y-55,spec.sunOnCrack);
    }
    if(plant.hp<=0)removePlant(s,z.row,c,plant);
   }
  }else{z.biting=0;z.x-=z.speed*(z.slow>0?.5:1)*dt;}
  if(z.x<BOARD.x-30&&s.mowers[z.row]){
   s.mowers[z.row]=false;s.shake=16;
   for(const other of s.zombies)if(other.row===z.row)other.hp=0;
   message(s,'第 '+(z.row+1)+' 行割草机启动！',3);
  }else if(z.x<BOARD.x-96&&!s.mowers[z.row]){
   s.phase='lost';message(s,'僵尸吃掉了你的脑子！');
  }
 }
 const alive=[];
 for(const z of s.zombies){
  if(z.hp<=0){s.kills++;particles(s,z.x,z.y-35,'#889f7b',8);}
  else alive.push(z);
 }
 s.zombies=alive;
}
function spawnWave(s){
 if(s.t>s.def.length)return;
 const stage=Math.floor(s.t/(s.def.length/s.def.waves));
 const row=Math.floor(rnd(0,5)),roll=Math.random();
 const type=stage>=3&&roll<.15?'bucket':stage>=1&&roll<.46?'cone':stage>=2&&roll<.55?'runner':'normal';
 spawn(s,row,type);
 if(stage>=2&&Math.random()<.27)spawn(s,Math.floor(rnd(0,5)),'normal',1470);
 s.spawnCount++;
 s.spawnTimer=Math.max(2.8,s.def.spawn-stage*.55)+rnd(-1,1.5);
}
export function tick(s,dt){
 if(!s||s.phase!=='playing'||s.paused)return;
 dt=Math.min(.05,Math.max(0,dt));s.t+=dt;s.messageLeft=Math.max(0,s.messageLeft-dt);
 s.shake=Math.max(0,s.shake-dt*27);
 for(const p of s.decks)s.cooldowns[p.id]=Math.max(0,(s.cooldowns[p.id]||0)-dt);
 s.skyTimer-=dt;
 if(s.skyTimer<=0){addSun(s,rnd(BOARD.x+45,BOARD.x+BOARD.w-45),rnd(BOARD.y+70,BOARD.y+BOARD.h-30),25,true);s.skyTimer=rnd(7,11);}
 const newWave=Math.min(s.def.waves,1+Math.floor(s.t/(s.def.length/s.def.waves)));
 if(newWave>s.wave){s.wave=newWave;s.flags++;message(s,'一大波僵尸正在接近！',3.3);s.shake=5;}
 s.spawnTimer-=dt;if(s.spawnTimer<=0)spawnWave(s);
 for(let r=0;r<5;r++)for(let c=0;c<9;c++){const p=s.grid[r][c];if(p)updatePlant(s,p,r,c,dt);}
 advanceProjectiles(s,dt);advanceZombies(s,dt);
 for(const u of s.suns){u.phase+=dt*4;u.y+=Math.min(Math.max(0,u.target-u.y),dt*75);u.life-=dt;}
 s.suns=s.suns.filter(u=>u.life>0);
 for(const p of s.effects){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=190*dt;p.life-=dt;}
 s.effects=s.effects.filter(p=>p.life>0);
 if(s.t>=s.def.length&&s.zombies.length===0){s.winTimer+=dt;if(s.winTimer>.8)s.phase='won';}
}
