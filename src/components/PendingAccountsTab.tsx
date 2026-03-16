import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";

const PendingAccountsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingProfiles = [], isLoading } = useQuery({
    queryKey: ["admin-pending-accounts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: allProfiles = [] } = useQuery({
    queryKey: ["admin-all-accounts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const handleApprove = async (profileUserId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "approved" } as any)
      .eq("user_id", profileUserId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Approved", description: "Account has been approved." });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-accounts"] });
    }
  };

  const handleReject = async (profileUserId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected" } as any)
      .eq("user_id", profileUserId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Account has been rejected." });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-accounts"] });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-verified bg-verified-muted";
      case "rejected": return "text-destructive bg-destructive/10";
      default: return "text-warning bg-warning/10";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Account Approvals</CardTitle>
            <CardDescription>
              {pendingProfiles.length} pending · {allProfiles.filter((p: any) => p.status === "approved").length} approved
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> {pendingProfiles.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {pendingProfiles.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">No pending accounts.</p>
        )}
        <div className="space-y-2">
          {pendingProfiles.map((profile: any, i: number) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-warning/10 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(profile.created_at), "MMM d, yyyy")}
                </span>
                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs text-destructive hover:text-destructive" onClick={() => handleReject(profile.user_id)}>
                  <XCircle className="h-3 w-3" /> Reject
                </Button>
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => handleApprove(profile.user_id)}>
                  <CheckCircle className="h-3 w-3" /> Approve
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* All accounts summary */}
        {allProfiles.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">All Accounts</p>
            <div className="space-y-1">
              {allProfiles.slice(0, 20).map((profile: any) => (
                <div key={profile.id} className="flex items-center justify-between py-2 px-2 text-sm">
                  <div>
                    <span className="font-medium text-foreground">{profile.full_name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{profile.email}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor(profile.status)}`}>
                    {profile.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingAccountsTab;
