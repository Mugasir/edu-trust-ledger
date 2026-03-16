import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Building2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UGANDA_DISTRICTS } from "@/lib/ugandaDistricts";

const levels = ["Primary", "Secondary", "Tertiary", "University"];
const plans = ["trial", "basic", "professional", "enterprise"];

const AdminCreateAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"institution" | "organization">("institution");
  const [districtSearch, setDistrictSearch] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    // Institution fields
    inst_name: "",
    moes_reg_number: "",
    level: "",
    district: "",
    // Organization fields
    org_name: "",
    org_id_code: "",
    contact_email: "",
    plan: "trial",
  });

  const filteredDistricts = UGANDA_DISTRICTS.filter(d =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const entityData = accountType === "institution"
        ? { name: form.inst_name, moes_reg_number: form.moes_reg_number, level: form.level, district: form.district }
        : { name: form.org_name, org_id_code: form.org_id_code, contact_email: form.contact_email, plan: form.plan };

      const { data, error } = await supabase.functions.invoke("admin-create-account", {
        body: {
          email: form.email.trim().toLowerCase(),
          password: form.password,
          full_name: form.full_name,
          role: accountType,
          entity_data: entityData,
        },
      });

      if (error || data?.error) {
        toast({ title: "Error", description: data?.error || error?.message || "Failed to create account", variant: "destructive" });
        return;
      }

      toast({ title: "Account Created", description: `${form.full_name} (${form.email}) has been created with password.` });
      queryClient.invalidateQueries({ queryKey: ["admin-institutions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-accounts"] });
      setForm({ full_name: "", email: "", password: "", inst_name: "", moes_reg_number: "", level: "", district: "", org_name: "", org_id_code: "", contact_email: "", plan: "trial" });
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
          <UserPlus className="h-3.5 w-3.5" />
          Create Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account type selector */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={accountType === "institution" ? "default" : "outline"}
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setAccountType("institution")}
            >
              <Building2 className="h-3.5 w-3.5" /> Institution
            </Button>
            <Button
              type="button"
              variant={accountType === "organization" ? "default" : "outline"}
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setAccountType("organization")}
            >
              <Shield className="h-3.5 w-3.5" /> Organization
            </Button>
          </div>

          {/* Common fields */}
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input required value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Dr. Mukasa John" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.ug" />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input type="text" required minLength={6} value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Assign a password" />
            </div>
          </div>

          {/* Institution fields */}
          {accountType === "institution" && (
            <>
              <div className="space-y-2">
                <Label>School / University Name *</Label>
                <Input required value={form.inst_name} onChange={(e) => setForm(f => ({ ...f, inst_name: e.target.value }))} placeholder="e.g. Mengo Senior School" />
              </div>
              <div className="space-y-2">
                <Label>MoES Registration Number *</Label>
                <Input required value={form.moes_reg_number} onChange={(e) => setForm(f => ({ ...f, moes_reg_number: e.target.value }))} placeholder="e.g. S.541/001" className="font-mono-id" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={form.level} onValueChange={(v) => setForm(f => ({ ...f, level: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={form.district} onValueChange={(v) => setForm(f => ({ ...f, district: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <div className="px-2 pb-2">
                        <Input placeholder="Search..." value={districtSearch} onChange={(e) => setDistrictSearch(e.target.value)} className="h-8 text-xs" />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Organization fields */}
          {accountType === "organization" && (
            <>
              <div className="space-y-2">
                <Label>Organization Name *</Label>
                <Input required value={form.org_name} onChange={(e) => setForm(f => ({ ...f, org_name: e.target.value }))} placeholder="e.g. MTN Uganda" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Org ID Code *</Label>
                  <Input required value={form.org_id_code} onChange={(e) => setForm(f => ({ ...f, org_id_code: e.target.value }))} placeholder="ORG-UG-001" className="font-mono-id" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input type="email" value={form.contact_email} onChange={(e) => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="hr@org.ug" />
                </div>
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
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreateAccountDialog;
