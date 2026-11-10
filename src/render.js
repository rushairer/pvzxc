import {DECK_LAYOUT,seedAtPoint} from './deck.js';
import {drawThirdWavePlant,drawPumpkinCover} from './art3.js';
import {drawClassicPlant} from './classic-art.js';
import {paintFusionArt} from './fusion-art.js';
import {renderZombieAccessories} from './zombie-art.js';
import {finishPlantArt,plantContactShadow,paintZombieSurface,paintWorldAtmosphere} from './painterly.js';
import {drawZombieSprite} from './sprite-atlas.js';
import {drawPlantSprite,drawFusionSpriteParts} from './plant-sprites.js';
import {drawFusionPlantSprite} from './fusion-sprites.js';
import {drawFusionV8Sprite} from './fusion-sprites8.js';
import {drawFusionV9Sprite} from './fusion-sprites9.js';
const TAU=Math.PI*2;
function box(c,x,y,w,h,r=10,fill='#ffffff',stroke=null,lineWidth=1){
 c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=lineWidth;c.stroke();}
}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function oval(c,x,y,rx,ry,color,rotation=0){c.beginPath();c.ellipse(x,y,rx,ry,rotation,0,TAU);c.fillStyle=color;c.fill();}
function circle(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill();}
function line(c,pts,color,width=2){
 c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);
 c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();
}
function text(c,t,x,y,size=18,color='#f8eccb',weight='700',align='left'){
 c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;c.font=weight+' '+size+'px system-ui,"Microsoft YaHei",sans-serif';c.fillText(t,x,y);
}
function leaf(c,x,y,a,scale=1){
 c.save();c.translate(x,y);c.rotate(a);oval(c,15*scale,0,19*scale,9*scale,'#3e852b');
 oval(c,15*scale,-2*scale,12*scale,5*scale,'#7ab54a');c.restore();
}
function eyes(c,y,wide=1){
 oval(c,-11,y,6*wide,8,'#f6f1d7');oval(c,10,y,6*wide,8,'#f6f1d7');
 circle(c,-9,y,3,'#243627');circle(c,11,y,3,'#243627');
}
function peaHead(c,element,t){
 const cold=element==='ice',fire=element==='fire',potato=element==='potato';
 const base=cold?'#79c9d2':fire?'#dcb058':potato?'#c89a5d':'#82bd46';
 const dark=cold?'#3a9aaa':fire?'#c87b33':potato?'#996b40':'#4e8d32';
 oval(c,-9,-50+t,29,28,dark);
 oval(c,-13,-57+t,25,25,base);
 oval(c,19,-51+t,26,18,base);
 oval(c,36,-49+t,16,13,dark);
 oval(c,42,-51+t,10,8,base);
 circle(c,-16,-65+t,4.5,'#2e442b');
 circle(c,-14,-67+t,1.4,'#faffda');
 if(cold)for(let i=0;i<3;i++)line(c,[[-24+i*17,-80+t],[-20+i*17,-93+t],[-13+i*17,-82+t]],'#c6f7ff',4);
 if(fire)for(let i=0;i<3;i++)oval(c,-20+i*18,-89+t,6,12,i%2?'#ffea6d':'#f0783b');
}
function sunflower(c,x,y,small=false,bright=false){
 c.save();c.translate(x,y);const r=small?16:27;
 for(let k=0;k<11;k++){const a=k*TAU/11;oval(c,Math.cos(a)*r,Math.sin(a)*r,small?7:10,small?12:17,bright?'#f4d05b':'#e8ae45',a);}
 circle(c,0,0,r*.93,bright?'#ffdf73':'#e5a344');circle(c,0,0,r*.7,'#d89539');
 circle(c,-r*.3,-r*.12,2.8,'#5a3c25');circle(c,r*.32,-r*.12,2.8,'#5a3c25');
 line(c,[[-r*.24,r*.28],[0,r*.43],[r*.24,r*.28]],'#754d25',2);
 c.restore();
}
function nut(c,y,giant=false){
 c.save();c.translate(0,y);
 oval(c,0,-35,giant?42:35,giant?52:44,'#b78956');
 oval(c,-15,-52,13,8,'#d4a870');oval(c,20,-22,9,12,'#a97843');
 eyes(c,-43);
 line(c,[[-7,-24],[2,-28],[10,-23]],'#5e492f',3);
 c.restore();
}
function potato(c,t,ready){
 oval(c,0,-23+t,31,24,'#b99153');oval(c,7,-28+t,15,17,'#d5ae70');
 circle(c,-11,-30+t,3,'#4e3b29');circle(c,8,-30+t,3,'#4e3b29');
 oval(c,-15,-15+t,4,3,'#977045');oval(c,12,-11+t,4,3,'#977045');
 if(ready){for(let i=0;i<6;i++){const a=i*TAU/6;line(c,[[Math.cos(a)*33,-25+t+Math.sin(a)*24],[Math.cos(a)*42,-25+t+Math.sin(a)*34]],'#ffd66b',4);}}
}
function chomper(c,t){
 oval(c,-4,-56+t,38,35,'#6e4b96');oval(c,3,-44+t,34,23,'#714da5');
 oval(c,-7,-76+t,31,18,'#915fba');
 for(let i=0;i<5;i++){
  const xx=-34+i*15;
  line(c,[[xx,-62+t],[xx+6,-50+t]],'#fff1c7',5);
 }
 oval(c,20,-56+t,9,7,'#eb64a1');
 circle(c,-13,-87+t,6,'#fff6d8');circle(c,-11,-87+t,3,'#222c29');
}
function cherry(c,t){
 line(c,[[-15,-55+t],[-2,-78+t],[18,-58+t]],'#4d8637',5);
 circle(c,-17,-44+t,22,'#e95745');circle(c,17,-39+t,22,'#ba2a38');
 circle(c,-24,-51+t,6,'#ffac86');circle(c,10,-47+t,5,'#f97e75');
 circle(c,-19,-41+t,3,'#3b3029');circle(c,13,-38+t,3,'#3b3029');
}
function gradientOval(c,x,y,rx,ry,base,shine){
 c.save();
 const g=c.createRadialGradient(x-rx*.35,y-ry*.44,3,x,y,Math.max(rx,ry)*1.5);
 g.addColorStop(0,shine);g.addColorStop(.62,base);g.addColorStop(1,'#243b21');
 oval(c,x,y,rx,ry,g);c.restore();
}
function mushroom(c,icon,bob,age=20){
 const puff=icon.includes('puff')||icon.includes('shroom')||icon==='sun-shroom';
 const frozen=icon.includes('ice')||icon==='ice-shroom';
 const base=frozen?'#addbec':puff?'#aa9cd5':'#aa7bd0';
 const shade=frozen?'#65a7c9':puff?'#7668ae':'#755298';
 line(c,[[0,1],[0,-31+bob]],'#d7d3ad',puff?13:18);
 gradientOval(c,0,-43+bob,puff?28:39,puff?22:30,shade,base);
 oval(c,-10,-51+bob,puff?11:17,puff?7:10,'#ffffff65');
 oval(c,12,-44+bob,6,4,'#e9e1fc77');
 eyes(c,-21+bob,puff?.7:.9);
 if(icon.includes('ice'))for(let k=-1;k<=1;k++)line(c,[[k*16,-64+bob],[k*16+4,-82+bob]],'#d5fbff',4);
 if(icon.includes('sun'))sunflower(c,20,-60+bob,true,true);
 if(icon.includes('nut')||icon.includes('wall'))oval(c,-15,-26+bob,21,21,'#b78d57');
}
function pepper(c,bob){
 line(c,[[3,-78+bob],[11,-90+bob],[22,-88+bob]],'#3b8135',7);
 c.save();c.translate(0,-45+bob);c.rotate(-.17);
 gradientOval(c,0,0,24,43,'#d23d28','#ffb052');
 oval(c,-8,-15,5,12,'#ffc77b66');
 eyes(c,-9);line(c,[[-8,8],[0,12],[8,7]],'#793a26',3);
 c.restore();
 for(let i=0;i<3;i++)oval(c,22+i*5,-66-i*11+bob,4,7,'#f8b54b');
}
function squash(c,bob){
 gradientOval(c,0,-42+bob,37,39,'#75b349','#c7e17e');
 gradientOval(c,-22,-68+bob,18,21,'#75b349','#b9d977');
 oval(c,13,-72+bob,9,10,'#48843d');
 line(c,[[0,-77+bob],[5,-94+bob]],'#447a32',7);
 eyes(c,-49+bob);line(c,[[-12,-37+bob],[0,-35+bob],[12,-38+bob]],'#547e39',3);
}
function cabbage(c,bob,melon=false){
 line(c,[[-12,0],[-6,-44+bob]],'#4a8235',10);
 leaf(c,-14,-17,-2.4);
 gradientOval(c,0,-56+bob,melon?37:31,melon?35:28,melon?'#4a982c':'#6ab747',melon?'#b9ed6e':'#d2f08b');
 for(let i=-2;i<=2;i++){
  const dx=i*11;
  line(c,[[dx,-71+bob],[dx*1.2,-57+bob],[dx,-41+bob]],melon?'#43793266':'#5b983866',2.5);
 }
 eyes(c,-53+bob,.8);
 if(melon){for(let i=-1;i<=1;i++)circle(c,i*12,-79+bob,3,'#f8e8a0');}
}
function spikes(c,glow=false){
 for(let i=0;i<6;i++){
  const x=-36+i*14;
  c.beginPath();c.moveTo(x-8,-1);c.lineTo(x+1,-25-(i%2)*7);c.lineTo(x+10,-1);c.closePath();
  c.fillStyle=glow?'#d0c75a':'#9aa16c';c.fill();
  line(c,[[x+1,-20],[x+4,-8]],'#ffffff66',2);
 }
 if(glow)sunflower(c,0,-27,true,true);
}
function torch(c,bob,icy=false){
 oval(c,0,-38+bob,27,45,'#a47147');
 for(let i=-1;i<=1;i++)line(c,[[i*13,-65+bob],[i*10,-13+bob]],'#76462d',4);
 eyes(c,-41+bob);
 const g=c.createRadialGradient(0,-96+bob,2,0,-81+bob,45);
 g.addColorStop(0,'#fff3a0');g.addColorStop(.4,icy?'#bcf6ff':'#ffca57');g.addColorStop(1,'#ed6d3200');
 circle(c,0,-77+bob,44,g);
 for(let k=0;k<4;k++){
  const xx=(k-1.5)*12;
  oval(c,xx,-84+bob-(k%2)*12,9,23,icy?'#a9e7ff':'#ef812e');
 }
 oval(c,0,-78+bob,13,20,'#ffe2a2');
}
function highlightPlant(c,icon,bob){
 if(icon.includes('ice')){
  circle(c,22,-88+bob,13,'#b0eeff66');
  for(let i=0;i<4;i++){const a=i*TAU/4;line(c,[[22+Math.cos(a)*12,-88+bob+Math.sin(a)*12],[22+Math.cos(a)*20,-88+bob+Math.sin(a)*20]],'#daffff99',3);}
 }
 if(icon.includes('blaze')||icon.includes('fire')||icon.includes('torch')){
  oval(c,22,-89+bob,8,14,'#ffb34a');
  oval(c,23,-92+bob,4,8,'#ffe59c');
 }
}

