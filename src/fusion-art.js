// Composite art layer for hybrid plants: functional attributes drive visible
// attached organs, shielding and energy transfers, instead of a generic badge.
import {getPlant} from './model.js';
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,fill,a=0){c.beginPath();c.ellipse(x,y,rx,ry,a,0,TAU);c.fillStyle=fill;c.fill();}
function disk(c,x,y,r,fill){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=fill;c.fill();}
function line(c,p,col,w=2){c.beginPath();c.moveTo(...p[0]);for(const q of p.slice(1))c.lineTo(...q);c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.stroke();}
function hue(type){
 if(['sun','sunshroom-base','marigold','twin-base'].includes(type))return '#ffdb70';
 if(['ice-shroom','snowpea','wintermelon'].includes(type))return '#96f2fa';
 if(['cherry','jalapeno','doom'].includes(type))return '#ff8f65';
 if(['wall','tallnut','pumpkin','spikerock'].includes(type))return '#bca271';
 if(['hypno','magnet','fume','puff','scaredy'].includes(type))return '#cf9ffa';
 if(['starfruit','cattail','threepeater'].includes(type))return '#f9ec8f';
 return '#a8df82';
}
function emblem(c,id,x,y,angle,time){
 c.save();c.translate(x,y);c.rotate(angle);
 const color=hue(id);
 const t=Math.sin(time*3+x*.12)*2;
 disk(c,0,t,18,color+'2a');
 if(id==='sun'||id.includes('sun')||id==='marigold'){
  for(let i=0;i<9;i++){let a=i*TAU/9;oval(c,Math.cos(a)*15,Math.sin(a)*15+t,5,9,'#f4cb5c',a);}
  disk(c,0,t,12,'#e6ac52');
 }else if(id.includes('wall')||id.includes('nut')||id==='pumpkin'){
  oval(c,0,-2+t,16,19,'#b79063');oval(c,-5,-9+t,7,4,'#e3c08d');
  disk(c,-5,-1+t,2,'#524132');disk(c,6,-1+t,2,'#524132');
 }else if(id.includes('ice')||id.includes('snow')||id.includes('winter')){
  for(let i=0;i<6;i++){let a=i*TAU/6;line(c,[[0,t],[Math.cos(a)*17,Math.sin(a)*17+t]],'#d5fbff',3);}
  disk(c,0,t,6,'#7fc7e7');
 }else if(id.includes('cherry')||id==='jalapeno'||id.includes('fire')){
  oval(c,-6,0+t,10,13,'#d85645');oval(c,7,3+t,9,11,'#ec8f43');
  oval(c,1,-15+t,4,8,'#ffda78');
 }else if(id.includes('magnet')){
  c.beginPath();c.arc(0,t,12,0,Math.PI);c.strokeStyle='#b8d5dd';c.lineWidth=7;c.stroke();
  line(c,[[-12,t],[-12,-10+t]],'#dc736c',7);line(c,[[12,t],[12,-10+t]],'#dc736c',7);
 }else if(id.includes('star')){
  let pts=[];for(let i=0;i<10;i++){let a=i*Math.PI/5-Math.PI/2,r=i%2?8:18;pts.push([Math.cos(a)*r,Math.sin(a)*r+t]);}
  c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle='#f1d75b';c.fill();
 }else if(id.includes('puff')||id.includes('shroom')||id==='fume'||id==='gloom'){
  oval(c,0,5+t,8,11,'#e3d6ae');oval(c,0,-7+t,18,13,'#a98dd5');
  oval(c,-7,-12+t,6,3,'#f4ecff');
 }else if(id.includes('spike')||id==='cactus'){
  for(let i=-1;i<=1;i++){
   c.beginPath();c.moveTo(i*12-6,14+t);c.lineTo(i*12,(-19+Math.abs(i)*6)+t);c.lineTo(i*12+6,14+t);c.closePath();
   c.fillStyle='#8da85d';c.fill();
  }
 }else if(id.includes('cob')||id.includes('kernel')||id==='cabbage'||id==='melon'){
  oval(c,0,t,15,14,'#e2c25e');for(let i=0;i<4;i++)disk(c,(i-1.5)*8,t-4,2,'#fff2af');
 }else{
  oval(c,-5,t,14,14,'#91c763');oval(c,9,2+t,13,8,'#64a55c');
  disk(c,-8,-5+t,3,'#24492f');
 }
 c.restore();
}
export function paintFusionArt(c,p,time=0){
 if(!Array.isArray(p.parts)||p.parts.length<2)return;
 const ids=p.parts.filter(id=>getPlant(id));
 if(ids.length<2)return;
 const secondary=ids.slice(1,-0||undefined); // show latest meaningful fused organ(s)
 const count=Math.min(3,secondary.length);
 for(let i=0;i<count;i++){
  const id=secondary[secondary.length-count+i];
  const angle=count===1?-.52:-.95+i*.82;
  const x=count===1?-37:-37+i*35,y=-70-(i%2)*18;
  line(c,[[-3,-35],[x*.45,-48],[x,y+12]],'#517f43',6);
  oval(c,x*.55,-47,14,6,'#7aaf65',angle);
  emblem(c,id,x,y,angle*.6,time);
  const particle=Math.sin(time*3+i*2)*.5+.5;
  disk(c,x+Math.sin(time*2+i)*14,y-23-(particle*9),2.3,hue(id)+'a0');
 }
 const rim=ids.map(hue);
 const glow=c.createLinearGradient(-38,-65,42,-30);
 glow.addColorStop(0,rim[0]+'44');glow.addColorStop(1,rim[rim.length-1]+'55');
 c.beginPath();c.ellipse(0,-45,36,42,0,0,TAU);c.strokeStyle=glow;c.lineWidth=3;c.stroke();
 // Hybrid core is larger for advanced multi-stage fusions, with a unique palette.
 let count2=Math.min(4,ids.length);
 for(let i=0;i<count2;i++){
  let a=(-Math.PI*.9)+(i/(count2-1||1))*Math.PI*.75;
  disk(c,Math.cos(a)*29,Math.sin(a)*34-48,3.5,hue(ids[i]));
 }
}
