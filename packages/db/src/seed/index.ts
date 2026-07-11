import * as fs from "node:fs";
import * as path from "node:path";
import { neon, neonConfig } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../schema";
import { nations, performances, tournaments } from "../schema";

neonConfig.poolQueryViaFetch = true;

dotenv.config({
	path: path.resolve(import.meta.dirname, "../../../../apps/server/.env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error("DATABASE_URL is not set");
	process.exit(1);
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

async function findOrCreateTournament(year: number) {
	const existing = await db.query.tournaments.findFirst({
		where: (tournament, { and, eq }) =>
			and(eq(tournament.year, year), eq(tournament.type, "WORLD_CUP")),
	});

	if (existing) {
		return existing;
	}

	const [tournament] = await db
		.insert(tournaments)
		.values({
			name: `World Cup ${year}`,
			year,
			type: "WORLD_CUP",
		})
		.returning();

	if (!tournament) {
		throw new Error(`Failed to create tournament for World Cup ${year}`);
	}

	return tournament;
}

async function findOrCreateNation(record: WorldCupCsvRecord) {
	const existing = await db.query.nations.findFirst({
		where: (nation, { eq }) => eq(nation.code, record.fifa_code),
	});

	if (existing) {
		return existing;
	}

	const [nation] = await db
		.insert(nations)
		.values({
			name: record.country_name,
			code: record.fifa_code,
		})
		.returning();

	if (!nation) {
		throw new Error(`Failed to create nation ${record.country_name}`);
	}

	return nation;
}

/**
 * Esse script roda de forma independente com Bun: `bun run src/seed/index.ts`
 * Ele lê um arquivo CSV baixado do Kaggle e injeta no banco.
 */
export async function seedWorldCupData(year: number, csvFileName: string) {
	console.log(`🌱 Iniciando o Seeding da Copa de ${year}...`);

	const tournament = await findOrCreateTournament(year);
	const records = readCsvRecords(csvFileName);

	console.log(`📊 Encontrados ${records.length} registros no CSV.`);

	for (const record of records) {
		const nation = await findOrCreateNation(record);

		const existingPerformance = await db.query.performances.findFirst({
			where: (performance, { and, eq }) =>
				and(
					eq(performance.nationId, nation.id),
					eq(performance.tournamentId, tournament.id),
				),
		});

		if (existingPerformance) {
			console.log(`↩️ Já existe: ${nation.name}`);
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
		console.log(`✅ Adicionado: ${nation.name}`);
	}

	console.log("🎉 Seeding concluído com sucesso!");
}

if (import.meta.main) {
	const year = Number(process.argv[2] ?? 2022);
	const csvFileName = process.argv[3] ?? "world_cup_2022_stats.csv";

	seedWorldCupData(year, csvFileName).catch((error) => {
		console.error("Seeding failed:", error);
		process.exit(1);
	});
}
