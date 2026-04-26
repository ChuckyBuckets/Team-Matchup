import { useState, useEffect, useCallback } from "react";

const SPEED_DB = {
  "mega-alakazam":150,"mega-aerodactyl":150,"mega-beedrill":145,dragapult:142,
  "mega-manectric":135,"mega-lopunny":135,"mega-delphox":134,"mega-gengar":130,
  jolteon:130,aerodactyl:130,"floette-eternal":128,talonflame:126,weavile:125,
  meowscarada:123,greninja:122,alakazam:120,"mega-starmie":120,"mega-froslass":120,
  sneasler:120,hawlucha:118,salazzle:117,whimsicott:116,starmie:115,serperior:113,
  maushold:111,raichu:110,gengar:110,espeon:110,froslass:110,"hisuian-zoroark":110,
  "alolan-ninetales":109,infernape:108,liepard:106,lopunny:105,zoroark:105,
  espathra:105,delphox:104,"meowstic-f":104,garchomp:102,"mega-floette":102,
  charizard:100,"mega-charizard-x":100,"mega-charizard-y":100,ninetales:100,
  "mega-kangaskhan":100,volcarona:100,palafin:100,typhlosion:100,hydreigon:98,
  mimikyu:96,arcanine:95,houndoom:95,sharpedo:95,leafeon:95,gliscor:95,
  tinkaton:94,"mega-garchomp":92,krookodile:92,"wash-rotom":86,"heat-rotom":86,
  "frost-rotom":86,glimmora:86,excadrill:88,gyarados:81,"mega-gyarados":81,
  milotic:81,venusaur:80,"mega-venusaur":80,meganium:80,"mega-meganium":80,
  gardevoir:80,medicham:80,mamoswine:80,gallade:80,chandelure:80,dragonite:80,
  blastoise:78,"mega-blastoise":78,feraligatr:78,"basculegion-m":78,
  "basculegion-f":78,scizor:65,"mega-scizor":75,"kommo-o":85,ceruledge:85,
  archaludon:85,sylveon:60,clefable:60,aegislash:60,incineroar:60,primarina:60,
  farigiraf:60,sinistcha:70,hatterene:29,corviknight:67,skeledirge:66,pelipper:65,
  orthworm:65,chesnaught:64,tyranitar:61,empoleon:60,abomasnow:60,kingambit:50,
  sableye:50,aggron:50,"mega-aggron":50,hippowdon:47,conkeldurr:45,crabominable:43,
  camerupt:40,rhyperior:40,drampa:36,spiritomb:35,toxapex:35,mudsdale:35,
  garganacl:35,slowbro:30,snorlax:30,slowking:30,steelix:30,cofagrigus:30,
  reuniclus:30,aromatisse:29,avalugg:28,"mega-sableye":20,"mega-camerupt":20,
  torkoal:20,politoed:70,"mega-tyranitar":71,tyrantrum:71,kangaskhan:90,lucario:90,
  vivillon:89,tauros:110,vaporeon:65,flareon:65,umbreon:65,banette:65,glaceon:65,
  victreebel:70,skarmory:70,luxray:70,samurott:70,decidueye:70,polteageist:70,
  flapple:70,castform:70,heracross:85,toxicroak:85,kleavor:85,quaquaval:85,
  "mega-heracross":75,"mega-banette":75,absol:75,garbodor:75,florges:75,
  klefki:75,armarouge:75,scovillain:75,slurpuff:72,tsareena:72,sandaconda:71,
  rampardos:58,pangoro:58,aurorus:58,torterra:56,trevenant:56,machamp:55,
  ampharos:55,golurk:55,azumarill:50,audino:50,beartic:50,ditto:48,
  bellibolt:45,hydrapple:44,"galarian-stunfisk":32,appletun:30,
  "hisuian-arcanine":90,"alolan-raichu":110,
};

const calcSpeed = (base, nature) => {
  const raw = Math.floor((2 * base + 31) * 50 / 100 + 5);
  if (nature === "positive") return Math.floor(raw * 1.1);
  if (nature === "negative") return Math.floor(raw * 0.9);
  return raw;
};

const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const POKEMON_TYPES = {
  incineroar: ["fire","dark"], sneasler: ["fighting","poison"], garchomp: ["dragon","ground"],
  sinistcha: ["grass","ghost"], kingambit: ["dark","steel"], basculegion: ["water","ghost"],
  "floette-eternal": ["fairy"], charizard: ["fire","flying"], "rotom-wash": ["electric","water"],
  whimsicott: ["grass","fairy"], aerodactyl: ["rock","flying"], pelipper: ["water","flying"],
  tyranitar: ["rock","dark"], archaludon: ["steel","dragon"], dragonite: ["dragon","flying"],
  farigiraf: ["normal","psychic"], venusaur: ["grass","poison"], gengar: ["ghost","poison"],
  froslass: ["ice","ghost"], milotic: ["water"], maushold: ["normal"],
  corviknight: ["steel","flying"], excadrill: ["steel","ground"], delphox: ["fire","psychic"],
  gardevoir: ["psychic","fairy"], aegislash: ["steel","ghost"], talonflame: ["fire","flying"],
  "kommo-o": ["dragon","fighting"], meganium: ["grass"], primarina: ["water","fairy"],
  torkoal: ["fire"], palafin: ["water"], politoed: ["water"], glimmora: ["rock","poison"],
  "ninetales-alola": ["ice","fairy"], clefable: ["fairy"], scizor: ["bug","steel"],
  hatterene: ["psychic","fairy"], weavile: ["dark","ice"], dragapult: ["dragon","ghost"],
  hydreigon: ["dark","dragon"], sylveon: ["fairy"], mimikyu: ["ghost","fairy"],
  mamoswine: ["ice","ground"], gyarados: ["water","flying"], hawlucha: ["fighting","flying"],
  greninja: ["water","dark"], "hisuian-zoroark": ["normal","ghost"],
  medicham: ["fighting","psychic"], kangaskhan: ["normal"], lopunny: ["normal"],
  gallade: ["psychic","fighting"], blastoise: ["water"], feraligatr: ["water"],
  chesnaught: ["grass","fighting"], victreebel: ["grass","poison"], volcarona: ["bug","fire"],
  skeledirge: ["fire","ghost"], scovillain: ["grass","fire"], meowscarada: ["grass","dark"],
  "meowstic-f": ["psychic"], crabominable: ["fighting","ice"], aggron: ["steel","rock"],
  orthworm: ["steel"], krookodile: ["ground","dark"], "wash-rotom": ["electric","water"],
  "heat-rotom": ["fire","electric"], "frost-rotom": ["electric","ice"],
};

