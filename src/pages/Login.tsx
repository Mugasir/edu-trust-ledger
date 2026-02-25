import { useState } from "react";
import { GraduationCap, Building2, ArrowRight, Shield, Loader2, ShieldCheck } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const defaultRole = roleParam === "organization" ? "organization" : roleParam === "admin" ? "admin" : "institution";
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [instEmail, setInstEmail] = useState("");
  const [instPassword, setInstPassword] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleLogin = async (e: React.FormEvent, role: "institution" | "organization" | "admin") => {
    e.preventDefault();
    setLoading(true);
    const email = role === "institution" ? instEmail : role === "organization" ? orgEmail : adminEmail;
    const password = role === "institution" ? instPassword : role === "organization" ? orgPassword : adminPassword;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (roleData?.role === "admin") {
          navigate("/platform-admin");
        } else if (roleData?.role === "institution") {
          navigate("/admin");
        } else if (roleData?.role === "organization") {
          navigate("/organization");
        } else {
          navigate("/");
        }
      }
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, hsl(160 60% 30% / 0.4) 0%, transparent 50%)" }} />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
            <span className="text-xl font-semibold text-primary-foreground tracking-tight">EduCoreTrack</span>
            <span className="text-[10px] font-mono-id text-primary-foreground/50 bg-primary-foreground/10 px-1.5 py-0.5 rounded ml-1">UG</span>
          </Link>
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground tracking-tight leading-tight">
              Uganda's trusted<br />academic ledger.
            </h2>
            <p className="mt-4 text-primary-foreground/60 leading-relaxed">
              From PLE results to university transcripts — access your institution dashboard or organisation portal to manage verified academic records across Uganda's education system.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Primary", detail: "P1–P7 · PLE" },
                { label: "O-Level", detail: "S1–S4 · UCE" },
                { label: "A-Level", detail: "S5–S6 · UACE" },
                { label: "University", detail: "Degrees" },
              ].map((item) => (
                <div key={item.label} className="bg-primary-foreground/5 rounded-md p-3 border border-primary-foreground/10">
                  <p className="text-sm font-semibold text-primary-foreground">{item.label}</p>
                  <p className="text-xs text-primary-foreground/40 font-mono-id">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-xs text-primary-foreground/40">© 2026 EduCoreTrack Uganda. All records are encrypted and tamper-proof.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary tracking-tight">EduCoreTrack</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="institution" className="gap-2 transition-subtle">
                <Building2 className="h-4 w-4" />
                Institution
              </TabsTrigger>
              <TabsTrigger value="organization" className="gap-2 transition-subtle">
                <Shield className="h-4 w-4" />
                Organisation
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2 transition-subtle">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="institution">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Institution Sign In</CardTitle>
                  <CardDescription>Sign in with your MoES-verified institution credentials.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleLogin(e, "institution")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="inst-email">Email Address</Label>
                      <Input id="inst-email" type="email" required value={instEmail} onChange={(e) => setInstEmail(e.target.value)} placeholder="admin@school.ac.ug" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst-password">Password</Label>
                      <Input id="inst-password" type="password" required value={instPassword} onChange={(e) => setInstPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full transition-subtle mt-2 group" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Organisation Access</CardTitle>
                  <CardDescription>Sign in with your paid organisation account to verify learners.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleLogin(e, "organization")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-email">Email Address</Label>
                      <Input id="org-email" type="email" required value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} placeholder="hr@company.co.ug" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-password">Password</Label>
                      <Input id="org-password" type="password" required value={orgPassword} onChange={(e) => setOrgPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full transition-subtle mt-2 group" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Platform Admin</CardTitle>
                  <CardDescription>Sign in to the EduCoreTrack administrative control panel.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input id="admin-email" type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@edutrack.ug" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input id="admin-password" type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full transition-subtle mt-2 group" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline transition-subtle">Sign Up</Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By signing in, you agree to EduCoreTrack's{" "}
            <a href="#" className="underline hover:text-foreground transition-subtle">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground transition-subtle">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
