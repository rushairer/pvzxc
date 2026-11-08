/**
 * Hand-painted-look Canvas embellishment layer.
 * This is original procedural art, not imported copyrighted sprites.
 * Paints atmospheric shading, organic strokes, highlights and subtle
 * controlled animation on the existing individual plant and enemy silhouettes.
 */
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,fill,rotation=0){
 c.beginPath();c.ellipse(x,y,rx,ry,rotation,0,TAU);c.fillStyle=fill;c.fill();
}
function stroke(c,points,colour,width=2){
 c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);
 c.strokeStyle=colour;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();
}
function glow(c,x,y,r,col0,col1){
 const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col0);g.addColorStop(1,col1);
 oval(c,x,y,r,r,g);
}
function plantSurface(c,spec,time){
 const age=typeof time==='number'?time:0;
 const phase=Math.sin(age*2.7)*1.8;
 // Physically attached contact shadow / light rim rather than free-floating badge.
 const base=c.createRadialGradient(0,-23,3,0,-23,80);
 base.addColorStop(0,'#ffffe522');base.addColorStop(.7,'#f5f7d500');base.addColorStop(1,'#405e2a00');
 oval(c,0,-35,49,75,base);
 c.save();c.globalCompositeOperation='screen';
 oval(c,-22,-67+phase,10,25,'#ffffff20',-.32);
 oval(c,-7,-93+phase,20,7,'#fff7ca18',-.28);
 c.restore();
 const p=spec||{};
 if(p.freezeHit||p.freezeAura){
  glow(c,1,-64+phase,49,'#9fe9ff2b','#b8e5ff00');
  for(let i=0;i<4;i++){
   const x=-36+(i*24),y=-38-(i%2)*37+phase;
   stroke(c,[[x-4,y],[x+4,y]],'#dffcff75',2);
   stroke(c,[[x,y-5],[x,y+5]],'#dffcff75',2);
  }
 }
 if(p.burn||p.burnAura||p.torchBonus){
  glow(c,17,-83+phase,42,'#ffbb5037','#e27b2600');
  for(let i=0;i<3;i++){
   const x=i*18-9,y=-90+Math.sin(age*3+i)*7;
   oval(c,x,y,3.8,11,i%2?'#ff9e4e88':'#ffdf8375',-.17);
  }
 }
 if(p.poison||p.poisonAura||p.garlic){
  for(let i=0;i<3;i++){
   const x=(i-1)*26+Math.sin(age*2+i)*3;
   oval(c,x,-88-i*6+phase,5,7,'#9ddd8f8a');
   oval(c,x-1,-90-i*6+phase,2,2,'#ffffff77');
  }
 }
 if(p.sun){
  glow(c,0,-82+phase,51,'#f7dd6a2a','#f7dd6a00');
  for(let i=0;i<5;i++){
   let a=i*TAU/5+age*.25;
   oval(c,Math.cos(a)*38,-72+Math.sin(a)*24+phase,2,3,'#ffe09c8e');
  }
 }
 if(p.magnet){
  const a=age*1.4;
  for(let i=0;i<3;i++){
   let x=Math.cos(a+i*TAU/3)*35,y=-61+Math.sin(a+i*TAU/3)*23;
   oval(c,x,y,4,3,'#d7eff0a0');
  }
 }
 if(p.armor||p.defensive||p.hp>=4000){
  stroke(c,[[-27,-22],[-31,-41],[-27,-65]],'#f6e6ac42',3);
  stroke(c,[[22,-29],[26,-46],[21,-61]],'#2e3d2c65',3);
 }
}
export function finishPlantArt(c,p,time=0){
 c.save();
 plantSurface(c,p,time);
 c.restore();
}
export function plantContactShadow(c,x,y,scale=1,level=1){
 c.save();
 const r=35*scale*(level>2?1.18:1);
 const g=c.createRadialGradient(x,y,2,x,y,r);
 g.addColorStop(0,'#1a3720b0');g.addColorStop(.47,'#24412577');g.addColorStop(1,'#15321b00');
 oval(c,x,y,r,r*.42,g);
 c.restore();
}
export function paintZombieSurface(c,z,time=0){
 c.save();
 const wobble=Math.sin(time*4+(z.anim||0))*1.8;
 const g=c.createLinearGradient(-33,-180,34,-60);
 g.addColorStop(0,'#d7e9bc16');g.addColorStop(.38,'#ffffff00');g.addColorStop(1,'#26322d55');
 c.beginPath();c.ellipse(0,-116,39,75,-.05,0,TAU);c.fillStyle=g;c.fill();
 stroke(c,[[-28,-105],[-20,-91],[-24,-76]],'#b0c5a35a',3);
 stroke(c,[[7,-95],[13,-74],[10,-55]],'#302f3266',2);
 // Frayed cloth folds, stitches and torn jacket edges.
 for(let i=0;i<4;i++){
  let x=-18+i*11,y=-48-(i%2)*5;
  stroke(c,[[x,y],[x+2,y+8]],'#b0a38c8f',2);
 }
 stroke(c,[[-19,-94],[-3,-75],[19,-104]],'#c5b59a55',3);
 oval(c,-14,-147+wobble,6,7,'#e9f8d02a');
 oval(c,13,-130+wobble,4,3,'#dff8ca30');
 if(z.hp<z.maxHp*.5){
  stroke(c,[[-22,-164],[-13,-158],[-18,-147]],'#4d4f4899',2);
  stroke(c,[[15,-88],[2,-79],[17,-67]],'#9c655c88',3);
 }
 if(z.armor>0){
  oval(c,-4,-179,21,5,'#eef7e633');
  stroke(c,[[-25,-174],[-20,-168]],'#ffffff8a',2);
 }
 if(z.frozen>0){glow(c,0,-121,68,'#a6e9ff2d','#b6e6ff00');}
 if(z.charmed){glow(c,0,-123,66,'#ddaaff25','#bdb2ff00');}
 c.restore();
}
export function paintWorldAtmosphere(c,t,board){
 c.save();
 const drift=Math.sin(t*.24);
 const haze=c.createLinearGradient(0,board.y,0,board.y+board.h);
 haze.addColorStop(0,'#fff7c00c');
 haze.addColorStop(.2,'#ffffff00');
 haze.addColorStop(.75,'#203a1914');
 haze.addColorStop(1,'#18271324');
 c.fillStyle=haze;c.fillRect(board.x,board.y,board.w,board.h);
 for(let i=0;i<12;i++){
  const x=board.x+(i*263+82)%board.w+Math.sin(t*.34+i)*4;
  const y=board.y+(i*71+13)%board.h+drift*3;
  oval(c,x,y,1.5,2,'#fff7c039');
 }
 c.restore();
}
