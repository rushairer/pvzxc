import {SEEDS,RECIPES,getPlant,recipeFor} from './model.js';
import {BOARD,ENDLESS,ZOMBIE_IDS,newGame,plantHere,collectAt,tick} from './engine.js';
import {drawScene} from './render.js';
import {saveGame,loadGame,listSaves,deleteSave} from './save.js';

const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d');
const LOGICAL_WIDTH=1440,LOGICAL_HEIGHT=820,PAGE_SIZE=7;
function configureResolution(){
 const dpr=Math.min(2,Math.max(1,window.devicePixelRatio||1));
 const width=Math.round(LOGICAL_WIDTH*dpr),height=Math.round(LOGICAL_HEIGHT*dpr);
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 ctx.setTransform(canvas.width/LOGICAL_WIDTH,0,0,canvas.height/LOGICAL_HEIGHT,0,0);
}
configureResolution();
window.addEventListener('resize',configureResolution);
const overlay=$('mainOverlay'),guide=$('guideOverlay'),saveOverlay=$('saveOverlay');
const primary=$('primaryAction'),secondary=$('secondaryAction'),free=$('freeAction');
const heading=$('overlayTitle'),description=$('overlayDescription'),recipeGrid=$('recipeGrid');
let game=null,scene='menu',last=performance.now(),autosaveElapsed=0,audio=null,saveReturnPause=false;
function tone(freq=440,duration=.08){
 try{
  audio??=new (window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended')audio.resume();
  const oscillator=audio.createOscillator(),gain=audio.createGain();
  oscillator.frequency.setValueAtTime(freq,audio.currentTime);
  gain.gain.setValueAtTime(.022,audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
  oscillator.connect(gain);gain.connect(audio.destination);
  oscillator.start();oscillator.stop(audio.currentTime+duration);
 }catch{}
}
function notify(text){
 $('saveIndicator').textContent=text;
}
function updateResume(){
 let entries=[];
 try{entries=listSaves();}catch{}
 const autosave=entries.find(e=>e.slot==='auto');
 free.disabled=!autosave?.exists;
 free.textContent=autosave?.exists?'↻ 继续自动存档 · 第 '+autosave.wave+' 波':'↻ 暂无自动存档';
}
function menu(){
 if(game&&game.phase==='playing')try{saveGame(game,'auto');}catch{}
 scene='menu';game=null;
 heading.textContent='融合无尽';
 description.textContent='所有49张经典植物卡牌与115种融合配方开局开放。无尽尸潮会持续升级，看你能坚持多少波。';
 primary.textContent='▶ 新建无尽战场';secondary.textContent='✦ 融合图鉴';
 free.hidden=false;$('loadAction').hidden=false;
 updateResume();overlay.classList.add('is-visible');
}
function start(g=null){
 game=g||newGame();game.paused=false;
 scene='playing';autosaveElapsed=0;
 overlay.classList.remove('is-visible');closeGuide();closeSave(false);
 free.hidden=true;$('loadAction').hidden=true;
 notify(g?'已恢复第 '+game.wave+' 波存档':'新战场已建立 · 已解锁所有植物');
 tone(g?740:610);
}
function endScreen(){
 if(!game||scene!=='playing')return;
 scene='result';
 heading.textContent='第 '+game.wave+' 波 · 防线失守';
 description.textContent='你击败了 '+game.kills+' 个僵尸，累计收集 '+game.totalSuns+' 阳光，曾融合 '+game.solved.size+' 种植物。可以新开战场或读取以前的存档。';
 primary.textContent='↻ 重新开始无尽模式';
 free.hidden=true;$('loadAction').hidden=false;
 overlay.classList.add('is-visible');tone(190,.22);
}
function openGuide(){
 guide.classList.add('is-visible');guide.setAttribute('aria-hidden','false');
 $('recipeSearch').focus({preventScroll:true});
}
function closeGuide(){
 guide.classList.remove('is-visible');guide.setAttribute('aria-hidden','true');
}
function saveMessage(message){$('saveMessage').textContent=message;notify(message);}
function writeSave(slot){
 if(!game||game.phase!=='playing'){saveMessage('需要先开始一局进行中的无尽游戏');return;}
 try{saveGame(game,slot);tone(810);saveMessage('已保存 '+slotName(slot)+'：第 '+game.wave+' 波');renderSlots();}
 catch(e){saveMessage('保存失败：'+e.message);}
}
function readSave(slot){
 try{
  const resumed=loadGame(slot);
  if(!resumed){saveMessage('此槽位没有存档');return;}
  if(resumed.phase==='lost'){saveMessage('此存档已经结束，无法继续');return;}
  start(resumed);
  notify('已载入 '+slotName(slot)+'，第 '+game.wave+' 波');
 }catch(e){saveMessage(e.message);}
}
function slotName(slot){return slot==='auto'?'自动存档':'手动存档 '+slot.replace('slot','');}
function renderSlots(){
 const wrapper=$('saveSlots');wrapper.replaceChildren();
 let slots;
 try{slots=listSaves();}
 catch(error){saveMessage('浏览器禁止了本地存储，请检查隐私设置：'+error.message);return;}
 for(const slot of slots){
  const item=document.createElement('div');item.className='save-slot';
  const details=document.createElement('div');details.className='save-slot-info';
  const label=document.createElement('strong');label.textContent=slotName(slot.slot);
  const meta=document.createElement('small');
  meta.textContent=slot.exists?'第 '+slot.wave+' 波 · '+slot.kills+' 击败 · '+new Date(slot.savedAt).toLocaleString('zh-CN'):(slot.invalid?'存档损坏':'空槽位');
  details.append(label,meta);
  const actions=document.createElement('div');actions.className='save-slot-actions';
  function action(text,fn,disabled=false){const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=disabled;b.addEventListener('click',fn);actions.append(b);}
  action('保存',()=>writeSave(slot.slot),!game||game.phase!=='playing');
  action('读取',()=>readSave(slot.slot),!slot.exists);
  action('删除',()=>{if(!window.confirm('确定删除 '+slotName(slot.slot)+' 吗？此操作不可撤销。'))return;
   try{deleteSave(slot.slot);renderSlots();saveMessage('已删除 '+slotName(slot.slot));updateResume();}catch(e){saveMessage(e.message);}},!slot.exists);
  item.append(details,actions);wrapper.append(item);
 }
}
function openSave(){
 saveReturnPause=game?.paused||false;
 if(game)game.paused=true;
 saveOverlay.classList.add('is-visible');saveOverlay.setAttribute('aria-hidden','false');
 $('saveMessage').textContent='';renderSlots();
}
function closeSave(restorePause=true){
 saveOverlay.classList.remove('is-visible');saveOverlay.setAttribute('aria-hidden','true');
 if(restorePause&&game&&scene==='playing')game.paused=saveReturnPause;
}
$('headerHelp').addEventListener('click',openGuide);
$('closeGuide').addEventListener('click',closeGuide);
$('closeSave').addEventListener('click',()=>closeSave());
guide.addEventListener('click',ev=>{if(ev.target===guide)closeGuide();});
saveOverlay.addEventListener('click',ev=>{if(ev.target===saveOverlay)closeSave();});
primary.addEventListener('click',()=>start());
free.addEventListener('click',()=>readSave('auto'));
secondary.addEventListener('click',openGuide);
$('loadAction').addEventListener('click',openSave);
$('quickSave').addEventListener('click',()=>{if(scene==='playing')writeSave('slot1');else openSave();});
$('quickLoad').addEventListener('click',openSave);
$('toMenu').addEventListener('click',menu);
for(const recipe of RECIPES){
 const card=document.createElement('article');card.className='recipe';
 const label=document.createElement('strong');
 label.textContent=recipe.inputs.map(id=>getPlant(id)?.name||id).join(' + ')+' → '+recipe.name;
 const detail=document.createElement('small');detail.textContent=recipe.desc;
 if(recipe.approximate){const flag=document.createElement('span');flag.className='approx-flag';flag.textContent='近似';label.append(' ',flag);}
 card.dataset.search=[recipe.name,recipe.desc,...recipe.inputs.map(id=>getPlant(id)?.name||id)].join(' ').toLocaleLowerCase('zh-CN');
 card.append(label,detail);recipeGrid.append(card);
}
$('recipeCount').textContent=RECIPES.length+' 条';
$('recipeSearch').addEventListener('input',()=>{
 const term=$('recipeSearch').value.trim().toLocaleLowerCase('zh-CN');
 let count=0;
 for(const card of recipeGrid.children){card.hidden=!card.dataset.search.includes(term);if(!card.hidden)count++;}
 $('recipeCount').textContent=count+' / '+RECIPES.length+' 条';
});
function point(ev){
 const rect=canvas.getBoundingClientRect();
 return {x:(ev.clientX-rect.left)*LOGICAL_WIDTH/rect.width,y:(ev.clientY-rect.top)*LOGICAL_HEIGHT/rect.height};
}
function canvasAction(x,y){
 if(!game||scene!=='playing'||game.paused||guide.classList.contains('is-visible')||saveOverlay.classList.contains('is-visible'))return;
 if(collectAt(game,x,y)){tone(740);return;}
 if(y>=10&&y<=155){
  if(x>=219&&x<219+PAGE_SIZE*112){
   const index=Math.floor((x-219)/112)+game.page*PAGE_SIZE,seed=game.decks[index];
   if(seed){game.selected=game.selected===seed.id?null:seed.id;game.shovel=false;tone(420);}return;
  }
  if(x>=1003&&x<=1117){
   const pages=Math.ceil(game.decks.length/PAGE_SIZE);
   game.page=(game.page+(x<1060?-1:1)+pages)%pages;tone(500);return;
  }
  if(x>=1122&&x<=1224){game.shovel=!game.shovel;game.selected=null;tone(330);return;}
  if(x>=1246){game.paused=!game.paused;tone(390);return;}
 }
 const col=Math.floor((x-BOARD.x)/BOARD.cw),row=Math.floor((y-BOARD.y)/BOARD.ch);
 if(col>=0&&col<9&&row>=0&&row<5){
  const before=game.grid[row][col];
  if(plantHere(game,row,col,game.selected))tone(before?820:540);
 }
}
canvas.addEventListener('pointerdown',ev=>{ev.preventDefault();const p=point(ev);canvasAction(p.x,p.y);});
canvas.addEventListener('pointermove',ev=>{if(game)game.hover=point(ev);});
canvas.addEventListener('pointerleave',()=>{if(game)game.hover=null;});
canvas.addEventListener('contextmenu',ev=>{ev.preventDefault();if(game){game.selected=null;game.shovel=false;}});
document.addEventListener('keydown',ev=>{
 if((ev.metaKey||ev.ctrlKey)&&ev.key.toLowerCase()==='s'){
  ev.preventDefault();if(game)writeSave('slot1');else openSave();return;
 }
 if(ev.key==='Escape'&&guide.classList.contains('is-visible')){closeGuide();return;}
 if(ev.key==='Escape'&&saveOverlay.classList.contains('is-visible')){closeSave();return;}
 if(!game||scene!=='playing'||saveOverlay.classList.contains('is-visible')||guide.classList.contains('is-visible'))return;
 if(/^[1-7]$/.test(ev.key)){game.selected=game.decks[game.page*PAGE_SIZE+Number(ev.key)-1]?.id||null;game.shovel=false;}
 if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){
  const pages=Math.ceil(game.decks.length/PAGE_SIZE);
  game.page=(game.page+(ev.key==='ArrowLeft'?-1:1)+pages)%pages;ev.preventDefault();
 }
 if(ev.key==='0'||ev.key.toLowerCase()==='x'){game.shovel=!game.shovel;game.selected=null;}
 if(ev.code==='Space'){ev.preventDefault();game.paused=!game.paused;}
 if(ev.key==='Escape'){game.selected=null;game.shovel=false;}
});
function autosave(){
 if(!game||scene!=='playing'||game.phase!=='playing')return;
 try{saveGame(game,'auto');notify('自动存档已更新 · 第 '+game.wave+' 波');}catch(e){notify('自动存档失败：'+e.message);}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')autosave();});
window.addEventListener('pagehide',autosave);
function frame(now){
 const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
 if(game&&scene==='playing'){
  tick(game,dt);
  if(!game.paused){
   autosaveElapsed+=dt;if(autosaveElapsed>=15){autosaveElapsed=0;autosave();}
  }
  if(game.phase==='lost')endScreen();
 }
 drawScene(ctx,game,{SEEDS,RECIPES,BOARD,ENDLESS,ZOMBIE_IDS,getPlant,recipeFor});
 requestAnimationFrame(frame);
}
menu();requestAnimationFrame(frame);
