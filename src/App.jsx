import { useState, useEffect, useCallback } from “react”;

// ============================================================
// VERIFIED BASE SPEED DATA — Source: Game8 Pokemon Champions
// ============================================================
const SPEED_DB = {
“mega-alakazam”:150,“mega-aerodactyl”:150,“mega-beedrill”:145,“mega-greninja”:142,
dragapult:142,“mega-manectric”:135,“mega-lopunny”:135,“mega-delphox”:134,
“mega-gengar”:130,jolteon:130,aerodactyl:130,“floette-eternal”:128,talonflame:126,
weavile:125,meowscarada:123,greninja:122,“mega-pidgeot”:121,alakazam:120,
“mega-starmie”:120,“mega-froslass”:120,sneasler:120,hawlucha:118,salazzle:117,
whimsicott:116,starmie:115,“mega-houndoom”:115,“mega-absol”:115,serperior:113,
“mega-lucario”:112,maushold:111,raichu:110,“alolan-raichu”:110,gengar:110,
espeon:110,“mega-froslass”:120,froslass:110,“hisuian-zoroark”:110,
“alolan-ninetales”:109,infernape:108,liepard:106,lopunny:105,zoroark:105,
espathra:105,delphox:104,“meowstic-f”:104,“mega-excadrill”:103,garchomp:102,
“mega-floette”:102,charizard:100,“mega-charizard-x”:100,“mega-charizard-y”:100,
ninetales:100,“mega-kangaskhan”:100,volcarona:100,palafin:100,dragonite:80,
“mega-dragonite”:100,typhlosion:100,“mega-gardevoir”:100,“mega-medicham”:100,
hydreigon:98,mimikyu:96,arcanine:95,houndoom:95,sharpedo:95,leafeon:95,
gliscor:95,tinkaton:94,“mega-garchomp”:92,krookodile:92,“wash-rotom”:86,
“heat-rotom”:86,“frost-rotom”:86,glimmora:86,excadrill:88,gyarados:81,
“mega-gyarados”:81,milotic:81,venusaur:80,“mega-venusaur”:80,meganium:80,
“mega-meganium”:80,gardevoir:80,medicham:80,mamoswine:80,gallade:80,
chandelure:80,blastoise:78,“mega-blastoise”:78,feraligatr:78,“mega-feraligatr”:78,
“basculegion-m”:78,“basculegion-f”:78,scizor:65,“mega-scizor”:75,
kommo-o:85,ceruledge:85,archaludon:85,sylveon:60,clefable:60,aegislash:60,
incineroar:60,primarina:60,farigiraf:60,sinistcha:70,hatterene:29,
corviknight:67,skeledirge:66,pelipper:65,orthworm:65,chesnaught:64,
tyranitar:61,empoleon:60,abomasnow:60,“hisuian-goodra”:60,“hisuian-decidueye”:60,
oranguru:60,kingambit:50,sableye:50,aggron:50,“mega-aggron”:50,hippowdon:47,
conkeldurr:45,crabominable:43,araquanid:42,camerupt:40,rhyperior:40,
drampa:36,spiritomb:35,toxapex:35,mudsdale:35,garganacl:35,stunfisk:32,
slowbro:30,“mega-slowbro”:30,“galarian-slowbro”:30,snorlax:30,slowking:30,
“galarian-slowking”:30,steelix:30,“mega-steelix”:30,bastiodon:30,
“mega-abomasnow”:30,cofagrigus:30,reuniclus:30,aromatisse:29,avalugg:28,
“mega-sableye”:20,“mega-camerupt”:20,torkoal:20,politoed:70,
“mega-tyranitar”:71,tyrantrum:71,weavile:125,dragapult:142,
“hisuian-arcanine”:90,kangaskhan:90,lucario:90,vivillon:89,
tauros:110,vaporeon:65,flareon:65,umbreon:65,banette:65,
chimecho:65,glaceon:65,emboar:65,wyrdeer:65,“mega-chimecho”:65,
victreebel:70,skarmory:70,luxray:70,samurott:70,decidueye:70,
polteageist:70,“mr-rime”:70,flapple:70,castform:70,
heracross:85,toxicroak:85,kleavor:85,quaquaval:85,
“mega-heracross”:75,“mega-banette”:75,absol:75,garbodor:75,
florges:75,klefki:75,armarouge:75,scovillain:75,slurpuff:72,tsareena:72,
sandaconda:71,“mega-clefable”:70,rampardos:58,pangoro:58,aurorus:58,
torterra:56,trevenant:56,machamp:55,ampharos:55,golurk:55,
azumarill:50,audino:50,beartic:50,ditto:48,“mega-ampharos”:45,
bellibolt:45,“mega-chesnaught”:44,hydrapple:44,“mega-crabominable”:33,
“galarian-stunfisk”:32,appletun:30,runerigus:30,
};

const calcSpeed = (base, nature=“neutral”) => {
const raw = Math.floor((2*base+31)*50/100+5);
if (nature===“positive”) return Math.floor(raw*1.1);
if (nature===“negative”) return Math.floor(raw*0.9);
return raw;
};

// ============================================================
// TYPE CHART
// ============================================================
const TYPE_CHART = {
normal:{rock:0.5,ghost:0,steel:0.5},
fire:{fire:0.5,water:0.5,grass:2,ice:2,bug:2,rock:0.5,dragon:0.5,steel:2},
water:{fire:2,water:0.5,grass:0.5,ground:2,rock:2,dragon:0.5},
electric:{water:2,electric:0.5,grass:0.5,ground:0,flying:2,dragon:0.5},
grass:{fire:0.5,water:2,grass:0.5,poison:0.5,ground:2,flying:0.5,bug:0.5,rock:2,dragon:0.5,steel:0.5},
ice:{water:0.5,grass:2,ice:0.5,ground:2,flying:2,dragon:2,steel:0.5},
fighting:{normal:2,ice:2,poison:0.5,flying:0.5,psychic:0.5,bug:0.5,rock:2,ghost:0,dark:2,steel:2,fairy:0.5},
poison:{grass:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0,fairy:2},
ground:{fire:2,electric:2,grass:0.5,poison:2,flying:0,bug:0.5,rock:2,steel:2},
flying:{electric:0.5,grass:2,fighting:2,bug:2,rock:0.5,steel:0.5},
psychic:{fighting:2,poison:2,psychic:0.5,dark:0,steel:0.5},
bug:{fire:0.5,grass:2,fighting:0.5,flying:0.5,psychic:2,ghost:0.5,dark:2,steel:0.5,fairy:0.5},
rock:{fire:2,ice:2,fighting:0.5,ground:0.5,flying:2,bug:2,steel:0.5},
ghost:{normal:0,psychic:2,ghost:2,dark:0.5},
dragon:{dragon:2,steel:0.5,fairy:0},
dark:{fighting:0.5,psychic:2,ghost:2,dark:0.5,fairy:0.5},
steel:{fire:0.5,water:0.5,electric:0.5,ice:2,rock:2,steel:0.5,fairy:2},
fairy:{fire:0.5,fighting:2,poison:0.5,dragon:2,dark:2,steel:0.5},
};

