import { useState, useEffect, useCallback } from "react";
import typeChartData from "./data/typeChart.json";
import pokemonData from "./data/pokemon.json";
import movesData from "./data/moves.json";
import itemsData from "./data/items.json";
import abilitiesData from "./data/abilities.json";
import championsKeys from "./data/champions.json";
import './themes.css';


const CHAMPION_SET = new Set(championsKeys);

const THEMES = {
  classic: {
    name: "Classic",
    bg: "#0a0a0a",
    bgGradient: "radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)",
    card: "#1a1a1a",
    cardGradient: "linear-gradient(180deg, rgba(26,26,26,0.95), rgba(10,10,10,0.98))",
    border: "#333333",
    panelBorder: "#404040",
    accent: "#ff6b35",
    green: "#7dc7ff",
    text: "#ffffff",
    muted: "#cccccc",
    faint: "#0f0f0f",
    yellow: "#ffd700",
    blue: "#87ceeb",
    gdim: "#050505",
    borderRadius: 8,
    borderWidth: 1,
    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
    buttonGradient: "linear-gradient(120deg, rgba(255,107,53,0.9), rgba(255,165,0,0.8))",
    font: "Courier New, monospace",
  },
  diamond: {
    name: "Diamond",
    bg: "#060a14",
    bgGradient: "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(30,70,150,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(20,50,120,0.2) 0%, transparent 50%), linear-gradient(180deg, #060a14 0%, #08101e 100%)",
    card: "#0d1828",
    cardGradient: "linear-gradient(180deg, rgba(13,24,40,0.96), rgba(6,10,20,0.99))",
    border: "#1e3a6a",
    panelBorder: "#2a5090",
    accent: "#7ab8ff",
    green: "#a8d8ff",
    text: "#c8dcf0",
    muted: "#5878a0",
    faint: "#0a1020",
    yellow: "#d4a840",
    blue: "#4a90d9",
    gdim: "#080e1c",
    borderRadius: 4,
    borderWidth: 1,
    boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(74,144,217,0.08)",
    buttonGradient: "linear-gradient(120deg, rgba(74,144,217,0.9), rgba(26,58,106,0.85))",
    pokeballTop: "#4a90d9",
    pokeballBottom: "#060a14",
    font: "Cinzel, Georgia, serif",
  },
  pearl: {
    name: "Pearl",
    // Palkia's spatial realm — iridescent rose-pearl, nacre white, void teal
    bg: "#0e0810",
    bgGradient: "radial-gradient(ellipse 100% 70% at 50% -10%, rgba(200,100,220,0.2) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 0% 50%, rgba(96,200,216,0.08) 0%, transparent 50%), linear-gradient(180deg, #0e0810 0%, #130a16 100%)",
    card: "#1a0e1e",
    cardGradient: "linear-gradient(180deg, rgba(26,14,30,0.97), rgba(14,8,16,0.99))",
    border: "#3a1e48",
    panelBorder: "#5a2870",
    accent: "#e8a8f8",        // Palkia rose — title, tab underline, card titles
    green: "#c0f0f8",         // spatial teal for W count / positive states
    text: "#eeddf8",          // pale lavender-white
    muted: "#7a5888",         // dim purple
    faint: "#160a1a",         // near-black for status badge
    yellow: "#c8a040",        // warm gold secondary
    blue: "#60c8d8",          // void teal — spatial distortion accent
    gdim: "#120810",          // very dark for LIVE badge bg
    borderRadius: 20,         // soft / organic — pearl curves
    borderWidth: 1,
    boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 30px rgba(200,120,216,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(200,120,216,0.85), rgba(96,200,216,0.75))",
    pokeballTop: "#c878d8",
    pokeballBottom: "#0e0810",
    font: "Palatino Linotype, Palatino, Georgia, serif",  // elegant / spatial
  },
 platinum: {
    name: "Platinum",
    // Giratina's Distortion World — pure void black, chrome sheen, phantom purple, red eye
    bg: "#050505",
    bgGradient: "radial-gradient(ellipse 80% 60% at 40% 50%, rgba(74,40,104,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(48,160,168,0.05) 0%, transparent 50%), linear-gradient(180deg, #050505 0%, #080808 100%)",
    card: "#0c0c0c",
    cardGradient: "linear-gradient(180deg, rgba(12,12,12,0.98), rgba(5,5,5,0.99))",
    border: "#282828",
    panelBorder: "#383838",
    accent: "#c8c8c8",        // chrome — used for title, tab underline, card titles
    green: "#909090",         // dim chrome for W count / positive states
    text: "#d8d8d8",          // cool grey text
    muted: "#484848",         // very dim for secondary text
    faint: "#0a0a0a",         // near-black for status badge
    yellow: "#a870e0",        // void purple — Giratina's energy as "warm" accent
    blue: "#30a0a8",          // distortion teal — secondary highlight
    gdim: "#080808",          // very dark for LIVE badge bg
    borderRadius: 2,          // razor sharp — Distortion World geometry
    borderWidth: 1,
    boxShadow: "0 16px 40px rgba(0,0,0,0.9), 0 0 0 1px rgba(200,200,200,0.04)",
    buttonGradient: "linear-gradient(120deg, rgba(168,112,224,0.8), rgba(48,160,168,0.7))",
    pokeballTop: "#c8c8c8",
    pokeballBottom: "#050505",
    font: "'Exo 2', 'Segoe UI', Arial, sans-serif",  // clean / geometric / void
  },
  black: {
    name: "Black",
    // Zekrom / Unova — deep void black, electric cyan neon, Castelia energy
    bg: "#030303",
    bgGradient: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,96,192,0.2) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 90%, rgba(0,200,255,0.06) 0%, transparent 50%), linear-gradient(180deg, #040608 0%, #030303 70%)",
    card: "#080a0c",
    cardGradient: "linear-gradient(180deg, rgba(8,10,12,0.98), rgba(3,3,3,0.99))",
    border: "#0a2040",
    panelBorder: "#0d2850",
    accent: "#00c8ff",        // Zekrom cyan — title, tab underline, card titles
    green: "#00f0d0",         // electric teal for W count / positive states
    text: "#e0f4ff",          // cold electric white
    muted: "#304858",         // deep muted blue-grey
    faint: "#040810",         // near-black for status badge
    yellow: "#40e0ff",        // bright neon cyan as secondary (your "yellow" slot)
    blue: "#0060c0",          // deep neon blue
    gdim: "#030608",          // very dark for LIVE badge bg
    borderRadius: 0,          // zero radius — hard urban geometry, Castelia steel
    borderWidth: 1,
    boxShadow: "0 16px 40px rgba(0,0,0,0.95), 0 0 20px rgba(0,200,255,0.04)",
    buttonGradient: "linear-gradient(120deg, rgba(0,200,255,0.9), rgba(0,96,192,0.8))",
    pokeballTop: "#00c8ff",
    pokeballBottom: "#030303",
    font: "'Rajdhani', 'Arial Narrow', Arial, sans-serif",  // urban / sharp / Unova
  },
  white: {
    name: "White",
    // Reshiram — blinding idealism, overexposed sacred light, pure fire
    // Everything is washed out and luminous — like staring into Reshiram's core
    bg: "#ffffff",
    bgGradient: "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(255,240,200,0.9) 0%, rgba(255,255,255,0.95) 40%, #f8f8ff 100%)",
    card: "#ffffff",
    cardGradient: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,248,255,0.98) 100%)",
    border: "#e8e4f0",
    panelBorder: "#d8d0e8",
    accent: "#c47a00",        // scorched gold — the only warmth in the white
    green: "#0070c0",         // deep blue — W count, positive state
    text: "#1a1a2e",          // near-black with a hint of blue — grounded contrast
    muted: "#9090a8",         // cool grey-lavender for secondary text
    faint: "#f4f2fa",         // barely-there lavender wash
    yellow: "#e08800",        // deeper amber — secondary warm accent
    blue: "#4060d0",          // Reshiram's blue flame core — tertiary accent
    gdim: "#eeeaf8",          // very light lavender for LIVE badge bg
    borderRadius: 20,         // soft and open — light has no hard edges
    borderWidth: 1,
    boxShadow: "0 8px 40px rgba(180,160,220,0.12), 0 2px 8px rgba(180,160,220,0.08)",
    buttonGradient: "linear-gradient(120deg, rgba(196,122,0,0.9), rgba(224,136,0,0.8))",
    pokeballTop: "#c47a00",
    pokeballBottom: "#f0ecff",
    font: "Optima, Candara, 'Gill Sans', sans-serif", // clean, open, aspirational
  },
  scarlet: {
    name: "Scarlet",
    // Koraidon + Naranja Academy — ancient stone meets warm collegiate fire
    // Paldean ruins baked in sun, terracotta, carved glyphs, academic amber
    bg: "#1a0a04",
    bgGradient: "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(180,60,10,0.3) 0%, rgba(26,10,4,0.98) 55%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(120,40,0,0.2) 0%, transparent 50%), linear-gradient(180deg, #1e0c06 0%, #140804 100%)",
    card: "#241008",
    cardGradient: "linear-gradient(180deg, rgba(36,16,8,0.97), rgba(20,8,4,0.99))",
    border: "#5c2810",
    panelBorder: "#7a3818",
    accent: "#ff8c3a",        // Naranja fire-orange — title, tabs, card titles
    green: "#ffc080",         // warm amber for W count / positive states
    text: "#fff0e0",          // warm parchment white
    muted: "#a06040",         // terracotta dim
    faint: "#200e06",         // deep ember dark for status badge
    yellow: "#ffd080",        // ancient gold — secondary accent, glyph color
    blue: "#c84820",          // deep burnt sienna — used in your "blue" slot for contrast
    gdim: "#180a04",          // very dark ember for LIVE badge bg
    borderRadius: 6,          // slightly rough — carved stone, not polished
    borderWidth: 2,           // heavier borders — ancient architecture weight
    boxShadow: "0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(180,80,20,0.1)",
    buttonGradient: "linear-gradient(120deg, rgba(220,80,20,0.95), rgba(255,160,60,0.85))",
    pokeballTop: "#ff8c3a",
    pokeballBottom: "#1a0a04",
    font: "Trajan Pro, Palatino Linotype, Palatino, Georgia, serif", // ancient inscriptions, academy gravitas
  },
  violet: {
    name: "Violet",
    // Miraidon — cyberpunk Paldea, electric grape, circuit boards, neon future
    // Uva Academy dissolved into a digital realm — deep purple lit by plasma
    bg: "#08040f",
    bgGradient: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(120,40,200,0.25) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(60,0,140,0.15) 0%, transparent 50%), linear-gradient(180deg, #0a0514 0%, #06030e 100%)",
    card: "#100820",
    cardGradient: "linear-gradient(180deg, rgba(16,8,32,0.98), rgba(8,4,15,0.99))",
    border: "#2a1060",
    panelBorder: "#3a1880",
    accent: "#b060ff",        // Miraidon plasma violet — title, tabs, card titles
    green: "#60d8ff",         // electric cyan — W count / positive (Miraidon's eye color)
    text: "#e8d8ff",          // soft violet-white
    muted: "#5030a0",         // deep circuit purple for secondary text
    faint: "#0c061a",         // near-black purple for status badge
    yellow: "#d090ff",        // bright plasma purple — secondary accent
    blue: "#40a0ff",          // electric blue — Miraidon circuit highlight
    gdim: "#090418",          // very dark for LIVE badge bg
    borderRadius: 3,          // sharp circuit-board geometry — tech aesthetic
    borderWidth: 1,
    boxShadow: "0 16px 48px rgba(0,0,0,0.9), 0 0 20px rgba(140,60,255,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(140,60,255,0.9), rgba(64,160,255,0.8))",
    pokeballTop: "#b060ff",
    pokeballBottom: "#08040f",
    font: "'Share Tech Mono', 'Courier New', monospace", // terminal / circuit — cyberpunk readout
  },
};

