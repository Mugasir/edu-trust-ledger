import { useState, useEffect } from "react";
import { Shield, Search, FileCheck, ArrowRight, CheckCircle, Lock, Eye, GraduationCap, BookOpen, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "UNEB-Verified Institutions",
    description: "Only MoES-registered schools and universities can create and manage learner records with verified UNEB registration numbers.",
  },
  {
    icon: Search,
    title: "Learner Lookup",
    description: "Employers and organisations search learners by unique EduTrack ID to view verified academic flow from P1 through university.",
  },
  {
    icon: FileCheck,
    title: "QR Verification",
    description: "Every report includes a QR code linking to a tamper-proof verification page — instant authenticity checks for PLE, UCE, and UACE results.",
  },
  {
    icon: Lock,
    title: "Secure Documents",
    description: "Sensitive academic documents — UNEB slips, transcripts, testimonials — stored in private, encrypted storage. Never exposed to third parties.",
  },
  {
    icon: Eye,
    title: "Full Audit Trails",
    description: "Every action is logged. Full transparency for head teachers and registrars, full accountability for the education ecosystem.",
  },
  {
    icon: CheckCircle,
    title: "Trust, Made Visible",
    description: "From Primary Leaving Examinations to university degrees — verified timelines, authenticated records, and cryptographic proof.",
  },
];

const stats = [
  { label: "Schools Registered", value: 2480, suffix: "+" },
  { label: "Learners Tracked", value: 156000, suffix: "+" },
  { label: "Records Verified", value: 98, suffix: "%" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-mono-id">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold text-primary tracking-tight">EduTrack</span>
            <span className="text-[10px] font-mono-id text-muted-foreground bg-secondary px-1.5 py-0.5 rounded ml-1">UG</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="transition-subtle hover:text-foreground">Features</a>
            <a href="#how-it-works" className="transition-subtle hover:text-foreground">How It Works</a>
            <a href="#stats" className="transition-subtle hover:text-foreground">Impact</a>
            <Link to="/login" className="transition-subtle hover:text-foreground">Sign In</Link>
            <Link to="/signup" className="transition-subtle hover:text-foreground font-medium text-primary">Sign Up</Link>
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
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="verified-badge mb-6">
              <CheckCircle className="h-3.5 w-3.5" />
              Ministry of Education & Sports — Verified
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight">
              Trust, Made<br />Visible.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/70 leading-relaxed max-w-lg">
              Uganda's secure academic tracking platform — from Primary Leaving Examinations to university graduation. Every UNEB result authenticated. Every timeline verified.
            </p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/login">
                <Button size="lg" variant="secondary" className="transition-subtle text-base px-8 group">
                  <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Institution Login
                </Button>
              </Link>
              <Link to="/login?role=organization">
                <Button size="lg" variant="outline" className="transition-subtle text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground group">
                  <Award className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Organisation Access
                </Button>
              </Link>
            </motion.div>
            <div className="mt-12 flex items-center gap-6 text-primary-foreground/50 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                End-to-end encrypted
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                MoES compliant
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter */}
      <section id="stats" className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="group">
                <p className="text-4xl md:text-5xl font-bold text-primary">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Platform Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Built for Uganda's academic integrity</h2>
          <p className="mt-4 text-muted-foreground">From UNEB examinations to university transcripts — every feature designed to create verifiable trust.</p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-lg border border-border bg-card transition-subtle hover:shadow-lg hover:border-primary/20 cursor-default"
            >
              <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-subtle">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Three steps to verified trust</h2>
          </div>
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { step: "01", title: "Register with MoES", desc: "Schools register with verified MoES credentials and begin enrolling learners with unique EduTrack IDs — from P1 to university level." },
              { step: "02", title: "Record & Secure", desc: "PLE, UCE, UACE results, transcripts, and milestones are securely recorded with full audit trails and UNEB verification." },
              { step: "03", title: "Search & Verify", desc: "Employers and organisations search by EduTrack ID, view verified academic timelines, and download QR-authenticated reports." },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="text-center group">
                <div className="font-mono-id text-5xl font-bold text-primary/10 mb-4 group-hover:text-primary/25 transition-subtle">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Uganda Education Levels */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Full Coverage</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Every level of Uganda's education system</h2>
        </div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { level: "Primary", detail: "P1 – P7 · PLE", icon: "📘" },
            { level: "O-Level", detail: "S1 – S4 · UCE", icon: "📗" },
            { level: "A-Level", detail: "S5 – S6 · UACE", icon: "📙" },
            { level: "University", detail: "Degree Programmes", icon: "🎓" },
          ].map((item, i) => (
            <motion.div
              key={item.level}
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.04 }}
              className="p-5 rounded-lg border border-border bg-card text-center hover:shadow-md hover:border-primary/20 transition-subtle cursor-default"
            >
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h3 className="font-semibold text-foreground text-sm">{item.level}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono-id">{item.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container mx-auto px-6 py-24 text-center">
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground tracking-tight mb-4">Ready to build trust?</h2>
            <p className="text-primary-foreground/60 mb-8">Join verified Ugandan schools and organisations already using EduTrack to create transparent, tamper-proof academic records.</p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="transition-subtle text-base px-10 group">
                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm font-medium">EduTrack Uganda</span>
            <span className="text-xs text-muted-foreground/60">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="transition-subtle hover:text-foreground">Privacy Policy</a>
            <a href="#" className="transition-subtle hover:text-foreground">Terms of Service</a>
            <a href="#" className="transition-subtle hover:text-foreground">Contact MoES</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
