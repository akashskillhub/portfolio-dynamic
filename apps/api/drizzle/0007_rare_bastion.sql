CREATE TABLE "skill" (
	"id" serial PRIMARY KEY NOT NULL,
	"users_id" integer,
	"skill_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;