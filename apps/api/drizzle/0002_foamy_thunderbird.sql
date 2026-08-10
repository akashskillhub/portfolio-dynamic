CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"users_id" integer,
	"degree_year" varchar(255),
	"degree_college" varchar(255),
	"degree_percent" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "social" (
	"id" serial PRIMARY KEY NOT NULL,
	"users_id" integer,
	"platform" varchar(255),
	"platformLink" varchar(500)
);
--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social" ADD CONSTRAINT "social_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;