const MOVE_NAMES = {
  252:"Fake Out", 575:"Parting Shot", 394:"Flare Blitz", 675:"Throat Chop",
  663:"Darkest Lariat", 182:"Protect", 261:"Will-O-Wisp", 270:"Taunt",
  269:"Helping Hand", 555:"Snarl", 370:"Close Combat", 827:"Dire Claw",
  157:"Rock Slide", 337:"Dragon Claw", 89:"Earthquake", 707:"Stomping Tantrum",
  14:"Swords Dance", 444:"Poison Jab", 398:"Iron Head", 902:"Matcha Gotcha",
  476:"Rage Powder", 433:"Trick Room", 791:"Life Dew", 668:"Imprison",
  247:"Shadow Ball", 286:"Calm Mind", 347:"Dazzling Gleam", 503:"Scald",
  196:"Icy Wind", 58:"Ice Beam", 105:"Recover", 266:"Follow Me", 162:"Super Fang",
  413:"Brave Bird", 366:"Tailwind", 814:"Dual Wingbeat", 469:"Roost",
  542:"Hurricane", 311:"Weather Ball", 85:"Thunderbolt", 521:"Volt Switch",
  527:"Hydro Pump", 905:"Electro Shot", 430:"Flash Cannon", 434:"Draco Meteor",
  406:"Aura Sphere", 834:"Wave Crash", 605:"Moonblast", 94:"Psychic",
  257:"Heat Wave", 76:"Solar Beam", 315:"Hyper Voice", 349:"Fire Blast",
  188:"Sleep Powder", 79:"Sludge Bomb", 414:"Energy Ball", 284:"Eruption",
  389:"Sucker Punch", 869:"Kowtow Cleave", 59:"Blizzard", 282:"Crunch",
  242:"Extreme Speed", 418:"Bullet Punch", 450:"Bug Bite", 492:"Stored Power",
};

const ITEM_NAMES = {
  135:"Sitrus Berry", 166:"Chople Berry", 168:"Shuca Berry", 211:"Leftovers",
  134:"Lum Berry", 162:"Mental Herb", 191:"White Herb", 252:"Focus Sash",
  264:"Choice Scarf", 214:"Yache Berry", 174:"Haban Berry", 165:"Roseli Berry",
  190:"Choice Band", 220:"Choice Specs", 219:"Life Orb", 194:"Assault Vest",
  226:"Charcoal", 224:"Air Balloon", 175:"Occa Berry", 173:"Colbur Berry",
  2579:"Floettite", 717:"Charizardite Y", 699:"Charizardite X", 708:"Tyranitarite",
  2566:"Froslassite", 163:"Power Herb", 2563:"Meganiumite", 695:"Gengarite",
  696:"Gardevoirite", 289:"Loaded Dice", 217:"Black Glasses",
};

const ABILITY_NAMES = {
  22:"Intimidate", 66:"Blaze", 24:"Rough Skin", 45:"Sand Stream", 299:"Hospitality",
  128:"Defiant", 293:"Supreme Overlord", 2:"Drizzle", 127:"Unnerve", 26:"Levitate",
  158:"Prankster", 34:"Chlorophyll", 65:"Overgrow", 130:"Cursed Body", 23:"Shadow Tag",
  81:"Snow Cloak", 117:"Snow Warning", 172:"Competitive", 63:"Marvel Scale",
  132:"Friend Guard", 101:"Technician", 91:"Adaptability", 33:"Swift Swim",
  104:"Motor Drive", 140:"Telepathy", 36:"Trace", 182:"Pixilate", 176:"Stance Change",
  177:"Gale Wings", 43:"Bulletproof", 192:"Stamina", 5:"Sturdy", 242:"Cloud Nine",
  70:"Drought", 73:"Shell Armor", 102:"Thick Fat", 204:"Liquid Voice",
  109:"Magic Guard", 98:"Magic Bounce", 136:"Multiscale", 296:"Armor Tail",
  166:"Fairy Aura", 159:"Sand Force", 146:"Sand Rush", 84:"Unburden",
};

const resolveName = (id, map) => map[id] || null;
const normalize = (s) => s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const getTypeEff = (mt, dts) => {
  let m = 1;
  for (const dt of dts) m *= ((TYPE_CHART[mt] || {})[dt] !== undefined ? (TYPE_CHART[mt] || {})[dt] : 1);
  return m;
};

const ARCHETYPE_SETTERS = {
  rain: ["pelipper","politoed"],
  sun: ["charizard","torkoal"],
  sand: ["tyranitar","hippowdon"],
  snow: ["froslass","mega-froslass","abomasnow"],
  trickroom: ["sinistcha","farigiraf","hatterene","cofagrigus","reuniclus","oranguru"],
};

const LEAD_PAIRS = [
  { pair: ["pelipper","archaludon"], prob: 0.85, note: "Core Rain lead" },
  { pair: ["pelipper","incineroar"], prob: 0.70, note: "Rain + Fake Out support" },
  { pair: ["pelipper","basculegion-m"], prob: 0.65, note: "Rain + Swift Swim sweeper" },
  { pair: ["charizard","incineroar"], prob: 0.80, note: "Sun + Fake Out support" },
  { pair: ["charizard","venusaur"], prob: 0.75, note: "Sun + Chlorophyll core" },
  { pair: ["sinistcha","incineroar"], prob: 0.80, note: "Trick Room + Fake Out" },
  { pair: ["farigiraf","incineroar"], prob: 0.75, note: "Trick Room + Fake Out" },
  { pair: ["hatterene","incineroar"], prob: 0.70, note: "Trick Room + Fake Out" },
  { pair: ["tyranitar","excadrill"], prob: 0.80, note: "Sand Rush core" },
  { pair: ["tyranitar","incineroar"], prob: 0.65, note: "Sand + Intimidate" },
  { pair: ["incineroar","sneasler"], prob: 0.70, note: "Fake Out + offensive pressure" },
  { pair: ["incineroar","garchomp"], prob: 0.60, note: "Intimidate + Earthquake spread" },
  { pair: ["incineroar","archaludon"], prob: 0.65, note: "Intimidate + Electro Shot" },
  { pair: ["maushold","sinistcha"], prob: 0.70, note: "Follow Me + Trick Room" },
];

const ABILITY_CONFLICTS = [
  { userAbility: "intimidate", oppAbility: "defiant", penalty: 4, note: "Intimidate triggers Defiant +2 Atk" },
  { userAbility: "intimidate", oppAbility: "competitive", penalty: 4, note: "Intimidate triggers Competitive +2 SpA" },
  { userAbility: "intimidate", oppAbility: "contrary", penalty: 3, note: "Intimidate boosts Contrary users" },
  { userAbility: "drought", oppAbility: "cloud-nine", penalty: 3, note: "Cloud Nine nullifies Sun" },
  { userAbility: "drizzle", oppAbility: "cloud-nine", penalty: 3, note: "Cloud Nine nullifies Rain" },
];

const META_API = "https://eurekaffeine.github.io/pokemon-champions-scraper/battle_meta.json";

function detectArchetype(keys) {
  for (const [arch, setters] of Object.entries(ARCHETYPE_SETTERS)) {
    if (setters.some((s) => keys.includes(s))) return arch;
  }
  return "standard";
}

