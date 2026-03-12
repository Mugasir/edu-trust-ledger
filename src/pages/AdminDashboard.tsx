import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Users, FileText, CheckCircle, AlertTriangle, ArrowUpRight, Search, UserCog, Clock, Settings, Building2, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import AddLearnerDialog from "@/components/AddLearnerDialog";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Active: "text-verified bg-verified-muted",
  Completed: "text-primary bg-secondary",
  Left: "text-muted-foreground bg-muted",
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Determine active section from route
  const path = location.pathname;
  const activeSection = path.includes("/learners") ? "learners" :
    path.includes("/documents") ? "documents" :
    path.includes("/settings") ? "settings" : "overview";

  // Fetch institution for current user
  const { data: institution } = useQuery({
    queryKey: ["institution", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("institutions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch learners
  const { data: learners = [] } = useQuery({
    queryKey: ["learners", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("learners")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const filteredLearners = learners.filter((l: any) => {
    const q = searchQuery.toLowerCase();
    return !q || l.first_name.toLowerCase().includes(q) || l.last_name.toLowerCase().includes(q) || l.edutrack_id.toLowerCase().includes(q);
  });

  const totalLearners = learners.length;
  const activeLearners = learners.filter((l: any) => l.status === "Active").length;
  const completedLearners = learners.filter((l: any) => l.status === "Completed").length;

  const stats = [
    { label: "Total Learners", value: String(totalLearners), icon: Users, change: `${activeLearners} active` },
    { label: "Documents", value: "0", icon: FileText, change: "Upload coming soon" },
    { label: "Active", value: String(activeLearners), icon: CheckCircle, change: `${totalLearners > 0 ? Math.round((activeLearners / totalLearners) * 100) : 0}% of total` },
    { label: "Completed", value: String(completedLearners), icon: AlertTriangle, change: `${completedLearners} graduated` },
  ];

  const dashboardTitle = activeSection === "learners" ? "Learners" :
    activeSection === "documents" ? "Documents" :
    activeSection === "settings" ? "Settings" :
    institution?.name ?? "Institution Dashboard";

  return (
    <DashboardLayout role="admin" title={dashboardTitle}>
      <div className="space-y-6">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Card className="border-border hover:shadow-md transition-subtle cursor-default group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-subtle" />
                      </div>
                      <p className="text-2xl font-bold text-foreground font-mono-id">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Learners preview */}
              <Card className="lg:col-span-3 border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Learners</CardTitle>
                      <CardDescription>
                        {totalLearners > 0 ? `${totalLearners} learners registered` : "No learners yet — add your first learner"}
                      </CardDescription>
                    </div>
                    <AddLearnerDialog institutionId={institution?.id ?? null} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or EduTrack ID..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    {filteredLearners.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        {totalLearners === 0 ? "Register your first learner to get started." : "No learners match your search."}
                      </p>
                    )}
                    {filteredLearners.slice(0, 10).map((learner: any, i: number) => (
                      <LearnerRow key={learner.id} learner={learner} index={i} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>Latest learner registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {learners.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity yet. Add your first learner.</p>
                  ) : (
                    <div className="space-y-4">
                      {learners.slice(0, 8).map((learner: any, i: number) => (
                        <motion.div key={learner.id} className="relative pl-8" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                          <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-3 w-3 text-primary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-foreground">
                              {learner.first_name} {learner.last_name}
                              <Badge variant="outline" className="ml-2 text-[10px]">{learner.level}</Badge>
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(learner.created_at), "MMM d, yyyy")}</span>
                              {learner.uploaded_by && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1"><UserCog className="h-3 w-3" />{learner.uploaded_by}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Learners Section */}
        {activeSection === "learners" && (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">All Learners</CardTitle>
                  <CardDescription>{totalLearners} learners registered at your institution</CardDescription>
                </div>
                <AddLearnerDialog institutionId={institution?.id ?? null} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, EduTrack ID, or level..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              {/* Table header */}
              <div className="hidden md:grid grid-cols-6 gap-4 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border mb-2">
                <span className="col-span-2">Learner</span>
                <span>Level</span>
                <span>Gender</span>
                <span>Status</span>
                <span>Registered</span>
              </div>

              <div className="space-y-1">
                {filteredLearners.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {totalLearners === 0 ? "Register your first learner to get started." : "No learners match your search."}
                  </p>
                )}
                {filteredLearners.map((learner: any, i: number) => (
                  <motion.div
                    key={learner.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 p-3 rounded-md hover:bg-secondary/50 transition-subtle items-center"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">{learner.first_name[0]}{learner.last_name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{learner.first_name} {learner.last_name}</p>
                        <p className="text-xs text-muted-foreground font-mono-id">{learner.edutrack_id}</p>
                      </div>
                    </div>
                    <span className="text-sm text-foreground font-mono-id">{learner.level}</span>
                    <span className="text-sm text-muted-foreground">{learner.gender ?? "—"}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${statusColors[learner.status] ?? "text-muted-foreground bg-muted"}`}>
                      {learner.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{format(new Date(learner.created_at), "MMM d, yyyy")}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Section */}
        {activeSection === "documents" && (
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Documents</CardTitle>
                <CardDescription>Manage academic documents, UNEB slips, transcripts, and testimonials.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Document Management Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Upload and manage UNEB result slips, school transcripts, testimonials, and other academic documents. 
                    All documents will be encrypted and linked to learner profiles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === "settings" && (
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Institution Details</CardTitle>
                <CardDescription>View and manage your institution's profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Institution Name</Label>
                    <p className="text-sm font-medium text-foreground mt-1">{institution?.name ?? "—"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">MoES Registration</Label>
                    <p className="text-sm font-mono-id text-foreground mt-1">{institution?.moes_reg_number ?? "—"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">District</Label>
                    <p className="text-sm text-foreground mt-1">{institution?.district ?? "—"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Level</Label>
                    <p className="text-sm text-foreground mt-1 capitalize">{institution?.level ?? "—"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Total Learners</Label>
                    <p className="text-sm font-mono-id text-foreground mt-1">{totalLearners}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Registered Since</Label>
                    <p className="text-sm text-foreground mt-1">{institution?.created_at ? format(new Date(institution.created_at), "MMMM yyyy") : "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Staff & Roles</CardTitle>
                <CardDescription>Manage staff members and their access roles within the institution.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <UserCog className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Staff management is coming soon. You'll be able to invite headmasters, deans, registrars, and teachers to collaborate on learner records.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Extracted learner row component
const LearnerRow = ({ learner, index }: { learner: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.06 }}
    className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle group cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-xs font-semibold text-primary">{learner.first_name[0]}{learner.last_name[0]}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{learner.first_name} {learner.last_name}</p>
        <p className="text-xs text-muted-foreground font-mono-id">{learner.edutrack_id}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground font-mono-id">{learner.level}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[learner.status] ?? "text-muted-foreground bg-muted"}`}>
        {learner.status}
      </span>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-subtle" />
    </div>
  </motion.div>
);

export default AdminDashboard;
