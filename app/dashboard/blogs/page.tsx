"use client"

import React, { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Plus, Trash2, ExternalLink, Settings as SettingsIcon, Loader2 } from "lucide-react"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  // Form state
  const [newBlog, setNewBlog] = useState({
    name: "",
    niche: "",
    bloggerEmail: "",
    blogUrl: "",
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blogs")
      const data = await response.json() as { blogs?: any[] }
      if (data.blogs) {
        setBlogs(data.blogs)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBlog,
          userId: "demo-user", // Placeholder
        }),
      })
      if (response.ok) {
        setIsAdding(false)
        setNewBlog({ name: "", niche: "", bloggerEmail: "", blogUrl: "" })
        fetchBlogs()
      }
    } catch (error) {
      console.error("Error adding blog:", error)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return
    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Blogs</h1>
            <p className="text-muted-foreground">Manage your Blogger accounts and settings.</p>
          </div>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Blog
          </Button>
        </div>

        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Blog</CardTitle>
              <CardDescription>Enter your Blogger details for Email-to-Post integration.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBlog} className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Blog Name</label>
                  <input 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="My Travel Blog"
                    value={newBlog.name}
                    onChange={(e) => setNewBlog({...newBlog, name: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Niche</label>
                  <input 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Travel, Health, Tech"
                    value={newBlog.niche}
                    onChange={(e) => setNewBlog({...newBlog, niche: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Blogger Secret Email</label>
                  <input 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="secret.xyz@blogger.com"
                    value={newBlog.bloggerEmail}
                    onChange={(e) => setNewBlog({...newBlog, bloggerEmail: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Blog URL</label>
                  <input 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://myblog.blogspot.com"
                    value={newBlog.blogUrl}
                    onChange={(e) => setNewBlog({...newBlog, blogUrl: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit">Save Blog</Button>
                  <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card key={blog.id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{blog.name}</CardTitle>
                  <CardDescription>{blog.niche}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL:</span>
                    <a href={blog.blogUrl} target="_blank" className="flex items-center text-primary hover:underline">
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBlog(blog.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {blogs.length === 0 && !loading && !isAdding && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No blogs connected yet. Click "Add Blog" to get started.
            </div>
          )}
          {loading && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              Loading blogs...
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
