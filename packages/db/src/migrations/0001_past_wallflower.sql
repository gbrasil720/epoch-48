ALTER TABLE "tournaments" ADD CONSTRAINT "unique_year_type" UNIQUE("year","type");--> statement-breakpoint
ALTER TABLE "performances" ADD CONSTRAINT "valid_elimination_phase" CHECK ("performances"."elimination_phase" IN (
          'Group Stage',
          'Round of 32',
          'Round of 16',
          'Quarter Finals',
          'Fourth Place',
          'Third Place',
          'Runner-up',
          'Winner'
        ));--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "valid_tournament_type" CHECK ("tournaments"."type" IN ('WORLD_CUP', 'QUALIFIERS', 'CONTINENTAL'));