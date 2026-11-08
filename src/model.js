export const SEEDS = [
  { id:'pea', name:'豌豆射手', icon:'pea', cost:100, cooldown:5, hp:130, damage:25, interval:1.42, desc:'向前射出豌豆' },
  { id:'sun', name:'向日葵', icon:'sun', cost:50, cooldown:6, hp:110, production:25, interval:13, desc:'周期性生产阳光' },
  { id:'wall', name:'坚果墙', icon:'wall', cost:50, cooldown:15, hp:1050, desc:'阻挡僵尸前进' },
  { id:'ice', name:'寒冰射手', icon:'ice', cost:175, cooldown:7, hp:130, damage:20, interval:1.55, freeze:3.4, desc:'攻击并减缓僵尸速度' },
  { id:'fire', name:'火焰花', icon:'fire', cost:150, cooldown:9, hp:130, damage:30, interval:1.7, burn:22, desc:'炽热弹丸造成额外伤害' },
  { id:'cherry', name:'樱桃炸弹', icon:'cherry', cost:150, cooldown:20, hp:100, explosive:135, interval:.85, desc:'靠近敌人时范围爆炸' },
  { id:'twin', name:'双子葵', icon:'twin', cost:125, cooldown:9, hp:130, production:50, interval:13, desc:'单次生产更多阳光' },
  { id:'melon', name:'玉米投手', icon:'melon', cost:125, cooldown:8, hp:120, damage:20, interval:2.15, lob:true, desc:'发射抛射物，造成溅射伤害' }
];
const fusion = (a,b,name,desc,stats,icon) => ({ inputs:[a,b],name,desc,...stats,icon:icon || a });
export const RECIPES = [
  fusion('pea','pea','双管豌豆','一次发射双颗豌豆。',{damage:28,interval:1.35,double:true},'pea'),
  fusion('pea','sun','阳光豌豆','持续生产阳光，同时发射豌豆。',{damage:25,interval:1.5,production:25},'pea'),
  fusion('pea','wall','坚果炮台','坚固的防御型远程炮台。',{hp:1100,damage:24,interval:1.5},'wall'),
  fusion('pea','ice','冰霜双射手','双发寒冰弹，冻结僵尸行动。',{damage:25,interval:1.7,double:true,freeze:4},'ice'),
  fusion('pea','fire','烈焰豌豆','高速发射灼烧弹丸。',{damage:42,interval:1.25,burn:28},'fire'),
  fusion('pea','cherry','爆裂豌豆','发射会造成局部溅射的弹丸。',{damage:48,interval:1.55,splash:65},'cherry'),
  fusion('pea','twin','双阳光射手','双倍阳光与稳定射击并存。',{damage:27,interval:1.45,production:50},'twin'),
  fusion('pea','melon','连发玉米炮','连发弹丸并附加溅射火力。',{damage:35,interval:1.6,double:true,lob:true},'melon'),
  fusion('sun','sun','闪耀双葵','提升阳光产出效率。',{production:50,interval:10},'sun'),
  fusion('sun','wall','阳光坚果','坚固防线也能生产阳光。',{hp:1300,production:25,interval:12},'wall'),
  fusion('sun','ice','寒光葵','阳光供给与冰霜攻击合一。',{production:25,damage:25,interval:1.55,freeze:3.5},'ice'),
  fusion('sun','fire','熔金葵','生产阳光并发射灼热火弹。',{production:25,damage:34,interval:1.7,burn:20},'fire'),
  fusion('sun','cherry','阳光爆弹','引爆时获得额外阳光。',{explosive:155,interval:1,production:25},'cherry'),
  fusion('sun','twin','三重向日葵','强力的阳光经济核心。',{production:75,interval:11},'twin'),
  fusion('sun','melon','金色投手','生产阳光并发射抛射物。',{production:25,damage:20,interval:2,lob:true},'melon'),
  fusion('wall','wall','高坚果','拥有更高耐久度的坚果墙。',{hp:2300},'wall'),
  fusion('wall','ice','冰晶坚果','坚固且能发射减速弹。',{hp:1200,damage:18,interval:2.1,freeze:4},'ice'),
  fusion('wall','fire','熔岩坚果','坚固的火焰防线。',{hp:1250,damage:28,interval:1.9,burn:35},'fire'),
  fusion('wall','cherry','爆破坚果','僵尸接近时引爆的防御植物。',{hp:800,explosive:170,interval:1},'wall'),
  fusion('wall','twin','金甲坚果','阳光与高耐久防御结合。',{hp:1450,production:50,interval:15},'wall'),
  fusion('wall','melon','坚果投手','耐久炮台，能投射爆裂玉米。',{hp:1200,damage:25,interval:2.1,lob:true},'melon'),
  fusion('ice','ice','双重冰霜','双弹减速攻击。',{damage:22,interval:1.4,double:true,freeze:4.6},'ice'),
  fusion('ice','fire','霜焰射手','冰与火兼备的元素射手。',{damage:40,interval:1.45,freeze:2,burn:35},'fire'),
  fusion('ice','cherry','冰晶爆弹','接近僵尸时释放冰晶爆炸。',{explosive:170,interval:.85},'ice'),
  fusion('ice','twin','双生冰葵','双倍产光并发射寒冰弹。',{production:50,damage:22,interval:1.5,freeze:3},'ice'),
  fusion('ice','melon','冰霜投手','向敌人投射减速与范围伤害。',{damage:30,interval:2,freeze:4,lob:true},'melon'),
  fusion('fire','fire','双焰射手','双弹高温攻击。',{damage:37,interval:1.35,double:true,burn:25},'fire'),
  fusion('fire','cherry','熔核爆弹','爆炸威力更大的植物。',{explosive:215,interval:.7},'cherry'),
  fusion('fire','twin','熔金双葵','双份阳光，附带火焰弹攻击。',{production:50,damage:35,interval:1.65,burn:20},'fire'),
  fusion('fire','melon','火焰投手','爆燃弹丸和抛射攻击。',{damage:40,interval:2,burn:22,lob:true},'melon'),
  fusion('cherry','cherry','连锁樱桃','更广的爆炸影响范围。',{explosive:255,interval:.7},'cherry'),
  fusion('cherry','twin','光能爆弹','爆炸前持续生产阳光。',{production:50,explosive:160,interval:1},'cherry'),
  fusion('cherry','melon','爆玉米','近敌爆炸，造成大范围伤害。',{explosive:185,interval:.9},'melon'),
  fusion('twin','twin','四重阳光葵','巨量阳光生产者。',{production:100,interval:12},'twin'),
  fusion('twin','melon','双金投手','生产阳光并投射双重弹丸。',{production:50,damage:25,interval:1.95,lob:true},'melon'),
  fusion('melon','melon','重型投手','双投射弹增强范围伤害。',{damage:34,interval:1.8,lob:true,double:true},'melon')
];
export const fusionKey = (a,b) => [a,b].sort().join('+');
const recipes = new Map(RECIPES.map(r => [fusionKey(...r.inputs),r]));
export function recipeFor(parts, next) {
  if (parts.length >= 2) return null;
  return recipes.get(fusionKey(parts[0],next)) || null;
}
export function costFor(id) { return SEEDS.find(s => s.id === id)?.cost ?? 0; }
export function createPlant(source,parts) {
  return { id:source.id || source.name, name:source.name, parts, icon:source.icon,
    hp:source.hp || 120, maxHp:source.hp || 120, damage:source.damage || 0,
    interval:source.interval || 2, production:source.production || 0,
    freeze:source.freeze || 0, burn:source.burn || 0, splash:source.splash || 0,
    double:source.double || false, lob:source.lob || false,
    explosive:source.explosive || 0, timer:source.explosive ? .8 : .65, sunTimer:source.production ? 6 : Infinity, age:0 };
}
