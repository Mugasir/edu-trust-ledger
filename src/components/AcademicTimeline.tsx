import { CheckCircle, Clock, FileText, LogIn, LogOut, Upload } from "lucide-react";

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
  milestone: CheckCircle,
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
  { id: "1", date: "2022-01-15", type: "enrolled", institution: "Greenfield Academy", description: "Enrolled in Grade 10 academic program" },
  { id: "2", date: "2022-06-20", type: "milestone", institution: "Greenfield Academy", description: "Completed mid-year assessments — top 10%" },
  { id: "3", date: "2022-11-30", type: "document", institution: "Greenfield Academy", description: "Academic transcript uploaded (restricted)" },
  { id: "4", date: "2023-12-15", type: "milestone", institution: "Greenfield Academy", description: "Graduated Grade 12 with distinction" },
  { id: "5", date: "2023-12-16", type: "left", institution: "Greenfield Academy", description: "Left institution — completed program" },
  { id: "6", date: "2024-02-01", type: "enrolled", institution: "Metro University", description: "Enrolled in BSc Computer Science" },
  { id: "7", date: "2024-06-15", type: "verified", institution: "Metro University", description: "First semester verified — GPA 3.8" },
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
              <div key={event.id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                <div className={`absolute left-3 top-1 h-5 w-5 rounded-full flex items-center justify-center ${colors}`}>
                  <Upload className="h-3 w-3" />
                </div>
                <div className="bg-muted/50 border border-border rounded-md p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono-id">{event.date}</span>
                    <span>·</span>
                    <span>{event.institution}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground italic">Document uploaded — restricted access</p>
                </div>
              </div>
            );
          }

          return (
            <div key={event.id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
              <div className={`absolute left-3 top-1 h-5 w-5 rounded-full flex items-center justify-center ${colors}`}>
                <Icon className="h-3 w-3" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono-id">{event.date}</span>
                  <span>·</span>
                  <span>{event.institution}</span>
                </div>
                <p className="mt-1 text-sm text-foreground">{event.description}</p>
                {event.type === "verified" && (
                  <span className="verified-badge mt-2">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicTimeline;
