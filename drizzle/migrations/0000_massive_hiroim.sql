CREATE TABLE "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"blog_id" text NOT NULL,
	"user_id" text NOT NULL,
	"keyword_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"meta_description" text NOT NULL,
	"image_url" text NOT NULL,
	"status" text DEFAULT 'draft',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "automation_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"blog_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"keyword" text,
	"title" text,
	"status" text NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"niche" text NOT NULL,
	"blogger_email" text NOT NULL,
	"blog_url" text NOT NULL,
	"automation_enabled" boolean DEFAULT false,
	"posts_per_day" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "keywords" (
	"id" text PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"blog_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'unused',
	"niche" text NOT NULL,
	"search_volume" integer DEFAULT 0,
	"difficulty" integer DEFAULT 0,
	"competition" text DEFAULT 'Low',
	"topic" text,
	"created_at" timestamp DEFAULT now()
);
