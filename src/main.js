import { SEEDS, RECIPES, createPlant, fusionKey, costFor, recipeFor } from './model.js';
import { drawScene } from './render.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const overlay = document.querySelector('#mainOverlay');
const guide = document.querySelector('#guideOverlay');
const title = document.querySelector('#overlayTitle');
const description = document.querySelector('#overlayDescription');
const primary = document.querySelector('#primaryAction');
const secondary = document.querySelector('#secondaryAction');
const recipeGrid = document.querySelector('#recipeGrid');
const COLS = 9, ROWS = 5, CELL_W = 117, CELL_H = 108, BOARD_X = 181, BOARD_Y = 199;
const initialCooldowns = () => SEEDS.map(() => 0);
let state;
let lastFrame = performance.now();
let audioContext = null;

function sound(freq = 440, duration = 0.09, type = 'sine', volume = 0.035) {
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const osc = audioContext.createOscillator(), gain = audioContext.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    osc.connect(gain); gain.connect(audioContext.destination);
    osc.start(); osc.stop(audioContext.currentTime + duration);
  } catch { /* audio is optional */ }
}

function newState() {
  state = {
    mode: 'playing', paused: false, time: 0, sun: 200, selected: -1, shovel: false,
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    zombies: [], projectiles: [], suns: [], effects: [], mowers: Array(ROWS).fill(true),
    cooldowns: initialCooldowns(), spawnTimer: 7, skyTimer: 5, wave: 1, spawned: 0,
    kills: 0, message: '选择植物卡牌开始布阵！', messageTimer: 4, shake: 0,
    pointer: null, victoryTimer: 0, levelDuration: 170
  };
  overlay.classList.remove('is-visible');
  sound(500, .13); sound(650, .14);
}

