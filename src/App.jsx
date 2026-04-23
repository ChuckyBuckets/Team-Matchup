import { useState, useEffect, useCallback } from "react";

// ============================================================
// TYPE CHART & MATCHUP ENGINE
// ============================================================
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
  incineroar:["fire","dark"],sneasler:["fighting","poison"],garchomp:["dragon","ground"],
  sinistcha:["grass","ghost"],kingambit:["dark","steel"],basculegion:["water","ghost"],
  "floette-eternal":["fairy"],charizard:["fire","flying"],"rotom-wash":["electric","water"],
  whimsicott:["grass","fairy"],aerodactyl:["rock","flying"],pelipper:["water","flying"],
  tyranitar:["rock","dark"],archaludon:["steel","dragon"],dragonite:["dragon","flying"],
  farigiraf:["normal","psychic"],venusaur:["grass","poison"],gengar:["ghost","poison"],
  froslass:["ice","ghost"],milotic:["water"],maushold:["normal"],corviknight:["steel","flying"],
  excadrill:["steel","ground"],delphox:["fire","psychic"],gardevoir:["psychic","fairy"],
  aegislash:["steel","ghost"],talonflame:["fire","flying"],"kommo-o":["dragon","fighting"],
  meganium:["grass"],primarina:["water","fairy"],torkoal:["fire"],palafin:["water"],
  politoed:["water"],glimmora:["rock","poison"],"ninetales-alola":["ice","fairy"],
  clefable:["fairy"],scizor:["bug","steel"],hatterene:["psychic","fairy"],
  weavile:["dark","ice"],dragapult:["dragon","ghost"],hydreigon:["dark","dragon"],
  sylveon:["fairy"],mimikyu:["ghost","fairy"],mamoswine:["ice","ground"],
  gyarados:["water","flying"],hawlucha:["fighting","flying"],greninja:["water","dark"],
  "hisuian-zoroark":["normal","ghost"],medicham:["fighting","psychic"],
  kangaskhan:["normal"],lopunny:["normal"],gallade:["psychic","fighting"],
  blastoise:["water"],feraligatr:["water"],chesnaught:["grass","fighting"],
  victreebel:["grass","poison"],volcarona:["bug","fire"],skeledirge:["fire","ghost"],
  scovillain:["grass","fire"],meowscarada:["grass","dark"],"meowstic-f":["psychic"],
  crabominable:["fighting","ice"],aggron:["steel","rock"],orthworm:["steel"],
  krookodile:["ground","dark"],
};

const MOVE_NAMES = {
  252:"Fake Out",575:"Parting Shot",394:"Flare Blitz",675:"Throat Chop",663:"Darkest Lariat",
  182:"Protect",261:"Will-O-Wisp",270:"Taunt",269:"Helping Hand",555:"Snarl",370:"Close Combat",
  827:"Dire Claw",811:"Coaching",317:"Rock Tomb",157:"Rock Slide",337:"Dragon Claw",89:"Earthquake",
  707:"Stomping Tantrum",14:"Swords Dance",444:"Poison Jab",398:"Iron Head",442:"Iron Defense",
  523:"Bulldoze",902:"Matcha Gotcha",476:"Rage Powder",433:"Trick Room",791:"Life Dew",
  668:"Imprison",247:"Shadow Ball",286:"Calm Mind",347:"Dazzling Gleam",503:"Scald",196:"Icy Wind",
  58:"Ice Beam",105:"Recover",330:"Muddy Water",266:"Follow Me",162:"Super Fang",
  413:"Brave Bird",366:"Tailwind",814:"Dual Wingbeat",469:"Roost",542:"Hurricane",311:"Weather Ball",
  85:"Thunderbolt",521:"Volt Switch",527:"Hydro Pump",271:"Thunder Wave",
  905:"Electro Shot",430:"Flash Cannon",434:"Draco Meteor",406:"Aura Sphere",396:"Dragon Pulse",
  854:"Last Respects",834:"Wave Crash",453:"Aqua Jet",812:"Flip Turn",605:"Moonblast",
  585:"Dazzling Gleam",577:"Heal Pulse",617:"Misty Terrain",94:"Psychic",
  257:"Heat Wave",76:"Solar Beam",403:"Air Slash",315:"Hyper Voice",349:"Fire Blast",
  188:"Sleep Powder",79:"Sludge Bomb",437:"Grass Knot",414:"Energy Ball",412:"Giga Drain",
  73:"Leech Seed",284:"Eruption",304:"Moonblast",389:"Sucker Punch",869:"Kowtow Cleave",
  67:"Low Kick",59:"Blizzard",694:"Aurora Veil",164:"Substitute",282:"Crunch",8:"Ice Punch",
  242:"Extreme Speed",667:"Smart Strike",691:"Clanging Scales",775:"Close Combat",
  857:"Jet Punch",114:"Haze",195:"Perish Song",227:"Encore",313:"Facade",
  418:"Bullet Punch",450:"Bug Bite",888:"Expanding Force",917:"Rising Voltage",492:"Stored Power",
};

