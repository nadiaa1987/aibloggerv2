"use client"

import React, { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Download, Loader2, Sparkles, CheckCircle } from "lucide-react"
import { generateText } from "@/lib/pollinations"

export default function ThemeGeneratorPage() {
  const [loading, setLoading] = useState(false)
  const [themeXml, setThemeXml] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    niche: "",
    colorStyle: "modern-blue",
    layoutStyle: "sidebar-right",
    logoText: "",
  })

  const handleGenerateTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const prompt = `Generate a complete, modern, SEO-optimized Blogger XML theme. 
      Niche: ${formData.niche}
      Color Style: ${formData.colorStyle}
      Layout Style: ${formData.layoutStyle}
      Logo Text: ${formData.logoText}
      
      Requirements:
      - Responsive design (Mobile friendly)
      - Fast loading (Optimized CSS/JS)
      - Schema.org markup & Structured data
      - SEO optimized HTML5
      - Ad-ready placeholders (Google AdSense ready)
      - Clean, modern UI
      - Social sharing icons
      - Breadcrumbs navigation
      - Related posts widget
      
      Output ONLY the complete XML code for the Blogger theme.`

      const response = await generateText(prompt, "You are a professional Blogger theme developer and SEO expert. Output ONLY the raw XML code.")
      
      // Improved extraction: find the first < and last >
      const start = response.indexOf('<');
      const end = response.lastIndexOf('>');
      
      if (start !== -1 && end !== -1 && end > start) {
        setThemeXml(response.substring(start, end + 1));
      } else {
        // Fallback to simple cleaning
        const cleanXml = response.replace(/```xml|```/g, "").trim();
        setThemeXml(cleanXml);
      }
    } catch (error) {
      console.error("Error generating theme:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!themeXml) return
    const blob = new Blob([themeXml], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formData.logoText || 'my-blogger'}-theme.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Generator</h1>
          <p className="text-muted-foreground">Generate a custom SEO-optimized Blogger XML theme using AI.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize your blog's appearance and structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateTheme} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Blog Niche</label>
                  <input 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. Travel, Tech, Health"
                    value={formData.niche}
                    onChange={(e) => setFormData({...formData, niche: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Color Style</label>
                  <select 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.colorStyle}
                    onChange={(e) => setFormData({...formData, colorStyle: e.target.value})}
                  >
                    <option value="modern-blue">Modern Blue</option>
                    <option value="minimalist-white">Minimalist White</option>
                    <option value="dark-mode">Dark Mode</option>
                    <option value="earthy-green">Earthy Green</option>
                    <option value="vibrant-orange">Vibrant Orange</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Layout Style</label>
                  <select 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.layoutStyle}
                    onChange={(e) => setFormData({...formData, layoutStyle: e.target.value})}
                  >
                    <option value="sidebar-right">Sidebar Right</option>
                    <option value="sidebar-left">Sidebar Left</option>
                    <option value="full-width">Full Width (No Sidebar)</option>
                    <option value="grid-layout">Grid Layout</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Logo/Blog Text</label>
                  <input 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="My Awesome Blog"
                    value={formData.logoText}
                    onChange={(e) => setFormData({...formData, logoText: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Theme XML
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="min-h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Theme Preview</CardTitle>
                <CardDescription>Your generated theme code will appear here.</CardDescription>
              </div>
              {themeXml && (
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download XML
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              {!themeXml && !loading && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <Palette className="h-12 w-12 mb-4 opacity-20" />
                  <p>Configure settings and generate your theme.</p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center text-muted-foreground">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
                  <p>AI is designing your custom Blogger theme...</p>
                  <p className="text-xs">This takes about 30-45 seconds.</p>
                </div>
              )}
              {themeXml && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-500 h-full">
                  <div className="flex items-center gap-2 text-green-500 font-medium">
                    <CheckCircle className="h-4 w-4" /> Theme Generated Successfully!
                  </div>
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                      {themeXml.substring(0, 1000)}...
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Note: This is a preview of the XML code. Download the full file to upload to Blogger.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
