// Complete 49-card PvZ1 plant almanac is assembled in model.js using these
// 20 missing seeds. Existing 29 plants remain in the earlier catalog.
// Fusions are original playable approximations except named recipes cross-checked
// against https://wiki.biligame.com/pvzrh/西瓜投手/融合配方 .
export const CLASSIC_SEEDS=[
 {id:'snowpea',name:'寒冰射手',icon:'ice-pea',cost:175,cooldown:7.5,hp:300,damage:20,interval:1.5,freezeHit:25,desc:'减速豌豆，命中后短暂迟缓。'},
 {id:'repeater-base',name:'双发射手',icon:'pea',cost:200,cooldown:7.5,hp:300,damage:20,shots:2,interval:1.5,desc:'一次发射两颗豌豆。'},
 {id:'sunshroom-base',name:'阳光菇',icon:'sun-shroom',cost:25,cooldown:7.5,hp:300,sun:15,sunInterval:24,growAfter:45,desc:'小菇产15阳光，长大后产25。'},
 {id:'gravebuster',name:'墓碑吞噬者',icon:'gravebuster',cost:75,cooldown:7.5,hp:300,graveBuster:true,desc:'清除无尽草坪随机出现的墓碑。'},
 {id:'lilypad',name:'睡莲',icon:'lilypad',cost:25,cooldown:7.5,hp:300,platform:'water',low:true,desc:'铺设水上底座，可以承载其他植物。'},
 {id:'tangle',name:'缠绕水草',icon:'tangle',cost:25,cooldown:30,hp:300,tangle:{range:1,damage:2200},low:true,waterPreferred:true,desc:'从水道拉走附近僵尸。'},
 {id:'seashroom',name:'海蘑菇',icon:'seashroom',cost:0,cooldown:30,hp:300,damage:20,interval:1.5,range:2.5,spore:true,low:true,waterPreferred:true,desc:'水面近程蘑菇，产生短程孢子。'},
 {id:'plantern',name:'路灯花',icon:'plantern',cost:25,cooldown:30,hp:300,lantern:true,desc:'照亮附近格子并驱散迷雾。'},
 {id:'splitpea-base',name:'裂荚射手',icon:'pea',cost:125,cooldown:7.5,hp:300,damage:20,interval:1.5,backShot:true,desc:'可以向左右两边发射豌豆。'},
 {id:'flowerpot',name:'花盆',icon:'flowerpot',cost:25,cooldown:7.5,hp:300,platform:'roof',low:true,desc:'种植平台，让屋顶植物稳定生长。'},
 {id:'coffeebean',name:'咖啡豆',icon:'coffee',cost:75,cooldown:7.5,hp:300,coffee:true,desc:'唤醒休眠植物，短时间增强当前植物。'},
 {id:'umbrella',name:'叶子保护伞',icon:'umbrella',cost:100,cooldown:7.5,hp:300,umbrella:true,desc:'阻挡附近蹦极僵尸与投石机攻击。'},
 {id:'gatling-base',name:'机枪射手',icon:'pea',cost:250,cooldown:50,hp:300,damage:20,shots:4,interval:1.5,desc:'一次发射四颗豌豆。'},
 {id:'twin-base',name:'双子向日葵',icon:'twin',cost:150,cooldown:50,hp:300,sun:50,sunInterval:24,desc:'双份阳光生产。'},
 {id:'gloom',name:'忧郁菇',icon:'gloom',cost:150,cooldown:50,hp:300,gloom:{damage:20,interval:1,range:1.35},desc:'环绕周身的范围孢子攻击。'},
 {id:'cattail',name:'猫尾草',icon:'cattail',cost:225,cooldown:50,hp:300,homing:true,damage:20,shots:2,interval:1.5,antiAir:true,desc:'可以追踪所有行的僵尸，攻击空中目标。'},
 {id:'wintermelon',name:'冰瓜',icon:'wintermelon',cost:200,cooldown:50,hp:300,damage:80,interval:3,lob:true,freezeHit:35,splash:{damage:30,radius:1.25},desc:'溅射冰冻西瓜。'},
 {id:'goldmagnet',name:'吸金磁',icon:'goldmagnet',cost:50,cooldown:50,hp:300,coinVacuum:true,desc:'自动收集场上阳光与掉落的钱币。'},
 {id:'cobcannon',name:'玉米加农炮',icon:'cobcannon',cost:500,cooldown:50,hp:500,cannon:{damage:1800,radius:2.3,interval:18},desc:'自动瞄准密集尸群发射玉米炮弹。'},
 {id:'imitater',name:'模仿者',icon:'imitater',cost:0,cooldown:7.5,hp:300,imitater:true,desc:'复制最近成功种植的植物，按原卡价格付费。'}
];

