import { useParams } from "react-router-dom";
import { GraduationCap, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AcademicTimeline from "@/components/AcademicTimeline";
import { motion } from "framer-motion";

const Verify = () => {
  const { hash } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary tracking-tight">EduTrack</span>
            <span className="text-[10px] font-mono-id text-muted-foreground bg-secondary px-1.5 py-0.5 rounded ml-1">UG</span>
          </div>
          <span className="text-xs text-muted-foreground">UNEB Verification Portal</span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Verification status */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-verified-muted mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="h-8 w-8 text-verified" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Record Verified</h1>
            <p className="text-muted-foreground mt-2">This academic timeline has been cryptographically verified by UNEB.</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Verification hash:</span>
              <code className="font-mono-id text-xs text-primary bg-secondary px-2 py-0.5 rounded">{hash || "a3f8c2d1e9b4..."}</code>
            </div>
          </div>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Learner Academic Timeline</span>
                <span className="verified-badge">
                  <CheckCircle className="h-3 w-3" />
                  UNEB Verified
                </span>
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span>EduTrack ID: <span className="font-mono-id">EDU-UG-2024-00482</span></span>
                <span>·</span>
                <span>Nakato Sarah</span>
              </div>
            </CardHeader>
            <CardContent>
              <AcademicTimeline showRestricted={false} />
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              This verification page confirms the authenticity of the academic record above.
              <br />
              Sensitive documents (UNEB result slips, transcripts) are not displayed.{" "}
              <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline transition-subtle">
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Verify;
