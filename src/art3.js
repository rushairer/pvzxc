// Original procedural plant artwork for the third expansion.
// All coordinates are local to a plant's ground contact: (0,0).
const TAU=Math.PI*2;
function ellipse(ctx,x,y,rx,ry,fill,rotation=0){
 ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fillStyle=fill;ctx.fill();
}
function circle(ctx,x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=fill;ctx.fill();}
function path(ctx,points,fill,stroke=null,width=2){
 ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.closePath();
 ctx.fillStyle=fill;ctx.fill();
 if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
}
function stroke(ctx,points,color,width=3){
 ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);
 ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
}
function radial(ctx,x,y,r,colors){
 const g=ctx.createRadialGradient(x-r*.32,y-r*.35,2,x,y,r*1.3);
 g.addColorStop(0,colors[0]);g.addColorStop(.6,colors[1]);g.addColorStop(1,colors[2]);return g;
}
function eyes(ctx,y,angle=0){
 ellipse(ctx,-12,y,7,9,'#f7f2de',angle);ellipse(ctx,12,y,7,9,'#f7f2de',angle);
 circle(ctx,-10,y,3.6,'#26322c');circle(ctx,14,y,3.6,'#26322c');
 circle(ctx,-9,y-2,1.4,'#fff');circle(ctx,15,y-2,1.4,'#fff');
}
function mouth(ctx,x,y){stroke(ctx,[[x-8,y],[x,y+5],[x+8,y]],'#573f32',2.8);}
function capMushroom(ctx,bob,dark,light,tall=false){
 const h=tall?70:43;
 stroke(ctx,[[0,3],[0,-h+20+bob]],'#9b8e80',tall?13:17);
 ellipse(ctx,0,-h+bob,33,tall?31:26,radial(ctx,0,-h+bob,36,[light,dark,'#4c3b64']));
 ellipse(ctx,-12,-h-10+bob,13,6,'#ffffff4a',-.1);
 ellipse(ctx,18,-h-2+bob,5,4,'#f4e8ff55');
 eyes(ctx,-h+13+bob);
}
function starShape(ctx,rOuter,rInner,fill,rot=0){
 const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+rot+i*Math.PI/5;const r=i%2?rInner:rOuter;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
 path(ctx,pts,fill,'#957b3466',2);
}
function petal(ctx,x,y,angle,outer,inner,color){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);
 ellipse(ctx,0,-outer,inner,outer*.69,color);ctx.restore();
}
function miniSun(ctx,x,y){
 for(let i=0;i<10;i++)petal(ctx,x,y,i*TAU/10,12,4,'#f7d46f');
 circle(ctx,x,y,11,'#dba33f');
}
function mushroomArt(ctx,icon,bob,age){
 const doom=icon.includes('doom'),hypno=icon.includes('hypno');
 const scared=icon.includes('scared'),brave=icon.includes('brave');
 const light=doom?'#bd94d3':hypno?'#f0a5e6':scared?'#d5b7ef':'#ab87d6';
 const dark=doom?'#4b396d':hypno?'#8b4d96':scared?'#8d69a4':'#6e4e91';
 capMushroom(ctx,bob,dark,light,scared||brave);
 if(doom){
  circle(ctx,0,-82+bob,15,'#5b497d');
  circle(ctx,0,-82+bob,8,'#aa7bd0');
  for(let i=0;i<6;i++){
   const a=i*TAU/6+age*.2;
   circle(ctx,Math.cos(a)*30,-73+bob+Math.sin(a)*28,3,'#cfb7f0bb');
  }
 }
 if(hypno){
  stroke(ctx,[[-8,-68+bob],[-2,-77+bob],[9,-75+bob],[9,-66+bob],[0,-64+bob]],'#fff3d4',3);
  circle(ctx,24,-81+bob,9,'#ffb6debb');
 }
 if(scared){ellipse(ctx,0,-36+bob,23,8,'#8d60ad');}
 if(icon.includes('sun'))miniSun(ctx,23,-90+bob);
 if(icon.includes('star'))starShape(ctx,17,8,'#ffe37d');
}
function cactusArt(ctx,bob){
 stroke(ctx,[[0,0],[0,-89+bob]],'#357545',19);
 stroke(ctx,[[-2,-40+bob],[-28,-48+bob],[-28,-69+bob]],'#468d47',13);
 stroke(ctx,[[4,-53+bob],[29,-60+bob],[29,-75+bob]],'#468d47',13);
 ellipse(ctx,0,-82+bob,19,24,radial(ctx,0,-82+bob,25,['#b1db72','#6bb449','#3f8143']));
 for(let x=-15;x<=15;x+=10)for(let y=-82;y<=-28;y+=15)
  stroke(ctx,[[x,y+bob],[x-4,y-5+bob]],'#f9ecb2',2.5);
 eyes(ctx,-81+bob);mouth(ctx,0,-64+bob);
}
function bloverArt(ctx,bob,age){
 stroke(ctx,[[0,4],[0,-46+bob]],'#4e8a3a',10);
 for(let i=0;i<5;i++){
  const a=i*TAU/5+Math.sin(age*3)*.08;
  petal(ctx,0,-65+bob,a,24,13,i%2?'#83c967':'#b9e38b');
 }
 circle(ctx,0,-65+bob,20,radial(ctx,0,-65+bob,23,['#d7f6a4','#74b755','#3d8243']));
 eyes(ctx,-66+bob);mouth(ctx,0,-53+bob);
}
function starArt(ctx,bob,age){
 stroke(ctx,[[0,5],[0,-40+bob]],'#5d9342',8);
 for(let i=0;i<3;i++)ellipse(ctx,-7+i*8,-23+i*4,18,8,i%2?'#559748':'#79b45e',i*.6);
 ctx.save();ctx.translate(0,-62+bob);ctx.rotate(Math.sin(age*1.5)*.08);
 starShape(ctx,40,23,radial(ctx,0,0,37,['#fff3b2','#e9c858','#b38c35']));
 eyes(ctx,-2);mouth(ctx,0,12);
 circle(ctx,-18,-8,4,'#ffeac0');circle(ctx,20,9,3,'#ffeac0');
 ctx.restore();
}
function pumpkinArt(ctx,bob,face=true){
 for(let i=-2;i<=2;i++){
  ellipse(ctx,i*12,-30+bob,22,33,radial(ctx,i*7,-30+bob,35,['#ffd18a','#ec8e3f','#b95829']));
  stroke(ctx,[[i*12,-59+bob],[i*12+5,-14+bob]],'#a8542b66',2);
 }
 stroke(ctx,[[0,-56+bob],[4,-73+bob],[17,-76+bob]],'#4e873a',7);
 if(face){eyes(ctx,-37+bob);mouth(ctx,0,-21+bob);}
}
function magnetArt(ctx,bob){
 stroke(ctx,[[0,2],[0,-34+bob]],'#547d51',9);
 ctx.beginPath();ctx.arc(0,-57+bob,24,0,Math.PI);
 ctx.strokeStyle='#a8c5c7';ctx.lineWidth=16;ctx.stroke();
 path(ctx,[[-32,-58+bob],[-15,-58+bob],[-15,-75+bob],[-32,-75+bob]],'#e05f57');
 path(ctx,[[15,-58+bob],[32,-58+bob],[32,-75+bob],[15,-75+bob]],'#e05f57');
 stroke(ctx,[[-29,-76+bob],[-16,-76+bob]],'#fff5d2',4);
 stroke(ctx,[[16,-76+bob],[29,-76+bob]],'#fff5d2',4);
 eyes(ctx,-35+bob);
}
function kernelArt(ctx,bob,butter=false){
 stroke(ctx,[[0,3],[4,-43+bob]],'#59934b',9);
 path(ctx,[[-15,-12],[-34,-59+bob],[-10,-35+bob],[0,-15]],'#78ad53');
 path(ctx,[[14,-12],[37,-53+bob],[11,-37+bob],[0,-15]],'#53953d');
 ellipse(ctx,0,-61+bob,23,37,radial(ctx,0,-61+bob,39,['#fff4a7','#eac251','#b88a35']));
 for(let row=0;row<5;row++)for(let col=0;col<3;col++)
  circle(ctx,-11+col*11,-83+row*11+bob,4,row%2?'#ffdf78':'#fff0aa');
 eyes(ctx,-55+bob);mouth(ctx,0,-40+bob);
 if(butter){ellipse(ctx,18,-85+bob,14,8,'#ffe88b');}
}
function garlicArt(ctx,bob){
 ellipse(ctx,0,-37+bob,33,34,radial(ctx,0,-37+bob,40,['#fff7dd','#dcd6aa','#a8a27a']));
 for(let i=-1;i<=1;i++){
  ellipse(ctx,i*16,-31+bob,11,25,'#efebd2b8');
  stroke(ctx,[[i*15,-43+bob],[i*17,-12+bob]],'#c8bd9a77',2);
 }
 stroke(ctx,[[0,-71+bob],[7,-82+bob]],'#88a169',7);
 eyes(ctx,-41+bob);mouth(ctx,0,-22+bob);
}
function marigoldArt(ctx,bob,age){
 stroke(ctx,[[0,2],[0,-52+bob]],'#518a3e',9);
 for(let k=0;k<13;k++){
  const a=k*TAU/13+Math.sin(age)*.04;
  petal(ctx,0,-66+bob,a,28,10,k%2?'#ffc95d':'#f7a947');
 }
 circle(ctx,0,-66+bob,24,radial(ctx,0,-66+bob,26,['#fff0a2','#d5a23a','#a67428']));
 eyes(ctx,-69+bob);mouth(ctx,0,-52+bob);
}
function tallArt(ctx,bob){
 ellipse(ctx,0,-56+bob,36,65,radial(ctx,0,-53+bob,68,['#e3bb86','#ae7d4e','#745237']));
 ellipse(ctx,-13,-83+bob,10,8,'#ffdda2aa');
 eyes(ctx,-62+bob);
 stroke(ctx,[[-9,-33+bob],[0,-35+bob],[8,-32+bob]],'#73472e',4);
}
function spikerockArt(ctx,age){
 for(let i=-3;i<=3;i++){
  const x=i*13,y=-4-Math.abs(i%2)*6;
  path(ctx,[[x-11,3],[x+1,y-23],[x+12,4]],radial(ctx,x,y,30,['#c8c6a7','#868b82','#4c5554']));
  stroke(ctx,[[x+1,y-17],[x+2,y-6]],'#ffffff66',2);
 }
 ellipse(ctx,0,1,47,9,'#637b48bb');
}
export function drawThirdWavePlant(ctx,icon,bob,age=0){
 if(icon.includes('pumpkin')){
  pumpkinArt(ctx,bob);return true;
 }
 if(icon.includes('spikerock')||icon==='spikerock'){
  spikerockArt(ctx,age);return true;
 }
 if(icon.includes('magnet')){
  magnetArt(ctx,bob);if(icon.includes('cabbage'))ellipse(ctx,28,-35+bob,14,12,'#86c357');return true;
 }
 if(icon.includes('kernel')){
  kernelArt(ctx,bob,true);return true;
 }
 if(icon.includes('garlic')||icon.includes('garlic-')){
  garlicArt(ctx,bob);if(icon.includes('pea'))circle(ctx,28,-62+bob,13,'#80c44c');return true;
 }
 if(icon.includes('star')&&icon!=='star-scared'||icon==='starfruit'){
  starArt(ctx,bob,age);return true;
 }
 if(icon.includes('cactus')){
  cactusArt(ctx,bob);return true;
 }
 if(icon.includes('blover')){
  bloverArt(ctx,bob,age);return true;
 }
 if(icon.includes('marigold')){
  marigoldArt(ctx,bob,age);return true;
 }
 if(icon.includes('tallnut')){
  tallArt(ctx,bob);return true;
 }
 if(icon.includes('hypno')||icon.includes('doom')||icon.includes('scared')||icon.includes('brave')){
  mushroomArt(ctx,icon,bob,age);return true;
 }
 return false;
}
export function drawPumpkinCover(ctx,x,y,cover){
 if(cover<=0)return;
 ctx.save();ctx.translate(x,y);ctx.globalAlpha=cover<1300?.78:1;
 pumpkinArt(ctx,0,false);
 if(cover<2700){
  stroke(ctx,[[-22,-48],[-12,-35],[-18,-19]],'#614331',3);
  if(cover<1300)stroke(ctx,[[14,-57],[9,-37],[20,-25]],'#54392c',4);
 }
 ctx.restore();
}
