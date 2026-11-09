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
export function drawZombieSprite(c,z,t=0){
 const dimensions=zombies[z?.type];if(!dimensions)return false;
 c.save();
 c.translate(Math.sin(t*5+(z.anim||0))*1.6,0);
 const painted=draw(c,z.type,dimensions[0],dimensions[1],t);
 c.restore();
 return painted;
}
export const SPRITE_ATLAS_IDS=Object.freeze({
 plants:Object.keys(plants),zombies:Object.keys(zombies)
});
