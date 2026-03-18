import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { keywords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(keywords).where(eq(keywords.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting keyword:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
