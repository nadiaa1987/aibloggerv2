import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs, automationLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const logs = await db.select()
      .from(automationLogs)
      .orderBy(desc(automationLogs.createdAt))
      .limit(50);
    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { blogId, automationEnabled, postsPerDay } = await req.json();
    
    const updateData: any = {};
    if (automationEnabled !== undefined) updateData.automationEnabled = automationEnabled;
    if (postsPerDay !== undefined) updateData.postsPerDay = postsPerDay;
    
    await db.update(blogs)
      .set(updateData)
      .where(eq(blogs.id, blogId));
      
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating automation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
