import {SEEDS,RECIPES,getPlant,recipeFor} from './model.js';
import {BOARD,LEVELS,newGame,plantHere,collectAt,tick,message} from './engine.js';
import {drawScene} from './render.js';

const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const LOGICAL_WIDTH=1440,LOGICAL_HEIGHT=820;
function configureResolution(){
 const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
 const width=Math.round(LOGICAL_WIDTH*dpr),height=Math.round(LOGICAL_HEIGHT*dpr);
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 ctx.setTransform(canvas.width/LOGICAL_WIDTH,0,0,canvas.height/LOGICAL_HEIGHT,0,0);
}
configureResolution();
window.addEventListener('resize',configureResolution);
const overlay=document.getElementById('mainOverlay'),guide=document.getElementById('guideOverlay');
const primary=document.getElementById('primaryAction'),secondary=document.getElementById('secondaryAction');
const heading=document.getElementById('overlayTitle'),description=document.getElementById('overlayDescription');
const recipeGrid=document.getElementById('recipeGrid');
const LS_KEY='pvzxc.progress.v2';
let best=1,last=performance.now(),game=null,lastPhase='menu',scene='menu',audio=null;
const PAGE_SIZE=7;
try{best=Math.max(1,Math.min(LEVELS.length,Number(localStorage.getItem(LS_KEY))||1));}catch{}
function sound(frequency=440,duration=.1,type='sine',volume=.025){
 try{
  audio??=new (window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended')audio.resume();
  const oscillator=audio.createOscillator(),gain=audio.createGain();
  oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,audio.currentTime);
  gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
  oscillator.connect(gain).connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+duration);
 }catch{}
}
function menu(){
 scene='menu';game=null;heading.textContent='融合花园';
 description.textContent='按照融合版的白天关卡规则，从基础植物一步步融合进阶。守住五路草坪！';
 primary.textContent='▶ 开始冒险';secondary.textContent='融合图鉴';
 document.getElementById('freeAction').hidden=false;
 overlay.classList.add('is-visible');
}
function start(level=best,freeMode=false){
 game=newGame(level,freeMode);scene='playing';lastPhase='playing';
 document.getElementById('freeAction').hidden=true;
 overlay.classList.remove('is-visible');sound(650,.12,'triangle');
}
function showResult(){
 if(!game)return;
 scene='result';lastPhase=game.phase;overlay.classList.add('is-visible');
 const won=game.phase==='won';
 heading.textContent=won?'草坪守住了！':'僵尸吃掉了你的脑子！';
 description.textContent=(won?'成功守住 '+game.def.name+'。':'防守失败，请调整植物布局重新挑战。')
  +' 本关击败 '+game.kills+' 个僵尸，收集 '+game.totalSuns+' 阳光，解锁 '+game.solved.size+' 种融合。';
 if(won&&game.level>=best){best=Math.min(LEVELS.length,game.level+1);try{localStorage.setItem(LS_KEY,String(best));}catch{}}
 primary.textContent=won&&game.level<LEVELS.length?'▶ 下一关':'↻ 再玩一次';
 secondary.textContent='查看融合图鉴';
 sound(won?760:150,.3,won?'triangle':'sawtooth');
}
function openGuide(){
 guide.classList.add('is-visible');guide.setAttribute('aria-hidden','false');
 document.getElementById('recipeSearch').focus({preventScroll:true});
}
function closeGuide(){
 guide.classList.remove('is-visible');guide.setAttribute('aria-hidden','true');
}
document.getElementById('headerHelp').addEventListener('click',openGuide);
document.getElementById('freeAction').addEventListener('click',()=>start(5,true));
document.getElementById('closeGuide').addEventListener('click',closeGuide);
guide.addEventListener('click',ev=>{if(ev.target===guide)closeGuide();});
primary.addEventListener('click',()=>{
 if(scene==='result'&&game){
  const level=game.phase==='won'?Math.min(LEVELS.length,game.level+1):game.level;
  start(level,game.freeMode);
 }else start(best);
});
secondary.addEventListener('click',openGuide);
for(const recipe of RECIPES){
 const card=document.createElement('article');card.className='recipe';
 const label=document.createElement('strong');
 label.textContent=recipe.inputs.map(id=>getPlant(id)?.name||id).join(' + ')+' → '+recipe.name;
 const detail=document.createElement('small');detail.textContent=recipe.desc;
 card.dataset.search=[recipe.name,recipe.desc,...recipe.inputs.map(id=>getPlant(id)?.name||id)].join(' ').toLocaleLowerCase('zh-CN');
 card.append(label,detail);recipeGrid.append(card);
}
const recipeSearch=document.getElementById('recipeSearch');
const recipeCount=document.getElementById('recipeCount');
recipeSearch.addEventListener('input',()=>{
 const term=recipeSearch.value.trim().toLocaleLowerCase('zh-CN');
 let shown=0;
 for(const card of recipeGrid.children){
  const matched=card.dataset.search.includes(term);
  card.hidden=!matched;if(matched)shown++;
 }
 recipeCount.textContent=shown+' / '+RECIPES.length+' 条';
});
function point(ev){
 const r=canvas.getBoundingClientRect();
 return{x:(ev.clientX-r.left)*LOGICAL_WIDTH/r.width,y:(ev.clientY-r.top)*LOGICAL_HEIGHT/r.height};
}
function pointerAction(x,y){
 if(!game||scene!=='playing'||game.paused||guide.classList.contains('is-visible'))return;
 if(collectAt(game,x,y)){sound(770,.08,'triangle');return;}
 if(y>=13&&y<=150){
  if(x>=219&&x<219+PAGE_SIZE*112){
   const i=Math.floor((x-219)/112)+game.page*PAGE_SIZE;
   const seed=game.decks[i];
   if(seed){game.selected=game.selected===seed.id?null:seed.id;game.shovel=false;sound(460,.06);}
   return;
  }
  if(x>=1003&&x<=1117){
   const pages=Math.max(1,Math.ceil(game.decks.length/PAGE_SIZE));
   game.page=(game.page+(x<1060?-1:1)+pages)%pages;sound(530,.07);return;
  }
  if(x>=1122&&x<=1224){game.shovel=!game.shovel;game.selected=null;sound(330,.07);return;}
  if(x>=1246){game.paused=!game.paused;sound(420,.07);return;}
 }
 const c=Math.floor((x-BOARD.x)/BOARD.cw),r=Math.floor((y-BOARD.y)/BOARD.ch);
 if(c>=0&&c<9&&r>=0&&r<5){
  const old=game.grid[r][c];
  if(plantHere(game,r,c,game.selected)){sound(old?810:520,.12,old?'triangle':'sine');}
 }
}
canvas.addEventListener('pointerdown',ev=>{ev.preventDefault();const p=point(ev);pointerAction(p.x,p.y);});
canvas.addEventListener('pointermove',ev=>{if(game)game.hover=point(ev);});
canvas.addEventListener('pointerleave',()=>{if(game)game.hover=null;});
canvas.addEventListener('contextmenu',ev=>{ev.preventDefault();if(game){game.selected=null;game.shovel=false;}});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'&&guide.classList.contains('is-visible')){closeGuide();return;}
 if(!game||scene!=='playing'||guide.classList.contains('is-visible'))return;
 if(/^[1-7]$/.test(ev.key)){game.selected=game.decks[game.page*PAGE_SIZE+Number(ev.key)-1]?.id||null;game.shovel=false;}
 if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'||ev.key==='Tab'&&!ev.shiftKey){
   const pages=Math.max(1,Math.ceil(game.decks.length/PAGE_SIZE));game.page=(game.page+(ev.key==='ArrowLeft'?-1:1)+pages)%pages;
   if(ev.key==='Tab')ev.preventDefault();
 }
 if(ev.key==='0'||ev.key.toLowerCase()==='x'){game.shovel=!game.shovel;game.selected=null;}
 if(ev.code==='Space'){ev.preventDefault();game.paused=!game.paused;}
 if(ev.key==='Escape'){game.selected=null;game.shovel=false;}
});
function frame(now){
 const dt=(now-last)/1000;last=now;
 if(game){
  tick(game,dt);
  if((game.phase==='won'||game.phase==='lost')&&lastPhase==='playing')showResult();
 }
 drawScene(ctx,game,{SEEDS,RECIPES,BOARD,LEVELS,best,getPlant,recipeFor});
 requestAnimationFrame(frame);
}
menu();
requestAnimationFrame(frame);
