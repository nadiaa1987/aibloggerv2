import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { keywords, blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    
    const query = db.select().from(keywords);
    const allKeywords = blogId 
      ? await query.where(eq(keywords.blogId, blogId))
      : await query;
      
    return NextResponse.json({ keywords: allKeywords });
  } catch (error: any) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { blogId, userId, keywords: kwList } = await req.json();
    
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, blogId));
    
    const newKeywords = kwList.map((kw: string) => ({
      id: crypto.randomUUID(),
      keyword: kw,
      blogId,
      userId,
      status: "unused" as const,
      niche: blog?.niche || "General",
      searchVolume: Math.floor(Math.random() * 5000) + 100,
      difficulty: Math.floor(Math.random() * 100),
      competition: Math.random() > 0.5 ? "Low" : "Medium",
    }));

    if (newKeywords.length > 0) {
      await db.insert(keywords).values(newKeywords);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error creating keywords:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
