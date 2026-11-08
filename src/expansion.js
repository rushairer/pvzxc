/**
 * Additional baseline plants and fusion branches from the 4.x PvZ Fusion Wiki.
 * Values are reference anchors; special animations/edge cases are approximated.
 * No original artwork, sprites, sound or executable assets are bundled here.
 */
export const EXTRA_SEEDS = [
  {id:'puff',name:'小喷菇',icon:'puff',cost:0,cooldown:7.5,hp:300,damage:20,interval:1.5,range:2.5,spore:true,desc:'零阳光，近程孢子攻击。可在一格密植3株。'},
  {id:'fume',name:'大喷菇',icon:'fume',cost:75,cooldown:7.5,hp:300,damage:20,interval:1.5,range:4.5,spray:true,pierce:true,desc:'前方4.5格范围内喷射贯穿烟雾。'},
  {id:'ice-shroom',name:'寒冰菇',icon:'ice-shroom',cost:75,cooldown:50,hp:300,instant:{kind:'ice',delay:.6,damage:20,freeze:4,chill:10},desc:'全屏伤害并冻结敌人4秒。'},
  {id:'squash',name:'窝瓜',icon:'squash',cost:50,cooldown:30,hp:300,squash:{damage:1800,range:1.0,radius:.37},desc:'跳起并压扁附近敌人。'},
  {id:'threepeater',name:'三线射手',icon:'threepeater',cost:275,cooldown:7.5,hp:300,damage:20,interval:1.5,triple:true,desc:'向上中下三行发射豌豆。'},
  {id:'jalapeno',name:'火爆辣椒',icon:'jalapeno',cost:125,cooldown:50,hp:300,instant:{kind:'row',delay:.6,damage:1800},desc:'沿整行形成灼热火墙。'},
  {id:'spikeweed',name:'地刺',icon:'spikeweed',cost:100,cooldown:7.5,hp:50,spike:{damage:20,interval:1},low:true,desc:'不会阻挡僵尸，持续刺伤经过的目标。'},
  {id:'torch',name:'火炬树桩',icon:'torch',cost:175,cooldown:7.5,hp:300,torchBonus:20,desc:'经过的普通豌豆伤害+20并产生溅射。'},
  {id:'cabbage',name:'卷心菜投手',icon:'cabbage',cost:100,cooldown:7.5,hp:300,damage:40,interval:3,lob:true,desc:'投出卷心菜，越过障碍攻击僵尸。'},
  {id:'melon',name:'西瓜投手',icon:'melon',cost:300,cooldown:7.5,hp:300,damage:80,interval:3,lob:true,splash:{damage:27,radius:1.1},desc:'大范围投掷，伤害周围僵尸。'}
];
const f = (id,name,inputs,stats,desc,ordered=false)=>({
  id,name,inputs,icon:stats.icon||id,desc,ordered,...stats
});
export const EXTRA_RECIPES = [
  f('ice-pea','寒冰射手',['pea','ice-shroom'],{icon:'ice-pea',hp:300,damage:20,interval:1.5,freezeHit:10},'发射寒冰豌豆，叠加冻结值并施加寒冷。'),
  f('ice-repeater','寒冰双发射手',['repeater','ice-shroom'],{icon:'ice-repeater',hp:300,damage:20,interval:1.5,shots:2,freezeHit:10},'每轮两颗寒冰豌豆。'),
  f('ice-split','寒冰裂荚射手',['ice-repeater','pea'],{icon:'ice-repeater',hp:300,damage:20,interval:1.5,shots:2,backShot:true,freezeHit:10},'寒冰双发并向后攻击。'),
  f('ice-gatling','寒冰机枪射手',['ice-repeater','repeater'],{icon:'ice-gatling',hp:300,damage:20,interval:1.5,shots:4,freezeHit:10},'每轮发射四颗寒冰豌豆。'),
  f('blaze-pea','火辣豌豆射手',['pea','jalapeno'],{icon:'blaze-pea',hp:300,damage:30,interval:1.5,burn:3},'火辣豌豆附加灼热效果。'),
  f('blaze-repeater','火辣双发射手',['repeater','jalapeno'],{icon:'blaze-repeater',hp:300,damage:30,interval:1.5,shots:2,burn:3},'双发炽热豌豆。'),
  f('solar-jalapeno','阳光辣椒',['sun','jalapeno'],{icon:'solar-jalapeno',hp:300,instant:{kind:'row',delay:.6,damage:1800,sunOnHit:25}},'整行火焰；每伤害一名僵尸产生25阳光。'),
  f('torch-nut','坚果火炬树桩',['wall','torch'],{icon:'torch-nut',hp:4000,torchBonus:20},'坚果韧性与火炬增强结合。'),
  f('blaze-torch','火爆树桩',['torch','jalapeno'],{icon:'blaze-torch',hp:300,torchBonus:30,deathRowFire:true},'更强的豌豆点燃，死亡释放整行火焰。'),
  f('solar-torch','火炬向日葵',['sun','torch'],{icon:'solar-torch',hp:300,sun:25,sunInterval:25,torchBonus:20},'生产阳光，并强化穿过的豌豆。'),
  f('three-special','特种三线射手',['threepeater','pea'],{icon:'threepeater',hp:300,damage:30,interval:1.5,triple:true},'三行强化射击。'),
  f('cherry-three','樱桃三线射手',['threepeater','cherry'],{icon:'cherry-three',hp:300,damage:60,interval:1.5,triple:true},'三行发射樱桃子弹。'),
  f('ice-three','寒冰三线射手',['threepeater','ice-shroom'],{icon:'ice-three',hp:300,damage:20,interval:1.5,triple:true,freezeHit:10},'三路寒冰弹叠加冻结值。'),
  f('charred-three','焦黑三线射手',['threepeater','jalapeno'],{icon:'charred-three',hp:300,damage:40,interval:1.5,triple:true,onPlantRowFire:true},'种下时连续点燃上中下三行。'),
  f('solar-fume','阳光大蘑菇',['sun','fume'],{icon:'solar-fume',hp:300,damage:20,interval:1.5,range:4.5,spray:true,pierce:true,sun:25,sunInterval:25},'贯穿烟雾攻击并产光。'),
  f('solar-squash','阳光窝瓜',['sun','squash'],{icon:'solar-squash',hp:300,squash:{damage:1800,range:1,radius:.37},sunOnExplode:75},'压扁僵尸时产生阳光。'),
  f('solar-spike','阳光地刺',['sun','spikeweed'],{icon:'solar-spike',hp:300,spike:{damage:20,interval:1},sun:25,sunInterval:25,low:true},'踩踏伤害与持续产光结合。'),
  f('solar-cabbage','阳光卷心菜投手',['sun','cabbage'],{icon:'solar-cabbage',hp:300,damage:40,interval:3,lob:true,sun:25,sunInterval:25},'卷心菜投掷和阳光生产。'),
  f('puff-pea','豌豆小喷菇',['puff','pea'],{icon:'puff-pea',hp:300,damage:20,interval:1.5,range:2.5,spore:true},'小喷菇为底座融合豌豆射手。',true),
  f('sun-shroom','阳光菇',['puff','sun'],{icon:'sun-shroom',hp:300,sun:25,sunInterval:20,low:true},'小喷菇融合向日葵，周期性产光。',true),
  f('puff-nut','坚果小蘑菇',['puff','wall'],{icon:'puff-nut',hp:4000,damage:20,interval:1.5,range:2.5,spore:true},'坚果小蘑菇兼具坚韧与近程输出。',true),
  f('puff-ice','寒冰小蘑菇',['puff','ice-shroom'],{icon:'puff-ice',hp:300,damage:20,interval:1.5,range:2.5,spore:true,freezeHit:10},'短程喷射寒冰孢子。',true),
  f('puff-squash','小窝瓜',['puff','squash'],{icon:'puff-squash',hp:300,squash:{damage:1800,range:1,radius:.37}},'近程跳压的蘑菇。',true),
  f('puff-fume','大喷菇扩散群',['puff','fume'],{icon:'fume',hp:300,damage:20,interval:1.5,range:4.5,spray:true,pierce:true,spreadPuffs:true},'小喷菇为底座；大喷菇向前扩散小喷菇。',true)
];
