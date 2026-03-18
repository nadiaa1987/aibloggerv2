import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  bloggerEmail: text("blogger_email").notNull(),
  blogUrl: text("blog_url").notNull(),
  automationEnabled: boolean("automation_enabled").default(false),
  postsPerDay: integer("posts_per_day").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const keywords = pgTable("keywords", {
  id: text("id").primaryKey(),
  keyword: text("keyword").notNull(),
  blogId: text("blog_id").notNull(),
  userId: text("user_id").notNull(),
  status: text("status", { enum: ["unused", "published", "queued"] }).default("unused"),
  niche: text("niche").notNull(),
  searchVolume: integer("search_volume").default(0),
  difficulty: integer("difficulty").default(0),
  competition: text("competition").default("Low"),
  topic: text("topic"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  blogId: text("blog_id").notNull(),
  userId: text("user_id").notNull(),
  keywordId: text("keyword_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaDescription: text("meta_description").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const automationLogs = pgTable("automation_logs", {
  id: text("id").primaryKey(),
  blogId: text("blog_id").notNull(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  keyword: text("keyword"),
  title: text("title"),
  status: text("status").notNull(), // success, failed
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});
