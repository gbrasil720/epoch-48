import { Database } from "bun:sqlite";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

// ─── Setup SQLite in-memory DB ───────────────────────────────────────
const db = new Database(":memory:");

db.run(`
  CREATE TABLE nations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    flag TEXT,
    confederation TEXT,
    is_active INTEGER DEFAULT 1
  )
`);

db.run(`
  CREATE TABLE tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    type TEXT NOT NULL,
    is_completed INTEGER DEFAULT 1
  )
`);

db.run(`
  CREATE TABLE performances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nation_id INTEGER NOT NULL REFERENCES nations(id),
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
    elimination_phase TEXT NOT NULL,
    matches_played INTEGER DEFAULT 0 NOT NULL,
    points_gained INTEGER DEFAULT 0 NOT NULL,
    goals_for INTEGER DEFAULT 0 NOT NULL,
    goals_diff INTEGER DEFAULT 0 NOT NULL,
    yellow_cards INTEGER DEFAULT 0 NOT NULL,
    red_cards INTEGER DEFAULT 0 NOT NULL,
    max_possible_points INTEGER DEFAULT 0,
    UNIQUE(nation_id, tournament_id)
  )
`);

// ─── CSV Reading (same logic as seed/index.ts) ───────────────────────
interface WorldCupCsvRecord {
  fifa_code: string;
  country_name: string;
  phase_reached: string;
  matches: string;
  pts: string;
  gf: string;
  gd: string;
  yellows: string;
  reds: string;
}

const csvPath = path.resolve(import.meta.dirname, "../../data/world_cup_2022_stats.csv");

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(csvPath, "utf-8");
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
}) as WorldCupCsvRecord[];

console.log(`📊 Found ${records.length} records in CSV.`);

// ─── Phase validation against TournamentPhaseName enum ────────────────
const VALID_PHASES = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter Finals",
  "Fourth Place",
  "Third Place",
  "Runner-up",
  "Winner",
];

const phaseErrors: string[] = [];
for (const record of records) {
  if (!VALID_PHASES.includes(record.phase_reached)) {
    phaseErrors.push(`${record.country_name} (${record.fifa_code}): "${record.phase_reached}" is not a valid phase`);
  }
}

if (phaseErrors.length > 0) {
  console.error("\n❌ PHASE STRING MISMATCHES:");
  for (const err of phaseErrors) console.error(`  - ${err}`);
} else {
  console.log("✅ All phase strings match TournamentPhaseName enum values.");
}

// ─── Numeric field validation ────────────────────────────────────────
const numericErrors: string[] = [];
for (const record of records) {
  const fields: { key: string; value: string }[] = [
    { key: "matches", value: record.matches },
    { key: "pts", value: record.pts },
    { key: "gf", value: record.gf },
    { key: "gd", value: record.gd },
    { key: "yellows", value: record.yellows },
    { key: "reds", value: record.reds },
  ];

  for (const field of fields) {
    const parsed = Number.parseInt(field.value, 10);
    if (isNaN(parsed)) {
      numericErrors.push(`${record.country_name} (${record.fifa_code}): ${field.key}="${field.value}" parsed to NaN`);
    }
    // Check for negative values that shouldn't be negative
    if (["matches", "pts", "gf", "yellows", "reds"].includes(field.key) && parsed < 0) {
      numericErrors.push(`${record.country_name} (${record.fifa_code}): ${field.key}=${parsed} is negative (shouldn't be)`);
    }
  }
}

if (numericErrors.length > 0) {
  console.error("\n❌ NUMERIC FIELD ERRORS:");
  for (const err of numericErrors) console.error(`  - ${err}`);
} else {
  console.log("✅ All numeric fields parse correctly (no NaN, no unexpected negatives).");
}

// ─── Run the seed logic ──────────────────────────────────────────────
console.log("\n🌱 Running seed logic...\n");

// Create tournament
const tournamentRow = db.prepare(
  "INSERT INTO tournaments (name, year, type) VALUES (?, ?, ?) RETURNING id"
).get(`World Cup 2022`, 2022, "WORLD_CUP") as { id: number };
const tournamentId = tournamentRow.id;
console.log(`🏆 Tournament created: id=${tournamentId}`);

let inserted = 0;
let skipped = 0;
let errors = 0;

