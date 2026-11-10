/**
 * Alpha 1.1 original fusion illustrations.
 * The SVG atlas has 16 independent transparent 256px cells.
 * Existing Alpha 1.0 and procedural renderers are preserved as fallbacks.
 */
export const FUSION_V8_SPRITE_IDS=Object.freeze([
 'aurora-star','volcano-torch','cherry-emperor','diamond-nut',
 'prism-pumpkin','void-gloom','cosmic-cattail','solar-fortress',
 'crystal-cannon','storm-gatling','poison-queen','meteor-melon',
 'inferno-cattail','butter-barrage','magnet-star','nightshade-pumpkin'
]);
const indexes=new Map(FUSION_V8_SPRITE_IDS.map((id,i)=>[id,i]));
const image=typeof Image==='undefined'?null:new Image();
let loaded=false,failed=false;
if(image){
 image.decoding='async';
 image.onload=()=>{loaded=image.naturalWidth===1024&&image.naturalHeight===1024;failed=!loaded;};
 image.onerror=()=>{loaded=false;failed=true;};
 image.src=new URL('../assets/fusions-v8.svg',import.meta.url).href;
}
export const fusionV8SpriteStatus=()=>({loaded,failed,count:FUSION_V8_SPRITE_IDS.length});
export function fusionV8SpriteRect(id){
 const i=indexes.get(id);
 return i===undefined?null:[(i%4)*256,Math.floor(i/4)*256,256,256];
}
export function drawFusionV8Sprite(ctx,plant,time=0){
 const rect=fusionV8SpriteRect(plant?.id);
 if(!loaded||!rect||typeof ctx.drawImage!=='function')return false;
 const w=129,h=139;
 const bob=Math.sin(time*2.1+(plant.age||0)*.15)*1.5;
 ctx.save();
 ctx.drawImage(image,...rect,-w/2,-h+bob+8,w,h);
 ctx.restore();
 return true;
}
