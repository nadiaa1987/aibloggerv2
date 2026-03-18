import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import crypto from "crypto";

export async function GET() {
  try {
    const allBlogs = await db.select().from(blogs);
    return NextResponse.json({ blogs: allBlogs });
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    const newBlog = {
      id: crypto.randomUUID(),
      name: body.name,
      niche: body.niche,
      bloggerEmail: body.bloggerEmail,
      blogUrl: body.blogUrl,
      userId: body.userId,
      automationEnabled: false,
      postsPerDay: 1,
    };
    const [inserted] = await db.insert(blogs).values(newBlog).returning();
    return NextResponse.json({ success: true, blog: inserted });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
