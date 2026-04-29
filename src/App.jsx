import { useState, useEffect, useCallback } from "react";
import typeChartData from "./data/typeChart.json";
import pokemonData from "./data/pokemon.json";
import movesData from "./data/moves.json";
import itemsData from "./data/items.json";
import abilitiesData from "./data/abilities.json";
import championsKeys from "./data/champions.json";

const THEMES = {
  classic: {
    name: "Classic",
    bg: "#09090b", card: "#0f1014", border: "#1c1f2a", accent: "#e85d2f",
    green: "#4caf50", text: "#e2e2e2", muted: "#5a6070", faint: "#14161e",
    yellow: "#f59e0b", blue: "#60a5fa", gdim: "#0a1a0a",
    borderRadius: 8, borderWidth: 1, boxShadow: "none",
    pokeballTop: "#e85d2f", pokeballBottom: "#111",
    accentIcon: "⚪", font: "Courier New, monospace",
  },
  diamond: {
    name: "Diamond",
    bg: "#0a0e1a", card: "#111827", border: "#1e3a5f", accent: "#60a5fa",
    green: "#34d399", text: "#e0f2fe", muted: "#64748b", faint: "#0f1a2a",
    yellow: "#fbbf24", blue: "#38bdf8", gdim: "#0a1a2a",
    borderRadius: 4, borderWidth: 2, boxShadow: "0 0 12px rgba(96,165,250,0.3)",
    pokeballTop: "#60a5fa", pokeballBottom: "#1e3a5f",
    accentIcon: "❄️", font: "Georgia, serif",
  },
  pearl: {
    name: "Pearl",
    bg: "#1a0f1a", card: "#241319", border: "#3d1f2e", accent: "#f472b6",
    green: "#f472b6", text: "#fce7f3", muted: "#db2777", faint: "#2a1520",
    yellow: "#f9a8d4", blue: "#f472b6", gdim: "#2a1520",
    borderRadius: 12, borderWidth: 1, boxShadow: "0 0 12px rgba(244,114,182,0.3)",
    pokeballTop: "#f472b6", pokeballBottom: "#3d1f2e",
    accentIcon: "💗", font: "Garamond, serif",
  },
  violet: {
    name: "Violet",
    bg: "#120819", card: "#1a0f24", border: "#3b1f5c", accent: "#a855f7",
    green: "#22d3ee", text: "#f5d0fe", muted: "#8b5cf6", faint: "#1a0f2a",
    yellow: "#c4b5fd", blue: "#22d3ee", gdim: "#1a0f2a",
    borderRadius: 16, borderWidth: 1, boxShadow: "0 0 12px rgba(168,85,247,0.3)",
    pokeballTop: "#a855f7", pokeballBottom: "#3b1f5c",
    accentIcon: "⭐", font: "Verdana, sans-serif",
  },
  scarlet: {
    name: "Scarlet",
    bg: "#1a0a0a", card: "#2a0f0f", border: "#5c1f1f", accent: "#f87171",
    green: "#4ade80", text: "#fee2e2", muted: "#ef4444", faint: "#2a0f0f",
    yellow: "#fb923c", blue: "#f87171", gdim: "#2a0f0f",
    borderRadius: 2, borderWidth: 3, boxShadow: "0 0 12px rgba(248,113,113,0.3)",
    pokeballTop: "#f87171", pokeballBottom: "#5c1f1f",
    accentIcon: "🔥", font: "Impact, sans-serif",
  },
};

