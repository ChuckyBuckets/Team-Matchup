# VGC Prediction Model Enhancement Plan

## Current Architecture (Status Quo)

### Step 1: Archetype Detection
- Scans for known setters: `ARCHETYPE_SETTERS` (rain, sun, sand, snow, trickroom, tailwind)
- Single-detector: returns first match or "standard"
- **No confidence score**

### Step 2: Lead Prediction
- Checks `LEAD_PAIRS` for both Pokémon in roster
- Falls back to archetype-specific logic if no exact pair match
- Returns a pair with `prob` (0.6-0.85)

### Step 3: Fill Remaining Slots
- Ranks all 6 opponent Pokémon by `usageRate`
- **Predicted leads get +0.3 usage boost** (only coupling mechanism)
- Takes top 4; these are "predicted bring"

### Step 4: Score User Team Against Predicted Bring
- Evaluates matchups only **after** bring is locked in
- No feedback loop back to the prediction itself

---

## **PROBLEMS IDENTIFIED**

1. **No Synergy Between Steps**: Back picks don't know why front picks matter
2. **No Co-occurrence Data**: Relies only on hardcoded `LEAD_PAIRS`; misses discovered synergies
3. **No Confidence Scoring**: Output is a flat list; doesn't distinguish "near-lock" from "coin flip"
4. **Dual-mode Teams Not Flagged**: Teams that can run Rain OR TR are treated as mono-archetype
5. **Limited Role Tags**: Doesn't track role dependencies (setter ↔ abuser, redirector ↔ spread attacker)
6. **Back Picks Ignore Core**: Remaining 2 slots filled by popularity, not by synergy with the core

---

## **PROPOSED ENHANCED MODEL**

### **Phase 1: Pre-Analysis — Build Synergy Matrices** *(Optional: requires meta API enhancement)*

If `metaData` includes team composition or co-occurrence data:
- Track which Pokémon appear together in brought teams
- Compute synergy score: `coOccurrence[pokemonA][pokemonB]`
- Identify role tags from move patterns (e.g., Earthquake + Protect = spread attacker)

**Data Gap**: Current code assumes `metaData.pokemon_usage` is individual stats only. To unlock this, we'd need:
```javascript
metaData.team_compositions  // array of {team: [key, key, key, key, key, key], bring_rate: X, frequency: Y}
metaData.pair_cooccurrence   // matrix of which pairs appear together frequently
```

### **Phase 2: Detect Coupled Cores** *(New Function)*

**Function**: `detectCoupledCores(oppKeys, opp, archetype)`

Detects paired or triplet cores through three mechanisms:

#### A. **Archetype Coupling** (Deterministic)
```
rain → [setter, abuser] where setter ∈ {pelipper, politoed}, abuser ∈ {swift-swim users}
trickroom → [setter, abuser] where setter ∈ ARCHETYPE_SETTERS.trickroom, abuser ∈ {trick-room speed minimizers}
sun → [setter, abuser] where setter ∈ {charizard, torkoal}, abuser ∈ {chlorophyll users}
tailwind → [setter, spread-attacker+]
```

#### B. **Support Coupling** (Role-Based)
```
redirector (indeedee, follow-me) ↔ spread-attacker (earthquake, surf, etc.)
fake-out user ↔ frail sweeper
priorityMove user ↔ slow tank
```

#### C. **Co-occurrence Coupling** *(requires Phase 1 data)*
If co-occurrence matrix exists, find pairs with high `synergy[A][B]` > threshold

**Output**:
```javascript
{
  cores: [
    { lead: ['sinistcha', 'incineroar'], type: 'archetype', confidence: 0.9, note: 'TR + Fake Out' },
    { lead: ['indeedee', 'venusaur'], type: 'support', confidence: 0.7, note: 'Redirector + Earthquake' },
  ],
  isPaired: true,
  coreCount: 2,
}
```

---

### **Phase 3: Archetype Classification with Confidence** *(Enhanced)*

**Function**: `classifyArchetypeWithConfidence(oppKeys, archetype, cores)`

