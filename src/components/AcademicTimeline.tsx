import { CheckCircle, Clock, FileText, LogIn, LogOut, Upload, Award } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineEvent {
  id: string;
  date: string;
  type: "enrolled" | "document" | "milestone" | "left" | "verified";
  institution: string;
  description: string;
}

const iconMap = {
  enrolled: LogIn,
  document: FileText,
  milestone: Award,
  left: LogOut,
  verified: CheckCircle,
};

const colorMap = {
  enrolled: "text-primary bg-primary/10",
  document: "text-muted-foreground bg-muted",
  milestone: "text-accent bg-verified-muted",
  left: "text-muted-foreground bg-muted",
  verified: "text-verified bg-verified-muted",
};

const sampleEvents: TimelineEvent[] = [
  { id: "1", date: "2015-02-02", type: "enrolled", institution: "Nakasero Primary School", description: "Enrolled in Primary One (P1)" },
  { id: "2", date: "2021-11-15", type: "milestone", institution: "Nakasero Primary School", description: "Sat PLE — Aggregate 8 (Division One)" },
  { id: "3", date: "2021-12-10", type: "document", institution: "UNEB", description: "PLE results slip uploaded (restricted)" },
  { id: "4", date: "2022-02-01", type: "enrolled", institution: "Mengo Senior School", description: "Enrolled in Senior One (S1) — O-Level" },
  { id: "5", date: "2025-11-20", type: "milestone", institution: "Mengo Senior School", description: "Sat UCE — 8 distinctions, Division One" },
  { id: "6", date: "2025-12-01", type: "left", institution: "Mengo Senior School", description: "Completed O-Level programme" },
  { id: "7", date: "2026-02-03", type: "enrolled", institution: "Makerere University", description: "Enrolled in BSc Computer Science" },
  { id: "8", date: "2026-02-15", type: "verified", institution: "Makerere University", description: "First semester verified — CGPA 4.2/5.0" },
];

interface AcademicTimelineProps {
  events?: TimelineEvent[];
  showRestricted?: boolean;
}

const AcademicTimeline = ({ events = sampleEvents, showRestricted = false }: AcademicTimelineProps) => {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-6">
        {events.map((event, index) => {
          const Icon = iconMap[event.type];
          const colors = colorMap[event.type];

          if (event.type === "document" && !showRestricted) {
            return (
              <motion.div
                key={event.id}
                className="relative pl-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <div className={`absolute left-3 top-1 h-5 w-5 rounded-full flex items-center justify-center ${colors}`}>
                  <Upload className="h-3 w-3" />
                </div>
                <div className="bg-muted/50 border border-border rounded-md p-3 hover:bg-muted/70 transition-subtle">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono-id">{event.date}</span>
                    <span>·</span>
                    <span>{event.institution}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground italic">Document uploaded — restricted access</p>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={event.id}
              className="relative pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <motion.div
                className={`absolute left-3 top-1 h-5 w-5 rounded-full flex items-center justify-center ${colors}`}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="h-3 w-3" />
              </motion.div>
              <div className="hover:bg-secondary/30 rounded-md p-2 -m-2 transition-subtle">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono-id">{event.date}</span>
                  <span>·</span>
                  <span>{event.institution}</span>
                </div>
                <p className="mt-1 text-sm text-foreground">{event.description}</p>
                {event.type === "verified" && (
                  <motion.span
                    className="verified-badge mt-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
                  >
                    <CheckCircle className="h-3 w-3" />
                    UNEB Verified
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicTimeline;
