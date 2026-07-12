import * as fs from "node:fs";
import * as path from "node:path";
import { neon, neonConfig } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schema from "../schema";
import { fifaRankings, nations, performances, tournaments } from "../schema";

neonConfig.poolQueryViaFetch = true;

dotenv.config({
	path: path.resolve(import.meta.dirname, "../../../../apps/server/.env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error("DATABASE_URL is not set");
	process.exit(1);
}

// Local Neon HTTP proxy (db.localtest.me:4444) for docker-compose style setups
const databaseHost = new URL(databaseUrl).hostname;
if (databaseHost === "db.localtest.me") {
	neonConfig.fetchEndpoint = (host) => {
		const [protocol, port] =
			host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
		return `${protocol}://${host}:${port}/sql`;
	};
}

const db = drizzle(neon(databaseUrl), { schema });

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

/** Rough FIFA confederation map for common codes used in seed CSVs. */
const CONFEDERATION_BY_CODE: Record<string, string> = {
	ARG: "CONMEBOL",
	AUS: "AFC",
	BEL: "UEFA",
	BRA: "CONMEBOL",
	CMR: "CAF",
	CAN: "CONCACAF",
	CRC: "CONCACAF",
	CRO: "UEFA",
	DEN: "UEFA",
	ECU: "CONMEBOL",
	ENG: "UEFA",
	FRA: "UEFA",
	GER: "UEFA",
	GHA: "CAF",
	IRN: "AFC",
	JPN: "AFC",
	MEX: "CONCACAF",
	MAR: "CAF",
	NED: "UEFA",
	POL: "UEFA",
	PRT: "UEFA",
	QAT: "AFC",
	KSA: "AFC",
	SEN: "CAF",
	SRB: "UEFA",
	KOR: "AFC",
	ESP: "UEFA",
	SUI: "UEFA",
	TUN: "CAF",
	USA: "CONCACAF",
	URU: "CONMEBOL",
	WAL: "UEFA",
	// Tier 2 sample nations
	ITA: "UEFA",
	COL: "CONMEBOL",
	CHL: "CONMEBOL",
	NGA: "CAF",
	EGY: "CAF",
	CHI: "CONMEBOL",
};

function resolveCsvPath(csvFileName: string): string {
	if (path.isAbsolute(csvFileName)) {
		return csvFileName;
	}

	return path.resolve(import.meta.dirname, "../../data", csvFileName);
}

function readCsvRecords(csvFileName: string): WorldCupCsvRecord[] {
	const csvFilePath = resolveCsvPath(csvFileName);

	if (!fs.existsSync(csvFilePath)) {
		throw new Error(
			`CSV file not found: ${csvFilePath}\n` +
				`Place your file at packages/db/data/${csvFileName} or pass an absolute path.`,
		);
	}

	const fileContent = fs.readFileSync(csvFilePath, "utf-8");

	return parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
	}) as WorldCupCsvRecord[];
}

async function findOrCreateTournament(
	name: string,
	year: number,
	type: "WORLD_CUP" | "QUALIFIERS" | "CONTINENTAL",
) {
	const existing = await db.query.tournaments.findFirst({
		where: (tournament, { and, eq }) =>
			and(eq(tournament.name, name), eq(tournament.year, year)),
	});

	if (existing) {
		return existing;
	}

	const [tournament] = await db
		.insert(tournaments)
		.values({
			name,
			year,
			type,
			isCompleted: true,
		})
		.returning();

	if (!tournament) {
		throw new Error(`Failed to create tournament ${name} (${year})`);
	}

	return tournament;
}

async function findOrCreateNation(input: {
	code: string;
	name: string;
	confederation?: string;
}) {
	const existing = await db.query.nations.findFirst({
		where: (nation, { eq }) => eq(nation.code, input.code),
	});

	if (existing) {
		const confed =
			input.confederation ?? CONFEDERATION_BY_CODE[input.code] ?? null;
		if (confed && !existing.confederation) {
			await db
				.update(nations)
				.set({ confederation: confed })
				.where(eq(nations.id, existing.id));
			return { ...existing, confederation: confed };
		}
		return existing;
	}

	const [nation] = await db
		.insert(nations)
		.values({
			name: input.name,
			code: input.code,
			confederation:
				input.confederation ?? CONFEDERATION_BY_CODE[input.code] ?? null,
		})
		.returning();

	if (!nation) {
		throw new Error(`Failed to create nation ${input.name}`);
	}

	return nation;
}