// Speed formula matching Pikalytics (level 50)
const calcSpeed = (base, ev = 252, nature = "neutral") => {
  const raw = Math.floor((2 * base + 31 + Math.floor(ev / 4)) * 50 / 100 + 5);
  if (nature === "positive") return Math.floor(raw * 1.1);
  if (nature === "negative") return Math.floor(raw * 0.9);
  return raw;
};

// move name (kebab) → { name, type, bp, category }
const movesByName = {};
for (const [, d] of Object.entries(movesData)) {
  if (d.name) movesByName[d.name.toLowerCase().replace(/\s+/g, "-")] = d;
}
const normalize = (s) => s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
function isChampionKey(key) {
  return CHAMPION_SET.has(key);
}
const getTypeEff = (mt, dts) => {
  let m = 1;
  for (const dt of dts) m *= ((typeChartData[mt] || {})[dt] !== undefined ? (typeChartData[mt] || {})[dt] : 1);
  return m;
};

const ARCHETYPE_SETTERS = {
  rain: ["pelipper","politoed"],
  sun: ["charizard","torkoal"],
  sand: ["tyranitar","hippowdon"],
  snow: ["froslass","mega-froslass","abomasnow"],
  trickroom: ["sinistcha","farigiraf","hatterene","cofagrigus","reuniclus","oranguru"],
  tailwind: ["aerodactyl","whimsicott","talonflame","corviknight","dragonite"],
};

