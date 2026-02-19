import { useState } from "react";
import { Search, FileText, Download, QrCode, ArrowUpRight, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import AcademicTimeline from "@/components/AcademicTimeline";

const recentSearches = [
  { id: "EDU-2024-00482", name: "Amara Okafor", searched: "2 hours ago" },
  { id: "EDU-2024-00479", name: "Priya Naidoo", searched: "Yesterday" },
  { id: "EDU-2024-00470", name: "Sarah Mensah", searched: "3 days ago" },
];

const OrgDashboard = () => {
  const [searchId, setSearchId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSearch = () => {
    if (searchId.trim()) setShowResult(true);
  };

  return (
    <DashboardLayout role="organization" title="Organization Portal">
      <div className="space-y-6 animate-fade-in">
        {/* Account Status */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan</span>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">Annual Pro</p>
              <p className="text-xs text-muted-foreground">Expires Dec 2026</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Searches</span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground font-mono-id">847 / 1,000</p>
              <p className="text-xs text-muted-foreground">Monthly limit</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reports</span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground font-mono-id">23</p>
              <p className="text-xs text-muted-foreground">Downloaded this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search Learner</CardTitle>
            <CardDescription>Enter an EduTrack ID to view verified academic timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. EDU-2024-00482"
                  className="pl-9 font-mono-id"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="transition-subtle gap-1.5">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {showResult && (
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
            <Card className="lg:col-span-2 border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Academic Timeline</CardTitle>
                    <CardDescription>
                      <span className="font-mono-id">EDU-2024-00482</span> · Amara Okafor
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 transition-subtle">
                      <QrCode className="h-3.5 w-3.5" />
                      QR Code
                    </Button>
                    <Button size="sm" className="gap-1.5 transition-subtle">
                      <Download className="h-3.5 w-3.5" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AcademicTimeline showRestricted={false} />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Learner Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">EduTrack ID</p>
                  <p className="text-sm font-mono-id text-foreground">EDU-2024-00482</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm text-foreground">Amara Okafor</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Institutions</p>
                  <p className="text-sm text-foreground">Greenfield Academy, Metro University</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Status</p>
                  <span className="verified-badge">Actively Enrolled</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Verified Events</p>
                  <p className="text-sm font-mono-id text-foreground">6 of 7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Searches */}
        {!showResult && (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Searches</CardTitle>
              <CardDescription>Your latest learner lookups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentSearches.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle group cursor-pointer" onClick={() => { setSearchId(s.id); setShowResult(true); }}>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground font-mono-id">{s.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{s.searched}</span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-subtle" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrgDashboard;