async function upsertPerformance(input: {
	nationId: number;
	tournamentId: number;
	eliminationPhase: string;
	matchesPlayed: number;
	pointsGained: number;
	goalsFor: number;
	goalsDiff: number;
	yellowCards: number;
	redCards: number;
	maxPossiblePoints?: number;
}) {
	const existing = await db.query.performances.findFirst({
		where: (performance, { and, eq }) =>
			and(
				eq(performance.nationId, input.nationId),
				eq(performance.tournamentId, input.tournamentId),
			),
	});

	if (existing) {
		return existing;
	}

	const [row] = await db
		.insert(performances)
		.values({
			nationId: input.nationId,
			tournamentId: input.tournamentId,
			eliminationPhase: input.eliminationPhase,
			matchesPlayed: input.matchesPlayed,
			pointsGained: input.pointsGained,
			goalsFor: input.goalsFor,
			goalsDiff: input.goalsDiff,
			yellowCards: input.yellowCards,
			redCards: input.redCards,
			maxPossiblePoints: input.maxPossiblePoints ?? 0,
		})
		.returning();

	return row;
}

async function upsertFifaRanking(input: {
	nationId: number;
	year: number;
	officialRank: number;
	officialPoints?: number;
}) {
	const existing = await db.query.fifaRankings.findFirst({
		where: (f, { and, eq }) =>
			and(eq(f.nationId, input.nationId), eq(f.year, input.year)),
	});

	if (existing) {
		return existing;
	}

	const [row] = await db
		.insert(fifaRankings)
		.values({
			nationId: input.nationId,
			year: input.year,
			officialRank: input.officialRank,
			officialPoints: input.officialPoints,
		})
		.returning();

	return row;
}

/**
 * Seeds World Cup performances from CSV.
 * Run: `bun run src/seed/index.ts [year] [csvFile]`
 */
export async function seedWorldCupData(year: number, csvFileName: string) {
	console.log(`🌱 Seeding World Cup ${year}...`);

	const tournament = await findOrCreateTournament(
		`World Cup ${year}`,
		year,
		"WORLD_CUP",
	);
	const records = readCsvRecords(csvFileName);

	console.log(`📊 Found ${records.length} CSV records.`);

	const nationIds: { id: number; code: string; name: string }[] = [];

	for (const record of records) {
		const nation = await findOrCreateNation({
			code: record.fifa_code,
			name: record.country_name,
			confederation: CONFEDERATION_BY_CODE[record.fifa_code],
		});

		nationIds.push({ id: nation.id, code: nation.code, name: nation.name });

		const existingPerformance = await db.query.performances.findFirst({
			where: (performance, { and, eq }) =>
				and(
					eq(performance.nationId, nation.id),
					eq(performance.tournamentId, tournament.id),
				),
		});

		if (existingPerformance) {
			console.log(`↩️ Already exists: ${nation.name}`);
			continue;
		}

		await db.insert(performances).values({
			nationId: nation.id,
			tournamentId: tournament.id,
			eliminationPhase: record.phase_reached,
			matchesPlayed: Number.parseInt(record.matches, 10),
			pointsGained: Number.parseInt(record.pts, 10),
			goalsFor: Number.parseInt(record.gf, 10),
			goalsDiff: Number.parseInt(record.gd, 10),
			yellowCards: Number.parseInt(record.yellows, 10),
			redCards: Number.parseInt(record.reds, 10),
		});
		console.log(`✅ Added: ${nation.name}`);
	}

	// Stub FIFA ranks for WC nations (ordinal placeholder for compare mode)
	for (const [i, nation] of nationIds.entries()) {
		await upsertFifaRanking({
			nationId: nation.id,
			year,
			officialRank: i + 1,
			officialPoints: 1800 - i * 10,
		});
	}
	console.log(`📋 Seeded FIFA ranking stubs for ${nationIds.length} WC nations.`);

	console.log("🎉 World Cup seeding complete!");
	return nationIds;
}

/**
 * Seeds sample continental + qualifier data for architecture validation.
 * Safe to re-run (idempotent upserts).
 */
