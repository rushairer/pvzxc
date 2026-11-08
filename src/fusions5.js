/**
 * Alpha 0.5: 49 extra fusion routes. The names and ingredient pairs are
 * cross-checked against the PvZ Fusion BWIKI torch/doom/sun/garlic recipes:
 * https://wiki.biligame.com/pvzrh/火炬树桩/融合配方
 * https://wiki.biligame.com/pvzrh/毁灭菇/融合配方
 * https://wiki.biligame.com/pvzrh/向日葵/融合配方
 * https://wiki.biligame.com/pvzrh/大蒜/融合配方
 * Detailed abilities and numerical values are playable approximations.
 * No copyrighted sprites or official sound assets are used.
 */
const f=(id,name,a,b,icon,stats,desc)=>({
 id,name,inputs:[a,b],icon,approximate:true,hp:300,...stats,
 desc:desc+'（战斗参数近似）'
});
export const FUSIONS_V5=[
 // Torch stump family (11).
 f('cherry-torch','樱桃火炬树桩','torch','cherry','torch',{torchBonus:35,onDeathExplosion:{damage:1200,radius:1.4},burnAura:4},'点燃豌豆并在死亡时爆炸'),
 f('torch-mine','火炬土豆雷','torch','potato','torch',{torchBonus:20,mine:{arm:14,damage:1800,radius:1.2}},'防御时可引爆烈火地雷'),
 f('torch-fume','火炬大喷菇','torch','fume','torch',{torchBonus:20,damage:35,interval:1.5,range:4.5,spray:true,pierce:true,burn:4},'喷射灼烧烟雾'),
 f('hypno-torch','魅惑火炬树桩','torch','hypno','torch',{torchBonus:20,hypno:true,lifeSun:20},'啃咬时会魅惑敌人'),
 f('polar-torch','极寒树桩','torch','ice-shroom','torch',{torchBonus:15,freezeAura:3,damage:20,interval:1.8,freezeHit:15},'增强并冰冻经过的弹丸'),
 f('ember-torch','余烬树桩','torch','doom','torch',{torchBonus:40,onDeathExplosion:{damage:1800,radius:2},burnAura:6},'余烬火环与死亡冲击波'),
 f('squash-torch','窝瓜火炬树桩','torch','squash','torch',{torchBonus:20,squash:{damage:1200,range:1.1,radius:1}},'附近目标出现时发动火焰压击'),
 f('three-torch','三线火炬树桩','torch','threepeater','threepeater',{torchBonus:20,damage:25,interval:1.5,triple:true,burn:3},'三路灼热豌豆'),
 f('spike-torch','火炬地刺','torch','spikeweed','spikeweed',{low:true,spike:{damage:45,interval:1},burnAura:4,torchBonus:20},'灼热地刺附加火焰增伤'),
 f('star-torch','杨桃树桩','torch','starfruit','starfruit',{star:true,damage:28,interval:1.5,burn:3,torchBonus:20},'五角星弹丸与灼热增益'),
 f('garlic-torch','蒜毒树桩','torch','garlic','torch',{garlic:true,torchBonus:20,poisonAura:5},'火焰和毒性同时作用'),
 // Doom-shroom family (22).
 f('doom-pea','毁灭豌豆射手','doom','pea','pea',{damage:85,interval:1.5,splash:{damage:50,radius:1.1}},'发射毁灭豌豆'),
 f('doom-sun','毁灭向日葵','doom','sun','sun',{sun:25,sunInterval:22,onDeathExplosion:{damage:1800,radius:2}},'产阳光并在死亡时爆炸'),
 f('doom-cherry','毁灭樱桃','doom','cherry','cherry',{instant:{kind:'doom',delay:.8,damage:2400,radius:2.8,crater:50}},'一次性大范围毁灭爆炸'),
 f('doom-wall','毁灭坚果','doom','wall','wall',{hp:4500,onDeathExplosion:{damage:2200,radius:2.2}},'韧性高且死亡时释放毁灭冲击波'),
 f('doom-potato','毁灭土豆雷','doom','potato','potato',{mine:{arm:12,damage:2500,radius:2},onDeathExplosion:{damage:1200,radius:1}},'土豆地雷发动大范围爆炸'),
 f('doom-chomper','毁灭大嘴花','doom','chomper','chomper',{chomp:{range:1.3,digest:22},onChompExplosion:{damage:850,radius:1.2}},'咀嚼时造成毁灭溅射'),
 f('doom-fume','毁灭大喷菇','doom','fume','fume',{damage:80,interval:1.8,spray:true,pierce:true,range:4.5,splash:{damage:55,radius:.8}},'穿透毁灭孢子'),
 f('doom-hypno','毁灭魅惑菇','doom','hypno','hypno',{hypno:true,proximityDoom:{damage:1000,radius:1.5},onDeathExplosion:{damage:1200,radius:1.3}},'敌人靠近时爆裂并魅惑'),
 f('doom-squash','毁灭窝瓜','doom','squash','squash',{squash:{damage:2800,range:1.2,radius:1.6}},'毁灭范围的窝瓜下砸'),
 f('doom-three','毁灭三线射手','doom','threepeater','threepeater',{damage:85,interval:1.8,triple:true,splash:{damage:30,radius:.7}},'三行毁灭豌豆'),
 f('doom-jalapeno','毁灭辣椒','doom','jalapeno','jalapeno',{instant:{kind:'row',delay:.7,damage:2600}},'一整行的毁灭烈焰'),
 f('doom-plantern','毁灭路灯花','doom','plantern','plantern',{lantern:true,proximityDoom:{damage:1400,radius:1.4}},'发光的防御爆裂植物'),
 f('doom-cactus','毁灭仙人掌','doom','cactus','cactus',{damage:75,interval:1.5,antiAir:true,splash:{damage:45,radius:.9}},'能攻击空中目标的毁灭尖刺'),
 f('doom-blover','毁灭三叶草','doom','blover','blover',{instant:{kind:'doom',delay:1,damage:1250,radius:2.3,crater:15}},'在周边引发大风与毁灭爆炸'),
 f('doom-star','毁灭杨桃','doom','starfruit','starfruit',{star:true,damage:70,interval:1.9,splash:{damage:25,radius:.8}},'五方向毁灭星弹'),
 f('doom-magnet','磁力毁灭菇','doom','magnet','magnet',{magnet:{interval:11,range:3.5},proximityDoom:{damage:1200,radius:1.5}},'磁力破甲并自爆'),
 f('doom-cabbage','毁灭卷心菜投手','doom','cabbage','cabbage',{damage:100,interval:2.6,lob:true,splash:{damage:50,radius:1}},'大范围毁灭卷心菜'),
 f('doom-kernel','毁灭玉米投手','doom','kernel','kernel',{damage:110,interval:2.8,lob:true,butterChance:.27,butterStun:3,butterDamage:50,splash:{damage:30,radius:1.1}},'毁灭玉米与黄油定身'),
 f('doom-garlic','毁灭大蒜','doom','garlic','garlic',{hp:850,garlic:true,onDeathExplosion:{damage:1800,radius:1.7}},'引导僵尸换路并爆裂'),
 f('doom-umbrella','毁灭保护伞','doom','umbrella','umbrella',{umbrella:true,onDeathExplosion:{damage:1800,radius:1.6}},'区域防护伞毁灭冲击'),
 f('doom-marigold','银毁灭菇','doom','marigold','marigold',{coinProduction:{interval:19},onDeathExplosion:{damage:1500,radius:1.3}},'积累钱币并在死亡时爆炸'),
 f('doom-gatling','毁灭菇机枪射手','doom','gatling-pea','pea',{damage:105,shots:4,interval:1.7,splash:{damage:60,radius:1.4}},'四发毁灭豌豆'),
 // Sun family (5).
 f('solar-hypno','阳光魅惑菇','sun','hypno','sun',{sun:25,sunInterval:23,hypno:true},'产光兼魅惑'),
 f('solar-ice','阳光寒冰菇','sun','ice-shroom','ice-shroom',{sun:25,sunInterval:25,freezeAura:3},'附近减速并持续产光'),
 f('solar-blover','阳光三叶草','sun','blover','blover',{sun:25,sunInterval:20,antiAir:true},'产光的三叶草'),
 f('solar-magnet','阳光磁力菇','sun','magnet','magnet',{sun:25,sunInterval:20,magnet:{interval:15,range:3}},'产光与磁力拆甲'),
 f('silver-sun','银向日葵','sun','marigold','sun',{sun:50,sunInterval:20,coinProduction:{interval:21}},'阳光与钱币共生产'),
 // Garlic family (11).
 f('garlic-repeater','蒜毒双发射手','garlic','repeater','pea',{damage:26,shots:2,interval:1.5,poison:5},'双发毒豌豆'),
 f('garlic-split','蒜毒裂荚射手','garlic','split-pea','pea',{damage:26,shots:2,interval:1.5,backShot:true,poison:5},'前后毒豌豆'),
 f('garlic-gatling','蒜毒机枪射手','garlic','gatling-pea','pea',{damage:26,shots:4,interval:1.5,poison:6},'四发毒豌豆'),
 f('garlic-fume','大蒜喷菇','garlic','fume','fume',{garlic:true,damage:26,interval:1.5,range:4.5,spray:true,pierce:true,poison:5},'蒜毒烟雾穿透'),
 f('hypno-garlic','魅惑大蒜','garlic','hypno','garlic',{garlic:true,hypno:true,hp:420},'啃咬僵尸会魅惑并换路'),
 f('garlic-three','蒜毒三线射手','garlic','threepeater','threepeater',{triple:true,damage:26,interval:1.5,poison:5},'三路毒豌豆'),
 f('garlic-blover','蒜三叶草','garlic','blover','blover',{instant:{kind:'wind',delay:1},poisonAura:5},'大风吹散气球'),
 f('garlic-star','大蒜杨桃','garlic','starfruit','starfruit',{star:true,damage:26,interval:1.5,poison:5},'五方向毒星弹'),
 f('garlic-cabbage','蒜卷心菜投手','garlic','cabbage','cabbage',{damage:46,interval:3,lob:true,poison:5},'投掷蒜毒卷心菜'),
 f('garlic-umbrella','大蒜保护伞','garlic','umbrella','umbrella',{hp:550,garlic:true,umbrella:true},'防御投石并改变僵尸行进路线'),
 f('silver-garlic','银蒜','garlic','marigold','garlic',{garlic:true,coinProduction:{interval:24},hp:520},'毒蒜产钱币')
];
