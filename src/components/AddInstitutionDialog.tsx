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

const levels = ["Primary", "Secondary", "Tertiary", "University"];
const districts = ["Kampala", "Wakiso", "Mukono", "Jinja", "Mbarara", "Gulu", "Lira", "Soroti", "Mbale", "Fort Portal"];

const AddInstitutionDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    moes_reg_number: "",
    level: "",
    district: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("institutions").insert({
        name: form.name,
        moes_reg_number: form.moes_reg_number,
        level: form.level || null,
        district: form.district || null,
        user_id: user.id,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Institution Added", description: `${form.name} has been registered.` });
      queryClient.invalidateQueries({ queryKey: ["admin-institutions"] });
      setForm({ name: "", moes_reg_number: "", level: "", district: "" });
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
          <Plus className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" />
          Add Institution
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Institution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inst_name">Institution Name *</Label>
            <Input id="inst_name" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kampala International School" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moes_reg">MoES Registration Number *</Label>
            <Input id="moes_reg" required value={form.moes_reg_number} onChange={(e) => setForm(f => ({ ...f, moes_reg_number: e.target.value }))} placeholder="e.g. MOES-2024-001" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => setForm(f => ({ ...f, level: v }))}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District</Label>
              <Select value={form.district} onValueChange={(v) => setForm(f => ({ ...f, district: v }))}>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register Institution"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInstitutionDialog;
