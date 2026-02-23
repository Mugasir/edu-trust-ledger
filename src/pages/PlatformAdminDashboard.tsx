import { useState } from "react";
import { Users, Building2, GraduationCap, Shield, Search, ArrowUpRight, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const PlatformAdminDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("institutions");

  const { data: institutions = [] } = useQuery({
    queryKey: ["admin-institutions"],
    queryFn: async () => {
      const { data } = await supabase.from("institutions").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: learners = [] } = useQuery({
    queryKey: ["admin-learners"],
    queryFn: async () => {
      const { data } = await supabase.from("learners").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ["admin-organizations"],
    queryFn: async () => {
      const { data } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const totalLearners = learners.length;
  const activeLearners = learners.filter((l: any) => l.status === "Active").length;
  const totalInstitutions = institutions.length;
  const totalOrgs = organizations.length;

  const stats = [
    { label: "Institutions", value: String(totalInstitutions), icon: Building2, change: "Registered schools" },
    { label: "Total Learners", value: String(totalLearners), icon: Users, change: `${activeLearners} active` },
    { label: "Organizations", value: String(totalOrgs), icon: Shield, change: "Verified orgs" },
    { label: "Completion Rate", value: `${totalLearners > 0 ? Math.round((learners.filter((l: any) => l.status === "Completed").length / totalLearners) * 100) : 0}%`, icon: CheckCircle, change: "Graduated learners" },
  ];

  const filteredInstitutions = institutions.filter((i: any) => {
    const q = searchQuery.toLowerCase();
    return !q || i.name.toLowerCase().includes(q) || i.district?.toLowerCase().includes(q) || i.moes_reg_number.toLowerCase().includes(q);
  });

  const filteredLearners = learners.filter((l: any) => {
    const q = searchQuery.toLowerCase();
    return !q || l.first_name.toLowerCase().includes(q) || l.last_name.toLowerCase().includes(q) || l.edutrack_id.toLowerCase().includes(q);
  });

  const filteredOrgs = organizations.filter((o: any) => {
    const q = searchQuery.toLowerCase();
    return !q || o.name.toLowerCase().includes(q) || o.org_id_code.toLowerCase().includes(q);
  });

  // Map institution_id to institution name for learner display
  const instMap: Record<string, string> = {};
  institutions.forEach((i: any) => { instMap[i.id] = i.name; });

  return (
    <DashboardLayout role="platform-admin" title="Platform Administration">
      <div className="space-y-6">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
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

        {/* Search + Tabs */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search institutions, learners, or organizations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="institutions" className="gap-2">
              <Building2 className="h-4 w-4" /> Institutions ({totalInstitutions})
            </TabsTrigger>
            <TabsTrigger value="learners" className="gap-2">
              <Users className="h-4 w-4" /> Learners ({totalLearners})
            </TabsTrigger>
            <TabsTrigger value="organizations" className="gap-2">
              <Shield className="h-4 w-4" /> Organizations ({totalOrgs})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="institutions" className="mt-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Registered Institutions</CardTitle>
                <CardDescription>All MoES-verified schools and universities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredInstitutions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No institutions found.</p>
                  )}
                  {filteredInstitutions.map((inst: any, i: number) => (
                    <motion.div
                      key={inst.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{inst.name}</p>
                          <p className="text-xs text-muted-foreground font-mono-id">{inst.moes_reg_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px]">{inst.level ?? "N/A"}</Badge>
                        <span className="text-xs text-muted-foreground">{inst.district ?? "—"}</span>
                        <span className="text-xs text-muted-foreground font-mono-id">
                          {format(new Date(inst.created_at), "MMM yyyy")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learners" className="mt-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">All Learners</CardTitle>
                <CardDescription>Learners across all institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredLearners.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No learners found.</p>
                  )}
                  {filteredLearners.slice(0, 50).map((learner: any, i: number) => (
                    <motion.div
                      key={learner.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {learner.first_name[0]}{learner.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{learner.first_name} {learner.last_name}</p>
                          <p className="text-xs text-muted-foreground font-mono-id">{learner.edutrack_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{instMap[learner.institution_id] ?? "Unknown"}</span>
                        <Badge variant="outline" className="text-[10px]">{learner.level}</Badge>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          learner.status === "Active" ? "text-verified bg-verified-muted" :
                          learner.status === "Completed" ? "text-primary bg-secondary" :
                          "text-muted-foreground bg-muted"
                        }`}>
                          {learner.status}
                        </span>
                        {learner.uploaded_by && (
                          <span className="text-[10px] text-muted-foreground">by {learner.uploaded_by}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="mt-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Registered Organizations</CardTitle>
                <CardDescription>Organizations with verification access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredOrgs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No organizations found.</p>
                  )}
                  {filteredOrgs.map((org: any, i: number) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{org.name}</p>
                          <p className="text-xs text-muted-foreground font-mono-id">{org.org_id_code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px]">{org.plan ?? "trial"}</Badge>
                        <span className="text-xs text-muted-foreground font-mono-id">
                          {format(new Date(org.created_at), "MMM yyyy")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Registrations</CardTitle>
            <CardDescription>Latest learners added across all institutions</CardDescription>
          </CardHeader>
          <CardContent>
            {learners.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {learners.slice(0, 10).map((learner: any, i: number) => (
                  <motion.div
                    key={learner.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-secondary/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {learner.first_name} {learner.last_name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="font-mono-id">{learner.edutrack_id}</span>
                        <span>·</span>
                        <span>{instMap[learner.institution_id] ?? "Unknown"}</span>
                        <span>·</span>
                        <span>{format(new Date(learner.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlatformAdminDashboard;
