import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { runAutomationForBlog } from "@/lib/automation";

export async function GET() {
  try {
    console.log("Starting automation trigger...");

    // 1. Get all blogs with automation enabled
    const activeBlogs = await db.select()
      .from(blogs)
      .where(eq(blogs.automationEnabled, true));

    if (activeBlogs.length === 0) {
      console.log("No blogs with automation enabled.");
      return NextResponse.json({ message: "No blogs with automation enabled" });
    }

    // 2. Run automation for each blog
    const results = [];
    for (const blog of activeBlogs) {
      const result = await runAutomationForBlog(blog);
      results.push({ blogName: blog.name, result });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Error in automation trigger:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