const POKEMON_TYPES = {
incineroar:[“fire”,“dark”],sneasler:[“fighting”,“poison”],garchomp:[“dragon”,“ground”],
sinistcha:[“grass”,“ghost”],kingambit:[“dark”,“steel”],basculegion:[“water”,“ghost”],
“floette-eternal”:[“fairy”],charizard:[“fire”,“flying”],“rotom-wash”:[“electric”,“water”],
whimsicott:[“grass”,“fairy”],aerodactyl:[“rock”,“flying”],pelipper:[“water”,“flying”],
tyranitar:[“rock”,“dark”],archaludon:[“steel”,“dragon”],dragonite:[“dragon”,“flying”],
farigiraf:[“normal”,“psychic”],venusaur:[“grass”,“poison”],gengar:[“ghost”,“poison”],
froslass:[“ice”,“ghost”],milotic:[“water”],maushold:[“normal”],corviknight:[“steel”,“flying”],
excadrill:[“steel”,“ground”],delphox:[“fire”,“psychic”],gardevoir:[“psychic”,“fairy”],
aegislash:[“steel”,“ghost”],talonflame:[“fire”,“flying”],kommo-o:[“dragon”,“fighting”],
meganium:[“grass”],primarina:[“water”,“fairy”],torkoal:[“fire”],palafin:[“water”],
politoed:[“water”],glimmora:[“rock”,“poison”],“ninetales-alola”:[“ice”,“fairy”],
clefable:[“fairy”],scizor:[“bug”,“steel”],hatterene:[“psychic”,“fairy”],
weavile:[“dark”,“ice”],dragapult:[“dragon”,“ghost”],hydreigon:[“dark”,“dragon”],
sylveon:[“fairy”],mimikyu:[“ghost”,“fairy”],mamoswine:[“ice”,“ground”],
gyarados:[“water”,“flying”],hawlucha:[“fighting”,“flying”],greninja:[“water”,“dark”],
“hisuian-zoroark”:[“normal”,“ghost”],medicham:[“fighting”,“psychic”],
kangaskhan:[“normal”],lopunny:[“normal”],gallade:[“psychic”,“fighting”],
blastoise:[“water”],feraligatr:[“water”],chesnaught:[“grass”,“fighting”],
victreebel:[“grass”,“poison”],volcarona:[“bug”,“fire”],skeledirge:[“fire”,“ghost”],
scovillain:[“grass”,“fire”],meowscarada:[“grass”,“dark”],“meowstic-f”:[“psychic”],
crabominable:[“fighting”,“ice”],aggron:[“steel”,“rock”],orthworm:[“steel”],
krookodile:[“ground”,“dark”],“wash-rotom”:[“electric”,“water”],
“heat-rotom”:[“fire”,“electric”],“frost-rotom”:[“electric”,“ice”],
};

const MOVE_NAMES = {
252:“Fake Out”,575:“Parting Shot”,394:“Flare Blitz”,675:“Throat Chop”,663:“Darkest Lariat”,
182:“Protect”,261:“Will-O-Wisp”,270:“Taunt”,269:“Helping Hand”,555:“Snarl”,370:“Close Combat”,
827:“Dire Claw”,157:“Rock Slide”,337:“Dragon Claw”,89:“Earthquake”,707:“Stomping Tantrum”,
14:“Swords Dance”,444:“Poison Jab”,398:“Iron Head”,902:“Matcha Gotcha”,476:“Rage Powder”,
433:“Trick Room”,791:“Life Dew”,668:“Imprison”,247:“Shadow Ball”,286:“Calm Mind”,
347:“Dazzling Gleam”,503:“Scald”,196:“Icy Wind”,58:“Ice Beam”,105:“Recover”,
330:“Muddy Water”,266:“Follow Me”,162:“Super Fang”,413:“Brave Bird”,366:“Tailwind”,
814:“Dual Wingbeat”,469:“Roost”,542:“Hurricane”,311:“Weather Ball”,85:“Thunderbolt”,
521:“Volt Switch”,527:“Hydro Pump”,271:“Thunder Wave”,905:“Electro Shot”,430:“Flash Cannon”,
434:“Draco Meteor”,406:“Aura Sphere”,396:“Dragon Pulse”,854:“Last Respects”,834:“Wave Crash”,
605:“Moonblast”,94:“Psychic”,257:“Heat Wave”,76:“Solar Beam”,315:“Hyper Voice”,
349:“Fire Blast”,188:“Sleep Powder”,79:“Sludge Bomb”,414:“Energy Ball”,412:“Giga Drain”,
284:“Eruption”,389:“Sucker Punch”,869:“Kowtow Cleave”,67:“Low Kick”,59:“Blizzard”,
694:“Aurora Veil”,282:“Crunch”,8:“Ice Punch”,242:“Extreme Speed”,691:“Clanging Scales”,
418:“Bullet Punch”,450:“Bug Bite”,492:“Stored Power”,
};

const ITEM_NAMES = {
135:“Sitrus Berry”,166:“Chople Berry”,168:“Shuca Berry”,211:“Leftovers”,134:“Lum Berry”,
162:“Mental Herb”,191:“White Herb”,252:“Focus Sash”,264:“Choice Scarf”,214:“Yache Berry”,
174:“Haban Berry”,165:“Roseli Berry”,190:“Choice Band”,220:“Choice Specs”,219:“Life Orb”,
194:“Assault Vest”,226:“Charcoal”,224:“Air Balloon”,175:“Occa Berry”,173:“Colbur Berry”,
2579:“Floettite”,717:“Charizardite Y”,699:“Charizardite X”,708:“Tyranitarite”,
2566:“Froslassite”,163:“Power Herb”,2563:“Meganiumite”,695:“Gengarite”,696:“Gardevoirite”,
289:“Loaded Dice”,217:“Black Glasses”,
};

const ABILITY_NAMES = {
22:“Intimidate”,66:“Blaze”,24:“Rough Skin”,45:“Sand Stream”,299:“Hospitality”,
128:“Defiant”,293:“Supreme Overlord”,2:“Drizzle”,127:“Unnerve”,26:“Levitate”,
158:“Prankster”,34:“Chlorophyll”,65:“Overgrow”,130:“Cursed Body”,23:“Shadow Tag”,
81:“Snow Cloak”,117:“Snow Warning”,172:“Competitive”,63:“Marvel Scale”,
132:“Friend Guard”,101:“Technician”,91:“Adaptability”,33:“Swift Swim”,
104:“Motor Drive”,140:“Telepathy”,36:“Trace”,182:“Pixilate”,176:“Stance Change”,
177:“Gale Wings”,43:“Bulletproof”,192:“Stamina”,5:“Sturdy”,242:“Cloud Nine”,
70:“Drought”,73:“Shell Armor”,102:“Thick Fat”,204:“Liquid Voice”,109:“Magic Guard”,
98:“Magic Bounce”,156:“Aroma Veil”,136:“Multiscale”,296:“Armor Tail”,166:“Fairy Aura”,
159:“Sand Force”,146:“Sand Rush”,84:“Unburden”,143:“Poison Touch”,
};

const resolveName=(id,map)=>map[id]||null;
const normalize=s=>s.toLowerCase().trim().replace(/[^a-z0-9-]/g,””).replace(/\s+/g,”-”);
const getTypeEff=(mt,dts)=>{ let m=1; for(const dt of dts) m*=((TYPE_CHART[mt]||{})[dt]??1); return m; };

// ============================================================
// ARCHETYPE DETECTION & LEAD PAIRS
// ============================================================
const ARCHETYPE_SETTERS = {
rain:[“pelipper”,“politoed”],
sun:[“charizard”,“torkoal”,“mega-charizard-y”],
sand:[“tyranitar”,“hippowdon”,“mega-tyranitar”],
snow:[“froslass”,“mega-froslass”,“alolan-ninetales”,“abomasnow”],
trickroom:[“sinistcha”,“farigiraf”,“hatterene”,“cofagrigus”,“reuniclus”,“oranguru”,“drampa”],
};