// All 26 entries in the classic PvZ1 zombie almanac, including Zomboss.
export const CLASSIC_ZOMBIES={
 normal:{name:'普通僵尸',hp:270,speed:19,attack:100,period:1},
 flag:{name:'旗帜僵尸',hp:270,speed:24,attack:100,period:1,flag:true},
 cone:{name:'路障僵尸',hp:640,speed:19,attack:100,period:1,armor:370},
 pole:{name:'撑杆跳僵尸',hp:340,speed:31,attack:100,period:1,jump:true},
 bucket:{name:'铁桶僵尸',hp:1370,speed:18,attack:100,period:1,armor:1100,metal:true},
 newspaper:{name:'读报僵尸',hp:510,speed:16,attack:100,period:1,newspaper:true,armor:240},
 screen:{name:'铁栅门僵尸',hp:1250,speed:16,attack:100,period:1,armor:980,metal:true,shield:true},
 football:{name:'橄榄球僵尸',hp:1670,speed:36,attack:130,period:1,armor:1200,metal:true,football:true},
 dancer:{name:'舞王僵尸',hp:450,speed:20,attack:100,period:1,summon:11},
 backup:{name:'伴舞僵尸',hp:270,speed:19,attack:100,period:1},
 ducky:{name:'鸭子救生圈僵尸',hp:270,speed:20,attack:100,period:1,water:true},
 snorkel:{name:'潜水僵尸',hp:330,speed:21,attack:100,period:1,water:true,submerged:true},
 zomboni:{name:'冰车僵尸',hp:1500,speed:29,attack:180,period:.8,crush:true,iceTrail:true},
 bobsled:{name:'雪橇车僵尸',hp:650,speed:34,attack:80,period:.8,iceOnly:true,crew:3},
 dolphin:{name:'海豚骑士僵尸',hp:420,speed:33,attack:100,period:1,water:true,jump:true},
 jack:{name:'玩偶匣僵尸',hp:500,speed:26,attack:100,period:1,jack:true},
 balloon:{name:'气球僵尸',hp:270,speed:24,attack:100,period:1,airborne:true},
 digger:{name:'矿工僵尸',hp:340,speed:25,attack:100,period:1,digger:true,metal:true},
 pogo:{name:'跳跳僵尸',hp:390,speed:33,attack:100,period:1,pogo:true,metal:true},
 yeti:{name:'雪人僵尸',hp:1400,speed:27,attack:100,period:1,yeti:true},
 bungee:{name:'蹦极僵尸',hp:400,speed:0,attack:0,period:1,bungee:true},
 ladder:{name:'扶梯僵尸',hp:880,speed:24,attack:100,period:1,ladder:true,metal:true},
 catapult:{name:'投石车僵尸',hp:900,speed:15,attack:80,period:1,catapult:true},
 garg:{name:'巨人僵尸',hp:3100,speed:13,attack:450,period:1.6,garg:true},
 imp:{name:'小鬼僵尸',hp:180,speed:38,attack:80,period:.8,imp:true},
 zomboss:{name:'僵王博士',hp:12000,speed:7,attack:750,period:2.0,boss:true}
};

