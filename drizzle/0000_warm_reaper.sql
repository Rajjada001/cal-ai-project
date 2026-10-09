CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'light', 'moderate', 'active', 'very_active');--> statement-breakpoint
CREATE TYPE "public"."goal" AS ENUM('lose', 'maintain', 'gain');--> statement-breakpoint
CREATE TYPE "public"."meal_source" AS ENUM('camera', 'gallery', 'text', 'manual');--> statement-breakpoint
CREATE TYPE "public"."meal_status" AS ENUM('pending', 'analyzing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."target_source" AS ENUM('calculated', 'custom');--> statement-breakpoint
CREATE TYPE "public"."unit_system" AS ENUM('metric', 'imperial');--> statement-breakpoint
CREATE TABLE "ai_daily_usage" (
	"user_id" uuid NOT NULL,
	"local_date" date NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ai_daily_usage_user_id_local_date_pk" PRIMARY KEY("user_id","local_date")
);
--> statement-breakpoint
CREATE TABLE "meal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"quantity" numeric(8, 2) DEFAULT 1 NOT NULL,
	"unit" text,
	"serving_multiplier" numeric(6, 3) DEFAULT 1 NOT NULL,
	"calories" integer NOT NULL,
	"protein_g" numeric(7, 1) DEFAULT 0 NOT NULL,
	"carbs_g" numeric(7, 1) DEFAULT 0 NOT NULL,
	"fat_g" numeric(7, 1) DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "meal_status" DEFAULT 'pending' NOT NULL,
	"source" "meal_source" NOT NULL,
	"name" text,
	"text_input" text,
	"image_file_id" text,
	"image_path" text,
	"eaten_at" timestamp with time zone DEFAULT now() NOT NULL,
	"local_date" date NOT NULL,
	"calories" integer DEFAULT 0 NOT NULL,
	"protein_g" numeric(7, 1) DEFAULT 0 NOT NULL,
	"carbs_g" numeric(7, 1) DEFAULT 0 NOT NULL,
	"fat_g" numeric(7, 1) DEFAULT 0 NOT NULL,
	"ai_confidence" numeric(4, 3),
	"ai_model" text,
	"ai_raw" jsonb,
	"failure_reason" text,
	"trigger_run_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutrition_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"calories" integer NOT NULL,
	"protein_g" integer NOT NULL,
	"carbs_g" integer NOT NULL,
	"fat_g" integer NOT NULL,
	"source" "target_source" DEFAULT 'calculated' NOT NULL,
	"effective_from" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"sex" "sex" NOT NULL,
	"birthdate" date NOT NULL,
	"height_cm" numeric(5, 1) NOT NULL,
	"current_weight_kg" numeric(5, 2) NOT NULL,
	"activity_level" "activity_level" NOT NULL,
	"goal" "goal" NOT NULL,
	"target_weight_kg" numeric(5, 2),
	"weekly_rate_kg" numeric(4, 2),
	"raw_answers" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"unit_system" "unit_system" DEFAULT 'metric' NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"onboarded_at" timestamp with time zone,
	"expo_push_token" text,
	"streak_nudges_enabled" boolean DEFAULT true NOT NULL,
	"last_streak_nudge_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "weight_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"weight_kg" numeric(5, 2) NOT NULL,
	"local_date" date NOT NULL,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_daily_usage" ADD CONSTRAINT "ai_daily_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_targets" ADD CONSTRAINT "nutrition_targets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weight_logs" ADD CONSTRAINT "weight_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meal_items_meal_idx" ON "meal_items" USING btree ("meal_id");--> statement-breakpoint
CREATE INDEX "meals_user_local_date_idx" ON "meals" USING btree ("user_id","local_date");--> statement-breakpoint
CREATE INDEX "nutrition_targets_user_effective_idx" ON "nutrition_targets" USING btree ("user_id","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "weight_logs_user_date_uniq" ON "weight_logs" USING btree ("user_id","local_date");