const LEAD_PAIRS=[
{pair:[“pelipper”,“archaludon”],prob:0.85,note:“Core Rain lead”},
{pair:[“pelipper”,“incineroar”],prob:0.70,note:“Rain + Fake Out support”},
{pair:[“pelipper”,“basculegion-m”],prob:0.65,note:“Rain + Swift Swim sweeper”},
{pair:[“charizard”,“incineroar”],prob:0.80,note:“Sun + Fake Out support”},
{pair:[“charizard”,“venusaur”],prob:0.75,note:“Sun + Chlorophyll core”},
{pair:[“sinistcha”,“incineroar”],prob:0.80,note:“Trick Room + Fake Out”},
{pair:[“farigiraf”,“incineroar”],prob:0.75,note:“Trick Room + Fake Out”},
{pair:[“hatterene”,“incineroar”],prob:0.70,note:“Trick Room + Fake Out”},
{pair:[“tyranitar”,“excadrill”],prob:0.80,note:“Sand Rush core”},
{pair:[“tyranitar”,“incineroar”],prob:0.65,note:“Sand + Intimidate”},
{pair:[“incineroar”,“sneasler”],prob:0.70,note:“Fake Out + offensive pressure”},
{pair:[“incineroar”,“garchomp”],prob:0.60,note:“Intimidate + Earthquake spread”},
{pair:[“incineroar”,“archaludon”],prob:0.65,note:“Intimidate + Electro Shot”},
{pair:[“incineroar”,“floette-eternal”],prob:0.60,note:“Intimidate + Fairy sweep”},
{pair:[“maushold”,“sinistcha”],prob:0.70,note:“Follow Me + Trick Room”},
];

function detectArchetype(keys){
for(const[arch,setters]of Object.entries(ARCHETYPE_SETTERS)){
if(setters.some(s=>keys.includes(s)))return arch;
}
return “standard”;
}

function predictLeads(keys,archetype){
let best=null,bestProb=0;
for(const lp of LEAD_PAIRS){
if(lp.pair.every(p=>keys.includes(p))&&lp.prob>bestProb){best=lp;bestProb=lp.prob;}
}
if(best)return best;
if(archetype===“rain”&&keys.includes(“pelipper”))return{pair:[“pelipper”,keys.find(p=>p!==“pelipper”)||keys[0]],prob:0.6,note:“Rain setter + partner”};
if(archetype===“trickroom”){const setter=keys.find(p=>ARCHETYPE_SETTERS.trickroom.includes(p));if(setter){const sup=keys.find(p=>p!==setter)||keys[0];return{pair:[setter,sup],prob:0.6,note:“Trick Room setter + support”};}}
return null;
}

// ============================================================
// ABILITY CONFLICTS
// ============================================================
const ABILITY_CONFLICTS=[
{userAbility:“intimidate”,oppAbility:“defiant”,penalty:4,note:“Intimidate triggers Defiant +2 Atk”},
{userAbility:“intimidate”,oppAbility:“competitive”,penalty:4,note:“Intimidate triggers Competitive +2 SpA”},
{userAbility:“intimidate”,oppAbility:“contrary”,penalty:3,note:“Intimidate boosts Contrary users”},
{userAbility:“drizzle”,oppAbility:“cloud-nine”,penalty:3,note:“Cloud Nine nullifies Rain”},
{userAbility:“drought”,oppAbility:“cloud-nine”,penalty:3,note:“Cloud Nine nullifies Sun”},
];

// ============================================================
// META API
// ============================================================
const META_API=“https://eurekaffeine.github.io/pokemon-champions-scraper/battle_meta.json”;

// ============================================================
// ANALYSIS ENGINE
// ============================================================
function analyzeMatchup(opponentNames,myTeam,metaData){
const opp=opponentNames.map(name=>{
const key=normalize(name);
const meta=metaData?.pokemon_usage?.find(p=>normalize(p.name)===key);
return{
name,key,
usageRate:meta?.usage_rate||0.03,
topMoves:(meta?.top_moves||[]).slice(0,4).map(m=>resolveName(m.id,MOVE_NAMES)).filter(Boolean),
topItem:meta?.top_items?.[0]?resolveName(meta.top_items[0].id,ITEM_NAMES):null,
topAbility:meta?.top_abilities?.[0]?resolveName(meta.top_abilities[0].id,ABILITY_NAMES):null,
types:POKEMON_TYPES[key]||[“normal”],
};
});

const oppKeys=opp.map(p=>p.key);
const archetype=detectArchetype(oppKeys);
const leadPred=predictLeads(oppKeys,archetype);

const byUsage=[…opp].sort((a,b)=>{
let sa=a.usageRate,sb=b.usageRate;
if(leadPred?.pair.includes(a.key))sa+=0.3;
if(leadPred?.pair.includes(b.key))sb+=0.3;
return sb-sa;
});

const predictedBring=byUsage.slice(0,4);
const predictedLeads=leadPred
?leadPred.pair.map(lk=>opp.find(p=>p.key===lk)).filter(Boolean)
:byUsage.slice(0,2);

const myScored=myTeam.filter(m=>m.name.trim()).map(mon=>{
const monKey=normalize(mon.name);
const monTypes=POKEMON_TYPES[monKey]||[“normal”];
const ab=(mon.ability||””).toLowerCase();
const moves=(mon.moves||[]).map(m=>m.toLowerCase());
let score=0;
const reasons=[];
const warnings=[];

```
for(const o of predictedBring){
  for(const mt of monTypes){const e=getTypeEff(mt,o.types);if(e>=2){score+=2;reasons.push(`SE vs ${o.name}`);}else if(e===0)score-=1;}
  for(const ot of o.types){const e=getTypeEff(ot,monTypes);if(e>=2)score-=1.5;else if(e<=0.5&&e>0)score+=0.5;else if(e===0)score+=1.5;}
  const oppAb=(o.topAbility||"").toLowerCase().replace(/\s/g,"-");
  for(const c of ABILITY_CONFLICTS){
    if(ab.includes(c.userAbility)&&oppAb.includes(c.oppAbility)){score-=c.penalty;warnings.push(`⚠ ${c.note} — avoid leading into ${o.name}`);}
  }
}

if(ab.includes("intimidate")){score+=3;reasons.push("Intimidate both opponents");}
if(ab.includes("competitive")&&predictedBring.some(p=>(p.topAbility||"").toLowerCase().includes("intimidate"))){score+=2.5;reasons.push("Free +2 SpA vs Intimidate");}
if(ab.includes("drought")){score+=3;reasons.push("Sets Sun");}
if(ab.includes("chlorophyll")){score+=2;reasons.push("Chlorophyll speed under Sun");}
if(ab.includes("telepathy")&&myTeam.some(m=>(m.moves||[]).some(mv=>mv.toLowerCase().includes("earthquake")))){score+=1.5;reasons.push("Safe with Earthquake");}
if(ab.includes("multiscale")){score+=1;reasons.push("Multiscale survives first hit");}
if(ab.includes("magic bounce")&&archetype==="trickroom"){score+=2;reasons.push("Magic Bounce blocks TR support");}
if(moves.includes("fake out")){score+=2.5;reasons.push("Fake Out turn 1");}
if(moves.includes("tailwind")){score+=2;reasons.push("Tailwind speed control");}
if(moves.some(m=>m.includes("parting shot"))){score+=2;reasons.push("Parting Shot pivot");}
if(moves.includes("follow me")||moves.includes("rage powder")){score+=2;reasons.push("Redirection support");}
if(moves.includes("helping hand")){score+=1;reasons.push("Helping Hand boost");}

const reason=warnings.length>0?warnings[0]:(reasons.slice(0,2).join(" · ")||"General coverage");
return{...mon,score,reason,hasWarning:warnings.length>0,key:monKey};
```

});

const yourPick=[…myScored].sort((a,b)=>b.score-a.score).slice(0,4);

const keyThreats=[];
for(const o of predictedBring){
const threatened=myTeam.filter(m=>{ const mt=POKEMON_TYPES[normalize(m.name)]||[“normal”]; return o.types.some(ot=>getTypeEff(ot,mt)>=2); });
if(threatened.length>=2)keyThreats.push({name:o.name,threat:`Threatens ${threatened.map(m=>m.name).join(" & ")} — don't lead both into ${o.name}`});
const oppAb=(o.topAbility||””).toLowerCase().replace(/\s/g,”-”);
for(const c of ABILITY_CONFLICTS){
const cm=yourPick.find(p=>(p.ability||””).toLowerCase().includes(c.userAbility));
if(cm&&oppAb.includes(c.oppAbility))keyThreats.push({name:o.name,threat:`${c.note} — consider not leading ${cm.name} into ${o.name}`});
}
}

// Adjustment guide — ONLY wildcards not in predicted bring
const wildcards=byUsage.filter(p=>!predictedBring.find(pb=>pb.key===p.key));
const adjustments=[];
if(archetype!==“standard”){
adjustments.push({
if:`${archetype.charAt(0).toUpperCase()+archetype.slice(1)} team confirmed`,
then:archetype===“trickroom”?“Apply max damage before TR goes up — target the setter’s support first”:
archetype===“rain”?“Watch for Swift Swim sweepers behind Pelipper”:
archetype===“sun”?“Watch for Chlorophyll speed threats once Sun is up”:
archetype===“sand”?“Excadrill doubles speed in Sand — eliminate Tyranitar first”:
“Adjust for weather conditions”
});
}
for(const wc of wildcards.slice(0,2)){
adjustments.push({
if:`${wc.name} in lead (surprise pick)`,
then:`Not predicted — ${wc.types.join("/")} typing may require swapping a back pick for better coverage`
});
}

return{opponentPrediction:byUsage,predictedBring,predictedLeads,leadNote:leadPred?.note||null,archetype,yourPick,adjustments,keyThreats:keyThreats.slice(0,3)};
}

