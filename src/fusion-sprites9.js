/**
 * Alpha 1.2 high-tier fusion illustrations.
 * A 4x4 transparent SVG atlas: eight newly illustrated Alpha 1.1 fusions
 * and eight Alpha 1.2 units. Previous renderer remains the fallback.
 */
export const FUSION_V9_SPRITE_IDS=Object.freeze([
 'sunburst-gatling','ice-laser-cactus','doom-lily','electric-starfruit',
 'glacial-wall','shadow-chomper','titan-cattail','volcanic-spikerock',
 'prism-cobcannon','inferno-prism','aurora-queen','titan-armor',
 'solar-void','cosmic-blast','meteor-barrage','storm-emperor'
]);
const locations=new Map(FUSION_V9_SPRITE_IDS.map((id,index)=>[id,index]));
let loaded=false,failed=false;
const atlas=typeof Image==='undefined'?null:new Image();
if(atlas){
 atlas.decoding='async';
 atlas.onload=()=>{
  loaded=atlas.naturalWidth===1024&&atlas.naturalHeight===1024;
  failed=!loaded;
 };
 atlas.onerror=()=>{loaded=false;failed=true;};
 atlas.src=new URL('../assets/fusions-v9.svg',import.meta.url).href;
}
export const fusionV9SpriteStatus=()=>({loaded,failed,count:FUSION_V9_SPRITE_IDS.length});
export function fusionV9SpriteRect(id){
 const index=locations.get(id);
 return index===undefined?null:[(index%4)*256,Math.floor(index/4)*256,256,256];
}
export function drawFusionV9Sprite(ctx,plant,time=0){
 const crop=fusionV9SpriteRect(plant?.id);
 if(!loaded||!crop||typeof ctx.drawImage!=='function')return false;
 const short=plant.id==='doom-lily'||plant.id==='volcanic-spikerock';
 const wide=['prism-cobcannon','meteor-barrage','storm-emperor'].includes(plant.id);
 const w=wide?146:short?138:129,h=short?106:wide?132:140;
 const bob=Math.sin(time*2.2+(plant.age||0)*.13)*1.6;
 ctx.save();
 ctx.drawImage(atlas,...crop,-w/2,-h+bob+8,w,h);
 ctx.restore();
 return true;
}
