import { useState, useEffect } from "react";
import { Search, FileText, Download, QrCode, ArrowUpRight, CreditCard, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import AcademicTimeline from "@/components/AcademicTimeline";
import { motion, AnimatePresence } from "framer-motion";
import { generateEduTrackReport, generateQRCodeDataUrl } from "@/lib/generateReport";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const sampleLearner = {
  id: "EDU-UG-2024-00482",
  name: "Nakato Sarah",
  institutions: "Nakasero Primary School, Mengo Senior School, Makerere University",
  currentLevel: "University — Year 1",
  timeline: [
    { level: "Primary (P1–P7)", institution: "Nakasero Primary School", period: "2012 – 2018", status: "Verified", result: "PLE Aggregate 8, Div I" },
    { level: "O-Level (S1–S4)", institution: "Mengo Senior School", period: "2019 – 2022", status: "Verified", result: "UCE 8 Distinctions, Div I" },
    { level: "A-Level (S5–S6)", institution: "Mengo Senior School", period: "2023 – 2024", status: "Verified", result: "UACE 20 Points" },
    { level: "University", institution: "Makerere University", period: "2025 – Present", status: "In Progress" },
  ],
};

const recentSearches = [
  { id: "EDU-UG-2024-00482", name: "Nakato Sarah", searched: "2 hours ago" },
  { id: "EDU-UG-2024-00479", name: "Namutebi Prossy", searched: "Yesterday" },
  { id: "EDU-UG-2024-00470", name: "Apio Grace", searched: "3 days ago" },
];

const OrgDashboard = () => {
  const [searchId, setSearchId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = () => {
    if (searchId.trim()) setShowResult(true);
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      await generateEduTrackReport(sampleLearner, window.location.origin);
    } finally {
      setDownloading(false);
    }
  };

  const handleShowQR = async () => {
    const url = await generateQRCodeDataUrl(sampleLearner.id, window.location.origin);
    setQrCodeUrl(url);
    setShowQrDialog(true);
  };

  return (
    <DashboardLayout role="organization" title="Organisation Portal">
      <div className="space-y-6">
        {/* Account Status */}
        <motion.div
          className="grid sm:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            { label: "Plan", icon: CreditCard, value: "Annual Pro", sub: "Expires Dec 2026" },
            { label: "Searches", icon: Search, value: "847 / 1,000", sub: "Monthly limit", mono: true },
            { label: "Reports", icon: FileText, value: "23", sub: "Downloaded this month", mono: true },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <Card className="border-border hover:shadow-md transition-subtle cursor-default group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
                    <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-subtle" />
                  </div>
                  <p className={`text-lg font-bold text-foreground ${item.mono ? "font-mono-id" : ""}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search Learner</CardTitle>
            <CardDescription>Enter an EduTrack ID to view a verified academic timeline across Uganda's education levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. EDU-UG-2024-00482"
                  className="pl-9 font-mono-id"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="transition-subtle gap-1.5 group">
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {showResult && (
            <motion.div
              key="result"
              className="grid lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="lg:col-span-2 border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Academic Timeline</CardTitle>
                      <CardDescription>
                        <span className="font-mono-id">EDU-UG-2024-00482</span> · Nakato Sarah
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 transition-subtle" onClick={handleShowQR}>
                        <QrCode className="h-3.5 w-3.5" />
                        QR Code
                      </Button>
                      <Button size="sm" className="gap-1.5 transition-subtle group" onClick={handleDownloadReport} disabled={downloading}>
                        <Download className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                        {downloading ? "Generating..." : "Download Report"}
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
                    <p className="text-sm font-mono-id text-foreground">EDU-UG-2024-00482</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-sm text-foreground">Nakato Sarah</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Institutions</p>
                    <p className="text-sm text-foreground">Nakasero Primary School, Mengo Senior School, Makerere University</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Level</p>
                    <span className="verified-badge">University — Year 1</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">UNEB Results</p>
                    <div className="space-y-1">
                      <p className="text-xs text-foreground"><span className="font-mono-id text-muted-foreground">PLE</span> — Aggregate 8, Div I</p>
                      <p className="text-xs text-foreground"><span className="font-mono-id text-muted-foreground">UCE</span> — 8 Distinctions, Div I</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Verified Events</p>
                    <p className="text-sm font-mono-id text-foreground">7 of 8</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!showResult && (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Searches</CardTitle>
                  <CardDescription>Your latest learner lookups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentSearches.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-subtle group cursor-pointer"
                        onClick={() => { setSearchId(s.id); setShowResult(true); }}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground font-mono-id">{s.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{s.searched}</span>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-subtle" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Dialog */}
        <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Verification QR Code</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />}
              <p className="text-sm text-muted-foreground">Scan this QR code to verify the academic record for <span className="font-mono-id font-medium text-foreground">{sampleLearner.id}</span></p>
              <p className="text-xs text-muted-foreground">Links to the EduTrack verification portal</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default OrgDashboard;
