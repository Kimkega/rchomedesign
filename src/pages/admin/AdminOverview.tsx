import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Inbox, Calendar, Image, Users } from "lucide-react";
import { format } from "date-fns";

export default function AdminOverview() {
  const { data } = useQuery({
    queryKey: ["admin_overview"],
    queryFn: async () => {
      const [{ count: inq }, { count: appt }, { count: gal }, { count: usr }, { data: recentInq }, { data: upcomingAppt }] = await Promise.all([
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("appointments").select("*", { count: "exact", head: true }).gte("start_at", new Date().toISOString()).eq("status", "confirmed"),
        supabase.from("gallery_images").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("appointments").select("*").gte("start_at", new Date().toISOString()).order("start_at").limit(5),
      ]);
      return { inq, appt, gal, usr, recentInq: recentInq ?? [], upcomingAppt: upcomingAppt ?? [] };
    },
  });

  const stats = [
    { label: "New inquiries", value: data?.inq ?? 0, icon: Inbox },
    { label: "Upcoming appointments", value: data?.appt ?? 0, icon: Calendar },
    { label: "Gallery items", value: data?.gal ?? 0, icon: Image },
    { label: "Total users", value: data?.usr ?? 0, icon: Users },
  ];

  return (
    <div>
      <h1 className="mb-2 font-display text-4xl">Overview</h1>
      <p className="mb-8 text-muted-foreground">Snapshot of activity across your site.</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-3 font-display text-4xl">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-display text-2xl">Recent inquiries</h2>
          {data?.recentInq.length ? data.recentInq.map((i) => (
            <div key={i.id} className="flex items-start justify-between border-b border-border/40 py-3 last:border-0">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{i.message}</p>
              </div>
              <span className="text-xs text-muted-foreground">{format(new Date(i.created_at), "MMM d")}</span>
            </div>
          )) : <p className="text-sm text-muted-foreground">No inquiries yet.</p>}
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 font-display text-2xl">Upcoming appointments</h2>
          {data?.upcomingAppt.length ? data.upcomingAppt.map((a) => (
            <div key={a.id} className="flex items-center justify-between border-b border-border/40 py-3 last:border-0">
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{a.appointment_type.replace("_", " ")}</p>
              </div>
              <span className="text-sm text-primary">{format(new Date(a.start_at), "MMM d, h:mm a")}</span>
            </div>
          )) : <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
        </Card>
      </div>
    </div>
  );
}
