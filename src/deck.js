import {SEEDS,RECIPES,getPlant} from './model.js';

export const DECK_SIZE=10;
export const DEFAULT_DECK=Object.freeze(['sun','pea','wall','cherry','potato','chomper','snowpea','torch','threepeater','melon']);
export const ALL_CARDS=Object.freeze([...SEEDS,...RECIPES]);

export function validateDeck(ids,{strict=true}={}){
 if(!Array.isArray(ids))throw new Error('植物卡组格式不正确');
 if(ids.length!==DECK_SIZE){if(strict)throw new Error('每次必须选择恰好10张植物卡');return false;}
 const unique=new Set(ids);
 if(unique.size!==DECK_SIZE){if(strict)throw new Error('不能重复选择同一张植物卡');return false;}
 if(!ids.every(id=>typeof id==='string'&&ALL_CARDS.some(p=>p.id===id))){
  if(strict)throw new Error('卡组包含不存在的植物');return false;
 }
 return ids.slice();
}
export function deckFromIds(ids){return validateDeck(ids).map(id=>getPlant(id));}
export function seedSelection(name='',category='all'){
 const text=String(name).trim().toLocaleLowerCase('zh-CN');
 return ALL_CARDS.filter(p=>{
  const matched=(p.name+' '+p.id+' '+p.desc).toLocaleLowerCase('zh-CN').includes(text);
  return matched&&(category==='all'||(category==='base'?!p.inputs:!!p.inputs));
 });
}
export const DECK_LAYOUT=Object.freeze({
 x:219,y:18,width:110,height:57,columnStep:122,rowStep:65,columns:5,rows:2
});
export function seedAtPoint(x,y){
 const L=DECK_LAYOUT,col=Math.floor((x-L.x)/L.columnStep),row=Math.floor((y-L.y)/L.rowStep);
 if(col<0||col>=L.columns||row<0||row>=L.rows)return -1;
 const localX=x-(L.x+col*L.columnStep),localY=y-(L.y+row*L.rowStep);
 return localX>=0&&localX<=L.width&&localY>=0&&localY<=L.height?row*5+col:-1;
}
