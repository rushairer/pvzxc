const PI = Math.PI;
function round(ctx,x,y,w,h,r=12){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function fill(ctx,c){ctx.fillStyle=c;ctx.fill();}
function stroke(ctx,c,w=2){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();}
function text(ctx,t,x,y,size=20,c='#f9f3d9',weight='700',align='left'){ctx.fillStyle=c;ctx.font=weight+' '+size+'px system-ui,"Microsoft YaHei",sans-serif';ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y);}
function circle(ctx,x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,PI*2);fill(ctx,c);}
function ellipse(ctx,x,y,rx,ry,c){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,PI*2);fill(ctx,c);}
function line(ctx,pts,color,width){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);stroke(ctx,color,width);}
function leaf(ctx,x,y,rotation,scale=1){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ellipse(ctx,13*scale,0,20*scale,9*scale,'#3f932f');ellipse(ctx,15*scale,-2*scale,14*scale,5*scale,'#69b846');ctx.restore();}
function paintPlant(ctx,p,x,y,scale=1,t=0){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  const icon=p.icon||'pea',bounce=Math.sin(t*2.3+x*.1)*2.5;
  ellipse(ctx,0,6,34,10,'#2d5b23');
  if(icon==='wall'){
    ellipse(ctx,0,-35,35,46,p.parts?.length>1?'#bf9256':'#bd965d');
    ellipse(ctx,-8,-50,9,5,'#e0bc83');ellipse(ctx,21,-22,7,9,'#a87c4e');
    circle(ctx,-11,-42,5,'#2f3121');circle(ctx,11,-42,5,'#2f3121');
    line(ctx,[[-6,-22],[0,-25],[8,-23]],'#54472f',3);
  }else{
    line(ctx,[[0,3],[2,-27],[3,-55+bounce]],'#33772e',9);
    leaf(ctx,-17,-14,-2.8);leaf(ctx,13,-17,-.4);
    if(icon==='sun'||icon==='twin'){
      const heads=icon==='twin'?[-19,19]:[0];
      for(const hx of heads){
        const hy=-61+bounce+(icon==='twin'?6:0);
        for(let i=0;i<11;i++){let a=i*PI*2/11;ellipse(ctx,hx+Math.cos(a)*27,hy+Math.sin(a)*27,10,17,'#f5bc43');}
        circle(ctx,hx,hy,25,'#f5d764');circle(ctx,hx,hy,19,'#e9a83e');
        circle(ctx,hx-8,hy-3,3.2,'#543d23');circle(ctx,hx+8,hy-3,3.2,'#543d23');
        line(ctx,[[hx-6,hy+8],[hx,hy+12],[hx+7,hy+7]],'#795229',2.2);
      }
    }else if(icon==='cherry'){
      line(ctx,[[-14,-56],[-3,-74],[14,-53]],'#477c33',5);
      circle(ctx,-16,-45+bounce,23,'#e94b3e');circle(ctx,16,-38+bounce,23,'#b72b34');
      circle(ctx,-22,-51+bounce,6,'#ff8d70');circle(ctx,10,-46+bounce,5,'#f46c62');
      for(const dx of [-20,14]){circle(ctx,dx,-39+bounce,3,'#371d22');}
    }else if(icon==='melon'){
      ellipse(ctx,0,-52+bounce,38,30,'#e4c15d');
      ellipse(ctx,13,-54+bounce,20,23,'#f4d776');
      circle(ctx,-11,-58+bounce,4,'#5a522f');circle(ctx,7,-58+bounce,4,'#5a522f');
      line(ctx,[[-7,-44],[0,-40],[8,-44]],'#736232',2);
      for(const dx of [-19,19]){circle(ctx,dx,-72+bounce,5,'#f9a63c');}
    }else{
      const icy=icon==='ice',fiery=icon==='fire';
      const body=icy?'#68c6dc':fiery?'#ed9b45':'#6dbb3d';
      const dark=icy?'#308a9e':fiery?'#b65b2c':'#3b852e';
      ellipse(ctx,-6,-53+bounce,31,29,dark);
      ellipse(ctx,-12,-61+bounce,25,23,body);
      ellipse(ctx,18,-53+bounce,28,18,body);
      ellipse(ctx,38,-51+bounce,16,13,dark);
      ellipse(ctx,43,-54+bounce,10,8,body);
      circle(ctx,-17,-65+bounce,5,'#263b2b');circle(ctx,-16,-66+bounce,1.7,'#fff');
      if(icy){for(const dx of [-16,2,18]){line(ctx,[[dx,-83+bounce],[dx+5,-96+bounce],[dx+11,-84+bounce]],'#bdf5fc',4);}}
      if(fiery){for(const dx of [-16,7,22]){ellipse(ctx,dx,-89+bounce,6,13,dx===7?'#ffe36c':'#fa733c');}}
    }
  }
  if(p.parts?.length>1){
    circle(ctx,27,-84,15,'#f2c456');
    text(ctx,'✦',27,-84,18,'#6d471d','900','center');
  }
  ctx.restore();
}
function paintZombie(ctx,z,t){
  ctx.save();ctx.translate(z.x,z.y);
  const foot=Math.sin(t*5+z.x*.02)*7;
  ellipse(ctx,0,5,32,9,'#1d331baa');
  line(ctx,[[-9,-35],[-12+foot,0]],'#424c50',15);
  line(ctx,[[13,-35],[12-foot,0]],'#424c50',15);
  ellipse(ctx,-15+foot,1,14,6,'#262c31');ellipse(ctx,17-foot,1,14,6,'#262c31');
  round(ctx,-27,-99,55,67,9);fill(ctx,z.subtype==='runner'?'#9c6e63':'#574c46');
  line(ctx,[[-20,-83],[-41,-52]],'#8c9e83',13);line(ctx,[[20,-83],[36,-62]],'#8c9e83',13);
  ellipse(ctx,0,-124,29,34,'#90a28a');
  ellipse(ctx,10,-129,22,26,'#a8baa0');
  ellipse(ctx,-11,-131,8,10,'#e9eee1');ellipse(ctx,10,-131,8,10,'#e9eee1');
  circle(ctx,-9,-131,3.5,'#31322b');circle(ctx,11,-130,3.5,'#31322b');
  ellipse(ctx,10,-111,15,8,'#4d4336');
  for(let i=0;i<4;i++)round(ctx,2+i*6,-117,5,9,1),fill(ctx,'#f0e5c0');
  if(z.subtype==='cone'){
    ctx.beginPath();ctx.moveTo(-30,-147);ctx.lineTo(0,-208);ctx.lineTo(29,-147);ctx.closePath();fill(ctx,'#e78c36');
    round(ctx,-35,-152,70,10,4);fill(ctx,'#d7792e');
    line(ctx,[[-13,-179],[15,-179]],'#fff2c2',6);
  }
  if(z.subtype==='bucket'){
    round(ctx,-31,-183,62,48,5);fill(ctx,'#8ca1aa');round(ctx,-35,-185,70,10,4);fill(ctx,'#c1d2d8');
    line(ctx,[[-18,-161],[19,-161]],'#637782',3);
  }
  if(z.subtype==='runner'){
    round(ctx,-28,-148,57,12,4);fill(ctx,'#d84e45');text(ctx,'⚡',1,-91,24,'#f0d463','900','center');
  }
  if(z.hp<z.maxHp){
    round(ctx,-28,-211,56,6,3);fill(ctx,'#372925');
    round(ctx,-28,-211,56*Math.max(0,z.hp/z.maxHp),6,3);fill(ctx,'#a6d35a');
  }
  ctx.restore();
}
function sun(ctx,s){
  const y=s.y+Math.sin(s.phase)*4;
  ctx.save();ctx.translate(s.x,y);
  for(let i=0;i<12;i++){const a=i*PI/6;ellipse(ctx,Math.cos(a)*29,Math.sin(a)*29,6,12,'#ffce59');}
  circle(ctx,0,0,27,'#ffe36e');circle(ctx,0,0,19,'#ffbb43');
  text(ctx,'☀',0,0,26,'#fff4a5','900','center');
  ctx.restore();
}
function drawBackground(ctx,t,BX,BY,CW,CH){
  const sky=ctx.createLinearGradient(0,0,0,820);
  sky.addColorStop(0,'#466d4d');sky.addColorStop(.5,'#6e9955');sky.addColorStop(1,'#304b2c');
  ctx.fillStyle=sky;ctx.fillRect(0,0,1440,820);
  for(let i=0;i<25;i++){
    const x=(i*151+39)%1440;
    ellipse(ctx,x,158+(i%4)*7,70,45,i%2?'#4f7940':'#5e8a48');
    ellipse(ctx,x-20,147+(i%4)*7,38,28,'#799956');
  }
  round(ctx,BX-15,BY-12,CW*9+30,CH*5+24,15);fill(ctx,'#2e4929');
  for(let r=0;r<5;r++)for(let c=0;c<9;c++){
    const x=BX+c*CW, y=BY+r*CH;
    ctx.fillStyle=(r+c)%2?'#76b24d':'#8cc55c';
    ctx.fillRect(x,y,CW,CH);
    ctx.fillStyle=(r+c)%2?'#6aab43':'#80bc51';
    for(let j=0;j<16;j++){
      const px=x+(j*47+r*23+c*11)%CW,py=y+(j*31+c*19+r*7)%CH;
      line(ctx,[[px,py+6],[px+2,py],[px+5,py+5]],'#ffffff10',1);
    }
    ctx.strokeStyle='#c0d88e61';ctx.lineWidth=1.6;ctx.strokeRect(x+.5,y+.5,CW,CH);
  }
  ctx.fillStyle='#456d32';ctx.fillRect(BX-33,BY-20,23,CH*5+40);
  for(let r=0;r<5;r++){
    const y=BY+(r+.7)*CH;
    ellipse(ctx,BX-29,y+15,30,9,'#244b28');
  }
}
function drawHud(ctx,state,SEEDS){
  const bg=ctx.createLinearGradient(0,0,0,159);bg.addColorStop(0,'#263c26');bg.addColorStop(1,'#1c301b');
  round(ctx,10,10,1420,147,18);fill(ctx,bg);stroke(ctx,'#789258',3);
  round(ctx,28,25,172,115,16);fill(ctx,'#354f2f');stroke(ctx,'#7fa257',2);
  circle(ctx,72,67,29,'#ffc953');text(ctx,'☀',72,67,32,'#fff0aa','900','center');
  text(ctx,String(state?.sun??200),130,68,32,'#ffe18b','900','center');
  text(ctx,'阳光储备',111,111,15,'#c6dcaf','700','center');
  for(let i=0;i<SEEDS.length;i++){
    const s=SEEDS[i],x=220+i*112,y=25;
    const cd=state?.cooldowns[i]||0,selected=state?.selected===i;
    round(ctx,x,y,103,113,12);fill(ctx,selected?'#dfb75c':'#456541');
    stroke(ctx,selected?'#fff3ae':'#83a365',selected?4:2);
    round(ctx,x+5,y+5,93,73,8);fill(ctx,'#b7d99b');
    paintPlant(ctx,{...s,parts:[s.id]},x+51,y+74,.49,state?.time||0);
    round(ctx,x+6,y+84,91,24,5);fill(ctx,'#293c29d9');
    text(ctx,s.name,x+51,y+97,13,'#faf2d6','750','center');
    round(ctx,x+65,y+4,34,23,6);fill(ctx,'#f4d278');
    text(ctx,String(s.cost),x+82,y+16,14,'#4c3b20','900','center');
    if(cd>0){
      round(ctx,x+5,y+5,93,103,9);fill(ctx,'#101a15b9');
      text(ctx,cd.toFixed(1)+'s',x+51,y+56,20,'#fff1cd','900','center');
    }
    text(ctx,String(i+1),x+13,y+15,12,'#fff','700','center');
  }
  round(ctx,1127,39,86,82,11);fill(ctx,state?.shovel?'#c7aa65':'#5b7750');stroke(ctx,state?.shovel?'#ffeaa9':'#9aad7e',2);
  text(ctx,'⚒',1170,69,36,'#f1e2bd','900','center');
  text(ctx,'铲子',1170,106,14,'#f8f2df','800','center');
  round(ctx,1251,39,159,82,11);fill(ctx,'#476442');stroke(ctx,'#819c70',2);
  text(ctx,state?.paused?'▶ 继续':'Ⅱ 暂停',1330,68,22,'#f3eabf','900','center');
  text(ctx,'SPACE',1330,104,13,'#c4d4b4','750','center');
}
function drawStatus(ctx,state){
  round(ctx,181,758,1053,49,12);fill(ctx,'#1c3225d9');stroke(ctx,'#76965b',1.5);
  const progress=Math.min(1,(state?.time||0)/170);
  round(ctx,316,778,560,11,6);fill(ctx,'#101e16');
  round(ctx,316,778,Math.max(4,560*progress),11,6);fill(ctx,'#e7b951');
  text(ctx,'第 '+(state?.wave||1)+' / 5 波',196,783,17,'#ffe3a0','900');
  text(ctx,'☠ '+(state?.kills||0)+' 击败',917,783,17,'#e9f1d5','800');
  const markerX=316+560*progress;circle(ctx,markerX,783,8,'#ffde8c');
  if(state?.messageTimer>0){round(ctx,490,165,460,37,14);fill(ctx,'#233d25e3');stroke(ctx,'#c1d985',1);text(ctx,state.message,720,183,19,'#fff4bc','850','center');}
  if(state?.paused){ctx.fillStyle='#06150899';ctx.fillRect(0,159,1440,599);text(ctx,'游戏暂停',720,424,64,'#fff4c7','900','center');text(ctx,'按空格或点击右上角继续',720,485,22,'#e5edcc','700','center');}
}
export function drawScene(ctx,state,opts){
  const {SEEDS,BOARD_X:BX,BOARD_Y:BY,CELL_W:CW,CELL_H:CH}=opts;
  ctx.clearRect(0,0,1440,820);
  drawBackground(ctx,state?.time||0,BX,BY,CW,CH);
  for(let r=0;r<5;r++){
    if(state?.mowers[r]){
      const y=BY+(r+.7)*CH;
      round(ctx,BX-67,y-35,51,43,8);fill(ctx,'#bd4835');stroke(ctx,'#ebaa5c',3);
      circle(ctx,BX-52,y+6,11,'#313e31');circle(ctx,BX-25,y+6,11,'#313e31');
      text(ctx,'✦',BX-43,y-15,24,'#ffd37c','900','center');
    }
  }
  if(state){
    if(state.pointer && (state.selected>=0||state.shovel)){
      const c=Math.floor((state.pointer.x-BX)/CW),r=Math.floor((state.pointer.y-BY)/CH);
      if(c>=0&&c<9&&r>=0&&r<5){
        ctx.fillStyle=state.shovel?'#ffb97255':'#f8f1c03b';ctx.fillRect(BX+c*CW,BY+r*CH,CW,CH);
        if(!state.shovel)paintPlant(ctx,{...SEEDS[state.selected],parts:[SEEDS[state.selected].id]},BX+(c+.5)*CW,BY+(r+.6)*CH,.7,state.time);
      }
    }
    for(let r=0;r<5;r++)for(let c=0;c<9;c++){
      const p=state.grid[r][c];if(!p)continue;
      const x=BX+(c+.5)*CW,y=BY+(r+.63)*CH;
      paintPlant(ctx,p,x,y,.88,state.time);
      if(p.hp<p.maxHp){round(ctx,x-31,y+11,62,6,3);fill(ctx,'#3d3a2d');round(ctx,x-31,y+11,62*Math.max(0,p.hp/p.maxHp),6,3);fill(ctx,'#b6e16e');}
    }
    const sorted=[...state.zombies].sort((a,b)=>a.y-b.y);
    for(const z of sorted)paintZombie(ctx,z,state.time);
    for(const p of state.projectiles){circle(ctx,p.x,p.y,p.radius+3,p.color+'66');circle(ctx,p.x,p.y,p.radius,p.color);circle(ctx,p.x-3,p.y-3,3,'#fff9d3');}
    for(const s of state.suns)sun(ctx,s);
    for(const e of state.effects){ctx.globalAlpha=Math.min(1,e.ttl/.45);circle(ctx,e.x,e.y,e.size,e.color);}ctx.globalAlpha=1;
  }
  drawHud(ctx,state,SEEDS);
  drawStatus(ctx,state);
}
