import {SEEDS,RECIPES,getPlant,recipeFor,createPlant,unlockedSeeds} from './model.js';
export const BOARD={x:184,y:188,w:1053,h:540,rows:5,cols:9,cw:117,ch:108};
import {CLASSIC_ZOMBIES} from './classic.js';
import {applySpecialZombie,pickEndlessEnemy} from './zombie-special.js';
export const ENDLESS={name:'融合无尽',initialSun:500,waveDuration:34,initialSpawn:9,minimumSpawn:1.25};
export const ZOMBIE_TYPES=CLASSIC_ZOMBIES;
export const ZOMBIE_IDS=Object.freeze(Object.keys(CLASSIC_ZOMBIES));
let seedIndex=1;
function rnd(a,b){return a+Math.random()*(b-a);}
export function newGame(){
 return {mode:'endless',phase:'playing',paused:false,t:0,sun:ENDLESS.initialSun,
  grid:Array.from({length:5},()=>Array(9).fill(null)),zombies:[],bullets:[],suns:[],effects:[],
  mowers:Array(5).fill(true),craters:[],coins:0,screenFlash:0,windLeft:0,
  decks:unlockedSeeds(),cooldowns:{},selected:null,shovel:false,hover:null,page:0,lastPlanted:null,
  kills:0,spawnCount:0,spawnTimer:9,skyTimer:8,wave:1,flags:0,message:'无尽融合开始！49种植物与全部配方已开放。',messageLeft:5,
  shake:0,uid:0,totalSuns:0,solved:new Set(),waveClock:0,record:0,failed:false};
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
 if(s.craters.some(k=>k.row===row&&k.col===col&&k.life>0)){message(s,'弹坑尚未恢复，无法种植！');return false;}
 if(s.shovel){
   if(!cur)return false;
   s.grid[row][col]=null;s.shovel=false;message(s,'植物已移除');return true;
 }
 const item=getPlant(id);
 if(!item||!s.decks.some(x=>x.id===id))return false;
 if(s.cooldowns[id]>0){message(s,'植物尚在冷却');return false;}
 if(s.sun<item.cost){message(s,'阳光不足');return false;}
 const fusion=cur?recipeFor(cur.id,id):null;
 if(id==='pumpkin'&&cur){
   const max=4000;
   if(cur.cover>=max){message(s,'南瓜护甲已经完好');return false;}
   cur.cover=max;s.sun-=item.cost;s.cooldowns[id]=item.cooldown;
   const {x,y}=center(row,col);particles(s,x,y,'#ffba6c',18);
   message(s,'南瓜护甲装配完成');return true;
 }
 if(cur?.id==='puff'&&id==='puff'&&cur.stacks<3){
  cur.stacks++;s.cooldowns[id]=item.cooldown;message(s,'小喷菇密植 '+cur.stacks+'/3');return true;
 }
 if(cur&&!fusion){message(s,'这两种植物没有对应融合配方',3);return false;}
 const created=createPlant(fusion||item,cur?[...cur.parts,id]:[id]);
 if(fusion){
   // Fusion inherits the surviving existing plant's damage and planting age only where appropriate.
   s.solved.add(fusion.id);
   message(s,'融合成功：'+fusion.name,3);
 }
 s.grid[row][col]=created;s.sun-=item.cost;s.cooldowns[id]=item.cooldown;
 const {x,y}=center(row,col);particles(s,x,y-26,fusion?'#ffe17a':'#d0ef84',fusion?22:8);
 if((fusion||item).onPlantRowFire)for(let rr=Math.max(0,row-1);rr<=Math.min(4,row+1);rr++)rowFire(s,rr,300);
 
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
 const actualRow=Math.min(4,Math.max(0,Math.trunc(row)));
 s.zombies.push({id:s.uid++,row:actualRow,x,y:BOARD.y+(actualRow+.55)*BOARD.ch,type,
  hp:spec.hp,maxHp:spec.hp,speed:spec.speed,baseSpeed:spec.speed,
  airborne:!!spec.airborne,charmed:false,armor:spec.armor||0,attack:spec.attack,period:spec.period,
  biting:0,slow:0,burn:0,dead:false,anim:rnd(0,6),specialTimer:spec.bungee?.5:spec.summon?4:spec.catapult?2.6:3,
  jumped:false,returning:false,thrown:false,summoned:0,iceDamage:0,shield:!!spec.shield});
}
function rowFire(s,row,damage){
 for(const z of s.zombies)if(z.row===row&&z.hp>0)z.hp-=damage;
 for(let i=0;i<30;i++)particles(s,BOARD.x+i*BOARD.w/30,BOARD.y+(row+.52)*BOARD.ch,'#ffad45',2);
 s.shake=6;
}
function boom(s,x,y,damage,radius){
 for(const z of s.zombies)if(!z.dead&&Math.hypot(z.x-x,(z.y-y)*1.22)<radius*BOARD.cw){z.hp-=damage;}
 particles(s,x,y,'#fcb04e',28);s.shake=12;
}
function removePlant(s,r,c,p){
 const {x,y}=center(r,c),spec=getPlant(p.id);
 if(spec.sunOnDeath)addSun(s,x,y-23,spec.sunOnDeath);
 if(spec.onDeathExplosion)boom(s,x,y,spec.onDeathExplosion.damage,spec.onDeathExplosion.radius);
 if(spec.deathRowFire)rowFire(s,r,600);
 particles(s,x,y,'#c4dc88',10);s.grid[r][c]=null;
}
function shoot(s,p,spec,row,col){
 const {x,y}=center(row,col),count=spec.shots||1;
 const rows=spec.triple?[row-1,row,row+1].filter(r=>r>=0&&r<BOARD.rows):[row];
 for(const targetRow of rows)for(let k=0;k<count;k++){
  const origin=x+35-(count>2?k%2*8:0);
  s.bullets.push({x:origin,originX:origin,y:y-24+(targetRow-row)*BOARD.ch+(k-(count-1)/2)*12,row:targetRow,
   damage:spec.damage,life:4.6,speed:spec.lob?290:325,icon:spec.icon,
   through:!!(spec.pierce||spec.spray),range:spec.range?spec.range*BOARD.cw:Infinity,
   freezeHit:spec.freezeHit||0,burn:spec.burn||0,spore:!!spec.spore,
   hit:new Set(),torchCells:new Set(),splash:spec.splash,lob:!!spec.lob,antiAir:!!spec.antiAir,
   butterChance:spec.butterChance||0,butterDamage:spec.butterDamage||0,butterStun:spec.butterStun||0,
   poison:spec.poison||0,
   hitSun:spec.hitSunEvery?{owner:p,each:spec.hitSunEvery}:null});
 }
 if(spec.backShot)s.bullets.push({x:x-26,y:y-20,row,damage:20,life:3.8,speed:-280,icon:'pea',hit:new Set()});
}
function fireStars(s,p,spec,row,col){
 const {x,y}=center(row,col);
 const directions=[[-1,0],[0,-1],[0,1],[.76,-.65],[.76,.65]];
 if(spec.frontal)directions.push([1,0]);
 for(const [dx,dy] of directions){
  const speed=290;
  s.bullets.push({x:x+dx*18,y:y-28+dy*15,originX:x,originY:y-28,
   speed:speed*dx,vy:speed*dy,damage:spec.damage,life:5.8,icon:spec.icon,
   star:true,freezeHit:spec.freezeHit||0,through:false,hit:new Set(),torchCells:new Set()});
 }
 particles(s,x,y-40,'#ffe589',4);
}
function createCrater(s,x,y,duration){
 const col=Math.floor((x-BOARD.x)/BOARD.cw),row=Math.floor((y-BOARD.y)/BOARD.ch);
 if(row<0||row>=BOARD.rows||col<0||col>=BOARD.cols)return;
 s.craters=s.craters.filter(k=>k.row!==row||k.col!==col);
 s.craters.push({row,col,life:duration});
}
function charmZombie(s,z){
 z.charmed=true;z.airborne=false;z.type=z.type==='bucket'||z.type==='cone'?z.type:'normal';
 z.frozen=0;z.slow=0;z.biting=0;
 particles(s,z.x,z.y-85,'#f1a0ff',24);
}
function zombieCanBeEaten(z){return !z.dead&&z.hp>0&&!z.charmed;}
function updatePlant(s,p,r,c,dt){
 const spec=getPlant(p.id),{x,y}=center(r,c);
 if(!spec)return;
 p.age+=dt;
 if(spec.coinProduction){
  p.coinTimer-=dt;
  if(p.coinTimer<=0){
   const rarity=Math.random(),value=rarity<.04?100:rarity<.25?25:5;
   s.coins+=value;s.sun+=value===100?50:value===25?15:5;
   particles(s,x,y-56,value===100?'#b5eaff':'#ffe578',12);
   p.coinTimer+=spec.coinProduction.interval;
  }
 }
 if(spec.magnet){
  p.magnetTimer-=dt;
  if(p.magnetTimer<=0){
   const z=s.zombies.find(z=>!z.charmed&&z.hp>0&&z.armor>0&&
     Math.hypot(z.x-x,(z.row-r)*BOARD.ch)<spec.magnet.range*BOARD.cw);
   if(z){
    z.hp-=z.armor;z.armor=0;z.type='normal';particles(s,z.x,z.y-129,'#c0e0f0',24);
    message(s,'磁力菇吸走了金属防具！',1.5);
    p.magnetTimer=spec.magnet.interval;
   }else p.magnetTimer=1;
  }
 }
 if(spec.proximityDoom){
  if(s.zombies.some(z=>!z.charmed&&z.hp>0&&z.row===r&&Math.abs(z.x-x)<BOARD.cw)){
   boom(s,x,y,spec.proximityDoom.damage,spec.proximityDoom.radius);
   s.grid[r][c]=null;return;
  }
 }
 if(spec.miniSquash){
  p.miniTimer-=dt;
  if(p.miniTimer<=0){
   const z=s.zombies.find(z=>!z.charmed&&z.hp>0&&z.row===r&&Math.abs(z.x-x)<spec.miniSquash.range*BOARD.cw);
   if(z){z.hp-=spec.miniSquash.damage;particles(s,z.x,z.y-30,'#b5ec7b',14);p.miniTimer=spec.miniSquash.interval;}
   else p.miniTimer=.3;
  }
 }
 if(spec.sun){
  p.sunTimer-=dt;
  if(p.sunTimer<=0){
   const num=Math.max(1,Math.floor(spec.sun/25));
   for(let n=0;n<num;n++)addSun(s,x+(n-(num-1)/2)*24,y-45,25);
   p.sunTimer+=spec.sunInterval||25;
  }
 }
 if(spec.instant){
   p.instantTimer-=dt;
   if(p.instantTimer<=0){
     if(spec.instant.kind==='ice')for(const z of s.zombies){z.hp-=spec.instant.damage;z.frozen=Math.max(z.frozen||0,spec.instant.freeze);z.slow=Math.max(z.slow,spec.instant.chill);}
     if(spec.instant.kind==='row'){
       const targets=s.zombies.filter(z=>z.row===r&&z.hp>0);
       rowFire(s,r,spec.instant.damage);
       if(spec.instant.sunOnHit)for(const z of targets)addSun(s,z.x,z.y-40,spec.instant.sunOnHit);
     }
     if(spec.instant.kind==='doom'||spec.instant.kind==='ice-doom'){
       boom(s,x,y,spec.instant.damage,spec.instant.radius||3.7);
       if(spec.instant.kind==='ice-doom')for(const z of s.zombies){
        z.frozen=Math.max(z.frozen||0,spec.instant.freeze||4);z.slow=Math.max(z.slow,8);
       }
       if(spec.instant.crater)createCrater(s,x,y,spec.instant.crater);
       s.screenFlash=1;s.shake=20;
     }
     if(spec.instant.kind==='wind'){
       for(const z of s.zombies)if(z.airborne){z.hp=0;particles(s,z.x,z.y-108,'#baf1f6',22);}
       s.windLeft=2.5;particles(s,x,y-40,'#aee9e7',26);
     }
     particles(s,x,y,'#b5eef7',24);s.grid[r][c]=null;return;
   }
 }
 if(spec.squash){
   const enemy=s.zombies.find(z=>z.hp>0&&z.row===r&&Math.abs(z.x-x)<spec.squash.range*BOARD.cw);
   if(enemy){p.squashWindup+=dt;if(p.squashWindup>.55){boom(s,enemy.x,y,spec.squash.damage,spec.squash.radius);
     if(spec.sunOnExplode)addSun(s,x,y-38,spec.sunOnExplode);
     s.grid[r][c]=null;return;}}
   else p.squashWindup=0;
 }
 if(spec.spike){
   p.spikeTimer=(p.spikeTimer??0)-dt;
   if(p.spikeTimer<=0){const hits=s.zombies.filter(z=>z.hp>0&&z.row===r&&Math.abs(z.x-x)<BOARD.cw*.52);
   for(const z of hits){z.hp-=spec.spike.damage;particles(s,z.x,z.y-15,'#c6e36b',2);}
   if(hits.length)p.spikeTimer=spec.spike.interval;
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
   const afraid=spec.scaredy&&s.zombies.some(z=>!z.charmed&&z.hp>0&&
     Math.abs(z.row-r)<=1&&Math.abs(z.x-x)<BOARD.cw*1.5);
   const target=spec.star
    ? s.zombies.some(z=>z.hp>0&&!z.charmed)
    : s.zombies.some(z=>!z.dead&&!z.charmed&&
      (spec.triple?Math.abs(z.row-r)<=1:z.row===r)&&
      (z.x>x+8||spec.backShot&&z.x<x)&&
      (!spec.range||z.x<x+spec.range*BOARD.cw)&&(!z.airborne||spec.antiAir));
   if(!afraid&&target){
    if(spec.star)fireStars(s,p,spec,r,c);
    else shoot(s,p,spec,r,c);
    p.fireTimer=(spec.interval||1.5)*(spec.accelerateNear?.7:1);
   }else p.fireTimer=0;
  }
 }
}
function advanceProjectiles(s,dt){
 for(const b of s.bullets){
  b.x+=b.speed*dt;
  if(b.star)b.y+=(b.vy||0)*dt;
  b.life-=dt;
  if(b.range!==undefined&&Math.abs(b.x-b.originX)>b.range)b.life=-1;
  if(b.y<BOARD.y-60||b.y>BOARD.y+BOARD.h+60)b.life=-1;
  if(b.life<=0)continue;
  for(let c=0;c<BOARD.cols&&!b.star;c++){
   const p=s.grid[b.row][c],spec=p&&getPlant(p.id),tx=BOARD.x+(c+.5)*BOARD.cw;
   if(!spec?.torchBonus||b.torchCells.has(c)||b.speed<=0||b.icon.includes('ice'))continue;
   if(b.x>=tx-7&&b.x<=tx+22){b.torchCells.add(c);b.damage+=spec.torchBonus;
     b.splash??={damage:Math.round(b.damage*.25),radius:.6};b.icon='fire-pea';particles(s,b.x,b.y,'#ffb84f',6);}
  }
  for(const z of s.zombies){
   if(z.dead||z.hp<=0||z.charmed||(!b.star&&z.row!==b.row)||b.hit.has(z.id))continue;
   if(z.airborne&&!b.antiAir&&!b.star)continue;
   const hit=b.star?Math.hypot(z.x-b.x,(z.y-38)-b.y)<35
    :Math.abs(z.x-b.x)<22&&Math.abs(z.y-b.y)<58;
   if(!hit)continue;
   b.hit.add(z.id);z.hp-=b.damage;
   if(b.butterChance&&Math.random()<b.butterChance){z.hp-=b.butterDamage;z.frozen=Math.max(z.frozen||0,b.butterStun);z.butter=Math.max(z.butter||0,b.butterStun);particles(s,z.x,z.y-100,'#ffe883',12);}
   if(b.poison)z.poison=Math.max(z.poison||0,b.poison);
   if(b.freezeHit){z.slow=Math.max(z.slow,3.5);z.frost=(z.frost||0)+b.freezeHit;if(z.frost>=100){z.frozen=Math.max(z.frozen||0,2);z.frost=0;}}
   if(b.burn)z.burn=Math.max(z.burn,b.burn);
   particles(s,b.x,b.y,b.freezeHit?'#b5f2ff':b.burn?'#ffbb54':'#c3dc7b',4);
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
  if(applySpecialZombie(s,z,dt,{BOARD,spawn,getPlant,particles}))continue;
  z.anim+=dt;z.slow=Math.max(0,z.slow-dt);z.frozen=Math.max(0,(z.frozen||0)-dt);
  z.butter=Math.max(0,(z.butter||0)-dt);
  if(z.burn>0){z.hp-=7*dt;z.burn=Math.max(0,z.burn-dt);}
  if(z.poison>0){z.hp-=6*dt;z.poison=Math.max(0,z.poison-dt);}
  if(z.hp<=0)continue;
  if(z.charmed){
   const enemy=s.zombies.find(other=>!other.charmed&&other.hp>0&&other.row===z.row&&Math.abs(other.x-z.x)<44);
   if(enemy){
    z.biting-=dt;
    if(z.biting<=0){enemy.hp-=z.attack;z.biting=z.period;}
   }else z.x+=z.speed*dt;
   if(z.x>BOARD.x+BOARD.w+170)z.hp=0;
   continue;
  }
  const c=Math.floor((z.x-BOARD.x)/BOARD.cw);
  const plant=c>=0&&c<9?s.grid[z.row][c]:null;
  const px=BOARD.x+(c+.5)*BOARD.cw;
  if(z.frozen>0)continue;
  if(plant&&!getPlant(plant.id)?.low&&!z.airborne&&Math.abs(z.x-px)<49){
   z.biting-=dt;
   if(z.biting<=0){
    const spec=getPlant(plant.id);
    const hit=spec.garlic?Math.min(15,z.attack):z.attack;
    if(plant.cover>0){
     plant.cover=Math.max(0,plant.cover-hit);
     particles(s,px,z.y-45,'#ffac5d',4);
    }else{
     const was=plant.hp;
     plant.hp-=hit;
     if(spec.hypno){charmZombie(s,z);plant.hp=0;}
     if(spec.sunOnCrack&&Math.floor(was/(plant.maxHp/4))>Math.floor(Math.max(0,plant.hp)/(plant.maxHp/4)))
      addSun(s,px,z.y-55,spec.sunOnCrack);
     if(plant.hp<=0)removePlant(s,z.row,c,plant);
    }
    z.biting=z.period;
    if(spec.garlic&&!z.charmed){
     const newRow=z.row===0?1:z.row===BOARD.rows-1?BOARD.rows-2:z.row+(Math.random()<.5?-1:1);
     z.row=newRow;z.y=BOARD.y+(newRow+.55)*BOARD.ch;z.x+=20;
     particles(s,z.x,z.y-48,'#e9c394',6);
    }
   }
  }else{z.biting=0;z.x-=z.speed*(z.slow>0?.5:1)*dt;}
  if(z.x<BOARD.x-30&&s.mowers[z.row]&&!z.charmed){
   s.mowers[z.row]=false;s.shake=16;
   for(const other of s.zombies)if(other.row===z.row)other.hp=0;
   message(s,'第 '+(z.row+1)+' 行割草机启动！',3);
  }else if(z.x<BOARD.x-96&&!s.mowers[z.row]&&!z.charmed){
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
 const wave=s.wave;
 const count=Math.min(3,1+Math.floor(wave/4));
 const type=wave%10===0&&s.spawnCount>0&&s.spawnCount%12===0?'zomboss':pickEndlessEnemy(wave);
 const row=Math.floor(rnd(0,5));
 spawn(s,row,type);
 if(wave>=6&&Math.random()<Math.min(.48,wave*.025)){
  spawn(s,Math.floor(rnd(0,5)),pickEndlessEnemy(wave),1480);
 }
 if(wave>=10&&Math.random()<.14)spawn(s,row,'imp',1500);
 s.spawnCount++;
 const speedup=ENDLESS.initialSpawn*Math.pow(.97,Math.min(wave,90));
 s.spawnTimer=Math.max(ENDLESS.minimumSpawn,speedup)+rnd(-.2,1.1);
 if(wave%10===0&&s.spawnCount%12===0){
  spawn(s,row,'zomboss',1540);s.spawnTimer+=2;
 }
}
export function tick(s,dt){
 if(!s||s.phase!=='playing'||s.paused)return;
 dt=Math.min(.05,Math.max(0,dt));s.t+=dt;s.messageLeft=Math.max(0,s.messageLeft-dt);
 s.shake=Math.max(0,s.shake-dt*27);
 s.screenFlash=Math.max(0,s.screenFlash-dt*2.2);
 s.windLeft=Math.max(0,s.windLeft-dt);
 for(const crater of s.craters)crater.life-=dt;
 s.craters=s.craters.filter(crater=>crater.life>0);
 for(const p of s.decks)s.cooldowns[p.id]=Math.max(0,(s.cooldowns[p.id]||0)-dt);
 s.skyTimer-=dt;
 if(s.skyTimer<=0){addSun(s,rnd(BOARD.x+45,BOARD.x+BOARD.w-45),rnd(BOARD.y+70,BOARD.y+BOARD.h-30),25,true);s.skyTimer=rnd(7,11);}
 s.waveClock+=dt;
 const nextWave=1+Math.floor(s.t/ENDLESS.waveDuration);
 if(nextWave>s.wave){
  s.wave=nextWave;s.flags++;s.record=Math.max(s.record,s.wave);
  message(s,s.wave%10===0?'首领来袭！ 第 '+s.wave+' 波':'无尽尸潮 · 第 '+s.wave+' 波',3.5);
  s.shake=6;
  for(let r=0;r<5;r++)spawn(s,r,s.wave%10===0?'football':'flag',1470+r*26);
 }
 if(s.iceTrails){for(const trail of s.iceTrails)trail.life-=dt;s.iceTrails=s.iceTrails.filter(x=>x.life>0);}

 s.spawnTimer-=dt;if(s.spawnTimer<=0)spawnWave(s);
 for(let r=0;r<5;r++)for(let c=0;c<9;c++){const p=s.grid[r][c];if(p)updatePlant(s,p,r,c,dt);}
 advanceProjectiles(s,dt);advanceZombies(s,dt);
 for(const u of s.suns){u.phase+=dt*4;u.y+=Math.min(Math.max(0,u.target-u.y),dt*75);u.life-=dt;}
 s.suns=s.suns.filter(u=>u.life>0);
 for(const p of s.effects){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=190*dt;p.life-=dt;}
 s.effects=s.effects.filter(p=>p.life>0);
 if(s.phase==='lost')s.failed=true;
}
