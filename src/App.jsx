import { useState, useEffect, useRef, useCallback } from "react";
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
  firered: {
    name: "FireRed",
    bg: "#1a0c08",
    bgGradient: "linear-gradient(180deg, #1a0c08 0%, #140a06 100%)",
    card: "#f0e8d0",
    cardGradient: null,
    border: "#7a1808",
    panelBorder: "#7a1808",
    accent: "#cc2200",
    green: "#201008",
    text: "#201008",
    muted: "#7a5040",
    faint: "#e8dcc0",
    yellow: "#e08800",
    blue: "#804020",
    gdim: "#ddd0b0",
    borderRadius: 3,
    borderWidth: 2,
    boxShadow: "0 0 0 3px #7a1808, inset 0 0 0 1px rgba(192,112,64,0.4)",
    buttonGradient: "linear-gradient(120deg, rgba(204,34,0,0.95), rgba(160,20,0,0.9))",
    pokeballTop: "#cc2200",
    pokeballBottom: "#1a0c08",
    font: "'Silkscreen', monospace",
    invertedSurface: true,
  },
  leafgreen: {
    name: "LeafGreen",
    bg: "#081408",
    bgGradient: "linear-gradient(180deg, #081408 0%, #060e06 100%)",
    card: "#e8f0d8",
    cardGradient: null,
    border: "#1a4810",
    panelBorder: "#1a4810",
    accent: "#2a7010",
    green: "#101808",
    text: "#101808",
    muted: "#4a6040",
    faint: "#dce8cc",
    yellow: "#789020",
    blue: "#305820",
    gdim: "#ccdcb8",
    borderRadius: 3,
    borderWidth: 2,
    boxShadow: "0 0 0 3px #1a4810, inset 0 0 0 1px rgba(64,104,48,0.4)",
    buttonGradient: "linear-gradient(120deg, rgba(42,112,16,0.95), rgba(28,80,8,0.9))",
    pokeballTop: "#2a7010",
    pokeballBottom: "#081408",
    font: "'Silkscreen', monospace",
    invertedSurface: true,
  },
  gold: {
    name: "Gold",
    bg: "#0f0a00",
    bgGradient: "radial-gradient(ellipse 70% 55% at 50% 28%, rgba(200,130,10,0.45) 0%, rgba(160,90,0,0.25) 25%, rgba(80,40,0,0.12) 55%, transparent 75%), radial-gradient(ellipse 40% 30% at 50% 0%, rgba(255,180,30,0.15) 0%, transparent 50%), linear-gradient(180deg, #120d00 0%, #0f0a00 40%, #080600 100%)",
    card: "#1a1200",
    cardGradient: "linear-gradient(180deg, rgba(26,18,0,0.97), rgba(15,10,0,0.99))",
    border: "#6b4a00",
    panelBorder: "#8a6000",
    accent: "#e8a020",
    green: "#fdebbc",
    text: "#fff4e0",
    muted: "#fca90e",
    faint: "#150f00",
    yellow: "#ffcc44",
    blue: "#c06820",
    gdim: "#120d00",
    borderRadius: 6,
    borderWidth: 1,
    boxShadow: "0 12px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(180,120,0,0.08)",
    buttonGradient: "linear-gradient(120deg, rgba(220,150,20,0.9), rgba(180,100,10,0.85))",
    pokeballTop: "#e8a020",
    pokeballBottom: "#0f0a00",
    font: "'Inconsolata', 'Courier New', monospace",
  },
  silver: {
    name: "Silver",
    bg: "#07090f",
    bgGradient: "radial-gradient(ellipse 65% 50% at 50% 28%, rgba(80,110,160,0.40) 0%, rgba(50,75,120,0.20) 30%, rgba(20,35,70,0.10) 55%, transparent 75%), radial-gradient(ellipse 35% 25% at 50% 0%, rgba(140,170,220,0.12) 0%, transparent 45%), linear-gradient(180deg, #0c1020 0%, #07090f 40%, #050709 100%)",
    card: "#0d1018",
    cardGradient: "linear-gradient(180deg, rgba(13,16,24,0.97), rgba(7,9,15,0.99))",
    border: "#2a3545",
    panelBorder: "#364560",
    accent: "#a8c0d8",
    green: "#65edff",
    text: "#e8eef4",
    muted: "#84aad8",
    faint: "#080d14",
    yellow: "#8ab0d0",
    blue: "#4070a0",
    gdim: "#09101a",
    borderRadius: 6,
    borderWidth: 1,
    boxShadow: "0 12px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(100,140,200,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(80,120,180,0.9), rgba(50,80,140,0.85))",
    pokeballTop: "#a8c0d8",
    pokeballBottom: "#07090f",
    font: "'Inconsolata', 'Courier New', monospace",
  },
  // ─────────────────────────────────────────────────────────────────────────────