const ITEM_NAMES = {
  135:"Sitrus Berry",166:"Chople Berry",168:"Shuca Berry",211:"Leftovers",134:"Lum Berry",
  162:"Mental Herb",191:"White Herb",217:"Black Glasses",252:"Focus Sash",264:"Choice Scarf",
  214:"Yache Berry",174:"Haban Berry",165:"Roseli Berry",190:"Choice Band",220:"Choice Specs",
  219:"Life Orb",194:"Assault Vest",226:"Charcoal",224:"Air Balloon",175:"Occa Berry",
  173:"Colbur Berry",169:"Kasib Berry",2579:"Floettite",717:"Charizardite Y",699:"Charizardite X",
  708:"Tyranitarite",2566:"Froslassite",2562:"Dragon Fang",227:"Wide Lens",228:"Zoom Lens",
  223:"Icy Rock",221:"Quick Claw",163:"Power Herb",2563:"Meganiumite",2576:"Delphoxite",
  695:"Gengarite",696:"Gardevoirite",2570:"Excadrillite",2105:"Fairy Feather",289:"Loaded Dice",
};

const ABILITY_NAMES = {
  22:"Intimidate",66:"Blaze",84:"Unburden",143:"Poison Touch",46:"Pressure",24:"Rough Skin",
  8:"Sand Veil",159:"Sand Force",45:"Sand Stream",299:"Hospitality",85:"Heatproof",128:"Defiant",
  293:"Supreme Overlord",2:"Drizzle",51:"Keen Eye",44:"Rain Dish",127:"Unnerve",69:"Rock Head",
  181:"Rattled",26:"Levitate",158:"Prankster",34:"Chlorophyll",65:"Overgrow",47:"Effect Spore",
  130:"Cursed Body",23:"Shadow Tag",81:"Snow Cloak",117:"Snow Warning",172:"Competitive",
  63:"Marvel Scale",56:"Cute Charm",132:"Friend Guard",101:"Technician",
  91:"Adaptability",33:"Swift Swim",104:"Motor Drive",140:"Telepathy",36:"Trace",182:"Pixilate",
  28:"Synchronize",176:"Stance Change",177:"Gale Wings",49:"Flame Body",43:"Bulletproof",
  142:"Soundproof",171:"Overcoat",146:"Sand Rush",192:"Stamina",5:"Sturdy",
  242:"Cloud Nine",70:"Drought",73:"Shell Armor",94:"Solar Power",102:"Thick Fat",
  204:"Liquid Voice",67:"Damp",295:"Toxic Debris",109:"Magic Guard",98:"Magic Bounce",
  156:"Aroma Veil",278:"Zero to Hero",39:"Hustle",136:"Multiscale",296:"Armor Tail",166:"Fairy Aura",
};

const resolveName = (id, map) => map[id] || null;
const normalize = s => s.toLowerCase().trim().replace(/[^a-z0-9-]/g,"").replace(/\s+/g,"-");

const getTypeEffectiveness = (moveType, defenderTypes) => {
  let mult = 1;
  for (const dt of defenderTypes) {
    mult *= ((TYPE_CHART[moveType]||{})[dt] !== undefined ? (TYPE_CHART[moveType]||{})[dt] : 1);
  }
  return mult;
};

const META_API = "https://eurekaffeine.github.io/pokemon-champions-scraper/battle_meta.json";

