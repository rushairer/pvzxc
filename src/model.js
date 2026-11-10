import { EXTRA_SEEDS, EXTRA_RECIPES } from './expansion.js';
import { THIRD_WAVE_SEEDS, THIRD_WAVE_RECIPES } from './expansion3.js';
import { CLASSIC_SEEDS, WATERMELON_RECIPES, CLASSIC_FUSION_RECIPES } from './classic.js';
import { FUSIONS_V5 } from './fusions5.js';
import { FUSIONS_V6 } from './fusions6.js';
import { FUSIONS_V7 } from './fusions7.js';
import { FUSIONS_ULTIMATE } from './fusions-ultimate.js';
// Base/day plants and additional seasonal plants are separated for maintainability.
// Design references: docs/REFERENCE.md. Further exotic classes deliberately omitted.
export const SEEDS = Object.freeze([
  {id:'pea',name:'豌豆射手',icon:'pea',cost:100,cooldown:7.5,hp:300,damage:20,interval:1.5,shots:1,desc:'每1.5秒发射20伤害豌豆。'},
  {id:'sun',name:'向日葵',icon:'sun',cost:50,cooldown:7.5,hp:300,sun:25,sunInterval:25,desc:'首次5–8秒，之后每25秒产生25阳光。'},
  {id:'cherry',name:'樱桃炸弹',icon:'cherry',cost:150,cooldown:50,hp:300,explosion:{damage:1800,radius:1.48,trigger:'fuse'},desc:'短暂引爆，伤害1800、半径1.48格。'},
  {id:'wall',name:'坚果',icon:'wall',cost:50,cooldown:30,hp:4000,desc:'4000韧性的防御植物。'},
  {id:'potato',name:'土豆雷',icon:'potato',cost:25,cooldown:30,hp:300,mine:{arm:16,damage:1800,radius:.74},desc:'15–17秒武装，碰到僵尸后爆炸。'},
  {id:'chomper',name:'大嘴花',icon:'chomper',cost:150,cooldown:7.5,hp:300,chomp:{range:1.22,digest:30},desc:'吞噬前方僵尸，消化需约30秒。'},
  ...EXTRA_SEEDS,
  ...THIRD_WAVE_SEEDS,
  ...CLASSIC_SEEDS
]);