function recipe(id,name,inputs,stats,desc){
 return {id,name,inputs,icon:stats.icon||id,desc,approximate:true,...stats};
}
// Wiki-referenced watermelon fusion names with approximated combat stats.
export const WATERMELON_RECIPES=[
 recipe('melon-pea','瓜豆射手',['melon','pea'],{icon:'melon-pea',hp:300,damage:85,interval:2.2,lob:true,splash:{damage:38,radius:1.1}},'西瓜与豌豆融合的溅射射手。'),
 recipe('melon-nut','西瓜坚果',['melon','wall'],{icon:'melon-nut',hp:4000,damage:80,interval:3,lob:true,splash:{damage:28,radius:1}},'高耐久西瓜投手。'),
 recipe('melon-fume','西瓜弹弹菇',['melon','fume'],{icon:'melon-fume',hp:300,damage:45,interval:1.5,spray:true,pierce:true,range:4.5,splash:{damage:20,radius:.7}},'西瓜烟雾弹穿透攻击。'),
 recipe('melon-hypno','魅惑西瓜投手',['melon','hypno'],{icon:'melon-hypno',hp:300,damage:80,interval:3,lob:true,charmChance:.18,splash:{damage:25,radius:1}},'西瓜命中概率魅惑。'),
 recipe('melon-ice','冰瓜',['melon','ice-shroom'],{icon:'wintermelon',hp:300,damage:80,interval:3,lob:true,freezeHit:35,splash:{damage:27,radius:1.1}},'冰冻溅射。'),
 recipe('melon-doom','毁灭西瓜投手',['melon','doom'],{icon:'melon-doom',hp:300,damage:155,interval:4,lob:true,splash:{damage:100,radius:2}},'大范围毁灭西瓜。'),
 recipe('melon-squash','西瓜窝窝投手',['melon','squash'],{icon:'melon-squash',hp:300,damage:80,interval:3,lob:true,miniSquash:{interval:4,damage:220,range:2}},'西瓜投掷与窝瓜压制。'),
 recipe('melon-three','三线西瓜炮手',['melon','threepeater'],{icon:'melon-three',hp:300,damage:80,interval:3,triple:true,lob:true,splash:{damage:20,radius:1}},'三路西瓜投射。'),
 recipe('melon-fire','火瓜',['melon','jalapeno'],{icon:'melon-fire',hp:300,damage:90,interval:2.8,lob:true,burn:8,splash:{damage:45,radius:1}},'灼烧范围西瓜。'),
 recipe('melon-spike','西瓜地刺',['melon','spikeweed'],{icon:'melon-spike',hp:300,damage:70,interval:3,lob:true,spike:{damage:25,interval:1},low:true},'西瓜射击与地面刺伤。'),
 recipe('melon-blover','西瓜浮艇',['melon','blover'],{icon:'melon-blover',hp:300,damage:80,interval:3,lob:true,antiAir:true},'能对付空中目标的投手。'),
 recipe('melon-magnet','磁性西瓜投手',['melon','magnet'],{icon:'melon-magnet',hp:300,damage:80,interval:3,lob:true,magnet:{interval:13,range:3}},'磁力脱甲并投掷西瓜。'),
 recipe('melon-cabbage','卷心瓜投手',['melon','cabbage'],{icon:'melon-cabbage',hp:300,damage:90,interval:2.7,lob:true,splash:{damage:25,radius:1}},'卷心菜混合投掷。'),
 recipe('melon-kernel','玉米瓜投手',['melon','kernel'],{icon:'melon-kernel',hp:300,damage:70,interval:2.7,lob:true,butterChance:.3,butterDamage:40,butterStun:4,splash:{damage:20,radius:1}},'玉米黄油与西瓜范围攻击。'),
 recipe('melon-garlic','蒜西瓜投手',['melon','garlic'],{icon:'melon-garlic',hp:300,damage:80,interval:3,lob:true,poison:5,splash:{damage:20,radius:1}},'蒜毒西瓜。'),
 recipe('melon-umbrella','西瓜保护伞',['melon','umbrella'],{icon:'melon-umbrella',hp:300,damage:80,interval:3,lob:true,umbrella:true,splash:{damage:20,radius:1}},'西瓜与区域防护结合。'),
 recipe('melon-marigold','银西瓜投手',['melon','marigold'],{icon:'melon-marigold',hp:300,damage:80,interval:3,lob:true,coinProduction:{interval:20},splash:{damage:24,radius:1}},'射击并生产钱币。')
];
// Additional experimental recipes; named distinctly and flagged as approximations.
export const CLASSIC_FUSION_RECIPES=[
 recipe('frost-repeater','寒冰双发射手（经典）',['snowpea','repeater-base'],{icon:'ice-pea',hp:300,damage:20,shots:2,interval:1.5,freezeHit:30},'双冰豌豆。'),
 recipe('snow-sun','冰阳光射手',['snowpea','sun'],{icon:'ice-pea',hp:300,damage:25,interval:1.5,sun:25,sunInterval:24,freezeHit:25},'冰豌豆与阳光生产。'),
 recipe('frost-cattail','霜尾草',['cattail','ice-shroom'],{icon:'cattail-ice',hp:300,damage:25,shots:2,homing:true,antiAir:true,freezeHit:25,interval:1.5},'追踪并减速所有敌人。'),
 recipe('flame-cattail','焰尾草',['cattail','jalapeno'],{icon:'cattail-fire',hp:300,damage:30,shots:2,homing:true,antiAir:true,burn:7,interval:1.5},'追踪灼烧弹。'),
 recipe('twin-gold','金辉双葵',['twin-base','marigold'],{icon:'twin-gold',hp:300,sun:75,sunInterval:20,coinProduction:{interval:22}},'大量产阳光和钱币。'),
 recipe('gold-sun','黄金阳光菇',['sunshroom-base','marigold'],{icon:'sun-shroom',hp:300,sun:25,sunInterval:18,coinProduction:{interval:25}},'金盏花与阳光菇。'),
 recipe('lantern-magnet','灯磁蘑菇',['plantern','magnet'],{icon:'magnet',hp:300,lantern:true,magnet:{interval:12,range:4}},'照明与远距离脱甲。'),
 recipe('umbrella-nut','伞坚果',['umbrella','wall'],{icon:'umbrella-nut',hp:5000,umbrella:true},'坚果抗投石防护。'),
 recipe('gloom-ice','冰霜忧郁菇',['gloom','ice-shroom'],{icon:'gloom-ice',hp:300,gloom:{damage:30,interval:1,range:1.4},freezeAura:3},'范围孢子与缓速。'),
 recipe('gloom-fire','熔岩忧郁菇',['gloom','jalapeno'],{icon:'gloom-fire',hp:300,gloom:{damage:40,interval:1,range:1.5},burnAura:4},'火焰范围攻击。'),
 recipe('sun-lilypad','阳光睡莲',['lilypad','sun'],{icon:'lilypad',hp:300,sun:25,sunInterval:23,low:true},'水上太阳能平台。'),
 recipe('sea-ice','寒冰海蘑菇',['seashroom','ice-shroom'],{icon:'seashroom',hp:300,damage:20,interval:1.5,spore:true,range:2.5,freezeHit:20,low:true},'水路寒冰孢子。'),
 recipe('cattail-torch','火炬猫尾草',['cattail','torch'],{icon:'cattail-fire',hp:300,homing:true,antiAir:true,damage:35,shots:2,interval:1.5,burn:4},'空中火焰追踪攻击。'),
 recipe('winter-torch','火焰冰瓜',['wintermelon','torch'],{icon:'wintermelon',hp:300,damage:100,interval:3,lob:true,freezeHit:20,burn:5,splash:{damage:40,radius:1.2}},'冰火两种状态叠加。'),
 recipe('winter-corn','冰黄油瓜',['wintermelon','kernel'],{icon:'wintermelon',hp:300,damage:90,interval:3,lob:true,freezeHit:30,butterChance:.3,butterStun:4,butterDamage:40,splash:{damage:30,radius:1}},'冰冻与黄油定身。'),
 recipe('laser-cactus','仙人掌机枪',['cactus','gatling-base'],{icon:'cactus',hp:300,damage:25,shots:4,interval:1.5,antiAir:true},'密集对空刺弹。'),
 recipe('garg-piercer','钢刺西瓜',['spikerock','melon'],{icon:'melon-spike',hp:500,damage:90,interval:3,lob:true,spike:{damage:40,interval:1},low:true},'地面钢刺和西瓜投掷。'),
 recipe('garlic-gloom','蒜毒忧郁菇',['gloom','garlic'],{icon:'gloom',hp:300,gloom:{damage:25,interval:1,range:1.4},poisonAura:6,garlic:true},'范围毒云。'),
 recipe('hypno-cattail','魅惑猫尾草',['cattail','hypno'],{icon:'cattail',hp:300,homing:true,antiAir:true,damage:20,shots:2,interval:1.8,charmChance:.18},'追踪魅惑攻击。'),
 recipe('cob-ice','冰冻玉米炮',['cobcannon','ice-shroom'],{icon:'cobcannon',hp:600,cannon:{damage:1800,radius:2.6,interval:20},freezeAura:5},'重型炮击并冻结敌人。'),
 recipe('cob-fire','烈焰玉米炮',['cobcannon','jalapeno'],{icon:'cobcannon',hp:600,cannon:{damage:2200,radius:2.4,interval:19},burnAura:5},'重型燃烧炮击。'),
 recipe('cob-magnet','磁能玉米炮',['cobcannon','magnet'],{icon:'cobcannon',hp:600,cannon:{damage:1900,radius:2.4,interval:20},magnet:{interval:10,range:4}},'集束炮击加金属剥离。'),
 recipe('star-cattail','追踪杨桃',['starfruit','cattail'],{icon:'starfruit',hp:300,damage:25,interval:1.5,star:true,homing:true,antiAir:true},'发射星芒追踪弹。'),
 recipe('pogo-mine','弹跳地雷',['potato','squash'],{icon:'potato',hp:300,mine:{arm:9,damage:1800,radius:1.3}},'提前武装的大范围地雷。'),
 recipe('cactus-nut','仙人掌坚果',['cactus','wall'],{icon:'cactus',hp:4000,damage:20,interval:1.5,antiAir:true,spike:{damage:20,interval:1}},'坚固的对空反刺炮台。'),
 recipe('goldmagnet-marigold','吸金花',['goldmagnet','marigold'],{icon:'goldmagnet',hp:300,coinProduction:{interval:15},coinVacuum:true},'连续产钱和自动收集。'),
 recipe('lantern-fume','照明大喷菇',['fume','plantern'],{icon:'fume',hp:300,damage:30,interval:1.5,spray:true,pierce:true,range:4.5,lantern:true},'照明并发出贯穿雾弹。'),
 recipe('garlic-snow','蒜毒冰豌豆',['garlic','snowpea'],{icon:'ice-pea',hp:300,damage:25,interval:1.5,poison:4,freezeHit:20},'冰与毒双重迟缓。'),
 recipe('umbrella-cattail','守护猫尾草',['umbrella','cattail'],{icon:'cattail',hp:300,homing:true,antiAir:true,damage:20,shots:2,interval:1.5,umbrella:true},'对空火力和范围保护。'),
 recipe('gloom-star','星芒忧郁菇',['gloom','starfruit'],{icon:'gloom',hp:300,damage:25,interval:1.5,star:true,gloom:{damage:20,interval:1,range:1.1}},'五向星弹及周身脉冲。')
];
