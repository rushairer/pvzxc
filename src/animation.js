/**
 * Character animation poses for the existing transparent illustration atlases.
 * Simulation data stays authoritative; poses are deterministic Canvas transforms.
 * All units share the same source art and remain stationary in the collision grid.
 */
const TAU=Math.PI*2;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:0));
const pulse=(remaining,duration)=>clamp((remaining||0)/duration);
function hash(value=''){
 let v=5381;
 for(const ch of String(value))v=((v*33)^ch.codePointAt(0))>>>0;
 return v%1024/1024*TAU;
}
export const ZOMBIE_DEATH_DURATION=.78;

/** Origin is the planting cell foot, not the center of the image. */
export function plantPose(p={},time=0,reducedMotion=false){
 const phase=hash(p.id||p.icon)+(p.age??time)*2.25;
 const attack=pulse(p.attackFx,.30);
 const hurt=pulse(p.hurtFx,.26);
 const low=!!(p.low||p.spike||/spike|potato|lilypad|tangle/.test(p.id||''));
 const sway=reducedMotion?0:(low?.009:.038)*Math.sin(phase);
 const breathe=reducedMotion?0:Math.sin(phase*.87);
 const shiver=reducedMotion?0:Math.sin(time*83);
 return {
  x:-14*attack+hurt*7*shiver,
  y:(reducedMotion?0:(low?.5:2.5)*Math.sin(phase*.84))-2.6*attack,
  angle:sway-.056*attack+hurt*shiver*.035,
  scaleX:1+.016*breathe+.12*attack,
  scaleY:1-.014*breathe-.10*attack,
  attack,hurt
 };
}

/**
 * Zombie motion is driven by the entity clock rather than frame timing.
 * Frozen: no gait. Eating: forward lunge. Death: fall, shrink, then fade out.
 */
export function zombiePose(z={},time=0,reducedMotion=false){
 const phase=hash(z.type)+((z.anim||0)*5.2);
 const walking=!!(!z.eating&&!z.frozen&&!z.butter);
 const weight=/garg|zomboss|football|zomboni/.test(z.type||'')?.62:1;
 const slow=z.slow>0?.56:1;
 const movement=(walking&&!reducedMotion?1:0)*weight*slow;
 const stride=Math.sin(phase),secondary=Math.sin(phase+Math.PI/2);
 const hit=pulse(z.hitFx,.26),bite=pulse(z.biteFx,.30);
 const isDying=Number.isFinite(z.deathElapsed);
 const death=isDying?clamp(z.deathElapsed/ZOMBIE_DEATH_DURATION):0;
 const ease=death*death*(3-2*death);
 const jump=z.jumpAnimation>0&&!reducedMotion?Math.sin((1-clamp(z.jumpAnimation/.65))*Math.PI)*22:0;
 const shiver=reducedMotion?0:Math.sin(time*88);
 return {
  x:movement*stride*2-17*bite+hit*7*shiver,
  y:movement*Math.abs(secondary)*-3-jump-2*bite+ease*7,
  angle:movement*stride*.05-bite*.17+hit*shiver*.06-ease*1.15,
  scaleX:1+movement*.025*stride+hit*.08,
  scaleY:1-movement*.035*Math.abs(secondary)+bite*.03-ease*.26,
  opacity:1-clamp((death-.45)/.55),
  bite,hit,death,
  walking
 };
}
