CREATE TABLE "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"users_id" integer,
	"name" varchar(255) NOT NULL,
	"description" text,
	"technology" text[],
	"hero" text,
	"category" text[],
	"source_url" varchar(500),
	"live_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;