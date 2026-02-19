import { Shield, Search, FileCheck, ArrowRight, CheckCircle, Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Verified Institutions",
    description: "Only registered educational institutions can create and manage learner records with verified registration numbers.",
  },
  {
    icon: Search,
    title: "Learner Lookup",
    description: "Organizations search learners by unique EduTrack ID to view verified academic flow reports instantly.",
  },
  {
    icon: FileCheck,
    title: "QR Verification",
    description: "Every report includes a QR code linking to a tamper-proof verification page for instant authenticity checks.",
  },
  {
    icon: Lock,
    title: "Secure Documents",
    description: "Sensitive academic documents are stored in private, encrypted storage — never exposed to external parties.",
  },
  {
    icon: Eye,
    title: "Audit Trails",
    description: "Every action is logged. Full transparency for institutions, full accountability for the ecosystem.",
  },
  {
    icon: CheckCircle,
    title: "Trust, Made Visible",
    description: "Verified timelines, authenticated records, and cryptographic proof — trust you can see and verify.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold text-primary tracking-tight">EduTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="transition-subtle hover:text-foreground">Features</a>
            <a href="#how-it-works" className="transition-subtle hover:text-foreground">How It Works</a>
            <Link to="/login" className="transition-subtle hover:text-foreground">Sign In</Link>
          </nav>
          <Link to="/login">
            <Button size="sm" className="transition-subtle">
              Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(160 60% 30% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(210 33% 97% / 0.1) 0%, transparent 40%)" }} />
        <div className="relative container mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl animate-fade-in">
            <div className="verified-badge mb-6">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight">
              Trust, Made<br />Visible.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/70 leading-relaxed max-w-lg">
              A secure academic tracking platform for verified educational institutions and external organizations. Every record authenticated. Every timeline verified.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="transition-subtle text-base px-8">
                  Institution Login
                </Button>
              </Link>
              <Link to="/login?role=organization">
                <Button size="lg" variant="outline" className="transition-subtle text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Organization Access
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-6 text-primary-foreground/50 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                End-to-end encrypted
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                SOC 2 compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Platform Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Built for academic integrity</h2>
          <p className="mt-4 text-muted-foreground">Every feature designed to create verifiable trust between institutions, organizations, and learners.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-lg border border-border bg-card transition-subtle hover:shadow-md hover:border-border/80"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-subtle">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Three steps to verified trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Register & Verify", desc: "Institutions register with verified credentials and begin enrolling learners with unique EduTrack IDs." },
              { step: "02", title: "Record & Secure", desc: "Academic timelines, documents, and milestones are securely recorded with full audit trails." },
              { step: "03", title: "Search & Verify", desc: "Organizations search by EduTrack ID, view verified timelines, and download QR-authenticated reports." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-mono-id text-4xl font-bold text-primary/15 mb-4">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">Ready to build trust?</h2>
          <p className="text-muted-foreground mb-8">Join verified institutions and organizations already using EduTrack to create transparent academic records.</p>
          <Link to="/login">
            <Button size="lg" className="transition-subtle text-base px-10">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">EduTrack</span>
            <span className="text-xs text-muted-foreground/60">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="transition-subtle hover:text-foreground">Privacy Policy</a>
            <a href="#" className="transition-subtle hover:text-foreground">Terms of Service</a>
            <a href="#" className="transition-subtle hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