function getDefaultTeam() {
  return [
    {name:"Charizard",ability:"Blaze → Drought (Mega)",item:"Charizardite Y",moves:["Heat Wave","Weather Ball","Solar Beam","Protect"]},
    {name:"Venusaur",ability:"Chlorophyll",item:"Focus Sash",moves:["Energy Ball","Sludge Bomb","Sleep Powder","Protect"]},
    {name:"Garchomp",ability:"Rough Skin",item:"Yache Berry",moves:["Dragon Claw","Earthquake","Rock Slide","Protect"]},
    {name:"Incineroar",ability:"Intimidate",item:"Sitrus Berry",moves:["Throat Chop","Helping Hand","Fake Out","Parting Shot"]},
    {name:"Gardevoir",ability:"Telepathy",item:"Choice Scarf",moves:["Moonblast","Dazzling Gleam","Psychic","Icy Wind"]},
    {name:"Milotic",ability:"Competitive",item:"Leftovers",moves:["Scald","Ice Beam","Life Dew","Protect"]},
  ];
}

// ============================================================
// STORAGE — uses localStorage in real browser
// ============================================================
const storage = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

// ============================================================
// ANALYSIS ENGINE
// ============================================================
function analyzeMatchup(opponentNames, myTeam, metaData) {
  const opponentPrediction = opponentNames.map(name => {
    const key = normalize(name);
    const metaEntry = metaData?.pokemon_usage?.find(p => normalize(p.name) === key);
    return {
      name, key,
      usageRate: metaEntry?.usage_rate || 0.03,
      topMoves: (metaEntry?.top_moves||[]).slice(0,4).map(m=>resolveName(m.id,MOVE_NAMES)).filter(Boolean),
      topItem: metaEntry?.top_items?.[0] ? resolveName(metaEntry.top_items[0].id,ITEM_NAMES) : null,
      topAbility: metaEntry?.top_abilities?.[0] ? resolveName(metaEntry.top_abilities[0].id,ABILITY_NAMES) : null,
      types: POKEMON_TYPES[key]||["normal"],
    };
  });

  const byUsage = [...opponentPrediction].sort((a,b) => b.usageRate - a.usageRate);
  const predictedBring = byUsage.slice(0,4);

  const myScored = myTeam.filter(m=>m.name.trim()).map(mon => {
    const monKey = normalize(mon.name);
    const monTypes = POKEMON_TYPES[monKey]||["normal"];
    let score = 0;
    const reasons = [];

    for (const opp of predictedBring) {
      for (const mt of monTypes) {
        const eff = getTypeEffectiveness(mt, opp.types);
        if (eff >= 2) { score += 2; reasons.push(`SE vs ${opp.name}`); }
        else if (eff === 0) score -= 1;
      }
      for (const ot of opp.types) {
        const eff = getTypeEffectiveness(ot, monTypes);
        if (eff >= 2) score -= 1.5;
        else if (eff <= 0.5 && eff > 0) score += 0.5;
        else if (eff === 0) score += 1.5;
      }
    }

    const ab = (mon.ability||"").toLowerCase();
    const moves = (mon.moves||[]).map(m=>m.toLowerCase());
    if (ab.includes("intimidate")) { score+=3; reasons.push("Intimidate both opponents"); }
    if (ab.includes("competitive") && predictedBring.some(p=>(p.topAbility||"").includes("Intimidate"))) { score+=2.5; reasons.push("Free +2 SpA from Intimidate"); }
    if (ab.includes("drought")) { score+=3; reasons.push("Sets Sun"); }
    if (ab.includes("chlorophyll")) { score+=2; reasons.push("Chlorophyll speed under Sun"); }
    if (ab.includes("telepathy") && myTeam.some(m=>(m.moves||[]).some(mv=>mv.toLowerCase().includes("earthquake")))) { score+=1.5; reasons.push("Safe with Earthquake"); }
    if (ab.includes("multiscale")) { score+=1; reasons.push("Multiscale survives first hit"); }
    if (moves.includes("fake out")) { score+=2.5; reasons.push("Fake Out flinch turn 1"); }
    if (moves.includes("tailwind")) { score+=2; reasons.push("Tailwind speed control"); }
    if (moves.some(m=>m.includes("parting shot"))) { score+=2; reasons.push("Parting Shot pivot"); }
    if (moves.includes("follow me")||moves.includes("rage powder")) { score+=2; reasons.push("Redirection support"); }
    if (moves.includes("helping hand")) { score+=1; reasons.push("Helping Hand boost"); }

    return {...mon, score, reason: reasons.slice(0,2).join(" · ")||"Solid general coverage", key: monKey};
  });

  const yourPick = [...myScored].sort((a,b)=>b.score-a.score).slice(0,4);

  const keyThreats = [];
  for (const opp of predictedBring) {
    const threatened = myTeam.filter(m => {
      const mt = POKEMON_TYPES[normalize(m.name)]||["normal"];
      return opp.types.some(ot => getTypeEffectiveness(ot,mt) >= 2);
    });
    if (threatened.length >= 2) {
      keyThreats.push({name:opp.name, threat:`Threatens ${threatened.map(m=>m.name).join(" & ")} — avoid leading both into ${opp.name}`});
    }
    if ((opp.topAbility||"").includes("Intimidate") && yourPick.some(p=>(p.moves||[]).some(m=>["earthquake","rock slide"].includes(m.toLowerCase())))) {
      keyThreats.push({name:opp.name, threat:`Intimidate from ${opp.name} softens physical attackers — lead Milotic to counter with Competitive if available`});
    }
  }

  const adjustments = [];
  if (byUsage[1]) adjustments.push({if:byUsage[1].name, then:`Check your back two still cover ${byUsage[1].name}'s ${byUsage[1].types.join("/")} typing`});
  if (byUsage[2]) adjustments.push({if:byUsage[2].name, then:`${byUsage[2].name} in lead changes damage profile — reassess back two for ${byUsage[2].types.join("/")} coverage`});
  const hasTR = predictedBring.some(p=>(p.topMoves||[]).some(m=>m==="Trick Room"));
  if (hasTR) adjustments.push({if:"Trick Room setter leads", then:"Apply max spread damage before TR goes up — target the setter's support first"});

  return {opponentPrediction:byUsage, predictedBring, yourPick, adjustments, keyThreats:keyThreats.slice(0,3)};
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState("team");
  const [myTeam, setMyTeam] = useState(() => storage.get("ts_team", getDefaultTeam()));
  const [editingTeam, setEditingTeam] = useState(false);
  const [metaData, setMetaData] = useState(null);
  const [metaStatus, setMetaStatus] = useState("loading");
  const [opponentPokemon, setOpponentPokemon] = useState(["","","","","",""]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchLog, setMatchLog] = useState(() => storage.get("ts_log", []));
  const [logEntry, setLogEntry] = useState({actualBring:"",actualLead:""});

  useEffect(() => {
    fetch(META_API)
      .then(r=>r.json())
      .then(d=>{ setMetaData(d); setMetaStatus("live"); })
      .catch(()=>setMetaStatus("offline"));
  }, []);

  const saveTeam = (team) => { setMyTeam(team); storage.set("ts_team", team); };
  const addLog = (entry) => {
    const next = [entry, ...matchLog].slice(0,100);
    setMatchLog(next);
    storage.set("ts_log", next);
  };
  const clearLog = () => { setMatchLog([]); storage.set("ts_log", []); };

  const runAnalysis = useCallback(() => {
    const filled = opponentPokemon.filter(p=>p.trim());
    if (filled.length < 4) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysis(analyzeMatchup(filled, myTeam, metaData));
      setAnalyzing(false);
    }, 500);
  }, [opponentPokemon, myTeam, metaData]);

  const logMatch = () => {
    if (!analysis) return;
    addLog({
      date: new Date().toLocaleDateString(),
      opponentSeen: opponentPokemon.filter(p=>p.trim()),
      opponentPredicted: analysis.predictedBring.map(p=>p.name),
      opponentPredictedLead: analysis.opponentPrediction.slice(0,2).map(p=>p.name),
      yourRecommended: analysis.yourPick.map(p=>p.name),
      actualOpponentBring: logEntry.actualBring,
      actualOpponentLead: logEntry.actualLead,
    });
    setLogEntry({actualBring:"",actualLead:""});
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <Pokeball />
          <div>
            <div style={s.title}>TEAM SCOUT</div>
            <div style={s.subtitle}>Pokémon Champions · Season M-1</div>
          </div>
        </div>
        <StatusBadge status={metaStatus} updatedAt={metaData?.updated_at} />
      </div>

      <div style={s.tabBar}>
        {[["team","MY TEAM"],["match","ANALYSIS"],["log",`LOG${matchLog.length>0?` (${matchLog.length})`:""}`]].map(([id,label])=>(
          <button key={id} style={{...s.tabBtn,...(tab===id?s.tabActive:{})}} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      <div style={s.content}>
        {tab==="team" && <TeamTab myTeam={myTeam} saveTeam={saveTeam} editing={editingTeam} setEditing={setEditingTeam} />}
        {tab==="match" && <MatchTab opponentPokemon={opponentPokemon} setOpponentPokemon={setOpponentPokemon} runAnalysis={runAnalysis} analyzing={analyzing} analysis={analysis} metaStatus={metaStatus} logEntry={logEntry} setLogEntry={setLogEntry} logMatch={logMatch} />}
        {tab==="log" && <LogTab matchLog={matchLog} clearLog={clearLog} />}
      </div>
    </div>
  );
}

function Pokeball() {
  return (
    <div style={{width:34,height:34,borderRadius:"50%",border:"2px solid #2a2a2a",overflow:"hidden",position:"relative",flexShrink:0}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:"#e85d2f"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:"#111"}}/>
      <div style={{position:"absolute",top:"50%",left:0,right:0,height:3,background:"#222",transform:"translateY(-50%)"}}/>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:10,height:10,borderRadius:"50%",background:"#1a1a1a",border:"2px solid #333",zIndex:2}}/>
    </div>
  );
}