// ============================================================
// STORAGE
// ============================================================
const storage={
get:(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}},
set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

function getDefaultTeam(){
return[
{name:“Charizard”,ability:“Blaze → Drought (Mega)”,item:“Charizardite Y”,moves:[“Heat Wave”,“Weather Ball”,“Solar Beam”,“Protect”]},
{name:“Venusaur”,ability:“Chlorophyll”,item:“Focus Sash”,moves:[“Energy Ball”,“Sludge Bomb”,“Sleep Powder”,“Protect”]},
{name:“Garchomp”,ability:“Rough Skin”,item:“Yache Berry”,moves:[“Dragon Claw”,“Earthquake”,“Rock Slide”,“Protect”]},
{name:“Incineroar”,ability:“Intimidate”,item:“Sitrus Berry”,moves:[“Throat Chop”,“Helping Hand”,“Fake Out”,“Parting Shot”]},
{name:“Gardevoir”,ability:“Telepathy”,item:“Choice Scarf”,moves:[“Moonblast”,“Dazzling Gleam”,“Psychic”,“Icy Wind”]},
{name:“Milotic”,ability:“Competitive”,item:“Leftovers”,moves:[“Scald”,“Ice Beam”,“Life Dew”,“Protect”]},
];
}

// ============================================================
// MAIN APP
// ============================================================
export default function App(){
const[tab,setTab]=useState(“team”);
const[myTeam,setMyTeam]=useState(()=>storage.get(“ts_team_v3”,getDefaultTeam()));
const[editingTeam,setEditingTeam]=useState(false);
const[metaData,setMetaData]=useState(null);
const[metaStatus,setMetaStatus]=useState(“loading”);
const[opponent,setOpponent]=useState([””,””,””,””,””,””]);
const[analysis,setAnalysis]=useState(null);
const[analyzing,setAnalyzing]=useState(false);
const[matchLog,setMatchLog]=useState(()=>storage.get(“ts_log_v3”,[]));
const[logEntry,setLogEntry]=useState({myBring:””,myLead:””,theirBring:””,theirLead:””,result:””,notes:””});

useEffect(()=>{
fetch(META_API).then(r=>r.json()).then(d=>{setMetaData(d);setMetaStatus(“live”);}).catch(()=>setMetaStatus(“offline”));
},[]);

const saveTeam=t=>{setMyTeam(t);storage.set(“ts_team_v3”,t);};
const addLog=entry=>{const next=[entry,…matchLog].slice(0,100);setMatchLog(next);storage.set(“ts_log_v3”,next);};
const clearLog=()=>{setMatchLog([]);storage.set(“ts_log_v3”,[]);};

const runAnalysis=useCallback(()=>{
const filled=opponent.filter(p=>p.trim());
if(filled.length<4)return;
setAnalyzing(true);
setTimeout(()=>{setAnalysis(analyzeMatchup(filled,myTeam,metaData));setAnalyzing(false);},500);
},[opponent,myTeam,metaData]);

const logMatch=()=>{
if(!analysis)return;
addLog({
date:new Date().toLocaleDateString(),
opponentSeen:opponent.filter(p=>p.trim()),
opponentPredicted:analysis.predictedBring.map(p=>p.name),
opponentPredictedLead:analysis.predictedLeads.map(p=>p.name),
yourRecommended:analysis.yourPick.map(p=>p.name),
archetype:analysis.archetype,
myActualBring:logEntry.myBring,
myActualLead:logEntry.myLead,
theirActualBring:logEntry.theirBring,
theirActualLead:logEntry.theirLead,
result:logEntry.result,
notes:logEntry.notes,
});
setLogEntry({myBring:””,myLead:””,theirBring:””,theirLead:””,result:””,notes:””});
};

const wins=matchLog.filter(e=>e.result===“W”).length;
const losses=matchLog.filter(e=>e.result===“L”).length;

return(
<div style={s.root}>
<div style={s.header}>
<div style={s.headerLeft}><Pokeball/><div><div style={s.title}>TEAM SCOUT</div><div style={s.subtitle}>Pokémon Champions · Season M-1</div></div></div>
<div style={{display:“flex”,alignItems:“center”,gap:8,flexWrap:“wrap”}}>
{matchLog.length>0&&<div style={s.wlBadge}><span style={{color:”#4caf50”}}>W{wins}</span><span style={{color:”#444”}}>/</span><span style={{color:”#e85d2f”}}>L{losses}</span></div>}
<StatusBadge status={metaStatus} updatedAt={metaData?.updated_at}/>
</div>
</div>
<div style={s.tabBar}>
{[[“team”,“MY TEAM”],[“match”,“ANALYSIS”],[“speed”,“SPEED”],[“log”,`LOG${matchLog.length>0?` (${matchLog.length})`:""}`]].map(([id,label])=>(
<button key={id} style={{…s.tabBtn,…(tab===id?s.tabActive:{})}} onClick={()=>setTab(id)}>{label}</button>
))}
</div>
<div style={s.content}>
{tab===“team”&&<TeamTab myTeam={myTeam} saveTeam={saveTeam} editing={editingTeam} setEditing={setEditingTeam}/>}
{tab===“match”&&<MatchTab opponent={opponent} setOpponent={setOpponent} runAnalysis={runAnalysis} analyzing={analyzing} analysis={analysis} metaStatus={metaStatus} logEntry={logEntry} setLogEntry={setLogEntry} logMatch={logMatch}/>}
{tab===“speed”&&<SpeedTab myTeam={myTeam}/>}
{tab===“log”&&<LogTab matchLog={matchLog} clearLog={clearLog} wins={wins} losses={losses}/>}
</div>
</div>
);
}

function Pokeball(){
return(<div style={{width:34,height:34,borderRadius:“50%”,border:“2px solid #2a2a2a”,overflow:“hidden”,position:“relative”,flexShrink:0}}><div style={{position:“absolute”,top:0,left:0,right:0,height:“50%”,background:”#e85d2f”}}/><div style={{position:“absolute”,bottom:0,left:0,right:0,height:“50%”,background:”#111”}}/><div style={{position:“absolute”,top:“50%”,left:0,right:0,height:3,background:”#222”,transform:“translateY(-50%)”}}/><div style={{position:“absolute”,top:“50%”,left:“50%”,transform:“translate(-50%,-50%)”,width:10,height:10,borderRadius:“50%”,background:”#1a1a1a”,border:“2px solid #333”,zIndex:2}}/></div>);
}

function StatusBadge({status,updatedAt}){
if(status===“loading”)return<div style={{…s.badge,color:”#666”,borderColor:”#222”}}>CONNECTING…</div>;
if(status===“live”)return(<div style={{…s.badge,color:”#4caf50”,borderColor:”#1a3a1a”,background:”#0a1a0a”,gap:6}}><div style={{width:6,height:6,borderRadius:“50%”,background:”#4caf50”,boxShadow:“0 0 6px #4caf50”,flexShrink:0}}/> LIVE · {new Date(updatedAt).toLocaleDateString()}</div>);
return<div style={{…s.badge,color:”#f59e0b”,borderColor:”#3a2a00”,background:”#1a1400”}}>OFFLINE</div>;
}

// ============================================================
// TEAM TAB
// ============================================================
function TeamTab({myTeam,saveTeam,editing,setEditing}){
const[draft,setDraft]=useState(myTeam);
useEffect(()=>setDraft(myTeam),[myTeam]);
const save=()=>{saveTeam(draft);setEditing(false);};
const cancel=()=>{setDraft(myTeam);setEditing(false);};
const upd=(i,f,v)=>setDraft(p=>p.map((m,idx)=>idx===i?{…m,[f]:v}:m));
const updMove=(i,mi,v)=>setDraft(p=>p.map((m,idx)=>{if(idx!==i)return m;const mv=[…m.moves];mv[mi]=v;return{…m,moves:mv};}));
return(
<div>
<div style={s.secHeader}>
<div><div style={s.secTitle}>YOUR TEAM</div><div style={s.secSub}>Auto-saved · Persists between sessions</div></div>
{!editing?<button style={s.btnPrimary} onClick={()=>{setDraft(myTeam);setEditing(true);}}>EDIT TEAM</button>:
<div style={{display:“flex”,gap:8}}><button style={s.btnPrimary} onClick={save}>SAVE</button><button style={s.btnGhost} onClick={cancel}>CANCEL</button></div>}
</div>
<div style={s.teamGrid}>
{(editing?draft:myTeam).map((mon,i)=>(
<div key={i} style={s.monCard}>
<div style={s.monTop}>
<div style={s.slot}>{i+1}</div>
{editing?<input style={s.nameInput} value={draft[i].name} onChange={e=>upd(i,“name”,e.target.value)} placeholder=“Pokémon name”/>:
<div style={s.monName}>{mon.name||<span style={{color:”#333”}}>Empty</span>}</div>}
</div>
{editing?(
<div>
{[[“ability”,“ABILITY”,“e.g. Intimidate”],[“item”,“ITEM”,“e.g. Sitrus Berry”]].map(([f,l,ph])=>(
<div key={f} style={{marginBottom:8}}><div style={s.fl}>{l}</div><input style={s.input} value={draft[i][f]} onChange={e=>upd(i,f,e.target.value)} placeholder={ph}/></div>
))}
<div style={s.fl}>MOVES</div>
{[0,1,2,3].map(mi=><input key={mi} style={{…s.input,marginBottom:4}} value={draft[i].moves[mi]||””} onChange={e=>updMove(i,mi,e.target.value)} placeholder={`Move ${mi+1}`}/>)}
</div>
):(
<div>
<div style={s.detRow}><span style={s.dl}>ABILITY</span><span style={s.dv}>{mon.ability||”—”}</span></div>
<div style={s.detRow}><span style={s.dl}>ITEM</span><span style={s.dv}>{mon.item||”—”}</span></div>
<div style={s.moveWrap}>{(mon.moves||[]).filter(Boolean).map((m,mi)=><div key={mi} style={s.moveChip}>{m}</div>)}</div>
</div>
)}
</div>
))}
</div>
</div>
);
}

// ============================================================
// MATCH TAB
// ============================================================
function MatchTab({opponent,setOpponent,runAnalysis,analyzing,analysis,metaStatus,logEntry,setLogEntry,logMatch}){
const filled=opponent.filter(p=>p.trim()).length;
const canAnalyze=filled>=4&&!analyzing&&metaStatus!==“loading”;
return(
<div>
<div style={s.card}>
<div style={s.cardHeader}><div style={s.cardTitle}>TEAM PREVIEW</div><button style={s.btnGhost} onClick={()=>setOpponent([””,””,””,””,””,””])}>CLEAR</button></div>
<div style={s.cardSub}>Enter all 6 Pokémon from opponent’s preview screen</div>
<div style={s.inputGrid}>
{opponent.map((p,i)=>(
<div key={i} style={s.inputRow}>
<div style={s.inputNum}>{i+1}</div>
<input style={s.pokeinput} value={p} onChange={e=>{const n=[…opponent];n[i]=e.target.value;setOpponent(n);}} onKeyDown={e=>e.key===“Enter”&&canAnalyze&&runAnalysis()} placeholder={`Pokémon ${i+1}`}/>
</div>
))}
</div>
<div style={s.analyzeRow}>
<span style={s.filledLabel}>{filled}/6 entered · min 4</span>
<button style={{...s.btnPrimary,...(!canAnalyze?s.btnDis:{})}} onClick={runAnalysis} disabled={!canAnalyze}>
{metaStatus===“loading”?“LOADING…”:(analyzing?“ANALYZING…”:“ANALYZE”)}
</button>
</div>
</div>

```
  {analysis&&!analyzing&&(<>
    {analysis.archetype!=="standard"&&(
      <div style={{...s.card,background:"#0d1a0d",border:"1px solid #1a3a1a"}}>
        <div style={{fontSize:10,color:"#4caf50",letterSpacing:3,fontWeight:700,marginBottom:4}}>ARCHETYPE DETECTED</div>
        <div style={{fontSize:14,fontWeight:900,color:"#e2e2e2",letterSpacing:2}}>{analysis.archetype.toUpperCase()} TEAM</div>
        {analysis.leadNote&&<div style={{fontSize:10,color:"#5a6070",marginTop:4}}>Expected lead: {analysis.leadNote}</div>}
      </div>
    )}

    <div style={s.card}>
      <div style={s.cardTitle}>OPPONENT — PREDICTED BRING</div>
      <div style={s.cardSub}>Ranked by meta usage + archetype leads · Highlighted = likely lead</div>
      <div style={s.predGrid}>
        {analysis.opponentPrediction.map((pred,i)=>{
          const isLead=analysis.predictedLeads.some(l=>l.key===pred.key);
          return(<div key={i} style={{...s.predCard,...(isLead?s.predLead:{})}}>
            {isLead&&<div style={s.leadTag}>LIKELY LEAD</div>}
            <div style={s.predRank}>#{i+1} · {(pred.usageRate*100).toFixed(0)}%</div>
            <div style={s.predName}>{pred.name}</div>
            <div style={s.chipRow}>
              {pred.topMoves.slice(0,3).map((m,mi)=><div key={mi} style={s.chip}>{m}</div>)}
              {pred.topItem&&<div style={{...s.chip,color:"#f59e0b",background:"#1a1400"}}>📦 {pred.topItem}</div>}
              {pred.topAbility&&<div style={{...s.chip,color:"#60a5fa",background:"#0d1a2e"}}>⚡ {pred.topAbility}</div>}
            </div>
          </div>);
        })}
      </div>
    </div>

    <div style={s.card}>
      <div style={s.cardTitle}>YOUR RECOMMENDED BRING</div>
      <div style={s.cardSub}>Lead 1 & 2 first — back 3 & 4 below</div>
      <div style={s.recGrid}>
        {analysis.yourPick.map((pick,i)=>(
          <div key={i} style={{...s.recCard,...(i<2?s.recLead:{})}}>
            <div style={i<2?s.leadTag:s.backTag}>{i<2?`LEAD ${i+1}`:`BACK ${i-1}`}</div>
            <div style={s.recName}>{pick.name}</div>
            <div style={{fontSize:10,color:"#60a5fa",marginBottom:2}}>{pick.ability}</div>
            <div style={{fontSize:10,color:"#f59e0b",marginBottom:8}}>{pick.item}</div>
            <div style={{...s.recReason,...(pick.hasWarning?{color:"#e85d2f"}:{})}}>{pick.reason}</div>
          </div>
        ))}
      </div>
    </div>

    {analysis.keyThreats.length>0&&(
      <div style={s.card}>
        <div style={s.cardTitle}>⚠ KEY THREATS</div>
        {analysis.keyThreats.map((t,i)=>(
          <div key={i} style={s.threatRow}>
            <div style={{fontSize:10,color:"#e85d2f",fontWeight:700,marginBottom:4,letterSpacing:1}}>{t.name}</div>
            <div style={{fontSize:10,color:"#5a6070",lineHeight:1.6}}>{t.threat}</div>
          </div>
        ))}
      </div>
    )}

    {analysis.adjustments.length>0&&(
      <div style={s.card}>
        <div style={s.cardTitle}>ADJUSTMENT GUIDE</div>
        <div style={s.cardSub}>Surprise picks and archetype notes only</div>
        {analysis.adjustments.map((adj,i)=>(
          <div key={i} style={s.adjRow}>
            <div style={{fontSize:10,color:"#5a6070",marginBottom:5}}>IF <strong style={{color:"#e85d2f"}}>{adj.if}</strong></div>
            <div style={{fontSize:10,color:"#e2e2e2",lineHeight:1.6}}>→ {adj.then}</div>
          </div>
        ))}
      </div>
    )}

    <div style={s.card}>
      <div style={s.cardTitle}>LOG THIS MATCH</div>
      <div style={s.cardSub}>Fill in after the match — all fields optional</div>
      <div style={s.logFormGrid}>
        <div><div style={s.fl}>YOUR ACTUAL BRING</div><input style={s.input} value={logEntry.myBring} onChange={e=>setLogEntry(p=>({...p,myBring:e.target.value}))} placeholder="Your 4 (comma separated)"/></div>
        <div><div style={s.fl}>YOUR ACTUAL LEAD</div><input style={s.input} value={logEntry.myLead} onChange={e=>setLogEntry(p=>({...p,myLead:e.target.value}))} placeholder="Your lead two"/></div>
        <div><div style={s.fl}>THEIR ACTUAL BRING</div><input style={s.input} value={logEntry.theirBring} onChange={e=>setLogEntry(p=>({...p,theirBring:e.target.value}))} placeholder="Their 4 (comma separated)"/></div>
        <div><div style={s.fl}>THEIR ACTUAL LEAD</div><input style={s.input} value={logEntry.theirLead} onChange={e=>setLogEntry(p=>({...p,theirLead:e.target.value}))} placeholder="Their lead two"/></div>
      </div>
      <div style={s.fl}>RESULT</div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {["W","L"].map(r=>(
          <button key={r} style={{...s.resultBtn,...(logEntry.result===r?(r==="W"?s.resultW:s.resultL):{})}} onClick={()=>setLogEntry(p=>({...p,result:p.result===r?"":r}))}>
            {r==="W"?"WIN":"LOSS"}
          </button>
        ))}
      </div>
      <div style={s.fl}>NOTES (optional)</div>
      <input style={{...s.input,marginBottom:12}} value={logEntry.notes} onChange={e=>setLogEntry(p=>({...p,notes:e.target.value}))} placeholder="What happened, what to improve..."/>
      <button style={s.btnPrimary} onClick={logMatch}>SAVE TO LOG</button>
    </div>
  </>)}
</div>
```

);
}

// ============================================================
// SPEED TAB
// ============================================================
function SpeedTab({myTeam}){
const[myMon,setMyMon]=useState(””);
const[oppSearch,setOppSearch]=useState(””);
const[oppMon,setOppMon]=useState(null);
const[searchResults,setSearchResults]=useState([]);

const myMonKey=normalize(myMon);
const myBase=SPEED_DB[myMonKey]||null;

useEffect(()=>{
if(oppSearch.trim().length<2){setSearchResults([]);return;}
const q=normalize(oppSearch);
const results=Object.keys(SPEED_DB).filter(k=>k.includes(q)).sort((a,b)=>{if(a===q)return -1;if(b===q)return 1;return a.localeCompare(b);}).slice(0,8);
setSearchResults(results);
},[oppSearch]);

const selectOpp=key=>{setOppMon({key,base:SPEED_DB[key]});setOppSearch(key.replace(/-/g,” “));setSearchResults([]);};

const speedRows=base=>[
{label:“Base Speed (Neutral)”,val:calcSpeed(base,“neutral”)},
{label:“Positive Nature (+10%)”,val:calcSpeed(base,“positive”)},
{label:“Negative Nature (-10%)”,val:calcSpeed(base,“negative”)},
{label:”+ Choice Scarf (×1.5)”,val:Math.floor(calcSpeed(base,“neutral”)*1.5)},
{label:”+ Scarf + Positive Nature”,val:Math.floor(calcSpeed(base,“positive”)*1.5)},
{label:”+ Tailwind (×2)”,val:calcSpeed(base,“neutral”)*2},
{label:”+ Tailwind + Positive Nature”,val:calcSpeed(base,“positive”)*2},
{label:“Chlorophyll / Swift Swim / Sand Rush (×2)”,val:calcSpeed(base,“neutral”)*2},
];

return(
<div>
<div style={s.card}>
<div style={s.cardTitle}>SPEED COMPARISON</div>
<div style={s.cardSub}>Compare your Pokémon vs an opponent across common modifiers</div>
<div style={s.fl}>YOUR POKÉMON</div>
<div style={s.speedSelectGrid}>
{myTeam.filter(m=>m.name.trim()).map((m,i)=>{
const key=normalize(m.name);
const base=SPEED_DB[key];
return(<button key={i} style={{…s.monSelectBtn,…(myMon===m.name?s.monSelectActive:{})}} onClick={()=>setMyMon(myMon===m.name?””:m.name)}>
<div style={{fontWeight:700,fontSize:12}}>{m.name}</div>
{base?<div style={{fontSize:9,color:”#5a6070”,marginTop:2}}>Base {base}</div>:<div style={{fontSize:9,color:”#e85d2f”,marginTop:2}}>No data</div>}
</button>);
})}
</div>
<div style={{marginTop:16}}>
<div style={s.fl}>OPPONENT POKÉMON</div>
<div style={{position:“relative”}}>
<input style={s.input} value={oppSearch} onChange={e=>{setOppSearch(e.target.value);setOppMon(null);}} placeholder=“Search any Pokémon…”/>
{searchResults.length>0&&(
<div style={s.dropdown}>
{searchResults.map(key=>(
<button key={key} style={s.dropItem} onClick={()=>selectOpp(key)}>
<span style={{textTransform:“capitalize”}}>{key.replace(/-/g,” “)}</span>
<span style={{color:”#5a6070”,fontSize:10}}>Base {SPEED_DB[key]}</span>
</button>
))}
</div>
)}
</div>
</div>
</div>

```
  {myBase&&oppMon&&(
    <div style={s.card}>
      <div style={s.cardTitle}>SPEED BREAKDOWN</div>
      <div style={s.speedCompareHeader}>
        <div style={s.speedMonLabel}>{myMon} <span style={{color:"#5a6070",fontWeight:400,fontSize:10}}>(Base {myBase})</span></div>
        <div style={s.speedVs}>VS</div>
        <div style={{...s.speedMonLabel,textAlign:"right",textTransform:"capitalize"}}>{oppMon.key.replace(/-/g," ")} <span style={{color:"#5a6070",fontWeight:400,fontSize:10}}>(Base {oppMon.base})</span></div>
      </div>
      {speedRows(myBase).map((row,i)=>{
        const oppVal=speedRows(oppMon.base)[i].val;
        const myVal=row.val;
        const myWins=myVal>oppVal;
        const tie=myVal===oppVal;
        return(<div key={i} style={s.speedRow}>
          <div style={{...s.speedVal,...(myWins?{color:"#4caf50"}:tie?{color:"#5a6070"}:{color:"#e85d2f"})}}>{myVal}</div>
          <div style={s.speedLabel}>{row.label}</div>
          <div style={{...s.speedVal,...(!myWins&&!tie?{color:"#4caf50"}:tie?{color:"#5a6070"}:{color:"#e85d2f"}),textAlign:"right"}}>{oppVal}</div>
        </div>);
      })}
      <div style={s.speedLegend}>
        <span style={{color:"#4caf50"}}>■ Faster</span>
        <span style={{color:"#5a6070"}}>■ Tie</span>
        <span style={{color:"#e85d2f"}}>■ Slower</span>
      </div>
    </div>
  )}

  {myBase&&!oppMon&&(
    <div style={s.card}>
      <div style={s.cardTitle}>{myMon.toUpperCase()} — SPEED STATS</div>
      <div style={s.cardSub}>Base {myBase} · Search an opponent above to compare</div>
      {speedRows(myBase).map((row,i)=>(
        <div key={i} style={{...s.speedRow,justifyContent:"space-between"}}>
          <div style={s.speedLabel}>{row.label}</div>
          <div style={{...s.speedVal,color:"#e2e2e2",textAlign:"right"}}>{row.val}</div>
        </div>
      ))}
    </div>
  )}

  {!myBase&&myMon&&(
    <div style={{...s.card,background:"#130a08",border:"1px solid #2a1510"}}>
      <div style={{fontSize:11,color:"#e85d2f"}}>No speed data found for "{myMon}" — check spelling or this Pokémon may not be in the database yet.</div>
    </div>
  )}
</div>
```

);
}

// ============================================================
// LOG TAB
// ============================================================
function LogTab({matchLog,clearLog,wins,losses}){
if(!matchLog.length)return(
<div style={{textAlign:“center”,padding:“60px 20px”}}>
<div style={{fontSize:36,marginBottom:14}}>📋</div>
<div style={{fontSize:13,color:”#5a6070”,letterSpacing:2,marginBottom:8}}>No matches logged</div>
<div style={{fontSize:10,color:”#2a2a2a”,maxWidth:280,margin:“0 auto”,lineHeight:1.7}}>Complete an analysis then log results to track performance over time</div>
</div>
);
return(
<div>
<div style={s.secHeader}>
<div>
<div style={s.secTitle}>MATCH LOG</div>
<div style={s.secSub}>{matchLog.length} matches · <span style={{color:”#4caf50”}}>W{wins}</span> / <span style={{color:”#e85d2f”}}>L{losses}</span> · {matchLog.length>0?Math.round(wins/matchLog.length*100):0}% win rate</div>
</div>
<button style={{…s.btnGhost,color:”#e85d2f”,borderColor:”#e85d2f44”}} onClick={clearLog}>CLEAR ALL</button>
</div>
{matchLog.map((entry,i)=>(
<div key={i} style={{…s.logCard,…(entry.result===“W”?{borderColor:”#4caf5033”}:entry.result===“L”?{borderColor:”#e85d2f33”}:{})}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:12}}>
<div style={{fontSize:9,color:”#444”,letterSpacing:2,fontWeight:700}}>{entry.date}</div>
{entry.result&&<div style={{fontSize:10,fontWeight:900,letterSpacing:2,color:entry.result===“W”?”#4caf50”:”#e85d2f”,background:entry.result===“W”?”#0a1a0a”:”#1a0a0a”,border:`1px solid ${entry.result==="W"?"#4caf5033":"#e85d2f33"}`,borderRadius:3,padding:“2px 8px”}}>{entry.result===“W”?“WIN”:“LOSS”}</div>}
</div>
{entry.archetype&&entry.archetype!==“standard”&&<div style={{fontSize:9,color:”#4caf50”,letterSpacing:1.5,marginBottom:8,background:”#0a1a0a”,display:“inline-block”,padding:“2px 6px”,borderRadius:3}}>{entry.archetype.toUpperCase()}</div>}
<LR label=“OPPONENT SEEN” value={(entry.opponentSeen||[]).join(”, “)}/>
<div style={{display:“flex”,gap:12,flexWrap:“wrap”}}>
<LR label=“PREDICTED BRING” value={(entry.opponentPredicted||[]).join(”, “)} flex/>
<LR label=“THEIR ACTUAL BRING” value={entry.theirActualBring||”—”} flex bright={!!entry.theirActualBring}/>
</div>
<div style={{display:“flex”,gap:12,flexWrap:“wrap”}}>
<LR label=“PREDICTED LEAD” value={(entry.opponentPredictedLead||[]).join(”, “)} flex/>
<LR label=“THEIR ACTUAL LEAD” value={entry.theirActualLead||”—”} flex bright={!!entry.theirActualLead}/>
</div>
<div style={{display:“flex”,gap:12,flexWrap:“wrap”}}>
<LR label=“YOUR RECOMMENDED” value={(entry.yourRecommended||[]).join(”, “)} flex/>
<LR label=“YOUR ACTUAL BRING” value={entry.myActualBring||”—”} flex bright={!!entry.myActualBring}/>
</div>
{entry.myActualLead&&<LR label="YOUR ACTUAL LEAD" value={entry.myActualLead}/>}
{entry.notes&&<LR label="NOTES" value={entry.notes} bright/>}
</div>
))}
</div>
);
}

function LR({label,value,flex,bright}){
return(<div style={{flex:flex?“1”:undefined,minWidth:flex?120:undefined,marginBottom:8}}>
<div style={{fontSize:8,color:”#444”,letterSpacing:2,fontWeight:700,marginBottom:3}}>{label}</div>
<div style={{fontSize:10,color:bright?”#e2e2e2”:”#444”,lineHeight:1.5}}>{value||”—”}</div>

  </div>);
}

// ============================================================
// STYLES
// ============================================================
const s={
root:{minHeight:“100vh”,background:”#09090b”,color:”#e2e2e2”,fontFamily:”‘Courier New’,monospace”},
header:{display:“flex”,alignItems:“center”,justifyContent:“space-between”,padding:“16px 16px 0”,flexWrap:“wrap”,gap:10},
headerLeft:{display:“flex”,alignItems:“center”,gap:12},
title:{fontSize:22,fontWeight:900,letterSpacing:5,color:”#e85d2f”,lineHeight:1},
subtitle:{fontSize:9,color:”#5a6070”,letterSpacing:2,marginTop:3},
badge:{display:“flex”,alignItems:“center”,fontSize:9,letterSpacing:2,fontWeight:700,border:“1px solid”,borderRadius:4,padding:“4px 10px”},
wlBadge:{fontSize:11,fontWeight:900,letterSpacing:2,background:”#0f1014”,border:“1px solid #1c1f2a”,borderRadius:4,padding:“4px 12px”,display:“flex”,gap:4},
tabBar:{display:“flex”,borderBottom:“1px solid #1c1f2a”,margin:“16px 0 0”,overflowX:“auto”},
tabBtn:{background:“none”,border:“none”,borderBottom:“2px solid transparent”,color:”#5a6070”,padding:“10px 14px”,cursor:“pointer”,fontSize:10,letterSpacing:2,fontFamily:”‘Courier New’,monospace”,fontWeight:700,whiteSpace:“nowrap”,flexShrink:0},
tabActive:{color:”#e85d2f”,borderBottomColor:”#e85d2f”},
content:{padding:“16px”,maxWidth:860,margin:“0 auto”},
card:{background:”#0f1014”,border:“1px solid #1c1f2a”,borderRadius:8,padding:16,marginBottom:14},
cardHeader:{display:“flex”,alignItems:“center”,justifyContent:“space-between”,marginBottom:4},
cardTitle:{fontSize:11,letterSpacing:3,color:”#e85d2f”,fontWeight:700,marginBottom:4},
cardSub:{fontSize:10,color:”#5a6070”,marginBottom:14},
secHeader:{display:“flex”,alignItems:“flex-start”,justifyContent:“space-between”,marginBottom:14,gap:10},
secTitle:{fontSize:11,letterSpacing:3,color:”#e85d2f”,fontWeight:700},
secSub:{fontSize:9,color:”#5a6070”,letterSpacing:1,marginTop:3},
teamGrid:{display:“grid”,gridTemplateColumns:“repeat(auto-fill,minmax(240px,1fr))”,gap:12},
monCard:{background:”#0f1014”,border:“1px solid #1c1f2a”,borderRadius:8,padding:14},
monTop:{display:“flex”,alignItems:“center”,gap:10,marginBottom:12},
slot:{width:22,height:22,background:”#2a1510”,border:“1px solid #e85d2f44”,borderRadius:4,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:9,color:”#e85d2f”,fontWeight:700,flexShrink:0},
monName:{fontSize:13,fontWeight:700,letterSpacing:1},
nameInput:{flex:1,background:”#06070a”,border:“1px solid #1c1f2a”,borderRadius:4,color:”#e2e2e2”,padding:“5px 8px”,fontSize:12,fontFamily:”‘Courier New’,monospace”,outline:“none”,width:“100%”,boxSizing:“border-box”},
input:{display:“block”,width:“100%”,background:”#06070a”,border:“1px solid #1c1f2a”,borderRadius:4,color:”#e2e2e2”,padding:“7px 10px”,fontSize:11,fontFamily:”‘Courier New’,monospace”,outline:“none”,boxSizing:“border-box”},
fl:{fontSize:9,color:”#5a6070”,letterSpacing:2,fontWeight:700,marginBottom:4,marginTop:8},
detRow:{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”,marginBottom:5,gap:8},
dl:{fontSize:9,color:”#5a6070”,letterSpacing:1.5,fontWeight:700,flexShrink:0},
dv:{fontSize:10,color:”#e2e2e2”,textAlign:“right”},
moveWrap:{display:“flex”,flexWrap:“wrap”,gap:4,marginTop:10},
moveChip:{background:”#14161e”,border:“1px solid #1c1f2a”,borderRadius:3,padding:“2px 8px”,fontSize:9,color:”#5a6070”},
inputGrid:{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:8,marginBottom:14},
inputRow:{display:“flex”,alignItems:“center”,gap:8},
inputNum:{width:18,height:18,background:”#14161e”,borderRadius:3,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:9,color:”#5a6070”,fontWeight:700,flexShrink:0},
pokeinput:{flex:1,background:”#06070a”,border:“1px solid #1c1f2a”,borderRadius:4,color:”#e2e2e2”,padding:“8px 10px”,fontSize:11,fontFamily:”‘Courier New’,monospace”,outline:“none”,width:“100%”,boxSizing:“border-box”},
analyzeRow:{display:“flex”,alignItems:“center”,justifyContent:“space-between”,flexWrap:“wrap”,gap:8},
filledLabel:{fontSize:9,color:”#5a6070”,letterSpacing:1},
btnPrimary:{background:”#e85d2f”,color:”#fff”,border:“none”,borderRadius:4,padding:“9px 18px”,fontSize:10,letterSpacing:2,fontFamily:”‘Courier New’,monospace”,fontWeight:700,cursor:“pointer”},
btnGhost:{background:“none”,color:”#5a6070”,border:“1px solid #1c1f2a”,borderRadius:4,padding:“7px 14px”,fontSize:10,letterSpacing:2,fontFamily:”‘Courier New’,monospace”,fontWeight:700,cursor:“pointer”},
btnDis:{opacity:0.4,cursor:“not-allowed”},
predGrid:{display:“grid”,gridTemplateColumns:“repeat(auto-fill,minmax(150px,1fr))”,gap:10},
predCard:{background:”#06070a”,border:“1px solid #1c1f2a”,borderRadius:6,padding:12},
predLead:{background:”#0a1a0a”,border:“1px solid #4caf5044”},
leadTag:{fontSize:8,color:”#4caf50”,letterSpacing:1.5,fontWeight:700,background:”#061506”,border:“1px solid #4caf5033”,borderRadius:3,padding:“2px 6px”,display:“inline-block”,marginBottom:6},
backTag:{fontSize:8,color:”#5a6070”,letterSpacing:1.5,fontWeight:700,marginBottom:6,display:“block”},
predRank:{fontSize:9,color:”#5a6070”,marginBottom:4},
predName:{fontSize:13,fontWeight:700,marginBottom:8},
chipRow:{display:“flex”,flexWrap:“wrap”,gap:3},
chip:{fontSize:8,color:”#5a6070”,background:”#14161e”,borderRadius:3,padding:“2px 6px”},
recGrid:{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10},
recCard:{background:”#06070a”,border:“1px solid #1c1f2a”,borderRadius:6,padding:14},
recLead:{background:”#0a1a0a”,border:“1px solid #4caf5044”},
recName:{fontSize:15,fontWeight:900,letterSpacing:1,marginBottom:3,marginTop:6},
recReason:{fontSize:10,color:”#5a6070”,lineHeight:1.6,borderTop:“1px solid #1c1f2a”,paddingTop:8,marginTop:8},
threatRow:{background:”#130a08”,border:“1px solid #2a1510”,borderRadius:6,padding:12,marginBottom:8},
adjRow:{background:”#14161e”,border:“1px solid #1c1f2a”,borderRadius:6,padding:12,marginBottom:8},
logFormGrid:{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:12,marginBottom:4},
resultBtn:{flex:1,padding:“10px”,fontSize:11,letterSpacing:2,fontFamily:”‘Courier New’,monospace”,fontWeight:700,cursor:“pointer”,borderRadius:4,border:“1px solid #1c1f2a”,background:“none”,color:”#5a6070”},
resultW:{background:”#0a1a0a”,color:”#4caf50”,borderColor:”#4caf5044”},
resultL:{background:”#1a0a0a”,color:”#e85d2f”,borderColor:”#e85d2f44”},
logCard:{background:”#0f1014”,border:“1px solid #1c1f2a”,borderRadius:8,padding:14,marginBottom:10},
speedSelectGrid:{display:“grid”,gridTemplateColumns:“repeat(auto-fill,minmax(130px,1fr))”,gap:8,marginBottom:8},
monSelectBtn:{background:”#06070a”,border:“1px solid #1c1f2a”,borderRadius:6,padding:“10px 12px”,cursor:“pointer”,textAlign:“left”,color:”#e2e2e2”,fontFamily:”‘Courier New’,monospace”},
monSelectActive:{background:”#2a1510”,borderColor:”#e85d2f”,color:”#e85d2f”},
dropdown:{position:“absolute”,top:“100%”,left:0,right:0,background:”#0f1014”,border:“1px solid #1c1f2a”,borderRadius:6,zIndex:10,maxHeight:200,overflowY:“auto”},
dropItem:{display:“flex”,justifyContent:“space-between”,alignItems:“center”,width:“100%”,padding:“8px 12px”,background:“none”,border:“none”,borderBottom:“1px solid #1c1f2a”,color:”#e2e2e2”,fontFamily:”‘Courier New’,monospace”,cursor:“pointer”,fontSize:11},
speedCompareHeader:{display:“flex”,alignItems:“center”,justifyContent:“space-between”,marginBottom:16,padding:“12px”,background:”#06070a”,borderRadius:6},
speedMonLabel:{fontSize:12,fontWeight:700,flex:1},
speedVs:{fontSize:10,color:”#5a6070”,letterSpacing:2,fontWeight:700,padding:“0 12px”},
speedRow:{display:“flex”,alignItems:“center”,gap:8,padding:“8px 0”,borderBottom:“1px solid #14161e”},
speedLabel:{flex:1,fontSize:10,color:”#5a6070”,textAlign:“center”},
speedVal:{width:44,fontSize:14,fontWeight:900},
speedLegend:{display:“flex”,gap:16,justifyContent:“center”,marginTop:12,fontSize:9,letterSpacing:1},
};