function notify(message, seconds = 2.4) {
  state.message = message; state.messageTimer = seconds;
}
function awardSun(x, y, amount = 25, fromSky = false) {
  state.suns.push({ x, y: fromSky ? -20 : y - 40, targetY: y, amount, life: 10, phase: Math.random() * 6 });
}
function makeZombie(row, subtype = 'normal') {
  const hp = subtype === 'bucket' ? 560 : subtype === 'cone' ? 320 : subtype === 'runner' ? 130 : 190;
  const speed = subtype === 'runner' ? 40 : subtype === 'bucket' ? 13 : subtype === 'cone' ? 17 : 21;
  state.zombies.push({ x: 1410 + Math.random() * 70, row, y: BOARD_Y + (row + .54) * CELL_H, hp, maxHp: hp, speed, subtype, bite: 0, slowed: 0, attack: 20 });
}
function fire(p, r, c) {
  let y = BOARD_Y + r * CELL_H + CELL_H * .46;
  let x = BOARD_X + c * CELL_W + 78;
  const damage = p.damage;
  const count = p.double ? 2 : 1;
  for (let i = 0; i < count; i++) state.projectiles.push({
    x, y: y + (i ? 17 : 0), row: r, vx: 365, damage,
    slow: p.freeze, burn: p.burn, splash: p.splash, color: p.freeze ? '#a1efff' : p.burn ? '#f7ad43' : '#98d441',
    life: 4, radius: p.splash ? 12 : 9
  });
  if (p.lob) state.projectiles.push({
    x, y: y + 16, row: r, vx: 245, damage: 35, slow: 0, burn: 0, splash: 40,
    color: '#ffc86a', life: 4, radius: 14
  });
}
function burst(x, y, color = '#ffe991', count = 12) {
  for (let i = 0; i < count; i++) {
    let a = Math.random() * Math.PI * 2, speed = 40 + Math.random() * 140;
    state.effects.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 35, ttl: .45 + Math.random() * .35, max: .8, color, size: 2 + Math.random() * 5 });
  }
}
function explode(cx, row, radius = 135, damage = 280) {
  const cy = BOARD_Y + (row + .5) * CELL_H;
  for (const z of state.zombies) {
    const d = Math.hypot(z.x - cx, (z.y - cy) * 1.6);
    if (d < radius) z.hp -= damage * (1 - d / (radius * 1.8));
  }
  burst(cx, cy, '#ffad48', 32);
  state.shake = 10;
  sound(90, .25, 'sawtooth', .04);
}
function plantAt(r, c) {
  if (state.shovel) {
    if (!state.grid[r][c]) return notify('这块草坪还没有植物');
    state.grid[r][c] = null;
    state.shovel = false;
    notify('植物已铲除');
    sound(180, .08);
    return;
  }
  const idx = state.selected;
  if (idx < 0) return;
  if (state.cooldowns[idx] > 0) return notify('卡牌尚未冷却！');
  const seed = SEEDS[idx], existing = state.grid[r][c];
  const recipe = existing ? recipeFor(existing.parts, seed.id) : null;
  if (existing && !recipe) return notify('这两株植物无法融合，请查看融合图鉴！', 2.7);
  if (state.sun < seed.cost) return notify('阳光不足！');
  state.sun -= seed.cost;
  state.cooldowns[idx] = seed.cooldown;
  const x = BOARD_X + (c + .5) * CELL_W, y = BOARD_Y + (r + .61) * CELL_H;
  if (existing) {
    const p = createPlant(recipe, [...existing.parts, seed.id]);
    state.grid[r][c] = p;
    notify('融合成功：' + p.name + '！', 3);
    burst(x, y - 20, '#ffdf75', 23);
    sound(680, .17, 'triangle'); setTimeout(() => sound(910, .14, 'triangle'), 90);
  } else {
    state.grid[r][c] = createPlant(seed, [seed.id]);
    burst(x, y, '#cbef91', 7);
    sound(460, .09, 'sine');
  }
}
function canvasPoint(ev) {
  const rect = canvas.getBoundingClientRect();
  return { x: (ev.clientX - rect.left) * canvas.width / rect.width, y: (ev.clientY - rect.top) * canvas.height / rect.height };
}
function actionAt(x, y) {
  if (state.mode !== 'playing' || state.paused || guide.classList.contains('is-visible')) return;
  for (let i = state.suns.length - 1; i >= 0; i--) {
    const s = state.suns[i];
    if (Math.hypot(s.x - x, s.y - y) < 48) {
      state.sun += s.amount; state.suns.splice(i, 1); burst(x, y, '#ffe16b', 7); sound(790, .11); return;
    }
  }
  if (y < 148) {
    if (x >= 220 && x < 220 + SEEDS.length * 112) {
      const idx = Math.floor((x - 220) / 112);
      if (idx >= 0 && idx < SEEDS.length) {
        state.selected = state.selected === idx ? -1 : idx; state.shovel = false;
        sound(360, .05); return;
      }
    }
    if (x >= 1132 && x <= 1215) { state.shovel = !state.shovel; state.selected = -1; sound(340, .07); return; }
    if (x > 1265 && x < 1420) { state.paused = !state.paused; sound(400, .07); return; }
  }
  const c = Math.floor((x - BOARD_X) / CELL_W), r = Math.floor((y - BOARD_Y) / CELL_H);
  if (c >= 0 && c < COLS && r >= 0 && r < ROWS) plantAt(r, c);
}
canvas.addEventListener('pointerdown', ev => {
  ev.preventDefault();
  const p = canvasPoint(ev);
  actionAt(p.x, p.y);
});
canvas.addEventListener('pointermove', ev => state && (state.pointer = canvasPoint(ev)));
canvas.addEventListener('pointerleave', () => state && (state.pointer = null));
canvas.addEventListener('contextmenu', ev => { ev.preventDefault(); if(state) {state.selected = -1;state.shovel = false;} });
document.addEventListener('keydown', ev => {
  if (!state || guide.classList.contains('is-visible')) {
    if (ev.key === 'Escape') closeGuide();
    return;
  }
  if (ev.key >= '1' && ev.key <= '8') { state.selected = Number(ev.key) - 1; state.shovel = false; }
  if (ev.key === '0' || ev.key.toLowerCase() === 'x') { state.shovel = !state.shovel; state.selected = -1; }
  if (ev.key === 'Escape') {state.selected = -1; state.shovel = false;}
  if (ev.code === 'Space') { ev.preventDefault(); state.paused = !state.paused; }
});
function simulate(dt) {
  if (state.mode !== 'playing' || state.paused) return;
  state.time += dt;
  state.messageTimer = Math.max(0, state.messageTimer - dt);
  state.shake = Math.max(0, state.shake - dt * 25);
  state.cooldowns = state.cooldowns.map(n => Math.max(0, n - dt));
  state.skyTimer -= dt;
  if (state.skyTimer <= 0) {
    awardSun(BOARD_X + 60 + Math.random() * (COLS * CELL_W - 120), BOARD_Y + 80 + Math.random() * 420, 25, true);
    state.skyTimer = 7 + Math.random() * 4;
  }
  state.wave = Math.min(5, 1 + Math.floor(state.time / 35));
  const allWavesDone = state.time > state.levelDuration;
  state.spawnTimer -= dt;
  if (!allWavesDone && state.spawnTimer <= 0) {
    const danger = Math.min(4, Math.floor(state.time / 35));
    const row = Math.floor(Math.random() * ROWS);
    const roll = Math.random();
    const subtype = danger > 2 && roll < .16 ? 'bucket' : danger > 0 && roll < .37 ? 'cone' : danger > 1 && roll < .53 ? 'runner' : 'normal';
    makeZombie(row, subtype);
    if (danger >= 3 && Math.random() < .25) makeZombie(Math.floor(Math.random() * ROWS), 'normal');
    state.spawned++;
    state.spawnTimer = Math.max(2.0, 7.7 - danger * 1.1) + Math.random() * 1.6;
  }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const p = state.grid[r][c]; if (!p) continue;
    p.age += dt; p.timer -= dt;
    const x = BOARD_X + (c + .5) * CELL_W;
    const y = BOARD_Y + (r + .6) * CELL_H;
    if (p.production && p.timer <= 0) { awardSun(x + 8, y - 28, p.production); p.timer = p.interval; }
    else if (p.damage && p.timer <= 0) {
      const enemyInLane = state.zombies.some(z => z.row === r && z.x > x - 10 && z.hp > 0);
      if (enemyInLane) {fire(p,r,c);p.timer = p.interval;}
      else p.timer = Math.min(0, p.timer);
    } else if (p.explosive && p.timer <= 0) {
      const near = state.zombies.some(z => Math.abs(z.row - r) <= 1 && Math.abs(z.x - x) < 160);
      if (near) {explode(x,r,p.explosive,550); state.grid[r][c] = null;}
    }
  }
  for (const p of state.projectiles) {
    p.x += p.vx * dt; p.life -= dt;
    for (const z of state.zombies) {
      if (z.row !== p.row || z.hp <= 0) continue;
      if (Math.abs(z.x - p.x) < 24 && Math.abs(z.y - p.y) < 57) {
        z.hp -= p.damage;
        if (p.slow) z.slowed = Math.max(z.slowed, p.slow);
        if (p.burn) z.hp -= p.burn;
        if (p.splash) for (const other of state.zombies) if (other !== z && Math.hypot(other.x - z.x, (other.row - z.row) * 110) < p.splash + 30) other.hp -= p.damage * .6;
        p.life = -1; burst(p.x, p.y, p.color, 5); break;
      }
    }
  }
  state.projectiles = state.projectiles.filter(p => p.life > 0 && p.x < 1450);
  for (const z of state.zombies) {
    if (z.hp <= 0) continue;
    z.slowed = Math.max(0, z.slowed - dt);
    const col = Math.floor((z.x - BOARD_X) / CELL_W);
    const p = col >= 0 && col < COLS ? state.grid[z.row][col] : null;
    const px = BOARD_X + (col + .5) * CELL_W;
    const nearPlant = p && Math.abs(z.x - px) < 45;
    if (nearPlant) {
      z.bite -= dt;
      if (z.bite <= 0) {
        p.hp -= z.attack; z.bite = .65;
        if (p.hp <= 0) {state.grid[z.row][col] = null;burst(px,z.y - 20,'#a2d65e',14);sound(150,.09);}
      }
    } else z.x -= z.speed * (z.slowed > 0 ? .45 : 1) * dt;
    if (z.x < BOARD_X - 18 && state.mowers[z.row]) {
      state.mowers[z.row] = false;
      for (const other of state.zombies) if (other.row === z.row) other.hp = 0;
      burst(BOARD_X - 20, z.y, '#ffd267', 25);state.shake = 13;
      notify('割草机救下了第 ' + (z.row + 1) + ' 行！', 3);sound(110,.34,'sawtooth');
    } else if (z.x < BOARD_X - 80) endGame(false);
  }
  const alive = [];
  for (const z of state.zombies) if (z.hp > 0) alive.push(z); else {state.kills++;burst(z.x,z.y-38,'#a5ba8b',9);}
  state.zombies = alive;
  for (const s of state.suns) {
    s.phase += dt * 3; s.y += Math.min(85 * dt, Math.max(0, s.targetY - s.y)); s.life -= dt;
  }
  state.suns = state.suns.filter(s => s.life > 0);
  for (const e of state.effects) { e.x += e.vx * dt; e.y += e.vy * dt; e.vy += 170 * dt; e.ttl -= dt; }
  state.effects = state.effects.filter(e => e.ttl > 0);
  if (allWavesDone && !state.zombies.length) {
    state.victoryTimer += dt;
    if (state.victoryTimer > 1) endGame(true);
  }
}
function endGame(won) {
  if (state.mode !== 'playing') return;
  state.mode = won ? 'won' : 'lost';
  title.textContent = won ? '防线守住了！' : '僵尸入侵了！';
  description.textContent = won
    ? '你成功守住五波进攻，共击败 ' + state.kills + ' 个僵尸。继续尝试更多融合组合吧！'
    : '这次防线失守了，共击败 ' + state.kills + ' 个僵尸。调整你的植物布局，再挑战一次！';
  primary.textContent = '↻ 再玩一次';
  secondary.textContent = '查看融合图鉴';
  overlay.classList.add('is-visible');
  sound(won ? 740 : 170, .36, won ? 'sine' : 'triangle');
}
function openGuide() {guide.classList.add('is-visible');guide.setAttribute('aria-hidden','false');}
function closeGuide() {guide.classList.remove('is-visible');guide.setAttribute('aria-hidden','true');}
document.querySelector('#headerHelp').addEventListener('click', openGuide);
document.querySelector('#closeGuide').addEventListener('click', closeGuide);
guide.addEventListener('click', ev => {if (ev.target === guide) closeGuide();});
primary.addEventListener('click', newState);
secondary.addEventListener('click', openGuide);
for (const recipe of RECIPES) {
  const item = document.createElement('article'); item.className = 'recipe';
  const label = document.createElement('strong'); label.textContent = recipe.inputs.map(id => SEEDS.find(s => s.id === id).name).join(' + ') + ' → ' + recipe.name;
  const detail = document.createElement('small'); detail.textContent = recipe.desc;
  item.append(label,detail); recipeGrid.append(item);
}
function frame(now) {
  const dt = Math.min(.05, (now - lastFrame) / 1000); lastFrame = now;
  if (state) simulate(dt);
  drawScene(ctx, state, { SEEDS, BOARD_X, BOARD_Y, CELL_W, CELL_H, ROWS, COLS, costFor, fusionKey });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
