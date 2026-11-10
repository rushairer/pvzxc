/** Alpha 1.1 — 24 experimental fusion routes. Not official BluePiaoPiaoFly formulas. */
export const FUSIONS_V8=Object.freeze([
  {
    "id": "aurora-star",
    "name": "极光杨桃皇",
    "inputs": [
      "star-emperor",
      "snowpea"
    ],
    "icon": "star-emperor",
    "hp": 1200,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "star": true,
    "damage": 130,
    "interval": 0.85,
    "freezeHit": 38,
    "antiAir": true
  },
  {
    "id": "volcano-torch",
    "name": "火山毁灭树桩",
    "inputs": [
      "ultimate-flame-torch",
      "doom"
    ],
    "icon": "ultimate-flame-torch",
    "hp": 3800,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "torchBonus": 100,
    "burnAura": 9,
    "onDeathExplosion": {
      "damage": 2400,
      "radius": 1.8
    }
  },
  {
    "id": "cherry-emperor",
    "name": "樱桃帝皇射手",
    "inputs": [
      "ultimate-cherry-shooter",
      "cherry"
    ],
    "icon": "ultimate-cherry-shooter",
    "hp": 1000,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 340,
    "shots": 5,
    "interval": 1.5,
    "splash": {
      "damage": 290,
      "radius": 1.3
    }
  },
  {
    "id": "diamond-nut",
    "name": "钻石磁甲坚果",
    "inputs": [
      "steel-spikerock",
      "gold-magnet-nut"
    ],
    "icon": "steel-spikerock",
    "hp": 15500,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "coverOnPlant": 3000,
    "magnet": {
      "interval": 7,
      "range": 4.5
    },
    "spike": {
      "damage": 90,
      "interval": 1
    }
  },
  {
    "id": "prism-pumpkin",
    "name": "棱镜激光南瓜",
    "inputs": [
      "laser-pumpkin",
      "starfruit"
    ],
    "icon": "laser-pumpkin",
    "hp": 12000,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 160,
    "interval": 0.85,
    "pierce": true,
    "range": 8,
    "star": true
  },
  {
    "id": "void-gloom",
    "name": "虚空忧郁菇",
    "inputs": [
      "ultimate-gloom",
      "doom"
    ],
    "icon": "ultimate-gloom",
    "hp": 1300,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "gloom": {
      "damage": 140,
      "interval": 0.6,
      "range": 2.2
    },
    "poisonAura": 8
  },
  {
    "id": "cosmic-cattail",
    "name": "星河机枪猫尾草",
    "inputs": [
      "cattail-gatling",
      "starfruit"
    ],
    "icon": "cattail-gatling",
    "hp": 1300,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 105,
    "shots": 4,
    "interval": 1.2,
    "homing": true,
    "antiAir": true
  },
  {
    "id": "solar-fortress",
    "name": "太阳帝皇壁垒",
    "inputs": [
      "sun-emperor-nut",
      "pumpkin"
    ],
    "icon": "sun-emperor-nut",
    "hp": 18000,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "sun": 100,
    "sunInterval": 14,
    "coverOnPlant": 4000
  },
  {
    "id": "crystal-cannon",
    "name": "冰晶玉米巨炮",
    "inputs": [
      "cob-ice",
      "wintermelon"
    ],
    "icon": "cob-ice",
    "hp": 1600,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "cannon": {
      "damage": 2900,
      "radius": 2.5,
      "interval": 17
    },
    "freezeAura": 4
  },
  {
    "id": "storm-gatling",
    "name": "风暴究极机枪",
    "inputs": [
      "ultimate-gatling",
      "blover"
    ],
    "icon": "ultimate-gatling",
    "hp": 1500,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 120,
    "shots": 8,
    "interval": 1.1,
    "windPulse": {
      "interval": 12
    },
    "antiAir": true
  },
  {
    "id": "poison-queen",
    "name": "剧毒魅帝菇",
    "inputs": [
      "hypno-emperor",
      "garlic"
    ],
    "icon": "hypno-emperor",
    "hp": 1000,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "hypno": true,
    "poisonAura": 7,
    "summonAlly": {
      "interval": 27,
      "type": "football"
    }
  },
  {
    "id": "meteor-melon",
    "name": "陨星樱桃冰瓜",
    "inputs": [
      "wintermelon",
      "cherry-warrior"
    ],
    "icon": "wintermelon",
    "hp": 1400,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 220,
    "interval": 2.2,
    "lob": true,
    "splash": {
      "damage": 430,
      "radius": 1.6
    },
    "freezeHit": 30
  },
  {
    "id": "inferno-cattail",
    "name": "炼狱三线猫尾",
    "inputs": [
      "cattail-three",
      "torch"
    ],
    "icon": "cattail-three",
    "hp": 950,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 80,
    "shots": 3,
    "interval": 1.2,
    "homing": true,
    "burn": 7,
    "antiAir": true
  },
  {
    "id": "butter-barrage",
    "name": "黄油风暴玉米炮",
    "inputs": [
      "cobcannon",
      "kernel"
    ],
    "icon": "cobcannon",
    "hp": 1200,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "cannon": {
      "damage": 2000,
      "radius": 2.2,
      "interval": 17
    },
    "damage": 65,
    "interval": 2.5,
    "lob": true,
    "butterChance": 0.5,
    "butterStun": 4
  },
  {
    "id": "magnet-star",
    "name": "磁能杨桃大帝",
    "inputs": [
      "star-emperor",
      "goldmagnet"
    ],
    "icon": "star-emperor",
    "hp": 1100,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "star": true,
    "damage": 105,
    "interval": 1,
    "magnet": {
      "interval": 7,
      "range": 4
    }
  },
  {
    "id": "nightshade-pumpkin",
    "name": "暗影魅惑南瓜",
    "inputs": [
      "ultimate-pumpkin",
      "hypno"
    ],
    "icon": "ultimate-pumpkin",
    "hp": 13500,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "hypno": true,
    "poisonAura": 5,
    "coverOnPlant": 3000
  },
  {
    "id": "sunburst-gatling",
    "name": "阳光爆裂机枪",
    "inputs": [
      "solar-gatling",
      "cherry"
    ],
    "icon": "solar-gatling",
    "hp": 1000,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 95,
    "shots": 4,
    "interval": 1.2,
    "sun": 25,
    "sunInterval": 20,
    "splash": {
      "damage": 90,
      "radius": 1
    }
  },
  {
    "id": "ice-laser-cactus",
    "name": "冰晶激光仙人掌",
    "inputs": [
      "blaze-cactus",
      "ice-shroom"
    ],
    "icon": "blaze-cactus",
    "hp": 1250,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 105,
    "shots": 3,
    "interval": 1.4,
    "freezeHit": 42,
    "pierce": true,
    "antiAir": true
  },
  {
    "id": "doom-lily",
    "name": "毁灭莲花",
    "inputs": [
      "lilypad",
      "doom"
    ],
    "icon": "lilypad",
    "hp": 650,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "mine": {
      "arm": 8,
      "damage": 2600,
      "radius": 2
    }
  },
  {
    "id": "electric-starfruit",
    "name": "闪电杨桃",
    "inputs": [
      "starfruit",
      "magnet"
    ],
    "icon": "starfruit",
    "hp": 650,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "star": true,
    "damage": 75,
    "interval": 1.1,
    "antiAir": true,
    "freezeHit": 10
  },
  {
    "id": "glacial-wall",
    "name": "冰川堡垒坚果",
    "inputs": [
      "tallnut",
      "wintermelon"
    ],
    "icon": "tallnut",
    "hp": 15500,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "coverOnPlant": 3000,
    "magnet": {
      "interval": 7,
      "range": 4.5
    },
    "spike": {
      "damage": 90,
      "interval": 1
    }
  },
  {
    "id": "shadow-chomper",
    "name": "暗影吞噬花",
    "inputs": [
      "chomper",
      "hypno-emperor"
    ],
    "icon": "chomper",
    "hp": 1400,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "chomp": {
      "range": 1.5,
      "digest": 14
    },
    "hypno": true
  },
  {
    "id": "titan-cattail",
    "name": "泰坦追踪猫尾",
    "inputs": [
      "cattail",
      "ultimate-gatling"
    ],
    "icon": "cattail",
    "hp": 1300,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "damage": 105,
    "shots": 4,
    "interval": 1.2,
    "homing": true,
    "antiAir": true
  },
  {
    "id": "volcanic-spikerock",
    "name": "熔岩钢刺王",
    "inputs": [
      "steel-spikerock",
      "torch"
    ],
    "icon": "steel-spikerock",
    "hp": 8200,
    "cooldown": 18,
    "approximate": true,
    "source": "experimental",
    "desc": "原创实验融合：结合两种材料的战斗能力，效果与数值为近似实现。",
    "spike": {
      "damage": 155,
      "interval": 0.65
    },
    "burnAura": 6,
    "low": true
  }
]);
