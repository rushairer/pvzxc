/**
 * Advanced sprite-linked fusions for the original 4x4 concept atlas.
 * The names and visual treatments are approximate interpretations.
 * Only hypno-emperor and two recipes in fusions7 have wiki-confirmed inputs.
 * All other high-tier paths are experimental, not claimed as official recipes.
 */
const f=(id,name,inputs,stats,desc,source='experimental')=>({
 id,name,inputs,icon:stats.icon||id,approximate:true,source,cooldown:18,
 hp:350,...stats,desc
});
export const FUSIONS_ULTIMATE=Object.freeze([
 f('hypno-emperor','魅帝菇',['hypno','hypno'],{
  icon:'hypno',hp:800,hypno:true,summonAlly:{interval:30,type:'football'},
  charmCharges:5
 },'每30秒召唤魅惑僵尸，受到啃咬时也可魅惑敌人（近似）。','wiki-formula'),
 f('cherry-warrior','究极樱桃战神',['cherry-nut','squash'],{
  icon:'cherry-wall',hp:8500,miniSquash:{interval:4,damage:1400,range:1.4},
  onDeathExplosion:{damage:2400,radius:1.65}
 },'高耐久樱桃战甲，周期性发动窝瓜重击。'),
 f('ultimate-fume','究极大喷菇',['fume','gloom'],{
  icon:'fume',hp:900,damage:125,interval:1.3,range:5,
  spray:true,pierce:true,gloom:{damage:70,interval:1,range:1.8}
 },'远距离贯穿大喷雾，周身叠加扩散伤害。'),
 f('sun-emperor-nut','阳光帝果',['solar-nut','twin-base'],{
  icon:'sun-wall',hp:12000,sun:75,sunInterval:15,coverOnPlant:2000
 },'帝王级坚果，持续生成阳光并提供防护。'),
 f('steel-spikerock','玄钢地刺王',['spikerock','tallnut'],{
  icon:'spikerock',hp:7500,low:true,spike:{damage:150,interval:.6}
 },'高强度玄钢地刺，持续削减接触敌人的血量。'),
 f('frost-gatling-puff','寒冰机枪小喷菇',['ice-shroom','gatling-pea'],{
  icon:'ice-shroom',hp:520,damage:42,shots:4,interval:1.35,freezeHit:38,range:5
 },'寒冰小喷菇机枪，四连发减速弹。'),
 f('star-emperor','究极杨桃大帝',['starfruit','gatling-pea'],{
  icon:'starfruit',hp:850,damage:115,interval:.85,star:true,
  frontal:true,antiAir:true,freezeHit:10
 },'快速向多个方向发射强力星弹。'),
 f('ultimate-gloom','究极忧郁菇',['gloom','gloom'],{
  icon:'gloom',hp:1100,gloom:{damage:110,interval:.6,range:1.9},
  poisonAura:6
 },'强化环绕孢子攻击并释放毒雾。'),
 f('laser-pumpkin','究极激光南瓜',['pumpkin','goldmagnet'],{
  icon:'pumpkin',hp:10000,coverOnPlant:2400,
  damage:75,interval:.85,pierce:true,range:7,
  magnet:{interval:12,range:3.5}
 },'高耐久南瓜炮台，贯穿光束与磁力拆甲（近似）。'),
 f('gold-magnet-nut','黄金磁力坚果',['goldmagnet','wall'],{
  icon:'wall',hp:7000,magnet:{interval:7,range:4},
  coinVacuum:true,sun:25,sunInterval:23
 },'坚果装甲、磁力脱甲和资源自动收集。'),
 f('ultimate-gatling','究极机枪射手',['gatling-pea','gatling-base'],{
  icon:'pea',hp:1500,damage:95,shots:8,interval:1.15,
  pierce:true
 },'八连发高伤害豌豆，支持穿透。'),
 f('ultimate-pumpkin','究极南瓜防御体',['pumpkin','cherry-nut'],{
  icon:'pumpkin',hp:13000,coverOnPlant:3500,
  onDeathExplosion:{damage:3000,radius:2.1},
  burnAura:6
 },'终极南瓜装甲，持续灼烧并在失守时爆炸。')
]);