import { useParams } from "react-router-dom";
import { Shield, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AcademicTimeline from "@/components/AcademicTimeline";

const Verify = () => {
  const { hash } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary tracking-tight">EduTrack</span>
          </div>
          <span className="text-xs text-muted-foreground">Verification Portal</span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="animate-fade-in">
          {/* Verification status */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-verified-muted mb-4">
              <CheckCircle className="h-8 w-8 text-verified" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Record Verified</h1>
            <p className="text-muted-foreground mt-2">This academic timeline has been cryptographically verified.</p>
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
                  Verified
                </span>
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span>EduTrack ID: <span className="font-mono-id">EDU-2024-00482</span></span>
                <span>·</span>
                <span>Amara Okafor</span>
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
              Sensitive documents are not displayed.{" "}
              <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline transition-subtle">
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verify;
