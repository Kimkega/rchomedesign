import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { uploadFile } from "@/lib/upload";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

async function saveSetting(key: string, value: any) {
  const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function AdminSiteSettings() {
  const { data, refetch } = useSiteSettings();
  const [branding, setBranding] = useState<any>(null);
  const [hero, setHero] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);

  const b = branding ?? data?.branding ?? { site_name: "", tagline: "", logo_url: "" };
  const h = hero ?? data?.hero ?? { headline: "", subheadline: "", description: "", model_url: "" };
  const a = about ?? data?.about ?? { text: "" };

  const handleLogo = async (f: File) => {
    try { const url = await uploadFile("site-assets", f, "logo"); setBranding({ ...b, logo_url: url }); toast.success("Logo uploaded"); }
    catch (e: any) { toast.error(e.message); }
  };
  const handleModel = async (f: File) => {
    try { const url = await uploadFile("site-assets", f, "models"); setHero({ ...h, model_url: url }); toast.success("3D model uploaded"); }
    catch (e: any) { toast.error(e.message); }
  };

  const save = async () => {
    try {
      await Promise.all([
        saveSetting("branding", b),
        saveSetting("hero", h),
        saveSetting("about", a),
      ]);
      toast.success("Saved"); refetch();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Site Settings</h1>
      <Card className="space-y-4 p-6">
        <h2 className="font-display text-2xl">Branding</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Site name</Label><Input value={b.site_name ?? ""} onChange={(e) => setBranding({ ...b, site_name: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={b.tagline ?? ""} onChange={(e) => setBranding({ ...b, tagline: e.target.value })} /></div>
        </div>
        <div>
          <Label>Logo</Label>
          <div className="flex items-center gap-3">
            {b.logo_url && <img src={b.logo_url} alt="" className="h-14 w-14 rounded object-cover" />}
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogo(e.target.files[0])} />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-2xl">Hero</h2>
        <div><Label>Headline</Label><Input value={h.headline ?? ""} onChange={(e) => setHero({ ...h, headline: e.target.value })} /></div>
        <div><Label>Subheadline</Label><Input value={h.subheadline ?? ""} onChange={(e) => setHero({ ...h, subheadline: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea value={h.description ?? ""} onChange={(e) => setHero({ ...h, description: e.target.value })} /></div>
        <div>
          <Label>3D model (.glb) — leave empty for built-in house</Label>
          <div className="flex items-center gap-3">
            {h.model_url && <span className="truncate text-xs text-muted-foreground">{h.model_url}</span>}
            <Input type="file" accept=".glb,.gltf" onChange={(e) => e.target.files?.[0] && handleModel(e.target.files[0])} />
            {h.model_url && <Button size="sm" variant="outline" onClick={() => setHero({ ...h, model_url: "" })}>Clear</Button>}
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-2xl">About</h2>
        <Textarea rows={5} value={a.text ?? ""} onChange={(e) => setAbout({ ...a, text: e.target.value })} />
      </Card>

      <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save all</Button>
    </div>
  );
}

export function AdminContactFooter() {
  const { data, refetch } = useSiteSettings();
  const [contact, setContact] = useState<any>(null);
  const [socials, setSocials] = useState<any>(null);
  const c = contact ?? data?.contact ?? { phone: "", email: "", address: "", hours: "" };
  const s = socials ?? data?.socials ?? {};
  const save = async () => {
    try { await Promise.all([saveSetting("contact", c), saveSetting("socials", s)]); toast.success("Saved"); refetch(); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Contact & Footer</h1>
      <Card className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Phone</Label><Input value={c.phone ?? ""} onChange={(e) => setContact({ ...c, phone: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={c.email ?? ""} onChange={(e) => setContact({ ...c, email: e.target.value })} /></div>
          <div><Label>Address</Label><Input value={c.address ?? ""} onChange={(e) => setContact({ ...c, address: e.target.value })} /></div>
          <div><Label>Hours</Label><Input value={c.hours ?? ""} onChange={(e) => setContact({ ...c, hours: e.target.value })} /></div>
        </div>
      </Card>
      <Card className="space-y-4 p-6">
        <h2 className="font-display text-2xl">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {["facebook", "instagram", "youtube", "pinterest", "linkedin", "tiktok"].map((k) => (
            <div key={k}><Label className="capitalize">{k}</Label><Input value={s[k] ?? ""} onChange={(e) => setSocials({ ...s, [k]: e.target.value })} /></div>
          ))}
        </div>
      </Card>
      <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save</Button>
    </div>
  );
}

export function AdminWhatsApp() {
  const { data, refetch } = useSiteSettings();
  const [wa, setWa] = useState<any>(null);
  const w = wa ?? data?.whatsapp ?? { enabled: true, phone: "", message: "" };
  const save = async () => { try { await saveSetting("whatsapp", w); toast.success("Saved"); refetch(); } catch (e: any) { toast.error(e.message); } };
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="font-display text-4xl">WhatsApp Button</h1>
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Label>Show floating button</Label>
          <Switch checked={!!w.enabled} onCheckedChange={(v) => setWa({ ...w, enabled: v })} />
        </div>
        <div><Label>Phone (with country code, digits only)</Label><Input value={w.phone ?? ""} onChange={(e) => setWa({ ...w, phone: e.target.value })} placeholder="14066902263" /></div>
        <div><Label>Default message</Label><Textarea value={w.message ?? ""} onChange={(e) => setWa({ ...w, message: e.target.value })} /></div>
        <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save</Button>
      </Card>
    </div>
  );
}

export function AdminGallery() {
  const qc = useQueryClient();
  const { data: cats } = useQuery({ queryKey: ["adm_cats"], queryFn: async () => (await supabase.from("gallery_categories").select("*").order("sort_order")).data ?? [] });
  const { data: imgs } = useQuery({ queryKey: ["adm_imgs"], queryFn: async () => (await supabase.from("gallery_images").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [catId, setCatId] = useState<string>("");
  const [caption, setCaption] = useState("");

  const upload = async (files: FileList) => {
    try {
      for (const f of Array.from(files)) {
        const url = await uploadFile("gallery", f);
        await supabase.from("gallery_images").insert({ image_url: url, caption: caption || null, category_id: catId || null });
      }
      toast.success("Uploaded"); qc.invalidateQueries({ queryKey: ["adm_imgs"] });
    } catch (e: any) { toast.error(e.message); }
  };
  const del = async (id: string) => { await supabase.from("gallery_images").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["adm_imgs"] }); };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Gallery</h1>
      <Card className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Category</Label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={catId} onChange={(e) => setCatId(e.target.value)}>
              <option value="">— No category —</option>
              {cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><Label>Caption (optional, applied to all)</Label><Input value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
        </div>
        <div><Label>Upload images</Label><Input type="file" accept="image/*" multiple onChange={(e) => e.target.files && upload(e.target.files)} /></div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {imgs?.map((i) => (
          <div key={i.id} className="group relative aspect-square overflow-hidden rounded-lg bg-secondary">
            <img src={i.image_url} alt="" className="h-full w-full object-cover" />
            <button onClick={() => del(i.id)} className="absolute right-2 top-2 rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground opacity-0 transition group-hover:opacity-100">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminFloorPlans() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["adm_plans"], queryFn: async () => (await supabase.from("floor_plans").select("*").order("sort_order")).data ?? [] });
  const [editing, setEditing] = useState<any>(null);

  const empty = { slug: "", name: "", tagline: "", description: "", sqft: 0, beds: 0, baths: 0, category: "", cover_image_url: "", published: true };
  const e = editing ?? empty;

  const save = async () => {
    try {
      const payload: any = { ...e };
      if (payload.id) { await supabase.from("floor_plans").update(payload).eq("id", payload.id); }
      else { await supabase.from("floor_plans").insert(payload); }
      toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["adm_plans"] });
    } catch (err: any) { toast.error(err.message); }
  };
  const del = async (id: string) => { await supabase.from("floor_plans").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["adm_plans"] }); };
  const handleCover = async (f: File) => { const url = await uploadFile("floor-plans", f); setEditing({ ...e, cover_image_url: url }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Floor Plans</h1>
        <Button onClick={() => setEditing(empty)} className="bg-gradient-gold text-primary-foreground">New plan</Button>
      </div>
      {editing && (
        <Card className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input value={e.name} onChange={(ev) => setEditing({ ...e, name: ev.target.value })} /></div>
            <div><Label>Slug</Label><Input value={e.slug} onChange={(ev) => setEditing({ ...e, slug: ev.target.value })} /></div>
            <div><Label>Tagline</Label><Input value={e.tagline ?? ""} onChange={(ev) => setEditing({ ...e, tagline: ev.target.value })} /></div>
            <div><Label>Category</Label><Input value={e.category ?? ""} onChange={(ev) => setEditing({ ...e, category: ev.target.value })} /></div>
            <div><Label>Sqft</Label><Input type="number" value={e.sqft ?? 0} onChange={(ev) => setEditing({ ...e, sqft: +ev.target.value })} /></div>
            <div><Label>Beds</Label><Input type="number" value={e.beds ?? 0} onChange={(ev) => setEditing({ ...e, beds: +ev.target.value })} /></div>
            <div><Label>Baths</Label><Input type="number" step="0.5" value={e.baths ?? 0} onChange={(ev) => setEditing({ ...e, baths: +ev.target.value })} /></div>
            <div className="flex items-center gap-3 pt-6"><Switch checked={!!e.published} onCheckedChange={(v) => setEditing({ ...e, published: v })} /><Label>Published</Label></div>
          </div>
          <div><Label>Description</Label><Textarea rows={4} value={e.description ?? ""} onChange={(ev) => setEditing({ ...e, description: ev.target.value })} /></div>
          <div>
            <Label>Cover image</Label>
            <div className="flex items-center gap-3">
              {e.cover_image_url && <img src={e.cover_image_url} className="h-16 w-16 rounded object-cover" alt="" />}
              <Input type="file" accept="image/*" onChange={(ev) => ev.target.files?.[0] && handleCover(ev.target.files[0])} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="space-y-2">
        {data?.map((p) => (
          <Card key={p.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {p.cover_image_url && <img src={p.cover_image_url} className="h-12 w-12 rounded object-cover" alt="" />}
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">/{p.slug} · {p.sqft} sqft · {p.published ? "Published" : "Draft"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => del(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminBlog() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["adm_posts"], queryFn: async () => (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [editing, setEditing] = useState<any>(null);
  const empty = { slug: "", title: "", excerpt: "", body: "", cover_image_url: "", published: false, published_at: null };
  const e = editing ?? empty;

  const save = async () => {
    try {
      const payload: any = { ...e };
      if (payload.published && !payload.published_at) payload.published_at = new Date().toISOString();
      if (payload.id) await supabase.from("blog_posts").update(payload).eq("id", payload.id);
      else await supabase.from("blog_posts").insert(payload);
      toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["adm_posts"] });
    } catch (err: any) { toast.error(err.message); }
  };
  const del = async (id: string) => { await supabase.from("blog_posts").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["adm_posts"] }); };
  const handleCover = async (f: File) => { const url = await uploadFile("blog", f); setEditing({ ...e, cover_image_url: url }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Blog</h1>
        <Button onClick={() => setEditing(empty)} className="bg-gradient-gold text-primary-foreground">New post</Button>
      </div>
      {editing && (
        <Card className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Title</Label><Input value={e.title} onChange={(ev) => setEditing({ ...e, title: ev.target.value })} /></div>
            <div><Label>Slug</Label><Input value={e.slug} onChange={(ev) => setEditing({ ...e, slug: ev.target.value })} /></div>
          </div>
          <div><Label>Excerpt</Label><Textarea rows={2} value={e.excerpt ?? ""} onChange={(ev) => setEditing({ ...e, excerpt: ev.target.value })} /></div>
          <div><Label>Body</Label><Textarea rows={10} value={e.body ?? ""} onChange={(ev) => setEditing({ ...e, body: ev.target.value })} /></div>
          <div>
            <Label>Cover</Label>
            <div className="flex items-center gap-3">
              {e.cover_image_url && <img src={e.cover_image_url} className="h-16 w-16 rounded object-cover" alt="" />}
              <Input type="file" accept="image/*" onChange={(ev) => ev.target.files?.[0] && handleCover(ev.target.files[0])} />
            </div>
          </div>
          <div className="flex items-center gap-3"><Switch checked={!!e.published} onCheckedChange={(v) => setEditing({ ...e, published: v })} /><Label>Published</Label></div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="space-y-2">
        {data?.map((p) => (
          <Card key={p.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">/{p.slug} · {p.published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => del(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminTestimonials() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["adm_test"], queryFn: async () => (await supabase.from("testimonials").select("*").order("sort_order")).data ?? [] });
  const [e, setE] = useState<any>({ author: "", role: "", quote: "", rating: 5, featured: true });
  const add = async () => {
    try { await supabase.from("testimonials").insert(e); toast.success("Added"); setE({ author: "", role: "", quote: "", rating: 5, featured: true }); qc.invalidateQueries({ queryKey: ["adm_test"] }); }
    catch (err: any) { toast.error(err.message); }
  };
  const del = async (id: string) => { await supabase.from("testimonials").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["adm_test"] }); };
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Testimonials</h1>
      <Card className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Author</Label><Input value={e.author} onChange={(ev) => setE({ ...e, author: ev.target.value })} /></div>
          <div><Label>Role</Label><Input value={e.role} onChange={(ev) => setE({ ...e, role: ev.target.value })} /></div>
        </div>
        <div><Label>Quote</Label><Textarea value={e.quote} onChange={(ev) => setE({ ...e, quote: ev.target.value })} /></div>
        <Button onClick={add} className="bg-gradient-gold text-primary-foreground">Add</Button>
      </Card>
      <div className="space-y-2">
        {data?.map((t) => (
          <Card key={t.id} className="flex items-start justify-between p-4">
            <div><p className="font-medium">{t.author} <span className="text-xs text-muted-foreground">{t.role}</span></p><p className="mt-1 text-sm text-muted-foreground">"{t.quote}"</p></div>
            <Button size="sm" variant="destructive" onClick={() => del(t.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminFAQ() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["adm_faq"], queryFn: async () => (await supabase.from("faq_items").select("*").order("sort_order")).data ?? [] });
  const [e, setE] = useState({ question: "", answer: "" });
  const add = async () => { try { await supabase.from("faq_items").insert(e); setE({ question: "", answer: "" }); qc.invalidateQueries({ queryKey: ["adm_faq"] }); toast.success("Added"); } catch (err: any) { toast.error(err.message); } };
  const del = async (id: string) => { await supabase.from("faq_items").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["adm_faq"] }); };
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">FAQ</h1>
      <Card className="space-y-4 p-6">
        <div><Label>Question</Label><Input value={e.question} onChange={(ev) => setE({ ...e, question: ev.target.value })} /></div>
        <div><Label>Answer</Label><Textarea value={e.answer} onChange={(ev) => setE({ ...e, answer: ev.target.value })} /></div>
        <Button onClick={add} className="bg-gradient-gold text-primary-foreground">Add</Button>
      </Card>
      <div className="space-y-2">
        {data?.map((f) => (
          <Card key={f.id} className="flex items-start justify-between p-4">
            <div><p className="font-medium">{f.question}</p><p className="mt-1 text-sm text-muted-foreground">{f.answer}</p></div>
            <Button size="sm" variant="destructive" onClick={() => del(f.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminInquiries() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["adm_inq"], queryFn: async () => (await supabase.from("inquiries").select("*").order("created_at", { ascending: false })).data ?? [] });
  const upd = async (id: string, status: any) => { await supabase.from("inquiries").update({ status }).eq("id", id); qc.invalidateQueries({ queryKey: ["adm_inq"] }); toast.success("Updated"); };
  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl">Inquiries</h1>
      {data?.map((i) => (
        <Card key={i.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">{i.name}</p>
                <span className="text-xs text-muted-foreground">{i.email}{i.phone && ` · ${i.phone}`}</span>
              </div>
              <p className="mt-2 text-sm">{i.message}</p>
              {(i.project_type || i.budget || i.timeline) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {[i.project_type, i.budget, i.timeline].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <select value={i.status} onChange={(e) => upd(i.id, e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="new">New</option><option value="in_review">In Review</option><option value="quoted">Quoted</option><option value="won">Won</option><option value="lost">Lost</option>
            </select>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminAppointments() {
  const qc = useQueryClient();
  const { data: appts } = useQuery({ queryKey: ["adm_appt"], queryFn: async () => (await supabase.from("appointments").select("*").order("start_at", { ascending: false })).data ?? [] });
  const { data: slots } = useQuery({ queryKey: ["adm_slots"], queryFn: async () => (await supabase.from("availability_slots").select("*").gte("start_at", new Date().toISOString()).order("start_at")).data ?? [] });
  const [start, setStart] = useState(""); const [end, setEnd] = useState("");
  const addSlot = async () => {
    if (!start || !end) return;
    await supabase.from("availability_slots").insert({ start_at: new Date(start).toISOString(), end_at: new Date(end).toISOString() });
    setStart(""); setEnd(""); qc.invalidateQueries({ queryKey: ["adm_slots"] }); toast.success("Slot added");
  };
  const delSlot = async (id: string) => { await supabase.from("availability_slots").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["adm_slots"] }); };
  const updAppt = async (id: string, status: any) => { await supabase.from("appointments").update({ status }).eq("id", id); qc.invalidateQueries({ queryKey: ["adm_appt"] }); };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">Appointments</h1>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-2xl">Add availability slot</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div><Label>Start</Label><Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></div>
          <div><Label>End</Label><Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          <Button onClick={addSlot} className="self-end bg-gradient-gold text-primary-foreground">Add slot</Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {slots?.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm">
              <span>{new Date(s.start_at).toLocaleString()}</span>
              <button onClick={() => delSlot(s.id)} className="text-xs text-destructive">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-2xl">All appointments</h2>
        <div className="space-y-2">
          {appts?.map((a) => (
            <Card key={a.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{a.name} <span className="text-xs text-muted-foreground">{a.email}</span></p>
                <p className="text-sm text-muted-foreground">{new Date(a.start_at).toLocaleString()} · <span className="capitalize">{a.appointment_type.replace("_", " ")}</span></p>
                {a.notes && <p className="mt-1 text-xs text-muted-foreground">{a.notes}</p>}
              </div>
              <select value={a.status} onChange={(e) => updAppt(a.id, e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No-show</option>
              </select>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm_users"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("*");
      return (profiles ?? []).map((p) => ({ ...p, roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role) }));
    },
  });
  const setRole = async (uid: string, role: "admin" | "designer" | "client") => {
    await supabase.from("user_roles").delete().eq("user_id", uid);
    await supabase.from("user_roles").insert({ user_id: uid, role });
    qc.invalidateQueries({ queryKey: ["adm_users"] }); toast.success("Role updated");
  };
  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl">Users & Roles</h1>
      {data?.map((u) => (
        <Card key={u.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{u.full_name || u.email}</p>
            <p className="text-xs text-muted-foreground">{u.email} · {u.roles.join(", ") || "no role"}</p>
          </div>
          <select value={u.roles[0] ?? "client"} onChange={(e) => setRole(u.id, e.target.value as any)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="client">Client</option><option value="designer">Designer</option><option value="admin">Admin</option>
          </select>
        </Card>
      ))}
    </div>
  );
}
