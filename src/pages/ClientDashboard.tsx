import { useQuery } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ClientDashboard() {
  const { user, loading } = useAuth();

  const { data: inquiries } = useQuery({
    queryKey: ["my_inquiries", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("inquiries").select("*").eq("user_id", user!.id).order("created_at", { ascending: false })).data ?? [],
  });
  const { data: appts } = useQuery({
    queryKey: ["my_appts", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("appointments").select("*").eq("user_id", user!.id).order("start_at", { ascending: false })).data ?? [],
  });

  if (loading) return <div className="container py-24 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="container py-16">
      <h1 className="mb-2 font-display text-5xl">Your dashboard</h1>
      <p className="mb-10 text-muted-foreground">Track your inquiries and appointments.</p>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Inquiries</h2>
            <Button asChild size="sm" variant="outline"><Link to="/contact">New inquiry</Link></Button>
          </div>
          {!inquiries?.length ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No inquiries yet.</Card>
          ) : (
            <div className="space-y-3">
              {inquiries.map((i) => (
                <Card key={i.id} className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{i.project_type || "Inquiry"}</p>
                    <Badge variant="outline" className="capitalize">{i.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{i.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{format(new Date(i.created_at), "MMM d, yyyy")}</p>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Appointments</h2>
            <Button asChild size="sm" variant="outline"><Link to="/book">Book new</Link></Button>
          </div>
          {!appts?.length ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No appointments yet.</Card>
          ) : (
            <div className="space-y-3">
              {appts.map((a) => (
                <Card key={a.id} className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-display text-lg">{format(new Date(a.start_at), "EEE MMM d, h:mm a")}</p>
                    <Badge variant="outline" className="capitalize">{a.status}</Badge>
                  </div>
                  <p className="text-sm capitalize text-muted-foreground">{a.appointment_type.replace("_", " ")}</p>
                  {a.notes && <p className="mt-1 text-xs text-muted-foreground">{a.notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
