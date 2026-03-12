import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const transcriptTypes = ["Final", "Interim", "UNEB PLE", "UNEB UCE", "UNEB UACE"];

interface TranscriptUploadDialogProps {
  learners: any[];
}

const TranscriptUploadDialog = ({ learners }: TranscriptUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    learner_id: "",
    transcript_type: "Final",
    academic_year: "",
  });

  const filteredLearners = learners.filter((l: any) => {
    const q = searchQuery.toLowerCase();
    return !q || `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) || l.edutrack_id.toLowerCase().includes(q);
  }).slice(0, 20);

  const selectedLearner = learners.find((l: any) => l.id === form.learner_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || !form.learner_id) {
      toast({ title: "Error", description: "Please select a learner and a file.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Get uploader name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      const uploaderName = profile?.full_name || user.email || "Admin";

      // Upload file to storage
      const filePath = `${form.learner_id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("transcripts")
        .upload(filePath, file);

      if (uploadError) {
        toast({ title: "Upload Error", description: uploadError.message, variant: "destructive" });
        return;
      }

      // Insert transcript record
      const { error: dbError } = await supabase.from("transcripts" as any).insert({
        learner_id: form.learner_id,
        file_name: file.name,
        file_path: filePath,
        transcript_type: form.transcript_type,
        academic_year: form.academic_year || null,
        uploaded_by: uploaderName,
      } as any);

      if (dbError) {
        toast({ title: "Error", description: dbError.message, variant: "destructive" });
        return;
      }

      toast({ title: "Transcript Uploaded", description: `${file.name} uploaded for ${selectedLearner?.first_name} ${selectedLearner?.last_name}` });
      queryClient.invalidateQueries({ queryKey: ["admin-transcripts"] });
      setForm({ learner_id: "", transcript_type: "Final", academic_year: "" });
      setFile(null);
      setSearchQuery("");
      setOpen(false);
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 transition-subtle group">
          <Upload className="h-3.5 w-3.5" />
          Upload Transcript
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload MoE Transcript</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Learner search & select */}
          <div className="space-y-2">
            <Label>Search Learner *</Label>
            <Input
              placeholder="Search by name or EduTrack ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && !form.learner_id && (
              <div className="max-h-40 overflow-y-auto border border-border rounded-md">
                {filteredLearners.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3 text-center">No learners found</p>
                ) : (
                  filteredLearners.map((l: any) => (
                    <button
                      key={l.id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 transition-colors flex justify-between"
                      onClick={() => {
                        setForm(f => ({ ...f, learner_id: l.id }));
                        setSearchQuery(`${l.first_name} ${l.last_name}`);
                      }}
                    >
                      <span className="font-medium">{l.first_name} {l.last_name}</span>
                      <span className="text-muted-foreground font-mono text-xs">{l.edutrack_id}</span>
                    </button>
                  ))
                )}
              </div>
            )}
            {selectedLearner && (
              <p className="text-xs text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{selectedLearner.first_name} {selectedLearner.last_name}</span> — {selectedLearner.edutrack_id}
                <button type="button" className="ml-2 text-destructive underline" onClick={() => { setForm(f => ({ ...f, learner_id: "" })); setSearchQuery(""); }}>Clear</button>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transcript Type *</Label>
              <Select value={form.transcript_type} onValueChange={(v) => setForm(f => ({ ...f, transcript_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {transcriptTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acad_year">Academic Year</Label>
              <Input id="acad_year" placeholder="e.g. 2025" value={form.academic_year} onChange={(e) => setForm(f => ({ ...f, academic_year: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transcript File (PDF) *</Label>
            <div
              className="border-2 border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to select PDF file</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !file || !form.learner_id}>
            {loading ? "Uploading..." : "Upload Transcript"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptUploadDialog;