function getPlantForArt(p){return p.spec||p;}
function paintPlant(c,p,x,y,scale=1,time=0){
 const icon=p.icon||'pea';
 c.save();c.translate(x,y);c.scale(scale,scale);
 const bob=Math.sin(time*2.4+x*.025)*2;
 oval(c,0,5,35,11,'#385c29bb');
 const low=p.low||icon.includes('spike')||icon==='puff'||icon==='potato';
 const isNut=icon.includes('wall')||icon.includes('nut');
 const isSun=icon==='sun'||icon==='twin'||icon==='pea-sun'||icon==='sun-cherry'||icon==='sun-wall'||icon==='sun-potato'||icon==='sun-chomper';
 const isChomper=icon.includes('chomper');
 const isCherry=icon.includes('cherry')&&!isChomper;
 const dedicated=drawFusionV9Sprite(c,p,time)||drawFusionV8Sprite(c,p,time)||drawFusionPlantSprite(c,p,time);
 if(dedicated){
  // A named high-tier fusion uses its own transparent illustration.
 }else if(drawPlantSprite(c,p,time)){
  // Transparent character illustration replaces the base form when loaded.
 }else if(drawClassicPlant(c,p.id,bob,p.age||time)||drawClassicPlant(c,icon,bob,p.age||time)){
  // Fully distinct portraits for classic seed types.
 }else if(drawThirdWavePlant(c,icon,bob,p.age||time)){
  // Third-wave plants have individual procedural high-resolution artwork.
 }else if(icon.includes('spike')||icon==='spikeweed'){
  spikes(c,icon.includes('solar'));
 }else if(icon.includes('puff')||icon==='fume'||icon==='ice-shroom'||icon==='sun-shroom'||icon.includes('shroom')){
  mushroom(c,icon,bob,p.age);
 }else if(icon==='jalapeno'||icon==='solar-jalapeno'){
  pepper(c,bob);if(icon==='solar-jalapeno')sunflower(c,-17,-91+bob,true,true);
 }else if(icon.includes('squash')){
  squash(c,bob);if(icon.includes('solar'))sunflower(c,24,-81+bob,true,true);
 }else if(icon.includes('torch')){
  torch(c,bob);
 }else if(icon.includes('cabbage')||icon==='melon'){
  cabbage(c,bob,icon==='melon');
 }else if(icon==='threepeater'||icon.includes('three')){
  line(c,[[0,3],[3,-48+bob]],'#3e852e',9);
  leaf(c,-20,-18,-2.4);leaf(c,12,-20,-.7);
  for(let k=-1;k<=1;k++){
   c.save();c.translate(k*4,k*24);c.scale(.76,.76);
   peaHead(c,icon.includes('ice')?'ice':icon.includes('charred')?'fire':'pea',bob);
   c.restore();
  }
 }else if(icon==='potato'||icon==='sun-potato'||icon==='cherry-potato'||icon==='pea-potato'||icon==='potato-chomper'){
  potato(c,bob,p.age>15);
 }else if(isNut){
  nut(c,bob,icon==='giant-wall');
 }else{
  line(c,[[0,4],[1,-23],[3,-52+bob]],'#31742e',9);
  leaf(c,-19,-10,-2.65);leaf(c,11,-17,-.5);
  if(icon==='sun'||icon==='twin'){
   const xs=icon==='twin'?[-19,20]:[0];
   xs.forEach(v=>sunflower(c,v,-61+bob,icon==='twin'));
  }else if(isChomper){
   chomper(c,bob);
  }else if(isCherry&&icon==='cherry'){
   cherry(c,bob);
  }else{
   peaHead(c,icon.includes('ice')?'ice':icon.includes('blaze')||icon==='cherry-pea'||icon==='super-cherry'?'fire':'pea',bob);
  }
 }
 if(!dedicated){
 if(icon==='sun-cherry'){circle(c,24,-80+bob,18,'#df4142');sunflower(c,-9,-68+bob,true);}
 else if(icon==='pea-sun'){sunflower(c,-27,-88+bob,true,true);}
 else if(icon==='sun-wall'){sunflower(c,0,-76+bob,true);}
 else if(icon==='sun-potato'){sunflower(c,0,-47+bob,true);}
 else if(icon==='sun-chomper'){sunflower(c,30,-79+bob,true);}
 else if(icon==='cherry-pea'||icon==='super-cherry'){circle(c,23,-88+bob,12,'#da4242');}
 else if(icon==='cherry-wall'){circle(c,0,-79+bob,12,'#d6463c');}
 else if(icon==='cherry-potato'){circle(c,19,-48+bob,11,'#d94036');}
 else if(icon==='pea-wall'){circle(c,24,-71+bob,14,'#7fbc44');}
 else if(icon==='pea-potato'){circle(c,0,-57+bob,11,'#70b549');}
 else if(icon==='pea-chomper'){circle(c,21,-83+bob,13,'#74bf48');}
 else if(icon==='cherry-chomper'){circle(c,24,-81+bob,10,'#e45d4a');}
 else if(icon==='potato-wall'){circle(c,24,-74+bob,10,'#ab7a48');}
 else if(icon==='wall-chomper'){circle(c,18,-78+bob,12,'#865baa');}
 else if(icon==='potato-chomper'){circle(c,-13,-65+bob,15,'#8a5ca4');}
 highlightPlant(c,icon,bob);
 }
 if(p.stacks>1)text(c,'×'+p.stacks,28,-16,22,'#fbf4b4','900','center');
 if(p.parts?.length>1&&!dedicated&&!drawFusionSpriteParts(c,p,time))paintFusionArt(c,p,time);
 finishPlantArt(c,{...p,...(getPlantForArt(p)||{})},time);
 c.restore();
}
function paintZombie(c,z,t){
 c.save();c.translate(z.x,z.y);let step=Math.sin(t*5+z.anim)*6;
 const hasIllustration=drawZombieSprite(c,z,t);
 if(!hasIllustration){
 oval(c,0,7,32,9,'#30492aa3');
 line(c,[[-11,-31],[-14+step,0]],'#464955',14);
 line(c,[[14,-31],[12-step,0]],'#464955',14);
 oval(c,-16+step,0,14,7,'#2f3033');oval(c,17-step,1,14,7,'#2f3033');
 box(c,-26,-99,54,69,9,'#574c43');
 line(c,[[-23,-83],[-39,-52]],'#879883',12);
 line(c,[[23,-83],[38,-66]],'#8d9a85',12);
 oval(c,-2,-128,29,35,'#8c9a7e');oval(c,7,-130,24,29,'#a9b79c');
 oval(c,-12,-137,8,10,'#f0efda');oval(c,10,-134,8,10,'#f0efda');
 circle(c,-9,-136,3,'#30322b');circle(c,13,-135,3,'#30322b');
 oval(c,8,-111,15,8,'#514535');
 for(let i=0;i<4;i++)box(c,1+i*7,-118,5,9,1,'#efe6ca');
 if(z.type==='cone'||z.type==='runner'){
  c.beginPath();c.moveTo(-30,-146);c.lineTo(0,-205);c.lineTo(30,-146);c.closePath();c.fillStyle='#e68d36';c.fill();
  box(c,-35,-151,70,10,4,'#d57d2f');line(c,[[-13,-178],[15,-178]],'#f5ecd0',6);
 }
 if(z.type==='bucket'){
  box(c,-29,-184,60,47,4,'#8fa1a5');box(c,-35,-184,70,11,4,'#c7d5cf');
  line(c,[[-21,-161],[21,-161]],'#5d7378',3);
 }
 if(z.type==='runner'){box(c,-27,-150,56,10,4,'#d34d3e');}
 if(z.type==='newspaper'){
  box(c,-35,-93,66,47,3,'#e3dbc3','#777e78',2);
  text(c,'NEWS',-2,-78,14,'#6a5c43','900','center');
  line(c,[[-27,-64],[22,-64]],'#6a5d49',2);
  line(c,[[-27,-56],[19,-56]],'#6a5d49',2);
 }
 if(z.airborne){
  line(c,[[0,-166],[5,-236]],'#e5ecdc',2);
  oval(c,8,-260,29,35,'#f1accc');
  oval(c,-1,-270,12,17,'#ffd7e6aa');
  circle(c,8,-224,5,'#d974a9');
 }
 }
 if(z.charmed){
  oval(c,0,-117,39,46,'#e7a8fe48');
  circle(c,-12,-140,3,'#fa96ef');circle(c,12,-140,3,'#fa96ef');
 }
 if(z.butter>0){
  box(c,-29,-169,58,18,4,'#f8db62','#b9953e',2);
  text(c,'BUTTER',0,-159,12,'#8b641e','900','center');
 }
 if(z.poison>0){
  for(let k=0;k<5;k++)circle(c,Math.sin(t*2+k)*24,-115-k*12,3,'#baff73aa');
 }
 if(z.frozen>0){
  oval(c,0,-117,38,48,'#8deaff60');
  for(let k=0;k<5;k++){
   const a=k*TAU/5+Math.sin(t)*.18,x=Math.cos(a)*38,y=-116+Math.sin(a)*47;
   line(c,[[x,y-8],[x,y+8]],'#defbff',3);
   line(c,[[x-6,y],[x+6,y]],'#defbff',2);
  }
 }
 if(z.burn>0){
  for(let k=0;k<4;k++)oval(c,(k-1.5)*17,-95-k%2*19,7,17,k%2?'#ffc64a99':'#f3823688');
 }
 if(!hasIllustration)renderZombieAccessories(c,z,t);
 if(!hasIllustration)paintZombieSurface(c,z,t);
 if(z.hp<z.maxHp){box(c,-29,-212,58,7,3,'#3a2b2a');box(c,-28,-211,56*Math.max(0,z.hp/z.maxHp),5,2,'#9bce5b');}
 c.restore();
}
function paintSun(c,s){
 c.save();c.translate(s.x,s.y+Math.sin(s.phase)*3);
 for(let k=0;k<12;k++){const a=k*TAU/12;oval(c,Math.cos(a)*29,Math.sin(a)*29,6,11,'#f7cb53',a);}
 circle(c,0,0,26,'#ffe27a');circle(c,0,0,19,'#f9b847');
 text(c,'☀',0,0,26,'#fff7bb','900','center');c.restore();
}
let cachedLawn=null;
function background(c,B){
 const sky=c.createLinearGradient(0,0,0,820);
 sky.addColorStop(0,'#354f3e');sky.addColorStop(.23,'#96a967');sky.addColorStop(.48,'#779957');sky.addColorStop(1,'#26472d');
 rect(c,0,0,1440,820,sky);
 const sun=c.createRadialGradient(1240,176,3,1240,176,470);
 sun.addColorStop(0,'#fff7bd72');sun.addColorStop(.35,'#eae99c22');sun.addColorStop(1,'#e8e59c00');
 circle(c,1240,176,470,sun);
 for(let j=0;j<3;j++)for(let k=0;k<18;k++){
  const x=k*91+(j%2)*50-40,y=146+j*17+Math.sin(k*17+j*11)*14;
  oval(c,x,y,70-j*7,33-j*4,j%2?'#4f7744':'#547c45');
  oval(c,x-17,y-13,38-j*2,22,'#739957bb');
 }
 box(c,B.x-39,B.y-35,B.w+84,B.h+67,16,'#8e7f51','#b4a16d',5);
 const soil=c.createLinearGradient(0,B.y-27,0,B.y+B.h+25);
 soil.addColorStop(0,'#6e6040');soil.addColorStop(.5,'#7b6949');soil.addColorStop(1,'#4a4f34');
 box(c,B.x-21,B.y-17,B.w+41,B.h+36,9,soil,'#3c5330',5);
 for(let r=0;r<B.rows;r++)for(let col=0;col<B.cols;col++){
  const x=B.x+col*B.cw,y=B.y+r*B.ch;
  const grass=c.createLinearGradient(x,y,x+B.cw,y+B.ch);
  grass.addColorStop(0,(r+col)%2?'#77a954':'#8cbf60');
  grass.addColorStop(.54,(r+col)%2?'#73ae4d':'#85ba57');
  grass.addColorStop(1,(r+col)%2?'#5f9c43':'#72a84d');
  rect(c,x,y,B.cw,B.ch,grass);
  for(let j=0;j<40;j++){
   const px=x+((j*47+r*23+col*31)%B.cw),py=y+((j*29+r*41+col*13)%B.ch);
   line(c,[[px,py+4],[px-1,py-2],[px+3,py+1]],j%3?'#bddf7949':'#3e8a3754',j%3?.9:1.5);
  }
  rect(c,x,y,B.cw,1,'#e0e8a626');
  rect(c,x,y,1,B.ch,'#d7eca91c');
  if((r*11+col*7)%9===0){
   circle(c,x+31,y+38,2.5,'#ffebb6');circle(c,x+35,y+39,2,'#eeeeb6');circle(c,x+33,y+35,2,'#f7eec6');
  }
 }
 const shadow=c.createLinearGradient(B.x-48,0,B.x+15,0);
 shadow.addColorStop(0,'#264124');shadow.addColorStop(1,'#203d2800');
 rect(c,B.x-49,B.y-21,65,B.h+42,shadow);
 for(let i=0;i<85;i++){
  const px=B.x-28+(i*17)%31,py=B.y+(i*43)%(B.h+8);
  line(c,[[px,py+7],[px+2,py-4],[px+4,py+6]],i%2?'#6f9845':'#86b555',1.6);
 }
}
function mower(c,x,y){
 c.save();c.translate(x,y);
 oval(c,0,7,37,10,'#283b2b');
 box(c,-29,-30,53,43,8,'#b94735','#d9934d',3);
 circle(c,-18,14,12,'#383b39');circle(c,15,14,12,'#383b39');
 line(c,[[-17,-30],[-14,-52],[21,-52]],'#afb7a7',4);
 text(c,'★',0,-9,24,'#f2d17e','900','center');
 c.restore();
}
function card(c,item,index,x,y,s){
 const W=DECK_LAYOUT.width,H=DECK_LAYOUT.height,cd=s?.cooldowns[item.id]||0;
 const selected=s?.selected===item.id;
 c.save();c.shadowColor='#10231577';c.shadowBlur=5;c.shadowOffsetY=2;
 box(c,x,y,W,H,8,selected?'#f0cf7b':'#4b713e',selected?'#fff3a8':'#9aba82',selected?3:1.5);
 box(c,x+4,y+4,45,H-8,6,'#aecf8f');
 const model={...item,parts:item.inputs||[item.id],age:22};
 paintPlant(c,model,x+28,y+48,.34,s?.t||0);
 text(c,item.name.length>7?item.name.slice(0,7):item.name,x+54,y+16,11,'#fdf1c6','850');
 text(c,'☀'+(item.cost??optionsCost(item)),x+54,y+36,11,'#ffe2a0','800');
 text(c,String(index+1),x+12,y+11,10,'#294021','900','center');
 if(cd>0){
  box(c,x+1,y+1,W-2,H-2,7,'#102217cc');
  text(c,cd.toFixed(1)+'秒',x+W/2,y+H/2,17,'#fff3d2','900','center');
 }
 c.restore();
}
function optionsCost(item){return typeof item.cost==='number'?item.cost:'融合';}
function gloveSymbol(c,x,y,active=false){
 c.save();c.translate(x,y);
 const palm=active?'#f4d88a':'#e4d2a8';
 for(let i=0;i<4;i++){
  box(c,-18+i*10,-26-(i%2)*5,9,30,4,palm,'#997c5a',1.2);
 }
 c.save();c.rotate(-.55);
 box(c,-33,-8,15,29,7,palm,'#997c5a',1.2);c.restore();
 box(c,-22,-10,42,34,10,palm,'#977a57',1.5);
 box(c,-20,17,38,14,3,active?'#58a9a0':'#6cba7e','#315f49',1);
 c.restore();
}
function hud(c,s,options){
 const grad=c.createLinearGradient(0,0,0,158);
 grad.addColorStop(0,'#263e28');grad.addColorStop(.5,'#45643a');grad.addColorStop(1,'#193321');
 c.save();c.shadowColor='#091a11';c.shadowBlur=19;c.shadowOffsetY=6;
 box(c,10,8,1420,150,17,grad,'#a5a477',3);c.restore();
 box(c,25,20,178,126,13,'#345337','#a2bc73',2);
 circle(c,73,73,29,'#f4cb61');
 text(c,'☀',73,74,34,'#ffefae','900','center');
 text(c,String(s?.sun??500),137,73,30,'#f9e29d','900','center');
 text(c,'阳光',113,119,15,'#d9e6c7','800','center');
 const cards=s?.decks??options.SEEDS.slice(0,10),L=DECK_LAYOUT;
 for(let i=0;i<10;i++){
  const x=L.x+(i%5)*L.columnStep,y=L.y+Math.floor(i/5)*L.rowStep;
  if(cards[i])card(c,cards[i],i,x,y,s);
  else box(c,x,y,L.width,L.height,8,'#203c2b','#547b4c',1);
 }
 const gloveActive=s?.tool==='glove';
 box(c,847,23,126,115,10,gloveActive?'#b79a57':'#456443',gloveActive?'#fce3a0':'#98b18a',2);
 gloveSymbol(c,884,83,gloveActive);
 text(c,s?.gloveMode==='zombie'?'僵尸手套':'植物手套',937,52,13,'#f8efcd','900','center');
 text(c,s?.gloveCooldown?.[s?.gloveMode||'plant']>0?(s.gloveCooldown[s.gloveMode].toFixed(1)+'s'):'2 / V切换',937,104,12,'#f7e4ba','800','center');
 box(c,982,30,105,100,10,s?.tool==='shovel'?'#c99c5f':'#4b6743','#a8b58a',2);
 text(c,'⚒',1034,66,32,'#f5e4be','900','center');text(c,'铲子 1',1034,107,14,'#f5e8c5','900','center');
 box(c,1096,30,142,100,10,'#496847','#a6b785',2);
 text(c,s?.paused?'▶ 继续':'Ⅱ 暂停',1166,68,21,'#f8ebc8','900','center');
 text(c,'SPACE',1166,105,12,'#e0eac8','800','center');
 box(c,1252,30,157,100,9,'#304d37','#7d9c68',2);
 text(c,'携带 10 / 10',1330,59,16,'#fff1c5','900','center');
 text(c,'5列 × 2行',1330,95,14,'#cce1bb','750','center');
}
function status(c,s){
 box(c,176,754,1076,54,10,'#182d1ee6','#87a666',2);
 const wave=s?.wave||1,duration=34,progress=s?Math.min(1,(s.t%duration)/duration):0;
 text(c,'无尽 '+wave+' 波',193,781,18,'#ffda82','900');
 box(c,333,775,547,16,7,'#0f2217');
 box(c,336,778,Math.max(0,541*progress),10,4,'#eebd59');
 for(let k=1;k<=5;k++){
  let x=333+547*k/5;
  text(c,'✦',x,767,14,k===5?'#f9cf7b':'#abc383','850','center');
 }
 text(c,'第 '+wave+' 波',909,781,18,'#f8ebc8','900');
 text(c,'击败 '+(s?.kills||0),1060,781,15,'#d5e8bd','800');
 text(c,'金币 '+(s?.coins||0),1164,781,14,'#ffe8a0','800');
 if(s?.messageLeft>0){
  box(c,475,161,490,36,13,'#213c25e9','#a8c175',1);
  text(c,s.message,720,178,18,'#fff4c7','850','center');
 }
 if(s?.paused){
  rect(c,0,157,1440,596,'#0716079c');
  text(c,'游戏暂停',720,427,62,'#fff2c5','900','center');
  text(c,'空格或右上角继续',720,488,22,'#e2efc7','700','center');
 }
}
function L_DECK_X(index){return DECK_LAYOUT.x+(index%5)*DECK_LAYOUT.columnStep;}
export function drawScene(c,s,options){
 const B=options.BOARD;c.clearRect(0,0,1440,820);
 c.save();
 if(s?.shake)c.translate((Math.random()-.5)*s.shake,(Math.random()-.5)*s.shake);
 if(typeof document!=='undefined'&&typeof c.drawImage==='function'){
  if(!cachedLawn){
   const layer=document.createElement('canvas');layer.width=2880;layer.height=1640;
   const buffer=layer.getContext('2d');buffer.setTransform(2,0,0,2,0,0);
   background(buffer,B);cachedLawn=layer;
  }
  c.drawImage(cachedLawn,0,0,1440,820);
 }else background(c,B);
 for(let r=0;r<5;r++)if(!s||s.mowers[r])mower(c,B.x-45,B.y+(r+.72)*B.ch);
 if(s){
  for(const grave of s.graves||[]){
   const x=B.x+(grave.col+.5)*B.cw,y=B.y+(grave.row+.5)*B.ch;
   box(c,x-25,y-33,50,68,14,'#8b9184','#4c5a51',3);
   line(c,[[x-13,y-14],[x+13,y-14]],'#d9ddd2',3);
   text(c,'RIP',x,y+7,16,'#ece9d5','900','center');
  }
  for(const trail of s.iceTrails||[]){
   const y=B.y+(trail.row+.5)*B.ch;
   oval(c,trail.x,y+23,54,18,'#c3ebf675');
  }
  if(s.glovePickup){
   const pick=s.glovePickup;
   if(pick.kind==='plant'){
    const px=B.x+(pick.col+.5)*B.cw,py=B.y+(pick.row+.5)*B.ch;
    box(c,px-55,py-50,110,104,10,'#fff1ba28','#f3e3a1',3);
    gloveSymbol(c,px,py-16,true);
   }else{
    const z=s.zombies.find(z=>z.id===pick.id);
    if(z)gloveSymbol(c,z.x,z.y-102,true);
   }
  }
  for(const crater of s.craters||[]){
   const x=B.x+(crater.col+.5)*B.cw,y=B.y+(crater.row+.52)*B.ch;
   oval(c,x,y+20,46,26,'#302e2bcb');
   oval(c,x,y+21,39,18,'#4a4038');
   oval(c,x,y+22,26,10,'#251f1d');
   if(crater.life<25)oval(c,x,y+20,39,19,'#73ac4a55');
  }
  if(s.hover&&(s.selected||s.shovel)){
   const col=Math.floor((s.hover.x-B.x)/B.cw),r=Math.floor((s.hover.y-B.y)/B.ch);
   if(r>=0&&r<5&&col>=0&&col<9){
    rect(c,B.x+col*B.cw,B.y+r*B.ch,B.cw,B.ch,s.shovel?'#ffbd6d55':'#f4f1c050');
    if(s.selected&&!s.shovel){const seed=options.getPlant(s.selected);
     if(seed)paintPlant(c,{...seed,parts:[seed.id],age:19},B.x+(col+.5)*B.cw,B.y+(r+.55)*B.ch,.72,s.t);}
   }
  }
  for(let row=0;row<5;row++)for(let col=0;col<9;col++){
   const p=s.grid[row][col];if(!p)continue;
   const x=B.x+(col+.5)*B.cw,y=B.y+(row+.64)*B.ch;
   plantContactShadow(c,x,y+12,.99,p.parts?.length||1);
   paintPlant(c,{...p,spec:options.getPlant(p.id)},x,y,.91,s.t);
   if(p.cover>0){
    c.save();c.globalAlpha=.56;
    drawPumpkinCover(c,x,y,p.cover);c.restore();
    text(c,'🛡',x+35,y-30,18,'#fff3ca','900','center');
   }
   if(p.hp<p.maxHp){
    box(c,x-31,y+10,62,6,3,'#30352a');
    box(c,x-30,y+11,60*Math.max(0,p.hp/p.maxHp),4,2,'#b5db76');
   }
  }
  for(const z of [...s.zombies].sort((a,b)=>a.row-b.row))paintZombie(c,z,s.t);
  for(const p of s.bullets){
   let col=p.freezeHit?'#a5efff':p.butterChance?'#f9d477':p.icon.includes('ice')?'#a4eeff':p.icon.includes('blaze')||p.icon.includes('fire')?'#ff9d4e':p.icon.includes('cherry')?'#f39b54':p.icon.includes('sun')?'#f7d75a':p.icon.includes('nut')?'#b79d62':p.icon.includes('puff')||p.icon.includes('fume')?'#bb9dea':'#8bbf4c';
   if(p.star){
    c.save();c.translate(p.x,p.y);c.rotate(s.t*3);c.beginPath();
    for(let k=0;k<10;k++){
     const a=k*Math.PI/5-Math.PI/2,r=k%2?7:14;
     if(k===0)c.moveTo(Math.cos(a)*r,Math.sin(a)*r);
     else c.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    }
    c.closePath();c.fillStyle=col;c.fill();c.restore();
    circle(c,p.x,p.y,19,col+'39');
   }else{
    circle(c,p.x-15,p.y,9,col+'22');
    circle(c,p.x,p.y,14,col+'44');
    circle(c,p.x,p.y,8,col);circle(c,p.x-2,p.y-2,2,'#fff9dc');
   }
  }
  for(const u of s.suns)paintSun(c,u);
  paintWorldAtmosphere(c,s.t,B);
  for(const p of s.effects){
   c.globalAlpha=Math.min(1,p.life/.32);
   circle(c,p.x,p.y,p.size*2,p.color+'33');
   circle(c,p.x,p.y,p.size,p.color);
  }
  c.globalAlpha=1;
  if(s.windLeft>0){
   c.save();c.globalAlpha=Math.min(.6,s.windLeft/3);
   for(let j=0;j<12;j++){
    const y=190+j*45+(s.t*31)%42,x=((s.t*420+j*213)%1700)-150;
    line(c,[[x-95,y],[x+45,y-7],[x+125,y-7]],'#e5ffff',4);
   }c.restore();
  }
  if(s.screenFlash>0)rect(c,0,165,1440,587,'#fff3b6'+Math.round(Math.min(1,s.screenFlash)*150).toString(16).padStart(2,'0'));
 }
 c.restore();
 hud(c,s,options);status(c,s);
 if(s?.hover){
  const index=seedAtPoint(s.hover.x,s.hover.y);
  const seed=index>=0?s.decks[index]:null;
  if(seed){
   const x=Math.max(220,Math.min(1030,L_DECK_X(index)));
   box(c,x,162,386,79,12,'#233b2df5','#c9bd76',2);
   text(c,seed.name,x+15,182,16,'#ffe5a5','900');
   text(c,'冷却 '+(seed.cooldown||14)+'秒',x+364,182,13,'#f1e1bc','750','right');
   const desc=seed.desc||'点击草坪即可种植';
   text(c,desc.length>28?desc.slice(0,27)+'…':desc,x+15,219,13,'#e5f1d3','650');
  }
 }
}