function StatusBadge({status,updatedAt}) {
  if (status==="loading") return <div style={{...s.badge,color:"#666",borderColor:"#222"}}>CONNECTING...</div>;
  if (status==="live") return (
    <div style={{...s.badge,color:"#4caf50",borderColor:"#1a3a1a",background:"#0a1a0a",gap:6}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:"#4caf50",boxShadow:"0 0 6px #4caf50",flexShrink:0}}/>
      LIVE · {new Date(updatedAt).toLocaleDateString()}
    </div>
  );
  return <div style={{...s.badge,color:"#f59e0b",borderColor:"#3a2a00",background:"#1a1400"}}>OFFLINE</div>;
}

// ============================================================
// TEAM TAB
// ============================================================
function TeamTab({myTeam,saveTeam,editing,setEditing}) {
  const [draft,setDraft] = useState(myTeam);
  useEffect(()=>setDraft(myTeam),[myTeam]);
  const save = () => { saveTeam(draft); setEditing(false); };
  const cancel = () => { setDraft(myTeam); setEditing(false); };
  const upd = (i,f,v) => setDraft(p=>p.map((m,idx)=>idx===i?{...m,[f]:v}:m));
  const updMove = (i,mi,v) => setDraft(p=>p.map((m,idx)=>{ if(idx!==i)return m; const mv=[...m.moves]; mv[mi]=v; return {...m,moves:mv}; }));
  const display = editing ? draft : myTeam;

  return (
    <div>
      <div style={s.secHeader}>
        <div>
          <div style={s.secTitle}>YOUR TEAM</div>
          <div style={s.secSub}>Saved automatically · Persists between sessions</div>
        </div>
        {!editing
          ? <button style={s.btnPrimary} onClick={()=>{setDraft(myTeam);setEditing(true);}}>EDIT TEAM</button>
          : <div style={{display:"flex",gap:8}}>
              <button style={s.btnPrimary} onClick={save}>SAVE</button>
              <button style={s.btnGhost} onClick={cancel}>CANCEL</button>
            </div>
        }
      </div>
      <div style={s.teamGrid}>
        {display.map((mon,i)=>(
          <div key={i} style={s.monCard}>
            <div style={s.monTop}>
              <div style={s.slot}>{i+1}</div>
              {editing
                ? <input style={s.nameInput} value={draft[i].name} onChange={e=>upd(i,"name",e.target.value)} placeholder="Pokémon name"/>
                : <div style={s.monName}>{mon.name||<span style={{color:"#333"}}>Empty</span>}</div>
              }
            </div>
            {editing?(
              <div>
                {[["ability","ABILITY","e.g. Intimidate"],["item","ITEM","e.g. Sitrus Berry"]].map(([f,l,ph])=>(
                  <div key={f} style={{marginBottom:8}}>
                    <div style={s.fieldLabel}>{l}</div>
                    <input style={s.input} value={draft[i][f]} onChange={e=>upd(i,f,e.target.value)} placeholder={ph}/>
                  </div>
                ))}
                <div style={s.fieldLabel}>MOVES</div>
                {[0,1,2,3].map(mi=>(
                  <input key={mi} style={{...s.input,marginBottom:4}} value={draft[i].moves[mi]||""} onChange={e=>updMove(i,mi,e.target.value)} placeholder={`Move ${mi+1}`}/>
                ))}
              </div>
            ):(
              <div>
                <div style={s.detRow}><span style={s.detLabel}>ABILITY</span><span style={s.detVal}>{mon.ability||"—"}</span></div>
                <div style={s.detRow}><span style={s.detLabel}>ITEM</span><span style={s.detVal}>{mon.item||"—"}</span></div>
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
function MatchTab({opponentPokemon,setOpponentPokemon,runAnalysis,analyzing,analysis,metaStatus,logEntry,setLogEntry,logMatch}) {
  const filled = opponentPokemon.filter(p=>p.trim()).length;
  const canAnalyze = filled>=4 && !analyzing && metaStatus!=="loading";

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardTitle}>TEAM PREVIEW</div>
          <button style={s.btnGhost} onClick={()=>setOpponentPokemon(["","","","","",""])}>CLEAR</button>
        </div>
        <div style={s.cardSub}>Enter opponent's 6 Pokémon from preview screen</div>
        <div style={s.inputGrid}>
          {opponentPokemon.map((p,i)=>(
            <div key={i} style={s.inputRow}>
              <div style={s.inputNum}>{i+1}</div>
              <input style={s.pokeinput} value={p}
                onChange={e=>{ const n=[...opponentPokemon]; n[i]=e.target.value; setOpponentPokemon(n); }}
                onKeyDown={e=>e.key==="Enter"&&canAnalyze&&runAnalysis()}
                placeholder={i<2?"Lead slot":"Back slot"}/>
            </div>
          ))}
        </div>
        <div style={s.analyzeRow}>
          <span style={s.filledLabel}>{filled}/6 entered · min 4</span>
          <button style={{...s.btnPrimary,...(!canAnalyze?s.btnDis:{})}} onClick={runAnalysis} disabled={!canAnalyze}>
            {metaStatus==="loading"?"LOADING...":(analyzing?"ANALYZING...":"ANALYZE")}
          </button>
        </div>
      </div>

      {analysis && !analyzing && (
        <>
          <div style={s.card}>
            <div style={s.cardTitle}>OPPONENT — PREDICTED BRING</div>
            <div style={s.cardSub}>Ranked by meta usage · Top 2 most likely to lead</div>
            <div style={s.predGrid}>
              {analysis.opponentPrediction.map((pred,i)=>(
                <div key={i} style={{...s.predCard,...(i<2?s.predLead:{})}}>
                  {i<2&&<div style={s.leadTag}>LIKELY LEAD</div>}
                  <div style={s.predRank}>#{i+1} · {(pred.usageRate*100).toFixed(0)}%</div>
                  <div style={s.predName}>{pred.name}</div>
                  <div style={s.chipRow}>
                    {pred.topMoves.slice(0,3).map((m,mi)=><div key={mi} style={s.chip}>{m}</div>)}
                    {pred.topItem&&<div style={{...s.chip,color:"#f59e0b",background:"#1a1400"}}>📦 {pred.topItem}</div>}
                    {pred.topAbility&&<div style={{...s.chip,color:"#60a5fa",background:"#0d1a2e"}}>⚡ {pred.topAbility}</div>}
                  </div>
                </div>
              ))}
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
                  <div style={s.recReason}>{pick.reason}</div>
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
              <div style={s.cardSub}>If their actual lead differs from prediction</div>
              {analysis.adjustments.map((adj,i)=>(
                <div key={i} style={s.adjRow}>
                  <div style={{fontSize:10,color:"#5a6070",marginBottom:5}}>IF they lead <strong style={{color:"#e85d2f"}}>{adj.if}</strong></div>
                  <div style={{fontSize:10,color:"#e2e2e2",lineHeight:1.6}}>→ {adj.then}</div>
                </div>
              ))}
            </div>
          )}

          <div style={s.card}>
            <div style={s.cardTitle}>LOG THIS MATCH</div>
            <div style={s.cardSub}>Enter what opponent actually brought after the match</div>
            <input style={{...s.input,marginBottom:8}} value={logEntry.actualBring}
              onChange={e=>setLogEntry(p=>({...p,actualBring:e.target.value}))}
              placeholder="Opponent's actual 4 (comma separated)"/>
            <input style={{...s.input,marginBottom:12}} value={logEntry.actualLead}
              onChange={e=>setLogEntry(p=>({...p,actualLead:e.target.value}))}
              placeholder="Opponent's actual lead two"/>
            <button style={s.btnPrimary} onClick={logMatch}>SAVE TO LOG</button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// LOG TAB
// ============================================================
function LogTab({matchLog,clearLog}) {
  if (!matchLog.length) return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:36,marginBottom:14}}>📋</div>
      <div style={{fontSize:13,color:"#5a6070",letterSpacing:2,marginBottom:8}}>No matches logged</div>
      <div style={{fontSize:10,color:"#2a2a2a",maxWidth:280,margin:"0 auto",lineHeight:1.7}}>Run an analysis then log the result after each match to track prediction accuracy over time</div>
    </div>
  );
  return (
    <div>
      <div style={s.secHeader}>
        <div>
          <div style={s.secTitle}>MATCH LOG</div>
          <div style={s.secSub}>{matchLog.length} matches · Saved between sessions</div>
        </div>
        <button style={{...s.btnGhost,color:"#e85d2f",borderColor:"#e85d2f44"}} onClick={clearLog}>CLEAR ALL</button>
      </div>
      {matchLog.map((entry,i)=>(
        <div key={i} style={s.logCard}>
          <div style={{fontSize:9,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:12}}>{entry.date}</div>
          <LogRow label="OPPONENT SEEN" value={(entry.opponentSeen||[]).join(", ")}/>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <LogRow label="PREDICTED BRING" value={(entry.opponentPredicted||[]).join(", ")} flex/>
            <LogRow label="ACTUAL BRING" value={entry.actualOpponentBring||"—"} flex bright={!!entry.actualOpponentBring}/>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <LogRow label="PREDICTED LEAD" value={(entry.opponentPredictedLead||[]).join(", ")} flex/>
            <LogRow label="ACTUAL LEAD" value={entry.actualOpponentLead||"—"} flex bright={!!entry.actualOpponentLead}/>
          </div>
          <LogRow label="YOUR RECOMMENDED" value={(entry.yourRecommended||[]).join(", ")}/>
        </div>
      ))}
    </div>
  );
}

function LogRow({label,value,flex,bright}) {
  return (
    <div style={{flex:flex?"1":undefined,minWidth:flex?120:undefined,marginBottom:8}}>
      <div style={{fontSize:8,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:3}}>{label}</div>
      <div style={{fontSize:10,color:bright?"#e2e2e2":"#444",lineHeight:1.5}}>{value||"—"}</div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const s = {
  root:{minHeight:"100vh",background:"#09090b",color:"#e2e2e2",fontFamily:"'Courier New',monospace"},
  header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 16px 0",flexWrap:"wrap",gap:10},
  headerLeft:{display:"flex",alignItems:"center",gap:12},
  title:{fontSize:22,fontWeight:900,letterSpacing:5,color:"#e85d2f",lineHeight:1},
  subtitle:{fontSize:9,color:"#5a6070",letterSpacing:2,marginTop:3},
  badge:{display:"flex",alignItems:"center",fontSize:9,letterSpacing:2,fontWeight:700,border:"1px solid",borderRadius:4,padding:"4px 10px"},
  tabBar:{display:"flex",borderBottom:"1px solid #1c1f2a",margin:"16px 0 0"},
  tabBtn:{background:"none",border:"none",borderBottom:"2px solid transparent",color:"#5a6070",padding:"10px 14px",cursor:"pointer",fontSize:10,letterSpacing:2,fontFamily:"'Courier New',monospace",fontWeight:700,transition:"all 0.15s",whiteSpace:"nowrap"},
  tabActive:{color:"#e85d2f",borderBottomColor:"#e85d2f"},
  content:{padding:"16px",maxWidth:860,margin:"0 auto"},
  card:{background:"#0f1014",border:"1px solid #1c1f2a",borderRadius:8,padding:16,marginBottom:14},
  cardHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4},
  cardTitle:{fontSize:11,letterSpacing:3,color:"#e85d2f",fontWeight:700,marginBottom:4},
  cardSub:{fontSize:10,color:"#5a6070",marginBottom:14},
  secHeader:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,gap:10},
  secTitle:{fontSize:11,letterSpacing:3,color:"#e85d2f",fontWeight:700},
  secSub:{fontSize:9,color:"#5a6070",letterSpacing:1,marginTop:3},
  teamGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12},
  monCard:{background:"#0f1014",border:"1px solid #1c1f2a",borderRadius:8,padding:14},
  monTop:{display:"flex",alignItems:"center",gap:10,marginBottom:12},
  slot:{width:22,height:22,background:"#2a1510",border:"1px solid #e85d2f44",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#e85d2f",fontWeight:700,flexShrink:0},
  monName:{fontSize:13,fontWeight:700,letterSpacing:1},
  nameInput:{flex:1,background:"#06070a",border:"1px solid #1c1f2a",borderRadius:4,color:"#e2e2e2",padding:"5px 8px",fontSize:12,fontFamily:"'Courier New',monospace",outline:"none",width:"100%",boxSizing:"border-box"},
  input:{display:"block",width:"100%",background:"#06070a",border:"1px solid #1c1f2a",borderRadius:4,color:"#e2e2e2",padding:"7px 10px",fontSize:11,fontFamily:"'Courier New',monospace",outline:"none",boxSizing:"border-box"},
  fieldLabel:{fontSize:9,color:"#5a6070",letterSpacing:2,fontWeight:700,marginBottom:4,marginTop:8},
  detRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,gap:8},
  detLabel:{fontSize:9,color:"#5a6070",letterSpacing:1.5,fontWeight:700,flexShrink:0},
  detVal:{fontSize:10,color:"#e2e2e2",textAlign:"right"},
  moveWrap:{display:"flex",flexWrap:"wrap",gap:4,marginTop:10},
  moveChip:{background:"#14161e",border:"1px solid #1c1f2a",borderRadius:3,padding:"2px 8px",fontSize:9,color:"#5a6070"},
  inputGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14},
  inputRow:{display:"flex",alignItems:"center",gap:8},
  inputNum:{width:18,height:18,background:"#14161e",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#5a6070",fontWeight:700,flexShrink:0},
  pokeinput:{flex:1,background:"#06070a",border:"1px solid #1c1f2a",borderRadius:4,color:"#e2e2e2",padding:"8px 10px",fontSize:11,fontFamily:"'Courier New',monospace",outline:"none",width:"100%",boxSizing:"border-box"},
  analyzeRow:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},
  filledLabel:{fontSize:9,color:"#5a6070",letterSpacing:1},
  btnPrimary:{background:"#e85d2f",color:"#fff",border:"none",borderRadius:4,padding:"9px 18px",fontSize:10,letterSpacing:2,fontFamily:"'Courier New',monospace",fontWeight:700,cursor:"pointer"},
  btnGhost:{background:"none",color:"#5a6070",border:"1px solid #1c1f2a",borderRadius:4,padding:"7px 14px",fontSize:10,letterSpacing:2,fontFamily:"'Courier New',monospace",fontWeight:700,cursor:"pointer"},
  btnDis:{opacity:0.4,cursor:"not-allowed"},
  predGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10},
  predCard:{background:"#06070a",border:"1px solid #1c1f2a",borderRadius:6,padding:12},
  predLead:{background:"#0a1a0a",border:"1px solid #4caf5044"},
  leadTag:{fontSize:8,color:"#4caf50",letterSpacing:1.5,fontWeight:700,background:"#061506",border:"1px solid #4caf5033",borderRadius:3,padding:"2px 6px",display:"inline-block",marginBottom:6},
  backTag:{fontSize:8,color:"#5a6070",letterSpacing:1.5,fontWeight:700,marginBottom:6,display:"block"},
  predRank:{fontSize:9,color:"#5a6070",marginBottom:4},
  predName:{fontSize:13,fontWeight:700,marginBottom:8},
  chipRow:{display:"flex",flexWrap:"wrap",gap:3},
  chip:{fontSize:8,color:"#5a6070",background:"#14161e",borderRadius:3,padding:"2px 6px"},
  recGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
  recCard:{background:"#06070a",border:"1px solid #1c1f2a",borderRadius:6,padding:14},
  recLead:{background:"#0a1a0a",border:"1px solid #4caf5044"},
  recName:{fontSize:15,fontWeight:900,letterSpacing:1,marginBottom:3,marginTop:6},
  recReason:{fontSize:10,color:"#5a6070",lineHeight:1.6,borderTop:"1px solid #1c1f2a",paddingTop:8,marginTop:8},
  threatRow:{background:"#130a08",border:"1px solid #2a1510",borderRadius:6,padding:12,marginBottom:8},
  adjRow:{background:"#14161e",border:"1px solid #1c1f2a",borderRadius:6,padding:12,marginBottom:8},
  logCard:{background:"#0f1014",border:"1px solid #1c1f2a",borderRadius:8,padding:14,marginBottom:10},
};