const LEAD_PAIRS = [
  { pair: ["pelipper","archaludon"], prob: 0.85, note: "Core Rain lead" },
  { pair: ["pelipper","incineroar"], prob: 0.70, note: "Rain + Fake Out support" },
  { pair: ["pelipper","basculegion-male"], prob: 0.65, note: "Rain + Swift Swim sweeper" },
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

const ARCHETYPE_ABUSERS = {
  trickroom: ["reuniclus","dusknoir","grimmsnarl","stakataka","torkoal","arcanine","machamp","mimikyu"],
  rain: ["basculegion-male","ludicolo","omastar","kabutops","kingdra","gastrodon"],
  sun: ["venusaur","cherrim","ninetales-alola","volcarona","torkoal"],
  sand: ["excadrill","landorus-therian","garchomp","stoutland","hippowdon"],
  snow: ["abomasnow","weavile","aurorus","froslass"],
  tailwind: ["dragonite","talonflame","corviknight","hawlucha","noivern","aerodactyl"],
};

const MOVE_PATTERNS = {
  spreadAttacker: ["earthquake", "surf", "discharge", "heat wave", "blizzard"],
  redirector: ["follow me", "rage powder", "ally switch"],
  fakeOutUser: ["fake out"],
  priorityUser: ["quick attack", "aqua jet", "bullet punch", "first impression", "ice shard"],
  trickUser: ["trick", "switcheroo", "knock off"],
};

function detectRoles(mon) {
  const moves = (mon.topMoves || []).map(m => m.toLowerCase());
  const roles = [];
  if (moves.some(m => MOVE_PATTERNS.spreadAttacker.includes(m))) roles.push("spreadAttacker");
  if (moves.some(m => MOVE_PATTERNS.redirector.includes(m))) roles.push("redirector");
  if (moves.some(m => MOVE_PATTERNS.fakeOutUser.includes(m))) roles.push("fakeOutUser");
  if (moves.some(m => MOVE_PATTERNS.priorityUser.includes(m))) roles.push("priorityUser");
  if (moves.some(m => MOVE_PATTERNS.trickUser.includes(m))) roles.push("trickUser");
  return roles;
}

function isTrickRoomAbuser(mon) {
  const key = normalize(mon.name || mon.key);
  const baseStat = pokemonData[key]?.stats?.speed ?? 50;
  return (ARCHETYPE_ABUSERS.trickroom.includes(key) || baseStat <= 70);
}

function isSwiftSwimUser(mon) {
  const ab = (mon.topAbility || "").toLowerCase().replace(/\s/g, "-");
  return ab.includes("swift-swim");
}

function isChlorophyllUser(mon) {
  const ab = (mon.topAbility || "").toLowerCase().replace(/\s/g, "-");
  return ab.includes("chlorophyll");
}

function isSandRushUser(mon) {
  const ab = (mon.topAbility || "").toLowerCase().replace(/\s/g, "-");
  return ab.includes("sand-rush");
}

function isSpreadAttacker(mon) {
  const moves = (mon.topMoves || []).map(m => m.toLowerCase());
  return moves.some(m => MOVE_PATTERNS.spreadAttacker.includes(m));
}

function isRedirector(mon) {
  const moves = (mon.topMoves || []).map(m => m.toLowerCase());
  return moves.some(m => MOVE_PATTERNS.redirector.includes(m));
}

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

function detectCoupledCores(oppKeys, opp, archetype) {
  const cores = [];
  const used = new Set();

  // Archetype Coupling: Detect setter + abuser pairs
  if (archetype !== "standard") {
    const setters = ARCHETYPE_SETTERS[archetype] || [];
    const setter = opp.find(mon => setters.includes(mon.key));
    
    if (setter) {
      used.add(setter.key);
      const abuserList = ARCHETYPE_ABUSERS[archetype] || [];
      const abuser = opp.find(mon => !used.has(mon.key) && abuserList.includes(mon.key));
      
      if (abuser) {
        used.add(abuser.key);
        cores.push({
          lead: [setter.key, abuser.key],
          type: "archetype",
          confidence: 0.85,
          note: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} setter + abuser`,
        });
      } else {
        cores.push({
          lead: [setter.key],
          type: "archetype",
          confidence: 0.75,
          note: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} setter (no clear abuser)`,
        });
        used.add(setter.key);
      }
    }
  }

  // Support Coupling: Redirector + Spread Attacker
  const redirectors = opp.filter(mon => !used.has(mon.key) && isRedirector(mon));
  for (const redir of redirectors) {
    const spreader = opp.find(mon => !used.has(mon.key) && mon.key !== redir.key && isSpreadAttacker(mon));
    if (spreader) {
      cores.push({
        lead: [redir.key, spreader.key],
        type: "support",
        confidence: 0.70,
        note: "Redirection + Spread attacker",
      });
      used.add(redir.key);
      used.add(spreader.key);
    }
  }

  // Fake Out User as secondary support
  const fakeOutUsers = opp.filter(mon => !used.has(mon.key) && (mon.topMoves || []).some(m => m.toLowerCase() === "fake out"));
  const frailMons = opp.filter(mon => !used.has(mon.key) && pokemonData[mon.key]?.stats?.speed >= 90);
  if (fakeOutUsers.length > 0 && frailMons.length > 0) {
    cores.push({
      lead: [fakeOutUsers[0].key, frailMons[0].key],
      type: "support",
      confidence: 0.65,
      note: "Fake Out + Speed threat",
    });
    used.add(fakeOutUsers[0].key);
    used.add(frailMons[0].key);
  }

  return {
    cores: cores,
    isPaired: cores.length > 0,
    coreCount: cores.length,
  };
}

function classifyArchetypeWithConfidence(archetype, cores) {
  let confidence = 0.5;
  let reason = "";

  if (archetype === "standard") {
    confidence = 0.35;
    reason = "No clear archetype detected";
  } else {
    confidence = 0.65;
    reason = `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} team`;

    if (cores.cores.length > 0 && cores.cores[0].type === "archetype") {
      confidence = Math.min(0.95, confidence + 0.2);
      reason += ` (core detected: ${cores.cores[0].note})`;
    }

    if (cores.cores.length > 1) {
      confidence = Math.min(confidence, 0.65);
      reason += " [Possible dual-mode]";
    }
  }

  return {
    archetype: archetype,
    confidence: Math.min(confidence, 1.0),
    reason: reason,
  };
}

function scoreBackPicksForCore(remaining, predictedCore, archetype, myTeam) {
  return remaining.map(mon => {
    let synergySc = 0.3; // baseline

    // Synergy: Does this work well with the core?
    if (archetype === "trickroom" && isTrickRoomAbuser(mon)) synergySc += 0.5;
    if (archetype === "rain" && isSwiftSwimUser(mon)) synergySc += 0.5;
    if (archetype === "sun" && isChlorophyllUser(mon)) synergySc += 0.5;
    if (archetype === "sand" && isSandRushUser(mon)) synergySc += 0.5;
    if (isSpreadAttacker(mon) && predictedCore.some(pk => isRedirector(pk))) synergySc += 0.4;
    if ((mon.topAbility || "").toLowerCase().includes("intimidate")) synergySc += 0.2;

    const usageSc = mon.usageRate || 0.05;

    // Matchup: Coverage against my team's weaknesses
    let matchupSc = 0;
    for (const myMon of myTeam) {
      const myTypes = pokemonData[normalize(myMon.name)]?.types ?? ["normal"];
      const oppTypes = mon.types || ["normal"];
      for (const ot of oppTypes) {
        const eff = getTypeEff(ot, myTypes);
        if (eff >= 2) matchupSc += 0.1;
      }
    }
    matchupSc = Math.min(matchupSc / myTeam.length, 0.5); // normalize

    const totalScore = (synergySc * 0.4) + (usageSc * 0.35) + (matchupSc * 0.25);

    return Object.assign({}, mon, {
      synergySc: Math.round(synergySc * 100) / 100,
      usageSc: Math.round(usageSc * 100) / 100,
      matchupSc: Math.round(matchupSc * 100) / 100,
      totalScore: Math.round(totalScore * 100) / 100,
    });
  });
}