// GEN 3 THEME OBJECTS — paste into THEMES in App.jsx
// ─────────────────────────────────────────────────────────────────────────────

  emerald: {
    name: "Emerald",
    // Rayquaza — stratosphere, Sky Pillar, ancient serpent above the clouds
    bg: "#010804",
    bgGradient: [
      // Layer 6: Rayquaza presence — long vertical jade streak, center-viewport
      "radial-gradient(ellipse 8% 60% at 50% 50%, rgba(68,221,102,0.06) 0%, transparent 100%)",
      // Layer 5: Star geography baked in — scattered pinpricks upper viewport
      "radial-gradient(1px 1px at 12% 8%,  rgba(255,255,255,0.04) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 28% 14%, rgba(255,255,255,0.03) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 44% 6%,  rgba(255,255,255,0.04) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 63% 18%, rgba(255,255,255,0.03) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 79% 10%, rgba(255,255,255,0.04) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 91% 22%, rgba(255,255,255,0.03) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 35% 32%, rgba(255,255,255,0.02) 0%, transparent 100%)",
      "radial-gradient(1px 1px at 56% 40%, rgba(255,255,255,0.02) 0%, transparent 100%)",
      // Layer 4: Upper atmosphere darkens toward space at top
      "radial-gradient(ellipse 100% 30% at 50% 0%, rgba(1,4,2,0.6) 0%, transparent 100%)",
      // Layer 3: Stratosphere jade-teal mid-tint
      "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,60,25,0.08) 0%, transparent 70%)",
      // Layer 2: Troposphere memory — faint blue-green at bottom
      "radial-gradient(ellipse 100% 20% at 50% 100%, rgba(10,40,50,0.06) 0%, transparent 100%)",
      // Layer 1: base
      "linear-gradient(180deg, #020a04 0%, #010804 50%, #010602 100%)",
    ].join(", "),
    card: "#050f06",
    cardGradient: "linear-gradient(180deg, rgba(5,15,6,0.97), rgba(1,8,4,0.99))",
    border: "#0a2a0a",
    panelBorder: "#103a10",
    accent: "#44dd66",
    green: "#fffc4c",
    text: "#e8ffe8",
    muted: "#44dd66",
    faint: "#030a03",
    yellow: "#d4a820",
    blue: "#204a20",
    gdim: "#020804",
    borderRadius: "4px 16px 4px 16px / 14px 8px 14px 8px",
    borderWidth: 1,
    boxShadow: "0 16px 48px rgba(0,0,0,0.9), 0 0 16px rgba(68,221,102,0.05)",
    buttonGradient: "linear-gradient(120deg, rgba(68,221,102,0.85), rgba(50,180,80,0.75))",
    pokeballTop: "#44dd66",
    pokeballBottom: "#010804",
    font: "'Rajdhani', 'Arial Narrow', Arial, sans-serif",
  },
  sapphire: {
    name: "Sapphire",
    // Kyogre — abyssal ocean trench, Cave of Origin, bioluminescent depth
    bg: "#000814",
    bgGradient: [
      // Layer 6: Pressure vignette — dark inward crush from all edges
      "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,2,10,0.5) 100%)",
      // Layer 5: Surface memory — light blue bleeding from very top only
      "radial-gradient(ellipse 80% 15% at 50% 0%, rgba(0,80,160,0.04) 0%, transparent 100%)",
      // Layer 4: Kyogre presence bloom — red-magenta, center-bottom
      // Base opacity only; JS will spike this dynamically via a separate DOM element
      "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(180,20,60,0.045) 0%, transparent 70%)",
      // Layer 3: Impossible light from upper-right — distant surface
      "radial-gradient(ellipse 40% 30% at 80% 10%, rgba(0,80,120,0.06) 0%, transparent 60%)",
      // Layer 2: Deep pressure zone — dark teal lower-left
      "radial-gradient(ellipse 70% 50% at 15% 75%, rgba(0,50,70,0.08) 0%, transparent 65%)",
      // Layer 1: base
      "linear-gradient(180deg, #000c1a 0%, #000814 50%, #00060f 100%)",
    ].join(", "),
    card: "#00111f",
    cardGradient: "linear-gradient(180deg, rgba(0,17,31,0.97), rgba(0,8,20,0.99))",
    border: "#0a2a3a",
    panelBorder: "#0d3a50",
    accent: "#0096e0",
    green: "#b7f9ff",
    text: "#d0eeff",
    muted: "#6fc5ff",
    faint: "#000a16",
    yellow: "#cc2244",
    blue: "#0060a0",
    gdim: "#000610",
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: "0 16px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,150,224,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(0,150,224,0.9), rgba(0,80,160,0.85))",
    pokeballTop: "#0044aa",
    pokeballBottom: "#000814",
    font: "'Rajdhani', 'Arial Narrow', Arial, sans-serif",
  },
  ruby: {
    name: "Ruby",
    // Groudon — magma chamber floor, volcanic fissure network, continental heat
    bg: "#100400",
    bgGradient: [
      // Layer 6: Groudon presence — strong amber bloom, center-right, unmistakable
      "radial-gradient(ellipse 50% 40% at 65% 60%, rgba(200,100,0,0.11) 0%, transparent 65%)",
      // Layer 5: Heat ceiling — orange-red bleeding down from top
      "radial-gradient(ellipse 80% 20% at 50% 0%, rgba(140,40,0,0.05) 0%, transparent 100%)",
      // Layer 4: Crack network — two non-90-degree repeating gradients
      // These are baked here as part of bgGradient; the CSS ::before adds the animated version
      "repeating-linear-gradient(-38deg, transparent, transparent 55px, rgba(180,60,0,0.028) 55px, rgba(180,60,0,0.028) 56px)",
      "repeating-linear-gradient(52deg, transparent, transparent 70px, rgba(160,50,0,0.022) 70px, rgba(160,50,0,0.022) 71px)",
      // Layer 3: Chamber geography — magma pool clusters
      "radial-gradient(ellipse 30% 25% at 20% 70%, rgba(120,50,0,0.09) 0%, transparent 60%)",
      "radial-gradient(ellipse 25% 20% at 75% 40%, rgba(100,40,0,0.08) 0%, transparent 60%)",
      "radial-gradient(ellipse 20% 18% at 45% 85%, rgba(140,60,0,0.07) 0%, transparent 55%)",
      // Layer 2: Source heat from below — large radial from bottom-center
      "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(180,60,0,0.18) 0%, transparent 65%)",
      // Layer 1: base
      "linear-gradient(180deg, #160600 0%, #100400 50%, #0c0200 100%)",
    ].join(", "),
    card: "#1a0800",
    cardGradient: "linear-gradient(180deg, rgba(26,8,0,0.98), rgba(16,4,0,0.99))",
    border: "#3a1200",
    panelBorder: "#521a08",
    accent: "#ff4400",
    green: "#ffca8e",
    text: "#fff0e8",
    muted: "#f8875a",
    faint: "#0e0200",
    yellow: "#ffe0a0",
    blue: "#802000",
    gdim: "#0c0200",
    borderRadius: 3,
    borderWidth: 1,
    boxShadow: "0 16px 40px rgba(0,0,0,0.95), 0 0 20px rgba(255,68,0,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(220,60,0,0.95), rgba(180,40,0,0.9))",
    pokeballTop: "#cc2200",
    pokeballBottom: "#100400",
    font: "'Rajdhani', 'Arial Narrow', Arial, sans-serif",
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
    green: "#d4d4d4",
    text: "#c8dcf0",
    muted: "#82b0e9",
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
    muted: "#bb87cf",         // dim purple
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
    green: "#a870e0",         // dim chrome for W count / positive states
    text: "#d8d8d8",          // cool grey text
    muted: "#9c9c9c",         // very dim for secondary text
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
    green: "#45ffe6",         // electric teal for W count / positive states
    text: "#e0f4ff",          // cold electric white
    muted: "#4680a7",         // deep muted blue-grey
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
    muted: "#7c7c91",         // cool grey-lavender for secondary text
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
  x: {
    name: "X",
    bg: "#08060e",
    bgGradient: "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(180,140,255,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(140,220,180,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 60% 80%, rgba(255,180,210,0.12) 0%, transparent 50%), linear-gradient(180deg, #08060e 0%, #0c0814 100%)",
    card: "#120e1a",
    cardGradient: "linear-gradient(180deg, rgba(18,14,26,0.97), rgba(8,6,14,0.99))",
    border: "#2e1a48",
    panelBorder: "#4a2870",
    accent: "#d4a8ff",
    green: "#a8f0c8",
    text: "#f0e8ff",
    muted: "#7a6090",
    faint: "#100c18",
    yellow: "#ffd4a8",
    blue: "#a8d4ff",
    gdim: "#0c0814",
    borderRadius: 16,
    borderWidth: 1,
    boxShadow: "0 12px 40px rgba(180,120,255,0.12), 0 0 0 1px rgba(180,120,255,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(180,120,255,0.85), rgba(120,200,255,0.75))",
    pokeballTop: "#d4a8ff",
    pokeballBottom: "#08060e",
    font: "Palatino Linotype, Palatino, Georgia, serif",
  },
  y: {
    name: "Y",
    bg: "#0a0204",
    bgGradient: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(180,20,30,0.20) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 0% 60%, rgba(100,10,40,0.15) 0%, transparent 50%), radial-gradient(ellipse 40% 50% at 100% 80%, rgba(80,0,30,0.12) 0%, transparent 50%), linear-gradient(180deg, #0e0306 0%, #0a0204 100%)",
    card: "#140406",
    cardGradient: "linear-gradient(180deg, rgba(20,4,6,0.98), rgba(10,2,4,0.99))",
    border: "#3a0810",
    panelBorder: "#581018",
    accent: "#ff4060",
    green: "#fddfdf",
    text: "#ffe8e8",
    muted: "#c06279",
    faint: "#120206",
    yellow: "#c04080",
    blue: "#800830",
    gdim: "#0e0204",
    borderRadius: 0,
    borderWidth: 1,
    boxShadow: "0 16px 40px rgba(0,0,0,0.95), 0 0 20px rgba(200,20,30,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(200,20,30,0.9), rgba(120,10,20,0.85))",
    pokeballTop: "#ff4060",
    pokeballBottom: "#0a0204",
    font: "'Rajdhani', 'Arial Narrow', Arial, sans-serif",
  },
  legendsza: {
    name: "Legends: Z-A",
    bg: "#000000",
    bgGradient: "linear-gradient(180deg, #040a08 0%, #000000 100%)",
    card: "#070f0a",
    cardGradient: "linear-gradient(180deg, rgba(7,15,10,0.98), rgba(3,8,6,0.99))",
    border: "#0a3018",
    panelBorder: "#104828",
    accent: "#2b7c3f",
    green: "#fad2fd",
    text: "#d8f0e0",
    muted: "#b8f7c8",
    faint: "#050c08",
    yellow: "#b8a030",
    blue: "#1460c8",
    gdim: "#040a06",
    borderRadius: 2,
    borderWidth: 1,
    boxShadow: "0 16px 40px rgba(0,0,0,0.9), 0 0 16px rgba(40,200,80,0.05)",
    buttonGradient: "linear-gradient(120deg, rgba(40,200,80,0.85), rgba(20,96,200,0.75))",
    pokeballTop: "#6dee8d",
    pokeballBottom: "#030806",
    font: "'Share Tech Mono', 'Courier New', monospace",
  },
  sun: {
  name: "Sun",
  bg: "#080602",
  bgGradient: [
    "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,140,10,0.30) 0%, transparent 60%),",
    "radial-gradient(ellipse 40% 30% at 80% 80%, rgba(140,80,0,0.10) 0%, transparent 50%),",
    "linear-gradient(180deg, #0c0a04 0%, #080602 100%)"
  ].join(" "),
  card: "#120e06",
  cardGradient: "linear-gradient(180deg, rgba(18,14,6,0.97), rgba(8,6,2,0.99))",
  border: "#3a2a08",
  panelBorder: "#5a4010",
  accent: "#d4a830",
  green: "#fff7dd",
  text: "#fff4e0",
  muted: "#7a6030",
  faint: "#100c04",
  yellow: "#f5d060",
  blue: "#3050a0",
  gdim: "#0e0a02",
  borderRadius: 8,
  borderWidth: 1,
  boxShadow: "0 16px 48px rgba(0,0,0,0.85), 0 0 30px rgba(180,120,10,0.06)",
  buttonGradient: "linear-gradient(120deg, rgba(180,120,10,0.9), rgba(240,200,60,0.8))",
  pokeballTop: "#d4a830",
  pokeballBottom: "#080602",
  font: "'Cormorant Garamond', Georgia, serif",
},
moon: {
  name: "Moon",
  bg: "#020408",
  bgGradient: [
    "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(30,50,120,0.15) 0%, transparent 70%),",
    "linear-gradient(180deg, #030509 0%, #020408 100%)"
  ].join(" "),
  card: "#07091a",
  cardGradient: "linear-gradient(180deg, rgba(7,9,26,0.97), rgba(2,4,8,0.99))",
  border: "#141e40",
  panelBorder: "#1e2e58",
  accent: "#a0c0e8",
  green: "#59bdb4",
  text: "#d8e8f8",
  muted: "#304868",
  faint: "#050810",
  yellow: "#c8b860",
  blue: "#2840a0",
  gdim: "#040610",
  borderRadius: 16,
  borderWidth: 1,
  boxShadow: "0 16px 48px rgba(0,0,0,0.90), 0 0 40px rgba(30,50,120,0.08)",
  buttonGradient: "linear-gradient(120deg, rgba(100,150,220,0.85), rgba(30,50,120,0.80))",
  pokeballTop: "#a0c0e8",
  pokeballBottom: "#020408",
  font: "'Josefin Sans', 'Gill Sans', sans-serif",
},
  zacian: {
    name: "Sword",
    bg: "#0d0810",
    bgGradient: "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(220,100,180,0.2) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 60%, rgba(180,140,220,0.1) 0%, transparent 50%), linear-gradient(180deg, #0f0a14 0%, #0a060e 100%)",
    card: "#160d1e",
    cardGradient: "linear-gradient(180deg, rgba(22,13,30,0.97), rgba(10,6,14,0.99))",
    border: "#3d1a50",
    panelBorder: "#5a2870",
    accent: "#e87fd0",
    green: "#fff1fc",
    text: "#f5e8ff",
    muted: "#d184da",
    faint: "#120810",
    yellow: "#f0c060",
    blue: "#c090f0",
    gdim: "#100810",
    borderRadius: 2,
    borderWidth: 1,
    boxShadow: "0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(220,100,180,0.06)",
    buttonGradient: "linear-gradient(120deg, rgba(220,100,180,0.9), rgba(180,120,240,0.8))",
    pokeballTop: "#e87fd0",
    pokeballBottom: "#0d0810",
    font: "Cinzel, Georgia, serif",
  },
  zamazenta: {
    name: "Shield",
    bg: "#060a12",
    bgGradient: "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(40,90,200,0.25) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 0% 70%, rgba(20,60,140,0.15) 0%, transparent 50%), linear-gradient(180deg, #080c18 0%, #050810 100%)",
    card: "#0c1228",
    cardGradient: "linear-gradient(180deg, rgba(12,18,40,0.97), rgba(5,8,16,0.99))",
    border: "#1a3060",
    panelBorder: "#264880",
    accent: "#7ab0ff",
    green: "#d3e9ff",
    text: "#d8e8ff",
    muted: "#6780aa",
    faint: "#080c18",
    yellow: "#c8b060",
    blue: "#4070c0",
    gdim: "#060a14",
    borderRadius: 5,
    borderWidth: 2,
    boxShadow: "0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(74,144,217,0.08)",
    buttonGradient: "linear-gradient(120deg, rgba(60,120,220,0.9), rgba(40,80,160,0.85))",
    pokeballTop: "#7ab0ff",
    pokeballBottom: "#060a12",
    font: "'Cinzel', Georgia, serif",
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
    muted: "#e98d5f",         // terracotta dim
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
    muted: "#e8d8ff",         // deep circuit purple for secondary text, I changed this 5/9 — was #7a4880 but that was too close to the accent, now it's the same as text but serves a different semantic purpose as muted secondary text
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

const MAX_TEAMS = 6;

// ── Weather Ball resolution ───────────────────────────────────────────────────
const WEATHER_BALL_TABLE = {
  none: { type: "normal", bp: 50 },
  sun:  { type: "fire",   bp: 100 },
  rain: { type: "water",  bp: 100 },
  sand: { type: "rock",   bp: 100 },
  snow: { type: "ice",    bp: 100 },
};

// ── Stat helper ──────────────────────────────────────────────────────────────
// base      : base stat value from pokemonData
// statPoints: 0–32 (the "EV" equivalent in this format)
// nature    : "positive" | "negative" | "neutral"
// isHp      : boolean
function getStatValue(base, statPoints = 0, nature = "neutral", isHp = false) {
  const iv = 31;
  const level = 50;
  const evFloor = Math.floor(statPoints / 4);

  if (isHp) {
    return Math.floor((2 * base + iv + evFloor) * level / 100) + level + 10;
  }

  const raw = Math.floor((2 * base + iv + evFloor) * level / 100) + 5;
  if (nature === "positive") return Math.floor(raw * 1.1);
  if (nature === "negative") return Math.floor(raw * 0.9);
  return raw;
}

// ── Damage calculation ────────────────────────────────────────────────────────
// Returns { minDmg, maxDmg, minPct, maxPct, verdict }
// for a single (attacker, defender at given statPoints) pair
function calcDamageRow(attData, defData, moveData, defStatPoints) {
  if (!attData?.stats || !defData?.stats || !moveData?.bp) return null;

  const level = 50;
  const power = moveData.bp;
  const isSpecial = moveData.category === "special";

  // Attacker — 0 stat points, neutral nature (no Feature 2 yet)
  const atkStat = getStatValue(
    isSpecial ? attData.stats["special-attack"] : attData.stats.attack,
    0,
    "neutral"
  );

  // Defender — at the given stat point investment
  const defStat = getStatValue(
    isSpecial ? defData.stats["special-defense"] : defData.stats.defense,
    defStatPoints,
    "neutral"
  );

  const defHp = getStatValue(defData.stats.hp, defStatPoints, "neutral", true);

  // STAB
  const stab = attData.types?.includes(moveData.type) ? 1.5 : 1;

  // Type effectiveness — needs typeChartData passed in, handled in component
  // We receive typeEff as a parameter instead
  return { atkStat, defStat, defHp, stab, power, level };
}

function getKOVerdict(dmgMin, dmgMax, hp) {
  if (dmgMin >= hp) return { label: "OHKO", color: "#ff4444" };
  if (dmgMax >= hp) return { label: "OHKO (max)", color: "#ff8800" };
  if (dmgMin * 2 >= hp) return { label: "2HKO", color: "#ffcc00" };
  if (dmgMax * 2 >= hp) return { label: "2HKO (max)", color: "#ffdd66" };
  return { label: "No KO", color: "#666" };
}
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
const dexIdToKey = {};
const keyToDexId = {};
for (const [key, data] of Object.entries(pokemonData)) {
  const match = (data.sprite || "").match(/\/(\d+)\.png$/);
  if (match) {
    const dexId = match[1];
    dexIdToKey[dexId] = key;
    keyToDexId[key] = dexId;
  }
}
// console.log(dexIdToKey); // TEMPORARY — delete after verification
const normalize = (s) => s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
function isChampionKey(key) {
  return CHAMPION_SET.has(key);
}
const getTypeEff = (mt, dts) => {
  let m = 1;
  for (const dt of dts) m *= ((typeChartData[mt] || {})[dt] !== undefined ? (typeChartData[mt] || {})[dt] : 1);
  return m;
};

const ARCHETYPE_RULES = {
  abilities: {
    "drizzle": "rain",
    "drought": "sun",
    "sand-stream": "sand",
    "snow-warning": "snow",
    "electric-surge": "electric-terrain",
    "psychic-surge": "psychic-terrain",
    "grassy-surge": "grassy-terrain",
    "misty-surge": "misty-terrain",
  },
  moves: {
    "trick-room": "trickroom",
    "tailwind": "tailwind",
    "rain-dance": "rain",
    "sunny-day": "sun",
    "sandstorm": "sand",
    "snowscape": "snow",
    "chilly-reception": "snow",
    "electric-terrain": "electric-terrain",
    "psychic-terrain": "psychic-terrain",
    "grassy-terrain": "grassy-terrain",
    "misty-terrain": "misty-terrain",
  }
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
  { pair: ["kingambit","floette-eternal"], prob: 0.88, note: "Elite bulky offense core" },
  { pair: ["basculegion-male","floette-eternal"], prob: 0.82, note: "Ghost offense + Fairy support" },
  { pair: ["kingambit","aerodactyl"], prob: 0.84, note: "Speed control + priority pressure" },
  { pair: ["kingambit","basculegion-male"], prob: 0.92, note: "Top-tier offensive pressure core" },
  { pair: ["aerodactyl","floette-eternal"], prob: 0.74, note: "Fast support offense core" },
  { pair: ["kingambit","charizard"], prob: 0.79, note: "Physical + special offense core" },
  { pair: ["sneasler","floette-eternal"], prob: 0.83, note: "Fast offense + Fairy support" },
  { pair: ["kingambit","sneasler"], prob: 0.95, note: "Premier hyper offense core" },
  { pair: ["garchomp","kingambit"], prob: 0.91, note: "Top physical offense pairing" },
  { pair: ["basculegion-male","aerodactyl"], prob: 0.76, note: "Fast offensive pressure" },
  { pair: ["basculegion-male","charizard"], prob: 0.67, note: "Mixed offensive coverage" },
  { pair: ["kingambit","froslass"], prob: 0.71, note: "Priority + disruption core" },
  { pair: ["garchomp","basculegion-male"], prob: 0.86, note: "Excellent offensive coverage" },
  { pair: ["garchomp","floette-eternal"], prob: 0.81, note: "Dragon + Fairy balance core" },
  { pair: ["charizard","aerodactyl"], prob: 0.78, note: "Fast offensive flying core" },
  { pair: ["sneasler","aerodactyl"], prob: 0.87, note: "Hyper offense speed core" },
  { pair: ["sneasler","basculegion-male"], prob: 0.90, note: "Aggressive offensive duo" },
  { pair: ["garchomp","aerodactyl"], prob: 0.85, note: "Fast physical offense core" },
  { pair: ["incineroar","floette-eternal"], prob: 0.73, note: "Bulky pivot support core" },
  { pair: ["sneasler","froslass"], prob: 0.79, note: "Fast disruption offense" },
  { pair: ["sinistcha","floette-eternal"], prob: 0.65, note: "Bulky utility support core" },
  { pair: ["garchomp","sneasler"], prob: 0.93, note: "Meta-defining physical offense" },
  { pair: ["pelipper","basculegion-male"], prob: 0.89, note: "Core Rain offense" },
  { pair: ["garchomp","charizard"], prob: 0.83, note: "Strong mixed offense core" },
  { pair: ["garchomp","rotom-wash"], prob: 0.80, note: "Ground + pivot balance core" },
  { pair: ["incineroar","aerodactyl"], prob: 0.68, note: "Pivot + speed support" },
  { pair: ["dragonite","basculegion-male"], prob: 0.72, note: "Priority + rain offense" },
  { pair: ["kingambit","sinistcha"], prob: 0.74, note: "Bulky sustain offense core" },
  { pair: ["sneasler","charizard"], prob: 0.82, note: "Aggressive offensive pressure" },
  { pair: ["pelipper","archaludon"], prob: 0.94, note: "Premier Rain core" },
  { pair: ["kingambit","incineroar"], prob: 0.84, note: "Double Dark pivot core" },
  { pair: ["basculegion-male","archaludon"], prob: 0.79, note: "Rain offense synergy" },
  { pair: ["rotom-wash","sneasler"], prob: 0.77, note: "Pivot + fast offense core" },
  { pair: ["sinistcha","incineroar"], prob: 0.71, note: "Bulky utility pivot core" },
  { pair: ["sneasler","sinistcha"], prob: 0.78, note: "Fast offense + sustain support" },
  { pair: ["basculegion-male","incineroar"], prob: 0.75, note: "Offense + pivot utility" },
  { pair: ["basculegion-male","sinistcha"], prob: 0.69, note: "Ghost pressure + sustain" },
  { pair: ["dragonite","sneasler"], prob: 0.81, note: "Priority + speed offense" },
  { pair: ["pelipper","sneasler"], prob: 0.66, note: "Rain offense support core" },
  { pair: ["garchomp","whimsicott"], prob: 0.88, note: "Tailwind supported offense" },
  { pair: ["charizard","whimsicott"], prob: 0.86, note: "Sun offense support core" },
  { pair: ["sneasler","incineroar"], prob: 0.83, note: "Offense + Fake Out support" },
  { pair: ["garchomp","incineroar"], prob: 0.87, note: "Balanced offense pivot core" },
  { pair: ["sneasler","milotic"], prob: 0.72, note: "Competitive pressure core" },
  { pair: ["sneasler","whimsicott"], prob: 0.89, note: "Tailwind hyper offense" },
  { pair: ["rotom-wash","incineroar"], prob: 0.76, note: "Bulky pivot core" },
  { pair: ["sneasler","archaludon"], prob: 0.74, note: "Fast offense + bulky breaker" },
  { pair: ["garchomp","sinistcha"], prob: 0.70, note: "Bulky offense utility core" },
  { pair: ["charizard","incineroar"], prob: 0.77, note: "Double Fire offensive pressure" },
  { pair: ["tyranitar","excadrill"], prob: 0.91, note: "Classic Sand core" },
  { pair: ["tyranitar","sinistcha"], prob: 0.63, note: "Sand + sustain utility" },
  { pair: ["garchomp","venusaur"], prob: 0.68, note: "Fast offensive coverage" },
  { pair: ["garchomp","milotic"], prob: 0.72, note: "Balanced offensive coverage" },
  { pair: ["milotic","incineroar"], prob: 0.78, note: "Competitive anti-Intimidate core" },
  { pair: ["incineroar","venusaur"], prob: 0.64, note: "Bulky sun support core" },
  { pair: ["charizard","venusaur"], prob: 0.90, note: "Classic Sun core" },
  { pair: ["farigiraf","incineroar"], prob: 0.73, note: "Trick Room support core" },
  { pair: ["incineroar","whimsicott"], prob: 0.75, note: "Tailwind pivot support" },
];

const ABILITY_CONFLICTS = [
  { userAbility: "intimidate", oppAbility: "defiant", penalty: 4, note: "Intimidate triggers Defiant +2 Atk" },
  { userAbility: "intimidate", oppAbility: "competitive", penalty: 4, note: "Intimidate triggers Competitive +2 SpA" },
  { userAbility: "intimidate", oppAbility: "contrary", penalty: 3, note: "Intimidate boosts Contrary users" },
  { userAbility: "drought", oppAbility: "cloud-nine", penalty: 3, note: "Cloud Nine nullifies Sun" },
  { userAbility: "drizzle", oppAbility: "cloud-nine", penalty: 3, note: "Cloud Nine nullifies Rain" },
];

const ARCHETYPE_ABUSERS = {
  trickroom: ["kingambit","golurk","mega-golurk","blastoise","mega-blastoise","torkoal","drampa","mega-drampa","hatterene","crabominable","mega-crabominable","camerupt","mega-camerupt"],
  rain: ["archaludon","basculegion-male","basculegion-female","meganium","mega-meganium","raichu","raichu-alola","starmie","mega-starmie"],
  sun: ["venusaur","cherrim","charizard","volcarona","torkoal","leafeon","victreebel","mega-victreebel","camerupt","mega-camerupt"],
  sand: ["excadrill","garchomp","stoutland","hippowdon","lycanroc-midnight","lycanroc","lycanroc-dusk"],
  snow: ["abomasnow","weavile","aurorus","froslass","ninetails-alola","zoroark-hisui","slowking-galarian","rotom-frost","vanilluxe"],
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

function detectArchetype(oppKeys, metaByKey) {
  const detected = [];

  for (const key of oppKeys) {
    const meta = metaByKey[key];
    if (!meta) continue;

    // Check top ability first — stronger signal
    const topAbility = meta.top_abilities?.[0];
    if (topAbility) {
      const abilityName = abilitiesData[topAbility.id];
      if (abilityName) {
        const abilityKey = abilityName.toLowerCase().replace(/\s+/g, "-");
        const archetype = ARCHETYPE_RULES.abilities[abilityKey];
        if (archetype) {
          detected.push({ archetype, setter: key, confidence: 0.9, source: "ability" });
          continue;
        }
      }
    }

    // Check top moves — weaker signal
    for (const move of (meta.top_moves || []).slice(0, 4)) {
      const moveName = movesData[move.id]?.name;
      if (!moveName) continue;
      const moveKey = moveName.toLowerCase().replace(/\s+/g, "-");
      const archetype = ARCHETYPE_RULES.moves[moveKey];
      if (archetype) {
        detected.push({ archetype, setter: key, confidence: 0.7, source: "move" });
        break;
      }
    }
  }

  if (detected.length === 0) {
    return { archetype: "standard", setter: null, confidence: 0.3 };
  }

  // Deduplicate — one entry per archetype, best setter wins
  const byArchetype = {};
  for (const entry of detected) {
    const existing = byArchetype[entry.archetype];
    if (!existing) {
      byArchetype[entry.archetype] = entry;
    } else {
      // Higher confidence wins, usage rate as tiebreaker
      const entryUsage = metaByKey[entry.setter]?.usage_rate ?? 0;
      const existingUsage = metaByKey[existing.setter]?.usage_rate ?? 0;
      if (entry.confidence > existing.confidence || 
         (entry.confidence === existing.confidence && entryUsage > existingUsage)) {
        byArchetype[entry.archetype] = entry;
      }
    }
  }

  const deduplicated = Object.values(byArchetype).sort((a, b) => b.confidence - a.confidence);

  return {
    archetype: deduplicated[0].archetype,
    setter: deduplicated[0].setter,
    confidence: deduplicated[0].confidence,
    isDualMode: deduplicated.length > 1,
    allDetected: deduplicated,
  };
}

function predictLeads(setter, oppKeys, metaByKey) {
  if (!setter) {
    return null;
  }

  const setterMeta = metaByKey[setter];
  if (!setterMeta || !setterMeta.top_teammates || setterMeta.top_teammates.length === 0) {
    return null;
  }

  // Use array position as rank — usage values are 0.0 in scraper but order is correct
  const partner = setterMeta.top_teammates
    .map((t) => dexIdToKey[String(t.id)])
    .filter((key) => key && oppKeys.includes(key) && key !== setter)
    [0] || null;

  if (!partner) return null;

  return [setter, partner];
}

function predictBring(predictedLeadKeys, oppKeys, metaByKey) {
  const remaining = oppKeys.filter((k) => !predictedLeadKeys.includes(k));
  if (remaining.length <= 2) return remaining;

  // Score each remaining Pokémon by how early it appears in either lead's teammate list
  const scores = {};
  for (const k of remaining) scores[k] = 0;

  for (const leadKey of predictedLeadKeys) {
    const meta = metaByKey[leadKey];
    if (!meta || !meta.top_teammates) continue;

    meta.top_teammates.forEach((t, idx) => {
      const key = dexIdToKey[String(t.id)];
      if (key && remaining.includes(key)) {
        // Earlier position = higher score; invert index
        scores[key] += (meta.top_teammates.length - idx);
      }
    });
  }

  return remaining
    .slice()
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 2);
}

function analyzeMatchup(opponentNames, myTeam, metaData, metaByKey) {
  const validOpponentNames = opponentNames.map((name) => normalize(name)).filter((key) => isChampionKey(key));
  const opp = validOpponentNames.map((key) => {
    const meta = metaByKey[key] || null;
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
  const archetypeResult = detectArchetype(oppKeys, metaByKey);
  const archetype = archetypeResult.archetype;
  const archetypeSetter = archetypeResult.setter;

  const byUsage = opp.slice().sort((a, b) => b.usageRate - a.usageRate);

  // Build lead pairs — one per detected archetype if dual-mode
  const allDetected = archetypeResult.allDetected || [];
  let leadPairs = [];

  if (allDetected.length > 1) {
    // Dual-mode: generate a lead pair for each detected archetype
    for (const detected of allDetected) {
      const keys = predictLeads(detected.setter, oppKeys, metaByKey);
      if (keys) {
        leadPairs.push({
          archetype: detected.archetype,
          confidence: detected.confidence,
          keys: keys,
          mons: keys.map((k) => opp.find((p) => p.key === k)).filter(Boolean),
        });
      }
    }
  }

  // Single archetype or fallback
  if (leadPairs.length === 0) {
    const keys = predictLeads(archetypeSetter, oppKeys, metaByKey)
      || byUsage.slice(0, 2).map((p) => p.key);
    leadPairs.push({
      archetype: archetype,
      confidence: archetypeResult.confidence,
      keys: keys,
      mons: keys.map((k) => opp.find((p) => p.key === k)).filter(Boolean),
    });
  }

  // Primary lead pair drives bring prediction
  const primaryLeadKeys = leadPairs[0].keys;
  const predictedLeads = leadPairs[0].mons;
  const predictedLeadKeys = primaryLeadKeys;

  const backKeys = predictBring(predictedLeadKeys, oppKeys, metaByKey);
  const predictedBring = [
    ...predictedLeads,
    ...backKeys.map((k) => opp.find((p) => p.key === k)).filter(Boolean),
  ];

  const uncertaintyFlags = [];
  if (archetypeResult.isDualMode) {
    uncertaintyFlags.push({
      slot: "lead",
      severity: "medium",
      reason: "Multiple archetypes detected — dual-mode team possible",
    });
  }

  const myScored = myTeam.filter((m) => m.name.trim()).map((mon) => {
    const monKey = normalize(mon.name);
    const monTypes = pokemonData[monKey]?.types ?? ["normal"];
    const ab = (mon.ability || "").toLowerCase();
    const moves = (mon.moves || []).map((m) => m.toLowerCase());
    let score = 0;
    const reasons = [];
    const warnings = [];

    const myMoveDmg = moves
      .map(mv => movesByName[mv.replace(/\s+/g, "-")])
      .filter(d => d && d.bp >= 40);

    for (const o of predictedBring) {
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
    leadPairs: leadPairs,
    leadNote: archetypeSetter ? archetypeResult.archetype + " setter detected" : null,
    archetype: archetype,
    archetypeConfidence: archetypeResult.confidence,
    isDualMode: archetypeResult.isDualMode || false,
    allDetected: allDetected,
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
    { name: "", ability: "", item: "", moves: ["","","",""], shiny: false },
    { name: "", ability: "", item: "", moves: ["","","",""], shiny: false },
    { name: "", ability: "", item: "", moves: ["","","",""], shiny: false },
    { name: "", ability: "", item: "", moves: ["","","",""], shiny: false },
    { name: "", ability: "", item: "", moves: ["","","",""], shiny: false },
    { name: "", ability: "", item: "", moves: ["","","",""], shiny: false },
  ];
}

export default function App() {
  const [tab, setTab] = useState("team");
  const [teams, setTeams] = useState(function() {
  // One-time migration: ts_team_v4 → ts_teams_v1
  const existing = storage.get("ts_teams_v1", null);
  if (existing) return existing;
  const v4 = storage.get("ts_team_v4", null);
  const initial = [{ id: 1, name: "Team 1", roster: v4 || getDefaultTeam() }];
  storage.set("ts_teams_v1", initial);
  return initial;
});
const [activeTeamIdx, setActiveTeamIdx] = useState(0);
const [editingTeam, setEditingTeam] = useState(false);

// Derived — every consumer stays unchanged:
const myTeam = teams[activeTeamIdx]?.roster || getDefaultTeam();
  const [metaData, setMetaData] = useState(null);
  const [metaStatus, setMetaStatus] = useState("loading");
  const [metaByKey, setMetaByKey] = useState({});
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
    .then(function(d) {
      const byKey = {};
      for (const entry of (d.pokemon_usage || [])) {
        const key = normalize(entry.name);
        byKey[key] = entry;
      }
      setMetaByKey(byKey);
      setMetaData(d);
      setMetaStatus("live");
    })
    .catch(function() { setMetaStatus("offline"); });
  }, []);

   useEffect(function() {
    // Clean up any particles from the previous theme
    document.querySelectorAll('.theme-particle').forEach(function(el) { el.remove(); });
    const body = document.body;

    // ─────────────────────────────────────────────────────────────────────────────
    // GEN 3 PARTICLE INJECTION
    // Paste each block into the existing useEffect([theme]) in App.jsx,
    // inside the if-chain that handles per-theme particle injection.
    // ─────────────────────────────────────────────────────────────────────────────

    // ── EMERALD ────────────────────────────────────────────────────────────────
    if (theme === 'emerald') {
      // Energy rings — drift upward and shrink as they rise
      for (let i = 0; i < 8; i++) {
        const r = document.createElement('div');
        const sz = 60 + Math.random() * 80; // 60–140px
        r.className = 'emerald-ring theme-particle';
        r.style.cssText = `
          left: ${10 + Math.random() * 80}%;
          top: ${30 + Math.random() * 40}%;
          width: ${sz}px;
          height: ${sz}px;
          border-width: ${Math.random() > 0.5 ? 1 : 2}px;
          animation-duration: ${8 + Math.random() * 6}s;
          animation-delay: ${Math.random() * 12}s;
        `;
        body.appendChild(r);
      }

      // Wind streaks — upper third, right-to-left, fast
      for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        const w = 60 + Math.random() * 60; // 60–120px
        s.className = 'emerald-streak theme-particle';
        s.style.cssText = `
          top: ${5 + Math.random() * 28}%;
          right: ${-w}px;
          width: ${w}px;
          animation-duration: ${2 + Math.random() * 2}s;
          animation-delay: ${Math.random() * 6}s;
        `;
        body.appendChild(s);
      }

      // Star twinkles — scattered across upper viewport
      const starCount = 6 + Math.floor(Math.random() * 3); // 6–8
      for (let i = 0; i < starCount; i++) {
        const st = document.createElement('div');
        const sz = Math.random() > 0.5 ? 1 : 2;
        st.className = 'emerald-star theme-particle';
        st.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 55}%;
          width: ${sz}px;
          height: ${sz}px;
          animation-duration: ${3 + Math.random() * 4}s;
          animation-delay: ${Math.random() * 5}s;
        `;
        body.appendChild(st);
      }
    }

    // ── SAPPHIRE ───────────────────────────────────────────────────────────────
    if (theme === 'sapphire') {
      // Kyogre presence bloom — static DOM element, JS will control opacity
      const bloom = document.createElement('div');
      bloom.className = 'sapphire-presence-bloom theme-particle';
      bloom.id = 'kyogre-bloom';
      body.appendChild(bloom);

      // Bubbles — slow upward drift from bottom
      for (let i = 0; i < 22; i++) {
        const b = document.createElement('div');
        const sz = 1.5 + Math.random() * 2.5; // 1.5–4px
        b.className = 'sapphire-bubble theme-particle';
        b.style.cssText = `
          left: ${Math.random() * 100}%;
          bottom: ${-sz}px;
          width: ${sz}px;
          height: ${sz}px;
          animation-duration: ${9 + Math.random() * 9}s;
          animation-delay: ${Math.random() * 12}s;
        `;
        body.appendChild(b);
      }

      // Caustic light patches — upper third
      for (let i = 0; i < 3; i++) {
        const c = document.createElement('div');
        const sz = 30 + Math.random() * 20; // 30–50px
        c.className = 'sapphire-caustic theme-particle';
        c.style.cssText = `
          left: ${10 + Math.random() * 75}%;
          top: ${5 + Math.random() * 28}%;
          width: ${sz}px;
          height: ${sz}px;
          animation-duration: ${6 + Math.random() * 2}s;
          animation-delay: ${Math.random() * 5}s;
        `;
        body.appendChild(c);
      }

      // Current streaks — mid to upper viewport
      const streakCount = 2 + (Math.random() > 0.5 ? 1 : 0); // 2–3
      for (let i = 0; i < streakCount; i++) {
        const sk = document.createElement('div');
        const w = 80 + Math.random() * 60; // 80–140px
        sk.className = 'sapphire-streak theme-particle';
        sk.style.cssText = `
          top: ${15 + Math.random() * 50}%;
          left: ${-w}px;
          width: ${w}px;
          animation-duration: ${20 + Math.random() * 8}s;
          animation-delay: ${Math.random() * 15}s;
        `;
        body.appendChild(sk);
      }
    }

    // ── RUBY ───────────────────────────────────────────────────────────────────
    if (theme === 'ruby') {
      // Small embers
      for (let i = 0; i < 22; i++) {
        const e = document.createElement('div');
        const sz = 2 + Math.random() * 3; // 2–5px
        // Varied colors — real embers aren't uniform
        const colors = [
          `rgba(${180 + Math.floor(Math.random() * 55)},${20 + Math.floor(Math.random() * 40)},0,0.8)`,
          `rgba(255,${80 + Math.floor(Math.random() * 60)},0,0.9)`,
          `rgba(255,${140 + Math.floor(Math.random() * 60)},0,0.7)`,
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        e.className = 'ruby-ember theme-particle';
        e.style.cssText = `
          left: ${20 + Math.random() * 60}%;
          bottom: ${Math.random() * 20}%;
          width: ${sz}px;
          height: ${sz}px;
          background: ${color};
          box-shadow: 0 0 ${sz * 2}px ${color};
          animation-duration: ${4 + Math.random() * 4}s;
          animation-delay: ${Math.random() * 6}s;
        `;
        body.appendChild(e);
      }

      // Large ember clusters — more dramatic, catch the eye
      for (let i = 0; i < 4 + (Math.random() > 0.5 ? 1 : 0); i++) {
        const e = document.createElement('div');
        const sz = 6 + Math.random() * 2; // 6–8px
        const col = Math.random() > 0.5 ? 'rgba(255,80,0,0.9)' : 'rgba(255,140,0,0.85)';
        e.className = 'ruby-ember-large theme-particle';
        e.style.cssText = `
          left: ${15 + Math.random() * 70}%;
          bottom: ${Math.random() * 18}%;
          width: ${sz}px;
          height: ${sz}px;
          background: ${col};
          box-shadow: 0 0 ${sz * 4}px rgba(255,100,0,0.6), 0 0 ${sz * 8}px rgba(200,40,0,0.3);
          animation-duration: ${4 + Math.random() * 3}s;
          animation-delay: ${Math.random() * 5}s;
        `;
        body.appendChild(e);
      }

      // Heat shimmer waves — staggered, never sync
      const shimmerOffsets = [0, 2.2, 4.7];
      shimmerOffsets.forEach(function(delay) {
        const sh = document.createElement('div');
        const topPct = 30 + Math.random() * 50;
        sh.className = 'ruby-shimmer theme-particle';
        sh.style.cssText = `
          top: ${topPct}%;
          animation-duration: ${6 + Math.random() * 2}s;
          animation-delay: ${delay}s;
        `;
        body.appendChild(sh);
      });
    }

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

    // ─── ADD INSIDE THE EXISTING useEffect([theme]) PARTICLE BLOCK ──────────────
    // Place after the existing `if (theme === 'violet') { ... }` block,
    // before the `return function() { ... }` cleanup line.
    if (theme === 'x') {
      // Leaves — gentle tumbling drift downward
      for (let i = 0; i < 16; i++) {
        
        const l = document.createElement('div');
        const sz = 8 + Math.random() * 12;
        const isGold = Math.random() > 0.6;
        l.className = 'x-leaf theme-particle';
        l.style.cssText = `
          left:${5 + Math.random() * 90}%;
          top:${-5 + Math.random() * 20}%;
          width:${sz}px;
          height:${sz}px;
          background:${isGold ? 'rgba(212,180,120,0.7)' : 'rgba(160,230,180,0.7)'};
          animation-duration:${10 + Math.random() * 12}s;
          animation-delay:${Math.random() * 10}s;
        `;
        body.appendChild(l);
      }
        
      // Spores — slow upward float, cycling hue
      for (let i = 0; i < 20; i++) {
        const sp = document.createElement('div');
        const sz = 2 + Math.random() * 3;
        sp.className = 'x-spore theme-particle';
        sp.style.cssText = `
          left:${Math.random() * 100}%;
          top:${30 + Math.random() * 70}%;
          width:${sz}px;
          height:${sz}px;
          animation-duration:${8 + Math.random() * 10}s;
          animation-delay:${Math.random() * 8}s;
        `;
        body.appendChild(sp);
      }

      // Mega gems — Key Stone rhombuses at screen edges
      const xGemData = [
        { top: '8%',  left: '4%'  },
        { top: '20%', left: '94%' },
        { top: '55%', left: '2%'  },
        { top: '70%', left: '92%' },
        { top: '85%', left: '15%' },
        { top: '40%', left: '96%' },
      ];
      xGemData.forEach(function(d) {
        const g = document.createElement('div');
        const sz = 8 + Math.random() * 6;
        g.className = 'x-mega theme-particle';
        g.style.cssText = `
          top:${d.top};
          left:${d.left};
          width:${sz}px;
          height:${sz}px;
          background:linear-gradient(135deg, rgba(212,168,255,0.7), rgba(168,212,255,0.5));
          animation-duration:${3 + Math.random() * 3}s;
          animation-delay:${Math.random() * 3}s;
        `;
        body.appendChild(g);
      });
    }

    if (theme === 'y') {
      // Feathers — fully chaotic random directions
      for (let i = 0; i < 22; i++) {
        const f = document.createElement('div');
        const sz = 6 + Math.random() * 16;
        const dur = 3 + Math.random() * 11;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        // Random travel direction
        const dx = (Math.random() - 0.5) * 200;
        const dy = (Math.random() - 0.5) * 200;
        const rot = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
        const depth = 0.5 + Math.random() * 0.5;
        f.className = 'y-feather theme-particle';
        f.style.cssText = `
          left:${startX}%;
          top:${startY}%;
          width:${sz}px;
          height:${sz * 1.4}px;
          background:rgba(${140 + Math.floor(Math.random()*60)},${Math.floor(Math.random()*20)},${20 + Math.floor(Math.random()*30)},${depth * 0.7});
          animation-duration:${dur}s;
          animation-delay:${Math.random() * 8}s;
          --y-start: translate(0px, 0px);
          --y-end: translate(${dx}px, ${dy}px);
          --y-rot: ${rot}deg;
        `;
        body.appendChild(f);
      }

      // Mega gems — crimson Key Stone rhombuses
      const yGemData = [
        { top: '12%', left: '6%'  },
        { top: '35%', left: '91%' },
        { top: '60%', left: '5%'  },
        { top: '78%', left: '88%' },
        { top: '88%', left: '50%' },
      ];
      yGemData.forEach(function(d) {
        const g = document.createElement('div');
        const sz = 10 + Math.random() * 6;
        g.className = 'y-mega theme-particle';
        g.style.cssText = `
          top:${d.top};
          left:${d.left};
          width:${sz}px;
          height:${sz}px;
          background:rgba(200,20,30,0.6);
          animation-duration:${1.5 + Math.random() * 1.5}s;
          animation-delay:${Math.random() * 2}s;
        `;
        body.appendChild(g);
      });
    }

    if (theme === 'legendsza') {
      // Floating hex cells — untethered, slow drift
      for (let i = 0; i < 12; i++) {
        const h = document.createElement('div');
        const sz = 6 + Math.random() * 10;
        const dx = (Math.random() - 0.5) * 28;
        const dy = (Math.random() - 0.5) * 20;
        h.className = 'za-hex theme-particle';
        h.style.cssText = `
          left:${Math.random() * 100}%;
          top:${Math.random() * 100}%;
          width:${sz}px;
          height:${sz}px;
          background:rgba(40,200,80,${0.15 + Math.random() * 0.25});
          animation-duration:${10 + Math.random() * 10}s;
          animation-delay:${Math.random() * 8}s;
          --hex-dx: ${dx}px;
          --hex-dy: ${dy}px;
        `;
        body.appendChild(h);
      }

      // Mega hexes — larger, steady breath
      const zaGemData = [
        { top: '10%', left: '8%'  },
        { top: '30%', left: '88%' },
        { top: '65%', left: '5%'  },
        { top: '82%', left: '85%' },
      ];
      zaGemData.forEach(function(d) {
        const g = document.createElement('div');
        const sz = 14 + Math.random() * 6;
        g.className = 'za-mega theme-particle';
        g.style.cssText = `
          top:${d.top};
          left:${d.left};
          width:${sz}px;
          height:${sz}px;
          background:rgba(40,200,80,0.35);
          animation-duration:${3 + Math.random() * 2}s;
          animation-delay:${Math.random() * 3}s;
        `;
        body.appendChild(g);
      });

      // NOTE: The za-tracer is NOT injected here.
      // It is managed by its own separate useEffect (see below).
    }

    // ── STEP 2: useEffect PARTICLE INJECTION BLOCKS ────────────────────────────
// Paste these two blocks inside the existing useEffect(function() { ... }, [theme])
// body, alongside the existing if (theme === 'diamond') { ... } blocks.
// They go BEFORE the closing "return function() { ... }" cleanup line.
 
    if (theme === 'sun') {
      // Corona rays — 12 rays fanning from top center, staggered rotation speeds
      var rayAngles = [-80,-60,-40,-20,-5,5,20,40,60,80,100,120];
      rayAngles.forEach(function(angle, i) {
        var r = document.createElement('div');
        r.className = 'sun-ray theme-particle';
        var dur = 100 + i * 8;
        r.style.cssText = [
          'transform: translateX(-50%) rotate(' + angle + 'deg);',
          'animation-duration: ' + dur + 's;',
          'animation-delay: -' + (i * 7) + 's;',
          'opacity: ' + (0.08 + Math.random() * 0.10) + ';',
          'height: ' + (40 + Math.random() * 20) + 'vh;'
        ].join('');
        body.appendChild(r);
      });
 
      // Necrozma prismatic shards — 6 shards scattered across screen
      var shardPositions = [
        { left: '12%', top: '22%', size: 7  },
        { left: '28%', top: '58%', size: 5  },
        { left: '45%', top: '38%', size: 9  },
        { left: '62%', top: '70%', size: 6  },
        { left: '78%', top: '28%', size: 8  },
        { left: '91%', top: '55%', size: 5  },
      ];
      shardPositions.forEach(function(sp, i) {
        var s = document.createElement('div');
        s.className = 'sun-shard theme-particle';
        var totalDur = 6 + i * 1.5;
        var delayOffset = i * (totalDur / shardPositions.length);
        s.style.cssText = [
          'left: ' + sp.left + ';',
          'top: ' + sp.top + ';',
          'width: ' + sp.size + 'px;',
          'height: ' + sp.size + 'px;',
          'animation-duration: ' + totalDur + 's;',
          'animation-delay: -' + delayOffset + 's;'
        ].join('');
        body.appendChild(s);
      });
 
      // Gold ember motes — 18 drifting upward
      for (var i = 0; i < 18; i++) {
        var m = document.createElement('div');
        var sz = 1 + Math.random() * 2;
        m.className = 'sun-mote theme-particle';
        m.style.cssText = [
          'left: ' + (10 + Math.random() * 80) + '%;',
          'bottom: ' + (Math.random() * 30) + '%;',
          'width: ' + sz + 'px;',
          'height: ' + sz + 'px;',
          'animation-duration: ' + (5 + Math.random() * 8) + 's;',
          'animation-delay: -' + (Math.random() * 8) + 's;'
        ].join('');
        body.appendChild(m);
      }
    }
 
    if (theme === 'moon') {
      // Moon phase element — single container with shadow child
      var moonEl = document.createElement('div');
      moonEl.className = 'moon-phase theme-particle';
 
      var shadowEl = document.createElement('div');
      shadowEl.className = 'moon-shadow';
      moonEl.appendChild(shadowEl);
      body.appendChild(moonEl);
 
      // Distant stars — 45 tiny 1px dots
      for (var i = 0; i < 45; i++) {
        var sf = document.createElement('div');
        sf.className = 'moon-star-far theme-particle';
        sf.style.cssText = [
          'left: ' + (Math.random() * 100) + '%;',
          'top: ' + (Math.random() * 100) + '%;',
          'animation-duration: ' + (3 + Math.random() * 4) + 's;',
          'animation-delay: -' + (Math.random() * 6) + 's;',
          'opacity: ' + (0.2 + Math.random() * 0.5) + ';'
        ].join('');
        body.appendChild(sf);
      }
 
      // Near stars — 20 slightly larger 2px dots
      for (var i = 0; i < 20; i++) {
        var sn = document.createElement('div');
        sn.className = 'moon-star-near theme-particle';
        sn.style.cssText = [
          'left: ' + (Math.random() * 100) + '%;',
          'top: ' + (Math.random() * 100) + '%;',
          'animation-duration: ' + (1.5 + Math.random() * 2.5) + 's;',
          'animation-delay: -' + (Math.random() * 4) + 's;',
          'opacity: ' + (0.35 + Math.random() * 0.4) + ';'
        ].join('');
        body.appendChild(sn);
      }
    }

    if (theme === 'zacian') {
      // Blade flashes — diagonal sweeping lines
      const bladeData = [
        { top:'15%', left:'10%', w:120, h:2, dur:6,  delay:0 },
        { top:'35%', left:'55%', w:90,  h:2, dur:8,  delay:2.1 },
        { top:'60%', left:'25%', w:150, h:2, dur:7,  delay:4.3 },
        { top:'75%', left:'70%', w:80,  h:2, dur:5,  delay:1.5 },
        { top:'45%', left:'80%', w:110, h:2, dur:9,  delay:3.8 },
      ];
      bladeData.forEach(function(d) {
        const b = document.createElement('div');
        b.className = 'zacian-blade theme-particle';
        b.style.cssText = `top:${d.top};left:${d.left};width:${d.w}px;height:${d.h}px;transform:rotate(-38deg);animation-duration:${d.dur}s;animation-delay:${d.delay}s;`;
        body.appendChild(b);
      });

      // Steel mist orbs
      for (let i = 0; i < 12; i++) {
        const m = document.createElement('div');
        const sz = 20 + Math.random() * 60;
        m.className = 'zacian-mist theme-particle';
        m.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${6+Math.random()*8}s;animation-delay:${Math.random()*6}s;`;
        body.appendChild(m);
     }
    }
    if (theme === 'zamazenta') {
      // Shield ripple rings — stacked at center-ish positions
      const ringData = [
        { w:300, h:300, top:'40%', left:'50%', dur:4,  delay:0 },
        { w:220, h:220, top:'40%', left:'50%', dur:4,  delay:1.3 },
        { w:140, h:140, top:'40%', left:'50%', dur:4,  delay:2.6 },
        { w:400, h:400, top:'60%', left:'20%', dur:6,  delay:0.8 },
        { w:260, h:260, top:'20%', left:'80%', dur:5,  delay:2.0 },
      ];
      ringData.forEach(function(d) {
      const r = document.createElement('div');
      r.className = 'zamazenta-ring theme-particle';
      r.style.cssText = `width:${d.w}px;height:${d.h}px;top:${d.top};left:${d.left};animation-duration:${d.dur}s;animation-delay:${d.delay}s;`;
      body.appendChild(r);
      });

      // Silver motes
      for (let i = 0; i < 18; i++) {
      const mo = document.createElement('div');
      const sz = 2 + Math.random() * 5;
      mo.className = 'zamazenta-mote theme-particle';
      mo.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;box-shadow:0 0 ${sz*3}px rgba(180,210,255,0.6);animation-duration:${5+Math.random()*8}s;animation-delay:${Math.random()*7}s;`;
      body.appendChild(mo);
      }
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

  // ─── ADD AS A SEPARATE useEffect IN App.jsx ──────────────────────────────────
// Place after the existing particle injection useEffect([theme]).
// This manages the Legends: Z-A tracer sequencer independently.

  useEffect(function() {
    if (theme !== 'legendsza') return;

    const body = document.body;
    // Hex-aligned angles: 0°, 60°, 120°, 180°, 240°, 300°
    const angles = [0, 60, 120, 180, 240, 300];
    let timeoutId = null;
    let active = true;

    function fireTracer() {
      if (!active) return;

      const angle = angles[Math.floor(Math.random() * angles.length)];
      const rad = (angle * Math.PI) / 180;
      const length = 60 + Math.random() * 60; // 60–120px

      // Pick a random entry edge based on angle direction
      // We place the tracer so it will traverse the viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let startX, startY;
      // Bias start position to the opposite side of travel direction
      if (angle < 90 || angle >= 270) {
        // traveling rightward component — start from left side
        startX = -length;
        startY = Math.random() * vh;
      } else {
        // traveling leftward component — start from right side
        startX = vw + length;
        startY = Math.random() * vh;
      }
      // Add vertical variance based on angle
      if (angle > 30 && angle < 150) {
        startY = Math.random() * (vh * 0.3); // bias upper portion
      } else if (angle > 180 && angle < 330) {
        startY = vh * 0.5 + Math.random() * (vh * 0.5); // bias lower portion
      }

      const tracer = document.createElement('div');
      tracer.className = 'za-tracer theme-particle';

      // Travel distance — enough to cross the viewport diagonally
      const travelDist = Math.sqrt(vw * vw + vh * vh) + length;
      const duration = travelDist / (80 + Math.random() * 40); // ~80-120px/s

      tracer.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        width: ${length}px;
        transform: rotate(${angle}deg);
        animation-duration: ${duration}s;
      `;

      // Move it across the screen via a CSS custom property approach:
      // We animate using a keyframe that shifts it along its angle
      // Since CSS keyframe can't do dynamic values easily, we use JS to
      // drive the position with requestAnimationFrame.
      body.appendChild(tracer);

      const startTime = performance.now();
      const durationMs = duration * 1000;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);

      function tick(now) {
        if (!active) { tracer.remove(); return; }
        const elapsed = now - startTime;
        const progress = elapsed / durationMs;
        if (progress >= 1) {
          tracer.remove();
          // 5-second pause then fire again
          timeoutId = setTimeout(function() {
            if (active) fireTracer();
          }, 5000);
          return;
        }
        const dist = progress * travelDist;
        const x = startX + cosA * dist;
        const y = startY + sinA * dist;
        tracer.style.left = x + 'px';
        tracer.style.top  = y + 'px';
        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    // Initial delay before first tracer
    timeoutId = setTimeout(fireTracer, 1200);

    return function() {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
      document.querySelectorAll('.za-tracer').forEach(function(el) { el.remove(); });
    };
  }, [theme]);

    // Dynamax event — fires on random 30-60s interval for Gen 8 themes
  useEffect(function() {
    if (theme !== 'zacian' && theme !== 'zamazenta') return;

    let timeoutId;

    function fireDynamaxEvent() {
      const body = document.body;

      // Phase 1: The Beam
      const beam = document.createElement('div');
      beam.className = 'dynamax-beam theme-particle';
      body.appendChild(beam);

      // Remove beam after animation
      setTimeout(function() { beam.remove(); }, 800);

      // Phase 2: Reverberation — random between cascade and simultaneous
      const isCascade = Math.random() > 0.5;

      setTimeout(function() {
        if (isCascade) {
          // Cascade: top → left+right → bottom
          const top = document.createElement('div');
          top.className = 'dynamax-edge dynamax-edge-top theme-particle';
          body.appendChild(top);
          setTimeout(function() { top.remove(); }, 700);

          setTimeout(function() {
            const left = document.createElement('div');
            const right = document.createElement('div');
            left.className = 'dynamax-edge dynamax-edge-left theme-particle';
            right.className = 'dynamax-edge dynamax-edge-right theme-particle';
            body.appendChild(left);
            body.appendChild(right);
            setTimeout(function() { left.remove(); right.remove(); }, 700);
          }, 200);

          setTimeout(function() {
            const bottom = document.createElement('div');
            bottom.className = 'dynamax-edge dynamax-edge-bottom theme-particle';
            body.appendChild(bottom);
            setTimeout(function() { bottom.remove(); }, 700);
          }, 400);

        } else {
          // Simultaneous: all four edges at once
          ['top','bottom','left','right'].forEach(function(side) {
          const edge = document.createElement('div');
            edge.className = `dynamax-edge dynamax-edge-${side} theme-particle`;
            body.appendChild(edge);
            setTimeout(function() { edge.remove(); }, 700);
          });
        }

        // Schedule next event
        timeoutId = setTimeout(fireDynamaxEvent, 30000 + Math.random() * 30000);

      }, 500); // slight delay after beam before edges fire
    }

    // Initial delay before first event
    timeoutId = setTimeout(fireDynamaxEvent, 30000 + Math.random() * 30000);

    return function() {
      clearTimeout(timeoutId);
      // Clean up any mid-animation dynamax elements
      document.querySelectorAll('.dynamax-beam, .dynamax-edge').forEach(function(el) { el.remove(); });
    };
  }, [theme]);

    // ─────────────────────────────────────────────────────────────────────────────
    // KYOGRE PRESENCE SPIKE SYSTEM
    // This is a SEPARATE useEffect — paste it after the main particle useEffect.
    // It controls the sapphire-presence-bloom element's opacity via JS timing
    // to create the unpredictable Kyogre presence effect.
    // ─────────────────────────────────────────────────────────────────────────────

    // Add this useEffect to App.jsx (after the existing particle useEffect):
    useEffect(function() {
      if (theme !== 'sapphire') return;

      let timeoutId;

      function scheduleSpike() {
        // Re-randomize interval every time — 8 to 25 seconds
        const delay = 8000 + Math.random() * 17000;
        timeoutId = setTimeout(function() {
          const bloom = document.getElementById('kyogre-bloom');
          if (!bloom) { scheduleSpike(); return; }

          // Spike up
          bloom.style.transition = 'opacity 0.8s ease-in';
          bloom.style.opacity = '0.095';

          // Decay back
          setTimeout(function() {
            bloom.style.transition = 'opacity 1.2s ease-out';
            bloom.style.opacity = '0.045';
            // Schedule next spike only after decay completes
            setTimeout(scheduleSpike, 1400);
          }, 900);
        }, delay);
      }

      scheduleSpike();

      return function() {
        clearTimeout(timeoutId);
      };
    }, [theme]);


  function saveTeam(t) {
  setTeams(function(prev) {
    const next = prev.map(function(team, i) {
      return i === activeTeamIdx ? Object.assign({}, team, { roster: t }) : team;
    });
    storage.set("ts_teams_v1", next);
    return next;
  });
}

function renameTeam(name) {
  setTeams(function(prev) {
    const next = prev.map(function(team, i) {
      return i === activeTeamIdx ? Object.assign({}, team, { name: name }) : team;
    });
    storage.set("ts_teams_v1", next);
    return next;
  });
}

function addTeam() {
  if (teams.length >= MAX_TEAMS) return;
  setTeams(function(prev) {
    const newId = Date.now();
    const newName = "Team " + (prev.length + 1);
    const next = prev.concat([{ id: newId, name: newName, roster: getDefaultTeam() }]);
    storage.set("ts_teams_v1", next);
    return next;
  });
  setActiveTeamIdx(teams.length);
}

function deleteTeam(idx) {
  if (teams.length <= 1) return;
  setTeams(function(prev) {
    const next = prev.filter(function(_, i) { return i !== idx; });
    storage.set("ts_teams_v1", next);
    return next;
  });
  setActiveTeamIdx(function(prev) { return prev >= idx && prev > 0 ? prev - 1 : 0; });
}

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
      setAnalysis(analyzeMatchup(filled, myTeam, metaData, metaByKey));
      setAnalyzing(false);
    }, 500);
  }, [opponent, myTeam, metaData, metaByKey]);

  function logMatch() {
    if (!analysis) return;
    teamName: teams[activeTeamIdx]?.name || "Team 1",
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
    header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 0", flexWrap:"wrap", gap:10, overflow:"visible", zIndex: 9999 },
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
    input: { display:"block", width:"100%", background: C.invertedSurface ? "#ffffff" : C.bg, border:"1px solid " + C.border, borderRadius:C.borderRadius, color:C.text, padding:"7px 10px", fontSize:11, fontFamily:C.font, outline:"none", boxSizing:"border-box" },
    btnPrimary: { background:C.accent, color:"#fff", border:"none", borderRadius:C.borderRadius, padding:"9px 18px", fontSize:10, letterSpacing:2, fontFamily:C.font, fontWeight:700, cursor:"pointer" },
    btnGhost: { background:"none", color:C.muted, border:"1px solid " + C.border, borderRadius:C.borderRadius, padding:"7px 14px", fontSize:10, letterSpacing:2, fontFamily:C.font, fontWeight:700, cursor:"pointer" },
    btnDis: { opacity:0.4, cursor:"not-allowed" },
  };

  const tabs = [["team","MY TEAM"],["match","ANALYSIS"],["speed","SPEED"],["damage","DAMAGE"],["types","TYPES"],["log", "LOG" + (matchLog.length > 0 ? " (" + matchLog.length + ")" : "")]];

  return (
    <div style={st.root} className={"theme-" + theme}>
      <div style={st.header}>
        <div style={st.headerLeft}>
          <Pokeball C={C} />
          <div>
            <div style={st.title}>TEAM SCOUT</div>
            <div style={st.subtitle}>Pokemon Champions</div>
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
        {tab === "team" && <TeamTab teams={teams} activeTeamIdx={activeTeamIdx} setActiveTeamIdx={setActiveTeamIdx} myTeam={myTeam} saveTeam={saveTeam} renameTeam={renameTeam} addTeam={addTeam} deleteTeam={deleteTeam} maxTeams={MAX_TEAMS} editing={editingTeam} setEditing={setEditingTeam} st={st} C={C} />}
        {tab === "match" && <MatchTab myTeam={myTeam} opponent={opponent} setOpponent={setOpponent} runAnalysis={runAnalysis} analyzing={analyzing} analysis={analysis} metaStatus={metaStatus} logEntry={logEntry} setLogEntry={setLogEntry} logMatch={logMatch} st={st} C={C} />}
        {tab === "speed" && <SpeedTab myTeam={myTeam} st={st} C={C} />}
        {tab === "damage" && <DamageTab myTeam={myTeam} opponent={opponent} st={st} C={C} />}
        {tab === "types" && <TypeChartTab st={st} C={C} />}
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

const THEME_GROUPS = [
  { label: "Classic", themes: ["classic"] },
  { label: "Generation I", themes: ["firered", "leafgreen"] },
  { label: "Generation II", themes: ["gold", "silver"] },
  { label: "Generation III", themes: ["sapphire", "ruby", "emerald"] },
  { label: "Generation IV", themes: ["diamond", "pearl", "platinum"] },
  { label: "Generation V", themes: ["black", "white"] },
  { label: "Generation VI", themes: ["x", "y", "legendsza"] },
  { label: "Generation VII", themes: ["sun", "moon"] },
  { label: "Generation VIII", themes: ["zacian", "zamazenta"] },
  { label: "Generation IX", themes: ["scarlet", "violet"] },
];
function ThemeSelector(props) {
  const theme = props.theme;
  const setTheme = props.setTheme;
  const C = props.C;
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState("gen");
  const [activeGen, setActiveGen] = useState(null);
  const btnRef = useRef(null);
  const current = THEMES[theme] || THEMES.classic;

  function handleOpen() {
    setLevel("gen");
    setActiveGen(null);
    setOpen(!open);
  }

  function handleGenClick(group) {
    if (group.themes.length === 1 && group.themes[0] === "classic") {
      setTheme("classic");
      setOpen(false);
      setLevel("gen");
      setActiveGen(null);
      return;
    }
    setActiveGen(group);
    setLevel("theme");
  }

  function handleThemeClick(key) {
    if (!THEMES[key]) return;
    setTheme(key);
    setOpen(false);
    setLevel("gen");
    setActiveGen(null);
  }

  function handleBack() {
    setLevel("gen");
    setActiveGen(null);
  }

  const getDropStyle = function () {
    if (!btnRef.current) return {};
    const rect = btnRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    return {
      position: "fixed",
      top: rect.bottom + 4,
      right: isMobile ? "auto" : window.innerWidth - rect.right,
      left: isMobile ? 8 : "auto",
    };
  };

  const dropBase = {
    background: C.invertedSurface ? C.card : C.bg,
    border: "1px solid " + C.border,
    borderRadius: C.borderRadius,
    padding: 4,
    zIndex: 9999,
    minWidth: 180,
    boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
  };

  const itemBase = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    background: "transparent",
    border: "none",
    borderRadius: 4,
    padding: "8px 10px",
    fontFamily: "Arial, sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.cardGradient || C.card,
          border: C.borderWidth + "px solid " + (C.panelBorder || C.border),
          borderRadius: C.borderRadius,
          padding: "6px 12px",
          cursor: "pointer",
          color: C.text,
          fontSize: 9,
          fontFamily: C.font,
          fontWeight: 700,
          letterSpacing: 1,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
        onClick={handleOpen}
      >
        {current.name}
      </button>

      {open && (
        <div style={Object.assign(getDropStyle(), dropBase)}>

          {level === "gen" && (
            <div>
              {THEME_GROUPS.map(function (group) {
                return (
                  <button
                    key={group.label}
                    style={Object.assign({}, itemBase, {
                      color: C.text,
                      justifyContent: "space-between",
                    })}
                    onClick={function () { handleGenClick(group); }}
                  >
                    <span>{group.label}</span>
                    {group.themes[0] !== "classic" && (
                      <span style={{ color: C.muted, fontSize: 9 }}>›</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {level === "theme" && activeGen && (
            <div>
              <button
                style={Object.assign({}, itemBase, {
                  color: C.accent,
                  marginBottom: 4,
                  borderBottom: "1px solid " + C.border,
                  borderRadius: 0,
                  paddingBottom: 8,
                })}
                onClick={handleBack}
              >
                <span style={{ marginRight: 6 }}>←</span>
                <span>{activeGen.label}</span>
              </button>
              {activeGen.themes.map(function (key) {
                const available = !!THEMES[key];
                const isActive = theme === key;
                return (
                  <button
                    key={key}
                    disabled={!available}
                    style={Object.assign({}, itemBase, {
                      color: isActive ? C.accent : available ? C.text : C.muted,
                      opacity: available ? 1 : 0.4,
                      cursor: available ? "pointer" : "not-allowed",
                      background: isActive ? (C.invertedSurface ? C.gdim : C.faint) : "transparent",
                    })}
                    onClick={function () { handleThemeClick(key); }}
                  >
                    {THEMES[key]
                      ? THEMES[key].name
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                );
              })}
            </div>
          )}

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
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background: C.invertedSurface ? C.faint : C.card, border:"1px solid " + C.border, borderRadius:C.borderRadius, zIndex:20, maxHeight:200, overflowY:"auto", marginTop:2 }}>
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
  const { teams, activeTeamIdx, setActiveTeamIdx, myTeam, saveTeam,
          renameTeam, addTeam, deleteTeam, maxTeams,
          editing, setEditing, st, C } = props;

  const [draft, setDraft] = useState(myTeam);
  const [renamingTeam, setRenamingTeam] = useState(false);
  const [renameVal, setRenameVal] = useState("");

  useEffect(function() { setDraft(myTeam); }, [myTeam]);

  function save() { saveTeam(draft); setEditing(false); }
  function cancel() { setDraft(myTeam); setEditing(false); }
  function upd(i, f, v) {
    setDraft(function(p) {
      return p.map(function(m, idx) { return idx === i ? Object.assign({}, m, { [f]: v }) : m; });
    });
  }
  function updMove(i, mi, v) {
    setDraft(function(p) {
      return p.map(function(m, idx) {
        if (idx !== i) return m;
        const mv = m.moves.slice(); mv[mi] = v;
        return Object.assign({}, m, { moves: mv });
      });
    });
  }

  function startRename() {
    setRenameVal(teams[activeTeamIdx]?.name || "");
    setRenamingTeam(true);
  }
  function commitRename() {
    if (renameVal.trim()) renameTeam(renameVal.trim());
    setRenamingTeam(false);
  }

  const display = editing ? draft : myTeam;
  const activeTeamName = teams[activeTeamIdx]?.name || "Team 1";

  const monCard = {
    background: C.card,
    border: C.borderWidth + "px solid " + C.border,
    borderRadius: C.borderRadius,
    padding: 14,
    boxShadow: C.boxShadow,
  };
  const slot = {
    width: 22, height: 22, background: C.faint,
    border: "1px solid " + C.accent + "44",
    borderRadius: C.borderRadius - 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 9, color: C.accent, fontWeight: 700, flexShrink: 0,
  };

  return (
    <div>
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14, gap:10 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:3, color:C.accent, fontWeight:700 }}>ACTIVE TEAM</div>
          {/* Team name — static or rename input */}
          {renamingTeam ? (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
              <input
                style={Object.assign({}, st.input, { fontSize:10, padding:"3px 8px", width:120 })}
                value={renameVal}
                onChange={function(e) { setRenameVal(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenamingTeam(false); }}
                autoFocus
              />
              <button style={Object.assign({}, st.btnPrimary, { padding:"3px 10px", fontSize:9 })} onClick={commitRename}>OK</button>
              <button style={Object.assign({}, st.btnGhost, { padding:"3px 8px", fontSize:9 })} onClick={function() { setRenamingTeam(false); }}>✕</button>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
              <span style={{ fontSize:9, color:C.muted }}>{activeTeamName}</span>
              {!editing && (
                <button
                  style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:9, padding:0, fontFamily:C.font }}
                  onClick={startRename}
                  title="Rename team"
                >✎</button>
              )}
            </div>
          )}
        </div>

        {/* Right controls */}
        {!editing
          ? <button style={st.btnPrimary} onClick={function() { setDraft(myTeam); setEditing(true); }}>EDIT TEAM</button>
          : <div style={{ display:"flex", gap:8 }}>
              <button style={st.btnPrimary} onClick={save}>SAVE</button>
              <button style={st.btnGhost} onClick={cancel}>CANCEL</button>
            </div>
        }
      </div>

      {/* Team switcher row */}
      {!editing && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
          {teams.map(function(team, i) {
            const isActive = i === activeTeamIdx;
            return (
              <button
                key={team.id}
                style={{
                  padding:"5px 12px",
                  borderRadius: C.borderRadius,
                  border: "1px solid " + (isActive ? C.accent : C.border),
                  background: isActive ? C.accent + "22" : "transparent",
                  color: isActive ? C.accent : C.muted,
                  fontSize: 9,
                  fontFamily: C.font,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: 1,
                  position: "relative",
                }}
                onClick={function() { setActiveTeamIdx(i); }}
              >
                {team.name}
              </button>
            );
          })}
          {/* New team button */}
          <button
            style={{
              padding:"5px 12px",
              borderRadius: C.borderRadius,
              border: "1px dashed " + C.border,
              background: "transparent",
              color: teams.length >= maxTeams ? C.muted + "55" : C.muted,
              fontSize: 9,
              fontFamily: C.font,
              fontWeight: 700,
              cursor: teams.length >= maxTeams ? "not-allowed" : "pointer",
              letterSpacing: 1,
              opacity: teams.length >= maxTeams ? 0.5 : 1,
            }}
            onClick={addTeam}
            disabled={teams.length >= maxTeams}
            title={teams.length >= maxTeams ? "Maximum " + maxTeams + " teams" : "Add new team"}
          >
            + NEW TEAM
          </button>
          {/* Delete current team — only if more than 1 */}
          {teams.length > 1 && (
            <button
              style={{
                padding:"5px 10px",
                borderRadius: C.borderRadius,
                border: "1px solid " + C.accent + "44",
                background: "transparent",
                color: C.accent,
                fontSize: 9,
                fontFamily: C.font,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 1,
                opacity: 0.7,
              }}
              onClick={function() { deleteTeam(activeTeamIdx); }}
              title={"Delete " + activeTeamName}
            >
              DELETE
            </button>
          )}
        </div>
      )}

      {/* Pokemon grid — unchanged from original */}
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
                      return <div key={mi} style={{ background:C.faint, border:"1px solid "+C.border, borderRadius:3, padding:"2px 8px", fontSize:9, color:C.muted }}>{m}</div>;
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
          {/* Archetype cards */}
          {analysis.allDetected && analysis.allDetected.length > 0 && (
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:14 }}>
              {analysis.allDetected.map(function(detected, i) {
                return (
                  <div key={i} style={Object.assign({}, st.card, {
                    flex:1,
                    minWidth:200,
                    background:C.gdim,
                    border:"1px solid " + C.green,
                    marginBottom:0,
                  })}>
                    <div style={{ fontSize:10, color:C.green, letterSpacing:3, fontWeight:700, marginBottom:4 }}>
                      {i === 0 ? "ARCHETYPE DETECTED" : "ALSO DETECTED"}
                    </div>
                    <div style={{ fontSize:14, fontWeight:900, color:C.text, letterSpacing:2 }}>
                      {detected.archetype.toUpperCase() + " TEAM"}
                    </div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>
                      {"Setter: " + (detected.setter ? titleCase(detected.setter) : "unknown")}
                    </div>
                    <div style={{ fontSize:10, color:C.text, marginTop:4 }}>
                      {"Confidence: " + Math.round(detected.confidence * 100) + "%"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Uncertainty flags */}
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

          {/* Lead pairs — one per archetype */}
          {analysis.leadPairs && analysis.leadPairs.length > 0 && (
            <div style={st.card}>
              <div style={st.cardTitle}>PREDICTED LEADS</div>
              <div style={st.cardSub}>
                {analysis.isDualMode
                  ? "Multiple archetypes detected — showing one lead pair per archetype"
                  : "Most likely lead pair based on teammate co-occurrence"}
              </div>
              {analysis.leadPairs.map(function(pair, i) {
                return (
                  <div key={i} style={{ marginBottom: i < analysis.leadPairs.length - 1 ? 16 : 0 }}>
                    <div style={{ fontSize:9, color:C.accent, letterSpacing:2, fontWeight:700, marginBottom:8 }}>
                      {pair.archetype.toUpperCase() + " LEAD"}
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      {pair.mons.map(function(mon, mi) {
                        return (
                          <div key={mi} style={{ display:"flex", alignItems:"center", gap:8, background:C.faint, border:"1px solid " + C.green + "44", borderRadius:C.borderRadius, padding:"10px 14px", flex:1 }}>
                            <Sprite monKey={mon.key} size={44} />
                            <div>
                              <div style={{ fontSize:13, fontWeight:700 }}>{mon.name}</div>
                              <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>
                                {(mon.usageRate * 100).toFixed(1) + "% usage"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Opponent predicted bring */}
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
                      {pred.topMoves.slice(0, 4).map(function(m, mi) { return <div key={mi} style={{ fontSize:8, color:C.muted, background:C.faint, borderRadius:3, padding:"2px 6px" }}>{m}</div>; })}
                      {pred.topItem && <div style={{ fontSize:8, color:C.yellow, background:"#1a1400", borderRadius:3, padding:"2px 6px" }}>{"Item: " + pred.topItem}</div>}
                      {pred.topAbility && <div style={{ fontSize:8, color:C.blue, background:"#0d1a2e", borderRadius:3, padding:"2px 6px" }}>{"Ability: " + pred.topAbility}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Your recommended bring */}
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

          {/* Key threats */}
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

          {/* Adjustment guide */}
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

          {/* Log this match */}
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
            <span style={{ color:C.green }}>Faster</span>
            <span style={{ color:C.muted }}>Tie</span>
            <span style={{ color:C.accent }}>Slower</span>
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

// ── Component ─────────────────────────────────────────────────────────────────
function DamageTab(props) {
  const myTeam = props.myTeam;
  const opponent = props.opponent || [];
  const st = props.st;
  const C = props.C;
 
  const [attacker, setAttacker] = useState("");
  const [move, setMove] = useState("");
  const [primaryDef, setPrimaryDef] = useState("");
  const [secondaryDef, setSecondaryDef] = useState("");
  const [spreadOn, setSpreadOn] = useState(false);
  const [weather, setWeather] = useState("none");
 
  // Valid opponent names entered in Match tab
  const opponentRoster = opponent.filter(function (p) { return p.trim(); });
 
  // Attacker's move list from team entry
  const attackerMon = myTeam.find(function (m) {
    return normalize(m.name) === normalize(attacker);
  });
  const attackerMoves = attackerMon?.moves?.filter(Boolean).map(function (m) {
    return movesByName[normalize(m)] || { name: m, type: "unknown", bp: 0, category: "unknown" };
  }) || [];
 
  const attKey = normalize(attacker);
  const attData = pokemonData[attKey];
 
  // ── Core damage math ────────────────────────────────────────────────────────
  function computeResults(defenderName, spreadMultiplier) {
    if (!defenderName || !attacker || !move) return null;
 
    const defKey = normalize(defenderName);
    const defData = pokemonData[defKey];
    const moveEntry = movesData[
      Object.keys(movesData).find(function (k) {
        return movesData[k]?.name?.toLowerCase() === move.toLowerCase();
      })
    ];
 
    if (!attData?.stats || !defData?.stats || !moveEntry?.bp) return null;
 
    // ── Weather Ball override ─────────────────────────────────────────────────
    const isWeatherBall = moveEntry.name.toLowerCase() === "weather ball";
    const resolvedType = isWeatherBall
      ? WEATHER_BALL_TABLE[weather].type
      : moveEntry.type;
    const resolvedBP = isWeatherBall
      ? WEATHER_BALL_TABLE[weather].bp
      : moveEntry.bp;
 
    const level = 50;
    const power = resolvedBP;
    const isSpecial = moveEntry.category === "special";
 
    const atkBase = isSpecial
      ? attData.stats["special-attack"]
      : attData.stats.attack;
    const defBaseAtk = getStatValue(atkBase, 0, "neutral");
 
    const stab = attData.types?.includes(resolvedType) ? 1.5 : 1;
    const typeEff = getTypeEff(resolvedType, defData.types || ["normal"]);
    const mult = spreadMultiplier || 1;
 
    function rowForInvestment(statPoints) {
      const defStatVal = getStatValue(
        isSpecial ? defData.stats["special-defense"] : defData.stats.defense,
        statPoints,
        "neutral"
      );
      const defHp = getStatValue(defData.stats.hp, statPoints, "neutral", true);
 
      const baseRoll = Math.floor(
        (Math.floor(2 * level / 5 + 2) * power * defBaseAtk / defStatVal / 50 + 2)
      );
 
      const minDmg = Math.floor(Math.floor(baseRoll * 0.85) * stab * typeEff * mult);
      const maxDmg = Math.floor(Math.floor(baseRoll * 1.0) * stab * typeEff * mult);
 
      const minPct = ((minDmg / defHp) * 100).toFixed(1);
      const maxPct = ((maxDmg / defHp) * 100).toFixed(1);
 
      return {
        statPoints,
        defHp,
        minDmg,
        maxDmg,
        minPct,
        maxPct,
        verdict: getKOVerdict(minDmg, maxDmg, defHp),
      };
    }
 
    return {
      defName: defenderName,
      defTypes: defData.types,
      typeEff,
      stab,
      moveName: moveEntry.name,
      moveType: resolvedType,
      isWeatherBall,
      rows: [rowForInvestment(0), rowForInvestment(32)],
    };
  }
 
  // Primary gets 0.75 when spread is on, same as secondary
  const spreadMult = spreadOn ? 0.75 : 1;
  const primaryResults = computeResults(primaryDef, spreadMult);
  const secondaryResults = spreadOn ? computeResults(secondaryDef, 0.75) : null;
 
  // ── Styles ──────────────────────────────────────────────────────────────────
  const sectionTitle = {
    fontSize: 10,
    letterSpacing: 2,
    color: C.accent,
    fontWeight: 700,
    marginBottom: 8,
  };
 
  const resultBlock = {
    background: C.faint,
    border: "1px solid " + C.border,
    borderRadius: C.borderRadius,
    padding: 14,
    marginTop: 12,
  };
 
  const resultRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid " + C.border,
    fontSize: 11,
  };
 
  const verdictPill = function (verdict) {
    return {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1,
      color: verdict.color,
      border: "1px solid " + verdict.color + "55",
      borderRadius: C.borderRadius,
      padding: "2px 8px",
      whiteSpace: "nowrap",
      flexShrink: 0,
    };
  };
 
  const statLabel = {
    fontSize: 9,
    color: C.muted,
    width: 80,
    flexShrink: 0,
    fontWeight: 700,
    letterSpacing: 1,
  };
 
  const dmgVal = {
    fontSize: 13,
    fontWeight: 900,
    color: C.text,
    flexShrink: 0,
    minWidth: 90,
  };
 
  const pctVal = {
    fontSize: 11,
    color: C.muted,
    flex: 1,
  };
 
  // ── Render helpers ───────────────────────────────────────────────────────────
  function ResultSection(results, label, isSecondary) {
    if (!results) return null;
 
    return (
      <div style={resultBlock}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={sectionTitle}>{label}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {results.stab > 1 && (
              <span style={{ fontSize: 8, fontWeight: 700, color: C.yellow, border: "1px solid " + C.yellow + "55", borderRadius: C.borderRadius, padding: "2px 6px" }}>
                STAB
              </span>
            )}
            {results.typeEff > 1 && (
              <span style={{ fontSize: 8, fontWeight: 700, color: "#ff6666", border: "1px solid #ff666655", borderRadius: C.borderRadius, padding: "2px 6px" }}>
                {"x" + results.typeEff + " SE"}
              </span>
            )}
            {results.typeEff < 1 && results.typeEff > 0 && (
              <span style={{ fontSize: 8, fontWeight: 700, color: C.blue, border: "1px solid " + C.blue + "55", borderRadius: C.borderRadius, padding: "2px 6px" }}>
                {"x" + results.typeEff + " NE"}
              </span>
            )}
            {results.typeEff === 0 && (
              <span style={{ fontSize: 8, fontWeight: 700, color: C.muted, border: "1px solid " + C.border, borderRadius: C.borderRadius, padding: "2px 6px" }}>
                IMMUNE
              </span>
            )}
            {results.isWeatherBall && weather !== "none" && (
              <span style={{ fontSize: 8, fontWeight: 700, color: C.accent, border: "1px solid " + C.accent + "55", borderRadius: C.borderRadius, padding: "2px 6px" }}>
                {"WB · " + weather.toUpperCase()}
              </span>
            )}
            {isSecondary && (
              <span style={{ fontSize: 8, fontWeight: 700, color: C.muted, border: "1px solid " + C.border, borderRadius: C.borderRadius, padding: "2px 6px" }}>
                75% SPREAD
              </span>
            )}
          </div>
        </div>
 
        <div style={{ ...resultRow, borderBottom: "none", paddingBottom: 4 }}>
          <span style={{ ...statLabel, color: "transparent" }}>{"     "}</span>
          <span style={{ fontSize: 9, color: C.muted, minWidth: 90, fontWeight: 700, letterSpacing: 1 }}>DAMAGE</span>
          <span style={{ fontSize: 9, color: C.muted, flex: 1, fontWeight: 700, letterSpacing: 1 }}>% OF HP</span>
          <span style={{ fontSize: 9, color: C.muted, width: 80, fontWeight: 700, letterSpacing: 1 }}>KO?</span>
        </div>
 
        {results.rows.map(function (row, i) {
          return (
            <div key={i} style={{ ...resultRow, borderBottom: i === 0 ? "1px solid " + C.border : "none" }}>
              <span style={statLabel}>{row.statPoints === 0 ? "vs 0 EVs" : "vs max EVs"}</span>
              <span style={dmgVal}>{row.minDmg + " – " + row.maxDmg}</span>
              <span style={pctVal}>{row.minPct + "% – " + row.maxPct + "%"}</span>
              <span style={verdictPill(row.verdict)}>{row.verdict.label}</span>
            </div>
          );
        })}
 
        <div style={{ marginTop: 10, fontSize: 9, color: C.muted }}>
          {"Defender HP: " + results.rows[0].defHp + " (0 EVs) / " + results.rows[1].defHp + " (max EVs)"}
        </div>
      </div>
    );
  }
 
  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={st.card}>
        <div style={st.cardTitle}>DAMAGE CALCULATOR</div>
        <div style={st.cardSub}>
          Level 50 · 31 IVs · defender shown at 0 and max stat points
        </div>
 
        {/* Weather */}
        <span style={st.label}>WEATHER</span>
        <select
          style={st.input}
          value={weather}
          onChange={function (e) { setWeather(e.target.value); }}
        >
          <option value="none">None</option>
          <option value="sun">Sun</option>
          <option value="rain">Rain</option>
          <option value="sand">Sand</option>
          <option value="snow">Snow</option>
        </select>
 
        {/* Attacker */}
        <span style={st.label}>ATTACKER</span>
        <select
          style={st.input}
          value={attacker}
          onChange={function (e) { setAttacker(e.target.value); setMove(""); }}
        >
          <option value="">Select your Pokémon...</option>
          {myTeam.filter(function (m) { return m.name.trim(); }).map(function (m, i) {
            return <option key={i} value={m.name}>{m.name}</option>;
          })}
        </select>
 
        {/* Move */}
        {attacker && (
          <>
            <span style={st.label}>MOVE</span>
            <select
              style={st.input}
              value={move}
              onChange={function (e) { setMove(e.target.value); }}
            >
              <option value="">Select move...</option>
              {attackerMoves.map(function (m, i) {
                const label = m.bp > 0
                  ? m.name + " (" + m.type + " · " + m.bp + " BP · " + m.category + ")"
                  : m.name + " (" + m.type + " · status)";
                return <option key={i} value={m.name}>{label}</option>;
              })}
            </select>
          </>
        )}
 
        {/* Spread toggle */}
        {attacker && move && (
          <div style={{ marginTop: 12, marginBottom: 4 }}>
            <button
              style={Object.assign({}, spreadOn ? st.btnPrimary : st.btnGhost, {
                fontSize: 9,
                padding: "6px 14px",
                letterSpacing: 2,
              })}
              onClick={function () { setSpreadOn(!spreadOn); if (!spreadOn) setSecondaryDef(""); }}
            >
              {spreadOn ? "SPREAD ON (75%)" : "SPREAD OFF"}
            </button>
          </div>
        )}
 
        {/* Defender dropdowns */}
        {attacker && move && (
          <>
            {opponentRoster.length === 0 ? (
              <div style={{ marginTop: 12, fontSize: 10, color: C.muted }}>
                Enter opponents in the Analysis tab to enable defender selection.
              </div>
            ) : (
              <>
                <span style={st.label}>{spreadOn ? "PRIMARY TARGET" : "DEFENDER"}</span>
                <select
                  style={st.input}
                  value={primaryDef}
                  onChange={function (e) { setPrimaryDef(e.target.value); }}
                >
                  <option value="">Select defender...</option>
                  {opponentRoster.map(function (name, i) {
                    return <option key={i} value={name}>{name}</option>;
                  })}
                </select>
 
                {spreadOn && (
                  <>
                    <span style={st.label}>SECONDARY TARGET</span>
                    <select
                      style={st.input}
                      value={secondaryDef}
                      onChange={function (e) { setSecondaryDef(e.target.value); }}
                    >
                      <option value="">Select secondary defender...</option>
                      {opponentRoster
                        .filter(function (name) { return name !== primaryDef; })
                        .map(function (name, i) {
                          return <option key={i} value={name}>{name}</option>;
                        })}
                    </select>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
 
      {/* Results */}
      {primaryResults && (
        <div>
          {ResultSection(primaryResults, primaryDef.toUpperCase(), false)}
          {spreadOn && secondaryDef && ResultSection(secondaryResults, secondaryDef.toUpperCase() + " (SECONDARY)", true)}
          {spreadOn && !secondaryDef && (
            <div style={{ ...resultBlock, marginTop: 12, color: C.muted, fontSize: 10, textAlign: "center" }}>
              Select a secondary target above
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TYPE_ABBR = {
  normal: "NOR", fire: "FIR", water: "WAT", electric: "ELE", grass: "GRA",
  ice: "ICE", fighting: "FIG", poison: "POI", ground: "GRD", flying: "FLY",
  psychic: "PSY", bug: "BUG", rock: "ROC", ghost: "GHO", dragon: "DRA",
  dark: "DAR", steel: "STE", fairy: "FAI",
};
const ALL_TYPES = Object.keys(TYPE_ABBR);

function TypeChartTab(props) {
  const st = props.st;
  const C = props.C;
  const [active, setActive] = useState(null); // { atk, def } or null

  function cellColor(mult) {
    if (mult === 2) return C.green;
    if (mult === 0.5) return C.accent;
    if (mult === 0) return C.muted;
    return C.faint; // 1x
  }

  function getMult(atk, def) {
    const v = (typeChartData[atk] || {})[def];
    return v === undefined ? 1 : v;
  }

  const cellSize = 26;
  const labelSize = 34;

  return (
    <div>
      <div style={st.card}>
        <div style={st.cardTitle}>TYPE CHART</div>
        <div style={st.cardSub}>Rows = attacking type, columns = defending type. Tap a cell to trace it.</div>

        <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
          {[["2", C.green], ["1", C.faint], ["½", C.accent], ["0", C.muted]].map(function(l) {
            return (
              <div key={l[0]} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, background: l[1], borderRadius: 3, border: "1px solid " + C.border }} />
                <span style={{ fontSize: 10, color: C.muted }}>{l[0] + "×"}</span>
              </div>
            );
          })}
        </div>

        <div style={{ overflowX: "auto", border: "1px solid " + C.border, borderRadius: C.borderRadius }}>
          <div style={{ display: "inline-block", minWidth: "100%" }}>
            {/* Header row */}
            <div style={{ display: "flex" }}>
              <div style={{ width: labelSize, height: labelSize, flexShrink: 0, position: "sticky", left: 0, zIndex: 3, background: C.card }} />
              {ALL_TYPES.map(function(def) {
                const isActiveCol = active && active.def === def;
                return (
                  <div key={def} title={titleCase(def)} style={{
                    width: cellSize, height: labelSize, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, color: isActiveCol ? C.accent : C.muted, fontWeight: 700, writingMode: "vertical-rl", transform: "rotate(180deg)",
                    background: isActiveCol ? C.faint : "transparent",
                  }}>
                    {TYPE_ABBR[def]}
                  </div>
                );
              })}
            </div>
            {/* Rows */}
            {ALL_TYPES.map(function(atk) {
              const isActiveRow = active && active.atk === atk;
              return (
                <div key={atk} style={{ display: "flex" }}>
                  <div title={titleCase(atk)} style={{
                    width: labelSize, height: cellSize, flexShrink: 0, position: "sticky", left: 0, zIndex: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, color: isActiveRow ? C.accent : C.muted, fontWeight: 700, background: C.card,
                  }}>
                    {TYPE_ABBR[atk]}
                  </div>
                  {ALL_TYPES.map(function(def) {
                    const mult = getMult(atk, def);
                    const isSel = active && active.atk === atk && active.def === def;
                    const inRowOrCol = active && (active.atk === atk || active.def === def);
                    return (
                      <div
                        key={def}
                        onClick={function() {
                          setActive(isSel ? null : { atk: atk, def: def });
                        }}
                        style={{
                          width: cellSize, height: cellSize, flexShrink: 0, cursor: "pointer",
                          background: cellColor(mult),
                          border: isSel ? "2px solid " + C.text : (inRowOrCol ? "1px solid " + C.text + "55" : "1px solid " + C.bg),
                          opacity: active && !inRowOrCol ? 0.35 : 1,
                          boxSizing: "border-box",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
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

// I removed this token.