function f(id,name,inputs,data,desc){
  return {id,name,inputs,icon:data.icon||id,...data,desc};
}
export const RECIPES = Object.freeze([
  f('repeater','双发射手',['pea','pea'],{icon:'pea',hp:300,damage:20,interval:1.5,shots:2},'每轮发射2颗豌豆，20×2/1.5秒。'),
  f('solar-pea','豌豆向日葵',['pea','sun'],{icon:'pea-sun',hp:300,damage:30,interval:1.5,sun:25,sunInterval:25,hitSunEvery:3},'每1.5秒发射30伤害的阳光子弹；每第三次命中产生5阳光，同时自然产光。'),
  f('cherry-shooter','樱桃射手',['pea','cherry'],{icon:'cherry-pea',hp:300,damage:60,interval:1.5},'发射60伤害樱桃子弹。'),
  f('pea-nut','坚果射手',['pea','wall'],{icon:'pea-wall',hp:4000,damage:20,interval:1.5,pierce:true},'4000韧性，每1.5秒发射20伤害、可穿透的滚地坚果。'),
  f('pea-mine','豌豆土豆雷',['pea','potato'],{icon:'pea-potato',hp:300,damage:20,interval:1.5,onDeathExplosion:{damage:1800,radius:.74},accelerateNear:true},'能射击；僵尸越近，发射越快。死亡时爆炸。'),
  f('pea-chomper','豌豆大嘴花',['pea','chomper'],{icon:'pea-chomper',hp:300,damage:20,interval:1.5,chomp:{range:1.22,digest:30}},'能吞噬前方僵尸，也能发射子弹。'),
  f('twin-sun','双子向日葵',['sun','sun'],{icon:'twin',hp:300,sun:50,sunInterval:20},'每20秒产生两份25阳光。'),
  f('solar-bomb','阳光炸弹',['sun','cherry'],{icon:'sun-cherry',hp:300,explosion:{damage:1800,radius:1.48,trigger:'fuse',sunOnHit:25}},'爆炸每命中一名僵尸生成25阳光。'),
  f('solar-nut','阳光坚果',['sun','wall'],{icon:'sun-wall',hp:4000,sun:25,sunInterval:15,sunOnCrack:25,sunOnDeath:50},'4000韧性；每15秒产25阳光，破损与死亡额外掉阳光。'),
  f('solar-mine','阳光土豆雷',['sun','potato'],{icon:'sun-potato',hp:300,sun:25,sunInterval:15,mine:{arm:16,damage:1800,radius:.74},sunOnExplode:75},'产阳光的土豆雷，武装后触发爆炸。'),
  f('solar-chomper','阳光大嘴花',['sun','chomper'],{icon:'sun-chomper',hp:300,chomp:{range:1.22,digest:30},sunOnChomp:50},'吞噬僵尸时额外获得阳光。'),
  f('cherry-nut','樱桃坚果',['cherry','wall'],{icon:'cherry-wall',hp:4000,onDeathExplosion:{damage:1800,radius:1.48}},'4000韧性，死亡时爆炸；受到樱桃爆炸可回血。'),
  f('cherry-mine','樱桃土豆雷',['cherry','potato'],{icon:'cherry-potato',hp:300,mine:{arm:16,damage:1800,radius:1.48}},'樱桃强化的地雷，武装后造成范围爆炸。'),
  f('cherry-chomper','樱桃大嘴花',['cherry','chomper'],{icon:'cherry-chomper',hp:300,chomp:{range:1.22,digest:30},onChompExplosion:{damage:300,radius:1}},'吞食时同时造成樱桃范围伤害。'),
  f('giant-nut','巨型坚果',['wall','wall'],{icon:'giant-wall',hp:8000},'更强韧的大型坚果防线。'),
  f('potato-nut','土豆坚果',['potato','wall'],{icon:'potato-wall',hp:4000,onDeathExplosion:{damage:1800,radius:.74}},'高耐久的地雷防线；失去韧性时爆炸。'),
  f('nut-chomper','大嘴坚果',['wall','chomper'],{icon:'wall-chomper',hp:4000,chomp:{range:1.22,digest:30}},'结合坚果韧性与吞噬能力。'),
  f('potato-chomper','土豆大嘴花',['potato','chomper'],{icon:'potato-chomper',hp:300,chomp:{range:1.22,digest:30},onDeathExplosion:{damage:1800,radius:.74}},'吞噬与地雷爆炸结合。'),
  f('super-cherry','超级樱桃射手',['cherry-shooter','cherry'],{icon:'super-cherry',hp:300,damage:300,interval:3,splash:{radius:1,damage:300},cherryRecharge:.85},'每3秒发射一颗300伤害的范围爆炸樱桃。'),
  f('cherry-repeater','樱桃双发射手',['repeater','cherry'],{icon:'cherry-pea',hp:300,damage:60,interval:1.5,shots:2},'发射2颗樱桃子弹，每颗60伤害。'),
  f('split-pea','裂荚射手',['repeater','pea'],{icon:'pea',hp:300,damage:20,interval:1.5,shots:2,backShot:true},'向前双发，并能向后射击。'),
  f('gatling-pea','机枪射手',['repeater','repeater'],{icon:'pea',hp:300,damage:20,interval:1.5,shots:4},'每轮连发4颗豌豆。'),
  ...EXTRA_RECIPES,
  ...THIRD_WAVE_RECIPES,
  ...WATERMELON_RECIPES,
  ...CLASSIC_FUSION_RECIPES,
  ...FUSIONS_V5,
  ...FUSIONS_V6,
  ...FUSIONS_V7,
  ...FUSIONS_ULTIMATE
]);
export function fusionKey(a,b){return [a,b].sort().join('+');}
const recipes=new Map(RECIPES.filter(recipe=>!recipe.ordered).map(recipe=>[fusionKey(...recipe.inputs),recipe]));
const orderedRecipes=new Map(RECIPES.filter(recipe=>recipe.ordered).map(recipe=>[recipe.inputs.join('>'),recipe]));
const plantMap=new Map([...SEEDS,...RECIPES].map(x=>[x.id,x]));
export function getPlant(id){return plantMap.get(id)||null;}
export function recipeFor(first,second){
  const a=Array.isArray(first)?(first.length===1?first[0]:null):first;
  if(!a||!second)return null;
  return orderedRecipes.get(a+'>'+second)||recipes.get(fusionKey(a,second))||null;
}
export function costFor(id,depth=0){
 const item=getPlant(id);
 if(!item||depth>12)return 0;
 if(typeof item.cost==='number')return item.cost;
 if(Array.isArray(item.inputs))return item.inputs.reduce((sum,part)=>sum+costFor(part,depth+1),0);
 return 0;
}

export function createPlant(source,parts){
  const spec=typeof source==='string'?getPlant(source):source;
  if(!spec)throw new TypeError('Unknown plant');
  return {id:spec.id,name:spec.name,icon:spec.icon,parts:parts||[spec.id],
    hp:spec.hp,maxHp:spec.hp,age:0,fireTimer:.65,sunTimer:spec.sun?6:Infinity,
    fuseTimer:spec.explosion?.trigger==='fuse' ? 0.7 : Infinity,
    instantTimer:spec.instant?.delay??Infinity,stacks:1,squashWindup:0,
    cover:0,magnetTimer:2,coinTimer:spec.coinProduction?6:Infinity,miniTimer:2,
    cannonTimer:spec.cannon?4:Infinity,gloomTimer:0,boostLeft:0,platform:spec.platform||null,
    armedAt:spec.mine?.arm||0,digestTimer:0,shotsHit:0,crackPhase:0};
}
export function unlockedSeeds(){return SEEDS;}