// Speed formula matching Pikalytics (level 50)
const calcSpeed = (base, ev = 252, nature = "neutral") => {
  const raw = Math.floor((2 * base + 31 + ev) * 50 / 100 + 5);
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
      topMoves: meta && meta.top_moves ? meta.top_moves.slice(0, 4).map((m) => movesData[m.id]?.name ?? null).filter(Boolean) : [],
      topItem: meta && meta.top_items && meta.top_items[0] ? (itemsData[meta.top_items[0].id] ?? null) : null,
      topAbility: meta && meta.top_abilities && meta.top_abilities[0] ? (abilitiesData[meta.top_abilities[0].id] ?? null) : null,
      types: pokemonData[key]?.types ?? ["normal"],
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
  const [theme, setTheme] = useState(function() { return storage.get("ts_theme", "classic"); });
  const currentTheme = THEMES[theme] || THEMES.classic;
  const C = currentTheme;

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

  const st = {
    root: { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:C.font },
    header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 0", flexWrap:"wrap", gap:10 },
    headerLeft: { display:"flex", alignItems:"center", gap:12 },
    title: { fontSize:22, fontWeight:900, letterSpacing:5, color:C.accent, lineHeight:1 },
    subtitle: { fontSize:9, color:C.muted, letterSpacing:2, marginTop:3 },
    tabBar: { display:"flex", borderBottom:"1px solid " + C.border, margin:"16px 0 0", overflowX:"auto" },
    tab: { background:"none", border:"none", borderBottom:"2px solid transparent", color:C.muted, padding:"10px 14px", cursor:"pointer", fontSize:10, letterSpacing:2, fontFamily:C.font, fontWeight:700, whiteSpace:"nowrap" },
    tabActive: { color:C.accent, borderBottom:"2px solid " + C.accent },
    content: { padding:16, maxWidth:860, margin:"0 auto" },
    card: { background:C.card, border:C.borderWidth + " solid " + C.border, borderRadius:C.borderRadius, padding:16, marginBottom:14, boxShadow:C.boxShadow },
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
    <div style={st.root}>
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
        {tab === "match" && <MatchTab opponent={opponent} setOpponent={setOpponent} runAnalysis={runAnalysis} analyzing={analyzing} analysis={analysis} metaStatus={metaStatus} logEntry={logEntry} setLogEntry={setLogEntry} logMatch={logMatch} st={st} C={C} />}
        {tab === "speed" && <SpeedTab myTeam={myTeam} st={st} C={C} />}
        {tab === "damage" && <DamageTab myTeam={myTeam} opponent={opponent} st={st} C={C} />}
        {tab === "log" && <LogTab matchLog={matchLog} clearLog={clearLog} wins={wins} losses={losses} st={st} C={C} />}
      </div>
    </div>
  );
}

function Sprite(props) {
  const src = pokemonData[props.monKey]?.sprite;
  if (!src) return null;
  return <img src={src} alt={props.monKey} style={{ width: props.size || 48, height: props.size || 48, imageRendering:"pixelated", flexShrink:0 }} />;
}

