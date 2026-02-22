import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const levels = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "S1", "S2", "S3", "S4", "S5", "S6"];
const genders = ["Male", "Female"];

const AddLearnerDialog = ({ institutionId }: { institutionId: string | null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    level: "P1",
    guardian_name: "",
    guardian_contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !institutionId) {
      toast({ title: "Error", description: "You must be logged in with an institution.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Generate EduTrack ID
      const year = new Date().getFullYear();
      const { data: seqData, error: seqError } = await supabase.rpc("nextval" as any, { seq_name: "edutrack_id_seq" } as any);
      
      // Fallback: use timestamp-based ID if sequence fails
      const seq = seqError ? Date.now() % 100000 : Number(seqData);
      const edutrackId = `EDU-UG-${year}-${String(seq).padStart(5, "0")}`;

      const { error } = await supabase.from("learners").insert({
        institution_id: institutionId,
        user_id: user.id,
        edutrack_id: edutrackId,
        first_name: form.first_name,
        last_name: form.last_name,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        level: form.level,
        guardian_name: form.guardian_name || null,
        guardian_contact: form.guardian_contact || null,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Learner Added", description: `${form.first_name} ${form.last_name} registered as ${edutrackId}` });
      queryClient.invalidateQueries({ queryKey: ["learners"] });
      queryClient.invalidateQueries({ queryKey: ["learner-stats"] });
      setForm({ first_name: "", last_name: "", date_of_birth: "", gender: "", level: "P1", guardian_name: "", guardian_contact: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 transition-subtle group">
          <Plus className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" />
          Add Learner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Learner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" required value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" required value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={form.date_of_birth} onChange={(e) => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Level *</Label>
            <Select value={form.level} onValueChange={(v) => setForm(f => ({ ...f, level: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardian_name">Guardian Name</Label>
              <Input id="guardian_name" value={form.guardian_name} onChange={(e) => setForm(f => ({ ...f, guardian_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian_contact">Guardian Contact</Label>
              <Input id="guardian_contact" value={form.guardian_contact} onChange={(e) => setForm(f => ({ ...f, guardian_contact: e.target.value }))} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register Learner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLearnerDialog;
