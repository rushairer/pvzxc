import {CLASSIC_ZOMBIES} from './classic.js';
const rand=(arr)=>arr[Math.floor(Math.random()*arr.length)];
function plot(s,z,color,count=8){
 for(let i=0;i<count;i++){
  const a=Math.random()*6.283,speed=30+Math.random()*110;
  s.effects.push({x:z.x,y:z.y-60,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-30,life:.3+Math.random()*.45,size:2+Math.random()*4,color});
 }
}
function protectedByUmbrella(s,row,col,getPlant){
 for(let r=Math.max(0,row-1);r<=Math.min(4,row+1);r++)
  for(let c=Math.max(0,col-1);c<=Math.min(8,col+1);c++){
   const p=s.grid[r][c];
   if(p&&getPlant(p.id)?.umbrella)return true;
  }
 return false;
}
export function applySpecialZombie(s,z,dt,{BOARD,spawn,getPlant,particles}){
 const spec=CLASSIC_ZOMBIES[z.type];
 if(!spec||z.charmed||z.hp<=0)return false;
 z.specialTimer=(z.specialTimer??3)-dt;
 z.jumpAnimation=Math.max(0,(z.jumpAnimation||0)-dt);
 if(spec.yeti&&z.specialTimer<=0){
  z.fleeing=true;z.speed=-Math.abs(z.baseSpeed||z.speed)*1.25;
 }
 if(spec.submerged){
  z.submerged=z.x>BOARD.x+90&&!z.frozen;
 }
 const col=Math.floor((z.x-BOARD.x)/BOARD.cw);
 const nearby=col>=0&&col<9?s.grid[z.row][col]:null;
 const center=BOARD.x+(col+.5)*BOARD.cw;
 // Pole-vaulters and pogo jumpers bypass their first obstacle.
 if((spec.jump||spec.pogo)&&nearby&&Math.abs(z.x-center)<68&&z.jumpAnimation<=0&&(!z.jumped||spec.pogo)){
  if(spec.pogo){
   if(getPlant(nearby.id)?.tall||nearby.id==='tallnut'){z.jumped=true;}
   else{z.x-=BOARD.cw*.86;z.jumpAnimation=.65;return true;}
  }else if(!z.jumped){z.jumped=true;z.x-=BOARD.cw*.84;z.speed*=.66;z.jumpAnimation=.65;return true;}
 }
 if(spec.ladder&&nearby&&Math.abs(z.x-center)<58&&!z.jumped){
  if((nearby.hp||0)>=1000){z.jumped=true;z.x-=BOARD.cw*.75;plot(s,z,'#d4b98b');return true;}
 }
 // Diggers travel beneath plants until near home, then turn around.
 if(spec.digger){
  if(!z.returning&&z.x<BOARD.x+60){z.returning=true;z.x+=40;z.y-=8;z.airborne=false;plot(s,z,'#a9ad9d');}
  if(!z.returning){z.x-=z.speed*1.3*dt;return true;}
  z.speed=-Math.abs(z.speed);
 }
 if(spec.summon&&z.specialTimer<=0&&z.summoned<8){
  const neighbor=rand([-1,0,1]);const row=Math.max(0,Math.min(4,z.row+neighbor));
  spawn(s,row,'backup',z.x+Math.random()*60);z.summoned++;z.specialTimer=spec.summon;
  plot(s,z,'#e1a5d1');
 }
 if(spec.garg&&z.hp<z.maxHp*.55&&!z.thrown){
  z.thrown=true;spawn(s,z.row,'imp',Math.max(BOARD.x+90,z.x-220));plot(s,z,'#f2c1aa',20);
 }
 if(spec.jack&&z.specialTimer<=0){
  z.hp=0;const targets=s.grid[z.row];
  for(let c=0;c<9;c++){
   const p=targets[c];if(p&&Math.abs(BOARD.x+(c+.5)*BOARD.cw-z.x)<BOARD.cw*1.5)p.hp-=1800;
  }
  for(const other of s.zombies)if(other.id!==z.id&&Math.hypot(other.x-z.x,(other.row-z.row)*110)<160)other.hp-=500;
  s.shake=11;plot(s,z,'#ff9d50',32);return true;
 }
 if(spec.catapult&&z.specialTimer<=0){
  const choices=[];for(let c=0;c<9;c++)if(s.grid[z.row][c]&&
    !protectedByUmbrella(s,z.row,c,getPlant))choices.push(c);
  if(choices.length){
   const targetCol=rand(choices),p=s.grid[z.row][targetCol];
   if(p.cover>0)p.cover-=120;
   else p.hp-=120;
   particles(s,BOARD.x+(targetCol+.5)*BOARD.cw,BOARD.y+(z.row+.55)*BOARD.ch-35,'#d6bda0',10);
  }
  z.specialTimer=4.5;
 }
 if(spec.bungee){
  if(z.specialTimer<=0){
   const candidates=[];for(let r=0;r<5;r++)for(let c=0;c<9;c++)if(s.grid[r][c]&&!protectedByUmbrella(s,r,c,getPlant))candidates.push({r,c});
   if(candidates.length){
    const cell=rand(candidates);s.grid[cell.r][cell.c]=null;
    particles(s,BOARD.x+(cell.c+.5)*BOARD.cw,BOARD.y+(cell.r+.55)*BOARD.ch,'#f6d982',18);
   }
   z.hp=0;return true;
  }
  return true;
 }
 if(spec.zomboni){
  z.iceDamage=(z.iceDamage||0)+dt;
  if(z.iceDamage>.8){z.iceDamage=0;
   const c=Math.floor((z.x-BOARD.x)/BOARD.cw);
   if(c>=0&&c<9&&s.grid[z.row][c])s.grid[z.row][c]=null;
   s.iceTrails??=[];
   s.iceTrails.push({row:z.row,x:z.x,life:32});
  }
 }
 if(spec.boss&&z.specialTimer<=0){
  const row=Math.floor(Math.random()*5);
  if(Math.random()<.65){
   spawn(s,row,rand(['cone','bucket','football','imp']),z.x+35);
  }else{
   for(let c=0;c<9;c++)if(s.grid[row][c]&&Math.random()<.32)s.grid[row][c].hp-=220;
   s.screenFlash=.5;
  }
  z.specialTimer=4;
 }
 if(spec.newspaper&&z.armor<=0)z.speed=30;
 return false;
}
export function pickEndlessEnemy(wave){
 const pool=['normal','normal','normal','flag','cone','newspaper'];
 if(wave>=2)pool.push('pole','screen','ducky','backup','dancer');
 if(wave>=3)pool.push('bucket','balloon','pogo','football','snorkel','jack','dolphin');
 if(wave>=4)pool.push('digger','ladder','catapult','zomboni','bobsled','bungee');
 if(wave>=5)pool.push('garg','imp','yeti');
 if(wave>=7)pool.push('football','garg','jack','bungee');
 return rand(pool);
}
