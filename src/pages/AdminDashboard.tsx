import { Users, FileText, CheckCircle, AlertTriangle, ArrowUpRight, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import AcademicTimeline from "@/components/AcademicTimeline";

const stats = [
  { label: "Total Learners", value: "1,247", icon: Users, change: "+23 this month" },
  { label: "Documents Uploaded", value: "3,891", icon: FileText, change: "+156 this month" },
  { label: "Verified Records", value: "1,102", icon: CheckCircle, change: "88.4% verified" },
  { label: "Pending Actions", value: "12", icon: AlertTriangle, change: "3 require attention" },
];

const recentLearners = [
  { id: "EDU-2024-00482", name: "Amara Okafor", status: "Active", date: "2024-02-01" },
  { id: "EDU-2024-00481", name: "James Mwangi", status: "Active", date: "2024-01-28" },
  { id: "EDU-2024-00479", name: "Priya Naidoo", status: "Graduated", date: "2023-12-15" },
  { id: "EDU-2024-00475", name: "Chen Wei", status: "Active", date: "2024-01-15" },
  { id: "EDU-2024-00470", name: "Sarah Mensah", status: "Left", date: "2023-11-20" },
];

const statusColors: Record<string, string> = {
  Active: "text-verified bg-verified-muted",
  Graduated: "text-primary bg-secondary",
  Left: "text-muted-foreground bg-muted",
};

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin" title="Institution Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground font-mono-id">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Recent Learners */}
          <Card className="lg:col-span-3 border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Learners</CardTitle>
                  <CardDescription>Latest registered learners</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 transition-subtle">
                  <Plus className="h-3.5 w-3.5" />
                  Add Learner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or EduTrack ID..." className="pl-9" />
              </div>
              <div className="space-y-2">
                {recentLearners.map((learner) => (
                  <div key={learner.id} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{learner.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{learner.name}</p>
                        <p className="text-xs text-muted-foreground font-mono-id">{learner.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[learner.status]}`}>
                        {learner.status}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-subtle" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity / Timeline preview */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest academic events</CardDescription>
            </CardHeader>
            <CardContent>
              <AcademicTimeline showRestricted />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
