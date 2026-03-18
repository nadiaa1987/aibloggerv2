"use client"

import React, { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Send, Wand2, Image as ImageIcon, CheckCircle } from "lucide-react"
import { generateText, generateImageUrl } from "@/lib/pollinations"
import { cn, extractJson } from "@/lib/utils"

export default function ArticleGeneratorPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [selectedBlogId, setSelectedBlogId] = useState<string>("")
  const [keywords, setKeywords] = useState<any[]>([])
  const [selectedKeywordId, setSelectedKeywordId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState<{
    title: string;
    content: string;
    metaDescription: string;
    imageUrl: string;
  } | null>(null)
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (selectedBlogId) {
      fetchKeywords(selectedBlogId)
    } else {
      setKeywords([])
    }
  }, [selectedBlogId])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")
      const data = await response.json()
      if (data.blogs) setBlogs(data.blogs)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    }
  }

  const fetchKeywords = async (blogId: string) => {
    try {
      const response = await fetch(`/api/keywords?blogId=${blogId}`)
      const data = await response.json()
      if (data.keywords) {
        setKeywords(data.keywords.filter((k: any) => k.status === "unused"))
      }
    } catch (error) {
      console.error("Error fetching keywords:", error)
    }
  }

  const handleGenerateArticle = async () => {
    if (!selectedKeywordId) return
    
    setLoading(true)
    try {
      const kw = keywords.find(k => k.id === selectedKeywordId)
      if (!kw) return

      const prompt = `Write a comprehensive, SEO-optimized blog post for the keyword: "${kw.keyword}". 
      Niche: ${kw.niche}. 
      Target length: 1500-2500 words. 
      Include:
      - An engaging SEO title.
      - A meta description (max 160 chars).
      - Structured headings (H1, H2, H3).
      - An introductory paragraph.
      - Detailed body sections.
      - A FAQ section based on common questions about this topic.
      - Use semantic HTML tags for formatting.
      - Include internal link placeholders like [Internal Link: ${kw.niche} Guide].
      
      Format the output as a JSON object with fields: "title", "content" (HTML), "metaDescription".`

      const response = await generateText(prompt, "You are a professional SEO copywriter. Output ONLY valid JSON.")
      const data = extractJson(response)

      // Generate Image
      const imagePrompt = `High quality professional blog header image for: ${kw.keyword}, ${kw.niche} style, minimalist, modern.`
      const imageUrl = generateImageUrl(imagePrompt)

      setArticle({
        title: data.title,
        content: data.content,
        metaDescription: data.metaDescription,
        imageUrl: imageUrl,
      })
    } catch (error) {
      console.error("Error generating article:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!article || !selectedBlogId || !selectedKeywordId) return
    
    setPublishStatus('publishing')
    try {
      const blog = blogs.find(b => b.id === selectedBlogId)
      if (!blog) throw new Error("Blog not found")

      // Add image to content
      const fullContent = `<img src="${article.imageUrl}" alt="${article.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;">\n${article.content}`

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: blog.bloggerEmail,
          subject: article.title,
          html: fullContent,
          blogId: selectedBlogId,
          keywordId: selectedKeywordId,
          metaDescription: article.metaDescription,
          imageUrl: article.imageUrl,
        }),
      })

      if (!response.ok) throw new Error("Failed to publish")

      setPublishStatus('success')
      // Refresh keywords
      fetchKeywords(selectedBlogId)
    } catch (error) {
      console.error("Error publishing article:", error)
      setPublishStatus('error')
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Article Generator</h1>
          <p className="text-muted-foreground">Create SEO optimized content using AI and publish directly to Blogger.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Select a blog and keyword to begin.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Blog</label>
                <select 
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedBlogId}
                  onChange={(e) => setSelectedBlogId(e.target.value)}
                >
                  <option value="">Select a blog...</option>
                  {blogs.map(blog => (
                    <option key={blog.id} value={blog.id}>{blog.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Keyword</label>
                <select 
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedKeywordId}
                  onChange={(e) => setSelectedKeywordId(e.target.value)}
                  disabled={!selectedBlogId || keywords.length === 0}
                >
                  <option value="">{keywords.length === 0 ? "No unused keywords" : "Select a keyword..."}</option>
                  {keywords.map(kw => (
                    <option key={kw.id} value={kw.id}>{kw.keyword}</option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={handleGenerateArticle} 
                disabled={!selectedKeywordId || loading}
                className="w-full"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Article
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Article Preview</CardTitle>
                <CardDescription>Review and publish your content.</CardDescription>
              </div>
              {article && (
                <Button 
                  onClick={handlePublish} 
                  disabled={publishStatus === 'publishing' || publishStatus === 'success'}
                  className={cn(publishStatus === 'success' && "bg-green-600 hover:bg-green-700")}
                >
                  {publishStatus === 'publishing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : publishStatus === 'success' ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {publishStatus === 'publishing' ? 'Publishing...' : publishStatus === 'success' ? 'Published' : 'Publish to Blogger'}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!article && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mb-4 opacity-20" />
                  <p>Your generated article will appear here.</p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
                  <p>AI is writing your article and generating images...</p>
                  <p className="text-xs">This may take up to 60 seconds.</p>
                </div>
              )}
              {article && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-lg shadow-sm" />
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{article.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4 italic">Meta Description: {article.metaDescription}</p>
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
