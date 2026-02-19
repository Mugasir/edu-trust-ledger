import { useState } from "react";
import { Shield, Building2, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") === "organization" ? "organization" : "institution";
  const [activeTab, setActiveTab] = useState(defaultRole);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, hsl(160 60% 30% / 0.4) 0%, transparent 50%)" }} />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary-foreground" />
            <span className="text-xl font-semibold text-primary-foreground tracking-tight">EduTrack</span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-primary-foreground tracking-tight leading-tight">
              Secure academic records,<br />verified with trust.
            </h2>
            <p className="mt-4 text-primary-foreground/60 leading-relaxed">
              Access your institution dashboard or organization portal to manage verified academic records and learner timelines.
            </p>
          </div>
          <p className="text-xs text-primary-foreground/40">© 2026 EduTrack. All records are encrypted and tamper-proof.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-primary" />
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
                Organization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="institution">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Institution Sign In</CardTitle>
                  <CardDescription>Sign in with your verified institution credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-number">Registration Number</Label>
                    <Input id="reg-number" placeholder="e.g. EDU-2024-0012" className="font-mono-id" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inst-email">Email Address</Label>
                    <Input id="inst-email" type="email" placeholder="admin@institution.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inst-password">Password</Label>
                    <Input id="inst-password" type="password" placeholder="••••••••" />
                  </div>
                  <Link to="/admin">
                    <Button className="w-full transition-subtle mt-2">
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Organization Access</CardTitle>
                  <CardDescription>Sign in with your paid organization account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-id">Organization ID</Label>
                    <Input id="org-id" placeholder="e.g. ORG-8827" className="font-mono-id" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Email Address</Label>
                    <Input id="org-email" type="email" placeholder="contact@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-password">Password</Label>
                    <Input id="org-password" type="password" placeholder="••••••••" />
                  </div>
                  <Link to="/organization">
                    <Button className="w-full transition-subtle mt-2">
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to EduTrack's{" "}
            <a href="#" className="underline hover:text-foreground transition-subtle">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground transition-subtle">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
