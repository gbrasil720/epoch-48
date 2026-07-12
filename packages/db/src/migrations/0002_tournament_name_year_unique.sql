ALTER TABLE "tournaments" DROP CONSTRAINT IF EXISTS "unique_year_type";--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "unique_name_year" UNIQUE("name","year");
