// Original procedural art for the rest of the classic PvZ seed roster.
// These are independent silhouettes, not extracted or traced game sprites.
const TAU=Math.PI*2;
function ellipse(c,x,y,rx,ry,fill,a=0){c.beginPath();c.ellipse(x,y,rx,ry,a,0,TAU);c.fillStyle=fill;c.fill();}
function disk(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill();}
function line(c,points,color,width=4){c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function grad(c,x,y,r,a,b,d){let g=c.createRadialGradient(x-r*.35,y-r*.35,2,x,y,r*1.5);g.addColorStop(0,a);g.addColorStop(.7,b);g.addColorStop(1,d);return g;}
function eyes(c,y){ellipse(c,-10,y,6,8,'#fff5dd');ellipse(c,9,y,6,8,'#fff5dd');disk(c,-8,y,3,'#2b3327');disk(c,11,y,3,'#2b3327');}
function sunflower(c,x,y,small=false){c.save();c.translate(x,y);for(let i=0;i<12;i++){const a=i*TAU/12;ellipse(c,Math.cos(a)*(small?17:25),Math.sin(a)*(small?17:25),small?6:9,small?9:15,'#f5c35d',a);}disk(c,0,0,small?15:23,'#d7983b');c.restore();}
function leaf(c,x,y,a){c.save();c.translate(x,y);c.rotate(a);ellipse(c,15,0,20,9,'#50963f');ellipse(c,17,-2,12,5,'#acd076');c.restore();}
function flower(c,stem,body){line(c,[[0,4],[0,-48]],stem,9);leaf(c,-21,-17,-2.7);leaf(c,13,-20,-.4);disk(c,0,-67,28,body);}
function mushroom(c,color,bob,tall=false){
 line(c,[[0,4],[0,-45+bob]],'#b6b49f',tall?18:14);
 ellipse(c,0,-60+bob,tall?38:29,tall?31:24,grad(c,0,-60+bob,38,'#faf5e3',color,'#574465'));
 ellipse(c,-13,-71+bob,9,5,'#fff9dc66');eyes(c,-45+bob);
}
function vineLeaf(c,x,y,color){ellipse(c,x,y,17,8,color,-.7);}
function cannon(c,bob){
 ellipse(c,0,-9,40,17,'#52803c');
 line(c,[[0,3],[0,-42]],'#3f7a35',14);
 for(let i=-1;i<=1;i++)ellipse(c,i*19,-40+bob,18,28,'#dfbc57');
 c.save();c.translate(8,-71+bob);c.rotate(-.28);
 let g=c.createLinearGradient(-45,0,47,0);g.addColorStop(0,'#a4ba51');g.addColorStop(.5,'#e9e686');g.addColorStop(1,'#678b3c');
 c.fillStyle=g;c.beginPath();c.roundRect(-43,-22,86,42,12);c.fill();
 ellipse(c,45,0,14,24,'#426d33');ellipse(c,47,0,9,17,'#2a4935');
 line(c,[[-26,-8],[-3,-8]],'#f6f3b185',3);
 c.restore();
}
function cattail(c,bob){
 line(c,[[0,0],[0,-47+bob]],'#4c9359',8);
 for(let i=-1;i<=1;i++)ellipse(c,i*13,-28+bob,17,8,'#609d57',i*.35);
 ellipse(c,-2,-67+bob,28,29,grad(c,-2,-67+bob,34,'#fff1be','#a6b86c','#527442'));
 for(let side of [-1,1]){
  c.beginPath();c.moveTo(side*12,-88+bob);c.lineTo(side*22,-112+bob);c.lineTo(side*4,-97+bob);c.closePath();c.fillStyle='#759c52';c.fill();
 }
 ellipse(c,26,-82+bob,12,8,'#f4ebca');eyes(c,-69+bob);
 for(let k=-1;k<=1;k++)line(c,[[-14,-56+k*5+bob],[-38,-53+k*7+bob]],'#e4e8ce',1.8);
}
function lily(c,bob){
 for(let i=0;i<8;i++){
  c.save();c.rotate(i*TAU/8);
  ellipse(c,0,-27,14,36,'#70bd59');ellipse(c,2,-25,8,27,'#addc72a0');
  c.restore();
 }
 disk(c,0,-3,15,'#f4d88b');eyes(c,-2+bob);
}
function kelp(c,bob,small=false){
 for(let i=0;i<4;i++){
  const x=i*14-21;
  line(c,[[x,4],[x-7,-26+bob],[x+6,-53+bob],[x-4,-78+bob]],i%2?'#3e9a75':'#69b88b',8);
  vineLeaf(c,x+7,-44+bob,'#97dab2');
 }
 if(!small){disk(c,0,-67+bob,14,'#83c8a4');eyes(c,-65+bob);}
}
function umbrella(c,bob){
 line(c,[[0,2],[0,-52+bob]],'#547e38',9);
 c.beginPath();c.moveTo(-50,-54+bob);c.quadraticCurveTo(-25,-117+bob,0,-111+bob);c.quadraticCurveTo(29,-115+bob,50,-54+bob);c.closePath();
 c.fillStyle=grad(c,0,-77+bob,55,'#f6dfb0','#8dc77c','#588b4e');c.fill();
 for(let i=-2;i<=2;i++)line(c,[[0,-109+bob],[i*22,-56+bob]],'#e9e9ba88',2);
 eyes(c,-39+bob);
}
function pot(c,bob){
 ellipse(c,0,1,35,9,'#765b45');
 c.beginPath();c.moveTo(-31,-50+bob);c.lineTo(31,-50+bob);c.lineTo(25,1);c.lineTo(-24,1);c.closePath();
 c.fillStyle=grad(c,0,-32+bob,45,'#edac75','#b9693f','#734b37');c.fill();
 ellipse(c,0,-48+bob,39,12,'#dd9863');ellipse(c,0,-46+bob,30,7,'#5a483c');eyes(c,-19+bob);
}
function lantern(c,bob){
 flower(c,'#4b9345','#a5d870');
 ellipse(c,0,-63+bob,27,32,grad(c,0,-63+bob,34,'#fffbc7','#d3e977','#81aa4a'));
 for(let i=0;i<4;i++)line(c,[[-18,-79+i*11+bob],[18,-79+i*11+bob]],'#f7fbc372',2);
 eyes(c,-64+bob);
}
function coffee(c,bob){
 line(c,[[0,2],[0,-27+bob]],'#527a3f',6);
 ellipse(c,0,-40+bob,33,28,grad(c,0,-40+bob,33,'#d0a47b','#7c523d','#43372f'));
 line(c,[[0,-60+bob],[-8,-38+bob],[6,-20+bob]],'#e3bc966b',3);
 eyes(c,-40+bob);
}
function imitation(c,bob){
 pot(c,bob);
 ellipse(c,0,-70+bob,21,27,grad(c,0,-70+bob,30,'#f4f2e9','#bcc9bd','#6e8e84'));
 for(let i=0;i<4;i++)ellipse(c,(i-1.5)*11,-96+bob,5,9,'#dde4d2');
 eyes(c,-69+bob);
}
export function drawClassicPlant(c,id,bob,age=0){
 const normal=id.replace(/-(base|ice|fire)$/,'');
 if(id==='lilypad'||id==='sun-lilypad'){lily(c,bob);if(id==='sun-lilypad')sunflower(c,22,-68+bob,true);return true;}
 if(id==='tangle'){kelp(c,bob);return true;}
 if(id==='seashroom'||id==='sea-ice'){kelp(c,bob,true);mushroom(c,id==='sea-ice'?'#80dbe9':'#a28cd2',bob);return true;}
 if(id==='plantern'){lantern(c,bob);return true;}
 if(id==='flowerpot'){pot(c,bob);return true;}
 if(id==='coffeebean'){coffee(c,bob);return true;}
 if(id==='umbrella'||id.includes('umbrella')){umbrella(c,bob);return true;}
 if(id==='cattail'||id.includes('cattail')){cattail(c,bob);return true;}
 if(id==='cobcannon'){cannon(c,bob);return true;}
 if(id==='imitater'){imitation(c,bob);return true;}
 if(id==='gravebuster'){
  mushroom(c,'#74597d',bob,true);
  for(let k=0;k<3;k++)line(c,[[k*18-20,-12],[k*18-28,-37]],'#aa87a0',5);
  return true;
 }
 if(id==='goldmagnet'||id==='goldmagnet-marigold'){
  flower(c,'#ae8b42','#d6ae52');
  c.beginPath();c.arc(0,-64+bob,25,0,Math.PI);c.strokeStyle='#e1b658';c.lineWidth=13;c.stroke();
  eyes(c,-43+bob);return true;
 }
 if(id==='gloom'||id.startsWith('gloom-')){
  mushroom(c,id.includes('ice')?'#8ad9e7':id.includes('fire')?'#e5965d':'#7451ac',bob,true);
  for(let i=0;i<7;i++){
   const a=i*TAU/7+age*.6;
   disk(c,Math.cos(a)*38,-56+bob+Math.sin(a)*26,7,'#b58af899');
  }return true;
 }
 if(id==='sunshroom-base'||id==='gold-sun'){mushroom(c,'#e7ce79',bob,age>45);return true;}
 if(id==='wintermelon'||id==='winter-torch'||id==='winter-corn'){
  flower(c,'#4d8f66','#8dbab6');
  ellipse(c,0,-64+bob,36,30,grad(c,0,-64+bob,40,'#e7fcff','#6dc5d7','#3f8d98'));
  eyes(c,-61+bob);return true;
 }
 if(id==='repeater-base'||id==='gatling-base'||id==='splitpea-base'||id==='snowpea'){
  // Existing procedural pea art handles this after this function returns false.
  return false;
 }
 return false;
}
