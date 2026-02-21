import { useState } from "react";
import { GraduationCap, Building2, Shield, ArrowRight, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") === "organization" ? "organization" : "institution";
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Institution form state
  const [instForm, setInstForm] = useState({
    fullName: "",
    email: "",
    password: "",
    schoolName: "",
    moesRegNumber: "",
    district: "",
    level: "secondary",
  });

  // Organization form state
  const [orgForm, setOrgForm] = useState({
    fullName: "",
    email: "",
    password: "",
    orgName: "",
    orgIdCode: "",
    contactEmail: "",
  });

  const handleInstitutionSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: instForm.email,
        password: instForm.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: instForm.fullName,
            role: "institution",
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        // Insert institution details
        const { error: instError } = await supabase.from("institutions").insert({
          user_id: data.user.id,
          name: instForm.schoolName,
          moes_reg_number: instForm.moesRegNumber,
          district: instForm.district,
          level: instForm.level,
        });
        if (instError) console.error("Institution insert error:", instError);
      }

      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: orgForm.email,
        password: orgForm.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: orgForm.fullName,
            role: "organization",
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        const { error: orgError } = await supabase.from("organizations").insert({
          user_id: data.user.id,
          name: orgForm.orgName,
          org_id_code: orgForm.orgIdCode,
          contact_email: orgForm.contactEmail,
        });
        if (orgError) console.error("Organization insert error:", orgError);
      }

      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
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
            <span className="text-xl font-semibold text-primary-foreground tracking-tight">EduTrack</span>
            <span className="text-[10px] font-mono-id text-primary-foreground/50 bg-primary-foreground/10 px-1.5 py-0.5 rounded ml-1">UG</span>
          </Link>
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground tracking-tight leading-tight">
              Join Uganda's trusted<br />academic ledger.
            </h2>
            <p className="mt-4 text-primary-foreground/60 leading-relaxed">
              Register your institution or organisation to start managing and verifying academic records across Uganda's education system.
            </p>
          </motion.div>
          <p className="text-xs text-primary-foreground/40">© 2026 EduTrack Uganda. All records are encrypted and tamper-proof.</p>
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
            <span className="text-lg font-semibold text-primary tracking-tight">EduTrack</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="institution" className="gap-2 transition-subtle">
                <Building2 className="h-4 w-4" />
                Institution
              </TabsTrigger>
              <TabsTrigger value="organization" className="gap-2 transition-subtle">
                <Shield className="h-4 w-4" />
                Organisation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="institution">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Register Institution</CardTitle>
                  <CardDescription>Create an account for your MoES-registered school or university.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInstitutionSignup} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="inst-name">Full Name</Label>
                      <Input id="inst-name" required value={instForm.fullName} onChange={(e) => setInstForm(p => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Dr. Mukasa John" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="inst-school">School / University Name</Label>
                      <Input id="inst-school" required value={instForm.schoolName} onChange={(e) => setInstForm(p => ({ ...p, schoolName: e.target.value }))} placeholder="e.g. Mengo Senior School" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="inst-moes">MoES Registration Number</Label>
                      <Input id="inst-moes" required className="font-mono-id" value={instForm.moesRegNumber} onChange={(e) => setInstForm(p => ({ ...p, moesRegNumber: e.target.value }))} placeholder="e.g. S.541/001" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="inst-district">District</Label>
                        <Input id="inst-district" value={instForm.district} onChange={(e) => setInstForm(p => ({ ...p, district: e.target.value }))} placeholder="e.g. Kampala" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="inst-level">Level</Label>
                        <select id="inst-level" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={instForm.level} onChange={(e) => setInstForm(p => ({ ...p, level: e.target.value }))}>
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="university">University</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="inst-email">Email Address</Label>
                      <Input id="inst-email" type="email" required value={instForm.email} onChange={(e) => setInstForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@school.ac.ug" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="inst-password">Password</Label>
                      <Input id="inst-password" type="password" required minLength={6} value={instForm.password} onChange={(e) => setInstForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full transition-subtle mt-2 group" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Register Organisation</CardTitle>
                  <CardDescription>Create a paid organisation account to verify learner records.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOrgSignup} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="org-name">Full Name</Label>
                      <Input id="org-name" required value={orgForm.fullName} onChange={(e) => setOrgForm(p => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Namugga Sandra" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-company">Organisation Name</Label>
                      <Input id="org-company" required value={orgForm.orgName} onChange={(e) => setOrgForm(p => ({ ...p, orgName: e.target.value }))} placeholder="e.g. MTN Uganda Ltd" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-code">Organisation ID</Label>
                      <Input id="org-code" required className="font-mono-id" value={orgForm.orgIdCode} onChange={(e) => setOrgForm(p => ({ ...p, orgIdCode: e.target.value }))} placeholder="e.g. ORG-UG-8827" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-contact">Contact Email</Label>
                      <Input id="org-contact" type="email" value={orgForm.contactEmail} onChange={(e) => setOrgForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="hr@company.co.ug" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-email">Login Email</Label>
                      <Input id="org-email" type="email" required value={orgForm.email} onChange={(e) => setOrgForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.co.ug" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org-password">Password</Label>
                      <Input id="org-password" type="password" required minLength={6} value={orgForm.password} onChange={(e) => setOrgForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full transition-subtle mt-2 group" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline transition-subtle">Sign In</Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By signing up, you agree to EduTrack's{" "}
            <a href="#" className="underline hover:text-foreground transition-subtle">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground transition-subtle">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
