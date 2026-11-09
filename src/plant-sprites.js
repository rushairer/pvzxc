/**
 * Alpha 0.8 — complete base-plant raster atlas.
 * All 49 base plants have a dedicated transparent 256×256 tile.
 * Fusion species resolve their materials recursively and show a branched,
 * smaller companion illustration in addition to their existing effects.
 * The original Canvas artwork remains an asset-loading fallback.
 */
import {getPlant} from './model.js';

const IDS=[
 'pea','sun','cherry','wall','potato','chomper','puff','fume','ice-shroom','squash','threepeater','jalapeno','spikeweed','torch','cabbage','melon',
 'hypno','scaredy','doom','cactus','blover','starfruit','pumpkin','magnet','kernel','garlic','marigold','tallnut','spikerock',
 'snowpea','repeater-base','sunshroom-base','gravebuster','lilypad','tangle','seashroom','plantern','splitpea-base','flowerpot','coffeebean',
 'umbrella','gatling-base','twin-base','gloom','cattail','wintermelon','goldmagnet','cobcannon','imitater'
];
export const PLANT_ATLAS_IDS=Object.freeze(IDS);
const indexById=new Map(IDS.map((id,i)=>[id,i]));
const lowPlants=new Set(['potato','puff','spikeweed','spikerock','lilypad','tangle','seashroom','flowerpot','coffeebean','pumpkin']);
const tallPlants=new Set(['tallnut','cactus','scaredy','cobcannon','torch']);
const widePlants=new Set(['spikeweed','spikerock','lilypad','tangle','cobcannon','twin-base','melon','wintermelon']);
const tile=256,columns=7;
let loaded=false;
let failed=false;
const atlas=typeof Image==='undefined'?null:new Image();
if(atlas){
 atlas.decoding='async';
 atlas.onload=()=>{loaded=atlas.naturalWidth===1792&&atlas.naturalHeight===1792;failed=!loaded;};
 atlas.onerror=()=>{failed=true;loaded=false;};
 atlas.src=new URL('../assets/plants-49.webp',import.meta.url).href;
}
export const isPlantAtlasReady=()=>loaded&&!failed;
export const plantAtlasStatus=()=>({loaded:isPlantAtlasReady(),failed,tiles:IDS.length});
function rootsOf(id,depth=0){
 if(indexById.has(id))return [id];
 if(depth>=12)return [];
 const spec=getPlant(id);
 if(!spec||!Array.isArray(spec.inputs))return [];
 return spec.inputs.flatMap(input=>rootsOf(input,depth+1)).slice(0,24);
}
export function resolvePlantRoots(specOrId){
 const spec=typeof specOrId==='string'?getPlant(specOrId):specOrId;
 if(!spec)return [];
 const parts=Array.isArray(spec.parts)&&spec.parts.length?spec.parts:
  Array.isArray(spec.inputs)&&spec.inputs.length?spec.inputs:[spec.id];
 return parts.flatMap(x=>rootsOf(x)).slice(0,24);
}
export function resolvePlantSpriteId(specOrId){
 const roots=resolvePlantRoots(specOrId);
 return roots.length?roots[0]:null;
}
function rectOf(id){
 const i=indexById.get(id);
 return i===undefined?null:[(i%columns)*tile,Math.floor(i/columns)*tile,tile,tile];
}
export const plantTileRect=id=>rectOf(id);
function sizeFor(id){
 const low=lowPlants.has(id),tall=tallPlants.has(id),wide=widePlants.has(id);
 return {width:wide?136:low?105:tall?114:106,height:low?78:tall?143:119};
}
function drawTile(c,id,x,y,width,height){
 const rect=rectOf(id);
 if(!isPlantAtlasReady()||!rect||typeof c.drawImage!=='function')return false;
 c.drawImage(atlas,...rect,x,y,width,height);
 return true;
}
export function drawPlantSprite(c,spec,time=0){
 const id=resolvePlantSpriteId(spec);
 if(!id||!isPlantAtlasReady())return false;
 const {width,height}=sizeFor(id);
 c.save();
 const yBounce=Math.sin(time*2.4)*1.5;
 const drawn=drawTile(c,id,-width/2,-height+yBounce+3,width,height);
 c.restore();
 return drawn;
}
/**
 * Only extra materials become compact offshoots; the source material remains
 * the large main illustration. Deep fusions use the last two leaf materials.
 * No changes are made to planting, combat, or save-state objects.
 */
export function drawFusionSpriteParts(c,spec,time=0){
 if(!isPlantAtlasReady())return false;
 const roots=resolvePlantRoots(spec);
 if(roots.length<2)return false;
 const extras=roots.slice(1).slice(-2),count=extras.length;
 c.save();
 extras.forEach((id,i)=>{
  const x=count===1?38:(i===0?-39:39);
  const y=count===1?-83:(i===0?-87:-84);
  const wave=Math.sin(time*2.2+i*1.7)*2;
  c.beginPath();
  c.moveTo(-1,-31);
  c.bezierCurveTo(x*.28,-42,x*.9,-67,x,y+21);
  c.strokeStyle='#2e5b36';
  c.lineWidth=8;c.lineCap='round';c.stroke();
  c.beginPath();
  c.moveTo(-1,-31);
  c.bezierCurveTo(x*.28,-42,x*.9,-67,x,y+21);
  c.strokeStyle='#9ccc65';c.lineWidth=3;c.stroke();
  c.beginPath();
  c.ellipse(x*.63,-62,14,6,-.5,0,Math.PI*2);
  c.fillStyle='#76b052';c.fill();
  const w=count===1?56:49,h=count===1?64:58;
  drawTile(c,id,x-w/2,y-h/2+wave,w,h);
  c.beginPath();c.arc(x+9,y-28+wave,2.7,0,Math.PI*2);
  c.fillStyle='#fff2bd';c.fill();
 });
 c.restore();
 return true;
}