```javascript
function classifyArchetypeWithConfidence(oppKeys, archetype, cores) {
  let confidence = 0.5; // baseline
  let reason = "";

  if (archetype === "standard") {
    confidence = 0.3; // low confidence for generic teams
    reason = "No clear archetype detected";
  } else {
    // Check if detected setter is present
    const archetypeSetter = ARCHETYPE_SETTERS[archetype]?.some(s => oppKeys.includes(s));
    if (archetypeSetter) confidence += 0.3;

    // Check if core matches archetype
    if (cores.cores.length > 0 && cores.cores[0].type === 'archetype') {
      confidence += 0.3;
      reason = `Core detected: ${cores.cores[0].note}`;
    }

    // Check for dual-mode (multiple viable cores)
    if (cores.cores.length > 1) {
      confidence = Math.min(confidence, 0.6); // cap confidence if multiple modes
      reason += " [Dual-mode team]";
    }
  }

  return {
    archetype: archetype,
    confidence: Math.min(confidence, 1.0),
    reason: reason,
  };
}
```

---

### **Phase 4: Score Remaining Pokémon Against Core** *(New Scoring Logic)*

**Function**: `scoreBackPicksForCore(oppRoster, predictedCore, archetype, myTeam, metaData)`

For each Pokémon not in predicted core, compute:

```javascript
score = (synergy * 0.4) + (usage * 0.35) + (matchup * 0.25)

where:
  synergy = how well this Pokémon pairs with the core
    (e.g., if core is TR setter, TR abusers score high)
    (e.g., if core is redirector, spread attackers score high)
  
  usage = base bring rate or popularity from metaData
  
  matchup = how well it covers my team's weaknesses
    (e.g., if core struggles vs my Pokémon X, prefer Pokémon Y that beats X)
```

**Implementation**:
```javascript
function scoreBackPicksForCore(remaining, core, archetype, myTeam, metaData) {
  return remaining.map(mon => {
    // SYNERGY: Does this work well with the core?
    const synergySc = computeSynergy(mon, core, archetype);
    
    // USAGE: What's its baseline bring rate?
    const usageSc = mon.usageRate; // 0-1
    
    // MATCHUP: How well does it cover weaknesses?
    const matchupSc = computeMatchupCoverage(mon, myTeam, archetype);
    
    const totalScore = (synergySc * 0.4) + (usageSc * 0.35) + (matchupSc * 0.25);
    
    return Object.assign({}, mon, {
      synergySc, usageSc, matchupSc, totalScore,
    });
  });
}

function computeSynergy(mon, core, archetype) {
  let score = 0;
  
  if (archetype === 'trickroom' && isTrickRoomAbuser(mon)) score += 0.8;
  if (archetype === 'rain' && isSwiftSwimUser(mon)) score += 0.8;
  if (archetype === 'sun' && isChlorophyllUser(mon)) score += 0.8;
  if (isSpreadAttacker(mon) && isRedirectorInCore(core)) score += 0.7;
  if (mon.topAbility?.includes('intimidate')) score += 0.3; // pairs with any core
  
  return Math.min(score, 1.0);
}

function computeMatchupCoverage(mon, myTeam, archetype) {
  // Score based on: which of my Pokémon does it threaten?
  // which of my Pokémon counter it?
  // Higher = fills gaps in the core's coverage
  
  let score = 0;
  for (const myMon of myTeam) {
    const myTypes = pokemonData[normalize(myMon.name)]?.types ?? ['normal'];
    const oppTypes = mon.types;
    
    // Does it threaten my team?
    for (const ot of oppTypes) {
      const eff = getTypeEff(ot, myTypes);
      if (eff >= 2) score += 0.15;
    }
    
    // Am I immune/resisting?
    for (const mt of myTypes) {
      const eff = getTypeEff(mt, oppTypes);
      if (eff >= 2) score -= 0.1;
    }
  }
  
  return Math.max(Math.min(score, 1.0), 0);
}
```

---

### **Phase 5: Confidence-Aware Output** *(Enhanced Return Object)*

**Function**: Modify `analyzeMatchup` return to include:

