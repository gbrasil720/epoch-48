CREATE TABLE "fifa_rankings" (
	"id" serial PRIMARY KEY NOT NULL,
	"nation_id" integer NOT NULL,
	"year" integer NOT NULL,
	"official_rank" integer NOT NULL,
	"official_points" real,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(3) NOT NULL,
	"flag" varchar(10),
	"confederation" varchar(50),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "nations_name_unique" UNIQUE("name"),
	CONSTRAINT "nations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "performances" (
	"id" serial PRIMARY KEY NOT NULL,
	"nation_id" integer NOT NULL,
	"tournament_id" integer NOT NULL,
	"elimination_phase" varchar(100) NOT NULL,
	"matches_played" integer DEFAULT 0 NOT NULL,
	"points_gained" integer DEFAULT 0 NOT NULL,
	"goals_for" integer DEFAULT 0 NOT NULL,
	"goals_diff" integer DEFAULT 0 NOT NULL,
	"yellow_cards" integer DEFAULT 0 NOT NULL,
	"red_cards" integer DEFAULT 0 NOT NULL,
	"max_possible_points" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_completed" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "fifa_rankings" ADD CONSTRAINT "fifa_rankings_nation_id_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performances" ADD CONSTRAINT "performances_nation_id_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performances" ADD CONSTRAINT "performances_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "nation_year_idx" ON "fifa_rankings" USING btree ("nation_id","year");--> statement-breakpoint
CREATE UNIQUE INDEX "nation_tournament_idx" ON "performances" USING btree ("nation_id","tournament_id");