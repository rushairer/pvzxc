/**
 * Fusion silhouettes assembled from distinct organic organs, foliage,
 * element sockets and family-specific heads.
 *
 * This is entirely original Canvas artwork: no official sprites are used.
 */
import {getPlant} from './model.js';
const TAU=Math.PI*2;
const colorFor=id=>{
 if(/sun|marigold|gold/.test(id))return '#f9c952';
 if(/ice|snow|winter|frost|polar/.test(id))return '#9eeeff';
 if(/cherry|doom|fire|torch|blaze|jalapeno/.test(id))return '#f18a52';
 if(/nut|wall|pumpkin|tall|spikerock/.test(id))return '#d4a579';
 if(/hypno|magnet|gloom|fume|shroom|scaredy/.test(id))return '#c1a3ee';
 if(/star|cattail/.test(id))return '#f4db87';
 return '#98ca6b';
};
function oval(c,x,y,rx,ry,fill,a=0){c.beginPath();c.ellipse(x,y,rx,ry,a,0,TAU);c.fillStyle=fill;c.fill();}
function line(c,coords,color,width=4){
 c.beginPath();c.moveTo(...coords[0]);for(const p of coords.slice(1))c.lineTo(...p);
 c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();
}
function orb(c,x,y,r,light,base,dark){
 const g=c.createRadialGradient(x-r*.32,y-r*.38,2,x,y,r*1.33);
 g.addColorStop(0,light);g.addColorStop(.65,base);g.addColorStop(1,dark);
 oval(c,x,y,r,r,g);oval(c,x-r*.3,y-r*.3,r*.33,r*.13,'#ffffff66',-.35);
}
function crown(c,x,y,kind,color,phase){
 c.save();c.translate(x,y);
 const twinkle=Math.sin(phase)*1.7;
 if(/cherry|doom|fire|jalapeno/.test(kind)){
  oval(c,-8,-2+twinkle,13,16,'#c24d3f');oval(c,7,1+twinkle,13,16,color);
  line(c,[[-8,-18],[0,-29],[10,-26]],'#5f933f',5);
  oval(c,-13,-7+twinkle,5,3,'#ffffff6e');
 }else if(/sun|gold|marigold/.test(kind)){
  for(let k=0;k<10;k++){
   const a=k*TAU/10;
   oval(c,Math.cos(a)*19,Math.sin(a)*19+twinkle,7,11,'#f4c95c',a);
  }
  orb(c,0,twinkle,14,'#fff3b0','#deb158','#9f7536');
 }else if(/snow|ice|winter|polar/.test(kind)){
  for(let i=0;i<6;i++){
   const a=i*TAU/6;
   line(c,[[0,twinkle],[Math.cos(a)*19,Math.sin(a)*19+twinkle]],'#d9fbff',4);
   line(c,[[Math.cos(a)*10-3,Math.sin(a)*10+twinkle-3],[Math.cos(a)*10+3,Math.sin(a)*10+twinkle+3]],'#abdef0',2);
  }
  orb(c,0,twinkle,8,'#f5ffff','#a6e9ff','#599cbb');
 }else if(/star|threepeater|cattail/.test(kind)){
  const v=[];for(let i=0;i<10;i++){
   const a=i*Math.PI/5-Math.PI/2,r=i%2?9:22;
   v.push([Math.cos(a)*r,Math.sin(a)*r+twinkle]);
  }
  c.beginPath();v.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));
  c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#977f4678';c.lineWidth=2;c.stroke();
 }else if(/spike|cactus/.test(kind)){
  for(let i=-1;i<=1;i++){
   c.beginPath();c.moveTo(i*11-9,15);c.lineTo(i*11,-22+twinkle);c.lineTo(i*11+9,15);
   c.closePath();c.fillStyle=i%2?'#6b974c':'#b6bd79';c.fill();
  }
 }else if(/wall|nut|pumpkin|tall/.test(kind)){
  orb(c,0,twinkle,19,'#f0ce9f','#b18c5c','#704d37');
  oval(c,-6,-3+twinkle,3,5,'#443f32');oval(c,7,-3+twinkle,3,5,'#443f32');
  line(c,[[-7,9+twinkle],[2,12+twinkle],[10,8+twinkle]],'#69533e',2);
 }else if(/magnet/.test(kind)){
  c.beginPath();c.arc(0,twinkle,17,0,Math.PI);
  c.strokeStyle='#c1d7d9';c.lineWidth=10;c.stroke();
  line(c,[[-17,twinkle],[-17,-15+twinkle]],'#e46f61',8);
  line(c,[[17,twinkle],[17,-15+twinkle]],'#e46f61',8);
 }else if(/fume|shroom|puff|hypno|scaredy|gloom/.test(kind)){
  oval(c,0,8+twinkle,10,13,'#e3d9bb');
  orb(c,0,-7+twinkle,22,'#e9dcff','#a080d3','#534d8a');
  oval(c,-8,-17+twinkle,7,3,'#ffffff66');
 }else if(/garlic/.test(kind)){
  orb(c,0,twinkle,19,'#fff9e5','#d7d1aa','#aaa482');
  for(let i=-1;i<=1;i++)oval(c,i*9,8+twinkle,6,12,'#f7efdc8a');
 }else if(/melon|cabbage|kernel|cob/.test(kind)){
  orb(c,0,twinkle,20,'#e5ec92','#92bc58','#416d42');
  for(let i=-1;i<=1;i++)line(c,[[i*9,-16+twinkle],[i*11,13+twinkle]],'#488c4799',2);
 }else{
  orb(c,0,twinkle,18,'#d5ed92',color,'#477b37');
  oval(c,10,5+twinkle,10,7,'#588e4a');
  oval(c,-5,-5+twinkle,3,4,'#213d2d');
 }
 c.restore();
}
export function paintFusionArt(c,p,time=0){
 const parts=Array.isArray(p.parts)?p.parts:[];
 if(parts.length<2)return;
 const seeds=parts.filter(id=>getPlant(id));
 if(seeds.length<2)return;
 const traits=[...new Set(seeds.slice(1))].slice(-3);
 const count=traits.length,bob=Math.sin(time*2.1)*2;
 // Root nodes and two thick branches grow out of the primary silhouette.
 c.save();
 line(c,[[-8,-23],[-11,-44],[-3,-57]],'#3d6a31',8);
 traits.forEach((part,i)=>{
  const column=count===1?0:i-(count-1)*.5;
  const x=column*37+(count===1?26:0);
  const y=-99-Math.abs(column)*10+bob;
  const stem=[[-2,-47],[(x*.55)-2,-65],[x,y+12]];
  line(c,stem,'#326b35',9);line(c,stem,'#88bb58',3);
  oval(c,x*.55-7,-64,15,7,'#69a44f',-.8+column*.35);
  oval(c,x*.55+7,-67,12,6,'#a8cd72',.5);
  crown(c,x,y,part,colorFor(part),time*2.4+i*.7);
  const ring=c.createRadialGradient(x,y,3,x,y,36);
  ring.addColorStop(0,colorFor(part)+'44');ring.addColorStop(1,colorFor(part)+'00');
  oval(c,x,y,36,36,ring);
 });
 // A shared vascular root with multi-element striations.
 for(let i=0;i<Math.min(4,seeds.length);i++){
  let a=(i+.5)*TAU/Math.min(4,seeds.length)+time*.1;
  const x=Math.cos(a)*30,y=-43+Math.sin(a)*27;
  oval(c,x,y,3.3,6,colorFor(seeds[i]),a);
 }
 const left=colorFor(seeds[0]),right=colorFor(seeds[seeds.length-1]);
 const g=c.createLinearGradient(-43,-66,42,-40);
 g.addColorStop(0,left+'69');g.addColorStop(.5,'#ffffff0a');g.addColorStop(1,right+'82');
 c.beginPath();c.ellipse(0,-52,39,42,0,0,TAU);
 c.strokeStyle=g;c.lineWidth=3;c.stroke();
 c.restore();
}