function predictLeads(keys, archetype) {
  let best = null;
  let bestProb = 0;
  for (const lp of LEAD_PAIRS) {
    if (lp.pair.every((p) => keys.includes(p)) && lp.prob > bestProb) {
      best = lp;
      bestProb = lp.prob;
    }
  }
  if (best) return best;
  if (archetype === "rain" && keys.includes("pelipper")) {
    return { pair: ["pelipper", keys.find((p) => p !== "pelipper") || keys[0]], prob: 0.6, note: "Rain setter + partner" };
  }
  if (archetype === "trickroom") {
    const setter = keys.find((p) => ARCHETYPE_SETTERS.trickroom.includes(p));
    if (setter) {
      const sup = keys.find((p) => p !== setter) || keys[0];
      return { pair: [setter, sup], prob: 0.6, note: "Trick Room setter + support" };
    }
  }
  return null;
}

function analyzeMatchup(opponentNames, myTeam, metaData) {
  const opp = opponentNames.map((name) => {
    const key = normalize(name);
    const meta = metaData && metaData.pokemon_usage ? metaData.pokemon_usage.find((p) => normalize(p.name) === key) : null;
    return {
      name, key,
      usageRate: meta ? meta.usage_rate : 0.03,
      topMoves: meta && meta.top_moves ? meta.top_moves.slice(0, 4).map((m) => resolveName(m.id, MOVE_NAMES)).filter(Boolean) : [],
      topItem: meta && meta.top_items && meta.top_items[0] ? resolveName(meta.top_items[0].id, ITEM_NAMES) : null,
      topAbility: meta && meta.top_abilities && meta.top_abilities[0] ? resolveName(meta.top_abilities[0].id, ABILITY_NAMES) : null,
      types: POKEMON_TYPES[key] || ["normal"],
    };
  });

  const oppKeys = opp.map((p) => p.key);
  const archetype = detectArchetype(oppKeys);
  const leadPred = predictLeads(oppKeys, archetype);

  const byUsage = opp.slice().sort((a, b) => {
    let sa = a.usageRate;
    let sb = b.usageRate;
    if (leadPred && leadPred.pair.includes(a.key)) sa += 0.3;
    if (leadPred && leadPred.pair.includes(b.key)) sb += 0.3;
    return sb - sa;
  });

  const predictedBring = byUsage.slice(0, 4);
  const predictedLeads = leadPred
    ? leadPred.pair.map((lk) => opp.find((p) => p.key === lk)).filter(Boolean)
    : byUsage.slice(0, 2);

  const myScored = myTeam.filter((m) => m.name.trim()).map((mon) => {
    const monKey = normalize(mon.name);
    const monTypes = POKEMON_TYPES[monKey] || ["normal"];
    const ab = (mon.ability || "").toLowerCase();
    const moves = (mon.moves || []).map((m) => m.toLowerCase());
    let score = 0;
    const reasons = [];
    const warnings = [];

    for (const o of predictedBring) {
      for (const mt of monTypes) {
        const e = getTypeEff(mt, o.types);
        if (e >= 2) { score += 2; reasons.push("SE vs " + o.name); }
        else if (e === 0) score -= 1;
      }
      for (const ot of o.types) {
        const e = getTypeEff(ot, monTypes);
        if (e >= 2) score -= 1.5;
        else if (e <= 0.5 && e > 0) score += 0.5;
        else if (e === 0) score += 1.5;
      }
      const oppAb = (o.topAbility || "").toLowerCase().replace(/\s/g, "-");
      for (const c of ABILITY_CONFLICTS) {
        if (ab.includes(c.userAbility) && oppAb.includes(c.oppAbility)) {
          score -= c.penalty;
          warnings.push("Warning: " + c.note + " -- avoid leading into " + o.name);
        }
      }
    }

    if (ab.includes("intimidate")) { score += 3; reasons.push("Intimidate both opponents"); }
    if (ab.includes("competitive") && predictedBring.some((p) => (p.topAbility || "").toLowerCase().includes("intimidate"))) {
      score += 2.5; reasons.push("Free +2 SpA vs Intimidate");
    }
    if (ab.includes("drought")) { score += 3; reasons.push("Sets Sun"); }
    if (ab.includes("chlorophyll")) { score += 2; reasons.push("Chlorophyll speed under Sun"); }
    if (ab.includes("telepathy") && myTeam.some((m) => (m.moves || []).some((mv) => mv.toLowerCase().includes("earthquake")))) {
      score += 1.5; reasons.push("Safe with Earthquake");
    }
    if (ab.includes("multiscale")) { score += 1; reasons.push("Multiscale survives first hit"); }
    if (ab.includes("magic bounce") && archetype === "trickroom") { score += 2; reasons.push("Magic Bounce blocks TR"); }
    if (moves.includes("fake out")) { score += 2.5; reasons.push("Fake Out turn 1"); }
    if (moves.includes("tailwind")) { score += 2; reasons.push("Tailwind speed control"); }
    if (moves.some((m) => m.includes("parting shot"))) { score += 2; reasons.push("Parting Shot pivot"); }
    if (moves.includes("follow me") || moves.includes("rage powder")) { score += 2; reasons.push("Redirection support"); }
    if (moves.includes("helping hand")) { score += 1; reasons.push("Helping Hand boost"); }

    const reason = warnings.length > 0 ? warnings[0] : (reasons.slice(0, 2).join(" / ") || "General coverage");
    return Object.assign({}, mon, { score: score, reason: reason, hasWarning: warnings.length > 0, key: monKey });
  });

  const yourPick = myScored.slice().sort((a, b) => b.score - a.score).slice(0, 4);

  const keyThreats = [];
  for (const o of predictedBring) {
    const threatened = myTeam.filter((m) => {
      const mt = POKEMON_TYPES[normalize(m.name)] || ["normal"];
      return o.types.some((ot) => getTypeEff(ot, mt) >= 2);
    });
    if (threatened.length >= 2) {
      keyThreats.push({ name: o.name, threat: "Threatens " + threatened.map((m) => m.name).join(" & ") + " -- don't lead both into " + o.name });
    }
    const oppAb = (o.topAbility || "").toLowerCase().replace(/\s/g, "-");
    for (const c of ABILITY_CONFLICTS) {
      const cm = yourPick.find((p) => (p.ability || "").toLowerCase().includes(c.userAbility));
      if (cm && oppAb.includes(c.oppAbility)) {
        keyThreats.push({ name: o.name, threat: c.note + " -- consider not leading " + cm.name + " into " + o.name });
      }
    }
  }

  const wildcards = byUsage.filter((p) => !predictedBring.find((pb) => pb.key === p.key));
  const adjustments = [];
  if (archetype !== "standard") {
    const archnotes = {
      trickroom: "Apply max damage before TR goes up -- target the setter support first",
      rain: "Watch for Swift Swim sweepers behind Pelipper",
      sun: "Watch for Chlorophyll speed threats once Sun is up",
      sand: "Excadrill doubles speed in Sand -- eliminate Tyranitar first",
      snow: "Blizzard becomes 100% accurate in Snow -- eliminate the setter fast",
    };
    adjustments.push({
      if: archetype.charAt(0).toUpperCase() + archetype.slice(1) + " team confirmed",
      then: archnotes[archetype] || "Adjust for weather conditions",
    });
  }
  for (const wc of wildcards.slice(0, 2)) {
    adjustments.push({
      if: wc.name + " in lead (surprise pick)",
      then: "Not predicted -- " + wc.types.join("/") + " typing may require swapping a back pick",
    });
  }

  return {
    opponentPrediction: byUsage,
    predictedBring: predictedBring,
    predictedLeads: predictedLeads,
    leadNote: leadPred ? leadPred.note : null,
    archetype: archetype,
    yourPick: yourPick,
    adjustments: adjustments,
    keyThreats: keyThreats.slice(0, 3),
  };
}