function Pokeball(props) {
  const C = props.C || THEMES.classic;
  return (
    <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid " + C.border, overflow:"hidden", position:"relative", flexShrink:0 }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"50%", background:C.pokeballTop }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:C.pokeballBottom }} />
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
        style={{ display:"flex", alignItems:"center", gap:6, background:C.card, border:C.borderWidth + "px solid " + C.border, borderRadius:C.borderRadius, padding:"4px 10px", cursor:"pointer", color:C.text, fontSize:9, fontFamily:C.font, fontWeight:700, letterSpacing:1 }}
        onClick={function() { setOpen(!open); }}
      >
        <span>{current.accentIcon}</span>
        <span>{current.name}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"100%", right:0, marginTop:4, background:C.card, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:4, zIndex:100, minWidth:120, boxShadow:C.boxShadow }}>
          {Object.entries(THEMES).map(function([key, t]) {
            return (
              <button
                key={key}
                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:theme === key ? C.faint : "transparent", border:"none", borderRadius:C.borderRadius - 2, padding:"6px 10px", cursor:"pointer", color:C.text, fontSize:9, fontFamily:C.font, fontWeight:700, letterSpacing:1 }}
                onClick={function() { setTheme(key); setOpen(false); }}
              >
                <span>{t.accentIcon}</span>
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const POKEMON_KEYS = championsKeys;
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
                      <Sprite monKey={normalize(mon.name)} size={44} />
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
            <div style={Object.assign({}, st.card, { background:C.gdim, border:"1px solid " + C.green })}>
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
  const myBase = pokemonData[myKey]?.speed ?? null;

  useEffect(function() {
    if (oppSearch.trim().length < 2) { setResults([]); return; }
    const q = normalize(oppSearch);
    const found = POKEMON_KEYS.filter(function(k) { return k.includes(q); })
      .sort(function(a, b) { if (a === q) return -1; if (b === q) return 1; return a.localeCompare(b); })
      .slice(0, 8);
    setResults(found);
  }, [oppSearch]);

  function selectOpp(key) { setOppMon({ key: key, base: pokemonData[key]?.speed ?? null }); setOppSearch(key.replace(/-/g, " ")); setResults([]); }

  // Speed tiers matching Pikalytics format
  function speedRows(base) {
    return [
      { label: "Max (Positive, 252 EV)", val: calcSpeed(base, 252, "positive") },
      { label: "Neutral, 252 EV", val: calcSpeed(base, 252, "neutral") },
      { label: "Negative, 252 EV", val: calcSpeed(base, 252, "negative") },
      { label: "Neutral, 0 EV", val: calcSpeed(base, 0, "neutral") },
      { label: "Choice Scarf (+)", val: Math.floor(calcSpeed(base, 252, "positive") * 1.5) },
      { label: "Choice Scarf (-)", val: Math.floor(calcSpeed(base, 252, "negative") * 1.5) },
      { label: "Tailwind (x2)", val: calcSpeed(base, 252, "positive") * 2 },
      { label: "Rain + Swift Swim", val: calcSpeed(base, 252, "positive") * 2 },
      { label: "Sun + Chlorophyll", val: calcSpeed(base, 252, "positive") * 2 },
      { label: "Sand + Sand Rush", val: calcSpeed(base, 252, "positive") * 2 },
      { label: "Scarf + Swift Swim", val: Math.floor(calcSpeed(base, 252, "positive") * 1.5 * 2) },
      { label: "Scarf + Chlorophyll", val: Math.floor(calcSpeed(base, 252, "positive") * 1.5 * 2) },
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
            const base = pokemonData[key]?.speed ?? null;
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
                    <span style={{ color:C.muted, fontSize:10 }}>{"Base " + pokemonData[key]?.speed}</span>
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

    // Type effectiveness
    const typeEff = typeChartData[moveData.type]?.[defData.types?.[0]] ?? 1;

    // Base damage formula
    const base = Math.floor(((2 * level / 5 + 2) * power * attack / defense / 50 + 2));

    // Min (0 IV, 0 EV, neutral nature) and Max (31 IV, 252 EV, positive nature)
    const min = Math.floor(base * 0.85 * stab * typeEff);
    const max = Math.floor(base * 1.0 * stab * typeEff);

    // HP percentage (assuming 100 base HP for simplicity)
    const hp100 = 100;
    const minPct = Math.round(min / hp100);
    const maxPct = Math.round(max / hp100);

    // KO chances (assuming ~100-200 HP for typical Pokemon at level 50)
    const defHp = defData.stats.hp;
    const minKills = min >= defHp;
    const maxKills = max >= defHp;
    const min2hko = min * 2 >= defHp;
    const max2hko = max * 2 >= defHp;

    return { min, max, minPct, maxPct, stab, typeEff, power, attack, defense, defHp, minKills, maxKills, min2hko, max2hko };
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
              </div>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
              <span style={{ padding:"4px 8px", background:results.stab > 1 ? C.green : C.card, color:results.stab > 1 ? "#fff" : C.muted, borderRadius:C.borderRadius, fontSize:10 }}>
                STAB {results.stab > 1 ? "✓" : "✗"}
              </span>
              <span style={{ padding:"4px 8px", background:results.typeEff > 1 ? C.green : results.typeEff < 1 ? C.yellow : C.card, color:results.typeEff > 1 ? "#fff" : results.typeEff < 1 ? "#000" : C.muted, borderRadius:C.borderRadius, fontSize:10 }}>
                {results.typeEff}x {results.typeEff > 1 ? "Super" : results.typeEff < 1 ? "Resist" : "Neutral"}
              </span>
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
                <span style={{ color:C.text }}>{results.defHp}</span>
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
