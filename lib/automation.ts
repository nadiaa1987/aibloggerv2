import { db } from "@/lib/db";
import { keywords, articles, automationLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateText, generateImageUrl } from "@/lib/pollinations";
import { extractJson } from "@/lib/utils";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function runAutomationForBlog(blog: any) {
  try {
    console.log(`Starting automation for blog: ${blog.name}`);

    // 1. Get an unused keyword
    const [kw] = await db.select()
      .from(keywords)
      .where(and(eq(keywords.blogId, blog.id), eq(keywords.status, "unused")))
      .limit(1);

    if (!kw) {
      console.log(`No unused keywords for blog: ${blog.name}`);
      return { success: false, message: "No keywords" };
    }

    // 2. Generate Article
    const prompt = `Write a comprehensive, SEO-optimized blog post for the keyword: "${kw.keyword}". 
      Niche: ${kw.niche}. 
      Target length: 1500-2500 words. 
      Include:
      - An engaging SEO title.
      - A meta description (max 160 chars).
      - Structured headings (H1, H2, H3).
      - An introductory paragraph.
      - Detailed body sections.
      - A FAQ section.
      - Use semantic HTML tags.
      
      Format the output as a JSON object with fields: "title", "content" (HTML), "metaDescription".`;

    const response = await generateText(prompt, "You are a professional SEO copywriter. Output ONLY valid JSON.");
    const data = extractJson(response);

    // 3. Generate Image
    const imagePrompt = `High quality professional blog header image for: ${kw.keyword}, ${kw.niche} style, minimalist, modern.`;
    const imageUrl = generateImageUrl(imagePrompt);

    const fullContent = `<img src="${imageUrl}" alt="${data.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;">\n${data.content}`;

    // 4. Publish to Blogger via Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: blog.bloggerEmail,
      subject: data.title,
      html: fullContent,
    };

    await transporter.sendMail(mailOptions);

    // 5. Update DB
    await db.update(keywords)
      .set({ status: "published" })
      .where(eq(keywords.id, kw.id));

    const articleId = crypto.randomUUID();
    await db.insert(articles).values({
      id: articleId,
      blogId: blog.id,
      userId: blog.userId,
      keywordId: kw.id,
      title: data.title,
      content: fullContent,
      metaDescription: data.metaDescription,
      imageUrl: imageUrl,
      status: "published",
      publishedAt: new Date(),
    });

    // 6. Log activity
    await db.insert(automationLogs).values({
      id: crypto.randomUUID(),
      blogId: blog.id,
      userId: blog.userId,
      action: "published_article",
      keyword: kw.keyword,
      title: data.title,
      status: "success",
    });

    console.log(`Successfully published article for ${blog.name}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Error in automation for ${blog.name}:`, error);
    
    // Log failure
    try {
      await db.insert(automationLogs).values({
        id: crypto.randomUUID(),
        blogId: blog.id,
        userId: blog.userId,
        action: "published_article",
        status: "failed",
        error: error.message,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return { success: false, error: error.message };
  }
}
