import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EntityDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "learner" | "institution" | "organization";
  data: any;
  extra?: { institutionName?: string };
}

const EntityDetailDialog = ({ open, onOpenChange, type, data, extra }: EntityDetailDialogProps) => {
  if (!data) return null;

  const Field = ({ label, value }: { label: string; value: any }) => (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === "learner" && `${data.first_name} ${data.last_name}`}
            {type === "institution" && data.name}
            {type === "organization" && data.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {type === "learner" && (
            <>
              <Field label="EduTrack ID" value={<span className="font-mono-id">{data.edutrack_id}</span>} />
              <Field label="Status" value={
                <Badge variant="outline" className="text-[10px]">{data.status}</Badge>
              } />
              <Field label="Level" value={data.level} />
              <Field label="Gender" value={data.gender} />
              <Field label="Date of Birth" value={data.date_of_birth ? format(new Date(data.date_of_birth), "MMM d, yyyy") : "—"} />
              <Field label="Institution" value={extra?.institutionName} />
              <Field label="Guardian Name" value={data.guardian_name} />
              <Field label="Guardian Contact" value={data.guardian_contact} />
              <Field label="Registered By" value={data.uploaded_by} />
              <Field label="Last Modified By" value={data.last_modified_by} />
              <Field label="Created" value={format(new Date(data.created_at), "MMM d, yyyy HH:mm")} />
              <Field label="Updated" value={format(new Date(data.updated_at), "MMM d, yyyy HH:mm")} />
            </>
          )}
          {type === "institution" && (
            <>
              <Field label="MoES Reg. Number" value={<span className="font-mono-id">{data.moes_reg_number}</span>} />
              <Field label="Level" value={data.level} />
              <Field label="District" value={data.district} />
              <Field label="Created" value={format(new Date(data.created_at), "MMM d, yyyy HH:mm")} />
            </>
          )}
          {type === "organization" && (
            <>
              <Field label="Org ID" value={<span className="font-mono-id">{data.org_id_code}</span>} />
              <Field label="Plan" value={
                <Badge variant="outline" className="text-[10px]">{data.plan ?? "trial"}</Badge>
              } />
              <Field label="Contact Email" value={data.contact_email} />
              <Field label="Created" value={format(new Date(data.created_at), "MMM d, yyyy HH:mm")} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntityDetailDialog;
