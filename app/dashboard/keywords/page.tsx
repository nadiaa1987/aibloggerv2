"use client"

import React, { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Tag, Filter, CheckCircle, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function KeywordsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [keywords, setKeywords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedBlogId, setSelectedBlogId] = useState<string>("")
  const [manualKeywords, setManualKeywords] = useState("")

  useEffect(() => {
    fetchBlogs()
    fetchKeywords()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")
      const data = await response.json()
      if (data.blogs) {
        setBlogs(data.blogs)
        if (data.blogs.length > 0) setSelectedBlogId(data.blogs[0].id)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    }
  }

  const fetchKeywords = async (blogId?: string) => {
    try {
      setLoading(true)
      const url = blogId ? `/api/keywords?blogId=${blogId}` : "/api/keywords"
      const response = await fetch(url)
      const data = await response.json()
      if (data.keywords) {
        setKeywords(data.keywords)
      }
    } catch (error) {
      console.error("Error fetching keywords:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeywords = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBlogId || !manualKeywords.trim()) return

    const keywordList = manualKeywords.split("\n").map(k => k.trim()).filter(k => k !== "")

    try {
      const response = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: selectedBlogId,
          userId: "demo-user",
          keywords: keywordList,
        }),
      })
      if (response.ok) {
        setIsAdding(false)
        setManualKeywords("")
        fetchKeywords(selectedBlogId)
      }
    } catch (error) {
      console.error("Error adding keywords:", error)
    }
  }

  const handleDeleteKeyword = async (id: string) => {
    try {
      const response = await fetch(`/api/keywords/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchKeywords(selectedBlogId)
      }
    } catch (error) {
      console.error("Error deleting keyword:", error)
    }
  }

  const handleClusterKeywords = async () => {
    if (keywords.length === 0) return
    
    setLoading(true)
    try {
      const unusedKeywordIds = keywords.filter(k => k.status === "unused").map(k => k.id)
      const response = await fetch("/api/keywords/cluster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywordIds: unusedKeywordIds,
        }),
      })
      if (response.ok) {
        fetchKeywords(selectedBlogId)
      }
    } catch (error) {
      console.error("Error clustering keywords:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredKeywords = selectedBlogId 
    ? keywords.filter(k => k.blogId === selectedBlogId)
    : keywords

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Keyword Management</h1>
            <p className="text-muted-foreground">Add and organize keywords for your blogs.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClusterKeywords} disabled={loading}>
              <Tag className="mr-2 h-4 w-4" /> AI Cluster
            </Button>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Keywords
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              className="bg-transparent focus:outline-none"
              value={selectedBlogId}
              onChange={(e) => {
                setSelectedBlogId(e.target.value)
                fetchKeywords(e.target.value)
              }}
            >
              <option value="">All Blogs</option>
              {blogs.map(blog => (
                <option key={blog.id} value={blog.id}>{blog.name}</option>
              ))}
            </select>
          </div>
        </div>

        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Add Keywords Manually</CardTitle>
              <CardDescription>Enter one keyword per line and select a blog.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddKeywords} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Select Blog</label>
                  <select 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedBlogId}
                    onChange={(e) => setSelectedBlogId(e.target.value)}
                    required
                  >
                    <option value="">Select a blog...</option>
                    {blogs.map(blog => (
                      <option key={blog.id} value={blog.id}>{blog.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Keywords (one per line)</label>
                  <textarea 
                    className="flex min-h-[150px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="best running shoes&#10;running for beginners&#10;marathon training tips"
                    value={manualKeywords}
                    onChange={(e) => setManualKeywords(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Keywords</Button>
                  <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Keyword List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground text-sm">Loading keywords...</p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Keyword</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Topic</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Volume</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Difficulty</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="border-0">
                    {filteredKeywords.map((kw) => (
                      <tr key={kw.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{kw.keyword}</td>
                        <td className="p-4 align-middle">
                          {kw.topic ? (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                              {kw.topic}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Not clustered</span>
                          )}
                        </td>
                        <td className="p-4 align-middle">{(kw.searchVolume || 0).toLocaleString()}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-12 rounded-full bg-secondary overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  (kw.difficulty || 0) < 30 ? "bg-green-500" : (kw.difficulty || 0) < 70 ? "bg-yellow-500" : "bg-red-500"
                                )}
                                style={{ width: `${kw.difficulty || 0}%` }}
                              />
                            </div>
                            <span>{kw.difficulty || 0}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {kw.status === "published" ? (
                            <span className="flex items-center gap-1 text-green-500">
                              <CheckCircle className="h-3 w-3" /> Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" /> Unused
                            </span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteKeyword(kw.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredKeywords.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No keywords found. Add some keywords or change the filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
