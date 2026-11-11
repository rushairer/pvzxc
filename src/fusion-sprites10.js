/**
 * Alpha 1.3 - second batch of sixteen illustrated advanced fusion plants.
 * Each of the sixteen remaining Alpha 1.2 species now has a unique art tile.
 * Original SVG art, not original game assets. Older sprite stages remain fallback.
 */
export const FUSION_V10_SPRITE_IDS=Object.freeze([
 'ice-magnet-cannon','nightmare-chomper','volcanic-aurora','frostfire-star',
 'doom-spikerock','electric-cannon','glacial-emperor','titan-homing',
 'shadow-queen','solar-meteor','crystal-spike','butter-void',
 'inferno-star','prism-armor','doom-emperor','golden-garden'
]);
const cells=new Map(FUSION_V10_SPRITE_IDS.map((id,i)=>[id,i]));
const image=typeof Image==='undefined'?null:new Image();
let loaded=false,failed=false;
if(image){
 image.decoding='async';
 image.onload=()=>{
  loaded=image.naturalWidth===1024&&image.naturalHeight===1024;
  failed=!loaded;
 };
 image.onerror=()=>{loaded=false;failed=true;};
 image.src=new URL('../assets/fusions-v10.svg',import.meta.url).href;
}
export const fusionV10SpriteStatus=()=>({loaded,failed,count:cells.size});
export function fusionV10SpriteRect(id){
 const i=cells.get(id);
 return i===undefined?null:[(i%4)*256,Math.floor(i/4)*256,256,256];
}
export function drawFusionV10Sprite(c,plant,t=0){
 const rect=fusionV10SpriteRect(plant?.id);
 if(!loaded||!rect||typeof c.drawImage!=='function')return false;
 const small=['doom-spikerock','crystal-spike'].includes(plant.id);
 const wide=['electric-cannon','ice-magnet-cannon','butter-void','doom-emperor'].includes(plant.id);
 const w=wide?147:small?145:129,h=small?100:wide?132:139;
 const bob=Math.sin(t*2.4+(plant.age||0)*.14)*1.6;
 c.save();
 c.drawImage(image,...rect,-w/2,-h+8+bob,w,h);
 c.restore();
 return true;
}
