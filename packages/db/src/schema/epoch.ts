import { 
  pgTable, 
  serial, 
  varchar, 
  integer, 
  real, 
  boolean, 
  timestamp,
  uniqueIndex 
} from 'drizzle-orm/pg-core';

// --- TABELA DE NAÇÕES ---
// Guarda os dados imutáveis dos 211 países.
export const nations = pgTable('nations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(), // ex: "Brazil"
  code: varchar('code', { length: 3 }).notNull().unique(),   // ex: "BRA" (Padrão FIFA)
  flag: varchar('flag', { length: 10 }),                     // ex: "🇧🇷"
  confederation: varchar('confederation', { length: 50 }),   // ex: "CONMEBOL", "UEFA"
  isActive: boolean('is_active').default(true)
});

// --- TABELA DE TORNEIOS ---
// Guarda os torneios que geram pontuação (Copas e Copas Continentais)
export const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),          // ex: "World Cup 2022", "Euro 2020"
  year: integer('year').notNull(),                           // ex: 2022
  type: varchar('type', { length: 50 }).notNull(),           // 'WORLD_CUP', 'QUALIFIERS', 'CONTINENTAL'
  isCompleted: boolean('is_completed').default(true)
});

// --- TABELA DE PERFORMANCE (A MINA DE OURO) ---
// É aqui que salvamos os dados crus que vão alimentar o epoch-engine
export const performances = pgTable('performances', {
  id: serial('id').primaryKey(),
  nationId: integer('nation_id').references(() => nations.id).notNull(),
  tournamentId: integer('tournament_id').references(() => tournaments.id).notNull(),
  
  // A Fase em que a equipe foi eliminada (De acordo com o Enum do engine)
  eliminationPhase: varchar('elimination_phase', { length: 100 }).notNull(),
  
  // Dados brutos da equipe no torneio (Exatamente o que a engine pede)
  matchesPlayed: integer('matches_played').notNull().default(0),
  pointsGained: integer('points_gained').notNull().default(0),
  goalsFor: integer('goals_for').notNull().default(0),
  goalsDiff: integer('goals_diff').notNull().default(0),
  yellowCards: integer('yellow_cards').notNull().default(0),
  redCards: integer('red_cards').notNull().default(0),
  
  // Usado para o Q-Index das eliminatórias
  maxPossiblePoints: integer('max_possible_points').default(0) 
}, (table) => {
  return {
    // Uma nação só pode ter uma performance por torneio
    nationTournamentIdx: uniqueIndex('nation_tournament_idx').on(table.nationId, table.tournamentId),
  }
});

// --- TABELA DE RANKING OFICIAL (FIFA) ---
// Usada APENAS para a "Killer Feature" de comparação
export const fifaRankings = pgTable('fifa_rankings', {
  id: serial('id').primaryKey(),
  nationId: integer('nation_id').references(() => nations.id).notNull(),
  year: integer('year').notNull(),                           // O ano de referência (ex: 2022)
  officialRank: integer('official_rank').notNull(),          // A posição oficial na FIFA naquele ano
  officialPoints: real('official_points'),                   // Os pontos na fórmula oficial (opcional)
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => {
  return {
    // Para garantir que temos apenas 1 registro oficial por ano/país
    nationYearIdx: uniqueIndex('nation_year_idx').on(table.nationId, table.year),
  }
});