for (const record of records) {
  // Find or create nation
  let nation = db.prepare("SELECT * FROM nations WHERE code = ?").get(record.fifa_code) as
    | { id: number; name: string; code: string }
    | undefined;

  if (!nation) {
    const result = db.prepare(
      "INSERT INTO nations (name, code) VALUES (?, ?) RETURNING id"
    ).get(record.country_name, record.fifa_code) as { id: number };
    nation = { id: result.id, name: record.country_name, code: record.fifa_code };
  }

  // Check existing performance
  const existing = db.prepare(
    "SELECT id FROM performances WHERE nation_id = ? AND tournament_id = ?"
  ).get(nation.id, tournamentId) as { id: number } | undefined;

  if (existing) {
    console.log(`↩️ Already exists: ${nation.name}`);
    skipped++;
    continue;
  }

  // Parse values (same logic as seed/index.ts)
  const matchesPlayed = Number.parseInt(record.matches, 10);
  const pointsGained = Number.parseInt(record.pts, 10);
  const goalsFor = Number.parseInt(record.gf, 10);
  const goalsDiff = Number.parseInt(record.gd, 10);
  const yellowCards = Number.parseInt(record.yellows, 10);
  const redCards = Number.parseInt(record.reds, 10);

  try {
    db.run(
      `INSERT INTO performances (nation_id, tournament_id, elimination_phase, matches_played, points_gained, goals_for, goals_diff, yellow_cards, red_cards)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nation.id,
        tournamentId,
        record.phase_reached,
        matchesPlayed,
        pointsGained,
        goalsFor,
        goalsDiff,
        yellowCards,
        redCards,
      ],
    );
    console.log(`✅ Added: ${nation.name} (${record.fifa_code}) | Phase: ${record.phase_reached} | Pts: ${pointsGained} | GF: ${goalsFor} | GD: ${goalsDiff} | Y: ${yellowCards} | R: ${redCards}`);
    inserted++;
  } catch (err: any) {
    console.error(`❌ Error inserting ${nation.name}: ${err.message}`);
    errors++;
  }
}

console.log(`\n📈 Results: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);

// ─── Data Integrity Verification ─────────────────────────────────────
console.log("\n🔍 Verifying data integrity...\n");

// Check total row counts
const nationCount = db.prepare("SELECT COUNT(*) as count FROM nations").get() as { count: number };
const perfCount = db.prepare("SELECT COUNT(*) as count FROM performances").get() as { count: number };
console.log(`Nations in DB: ${nationCount.count} (expected: 32)`);
console.log(`Performances in DB: ${perfCount.count} (expected: 32)`);

// Verify Argentina (Winner)
const argentina = db.prepare(
  `SELECT p.* FROM performances p
   JOIN nations n ON n.id = p.nation_id
   WHERE n.code = 'ARG'`
).get() as any;

console.log("\n🇦🇷 Argentina verification:");
console.log(`  Phase: ${argentina.elimination_phase} (expected: "Winner")`);
console.log(`  Matches: ${argentina.matches_played} (expected: 7)`);
console.log(`  Points: ${argentina.points_gained} (expected: 18)`);
console.log(`  Goals For: ${argentina.goals_for} (expected: 15)`);
console.log(`  Goal Diff: ${argentina.goals_diff} (expected: 7)`);
console.log(`  Yellow Cards: ${argentina.yellow_cards} (expected: 8)`);
console.log(`  Red Cards: ${argentina.red_cards} (expected: 8)`);

const argOk =
  argentina.elimination_phase === "Winner" &&
  argentina.matches_played === 7 &&
  argentina.points_gained === 18 &&
  argentina.goals_for === 15 &&
  argentina.goals_diff === 7 &&
  argentina.yellow_cards === 8 &&
  argentina.red_cards === 8;

console.log(argOk ? "  ✅ Argentina data is CORRECT" : "  ❌ Argentina data is INCORRECT");

// Verify France (Runner-up)
const france = db.prepare(
  `SELECT p.* FROM performances p
   JOIN nations n ON n.id = p.nation_id
   WHERE n.code = 'FRA'`
).get() as any;

console.log("\n🇫🇷 France verification:");
console.log(`  Phase: ${france.elimination_phase} (expected: "Runner-up")`);
console.log(`  Matches: ${france.matches_played} (expected: 7)`);
console.log(`  Points: ${france.points_gained} (expected: 15)`);
console.log(`  Goals For: ${france.goals_for} (expected: 16)`);
console.log(`  Goal Diff: ${france.goals_diff} (expected: 8)`);

const fraOk =
  france.elimination_phase === "Runner-up" &&
  france.matches_played === 7 &&
  france.points_gained === 15 &&
  france.goals_for === 16 &&
  france.goals_diff === 8;

console.log(fraOk ? "  ✅ France data is CORRECT" : "  ❌ France data is INCORRECT");

// Verify Croatia (Third Place)
const croatia = db.prepare(
  `SELECT p.* FROM performances p
   JOIN nations n ON n.id = p.nation_id
   WHERE n.code = 'CRO'`
).get() as any;

console.log("\n🇭🇷 Croatia verification:");
console.log(`  Phase: ${croatia.elimination_phase} (expected: "Third Place")`);
console.log(`  Points: ${croatia.points_gained} (expected: 14)`);

const croOk =
  croatia.elimination_phase === "Third Place" &&
  croatia.points_gained === 14;

console.log(croOk ? "  ✅ Croatia data is CORRECT" : "  ❌ Croatia data is INCORRECT");

// Verify Morocco (Fourth Place)
const morocco = db.prepare(
  `SELECT p.* FROM performances p
   JOIN nations n ON n.id = p.nation_id
   WHERE n.code = 'MAR'`
).get() as any;

console.log("\n🇲🇦 Morocco verification:");
console.log(`  Phase: ${morocco.elimination_phase} (expected: "Fourth Place")`);
console.log(`  Points: ${morocco.points_gained} (expected: 13)`);

const marOk =
  morocco.elimination_phase === "Fourth Place" &&
  morocco.points_gained === 13;

console.log(marOk ? "  ✅ Morocco data is CORRECT" : "  ❌ Morocco data is INCORRECT");

// Check for NaN values in DB
const nanCheck = db.prepare(
  "SELECT * FROM performances WHERE matches_played IS NULL OR points_gained IS NULL OR goals_for IS NULL OR goals_diff IS NULL OR yellow_cards IS NULL OR red_cards IS NULL"
).all() as any[];

if (nanCheck.length > 0) {
  console.log("\n❌ Found NULL values in performances (likely from NaN insertion):");
  for (const row of nanCheck) console.log(`  - Row ${row.id}`);
} else {
  console.log("\n✅ No NULL values in numeric columns.");
}

// Check negative goal_diff is stored correctly (should be allowed)
const negGd = db.prepare("SELECT COUNT(*) as count FROM performances WHERE goals_diff < 0").get() as { count: number };
console.log(`Teams with negative goal diff: ${negGd.count} (expected: some teams)`);

// ─── Idempotency Test (run seed again) ────────────────────────────────
console.log("\n🔄 Running idempotency test (seed again)...\n");

let skipped2 = 0;
let inserted2 = 0;
let errors2 = 0;

for (const record of records) {
  const nation = db.prepare("SELECT * FROM nations WHERE code = ?").get(record.fifa_code) as
    | { id: number; name: string; code: string }
    | undefined;

  if (!nation) {
    console.error(`❌ Nation ${record.fifa_code} not found during re-seed!`);
    errors2++;
    continue;
  }

  const existing = db.prepare(
    "SELECT id FROM performances WHERE nation_id = ? AND tournament_id = ?"
  ).get(nation.id, tournamentId) as { id: number } | undefined;

  if (existing) {
    skipped2++;
    continue;
  }

  try {
    db.run(
      `INSERT INTO performances (nation_id, tournament_id, elimination_phase, matches_played, points_gained, goals_for, goals_diff, yellow_cards, red_cards)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nation.id,
        tournamentId,
        record.phase_reached,
        Number.parseInt(record.matches, 10),
        Number.parseInt(record.pts, 10),
        Number.parseInt(record.gf, 10),
        Number.parseInt(record.gd, 10),
        Number.parseInt(record.yellows, 10),
        Number.parseInt(record.reds, 10),
      ],
    );
    inserted2++;
  } catch (err: any) {
    console.error(`❌ Error on re-seed ${nation.name}: ${err.message}`);
    errors2++;
  }
}

console.log(`Re-seed results: ${inserted2} inserted, ${skipped2} skipped, ${errors2} errors`);

if (inserted2 === 0 && skipped2 === 32 && errors2 === 0) {
  console.log("✅ Idempotency test PASSED — all 32 records were correctly skipped.");
} else {
  console.log("❌ Idempotency test FAILED — unexpected insertions or errors on re-seed.");
}

// ─── Final Summary ───────────────────────────────────────────────────
console.log("\n" + "=".repeat(60));
console.log("VALIDATION SUMMARY");
console.log("=".repeat(60));

const allPassed =
  phaseErrors.length === 0 &&
  numericErrors.length === 0 &&
  errors === 0 &&
  inserted === 32 &&
  nationCount.count === 32 &&
  perfCount.count === 32 &&
  argOk &&
  fraOk &&
  croOk &&
  marOk &&
  nanCheck.length === 0 &&
  inserted2 === 0 &&
  skipped2 === 32 &&
  errors2 === 0;

if (allPassed) {
  console.log("✅ ALL CHECKS PASSED");
  console.log("  - CSV parsing: OK (32 records)")
  console.log("  - Phase strings: OK (all match TournamentPhaseName enum)");
  console.log("  - Numeric fields: OK (no NaN, no unexpected negatives)");
  console.log("  - Data integrity: OK (Argentina, France, Croatia, Morocco verified)");
  console.log("  - No NULL values in numeric columns");
  console.log("  - Idempotency: OK (re-seed skips all 32 records)");
} else {
  console.log("❌ SOME CHECKS FAILED — see details above");
}