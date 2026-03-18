import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Search, FileText, Zap } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

const stats = [
  { name: "Total Blogs", value: "0", icon: Globe, change: "+0%", changeType: "neutral" },
  { name: "Keywords Tracked", value: "0", icon: Search, change: "+0%", changeType: "neutral" },
  { name: "Articles Generated", value: "0", icon: FileText, change: "+0%", changeType: "neutral" },
  { name: "Auto Published", value: "0", icon: Zap, change: "+0%", changeType: "neutral" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to AI Blogger Studio. Manage your blogs and automation here.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.changeType === "positive" ? "text-green-500" : "text-muted-foreground"}>
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                No activity yet. Connect a blog to get started.
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                No recent activity.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