const storage = {
  get: function(k, fb) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch(e) { return fb; }
  },
  set: function(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
  },
};

function getDefaultTeam() {
  return [
    { name: "Charizard", ability: "Blaze / Drought (Mega)", item: "Charizardite Y", moves: ["Heat Wave","Weather Ball","Solar Beam","Protect"] },
    { name: "Venusaur", ability: "Chlorophyll", item: "Focus Sash", moves: ["Energy Ball","Sludge Bomb","Sleep Powder","Protect"] },
    { name: "Garchomp", ability: "Rough Skin", item: "Yache Berry", moves: ["Dragon Claw","Earthquake","Rock Slide","Protect"] },
    { name: "Incineroar", ability: "Intimidate", item: "Sitrus Berry", moves: ["Throat Chop","Helping Hand","Fake Out","Parting Shot"] },
    { name: "Gardevoir", ability: "Telepathy", item: "Choice Scarf", moves: ["Moonblast","Dazzling Gleam","Psychic","Icy Wind"] },
    { name: "Milotic", ability: "Competitive", item: "Leftovers", moves: ["Scald","Ice Beam","Life Dew","Protect"] },
  ];
}

export default function App() {
  const [tab, setTab] = useState("team");
  const [myTeam, setMyTeam] = useState(function() { return storage.get("ts_team_v4", getDefaultTeam()); });
  const [editingTeam, setEditingTeam] = useState(false);
  const [metaData, setMetaData] = useState(null);
  const [metaStatus, setMetaStatus] = useState("loading");
  const [opponent, setOpponent] = useState(["","","","","",""]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchLog, setMatchLog] = useState(function() { return storage.get("ts_log_v4", []); });
  const [logEntry, setLogEntry] = useState({ myBring:"", myLead:"", theirBring:"", theirLead:"", result:"", notes:"" });

  useEffect(function() {
    fetch(META_API)
      .then(function(r) { return r.json(); })
      .then(function(d) { setMetaData(d); setMetaStatus("live"); })
      .catch(function() { setMetaStatus("offline"); });
  }, []);

  function saveTeam(t) { setMyTeam(t); storage.set("ts_team_v4", t); }

  function addLog(entry) {
    const next = [entry].concat(matchLog).slice(0, 100);
    setMatchLog(next);
    storage.set("ts_log_v4", next);
  }

  function clearLog() { setMatchLog([]); storage.set("ts_log_v4", []); }

  const runAnalysis = useCallback(function() {
    const filled = opponent.filter(function(p) { return p.trim(); });
    if (filled.length < 4) return;
    setAnalyzing(true);
    setTimeout(function() {
      setAnalysis(analyzeMatchup(filled, myTeam, metaData));
      setAnalyzing(false);
    }, 500);
  }, [opponent, myTeam, metaData]);

  function logMatch() {
    if (!analysis) return;
    addLog({
      date: new Date().toLocaleDateString(),
      opponentSeen: opponent.filter(function(p) { return p.trim(); }),
      opponentPredicted: analysis.predictedBring.map(function(p) { return p.name; }),
      opponentPredictedLead: analysis.predictedLeads.map(function(p) { return p.name; }),
      yourRecommended: analysis.yourPick.map(function(p) { return p.name; }),
      archetype: analysis.archetype,
      myActualBring: logEntry.myBring,
      myActualLead: logEntry.myLead,
      theirActualBring: logEntry.theirBring,
      theirActualLead: logEntry.theirLead,
      result: logEntry.result,
      notes: logEntry.notes,
    });
    setLogEntry({ myBring:"", myLead:"", theirBring:"", theirLead:"", result:"", notes:"" });
  }

  const wins = matchLog.filter(function(e) { return e.result === "W"; }).length;
  const losses = matchLog.filter(function(e) { return e.result === "L"; }).length;

  const C = {
    bg: "#09090b", card: "#0f1014", border: "#1c1f2a", accent: "#e85d2f",
    green: "#4caf50", text: "#e2e2e2", muted: "#5a6070", faint: "#14161e",
    yellow: "#f59e0b", blue: "#60a5fa", gdim: "#0a1a0a",
  };

  const st = {
    root: { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"Courier New, monospace" },
    header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 0", flexWrap:"wrap", gap:10 },
    headerLeft: { display:"flex", alignItems:"center", gap:12 },
    title: { fontSize:22, fontWeight:900, letterSpacing:5, color:C.accent, lineHeight:1 },
    subtitle: { fontSize:9, color:C.muted, letterSpacing:2, marginTop:3 },
    tabBar: { display:"flex", borderBottom:"1px solid " + C.border, margin:"16px 0 0", overflowX:"auto" },
    tab: { background:"none", border:"none", borderBottom:"2px solid transparent", color:C.muted, padding:"10px 14px", cursor:"pointer", fontSize:10, letterSpacing:2, fontFamily:"Courier New, monospace", fontWeight:700, whiteSpace:"nowrap" },
    tabActive: { color:C.accent, borderBottom:"2px solid " + C.accent },
    content: { padding:16, maxWidth:860, margin:"0 auto" },
    card: { background:C.card, border:"1px solid " + C.border, borderRadius:8, padding:16, marginBottom:14 },
    cardTitle: { fontSize:11, letterSpacing:3, color:C.accent, fontWeight:700, marginBottom:4 },
    cardSub: { fontSize:10, color:C.muted, marginBottom:14 },
    label: { fontSize:9, color:C.muted, letterSpacing:2, fontWeight:700, marginBottom:4, marginTop:8, display:"block" },
    input: { display:"block", width:"100%", background:"#06070a", border:"1px solid " + C.border, borderRadius:4, color:C.text, padding:"7px 10px", fontSize:11, fontFamily:"Courier New, monospace", outline:"none", boxSizing:"border-box" },
    btnPrimary: { background:C.accent, color:"#fff", border:"none", borderRadius:4, padding:"9px 18px", fontSize:10, letterSpacing:2, fontFamily:"Courier New, monospace", fontWeight:700, cursor:"pointer" },
    btnGhost: { background:"none", color:C.muted, border:"1px solid " + C.border, borderRadius:4, padding:"7px 14px", fontSize:10, letterSpacing:2, fontFamily:"Courier New, monospace", fontWeight:700, cursor:"pointer" },
    btnDis: { opacity:0.4, cursor:"not-allowed" },
  };

  const tabs = [["team","MY TEAM"],["match","ANALYSIS"],["speed","SPEED"],["log", "LOG" + (matchLog.length > 0 ? " (" + matchLog.length + ")" : "")]];

  return (
    <div style={st.root}>
      <div style={st.header}>
        <div style={st.headerLeft}>
          <Pokeball />
          <div>
            <div style={st.title}>TEAM SCOUT</div>
            <div style={st.subtitle}>Pokemon Champions Season M-1</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          {matchLog.length > 0 && (
            <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, background:C.card, border:"1px solid " + C.border, borderRadius:4, padding:"4px 12px", display:"flex", gap:4 }}>
              <span style={{ color:C.green }}>{"W" + wins}</span>
              <span style={{ color:C.muted }}>/</span>
              <span style={{ color:C.accent }}>{"L" + losses}</span>
            </div>
          )}
          <StatusBadge status={metaStatus} updatedAt={metaData ? metaData.updated_at : null} C={C} />
        </div>
      </div>

      <div style={st.tabBar}>
        {tabs.map(function(t) {
          return (
            <button key={t[0]} style={Object.assign({}, st.tab, tab === t[0] ? st.tabActive : {})} onClick={function() { setTab(t[0]); }}>
              {t[1]}
            </button>
          );
        })}
      </div>

      <div style={st.content}>
        {tab === "team" && <TeamTab myTeam={myTeam} saveTeam={saveTeam} editing={editingTeam} setEditing={setEditingTeam} st={st} C={C} />}
        {tab === "match" && <MatchTab opponent={opponent} setOpponent={setOpponent} runAnalysis={runAnalysis} analyzing={analyzing} analysis={analysis} metaStatus={metaStatus} logEntry={logEntry} setLogEntry={setLogEntry} logMatch={logMatch} st={st} C={C} />}
        {tab === "speed" && <SpeedTab myTeam={myTeam} st={st} C={C} />}
        {tab === "log" && <LogTab matchLog={matchLog} clearLog={clearLog} wins={wins} losses={losses} st={st} C={C} />}
      </div>
    </div>
  );
}

