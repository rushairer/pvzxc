/**
 * Alpha 1.0 fusion expansion: 60 craftable two-material recipes.
 * Balancing, effects and most combinations are original playable approximations.
 * Two named ultimate recipes use the formula described on PvZ Fusion BWIKI:
 * https://wiki.biligame.com/pvzrh/樱桃指挥官
 * https://wiki.biligame.com/pvzrh/究极火爆窝炬
 */
const rows=`
blazing-repeater|烈焰双发树桩|torch|repeater-base|rapidfire
flame-cherry|烈焰樱桃|cherry|jalapeno|burst
blaze-cactus|烈焰仙人掌|torch|cactus|fire
pumpkin-magnet|磁能南瓜|pumpkin|magnet|defend
cattail-three|三线猫尾草|cattail|threepeater|homing
solar-gatling|双葵机枪|twin-base|gatling-base|solar-gun
cherry-gatling|樱桃机枪射手|gatling-pea|cherry|cherry-gun
ultimate-cherry-shooter|究极樱桃射手|super-cherry|cherry-gatling|ultimate-cherry
super-torch|超级火炬树桩|torch|torch|fire-torch
fire-squash|火爆窝瓜|squash|jalapeno|squash-fire
ultimate-flame-torch|究极火爆窝炬|super-torch|fire-squash|ultimate-fire
sun-peashroom|阳光菇豌豆射手|sunshroom-base|pea|solar-gun
pea-lily|水上豌豆射手|pea|lilypad|rapidfire
pea-umbrella|防护豌豆伞|pea|umbrella|defend-gun
pea-imitater|幻影豌豆射手|pea|imitater|rapidfire
pea-wintermelon|寒霜瓜豌豆|pea|wintermelon|ice
pea-gloom|忧郁豌豆菇|pea|gloom|gloom
pea-goldmagnet|吸金豌豆|pea|goldmagnet|solar-gun
pea-blover|旋风豌豆|pea|blover|wind
pea-cattail|追踪豌豆猫|pea|cattail|homing
pea-cabbage|豌豆卷心投手|pea|cabbage|lob
pumpkin-snowpea|寒霜南瓜|pumpkin|snowpea|ice-defend
pumpkin-repeater|双发南瓜|pumpkin|repeater-base|defend-gun
pumpkin-gatling|机枪南瓜|pumpkin|gatling-base|defend-gun
pumpkin-sunshroom|阳光菇南瓜|pumpkin|sunshroom-base|solar-defend
pumpkin-marigold|金盏南瓜|pumpkin|marigold|solar-defend
pumpkin-gloom|忧郁南瓜|pumpkin|gloom|gloom-defend
pumpkin-doom|毁灭南瓜|pumpkin|doom|burst-defend
pumpkin-cattail|猫尾草南瓜|pumpkin|cattail|homing
pumpkin-cactus|刺甲南瓜|pumpkin|cactus|spike
pumpkin-kernel|黄油南瓜|pumpkin|kernel|butter
cattail-repeater|双发猫尾草|cattail|repeater-base|homing
cattail-sun|阳光猫尾草|cattail|sun|solar-gun
cattail-doom|毁灭猫尾草|cattail|doom|homing
cattail-gatling|机枪猫尾草|cattail|gatling-base|homing
cattail-melon|西瓜猫尾草|cattail|melon|homing
cattail-magnet|磁力猫尾草|cattail|magnet|homing
cattail-kernel|黄油猫尾草|cattail|kernel|butter
cattail-snowpea|寒冰猫尾草|cattail|snowpea|homing
cattail-twin|双葵猫尾草|cattail|twin-base|solar-gun
gloom-kernel|黄油忧郁菇|gloom|kernel|gloom
gloom-snowpea|寒霜忧郁菇|gloom|snowpea|gloom
gloom-magnet|磁能忧郁菇|gloom|magnet|gloom
gloom-doom|毁灭忧郁菇|gloom|doom|gloom
gloom-cactus|尖刺忧郁菇|gloom|cactus|gloom
gloom-torch|火炬忧郁菇|gloom|torch|gloom
gloom-chomper|吞噬忧郁菇|gloom|chomper|gloom
cob-cherry|樱桃玉米炮|cobcannon|cherry|cannon
cob-snowpea|冰霜玉米炮|cobcannon|snowpea|cannon
cob-sun|阳光玉米炮|cobcannon|sun|cannon
cob-doom|毁灭玉米炮|cobcannon|doom|cannon
cob-cactus|对空玉米炮|cobcannon|cactus|cannon
twin-star|双葵杨桃|twin-base|starfruit|solar-gun
twin-melon|双葵西瓜|twin-base|melon|solar-gun
twin-magnet|双葵磁力|twin-base|magnet|solar-gun
gold-cactus|金盏仙人掌|marigold|cactus|solar-gun
gold-snowpea|金盏冰射手|marigold|snowpea|solar-gun
winter-star|寒霜杨桃瓜|wintermelon|starfruit|ice
winter-cactus|寒霜仙人掌|wintermelon|cactus|ice
winter-gloom|冰雾忧郁菇|wintermelon|gloom|ice
`.trim().split('\n').map(s=>s.split('|'));
const presets={
 'rapidfire':{damage:28,shots:2,interval:1.3},
 'burst':{hp:350,instant:{kind:'row',delay:.85,damage:1600}},
 'fire':{damage:42,interval:1.5,burn:6,antiAir:true,torchBonus:22},
 'defend':{hp:4500,coverOnPlant:1200,magnet:{interval:12,range:3.5}},
 'homing':{damage:37,shots:2,interval:1.5,homing:true,antiAir:true},
 'solar-gun':{damage:32,interval:1.4,sun:25,sunInterval:23},
 'cherry-gun':{damage:80,shots:4,interval:1.8,splash:{damage:80,radius:.9}},
 'ultimate-cherry':{damage:300,shots:4,interval:1.5,splash:{damage:300,radius:1}},
 'fire-torch':{hp:1800,torchBonus:45,burnAura:5},
 'squash-fire':{hp:400,squash:{damage:2100,range:1.1,radius:1.2},onDeathExplosion:{damage:1200,radius:1.2}},
 'ultimate-fire':{hp:3200,torchBonus:80,burnAura:8,miniSquash:{interval:3.5,damage:800,range:1.2},onDeathExplosion:{damage:1800,radius:1.4}},
 'defend-gun':{hp:3800,damage:34,shots:2,interval:1.6,umbrella:true},
 'ice':{hp:360,damage:48,interval:1.8,freezeHit:34,lob:true},
 'gloom':{hp:430,gloom:{damage:35,interval:1.1,range:1.4},damage:30,interval:1.6},
 'wind':{damage:24,interval:1.4,windPulse:{interval:12},antiAir:true},
 'lob':{damage:52,interval:2.7,lob:true,splash:{damage:23,radius:1}},
 'ice-defend':{hp:4500,freezeAura:4,coverOnPlant:1100},
 'solar-defend':{hp:4000,sun:25,sunInterval:20,coverOnPlant:1300},
 'gloom-defend':{hp:3600,gloom:{damage:38,interval:1.1,range:1.3},coverOnPlant:900},
 'burst-defend':{hp:3300,proximityDoom:{damage:1500,radius:1.5},coverOnPlant:700},
 'spike':{hp:2600,spike:{damage:45,interval:1},antiAir:true},
 'butter':{damage:38,interval:2.4,lob:true,butterChance:.3,butterDamage:40,butterStun:3.5},
 'cannon':{hp:750,cannon:{damage:1900,radius:2.25,interval:18}},
};
export const FUSIONS_V7=Object.freeze(rows.map(([id,name,a,b,style])=>({
 id,name,inputs:[a,b],icon:a,source: id==='ultimate-cherry-shooter'||id==='ultimate-flame-torch'?'wiki-formula':'experimental',
 approximate:true,cooldown:16,hp:300,...presets[style],
 desc: id==='ultimate-cherry-shooter'||id==='ultimate-flame-torch'
   ? '根据融合版图鉴的融合材料配方实现，战斗数值为近似版本。'
   : '原创拓展融合：具备对应攻击、辅助或防御能力，数值并非官方设定。'
})));