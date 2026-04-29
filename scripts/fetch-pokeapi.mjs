import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { CHAMPIONS } from "./champions-list.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const CACHE = join(ROOT, ".cache/pokeapi");
const OUT = join(ROOT, "src/data");
const API = "https://pokeapi.co/api/v2";
const META_URL = "https://eurekaffeine.github.io/pokemon-champions-scraper/battle_meta.json";

// IDs from the existing name maps (move/item/ability)
const BASE_MOVE_IDS = new Set([
  252,575,394,675,663,182,261,270,269,555,370,827,157,337,89,707,14,444,398,902,
  476,433,791,668,247,286,347,503,196,58,105,266,162,413,366,814,469,542,311,85,
  521,527,905,430,434,406,834,605,94,257,76,315,349,188,79,414,284,389,869,59,
  282,242,418,450,492,
]);
const BASE_ITEM_IDS = new Set([
  135,166,168,211,134,162,191,252,264,214,174,165,190,220,219,194,226,224,175,173,
  2579,717,699,708,2566,163,2563,695,696,289,217,
]);
const BASE_ABILITY_IDS = new Set([
  22,66,24,45,299,128,293,2,127,26,158,34,65,130,23,81,117,172,63,132,101,91,33,
  104,140,36,182,176,177,43,192,5,242,70,73,102,204,109,98,136,296,166,159,146,84,
]);

const TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy",
];

function titleCase(s) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url) {
  const cacheKey = url.replace(/[^a-zA-Z0-9]/g, "_");
  const file = join(CACHE, cacheKey + ".json");
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  await sleep(120);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  writeFileSync(file, JSON.stringify(data));
  return data;
}

function save(name, data) {
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2));
  console.log(`  ${name}: ${Object.keys(data).length} entries`);
}

async function fetchTypeChart() {
  const chart = {};
  for (const t of TYPES) {
    const d = await get(`${API}/type/${t}`);
    if (!d) continue;
    const eff = {};
    for (const { name } of d.damage_relations.double_damage_to) eff[name] = 2;
    for (const { name } of d.damage_relations.half_damage_to) eff[name] = 0.5;
    for (const { name } of d.damage_relations.no_damage_to) eff[name] = 0;
    chart[t] = eff;
    process.stdout.write(".");
  }
  console.log();
  return chart;
}

async function fetchPokemon() {
  const out = {};
  let fetched = 0, manual = 0, failed = 0;

  for (const entry of CHAMPIONS) {
    const { key, types: manualTypes, speed: manualSpeed } = entry;
    const slug = "slug" in entry ? entry.slug : key;

    // Fan-game form — use manual data, no PokéAPI fetch
    if (slug === null) {
      out[key] = { types: manualTypes, stats: { hp: 0, attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: manualSpeed }, sprite: null };
      manual++;
      continue;
    }

    const d = await get(`${API}/pokemon/${slug}`);
    if (!d) {
      process.stdout.write("x");
      failed++;
      // Still include with null data so the key exists in champions.json
      out[key] = { types: manualTypes ?? ["normal"], stats: { hp: 0, attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: manualSpeed ?? 0 }, sprite: null };
      continue;
    }

    const types = d.types.sort((a, b) => a.slot - b.slot).map(t => t.type.name);
    const statMap = {};
    for (const s of d.stats) {
      statMap[s.stat.name] = s.base_stat;
    }
    out[key] = {
      types,
      stats: {
        hp: statMap.hp ?? 0,
        attack: statMap.attack ?? 0,
        defense: statMap.defense ?? 0,
        "special-attack": statMap["special-attack"] ?? 0,
        "special-defense": statMap["special-defense"] ?? 0,
        speed: statMap.speed ?? 0,
      },
      sprite: d.sprites?.front_default ?? null,
    };
    fetched++;
    process.stdout.write(".");
  }
  console.log(` (${fetched} fetched, ${manual} manual, ${failed} failed)`);
  return out;
}

async function fetchMoves(extraIds) {
  const ids = new Set([...BASE_MOVE_IDS, ...extraIds]);
  const out = {};
  for (const id of ids) {
    const d = await get(`${API}/move/${id}`);
    if (!d) continue;
    out[id] = { name: titleCase(d.name), type: d.type?.name ?? null, bp: d.power ?? 0, category: d.damage_class?.name ?? null };
    process.stdout.write(".");
  }
  console.log(` (${ids.size} moves)`);
  return out;
}

async function fetchItems(extraIds) {
  const ids = new Set([...BASE_ITEM_IDS, ...extraIds]);
  const out = {};
  for (const id of ids) {
    const d = await get(`${API}/item/${id}`);
    if (!d) continue;
    out[id] = titleCase(d.name);
    process.stdout.write(".");
  }
  console.log(` (${ids.size} items)`);
  return out;
}

async function fetchAbilities(extraIds) {
  const ids = new Set([...BASE_ABILITY_IDS, ...extraIds]);
  const out = {};
  for (const id of ids) {
    const d = await get(`${API}/ability/${id}`);
    if (!d) continue;
    out[id] = titleCase(d.name);
    process.stdout.write(".");
  }
  console.log(` (${ids.size} abilities)`);
  return out;
}

async function main() {
  mkdirSync(CACHE, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  console.log("Fetching meta for ID discovery...");
  const meta = await get(META_URL).catch(() => null);
  const extraMoveIds = new Set();
  const extraItemIds = new Set();
  const extraAbilityIds = new Set();
  if (meta?.pokemon_usage) {
    for (const p of meta.pokemon_usage) {
      for (const m of p.top_moves ?? []) extraMoveIds.add(m.id);
      for (const i of p.top_items ?? []) extraItemIds.add(i.id);
      for (const a of p.top_abilities ?? []) extraAbilityIds.add(a.id);
    }
    console.log(`  ${extraMoveIds.size} move IDs, ${extraItemIds.size} item IDs, ${extraAbilityIds.size} ability IDs`);
  }

  console.log(`Type chart (${TYPES.length} types)...`);
  save("typeChart.json", await fetchTypeChart());

  console.log(`Pokemon (${CHAMPIONS.length} champions entries)...`);
  const pokemonOut = await fetchPokemon();
  save("pokemon.json", pokemonOut);

  // champions.json = ordered list of valid keys for the app's autocomplete
  const championsKeys = CHAMPIONS.map(c => c.key);
  writeFileSync(join(OUT, "champions.json"), JSON.stringify(championsKeys, null, 2));
  console.log(`  champions.json: ${championsKeys.length} keys`);

  console.log("Moves...");
  save("moves.json", await fetchMoves(extraMoveIds));

  console.log("Items...");
  save("items.json", await fetchItems(extraItemIds));

  console.log("Abilities...");
  save("abilities.json", await fetchAbilities(extraAbilityIds));

  console.log("Done.");
}

main().catch(e => { console.error(e); process.exit(1); });
