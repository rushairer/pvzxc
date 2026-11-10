import test from 'node:test';
import assert from 'node:assert/strict';

test('the real browser entrypoint supports endless start, save, load and catalog search',async()=>{
 const listeners=new Map(),elements=new Map(),store=new Map();
 const makeNode=(name='div')=>{
  const classes=new Set(),events=new Map();
  const node={
   name,children:[],dataset:{},hidden:false,disabled:false,textContent:'',
   value:'',style:{},attributes:{},scrollTop:0,
   classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)},
   addEventListener:(type,cb)=>events.set(type,cb),
   fire:(type,arg={})=>{const fn=events.get(type);assert.ok(fn,'missing handler '+name+'.'+type);return fn({target:node,preventDefault(){},...arg});},
   append(...items){node.children.push(...items);},
   appendChild(item){node.children.push(item);},
   replaceChildren(){node.children.length=0;},
   setAttribute(k,v){node.attributes[k]=v;},
   focus(){},
   getContext(){return {setTransform(){}};},
   getBoundingClientRect(){return {left:0,top:0,width:1440,height:820};}
  };return node;
 };
 globalThis.document={
  getElementById(id){if(!elements.has(id))elements.set(id,makeNode(id));return elements.get(id);},
  createElement(tag){return makeNode(tag);},
  addEventListener(type,fn){listeners.set(type,fn);},
  visibilityState:'visible'
 };
 globalThis.window={devicePixelRatio:1,addEventListener(){},confirm(){return true;}};
 globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 globalThis.requestAnimationFrame=()=>1;
 try{
  await import('../src/main.js?test=ui-endless-1');
  const el=id=>elements.get(id);
  assert.equal(el('primaryAction').textContent,'▶ 新建无尽战场');
  assert.equal(el('freeAction').disabled,true);
  assert.equal(el('recipeGrid').children.length,349);
  el('primaryAction').fire('click');
  assert.equal(el('deckOverlay').classList.contains('is-visible'),true);
  assert.equal(el('deckSelected').children.length,10);
  assert.equal(el('deckConfirm').disabled,true);
  assert.equal(el('deckLibrary').children.length,398);
  // Picking or removing a card must preserve the same scrollable list and DOM nodes.
  const library=el('deckLibrary');
  library.scrollTop=1180;
  const farCard=library.children[140],firstCard=library.children[0];
  assert.match(farCard.children[1].textContent,/☀ .* 阳光/);
  farCard.fire('click');
  assert.equal(library.scrollTop,1180);
  assert.equal(library.children[140],farCard);
  assert.equal(library.children[0],firstCard);
  assert.equal(farCard.attributes['aria-pressed'],'true');
  assert.match(el('deckSelected').children[0].children[1].textContent,/☀ .* 阳光/);
  farCard.fire('click');
  assert.equal(library.scrollTop,1180);
  assert.equal(library.children[140],farCard);
  assert.equal(farCard.attributes['aria-pressed'],'false');
  el('deckDefault').fire('click');
  assert.equal(library.scrollTop,1180);
  assert.equal(library.children[140],farCard);
  assert.equal(el('deckConfirm').disabled,false);
  el('deckConfirm').fire('click');
  assert.equal(el('mainOverlay').classList.contains('is-visible'),false);
  assert.equal(el('deckOverlay').classList.contains('is-visible'),false);
  el('quickSave').fire('click');
  assert.ok(store.has('pvzxc.endless.v1.slot1'));
  el('quickLoad').fire('click');
  assert.equal(el('saveSlots').children.length,4);
  const slot3=el('saveSlots').children[3];
  slot3.children[1].children[0].fire('click');
  assert.ok(store.has('pvzxc.endless.v1.slot3'));
  el('closeSave').fire('click');
  el('toMenu').fire('click');
  assert.ok(store.has('pvzxc.endless.v1.auto'));
  assert.equal(el('freeAction').disabled,false);
  el('freeAction').fire('click');
  assert.equal(el('mainOverlay').classList.contains('is-visible'),false);
  assert.match(el('saveIndicator').textContent,/已载入/);
  el('secondaryAction').fire('click');
  assert.equal(el('guideOverlay').classList.contains('is-visible'),true);
  el('recipeSearch').value='西瓜';
  el('recipeSearch').fire('input');
  assert.ok(el('recipeGrid').children.filter(c=>!c.hidden).length>0);
  el('recipeSearch').value='';el('recipeSearch').fire('input');
  el('closeGuide').fire('click');
  assert.equal(el('guideOverlay').classList.contains('is-visible'),false);
  // Plant in slot 1 (sunflower) and move it using the two-step glove tool.
  el('game').fire('pointerdown',{clientX:220,clientY:20});
  el('game').fire('pointerdown',{clientX:240,clientY:258});
  el('game').fire('pointerdown',{clientX:860,clientY:55});
  el('game').fire('pointerdown',{clientX:240,clientY:258});
  el('game').fire('pointerdown',{clientX:365,clientY:366});
  el('quickSave').fire('click');
  const state=JSON.parse(store.get('pvzxc.endless.v1.slot1')).state;
  assert.equal(state.deckIds.length,10);
  assert.equal(state.grid[1][1].id,'sun');
  assert.equal(state.gloveCooldown.plant,10);
 }finally{
  for(const key of ['document','window','localStorage','requestAnimationFrame'])delete globalThis[key];
 }
});
