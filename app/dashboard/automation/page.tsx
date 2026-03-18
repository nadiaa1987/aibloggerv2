"use client"

import React, { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Play, Pause, Loader2, CheckCircle, Clock } from "lucide-react"

export default function AutomationPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    fetchBlogs()
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/automation")
      const data = await response.json()
      if (data.logs) setLogs(data.logs)
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blogs")
      const data = await response.json()
      if (data.blogs) setBlogs(data.blogs)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTriggerAutomation = async () => {
    setTriggering(true)
    try {
      const response = await fetch("/api/automation/trigger")
      const data = await response.json()
      console.log("Automation trigger response:", data)
      fetchLogs()
    } catch (error) {
      console.error("Error triggering automation:", error)
    } finally {
      setTriggering(false)
    }
  }

  const toggleAutomation = async (blogId: string, currentStatus: boolean) => {
    setUpdating(blogId)
    try {
      const response = await fetch("/api/automation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          automationEnabled: !currentStatus
        })
      })
      if (response.ok) {
        setBlogs(blogs.map(b => b.id === blogId ? { ...b, automationEnabled: !currentStatus } : b))
      }
    } catch (error) {
      console.error("Error toggling automation:", error)
    } finally {
      setUpdating(null)
    }
  }

  const updatePostsPerDay = async (blogId: string, value: number) => {
    setUpdating(blogId)
    try {
      const response = await fetch("/api/automation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          postsPerDay: value
        })
      })
      if (response.ok) {
        setBlogs(blogs.map(b => b.id === blogId ? { ...b, postsPerDay: value } : b))
      }
    } catch (error) {
      console.error("Error updating posts per day:", error)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automation Engine</h1>
            <p className="text-muted-foreground">Automate your content generation and publishing workflow.</p>
          </div>
          <Button onClick={handleTriggerAutomation} disabled={triggering} variant="outline">
            {triggering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Trigger Automation Now
          </Button>
        </div>

        <div className="grid gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className={blog.automationEnabled ? "border-primary" : ""}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {blog.name}
                    {blog.automationEnabled && (
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </CardTitle>
                  <CardDescription>Niche: {blog.niche}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">Status</span>
                    <span className={blog.automationEnabled ? "text-green-500 text-sm" : "text-muted-foreground text-sm"}>
                      {blog.automationEnabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button 
                    variant={blog.automationEnabled ? "destructive" : "default"}
                    onClick={() => toggleAutomation(blog.id!, blog.automationEnabled)}
                    disabled={updating === blog.id}
                  >
                    {updating === blog.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : blog.automationEnabled ? (
                      <Pause className="mr-2 h-4 w-4" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    {blog.automationEnabled ? "Stop" : "Start"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Posts Per Day</label>
                  <select 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={blog.postsPerDay || 1}
                    onChange={(e) => updatePostsPerDay(blog.id!, parseInt(e.target.value))}
                    disabled={updating === blog.id}
                  >
                    {[1, 2, 3, 4, 5, 10, 20].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'post' : 'posts'}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Keyword Source</label>
                  <div className="flex h-10 items-center px-3 text-sm text-muted-foreground border rounded-md bg-muted/50">
                    Keyword Management (Unused)
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Workflow</label>
                  <div className="flex h-10 items-center px-3 text-sm text-muted-foreground border rounded-md bg-muted/50">
                    AI Gen → AI Image → Blogger
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {blogs.length === 0 && !loading && (
            <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No blogs connected. Connect a blog in &quot;My Blogs&quot; to set up automation.
            </div>
          )}
          {loading && (
            <div className="py-20 text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              Loading blogs...
            </div>
          )}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Automation Log</CardTitle>
            <CardDescription>Recent automated actions and status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 text-sm">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Zap className="h-4 w-4 text-red-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{log.action === 'published_article' ? 'Published Article' : log.action}</span>
                      <span className="text-xs text-muted-foreground">{log.title || log.keyword || log.error}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>No automated actions recorded yet.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