function Pokeball() {
  return (
    <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #2a2a2a", overflow:"hidden", position:"relative", flexShrink:0 }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"50%", background:"#e85d2f" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:"#111" }} />
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:3, background:"#222", transform:"translateY(-50%)" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:"#1a1a1a", border:"2px solid #333", zIndex:2 }} />
    </div>
  );
}

function StatusBadge(props) {
  const status = props.status;
  const updatedAt = props.updatedAt;
  const C = props.C;
  const base = { display:"flex", alignItems:"center", fontSize:9, letterSpacing:2, fontWeight:700, border:"1px solid", borderRadius:4, padding:"4px 10px", gap:6 };
  if (status === "loading") return <div style={Object.assign({}, base, { color:"#666", borderColor:"#222" })}>CONNECTING...</div>;
  if (status === "live") return (
    <div style={Object.assign({}, base, { color:C.green, borderColor:"#1a3a1a", background:"#0a1a0a" })}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, flexShrink:0 }} />
      {"LIVE" + (updatedAt ? " " + new Date(updatedAt).toLocaleDateString() : "")}
    </div>
  );
  return <div style={Object.assign({}, base, { color:"#f59e0b", borderColor:"#3a2a00", background:"#1a1400" })}>OFFLINE</div>;
}

const POKEMON_KEYS = Object.keys(SPEED_DB).sort();
const titleCase = (k) => k.split("-").map(function(w) { return w ? w[0].toUpperCase() + w.slice(1) : w; }).join(" ");