```javascript
return {
  // Existing fields
  opponentPrediction: byUsage,
  archetype: archetype,
  yourPick: yourPick,
  adjustments: adjustments,
  keyThreats: keyThreats.slice(0, 3),
  
  // NEW: Confidence & Coupling Info
  archetypeConfidence: confidenceScore,  // 0-1
  predictedCores: cores,                 // list of detected cores
  predictionBreakdown: {                 // per-Pokémon confidence
    [pok1.key]: { confidence: 0.95, tier: 'near-lock', reason: 'Core TR setter' },
    [pok2.key]: { confidence: 0.90, tier: 'likely', reason: 'TR abuser' },
    [pok3.key]: { confidence: 0.65, tier: 'likely', reason: 'Redirection support' },
    [pok4.key]: { confidence: 0.55, tier: 'uncertain', reason: 'Coin flip vs Swift Swim user' },
  },
  uncertaintyFlags: [
    { slot: 'back2', reason: 'Multiple viable options (bring rate <60%)' },
    { slot: 'dual-mode', reason: 'Team can run both TR and Rain effectively' },
  ],
  
  predictedBring: predictedBring,        // existing 4-mon list
  predictedLeads: predictedLeads,         // existing 2-mon list
  leadNote: leadPred ? leadPred.note : null,
};
```

---

## **Implementation Roadmap**

### **Stage 1: Low-Hanging Fruit** *(no API changes needed)*
- ✅ Add `classifyArchetypeWithConfidence()` → use setter presence + core detection
- ✅ Add `detectCoupledCores()` → hardcode archetype coupling + support pattern matching
- ✅ Add synergy scoring to back-pick selection
- ✅ Output confidence tiers and uncertainty flags
- ✅ Display in UI (show confidence, flag "coin flip" slots)

### **Stage 2: Medium** *(requires meta API enhancement)*
- Extend `metaData` to include team compositions
- Build co-occurrence matrix from live data
- Feed into `detectCoupledCores()` as third detection mechanism

### **Stage 3: Advanced** *(optional, higher complexity)*
- Learn role tags from move patterns dynamically
- Ensemble confidence scores across detection methods
- Predict team trends (is dual-mode becoming more common?)

---

## **Data Gaps & Required Additions**

### **Gap 1: No Role Tagging**
**Current**: We infer roles from moves inline (e.g., `moves.includes("fake out")`)
**Needed**: A role registry or set of role detection helpers

**Solution**:
```javascript
const ROLE_PATTERNS = {
  spreadAttacker: mon => ['earthquake', 'surf', 'discharge'].some(m => (mon.topMoves||[]).map(x=>x.toLowerCase()).includes(m)),
  tricker: mon => ['trick', 'switcheroo', 'knock off'].some(m => (mon.topMoves||[]).includes(m)),
  redirector: mon => ['follow me', 'rage powder', 'ally switch'].some(m => (mon.topMoves||[]).includes(m)),
  fakeOutUser: mon => (mon.topMoves||[]).includes('fake out'),
};

function detectRoles(mon) {
  return Object.entries(ROLE_PATTERNS)
    .filter(([_, detector]) => detector(mon))
    .map(([role, _]) => role);
}
```

### **Gap 2: No Co-occurrence Data**
**Current**: `metaData.pokemon_usage` is individual stats only
**Needed**: `metaData.team_compositions` or similar

**Workaround for now**: Use hardcoded `LEAD_PAIRS` and archetype setters + role detection

### **Gap 3: No Archetype Abuser Lists**
**Current**: We have setters but not abusers
**Needed**: Map of "what Pokémon abuse TR?", "what abuse Rain?", etc.

**Solution**:
```javascript
const ARCHETYPE_ABUSERS = {
  trickroom: ['reuniclus', 'dusknoir', 'grimmsnarl', 'stakataka', 'cawmodore'], // speed-low Pokémon
  rain: ['basculegion-male', 'ludicolo', 'omastar', 'kabutops'], // swift-swim or rain-dish
  sun: ['venusaur', 'cherrim', 'ninetales-alola'], // chlorophyll or drought
  tailwind: [/* fast sweepers */],
};
```

---

## **Next Steps**

1. ✅ **Review this plan** — validate the approach and data gaps
2. 📝 **Implement Stage 1** — add confidence scoring + synergy logic without API changes
3. 🔧 **Add UI display** — show confidence tiers and uncertainty flags
4. 🚀 **Optional: Stage 2** — enhance metaData structure if desired

---

## **Key Benefits**

- ✅ All 4 predicted Pokémon chosen as a cohesive unit
- ✅ Confidence scores reflect actual uncertainty (dual-mode teams, close calls)
- ✅ Output is honest about "coin flip" slots
- ✅ Back picks informed by core strategy, not just popularity
- ✅ User sees *why* each Pokémon is predicted
