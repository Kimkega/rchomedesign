import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  project_type: z.string().max(100).optional().or(z.literal("")),
  budget: z.string().max(100).optional().or(z.literal("")),
  timeline: z.string().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Required").max(2000),
});
type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const planSlug = params.get("plan");
  const contact = useSetting<{ phone: string; email: string; address: string; hours: string }>("contact", {
    phone: "", email: "", address: "", hours: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", email: user?.email ?? "", phone: "", project_type: "", budget: "", timeline: "",
      message: planSlug ? `I'm interested in the "${planSlug}" plan. ` : "",
    },
  });

  const onSubmit = async (v: FormValues) => {
    setSubmitting(true);
    const payload: any = { ...v, user_id: user?.id ?? null };
    const { error } = await supabase.from("inquiries").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Inquiry sent! We'll be in touch soon.");
    form.reset({ ...form.getValues(), message: "", project_type: "", budget: "", timeline: "" });
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Contact</p>
        <h1 className="font-display text-5xl md:text-6xl">Tell us about your project.</h1>
        <p className="mt-4 text-muted-foreground">We respond within one business day.</p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          {contact?.phone && <div className="flex gap-3"><Phone className="h-5 w-5 text-primary" /><div><p className="font-medium">Phone</p><p className="text-sm text-muted-foreground">{contact.phone}</p></div></div>}
          {contact?.email && <div className="flex gap-3"><Mail className="h-5 w-5 text-primary" /><div><p className="font-medium">Email</p><p className="text-sm text-muted-foreground">{contact.email}</p></div></div>}
          {contact?.address && <div className="flex gap-3"><MapPin className="h-5 w-5 text-primary" /><div><p className="font-medium">Studio</p><p className="text-sm text-muted-foreground">{contact.address}</p></div></div>}
          {contact?.hours && <div className="flex gap-3"><Clock className="h-5 w-5 text-primary" /><div><p className="font-medium">Hours</p><p className="text-sm text-muted-foreground">{contact.hours}</p></div></div>}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Label>Name *</Label><Input {...form.register("name")} />{form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}</div>
            <div><Label>Email *</Label><Input type="email" {...form.register("email")} />{form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}</div>
            <div><Label>Phone</Label><Input {...form.register("phone")} /></div>
            <div><Label>Project type</Label><Input placeholder="New build, remodel, barndo…" {...form.register("project_type")} /></div>
            <div><Label>Budget</Label><Input placeholder="e.g. $400k–$600k" {...form.register("budget")} /></div>
            <div><Label>Timeline</Label><Input placeholder="e.g. Spring 2026" {...form.register("timeline")} /></div>
          </div>
          <div><Label>Message *</Label><Textarea rows={6} {...form.register("message")} />{form.formState.errors.message && <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>}</div>
          <Button type="submit" disabled={submitting} size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
            {submitting ? "Sending…" : "Send inquiry"}
          </Button>
        </form>
      </div>
    </div>
  );
}