function analyzeMatchup(opponentNames, myTeam, metaData) {
  const validOpponentNames = opponentNames.map((name) => normalize(name)).filter((key) => isChampionKey(key));
  const opp = validOpponentNames.map((key) => {
    const meta = metaData && metaData.pokemon_usage ? metaData.pokemon_usage.find((p) => normalize(p.name) === key) : null;
    return {
      name: pokemonData[key]?.name || titleCase(key),
      key,
      usageRate: meta ? meta.usage_rate : 0.03,
      topMoves: meta && meta.top_moves ? meta.top_moves.slice(0, 4).map((m) => movesData[m.id]?.name ?? null).filter(Boolean) : [],
      topItem: meta && meta.top_items && meta.top_items[0] ? (itemsData[meta.top_items[0].id] ?? null) : null,
      topAbility: meta && meta.top_abilities && meta.top_abilities[0] ? (abilitiesData[meta.top_abilities[0].id] ?? null) : null,
      types: pokemonData[key]?.types ?? ["normal"],
    };
  });

  const oppKeys = opp.map((p) => p.key);
  const archetype = detectArchetype(oppKeys);
  const leadPred = predictLeads(oppKeys, archetype);
  
  // STAGE 1 ENHANCEMENTS: Detect cores and classify with confidence
  const coreDetection = detectCoupledCores(oppKeys, opp, archetype);
  const archetypeInfo = classifyArchetypeWithConfidence(archetype, coreDetection);

  // Determine predicted leads from core detection or fallback
  let predictedLeads = [];
  let predictedLeadKeys = [];
  if (coreDetection.cores.length > 0 && coreDetection.cores[0].lead) {
    predictedLeadKeys = coreDetection.cores[0].lead;
    predictedLeads = predictedLeadKeys.map((lk) => opp.find((p) => p.key === lk)).filter(Boolean);
  } else if (leadPred && leadPred.pair) {
    predictedLeadKeys = leadPred.pair;
    predictedLeads = predictedLeadKeys.map((lk) => opp.find((p) => p.key === lk)).filter(Boolean);
  } else {
    predictedLeadKeys = [opp[0].key, opp[1]?.key].filter(Boolean);
    predictedLeads = predictedLeadKeys.map((lk) => opp.find((p) => p.key === lk)).filter(Boolean);
  }

  // Enhanced back-pick selection: Score remaining 2 against the core
  const remaining = opp.filter(mon => !predictedLeadKeys.includes(mon.key));
  const remainingScored = scoreBackPicksForCore(remaining, predictedLeads, archetype, myTeam);
  const backPicks = remainingScored.slice().sort((a, b) => b.totalScore - a.totalScore).slice(0, 2);
  
  const predictedBring = [].concat(predictedLeads, backPicks);

  // Build confidence breakdown per Pokémon
  const predictionBreakdown = {};
  for (const mon of predictedLeads) {
    const coreInfo = coreDetection.cores[0];
    predictionBreakdown[mon.key] = {
      confidence: coreInfo ? coreInfo.confidence : 0.75,
      tier: "near-lock",
      reason: coreInfo ? coreInfo.note : "Predicted lead",
    };
  }
  for (const mon of backPicks) {
    const tier = mon.totalScore > 0.6 ? "likely" : "uncertain";
    const reasons = [];
    if (mon.synergySc > 0.4) reasons.push(`Synergy: ${(mon.synergySc * 100).toFixed(0)}%`);
    if (mon.usageSc > 0.05) reasons.push(`Usage: ${(mon.usageSc * 100).toFixed(1)}%`);
    if (mon.matchupSc > 0.15) reasons.push(`Matchup: ${(mon.matchupSc * 100).toFixed(0)}%`);
    
    predictionBreakdown[mon.key] = {
      confidence: mon.totalScore,
      tier: tier,
      reason: reasons.join(" + ") || "Secondary coverage",
    };
  }

  // Flag uncertainty
  const uncertaintyFlags = [];
  if (archetypeInfo.confidence < 0.5) {
    uncertaintyFlags.push({
      slot: "all",
      severity: "high",
      reason: archetypeInfo.reason,
    });
  }
  if (coreDetection.cores.length > 1) {
    uncertaintyFlags.push({
      slot: "lead",
      severity: "medium",
      reason: `Multiple viable cores (${coreDetection.cores.length} options)`,
    });
  }
  if (backPicks.length > 1 && Math.abs(backPicks[0].totalScore - backPicks[1].totalScore) < 0.1) {
    uncertaintyFlags.push({
      slot: "back2",
      severity: "medium",
      reason: `Close margin between back picks (coin flip between ${backPicks[0].name} and ${backPicks[1].name})`,
    });
  }

  const byUsage = opp.slice().sort((a, b) => {
    let sa = a.usageRate;
    let sb = b.usageRate;
    if (leadPred && leadPred.pair.includes(a.key)) sa += 0.3;
    if (leadPred && leadPred.pair.includes(b.key)) sb += 0.3;
    return sb - sa;
  });

  const myScored = myTeam.filter((m) => m.name.trim()).map((mon) => {
    const monKey = normalize(mon.name);
    const monTypes = pokemonData[monKey]?.types ?? ["normal"];
    const ab = (mon.ability || "").toLowerCase();
    const moves = (mon.moves || []).map((m) => m.toLowerCase());
    let score = 0;
    const reasons = [];
    const warnings = [];

    // Pre-compute my move coverage data (damaging moves only)
    const myMoveDmg = moves
      .map(mv => movesByName[mv.replace(/\s+/g, "-")])
      .filter(d => d && d.bp >= 40);

    for (const o of predictedBring) {
      // Outgoing: use actual moves if available, else fall back to typing
      if (myMoveDmg.length > 0) {
        for (const mvd of myMoveDmg) {
          const e = getTypeEff(mvd.type, o.types);
          if (e >= 2) { score += 2; reasons.push(mvd.name + " SE vs " + o.name); break; }
        }
      } else {
        for (const mt of monTypes) {
          const e = getTypeEff(mt, o.types);
          if (e >= 2) { score += 2; reasons.push("SE typing vs " + o.name); }
          else if (e === 0) score -= 1;
        }
      }
      // Incoming: use opponent's top moves if available, else fall back to typing
      const oppMoveDmg = (o.topMoves || [])
        .map(mv => movesByName[mv.toLowerCase().replace(/\s+/g, "-")])
        .filter(d => d && d.bp >= 40);
      if (oppMoveDmg.length > 0) {
        for (const mvd of oppMoveDmg) {
          const e = getTypeEff(mvd.type, monTypes);
          if (e >= 2) score -= 1.5;
          else if (e <= 0.5 && e > 0) score += 0.5;
          else if (e === 0) score += 1.5;
        }
      } else {
        for (const ot of o.types) {
          const e = getTypeEff(ot, monTypes);
          if (e >= 2) score -= 1.5;
          else if (e <= 0.5 && e > 0) score += 0.5;
          else if (e === 0) score += 1.5;
        }
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
      const mt = pokemonData[normalize(m.name)]?.types ?? ["normal"];
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
      tailwind: "Tailwind doubles their Speed for 4 turns -- pressure the setter before it goes up",
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
    archetypeConfidence: archetypeInfo.confidence,
    archetypeReason: archetypeInfo.reason,
    predictedCores: coreDetection.cores,
    predictionBreakdown: predictionBreakdown,
    uncertaintyFlags: uncertaintyFlags,
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
    { name: "Charizard", ability: "Blaze / Drought (Mega)", item: "Charizardite Y", moves: ["Heat Wave","Weather Ball","Solar Beam","Protect"], shiny: false },
    { name: "Venusaur", ability: "Chlorophyll", item: "Focus Sash", moves: ["Energy Ball","Sludge Bomb","Sleep Powder","Protect"], shiny: false },
    { name: "Garchomp", ability: "Rough Skin", item: "Yache Berry", moves: ["Dragon Claw","Earthquake","Rock Slide","Protect"], shiny: false },
    { name: "Incineroar", ability: "Intimidate", item: "Sitrus Berry", moves: ["Throat Chop","Helping Hand","Fake Out","Parting Shot"], shiny: false },
    { name: "Gardevoir", ability: "Telepathy", item: "Choice Scarf", moves: ["Moonblast","Dazzling Gleam","Psychic","Icy Wind"], shiny: false },
    { name: "Milotic", ability: "Competitive", item: "Leftovers", moves: ["Scald","Ice Beam","Life Dew","Protect"], shiny: false },
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
  const [logEntry, setLogEntry] = useState(function() {
    const team = storage.get("ts_team_v4", getDefaultTeam());
    const teamNames = team.map(function(m) { return m.name; });
    return { myBring: teamNames, myLead: teamNames, theirBring:[], theirLead:[], result:"", notes:"" };
  });
  const [theme, setTheme] = useState(function() { return storage.get("ts_theme", "classic"); });
  const currentTheme = THEMES[theme] || THEMES.classic;
  const C = currentTheme;

  useEffect(function() {
    fetch(META_API)
      .then(function(r) { return r.json(); })
      .then(function(d) { setMetaData(d); setMetaStatus("live"); })
      .catch(function() { setMetaStatus("offline"); });
  }, []);
  
   useEffect(function() {
    // Clean up any particles from the previous theme
    document.querySelectorAll('.theme-particle').forEach(function(el) { el.remove(); });
    const body = document.body;
 
    if (theme === 'diamond') {
      // Snowflakes
      for (let i = 0; i < 28; i++) {
        const s = document.createElement('div');
        const sz = 1.5 + Math.random() * 3;
        s.className = 'diamond-snow theme-particle';
        s.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${7+Math.random()*10}s;animation-delay:${Math.random()*10}s;`;
        body.appendChild(s);
      }
      // Crystal gems
      for (let i = 0; i < 10; i++) {
        const g = document.createElement('div');
        const sz = 5 + Math.random() * 10;
        g.className = 'diamond-gem theme-particle';
        g.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s;`;
        body.appendChild(g);
      }
    }
 
    if (theme === 'pearl') {
      // Pearl orbs
      for (let i = 0; i < 14; i++) {
        const o = document.createElement('div');
        const sz = 4 + Math.random() * 10;
        o.className = 'pearl-orb theme-particle';
        o.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;box-shadow:0 0 ${sz*2}px rgba(200,120,216,0.5);animation-duration:${5+Math.random()*7}s;animation-delay:${Math.random()*6}s;`;
        body.appendChild(o);
      }
      // Spatial arcs
      const arcData = [
        { w:500, h:180, top:'25%', left:'65%', dur:12 },
        { w:360, h:130, top:'65%', left:'25%', dur:16 },
        { w:280, h:100, top:'45%', left:'50%', dur:9 },
      ];
      arcData.forEach(function(d) {
        const a = document.createElement('div');
        a.className = 'pearl-arc theme-particle';
        a.style.cssText = `width:${d.w}px;height:${d.h}px;top:${d.top};left:${d.left};animation-duration:${d.dur}s;`;
        body.appendChild(a);
      });
    }
 
    if (theme === 'platinum') {
      // Debris shards
      for (let i = 0; i < 18; i++) {
        const s = document.createElement('div');
        const w = 4 + Math.random() * 22;
        const h = 2 + Math.random() * 6;
        s.className = 'plat-shard theme-particle';
        s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${w}px;height:${h}px;transform:rotate(${Math.random()*360}deg);animation-duration:${4+Math.random()*8}s;animation-delay:${Math.random()*6}s;border-radius:${Math.random()>0.5?'0':'2px'};`;
        body.appendChild(s);
      }
      // Void rings
      const ringData = [
        { w:500, h:500, top:'50%', left:'50%', dur:22 },
        { w:340, h:340, top:'30%', left:'70%', dur:16 },
        { w:240, h:240, top:'70%', left:'30%', dur:12 },
      ];
      ringData.forEach(function(d) {
        const r = document.createElement('div');
        r.className = 'plat-ring theme-particle';
        r.style.cssText = `width:${d.w}px;height:${d.h}px;top:${d.top};left:${d.left};animation-duration:${d.dur}s;`;
        body.appendChild(r);
      });
    }
 
    if (theme === 'black') {
      // Right neon edge
      const edge = document.createElement('div');
      edge.className = 'black-neon-right theme-particle';
      body.appendChild(edge);
      // Lightning bolts
      const boltData = [
        { left:'18%', top:'8%',  h:90,  dur:5,  delay:0 },
        { left:'44%', top:'4%',  h:65,  dur:7,  delay:1.8 },
        { left:'70%', top:'12%', h:110, dur:4,  delay:3.2 },
        { left:'84%', top:'6%',  h:55,  dur:6,  delay:0.9 },
        { left:'32%', top:'18%', h:75,  dur:9,  delay:2.4 },
      ];
      boltData.forEach(function(d) {
        const b = document.createElement('div');
        b.className = 'black-bolt theme-particle';
        b.style.cssText = `left:${d.left};top:${d.top};height:${d.h}px;animation-duration:${d.dur}s;animation-delay:${d.delay}s;`;
        body.appendChild(b);
      });
    }
 
    if (theme === 'scarlet') {
      // Ember particles
      for (let i = 0; i < 24; i++) {
        const e = document.createElement('div');
        const sz = 2 + Math.random() * 5;
        const hue = 10 + Math.random() * 30; // orange-red range
        e.className = 'scarlet-ember theme-particle';
        e.style.cssText = `
          left:${10+Math.random()*80}%;
          bottom:${Math.random()*20}%;
          width:${sz}px;
          height:${sz}px;
          background:rgba(${200+Math.floor(Math.random()*55)},${40+Math.floor(Math.random()*80)},10,0.8);
          box-shadow:0 0 ${sz*3}px rgba(255,120,20,0.6);
          animation-duration:${4+Math.random()*8}s;
          animation-delay:${Math.random()*8}s;
        `;
        body.appendChild(e);
      }
    }
 
    if (theme === 'violet') {
      // Circuit traces (horizontal + vertical lines)
      for (let i = 0; i < 8; i++) {
        const t = document.createElement('div');
        const horiz = Math.random() > 0.5;
        t.className = 'violet-trace theme-particle';
        if (horiz) {
          t.style.cssText = `left:${Math.random()*60}%;top:${Math.random()*100}%;width:${40+Math.random()*120}px;height:1px;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s;`;
        } else {
          t.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*60}%;width:1px;height:${30+Math.random()*80}px;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s;`;
        }
        body.appendChild(t);
      }
      // Plasma orbs
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        const sz = 3 + Math.random() * 10;
        const isCyan = Math.random() > 0.5;
        p.className = 'violet-plasma theme-particle';
        p.style.cssText = `
          left:${Math.random()*100}%;
          top:${Math.random()*100}%;
          width:${sz}px;
          height:${sz}px;
          background:radial-gradient(circle at 35% 35%, ${isCyan ? 'rgba(64,160,255,0.9)' : 'rgba(176,96,255,0.9)'}, transparent);
          box-shadow:0 0 ${sz*2}px ${isCyan ? 'rgba(64,160,255,0.5)' : 'rgba(140,60,255,0.5)'};
          animation-duration:${4+Math.random()*7}s;
          animation-delay:${Math.random()*5}s;
        `;
        body.appendChild(p);
      }
    }
 
    // Cleanup on theme change
    return function() {
      document.querySelectorAll('.theme-particle').forEach(function(el) { el.remove(); });
    };
  }, [theme]);  

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
    const teamNames = myTeam.map(function(m) { return m.name; });
    setLogEntry({ myBring: teamNames, myLead: teamNames, theirBring:[], theirLead:[], result:"", notes:"" });
  }

  const wins = matchLog.filter(function(e) { return e.result === "W"; }).length;
  const losses = matchLog.filter(function(e) { return e.result === "L"; }).length;

  const st = {
    root: { minHeight:"100vh", background:C.bgGradient || C.bg, color:C.text, fontFamily:C.font },
    header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 0", flexWrap:"wrap", gap:10 },
    headerLeft: { display:"flex", alignItems:"center", gap:12 },
    title: { fontSize:22, fontWeight:900, letterSpacing:5, color:C.accent, lineHeight:1 },
    subtitle: { fontSize:9, color:C.muted, letterSpacing:2, marginTop:3 },
    tabBar: { display:"flex", borderBottom:"1px solid " + C.border, margin:"16px 0 0", overflowX:"auto" },
    tab: { background:"none", border:"none", borderBottom:"2px solid transparent", color:C.muted, padding:"10px 14px", cursor:"pointer", fontSize:10, letterSpacing:2, fontFamily:C.font, fontWeight:700, whiteSpace:"nowrap" },
    tabActive: { color:C.accent, borderBottom:"2px solid " + C.accent },
    content: { padding:16, maxWidth:860, margin:"0 auto" },
    card: { background:C.cardGradient || C.card, border:C.borderWidth + " solid " + (C.panelBorder || C.border), borderRadius:C.borderRadius, padding:16, marginBottom:14, boxShadow:C.boxShadow },
    cardTitle: { fontSize:11, letterSpacing:3, color:C.accent, fontWeight:700, marginBottom:4 },
    cardSub: { fontSize:10, color:C.muted, marginBottom:14 },
    label: { fontSize:9, color:C.muted, letterSpacing:2, fontWeight:700, marginBottom:4, marginTop:8, display:"block" },
    input: { display:"block", width:"100%", background:C.bg, border:"1px solid " + C.border, borderRadius:C.borderRadius, color:C.text, padding:"7px 10px", fontSize:11, fontFamily:C.font, outline:"none", boxSizing:"border-box" },
    btnPrimary: { background:C.accent, color:"#fff", border:"none", borderRadius:C.borderRadius, padding:"9px 18px", fontSize:10, letterSpacing:2, fontFamily:C.font, fontWeight:700, cursor:"pointer" },
    btnGhost: { background:"none", color:C.muted, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:"7px 14px", fontSize:10, letterSpacing:2, fontFamily:C.font, fontWeight:700, cursor:"pointer" },
    btnDis: { opacity:0.4, cursor:"not-allowed" },
  };

  const tabs = [["team","MY TEAM"],["match","ANALYSIS"],["speed","SPEED"],["damage","DAMAGE"],["log", "LOG" + (matchLog.length > 0 ? " (" + matchLog.length + ")" : "")]];

  return (
    <div style={st.root} className={"theme-" + theme}>
      <div style={st.header}>
        <div style={st.headerLeft}>
          <Pokeball C={C} />
          <div>
            <div style={st.title}>TEAM SCOUT</div>
            <div style={st.subtitle}>Pokemon Champions Season M-1</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <ThemeSelector theme={theme} setTheme={function(t) { setTheme(t); storage.set("ts_theme", t); }} C={C} />
          {matchLog.length > 0 && (
            <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, background:C.card, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:"4px 12px", display:"flex", gap:4 }}>
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
        {tab === "match" && <MatchTab myTeam={myTeam} opponent={opponent} setOpponent={setOpponent} runAnalysis={runAnalysis} analyzing={analyzing} analysis={analysis} metaStatus={metaStatus} logEntry={logEntry} setLogEntry={setLogEntry} logMatch={logMatch} st={st} C={C} />}
        {tab === "speed" && <SpeedTab myTeam={myTeam} st={st} C={C} />}
        {tab === "damage" && <DamageTab myTeam={myTeam} opponent={opponent} st={st} C={C} />}
        {tab === "log" && <LogTab matchLog={matchLog} clearLog={clearLog} wins={wins} losses={losses} st={st} C={C} />}
      </div>
    </div>
  );
}

function Sprite(props) {
  const src = getSpriteUrl(props.monKey, props.shiny);
  if (!src) return null;
  return <img src={src} alt={props.monKey} style={{ width: props.size || 48, height: props.size || 48, imageRendering:"pixelated", flexShrink:0 }} />;
}

function Pokeball(props) {
  const C = props.C || THEMES.classic;
  return (
    <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid " + C.border, overflow:"hidden", position:"relative", flexShrink:0 }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"50%", background:C.pokeballTop || C.accent }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:C.pokeballBottom || C.bg }} />
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:3, background:C.border, transform:"translateY(-50%)" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:C.bg, border:"2px solid " + C.border, zIndex:2 }} />
    </div>
  );
}

function StatusBadge(props) {
  const status = props.status;
  const updatedAt = props.updatedAt;
  const C = props.C;
  const base = { display:"flex", alignItems:"center", fontSize:9, letterSpacing:2, fontWeight:700, border:"1px solid", borderRadius:C.borderRadius, padding:"4px 10px", gap:6 };
  if (status === "loading") return <div style={Object.assign({}, base, { color:"#666", borderColor:"#222" })}>CONNECTING...</div>;
  if (status === "live") return (
    <div style={Object.assign({}, base, { color:C.green, borderColor:C.gdim, background:C.gdim })}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, flexShrink:0 }} />
      {"LIVE" + (updatedAt ? " " + new Date(updatedAt).toLocaleDateString() : "")}
    </div>
  );
  return <div style={Object.assign({}, base, { color:C.yellow, borderColor:C.faint, background:C.faint })}>OFFLINE</div>;
}

function ThemeSelector(props) {
  const theme = props.theme;
  const setTheme = props.setTheme;
  const C = props.C;
  const [open, setOpen] = useState(false);
  const current = THEMES[theme] || THEMES.classic;
  return (
    <div style={{ position:"relative" }}>
      <button
        style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", background:C.cardGradient || C.card, border:C.borderWidth + "px solid " + (C.panelBorder || C.border), borderRadius:C.borderRadius, padding:"6px 12px", cursor:"pointer", color:C.text, fontSize:9, fontFamily:C.font, fontWeight:700, letterSpacing:1, boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.06)" }}
        onClick={function() { setOpen(!open); }}
      >
        <span>{current.name}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"100%", right:0, marginTop:4, background:C.bg, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:4, zIndex:1000, minWidth:120, boxShadow:C.boxShadow, backdropFilter:"blur(12px)" }}>
          {Object.entries(THEMES).map(function([key, t]) {
            return (
              <button
                key={key}
                style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", width:"100%", background:theme === key ? C.faint : "transparent", border:"none", borderRadius:C.borderRadius - 2, padding:"8px 10px", cursor:"pointer", color:C.text, fontSize:9, fontFamily:"Arial, sans-serif", fontWeight:700, letterSpacing:1, lineHeight:"1.4", minHeight:32 }}
                onClick={function() { setTheme(key); setOpen(false); }}
              >
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChipSelector(props) {
  const players = props.players || [];
  const selected = props.selected || [];
  const setSelected = props.setSelected;
  const C = props.C;
  const label = props.label;
  const preSelected = props.preSelected || [];

  function togglePlayer(name) {
    if (selected.includes(name)) {
      setSelected(selected.filter(function(n) { return n !== name; }));
    } else {
      setSelected([].concat(selected, [name]));
    }
  }

  return (
    <div>
      <span style={{ fontSize:9, color:C.muted, letterSpacing:2, fontWeight:700, marginBottom:4, marginTop:8, display:"block" }}>{label}</span>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {players.filter(function(n) { return n && n.trim(); }).map(function(name) {
          const isSelected = selected.includes(name);
          return (
            <button
              key={name}
              onClick={function() { togglePlayer(name); }}
              style={{
                padding:"6px 12px",
                borderRadius:C.borderRadius,
                border:"1px solid " + (isSelected ? C.accent : C.border),
                background: isSelected ? C.accent + "22" : "transparent",
                color: isSelected ? C.accent : C.muted,
                fontSize:10,
                fontFamily:C.font,
                fontWeight:700,
                cursor:"pointer",
                transition:"all 0.2s",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const POKEMON_KEYS = championsKeys;
const titleCase = (k) => k.split("-").map(function(w) { return w ? w[0].toUpperCase() + w.slice(1) : w; }).join(" ");

function getSpriteUrl(monKey, shiny) {
  const data = pokemonData[monKey];
  if (!data) return null;
  if (shiny) {
    if (data.shinySprite) return data.shinySprite;
    if (data.sprite && data.sprite.includes("/sprites/pokemon/")) {
      return data.sprite.replace("/sprites/pokemon/", "/sprites/pokemon/shiny/");
    }
  }
  return data.sprite || null;
}

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
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.card, border:"1px solid " + C.border, borderRadius:C.borderRadius, zIndex:20, maxHeight:200, overflowY:"auto", marginTop:2 }}>
          {matches.map(function(k) {
            return (
              <button key={k} type="button" style={{ display:"block", width:"100%", textAlign:"left", padding:"7px 10px", background:"none", border:"none", borderBottom:"1px solid " + C.border, color:C.text, fontFamily:C.font, cursor:"pointer", fontSize:11 }}
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
  const monCard = { background:C.card, border:C.borderWidth + "px solid " + C.border, borderRadius:C.borderRadius, padding:14, boxShadow:C.boxShadow };
  const slot = { width:22, height:22, background:C.faint, border:"1px solid " + C.accent + "44", borderRadius:C.borderRadius - 4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.accent, fontWeight:700, flexShrink:0 };

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
                  : <>
                      <Sprite monKey={normalize(mon.name)} size={44} shiny={mon.shiny} />
                      <div style={{ fontSize:13, fontWeight:700, letterSpacing:1 }}>{mon.name || "Empty"}</div>
                    </>
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
                  <div style={{ marginBottom:10 }}>
                    <label style={{ display:"flex", alignItems:"center", gap:8, color:C.text, fontSize:10 }}>
                      <input type="checkbox" checked={draft[i].shiny || false} onChange={function(e) { upd(i, "shiny", e.target.checked); }} />
                      Use shiny sprite
                    </label>
                  </div>
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
  const myTeam = props.myTeam;
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
            <div style={Object.assign({}, st.card, { background:C.gdim, border:"1px solid " + C.green })}>
              <div style={{ fontSize:10, color:C.green, letterSpacing:3, fontWeight:700, marginBottom:4 }}>ARCHETYPE DETECTED</div>
              <div style={{ fontSize:14, fontWeight:900, color:C.text, letterSpacing:2 }}>{analysis.archetype.toUpperCase() + " TEAM"}</div>
              {analysis.leadNote && <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{"Expected lead: " + analysis.leadNote}</div>}
              {typeof analysis.archetypeConfidence === "number" && (
                <div style={{ fontSize:10, color:C.text, marginTop:6, letterSpacing:1.5 }}>
                  {"Confidence: " + Math.round(analysis.archetypeConfidence * 100) + "%"}
                </div>
              )}
              {analysis.predictedCores && analysis.predictedCores.length > 0 && (
                <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>
                  {"Core: " + analysis.predictedCores[0].note}
                </div>
              )}
            </div>
          )}

          {analysis.uncertaintyFlags && analysis.uncertaintyFlags.length > 0 && (
            <div style={Object.assign({}, st.card, { background:C.faint, border:"1px solid " + C.border })}>
              <div style={{ fontSize:10, color:C.accent, letterSpacing:3, fontWeight:700, marginBottom:4 }}>PREDICTION UNCERTAINTY</div>
              {analysis.uncertaintyFlags.map(function(flag, i) {
                return (
                  <div key={i} style={{ fontSize:10, color:C.text, marginBottom:3, lineHeight:1.4 }}>
                    {flag.reason}
                  </div>
                );
              })}
            </div>
          )}

          <div style={st.card}>
            <div style={st.cardTitle}>OPPONENT -- PREDICTED BRING</div>
            <div style={st.cardSub}>Ranked by usage + archetype leads. Highlighted = likely lead.</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10 }}>
              {analysis.opponentPrediction.map(function(pred, i) {
                const isLead = analysis.predictedLeads.some(function(l) { return l.key === pred.key; });
                return (
                  <div key={i} style={{ background: isLead ? C.gdim : C.bg, border: "1px solid " + (isLead ? C.green + "44" : C.border), borderRadius:C.borderRadius, padding:12 }}>
                    {isLead && <div style={{ fontSize:8, color:C.green, letterSpacing:1.5, fontWeight:700, background:"#061506", border:"1px solid #4caf5033", borderRadius:3, padding:"2px 6px", display:"inline-block", marginBottom:6 }}>LIKELY LEAD</div>}
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <Sprite monKey={pred.key} size={44} />
                      <div>
                        <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>{"#" + (i + 1) + " " + (pred.usageRate * 100).toFixed(0) + "%"}</div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{pred.name}</div>
                      </div>
                    </div>
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
                  <div key={i} style={{ background: i < 2 ? C.gdim : C.bg, border: "1px solid " + (i < 2 ? C.green + "44" : C.border), borderRadius:C.borderRadius, padding:14 }}>
                    <div style={{ fontSize:8, color: i < 2 ? C.green : C.muted, letterSpacing:1.5, fontWeight:700, marginBottom:6 }}>{i < 2 ? "LEAD " + (i + 1) : "BACK " + (i - 1)}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                      <Sprite monKey={pick.key} size={48} />
                      <div style={{ fontSize:15, fontWeight:900, letterSpacing:1 }}>{pick.name}</div>
                    </div>
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
                  <div key={i} style={{ background:C.faint, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:12, marginBottom:8 }}>
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
                  <div key={i} style={{ background:C.faint, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:12, marginBottom:8 }}>
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
            <div style={{ marginBottom:12 }}>
              <ChipSelector
                label="YOUR ACTUAL BRING (4 Pokemon)"
                players={myTeam.map(function(mon) { return mon.name; })}
                selected={logEntry.myBring}
                setSelected={function(selected) { setLogEntry(function(p) { return Object.assign({}, p, { myBring: selected }); }); }}
                C={C}
              />
            </div>
            <div style={{ marginBottom:12 }}>
              <ChipSelector
                label="YOUR ACTUAL LEAD (2 Pokemon)"
                players={myTeam.map(function(mon) { return mon.name; })}
                selected={logEntry.myLead}
                setSelected={function(selected) { setLogEntry(function(p) { return Object.assign({}, p, { myLead: selected }); }); }}
                C={C}
              />
            </div>
            <div style={{ marginBottom:12 }}>
              <ChipSelector
                label="THEIR ACTUAL BRING (4 Pokemon)"
                players={opponent}
                selected={logEntry.theirBring}
                setSelected={function(selected) { setLogEntry(function(p) { return Object.assign({}, p, { theirBring: selected }); }); }}
                C={C}
              />
            </div>
            <div style={{ marginBottom:12 }}>
              <ChipSelector
                label="THEIR ACTUAL LEAD (2 Pokemon)"
                players={opponent}
                selected={logEntry.theirLead}
                setSelected={function(selected) { setLogEntry(function(p) { return Object.assign({}, p, { theirLead: selected }); }); }}
                C={C}
              />
            </div>
            <span style={st.label}>RESULT</span>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              {["W","L"].map(function(r) {
                const active = logEntry.result === r;
                const activeStyle = r === "W"
                  ? { background:"#0a1a0a", color:C.green, borderColor:"#4caf5044" }
                  : { background:"#1a0a0a", color:C.accent, borderColor:"#e85d2f44" };
                return (
                  <button key={r} style={Object.assign({ flex:1, padding:10, fontSize:11, letterSpacing:2, fontFamily:C.font, fontWeight:700, cursor:"pointer", borderRadius:C.borderRadius, border:"1px solid " + C.border, background:"none", color:C.muted }, active ? activeStyle : {})}
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
  const myBase = pokemonData[myKey]?.stats?.speed ?? null;

  useEffect(function() {
    if (oppSearch.trim().length < 2) { setResults([]); return; }
    const q = normalize(oppSearch);
    const found = POKEMON_KEYS.filter(function(k) { return k.includes(q); })
      .sort(function(a, b) { if (a === q) return -1; if (b === q) return 1; return a.localeCompare(b); })
      .slice(0, 8);
    setResults(found);
  }, [oppSearch]);

  function selectOpp(key) { setOppMon({ key: key, base: pokemonData[key]?.stats?.speed ?? null }); setOppSearch(key.replace(/-/g, " ")); setResults([]); }

  // Speed tiers matching Pikalytics format
  function speedRows(base) {
    return [
      { label: "Base Speed", val: base },
      { label: "Max (Positive, 252 EV)", val: calcSpeed(base, 252, "positive") },
      { label: "Neutral + 32 EV", val: calcSpeed(base, 32, "neutral") },
      { label: "Neutral (252 EV)", val: calcSpeed(base, 252, "neutral") },
      { label: "Neutral (0 EV)", val: calcSpeed(base, 0, "neutral") },
      { label: "Max + Choice Scarf", val: Math.floor(calcSpeed(base, 252, "positive") * 1.5) },
      { label: "Neutral + 32 EV + Scarf", val: Math.floor(calcSpeed(base, 32, "neutral") * 1.5) },
      { label: "Tailwind (x2)", val: calcSpeed(base, 252, "positive") * 2 },
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
            const base = pokemonData[key]?.stats?.speed ?? null;
            return (
              <button key={i} style={{ background: myMon === m.name ? C.faint : C.bg, border: "1px solid " + (myMon === m.name ? C.accent : C.border), borderRadius:C.borderRadius, padding:"10px 12px", cursor:"pointer", textAlign:"left", color: myMon === m.name ? C.accent : C.text, fontFamily:C.font }}
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
            <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.card, border:"1px solid " + C.border, borderRadius:C.borderRadius, zIndex:10, maxHeight:200, overflowY:"auto" }}>
              {results.map(function(key) {
                return (
                  <button key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", padding:"8px 12px", background:"none", border:"none", borderBottom:"1px solid " + C.border, color:C.text, fontFamily:C.font, cursor:"pointer", fontSize:11, textTransform:"capitalize" }}
                    onClick={function() { selectOpp(key); }}>
                    <span>{key.replace(/-/g, " ")}</span>
                    <span style={{ color:C.muted, fontSize:10 }}>{"Base " + (pokemonData[key]?.stats?.speed ?? "?")}</span>
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
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, padding:12, background:C.bg, borderRadius:C.borderRadius }}>
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

function DamageTab(props) {
  const myTeam = props.myTeam;
  const opponent = props.opponent || [];
  const st = props.st;
  const C = props.C;
  const [attacker, setAttacker] = useState("");
  const [defender, setDefender] = useState("");
  const [move, setMove] = useState("");
  const [attackerAbility, setAttackerAbility] = useState("");
  const [defenderAbility, setDefenderAbility] = useState("");
  const [results, setResults] = useState(null);

  const attKey = normalize(attacker);
  const defKey = normalize(defender);
  const attData = pokemonData[attKey];
  const defData = pokemonData[defKey];
  const moveData = movesData[Object.keys(movesData).find(function(k) { return movesData[k]?.name?.toLowerCase() === move.toLowerCase(); })];

  const opponentRoster = opponent.filter(function(m) { return m.trim(); });
  const attackerMon = myTeam.find(function(m) { return normalize(m.name) === attKey; });

  // Get moves for selected attacker from the current team entry
  const attackerMoves = attackerMon?.moves?.filter(Boolean).map(function(m) { return movesByName[normalize(m)] || { name:m, type:"unknown", bp:0, category:"unknown" }; }) || [];

  // Calculate damage
  function calcDamage() {
    if (!attData?.stats || !defData?.stats || !moveData?.bp) return null;

    const level = 50;
    const power = moveData.bp;
    const isSpecial = moveData.category === "special";
    const attack = isSpecial ? attData.stats["special-attack"] : attData.stats.attack;
    const defense = isSpecial ? defData.stats["special-defense"] : defData.stats.defense;

    // STAB
    const stab = attData.types?.includes(moveData.type) ? 1.5 : 1;

    // Type effectiveness (handle both types)
    const typeEff = getTypeEff(moveData.type, defData.types || ["normal"]);

    // Base damage formula
    const base = Math.floor(((2 * level / 5 + 2) * power * attack / defense / 50 + 2));

    // Min (0 IV, 0 EV, neutral nature) and Max (31 IV, 252 EV, positive nature)
    const min = Math.floor(base * 0.85 * stab * typeEff);
    const max = Math.floor(base * 1.0 * stab * typeEff);

    // Defender HP at level 50 with a range for IV/EV variation
    const defHpMin = Math.floor(((2 * defData.stats.hp + 0 + 0) * level) / 100) + level + 10;
    const defHpMax = Math.floor(((2 * defData.stats.hp + 31 + 252 / 4) * level) / 100) + level + 10;
    const minPct = Math.round(min / defHpMax * 100);
    const maxPct = Math.round(max / defHpMin * 100);
    const minKills = min >= defHpMax;
    const maxKills = max >= defHpMin;
    const min2hko = min * 2 >= defHpMax;
    const max2hko = max * 2 >= defHpMin;

    return { min, max, minPct, maxPct, stab, typeEff, power, attack, defense, defHpMin, defHpMax, minKills, maxKills, min2hko, max2hko };
  }

  useEffect(function() {
    if (attacker && defender && move) {
      setResults(calcDamage());
    } else {
      setResults(null);
    }
  }, [attacker, defender, move, attData, defData, moveData]);

  return (
    <div>
      <div style={st.card}>
        <div style={st.cardTitle}>DAMAGE CALCULATOR</div>
        <div style={st.cardSub}>Select attacker, move, and defender to calculate damage</div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          <div>
            <span style={st.label}>ATTACKER</span>
            <select style={st.input} value={attacker} onChange={function(e) { setAttacker(e.target.value); setMove(""); }}>
              <option value="">Select Pokemon...</option>
              {myTeam.filter(function(m) { return m.name.trim(); }).map(function(m, i) {
                return <option key={i} value={m.name}>{m.name}</option>;
              })}
            </select>
          </div>
          <div>
            <span style={st.label}>DEFENDER</span>
            <select style={st.input} value={defender} onChange={function(e) { setDefender(e.target.value); }}>
              <option value="">Select Pokemon...</option>
              {opponentRoster.map(function(name, i) {
                return <option key={i} value={name}>{name}</option>;
              })}
            </select>
          </div>
        </div>

        {attacker && (
          <div style={{ marginBottom:16 }}>
            <span style={st.label}>MOVE</span>
            <select style={st.input} value={move} onChange={function(e) { setMove(e.target.value); }}>
              <option value="">Select move...</option>
              {attackerMoves.map(function(m, i) {
                return <option key={i} value={m.name}>{m.name} ({m.type} - {m.bp} BP)</option>;
              })}
            </select>
          </div>
        )}

        {results && (
          <div style={{ marginTop:20, padding:16, background:C.faint, borderRadius:C.borderRadius }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>DAMAGE RANGE</div>
                <div style={{ fontSize:24, fontWeight:900, color:C.text }}>{results.min} - {results.max}</div>
              </div>
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>% OF DEFENDER HP</div>
                <div style={{ fontSize:24, fontWeight:900, color:C.text }}>{results.minPct}% - {results.maxPct}%</div>
                <div style={{ fontSize:9, color:C.muted, marginTop:4 }}>Based on {results.defHpMin} - {results.defHpMax} HP</div>
              </div>
            </div>

            <div style={{ fontSize:10, color:C.muted, borderTop:"1px solid " + C.border, paddingTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span>Attack Stat:</span>
                <span style={{ color:C.text }}>{results.attack}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span>Defense Stat:</span>
                <span style={{ color:C.text }}>{results.defense}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span>Defender HP:</span>
                <span style={{ color:C.text }}>{results.defHpMin} - {results.defHpMax}</span>
              </div>
            </div>

            <div style={{ marginTop:16, padding:12, background:C.card, borderRadius:C.borderRadius }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:8, color:C.text }}>KO PREDICTIONS</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div style={{ padding:8, background:results.maxKills ? C.green : C.faint, borderRadius:C.borderRadius, textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:results.maxKills ? "#fff" : C.muted }}>{results.maxKills ? "YES" : "NO"}</div>
                  <div style={{ fontSize:9, color:results.maxKills ? "#fff" : C.muted }}>Max can OHKO</div>
                </div>
                <div style={{ padding:8, background:results.minKills ? C.green : C.faint, borderRadius:C.borderRadius, textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:results.minKills ? "#fff" : C.muted }}>{results.minKills ? "YES" : "NO"}</div>
                  <div style={{ fontSize:9, color:results.minKills ? "#fff" : C.muted }}>Min can OHKO</div>
                </div>
                <div style={{ padding:8, background:results.max2hko ? C.blue : C.faint, borderRadius:C.borderRadius, textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:results.max2hko ? "#fff" : C.muted }}>{results.max2hko ? "YES" : "NO"}</div>
                  <div style={{ fontSize:9, color:results.max2hko ? "#fff" : C.muted }}>Max can 2HKO</div>
                </div>
                <div style={{ padding:8, background:results.min2hko ? C.blue : C.faint, borderRadius:C.borderRadius, textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:results.min2hko ? "#fff" : C.muted }}>{results.min2hko ? "YES" : "NO"}</div>
                  <div style={{ fontSize:9, color:results.min2hko ? "#fff" : C.muted }}>Min can 2HKO</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!results && attacker && defender && move && (
          <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:11 }}>
            No damage data available for this move
          </div>
        )}
      </div>
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
              <LR label="THEIR ACTUAL BRING" value={(Array.isArray(entry.theirActualBring) ? entry.theirActualBring : (entry.theirActualBring ? [entry.theirActualBring] : [])).join(", ") || "--"} flex bright={!!(Array.isArray(entry.theirActualBring) ? entry.theirActualBring.length : entry.theirActualBring)} C={C} />
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <LR label="PREDICTED LEAD" value={(entry.opponentPredictedLead || []).join(", ")} flex C={C} />
              <LR label="THEIR ACTUAL LEAD" value={(Array.isArray(entry.theirActualLead) ? entry.theirActualLead : (entry.theirActualLead ? [entry.theirActualLead] : [])).join(", ") || "--"} flex bright={!!(Array.isArray(entry.theirActualLead) ? entry.theirActualLead.length : entry.theirActualLead)} C={C} />
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <LR label="YOUR RECOMMENDED" value={(entry.yourRecommended || []).join(", ")} flex C={C} />
              <LR label="YOUR ACTUAL BRING" value={(Array.isArray(entry.myActualBring) ? entry.myActualBring : (entry.myActualBring ? [entry.myActualBring] : [])).join(", ") || "--"} flex bright={!!(Array.isArray(entry.myActualBring) ? entry.myActualBring.length : entry.myActualBring)} C={C} />
            </div>
            {(entry.myActualLead ? (Array.isArray(entry.myActualLead) ? entry.myActualLead.length > 0 : true) : false) && <LR label="YOUR ACTUAL LEAD" value={(Array.isArray(entry.myActualLead) ? entry.myActualLead : [entry.myActualLead]).join(", ")} bright C={C} />}
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