function PokemonNameInput(props) {
  const value = props.value;
  const onChange = props.onChange;
  const onKeyDown = props.onKeyDown;
  const placeholder = props.placeholder;
  const style = props.style;
  const C = props.C;
  const [open, setOpen] = useState(false);
  const q = normalize(value || "");
  const matches = q ? POKEMON_KEYS.filter(function(k) { return k.includes(q); }).slice(0, 8) : [];
  const show = open && matches.length > 0;
  return (
    <div style={{ position:"relative", flex: style && style.flex ? style.flex : undefined }}>
      <input style={style} value={value} placeholder={placeholder}
        onChange={function(e) { onChange(e.target.value); }}
        onFocus={function() { setOpen(true); }}
        onBlur={function() { setTimeout(function() { setOpen(false); }, 120); }}
        onKeyDown={function(e) {
          if (e.key === "Escape") setOpen(false);
          if (onKeyDown) onKeyDown(e);
        }} />
      {show && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.card, border:"1px solid " + C.border, borderRadius:6, zIndex:20, maxHeight:200, overflowY:"auto", marginTop:2 }}>
          {matches.map(function(k) {
            return (
              <button key={k} type="button" style={{ display:"block", width:"100%", textAlign:"left", padding:"7px 10px", background:"none", border:"none", borderBottom:"1px solid " + C.border, color:C.text, fontFamily:"Courier New, monospace", cursor:"pointer", fontSize:11 }}
                onMouseDown={function(e) { e.preventDefault(); onChange(titleCase(k)); setOpen(false); }}>
                {titleCase(k)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeamTab(props) {
  const myTeam = props.myTeam;
  const saveTeam = props.saveTeam;
  const editing = props.editing;
  const setEditing = props.setEditing;
  const st = props.st;
  const C = props.C;
  const [draft, setDraft] = useState(myTeam);
  useEffect(function() { setDraft(myTeam); }, [myTeam]);

  function save() { saveTeam(draft); setEditing(false); }
  function cancel() { setDraft(myTeam); setEditing(false); }
  function upd(i, f, v) { setDraft(function(p) { return p.map(function(m, idx) { return idx === i ? Object.assign({}, m, { [f]: v }) : m; }); }); }
  function updMove(i, mi, v) {
    setDraft(function(p) {
      return p.map(function(m, idx) {
        if (idx !== i) return m;
        const mv = m.moves.slice();
        mv[mi] = v;
        return Object.assign({}, m, { moves: mv });
      });
    });
  }

  const display = editing ? draft : myTeam;
  const monCard = { background:C.card, border:"1px solid " + C.border, borderRadius:8, padding:14 };
  const slot = { width:22, height:22, background:"#2a1510", border:"1px solid #e85d2f44", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.accent, fontWeight:700, flexShrink:0 };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14, gap:10 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:3, color:C.accent, fontWeight:700 }}>YOUR TEAM</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:3 }}>Auto-saved between sessions</div>
        </div>
        {!editing
          ? <button style={st.btnPrimary} onClick={function() { setDraft(myTeam); setEditing(true); }}>EDIT TEAM</button>
          : <div style={{ display:"flex", gap:8 }}>
              <button style={st.btnPrimary} onClick={save}>SAVE</button>
              <button style={st.btnGhost} onClick={cancel}>CANCEL</button>
            </div>
        }
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
        {display.map(function(mon, i) {
          return (
            <div key={i} style={monCard}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={slot}>{i + 1}</div>
                {editing
                  ? <PokemonNameInput style={Object.assign({}, st.input, { flex:1 })} value={draft[i].name} onChange={function(v) { upd(i, "name", v); }} placeholder="Pokemon name" C={C} />
                  : <div style={{ fontSize:13, fontWeight:700, letterSpacing:1 }}>{mon.name || "Empty"}</div>
                }
              </div>
              {editing ? (
                <div>
                  {[["ability","ABILITY","e.g. Intimidate"],["item","ITEM","e.g. Sitrus Berry"]].map(function(row) {
                    return (
                      <div key={row[0]} style={{ marginBottom:8 }}>
                        <span style={st.label}>{row[1]}</span>
                        <input style={st.input} value={draft[i][row[0]]} onChange={function(e) { upd(i, row[0], e.target.value); }} placeholder={row[2]} />
                      </div>
                    );
                  })}
                  <span style={st.label}>MOVES</span>
                  {[0,1,2,3].map(function(mi) {
                    return <input key={mi} style={Object.assign({}, st.input, { marginBottom:4 })} value={draft[i].moves[mi] || ""} onChange={function(e) { updMove(i, mi, e.target.value); }} placeholder={"Move " + (mi + 1)} />;
                  })}
                </div>
              ) : (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, gap:8 }}>
                    <span style={{ fontSize:9, color:C.muted, fontWeight:700 }}>ABILITY</span>
                    <span style={{ fontSize:10, color:C.text, textAlign:"right" }}>{mon.ability || "--"}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, gap:8 }}>
                    <span style={{ fontSize:9, color:C.muted, fontWeight:700 }}>ITEM</span>
                    <span style={{ fontSize:10, color:C.text, textAlign:"right" }}>{mon.item || "--"}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:10 }}>
                    {(mon.moves || []).filter(Boolean).map(function(m, mi) {
                      return <div key={mi} style={{ background:C.faint, border:"1px solid " + C.border, borderRadius:3, padding:"2px 8px", fontSize:9, color:C.muted }}>{m}</div>;
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatchTab(props) {
  const opponent = props.opponent;
  const setOpponent = props.setOpponent;
  const runAnalysis = props.runAnalysis;
  const analyzing = props.analyzing;
  const analysis = props.analysis;
  const metaStatus = props.metaStatus;
  const logEntry = props.logEntry;
  const setLogEntry = props.setLogEntry;
  const logMatch = props.logMatch;
  const st = props.st;
  const C = props.C;
  const filled = opponent.filter(function(p) { return p.trim(); }).length;
  const canAnalyze = filled >= 4 && !analyzing && metaStatus !== "loading";

  return (
    <div>
      <div style={st.card}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
          <div style={st.cardTitle}>TEAM PREVIEW</div>
          <button style={st.btnGhost} onClick={function() { setOpponent(["","","","","",""]); }}>CLEAR</button>
        </div>
        <div style={st.cardSub}>Enter opponent's 6 Pokemon from preview screen</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
          {opponent.map(function(p, i) {
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:18, height:18, background:C.faint, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.muted, fontWeight:700, flexShrink:0 }}>{i + 1}</div>
                <PokemonNameInput style={Object.assign({}, st.input, { flex:1 })} value={p}
                  onChange={function(v) { const n = opponent.slice(); n[i] = v; setOpponent(n); }}
                  onKeyDown={function(e) { if (e.key === "Enter" && canAnalyze) runAnalysis(); }}
                  placeholder={"Pokemon " + (i + 1)} C={C} />
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:9, color:C.muted }}>{filled + "/6 entered -- min 4"}</span>
          <button style={Object.assign({}, st.btnPrimary, !canAnalyze ? st.btnDis : {})} onClick={runAnalysis} disabled={!canAnalyze}>
            {metaStatus === "loading" ? "LOADING..." : analyzing ? "ANALYZING..." : "ANALYZE"}
          </button>
        </div>
      </div>

      {analysis && !analyzing && (
        <div>
          {analysis.archetype !== "standard" && (
            <div style={Object.assign({}, st.card, { background:"#0d1a0d", border:"1px solid #1a3a1a" })}>
              <div style={{ fontSize:10, color:C.green, letterSpacing:3, fontWeight:700, marginBottom:4 }}>ARCHETYPE DETECTED</div>
              <div style={{ fontSize:14, fontWeight:900, color:C.text, letterSpacing:2 }}>{analysis.archetype.toUpperCase() + " TEAM"}</div>
              {analysis.leadNote && <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{"Expected lead: " + analysis.leadNote}</div>}
            </div>
          )}

          <div style={st.card}>
            <div style={st.cardTitle}>OPPONENT -- PREDICTED BRING</div>
            <div style={st.cardSub}>Ranked by usage + archetype leads. Highlighted = likely lead.</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10 }}>
              {analysis.opponentPrediction.map(function(pred, i) {
                const isLead = analysis.predictedLeads.some(function(l) { return l.key === pred.key; });
                return (
                  <div key={i} style={{ background: isLead ? C.gdim : "#06070a", border: "1px solid " + (isLead ? "#4caf5044" : C.border), borderRadius:6, padding:12 }}>
                    {isLead && <div style={{ fontSize:8, color:C.green, letterSpacing:1.5, fontWeight:700, background:"#061506", border:"1px solid #4caf5033", borderRadius:3, padding:"2px 6px", display:"inline-block", marginBottom:6 }}>LIKELY LEAD</div>}
                    <div style={{ fontSize:9, color:C.muted, marginBottom:4 }}>{"#" + (i + 1) + " " + (pred.usageRate * 100).toFixed(0) + "%"}</div>
                    <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>{pred.name}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                      {pred.topMoves.slice(0, 3).map(function(m, mi) { return <div key={mi} style={{ fontSize:8, color:C.muted, background:C.faint, borderRadius:3, padding:"2px 6px" }}>{m}</div>; })}
                      {pred.topItem && <div style={{ fontSize:8, color:C.yellow, background:"#1a1400", borderRadius:3, padding:"2px 6px" }}>{"Item: " + pred.topItem}</div>}
                      {pred.topAbility && <div style={{ fontSize:8, color:C.blue, background:"#0d1a2e", borderRadius:3, padding:"2px 6px" }}>{"Ability: " + pred.topAbility}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={st.card}>
            <div style={st.cardTitle}>YOUR RECOMMENDED BRING</div>
            <div style={st.cardSub}>Lead 1 and 2 first -- back 3 and 4 below</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {analysis.yourPick.map(function(pick, i) {
                return (
                  <div key={i} style={{ background: i < 2 ? C.gdim : "#06070a", border: "1px solid " + (i < 2 ? "#4caf5044" : C.border), borderRadius:6, padding:14 }}>
                    <div style={{ fontSize:8, color: i < 2 ? C.green : C.muted, letterSpacing:1.5, fontWeight:700, marginBottom:6 }}>{i < 2 ? "LEAD " + (i + 1) : "BACK " + (i - 1)}</div>
                    <div style={{ fontSize:15, fontWeight:900, letterSpacing:1, marginBottom:3 }}>{pick.name}</div>
                    <div style={{ fontSize:10, color:C.blue, marginBottom:2 }}>{pick.ability}</div>
                    <div style={{ fontSize:10, color:C.yellow, marginBottom:8 }}>{pick.item}</div>
                    <div style={{ fontSize:10, color: pick.hasWarning ? C.accent : C.muted, lineHeight:1.6, borderTop:"1px solid " + C.border, paddingTop:8 }}>{pick.reason}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {analysis.keyThreats.length > 0 && (
            <div style={st.card}>
              <div style={st.cardTitle}>KEY THREATS</div>
              {analysis.keyThreats.map(function(t, i) {
                return (
                  <div key={i} style={{ background:"#130a08", border:"1px solid #2a1510", borderRadius:6, padding:12, marginBottom:8 }}>
                    <div style={{ fontSize:10, color:C.accent, fontWeight:700, marginBottom:4, letterSpacing:1 }}>{t.name}</div>
                    <div style={{ fontSize:10, color:C.muted, lineHeight:1.6 }}>{t.threat}</div>
                  </div>
                );
              })}
            </div>
          )}

          {analysis.adjustments.length > 0 && (
            <div style={st.card}>
              <div style={st.cardTitle}>ADJUSTMENT GUIDE</div>
              <div style={st.cardSub}>Surprise picks and archetype notes only</div>
              {analysis.adjustments.map(function(adj, i) {
                return (
                  <div key={i} style={{ background:C.faint, border:"1px solid " + C.border, borderRadius:6, padding:12, marginBottom:8 }}>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:5 }}>{"IF: "}<strong style={{ color:C.accent }}>{adj.if}</strong></div>
                    <div style={{ fontSize:10, color:C.text, lineHeight:1.6 }}>{"-> " + adj.then}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={st.card}>
            <div style={st.cardTitle}>LOG THIS MATCH</div>
            <div style={st.cardSub}>Fill in after the match -- all fields optional</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:4 }}>
              {[["myBring","YOUR ACTUAL BRING","Your 4 (comma separated)"],["myLead","YOUR ACTUAL LEAD","Your lead two"],["theirBring","THEIR ACTUAL BRING","Their 4 (comma separated)"],["theirLead","THEIR ACTUAL LEAD","Their lead two"]].map(function(row) {
                return (
                  <div key={row[0]}>
                    <span style={st.label}>{row[1]}</span>
                    <input style={st.input} value={logEntry[row[0]]} onChange={function(e) { setLogEntry(function(p) { return Object.assign({}, p, { [row[0]]: e.target.value }); }); }} placeholder={row[2]} />
                  </div>
                );
              })}
            </div>
            <span style={st.label}>RESULT</span>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              {["W","L"].map(function(r) {
                const active = logEntry.result === r;
                const activeStyle = r === "W"
                  ? { background:"#0a1a0a", color:C.green, borderColor:"#4caf5044" }
                  : { background:"#1a0a0a", color:C.accent, borderColor:"#e85d2f44" };
                return (
                  <button key={r} style={Object.assign({ flex:1, padding:10, fontSize:11, letterSpacing:2, fontFamily:"Courier New, monospace", fontWeight:700, cursor:"pointer", borderRadius:4, border:"1px solid " + C.border, background:"none", color:C.muted }, active ? activeStyle : {})}
                    onClick={function() { setLogEntry(function(p) { return Object.assign({}, p, { result: p.result === r ? "" : r }); }); }}>
                    {r === "W" ? "WIN" : "LOSS"}
                  </button>
                );
              })}
            </div>
            <span style={st.label}>NOTES (optional)</span>
            <input style={Object.assign({}, st.input, { marginBottom:12 })} value={logEntry.notes} onChange={function(e) { setLogEntry(function(p) { return Object.assign({}, p, { notes: e.target.value }); }); }} placeholder="What happened, what to improve..." />
            <button style={st.btnPrimary} onClick={logMatch}>SAVE TO LOG</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SpeedTab(props) {
  const myTeam = props.myTeam;
  const st = props.st;
  const C = props.C;
  const [myMon, setMyMon] = useState("");
  const [oppSearch, setOppSearch] = useState("");
  const [oppMon, setOppMon] = useState(null);
  const [results, setResults] = useState([]);

  const myKey = normalize(myMon);
  const myBase = SPEED_DB[myKey] || null;

  useEffect(function() {
    if (oppSearch.trim().length < 2) { setResults([]); return; }
    const q = normalize(oppSearch);
    const found = Object.keys(SPEED_DB).filter(function(k) { return k.includes(q); })
      .sort(function(a, b) { if (a === q) return -1; if (b === q) return 1; return a.localeCompare(b); })
      .slice(0, 8);
    setResults(found);
  }, [oppSearch]);

  function selectOpp(key) { setOppMon({ key: key, base: SPEED_DB[key] }); setOppSearch(key.replace(/-/g, " ")); setResults([]); }

  function speedRows(base) {
    return [
      { label: "Base Speed (Neutral)", val: calcSpeed(base, "neutral") },
      { label: "Positive Nature (+10%)", val: calcSpeed(base, "positive") },
      { label: "Negative Nature (-10%)", val: calcSpeed(base, "negative") },
      { label: "Choice Scarf (x1.5)", val: Math.floor(calcSpeed(base, "neutral") * 1.5) },
      { label: "Scarf + Positive Nature", val: Math.floor(calcSpeed(base, "positive") * 1.5) },
      { label: "Tailwind (x2)", val: calcSpeed(base, "neutral") * 2 },
      { label: "Tailwind + Positive Nature", val: calcSpeed(base, "positive") * 2 },
      { label: "Chlorophyll / Swift Swim / Sand Rush (x2)", val: calcSpeed(base, "neutral") * 2 },
    ];
  }

  return (
    <div>
      <div style={st.card}>
        <div style={st.cardTitle}>SPEED COMPARISON</div>
        <div style={st.cardSub}>Compare your Pokemon vs an opponent across common modifiers</div>
        <span style={st.label}>YOUR POKEMON</span>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8, marginBottom:16 }}>
          {myTeam.filter(function(m) { return m.name.trim(); }).map(function(m, i) {
            const key = normalize(m.name);
            const base = SPEED_DB[key];
            return (
              <button key={i} style={{ background: myMon === m.name ? "#2a1510" : "#06070a", border: "1px solid " + (myMon === m.name ? C.accent : C.border), borderRadius:6, padding:"10px 12px", cursor:"pointer", textAlign:"left", color: myMon === m.name ? C.accent : C.text, fontFamily:"Courier New, monospace" }}
                onClick={function() { setMyMon(myMon === m.name ? "" : m.name); }}>
                <div style={{ fontWeight:700, fontSize:12 }}>{m.name}</div>
                {base ? <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>{"Base " + base}</div> : <div style={{ fontSize:9, color:C.accent, marginTop:2 }}>No data</div>}
              </button>
            );
          })}
        </div>
        <span style={st.label}>OPPONENT POKEMON</span>
        <div style={{ position:"relative" }}>
          <input style={st.input} value={oppSearch} onChange={function(e) { setOppSearch(e.target.value); setOppMon(null); }} placeholder="Search any Pokemon name..." />
          {results.length > 0 && (
            <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.card, border:"1px solid " + C.border, borderRadius:6, zIndex:10, maxHeight:200, overflowY:"auto" }}>
              {results.map(function(key) {
                return (
                  <button key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", padding:"8px 12px", background:"none", border:"none", borderBottom:"1px solid " + C.border, color:C.text, fontFamily:"Courier New, monospace", cursor:"pointer", fontSize:11, textTransform:"capitalize" }}
                    onClick={function() { selectOpp(key); }}>
                    <span>{key.replace(/-/g, " ")}</span>
                    <span style={{ color:C.muted, fontSize:10 }}>{"Base " + SPEED_DB[key]}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {myBase && oppMon && (
        <div style={st.card}>
          <div style={st.cardTitle}>SPEED BREAKDOWN</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, padding:12, background:"#06070a", borderRadius:6 }}>
            <div style={{ fontSize:12, fontWeight:700, flex:1 }}>{myMon + " (Base " + myBase + ")"}</div>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:2, fontWeight:700, padding:"0 12px" }}>VS</div>
            <div style={{ fontSize:12, fontWeight:700, flex:1, textAlign:"right", textTransform:"capitalize" }}>{oppMon.key.replace(/-/g, " ") + " (Base " + oppMon.base + ")"}</div>
          </div>
          {speedRows(myBase).map(function(row, i) {
            const oppVal = speedRows(oppMon.base)[i].val;
            const myVal = row.val;
            const myWins = myVal > oppVal;
            const tie = myVal === oppVal;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid " + C.faint }}>
                <div style={{ width:44, fontSize:14, fontWeight:900, color: myWins ? C.green : tie ? C.muted : C.accent }}>{myVal}</div>
                <div style={{ flex:1, fontSize:10, color:C.muted, textAlign:"center" }}>{row.label}</div>
                <div style={{ width:44, fontSize:14, fontWeight:900, textAlign:"right", color: !myWins && !tie ? C.green : tie ? C.muted : C.accent }}>{oppVal}</div>
              </div>
            );
          })}
          <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:12, fontSize:9, letterSpacing:1 }}>
            <span style={{ color:C.green }}>Green = Faster</span>
            <span style={{ color:C.muted }}>Grey = Tie</span>
            <span style={{ color:C.accent }}>Red = Slower</span>
          </div>
        </div>
      )}

      {myBase && !oppMon && (
        <div style={st.card}>
          <div style={st.cardTitle}>{myMon.toUpperCase() + " SPEED STATS"}</div>
          <div style={st.cardSub}>{"Base " + myBase + " -- search an opponent above to compare"}</div>
          {speedRows(myBase).map(function(row, i) {
            return (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid " + C.faint }}>
                <div style={{ fontSize:10, color:C.muted }}>{row.label}</div>
                <div style={{ fontSize:14, fontWeight:900, color:C.text }}>{row.val}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LogTab(props) {
  const matchLog = props.matchLog;
  const clearLog = props.clearLog;
  const wins = props.wins;
  const losses = props.losses;
  const st = props.st;
  const C = props.C;

  if (!matchLog.length) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px" }}>
        <div style={{ fontSize:36, marginBottom:14 }}>{"(no matches)"}</div>
        <div style={{ fontSize:13, color:C.muted, letterSpacing:2, marginBottom:8 }}>No matches logged</div>
        <div style={{ fontSize:10, color:"#2a2a2a", maxWidth:280, margin:"0 auto", lineHeight:1.7 }}>Complete an analysis then log results to track performance over time</div>
      </div>
    );
  }

  const winRate = matchLog.length > 0 ? Math.round(wins / matchLog.length * 100) : 0;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14, gap:10 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:3, color:C.accent, fontWeight:700 }}>MATCH LOG</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:3 }}>
            {matchLog.length + " matches -- "}
            <span style={{ color:C.green }}>{"W" + wins}</span>
            {" / "}
            <span style={{ color:C.accent }}>{"L" + losses}</span>
            {" -- " + winRate + "% win rate"}
          </div>
        </div>
        <button style={Object.assign({}, st.btnGhost, { color:C.accent, borderColor:"#e85d2f44" })} onClick={clearLog}>CLEAR ALL</button>
      </div>
      {matchLog.map(function(entry, i) {
        const isW = entry.result === "W";
        const isL = entry.result === "L";
        return (
          <div key={i} style={{ background:C.card, border:"1px solid " + (isW ? "#4caf5033" : isL ? "#e85d2f33" : C.border), borderRadius:8, padding:14, marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:9, color:"#444", letterSpacing:2, fontWeight:700 }}>{entry.date}</div>
              {entry.result && (
                <div style={{ fontSize:10, fontWeight:900, letterSpacing:2, color: isW ? C.green : C.accent, background: isW ? "#0a1a0a" : "#1a0a0a", border:"1px solid " + (isW ? "#4caf5033" : "#e85d2f33"), borderRadius:3, padding:"2px 8px" }}>
                  {isW ? "WIN" : "LOSS"}
                </div>
              )}
            </div>
            {entry.archetype && entry.archetype !== "standard" && (
              <div style={{ fontSize:9, color:C.green, letterSpacing:1.5, marginBottom:8, background:"#0a1a0a", display:"inline-block", padding:"2px 6px", borderRadius:3 }}>{entry.archetype.toUpperCase()}</div>
            )}
            <LR label="OPPONENT SEEN" value={(entry.opponentSeen || []).join(", ")} C={C} />
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <LR label="PREDICTED BRING" value={(entry.opponentPredicted || []).join(", ")} flex C={C} />
              <LR label="THEIR ACTUAL BRING" value={entry.theirActualBring || "--"} flex bright={!!entry.theirActualBring} C={C} />
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <LR label="PREDICTED LEAD" value={(entry.opponentPredictedLead || []).join(", ")} flex C={C} />
              <LR label="THEIR ACTUAL LEAD" value={entry.theirActualLead || "--"} flex bright={!!entry.theirActualLead} C={C} />
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <LR label="YOUR RECOMMENDED" value={(entry.yourRecommended || []).join(", ")} flex C={C} />
              <LR label="YOUR ACTUAL BRING" value={entry.myActualBring || "--"} flex bright={!!entry.myActualBring} C={C} />
            </div>
            {entry.myActualLead && <LR label="YOUR ACTUAL LEAD" value={entry.myActualLead} bright C={C} />}
            {entry.notes && <LR label="NOTES" value={entry.notes} bright C={C} />}
          </div>
        );
      })}
    </div>
  );
}

function LR(props) {
  const C = props.C;
  return (
    <div style={{ flex: props.flex ? 1 : undefined, minWidth: props.flex ? 120 : undefined, marginBottom:8 }}>
      <div style={{ fontSize:8, color:"#444", letterSpacing:2, fontWeight:700, marginBottom:3 }}>{props.label}</div>
      <div style={{ fontSize:10, color: props.bright ? C.text : "#444", lineHeight:1.5 }}>{props.value || "--"}</div>
    </div>
  );
}
