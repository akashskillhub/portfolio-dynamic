ALTER TABLE "education" ADD COLUMN "education_name" varchar(255);--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "percentage" varchar(255);--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "year" varchar(255);--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "is_pursuing" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "degree_year";--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "degree_college";--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "degree_percent";