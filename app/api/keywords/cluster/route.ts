import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { keywords } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateText } from "@/lib/pollinations";
import { extractJson } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { keywordIds } = await req.json();

    if (!keywordIds || keywordIds.length === 0) {
      return NextResponse.json({ error: "No keywords provided" }, { status: 400 });
    }

    const selectedKeywords = await db.select()
      .from(keywords)
      .where(inArray(keywords.id, keywordIds));

    const kwStrings = selectedKeywords.map(k => k.keyword);
    
    const prompt = `Cluster the following keywords into topics for a blog. Format the output as a JSON object where keys are topic names and values are arrays of keywords.
      Keywords: ${kwStrings.join(", ")}`
    
    const response = await generateText(prompt, "You are an SEO expert. Output ONLY valid JSON.");
    const clusters = extractJson(response);

    // Update each keyword with its new topic
    for (const [topic, kws] of Object.entries(clusters)) {
      if (Array.isArray(kws)) {
        for (const kw of kws) {
          const match = selectedKeywords.find(k => k.keyword.toLowerCase() === kw.toLowerCase());
          if (match) {
            await db.update(keywords)
              .set({ topic })
              .where(eq(keywords.id, match.id));
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error clustering keywords:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
