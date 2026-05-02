import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format, isAfter, isSameDay, startOfDay } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalIcon, Clock, Globe, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selected, setSelected] = useState<any>(null);
  const [name, setName] = useState(user?.email ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"discovery_call" | "consultation" | "walkthrough">("discovery_call");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<any>(null);

  const { data: slots, isLoading } = useQuery({
    queryKey: ["available_slots"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data: allSlots } = await supabase
        .from("availability_slots")
        .select("*")
        .gte("start_at", now)
        .order("start_at")
        .limit(200);
      const { data: appts } = await supabase
        .from("appointments")
        .select("slot_id,status")
        .neq("status", "cancelled");
      const taken = new Set((appts ?? []).map((a) => a.slot_id));
      return (allSlots ?? []).filter((s) => !taken.has(s.id) && isAfter(new Date(s.start_at), new Date()));
    },
  });

  const slotDays = useMemo(() => {
    const set = new Set<string>();
    slots?.forEach((s) => set.add(format(new Date(s.start_at), "yyyy-MM-dd")));
    return set;
  }, [slots]);

  const slotsForDay = useMemo(() => {
    if (!date || !slots) return [];
    return slots.filter((s) => isSameDay(new Date(s.start_at), date));
  }, [slots, date]);

  const book = async () => {
    if (!selected) return toast.error("Please select a time slot.");
    if (!name || !email) return toast.error("Name and email are required.");
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
    toast.success("Appointment confirmed!");
    setConfirmed({ ...payload });
    qc.invalidateQueries({ queryKey: ["available_slots"] });
  };

  if (confirmed) {
    return (
      <div className="container py-20">
        <Card className="mx-auto max-w-xl border-primary/30 p-10 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
          <h1 className="font-display text-4xl">You're booked.</h1>
          <p className="mt-3 text-muted-foreground">A confirmation has been recorded.</p>
          <div className="mt-6 rounded-lg border border-border bg-card/50 p-5 text-left text-sm">
            <p><span className="text-muted-foreground">When:</span> <strong>{format(new Date(confirmed.start_at), "EEEE, MMMM d 'at' h:mm a")}</strong></p>
            <p className="mt-1 text-xs text-muted-foreground">Your timezone: {tz}</p>
            <p className="mt-3"><span className="text-muted-foreground">Type:</span> <span className="capitalize">{confirmed.appointment_type.replace("_", " ")}</span></p>
            <p className="mt-1"><span className="text-muted-foreground">Name:</span> {confirmed.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {confirmed.email}</p>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate(user ? "/dashboard" : "/")} className="bg-gradient-gold text-primary-foreground">
              {user ? "Go to dashboard" : "Back to home"}
            </Button>
            <Button variant="outline" onClick={() => { setConfirmed(null); setSelected(null); }}>Book another</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Book Now</p>
        <h1 className="font-display text-4xl md:text-6xl">Pick a time. We'll talk.</h1>
        <p className="mt-3 text-muted-foreground">Confirmed instantly. Free 30-minute discovery calls available.</p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" /> Times shown in {tz}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[auto_1fr_1fr]">
        {/* Calendar */}
        <Card className="p-4 md:p-5">
          <div className="mb-3 flex items-center gap-2 font-display text-lg"><CalIcon className="h-4 w-4 text-primary" /> Select a date</div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => { setDate(d); setSelected(null); }}
            disabled={(d) => d < startOfDay(new Date()) || !slotDays.has(format(d, "yyyy-MM-dd"))}
            modifiers={{ available: (d) => slotDays.has(format(d, "yyyy-MM-dd")) }}
            modifiersClassNames={{ available: "border border-primary/40 text-primary font-medium" }}
            className={cn("pointer-events-auto rounded-md")}
          />
          <p className="mt-3 text-[11px] text-muted-foreground">Highlighted dates have open slots.</p>
        </Card>

        {/* Times */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2 font-display text-lg"><Clock className="h-4 w-4 text-primary" /> Available times</div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !slots?.length ? (
            <div className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No open slots right now. Please send us a message via Contact.
            </div>
          ) : !date || !slotsForDay.length ? (
            <div className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              {date ? "No slots on this day. Pick a highlighted date." : "Pick a date to see times."}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slotsForDay.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-smooth",
                    selected?.id === s.id
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {format(new Date(s.start_at), "h:mm a")}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Details */}
        <Card className="p-5">
          <div className="mb-4 font-display text-lg">Your details</div>
          {selected ? (
            <div className="mb-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">
              <p>Selected: <strong>{format(new Date(selected.start_at), "EEE, MMM d 'at' h:mm a")}</strong></p>
              <p className="mt-1 text-xs text-muted-foreground">Timezone: {tz}</p>
            </div>
          ) : (
            <div className="mb-4 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
              Pick a date and time to continue.
            </div>
          )}
          <div className="space-y-3">
            <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
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
            <div><Label>Notes</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell us a bit about your project…" /></div>
            <Button onClick={book} disabled={submitting || !selected || !name || !email} className="w-full bg-gradient-gold text-primary-foreground">
              {submitting ? "Confirming…" : "Confirm appointment"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
