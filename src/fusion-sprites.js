/**
 * Original transparent artwork for 16 named high-tier fusion plants.
 * Atlas is a 4×4 grid of 256px tiles. These are reference-inspired
 * illustrations, not copied game assets, exact sprites or animations.
 */
export const FUSION_SPRITE_IDS=Object.freeze([
 'hypno-emperor','ultimate-cherry-shooter','ultimate-flame-torch','cherry-warrior',
 'ultimate-fume','sun-emperor-nut','steel-spikerock','doom-gatling',
 'frost-gatling-puff','star-emperor','ultimate-gloom','laser-pumpkin',
 'cob-ice','gold-magnet-nut','ultimate-gatling','ultimate-pumpkin'
]);
const indexById=new Map(FUSION_SPRITE_IDS.map((id,i)=>[id,i]));
const wide=new Set(['steel-spikerock','ultimate-flame-torch','ultimate-pumpkin','cherry-warrior']);
const tall=new Set(['ultimate-fume','ultimate-gloom','star-emperor','hypno-emperor','cob-ice']);
const image=typeof Image==='undefined'?null:new Image();
let ready=false,failed=false;
if(image){
 image.decoding='async';
 image.onload=()=>{ready=image.naturalWidth===1024&&image.naturalHeight===1024;failed=!ready;};
 image.onerror=()=>{ready=false;failed=true;};
 image.src=new URL('../assets/fusions-16.webp',import.meta.url).href;
}
export const fusionSpriteStatus=()=>({ready,failed,count:FUSION_SPRITE_IDS.length});
export function fusionTileRect(id){
 const i=indexById.get(id);
 return i===undefined?null:[(i%4)*256,Math.floor(i/4)*256,256,256];
}
export function drawFusionPlantSprite(ctx,plant,time=0){
 const rect=fusionTileRect(plant?.id);
 if(!ready||!rect||typeof ctx.drawImage!=='function')return false;
 const id=plant.id,width=wide.has(id)?141:115,height=tall.has(id)?150:wide.has(id)?130:126;
 const bob=Math.sin(time*2.1+(plant.age||0)*.1)*1.5;
 ctx.save();
 ctx.drawImage(image,...rect,-width/2,-height+bob+5,width,height);
 ctx.restore();
 return true;
}
