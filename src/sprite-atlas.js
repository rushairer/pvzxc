/**
 * Original hand-painted character illustrations, isolated from the concept art.
 * One transparent atlas avoids extra fetches during gameplay.
 * Existing Canvas drawing functions remain fallback for all other units.
 */
const spriteRects = Object.freeze({
  sun:       [6,37,130,176],
  pea:       [148,52,130,161],
  wall:      [290,62,130,151],
  torch:     [432,61,130,152],
  chomper:   [575,32,128,181],
  starfruit: [716,77,130,136],
  normal:    [2,229,138,202],
  cone:      [156,221,113,210],
  bucket:    [300,221,110,210],
  pole:      [428,249,138,182]
});
const plants = Object.freeze({
  sun: [82,112],
  pea: [94,116],
  wall: [105,112],
  torch: [103,121],
  chomper: [97,130],
  starfruit: [112,110]
});
const zombies = Object.freeze({
  normal: [106,169],
  cone: [91,184],
  bucket: [91,183],
  pole: [132,174]
});
const image = typeof Image === 'undefined' ? null : new Image();
let ready=false;
let failed=false;
if(image){
 image.decoding='async';
 image.onload=()=>{ready=image.naturalWidth>=850&&image.naturalHeight>=430;};
 image.onerror=()=>{failed=true;};
 image.src=new URL('../assets/character-atlas.webp',import.meta.url).href;
}
export function isSpriteAtlasReady(){return ready&&!failed;}
export function spriteAtlasStatus(){return {ready:isSpriteAtlasReady(),failed};}
function draw(c,key,w,h,t=0){
 if(!isSpriteAtlasReady()||typeof c.drawImage!=='function')return false;
 const coords=spriteRects[key];if(!coords)return false;
 c.save();
 const bob=Math.sin(t*2.5)*1.25;
 c.drawImage(image,coords[0],coords[1],coords[2],coords[3],-w/2,-h+bob,w,h);
 c.restore();
 return true;
}
export function drawPlantSprite(c,plant,t=0){
 const primary=plant?.parts?.[0]||plant?.id;
 const dimensions=plants[primary];
 if(!dimensions)return false;
 return draw(c,primary,dimensions[0],dimensions[1],t);
}
// Second wave: 16 transparent 4×4 zombie illustrations. The four original
// sprites remain available when the larger atlas has not loaded.
export const ZOMBIE_ATLAS_IDS=Object.freeze([
 'normal','flag','cone','bucket',
 'pole','screen','newspaper','football',
 'dancer','backup','ladder','jack',
 'digger','balloon','snorkel','dolphin'
]);
const ZOMBIE_TILE=256;
const zombieTileIndex=new Map(ZOMBIE_ATLAS_IDS.map((id,i)=>[id,i]));
const zombieSizes=Object.freeze({
 normal:[108,176],flag:[112,205],cone:[105,189],bucket:[107,191],
 pole:[148,174],screen:[116,185],newspaper:[118,179],football:[133,186],
 dancer:[118,177],backup:[111,174],ladder:[142,191],jack:[112,178],
 digger:[118,181],balloon:[110,219],snorkel:[118,182],dolphin:[163,174]
});
const zombieAtlasImage=typeof Image==='undefined'?null:new Image();
let zombieReady=false,zombieFailed=false;
if(zombieAtlasImage){
 zombieAtlasImage.decoding='async';
 zombieAtlasImage.onload=()=>{
  zombieReady=zombieAtlasImage.naturalWidth===1024&&zombieAtlasImage.naturalHeight===1024;
  zombieFailed=!zombieReady;
 };
 zombieAtlasImage.onerror=()=>{zombieReady=false;zombieFailed=true;};
 zombieAtlasImage.src=new URL('../assets/zombies-16.webp',import.meta.url).href;
}
export function zombieAtlasStatus(){return {ready:zombieReady,failed:zombieFailed,count:ZOMBIE_ATLAS_IDS.length};}
export function zombieTileRect(type){
 const i=zombieTileIndex.get(type);
 return i===undefined?null:[(i%4)*ZOMBIE_TILE,Math.floor(i/4)*ZOMBIE_TILE,ZOMBIE_TILE,ZOMBIE_TILE];
}

export function drawZombieSprite(c,z,t=0){
 const type=z?.type;
 const tile=zombieTileRect(type);
 if(zombieReady&&tile&&typeof c.drawImage==='function'){
  const [width,height]=zombieSizes[type];
  c.save();
  c.translate(z.frozen>0||z.butter>0?0:Math.sin((z.anim||0)*5.2)*.45,0);
  // Diggers reverse direction after surfacing on the defender's side.
  if(z.returning&&typeof c.scale==='function')c.scale(-1,1);
  const bounce=z.frozen>0||z.butter>0?0:Math.sin((z.anim||0)*3.2)*.35;
  c.drawImage(zombieAtlasImage,...tile,-width/2,-height+bounce,width,height);
  c.restore();
  return true;
 }
 // Offline or image decode failure: keep existing four hand-painted sprites.
 const dimensions=zombies[type];if(!dimensions)return false;
 c.save();
 c.translate(Math.sin(t*5+(z.anim||0))*1.6,0);
 const painted=draw(c,type,dimensions[0],dimensions[1],t);
 c.restore();
 return painted;
}
export const SPRITE_ATLAS_IDS=Object.freeze({
 plants:Object.keys(plants),zombies:Object.keys(zombies)
});