export async function seedArchitectureStubs(wcYear = 2022) {
	console.log(`🌱 Seeding architecture stubs for cycle → ${wcYear}...`);

	// Continental tournaments in the 2018–2022 cycle
	const euro = await findOrCreateTournament("UEFA Euro 2020", 2021, "CONTINENTAL");
	const copa = await findOrCreateTournament(
		"Copa América 2021",
		2021,
		"CONTINENTAL",
	);
	const qualifiers = await findOrCreateTournament(
		"World Cup Qualifiers 2022",
		2022,
		"QUALIFIERS",
	);

	// Continental sample performances for a few WC nations (phase must pass DB check)
	const continentalSamples: Array<{
		code: string;
		name: string;
		tournamentId: number;
		phase: string;
		matches: number;
		pts: number;
		gf: number;
		gd: number;
		yellows: number;
		reds: number;
	}> = [
		{
			code: "ITA",
			name: "Italy",
			tournamentId: euro.id,
			phase: "Winner",
			matches: 7,
			pts: 15,
			gf: 13,
			gd: 9,
			yellows: 6,
			reds: 0,
		},
		{
			code: "ENG",
			name: "England",
			tournamentId: euro.id,
			phase: "Runner-up",
			matches: 7,
			pts: 13,
			gf: 11,
			gd: 6,
			yellows: 5,
			reds: 0,
		},
		{
			code: "FRA",
			name: "France",
			tournamentId: euro.id,
			phase: "Round of 16",
			matches: 4,
			pts: 7,
			gf: 6,
			gd: 2,
			yellows: 4,
			reds: 0,
		},
		{
			code: "ARG",
			name: "Argentina",
			tournamentId: copa.id,
			phase: "Winner",
			matches: 7,
			pts: 16,
			gf: 12,
			gd: 8,
			yellows: 10,
			reds: 0,
		},
		{
			code: "BRA",
			name: "Brazil",
			tournamentId: copa.id,
			phase: "Quarter Finals",
			matches: 5,
			pts: 10,
			gf: 10,
			gd: 7,
			yellows: 4,
			reds: 0,
		},
	];

	for (const sample of continentalSamples) {
		const nation = await findOrCreateNation({
			code: sample.code,
			name: sample.name,
		});
		await upsertPerformance({
			nationId: nation.id,
			tournamentId: sample.tournamentId,
			eliminationPhase: sample.phase,
			matchesPlayed: sample.matches,
			pointsGained: sample.pts,
			goalsFor: sample.gf,
			goalsDiff: sample.gd,
			yellowCards: sample.yellows,
			redCards: sample.reds,
		});
		console.log(`✅ Continental: ${sample.name} @ ${sample.phase}`);
	}

	// Tier 2 qualifier samples (non-WC or non-qualifiers for 2022)
	const tier2Samples: Array<{
		code: string;
		name: string;
		fifaRank: number;
		matches: number;
		pts: number;
		maxPts: number;
		gf: number;
		gd: number;
	}> = [
		{
			code: "ITA",
			name: "Italy",
			fifaRank: 6,
			matches: 8,
			pts: 18,
			maxPts: 24,
			gf: 16,
			gd: 10,
		},
		{
			code: "COL",
			name: "Colombia",
			fifaRank: 17,
			matches: 18,
			pts: 23,
			maxPts: 54,
			gf: 20,
			gd: 4,
		},
		{
			code: "CHL",
			name: "Chile",
			fifaRank: 29,
			matches: 18,
			pts: 19,
			maxPts: 54,
			gf: 14,
			gd: -2,
		},
		{
			code: "NGA",
			name: "Nigeria",
			fifaRank: 31,
			matches: 6,
			pts: 10,
			maxPts: 18,
			gf: 12,
			gd: 5,
		},
		{
			code: "EGY",
			name: "Egypt",
			fifaRank: 35,
			matches: 6,
			pts: 8,
			maxPts: 18,
			gf: 7,
			gd: 1,
		},
	];

	for (const sample of tier2Samples) {
		const nation = await findOrCreateNation({
			code: sample.code,
			name: sample.name,
		});

		// Italy is WC-absent for 2022 but may appear only in continental — Tier 2 via qualifiers
		await upsertPerformance({
			nationId: nation.id,
			tournamentId: qualifiers.id,
			eliminationPhase: "Group Stage",
			matchesPlayed: sample.matches,
			pointsGained: sample.pts,
			goalsFor: sample.gf,
			goalsDiff: sample.gd,
			yellowCards: 0,
			redCards: 0,
			maxPossiblePoints: sample.maxPts,
		});

		await upsertFifaRanking({
			nationId: nation.id,
			year: wcYear,
			officialRank: sample.fifaRank,
			officialPoints: 1600 - sample.fifaRank * 5,
		});

		console.log(
			`✅ Tier 2 qualifier + FIFA: ${sample.name} (FIFA #${sample.fifaRank})`,
		);
	}

	console.log("🎉 Architecture stubs seeding complete!");
}

if (import.meta.main) {
	const year = Number(process.argv[2] ?? 2022);
	const csvFileName = process.argv[3] ?? "world_cup_2022_stats.csv";
	const withStubs = process.argv.includes("--stubs");

	seedWorldCupData(year, csvFileName)
		.then(async () => {
			if (withStubs || process.argv[2] === undefined) {
				// Default full seed path includes stubs for local dev validation
				await seedArchitectureStubs(year);
			}
		})
		.catch((error) => {
			console.error("Seeding failed:", error);
			process.exit(1);
		});
}
