/**
 * PvZ Fusion - 0.3 plant expansion.
 * Selected names and core mechanics documented in docs/REFERENCE.md.
 * 'approximate' means this version implements a playable subset of the full rule.
 */
export const THIRD_WAVE_SEEDS = [
 {id:'hypno',name:'魅惑菇',icon:'hypno',cost:75,cooldown:30,hp:300,hypno:true,desc:'被啃咬时将僵尸转化为我方单位（近似实现）。'},
 {id:'scaredy',name:'胆小菇',icon:'scaredy',cost:25,cooldown:7.5,hp:300,damage:20,interval:1.5,scaredy:1,spore:true,desc:'远程孢子射击，周围3×3内有僵尸时停止攻击。'},
 {id:'doom',name:'毁灭菇',icon:'doom',cost:125,cooldown:50,hp:300,instant:{kind:'doom',delay:1,damage:1800,radius:3.7,crater:180},desc:'半径3.7格的大爆炸，留下持续180秒的弹坑。'},
 {id:'cactus',name:'仙人掌',icon:'cactus',cost:125,cooldown:7.5,hp:300,damage:20,interval:1.5,antiAir:true,desc:'发射尖刺；优先攻击气球僵尸。'},
 {id:'blover',name:'三叶草',icon:'blover',cost:100,cooldown:15,hp:300,instant:{kind:'wind',delay:1},desc:'吹走气球僵尸，释放全屏风流效果。'},
 {id:'starfruit',name:'杨桃',icon:'starfruit',cost:125,cooldown:7.5,hp:300,damage:20,interval:1.5,star:true,desc:'朝左、上、下、右上、右下五个方向射星星。'},
 {id:'pumpkin',name:'南瓜',icon:'pumpkin',cost:125,cooldown:30,hp:4000,pumpkin:true,desc:'给本格植物套上4000韧性护甲；再次种植可修补受损护甲。'},
 {id:'magnet',name:'磁力菇',icon:'magnet',cost:100,cooldown:7.5,hp:300,magnet:{interval:15,range:3},desc:'定期吸走附近僵尸的铁桶和铁制防具（简化）。'},
 {id:'kernel',name:'玉米投手',icon:'kernel',cost:100,cooldown:7.5,hp:300,damage:20,interval:3,lob:true,butterChance:.25,butterDamage:40,butterStun:4,desc:'投掷玉米；25%几率黄油定身4秒。'},
 {id:'garlic',name:'大蒜',icon:'garlic',cost:50,cooldown:7.5,hp:400,garlic:true,desc:'被啃咬后让僵尸换行，单次伤害最多15。'},
 {id:'marigold',name:'金盏花',icon:'marigold',cost:25,cooldown:7.5,hp:300,coinProduction:{interval:25},desc:'每25秒产出银币、金币或钻石，积攒钱币可获得阳光。'},
 {id:'tallnut',name:'高坚果',icon:'tallnut',cost:125,cooldown:30,hp:8000,desc:'更高韧性的防线；基础敌人无法越过。'},
 {id:'spikerock',name:'地刺王',icon:'spikerock',cost:125,cooldown:50,hp:450,spike:{damage:40,interval:1},low:true,desc:'每秒40伤害的坚固地刺，可覆盖普通地刺升级。'}
];
const fusion=(id,name,inputs,stats,desc,ordered=false)=>({
 id,name,inputs,icon:stats.icon||id,desc,ordered,approximate:true,...stats
});
export const THIRD_WAVE_RECIPES = [
 fusion('ice-doom','寒冰毁灭菇',['doom','ice-shroom'],{icon:'ice-doom',hp:300,instant:{kind:'ice-doom',delay:1,damage:1800,radius:3.7,freeze:4}},'全屏毁灭爆发并冻结敌人（战斗效果近似）。'),
 fusion('doom-puff','毁灭小蘑菇',['puff','doom'],{icon:'doom-puff',hp:300,instant:{kind:'doom',delay:.8,damage:900,radius:1.1,crater:30}},'小范围毁灭爆炸（范围近似）。',true),
 fusion('pea-scared','豌豆胆小菇',['scaredy','pea'],{icon:'scaredy-pea',hp:300,damage:30,interval:1.5,scaredy:1},'射豌豆，僵尸靠近会害怕（近似）。'),
 fusion('solar-scared','阳光胆小菇',['scaredy','sun'],{icon:'scaredy-sun',hp:300,sun:25,sunInterval:25,damage:20,interval:1.5,scaredy:1},'远程孢子并生产阳光（近似）。'),
 fusion('brave-shroom','胆大菇',['scaredy','fume'],{icon:'brave-shroom',hp:300,damage:28,interval:1.5,range:4.5,spray:true,pierce:true},'不再恐惧，喷射贯穿烟雾（近似）。'),
 fusion('hypno-scared','魅惑胆小菇',['scaredy','hypno'],{icon:'hypno-scared',hp:300,hypno:true,damage:20,interval:1.5,scaredy:1},'胆小菇受击可魅惑僵尸（近似）。'),
 fusion('doom-scared','毁灭胆小菇',['scaredy','doom'],{icon:'doom-scared',hp:300,scaredy:1,proximityDoom:{damage:1800,radius:2.2}},'敌人靠近会触发毁灭爆炸（近似）。'),
 fusion('star-scared','杨桃胆小菇',['scaredy','starfruit'],{icon:'star-scared',hp:300,damage:20,interval:1.5,star:true,scaredy:1},'害怕时暂停五方向射击（近似）。'),
 fusion('garlic-pea','蒜毒豌豆射手',['garlic','pea'],{icon:'garlic-pea',hp:300,damage:20,interval:1.5,poison:4},'豌豆命中施加持续伤害（近似）。'),
 fusion('garlic-nut','大蒜坚果',['garlic','wall'],{icon:'garlic-nut',hp:4000,garlic:true},'防御与换行结合。'),
 fusion('garlic-squash','大蒜窝瓜',['garlic','squash'],{icon:'garlic-squash',hp:300,squash:{damage:900,range:1,radius:.74},garlic:true},'压倒敌人时扰乱其行进路线（近似）。'),
 fusion('garlic-kernel','蒜玉米投手',['garlic','kernel'],{icon:'garlic-kernel',hp:300,damage:20,interval:3,lob:true,butterChance:.25,butterDamage:40,butterStun:4,poison:3},'蒜毒玉米和黄油定身（近似）。'),
 fusion('garlic-pumpkin','大蒜南瓜',['pumpkin','garlic'],{icon:'garlic-pumpkin',hp:4000,pumpkin:true,garlic:true},'防护外壳与换行能力组合（近似）。',true),
 fusion('solar-pumpkin','阳光南瓜',['pumpkin','sun'],{icon:'solar-pumpkin',hp:4000,pumpkin:true,sun:25,sunInterval:25},'保护植物并产阳光（近似）。',true),
 fusion('squash-pumpkin','窝瓜南瓜',['pumpkin','squash'],{icon:'squash-pumpkin',hp:4000,pumpkin:true,miniSquash:{interval:3,damage:225,range:1.1}},'周期性召唤迷你窝瓜（近似）。',true),
 fusion('star-pea','杨桃豌豆射手',['starfruit','pea'],{icon:'star-pea',hp:300,damage:20,interval:1.5,star:true,frontal:true},'星星散射并增加正前方攻击（近似）。'),
 fusion('solar-star','阳光杨桃',['starfruit','sun'],{icon:'solar-star',hp:300,damage:20,interval:1.5,star:true,sun:25,sunInterval:25},'五向杨桃并产生阳光（近似）。'),
 fusion('ice-star','寒冰杨桃',['starfruit','ice-shroom'],{icon:'ice-star',hp:300,damage:20,interval:1.5,star:true,freezeHit:10},'五向星星附加寒冷（近似）。'),
 fusion('star-nut','杨桃坚果',['starfruit','wall'],{icon:'star-nut',hp:4000,damage:20,interval:1.5,star:true},'坚果韧性与五向杨桃结合（近似）。'),
 fusion('magnet-cabbage','磁性卷心菜投手',['magnet','cabbage'],{icon:'magnet-cabbage',hp:300,damage:40,interval:3,lob:true,magnet:{interval:15,range:3}},'投掷卷心菜并拆除附近金属防具（近似）。'),
 fusion('magnet-squash','磁力窝瓜',['magnet','squash'],{icon:'magnet-squash',hp:300,squash:{damage:1800,range:1.1,radius:.37},magnet:{interval:15,range:3}},'磁力拆甲与窝瓜重击组合（近似）。'),
 fusion('spikerock-upgrade','地刺王',['spikeweed','spikerock'],{icon:'spikerock',hp:450,spike:{damage:40,interval:1},low:true},'将地刺升级成双倍伤害的地刺王。',true)
];