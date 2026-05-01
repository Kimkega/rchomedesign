import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format, isAfter } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalIcon, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);
  const [name, setName] = useState(user?.email ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"discovery_call" | "consultation" | "walkthrough">("discovery_call");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: slots } = useQuery({
    queryKey: ["available_slots"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data: allSlots } = await supabase
        .from("availability_slots")
        .select("*")
        .gte("start_at", now)
        .order("start_at")
        .limit(60);
      const { data: appts } = await supabase
        .from("appointments")
        .select("slot_id,status")
        .neq("status", "cancelled");
      const taken = new Set((appts ?? []).map((a) => a.slot_id));
      return (allSlots ?? []).filter((s) => !taken.has(s.id) && isAfter(new Date(s.start_at), new Date()));
    },
  });

  const book = async () => {
    if (!selected) return toast.error("Pick a time slot first.");
    setSubmitting(true);
    const payload: any = {
      slot_id: selected.id,
      user_id: user?.id ?? null,
      name, email, phone,
      appointment_type: type,
      notes,
      status: "confirmed",
      start_at: selected.start_at,
      end_at: selected.end_at,
    };
    const { error } = await supabase.from("appointments").insert(payload);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Appointment booked!");
    qc.invalidateQueries({ queryKey: ["available_slots"] });
    navigate(user ? "/dashboard" : "/");
  };

  // Group by day
  const byDay: Record<string, any[]> = {};
  slots?.forEach((s) => {
    const d = format(new Date(s.start_at), "yyyy-MM-dd");
    (byDay[d] ||= []).push(s);
  });

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Book Now</p>
        <h1 className="font-display text-5xl md:text-6xl">Pick a time. We'll talk.</h1>
        <p className="mt-4 text-muted-foreground">Free 30-minute discovery calls available below.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2 font-display text-xl"><CalIcon className="h-5 w-5 text-primary" /> Available times</div>
          {!slots?.length ? (
            <div className="rounded border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No open slots right now. Please send us a message via Contact.
            </div>
          ) : (
            <div className="max-h-[480px] space-y-5 overflow-y-auto pr-2">
              {Object.entries(byDay).map(([day, daySlots]) => (
                <div key={day}>
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{format(new Date(day), "EEEE, MMMM d")}</p>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        className={`rounded-md border px-3 py-1.5 text-sm transition-smooth ${selected?.id === s.id ? "border-primary bg-primary/15 text-primary" : "border-border hover:border-primary/50"}`}
                      >
                        {format(new Date(s.start_at), "h:mm a")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2 font-display text-xl"><Clock className="h-5 w-5 text-primary" /> Your details</div>
          {selected && (
            <div className="mb-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">
              Selected: <strong>{format(new Date(selected.start_at), "EEE MMM d 'at' h:mm a")}</strong>
            </div>
          )}
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery_call">Discovery Call (30 min, free)</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="walkthrough">Plan Walkthrough</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <Button onClick={book} disabled={submitting || !selected || !name || !email} className="w-full bg-gradient-gold text-primary-foreground">
              {submitting ? "Booking…" : "Confirm appointment"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
