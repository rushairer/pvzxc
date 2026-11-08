// Original vector accessories and silhouette distinctions for the classic
// twenty-six enemy archetypes. Applied over the shared walking rig.
const PI=Math.PI,TAU=PI*2;
function oval(c,x,y,rx,ry,col,rot=0){c.beginPath();c.ellipse(x,y,rx,ry,rot,0,TAU);c.fillStyle=col;c.fill();}
function disk(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=col;c.fill();}
function line(c,pts,col,w=3){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();}
function path(c,pts,col){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();c.fillStyle=col;c.fill();}
function label(c,text,x,y,size,color='#f9efd6'){
 c.font='900 '+size+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(text,x,y);
}
export function renderZombieAccessories(c,z,t){
 const type=z.type,sw=Math.sin(t*4+z.anim);
 if(type==='flag'){
  line(c,[[29,-73],[35,-197]],'#ad916b',5);
  path(c,[[35,-197],[91,-190],[40,-155]],'#ce6658');
  label(c,'Z',62,-178,20);
 }
 if(type==='pole'){
  line(c,[[35,-53],[70,-233]],'#d5caa0',7);
  line(c,[[65,-229],[74,-235]],'#f9e7cb',4);
 }
 if(type==='football'){
  oval(c,0,-151,37,33,'#c83f36');
  oval(c,-8,-159,26,15,'#e58c6d');
  line(c,[[-32,-150],[33,-150]],'#f2f2da',4);
  oval(c,0,-91,28,38,'#973c39');
  label(c,'7',0,-88,26);
 }
 if(type==='screen'){
  c.fillStyle='#b2b7a8b4';c.fillRect(-32,-118,78,67);
  for(let x=-32;x<=46;x+=11)line(c,[[x,-118],[x,-51]],'#7b8c8d',2);
  for(let y=-116;y<=-53;y+=10)line(c,[[-32,y],[46,y]],'#657a80',2);
 }
 if(type==='dancer'||type==='backup'){
  path(c,[[-19,-105],[19,-105],[34,-31],[-32,-31]],type==='dancer'?'#c68db6':'#79a5bd');
  oval(c,-21,-153,21,10,'#151e23');oval(c,17,-158,18,9,'#1d2633');
  if(type==='dancer'){line(c,[[-38,-84],[-50,-132]],'#a7d3df',8);label(c,'♪',-44,-149,30,'#f7e39a');}
 }
 if(type==='ducky'||type==='snorkel'||type==='dolphin'){
  oval(c,0,-25,47,23,'#ffd576');
  oval(c,27,-30,17,13,'#fce190');disk(c,34,-32,3,'#31332a');
  if(type==='snorkel'){
   line(c,[[-3,-153],[-3,-208],[23,-208]],'#9edeee',7);
   oval(c,-3,-143,24,11,'#87d2e8');
  }
  if(type==='dolphin'){
   oval(c,15,6,70,18,'#77aeb8');
   path(c,[[7,-7],[25,-37],[31,-7]],'#7eafbd');
  }
 }
 if(type==='zomboni'||type==='bobsled'||type==='catapult'){
  oval(c,0,4,88,23,'#344948');c.fillStyle=type==='zomboni'?'#a0b7c6':type==='bobsled'?'#db443f':'#a48c68';
  c.beginPath();c.roundRect(-76,-52,145,43,12);c.fill();
  disk(c,-52,5,22,'#2e393d');disk(c,48,5,22,'#2e393d');
  disk(c,-52,5,10,'#879694');disk(c,48,5,10,'#879694');
  if(type==='zomboni'){label(c,'ICE',0,-31,24,'#f9f8f2');}
  if(type==='bobsled'){
   for(let i=-1;i<=1;i++)oval(c,i*21,-80,15,19,'#a5b6a2');
   label(c,'SLED',0,-29,18);
  }
  if(type==='catapult'){
   line(c,[[-24,-58],[10,-144],[64,-105]],'#6c5642',12);
   oval(c,65,-104,19,9,'#e1ce9b');disk(c,67,-118,17,'#bda77a');
  }
 }
 if(type==='jack'){
  c.fillStyle='#d7ae74';c.beginPath();c.roundRect(-31,-81,61,59,6);c.fill();
  label(c,'?',0,-55,38,'#a34942');
  line(c,[[-10,-87],[-15,-118],[18,-126]],'#dcd0ac',4);
 }
 if(type==='digger'){
  oval(c,0,-157,30,19,'#d5bc5d');
  line(c,[[-30,-154],[31,-154]],'#a88744',4);
  line(c,[[29,-69],[69,-113]],'#b6a77c',8);
  path(c,[[57,-112],[84,-135],[86,-109],[70,-89]],'#b9c6ba');
 }
 if(type==='pogo'){
  line(c,[[0,13],[0,-46]],'#d8bf84',7);
  line(c,[[-28,9],[28,9]],'#e5c26a',7);
  disk(c,0,15,15,'#bd6d4e');
  oval(c,0,-149,25,9,'#a4c7d1');
 }
 if(type==='yeti'){
  oval(c,0,-95,51,66,'#e5edf3bd');
  oval(c,0,-156,46,42,'#d8e8ed');
  for(let i=0;i<5;i++)oval(c,i*17-34,-47,10,19,'#f1f8f4');
  label(c,'❄',0,-161,27,'#8fc9da');
 }
 if(type==='bungee'){
  line(c,[[0,-150],[0,-390]],'#c7ad8e',4);
  oval(c,0,-153,26,23,'#7c58af');
  label(c,'⌄',0,-154,27);
 }
 if(type==='ladder'){
  line(c,[[23,-138],[63,-168]],'#aab6ba',7);
  line(c,[[39,-23],[79,-54]],'#aab6ba',7);
  for(let k=0;k<5;k++){
   let y=-142+k*20;
   line(c,[[28+k*4,y],[67+k*4,y-24]],'#afc2c6',4);
  }
 }
 if(type==='garg'){
  oval(c,0,-92,43,55,'#8e9a7a77');
  line(c,[[-19,-61],[-65,-31]],'#728875',15);
  line(c,[[47,-89],[89,-181]],'#735e4d',14);
  path(c,[[68,-177],[110,-205],[126,-170],[84,-141]],'#a09575');
  label(c,'G',0,-108,26,'#d9cb9b');
 }
 if(type==='imp'){
  oval(c,0,-111,22,30,'#82a47b');
  label(c,'!',0,-98,23,'#fff2b9');
 }
 if(type==='zomboss'){
  c.fillStyle='#39444c';c.beginPath();c.roundRect(-105,-117,200,101,20);c.fill();
  c.fillStyle='#798f91';c.beginPath();c.roundRect(-74,-105,140,75,16);c.fill();
  disk(c,-78,0,30,'#313a41');disk(c,65,0,30,'#313a41');
  for(const dx of [-62,52])disk(c,dx,-55,19,'#c05a4e');
  oval(c,0,-175,41,35,'#8ba186');
  oval(c,-10,-183,8,8,'#eaf6d9');oval(c,18,-181,8,8,'#eaf6d9');
  disk(c,-7,-183,4,'#d83d40');disk(c,20,-181,4,'#d83d40');
  label(c,'BOSS',0,-81,19,'#f4dfbf');
 }
 if(z.jumpAnimation>0){
  disk(c,0,13,24,'#e5ce8655');
 }
 if(type==='snorkel'&&z.airborne)oval(c,0,-115,37,35,'#8bdaef66');
}
