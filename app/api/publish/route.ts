import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/db"
import { articles, keywords } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { to, subject, html, blogId, keywordId, metaDescription, imageUrl } = await req.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: html,
    }

    await transporter.sendMail(mailOptions)

    // Update DB if blogId and keywordId are provided (manual publish)
    if (blogId && keywordId) {
      // Update keyword status
      await db.update(keywords)
        .set({ status: "published" })
        .where(eq(keywords.id, keywordId));

      // Store article
      await db.insert(articles).values({
        id: crypto.randomUUID(),
        blogId,
        userId: "demo-user",
        keywordId,
        title: subject,
        content: html,
        metaDescription: metaDescription || "",
        imageUrl: imageUrl || "",
        status: "published",
        publishedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error sending email to Blogger:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
