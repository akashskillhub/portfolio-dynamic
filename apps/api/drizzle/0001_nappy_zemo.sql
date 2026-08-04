ALTER TABLE "users" ADD COLUMN "otp" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp_expiry" timestamp;