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

const plans = ["trial", "basic", "professional", "enterprise"];

const AddOrganizationDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    org_id_code: "",
    contact_email: "",
    plan: "trial",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("organizations").insert({
        name: form.name,
        org_id_code: form.org_id_code,
        contact_email: form.contact_email || null,
        plan: form.plan,
        user_id: user.id,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Organization Added", description: `${form.name} has been registered.` });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      setForm({ name: "", org_id_code: "", contact_email: "", plan: "trial" });
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
          Add Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org_name">Organization Name *</Label>
            <Input id="org_name" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Uganda Revenue Authority" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_code">Organization ID Code *</Label>
            <Input id="org_code" required value={form.org_id_code} onChange={(e) => setForm(f => ({ ...f, org_id_code: e.target.value }))} placeholder="e.g. ORG-URA-001" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org_email">Contact Email</Label>
              <Input id="org_email" type="email" value={form.contact_email} onChange={(e) => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="contact@org.ug" />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={form.plan} onValueChange={(v) => setForm(f => ({ ...f, plan: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {plans.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register Organization"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationDialog;
