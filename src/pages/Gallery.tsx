import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Gallery() {
  const [filter, setFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: cats } = useQuery({
    queryKey: ["gallery_cats"],
    queryFn: async () => (await supabase.from("gallery_categories").select("*").order("sort_order")).data ?? [],
  });
  const { data: imgs } = useQuery({
    queryKey: ["gallery_imgs", filter],
    queryFn: async () => {
      let q = supabase.from("gallery_images").select("*, gallery_categories(name, slug)").order("sort_order");
      if (filter) q = q.eq("category_id", filter);
      return (await q).data ?? [];
    },
  });

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Gallery</p>
        <h1 className="font-display text-5xl md:text-6xl">Designed to be lived in.</h1>
        <p className="mt-4 text-muted-foreground">Renderings, finished homes, and material concepts from our recent projects.</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <Button size="sm" variant={filter === null ? "default" : "outline"} onClick={() => setFilter(null)}>All</Button>
        {cats?.map((c) => (
          <Button key={c.id} size="sm" variant={filter === c.id ? "default" : "outline"} onClick={() => setFilter(c.id)}>
            {c.name}
          </Button>
        ))}
      </div>

      {imgs && imgs.length > 0 ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imgs.map((img: any) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img.image_url)}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary"
            >
              <img src={img.image_url} alt={img.title ?? ""} loading="lazy" className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 p-5 opacity-0 transition-smooth group-hover:opacity-100">
                {img.title && <p className="font-display text-lg text-white">{img.title}</p>}
                {img.caption && <p className="mt-1 text-xs text-white/80">{img.caption}</p>}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-dashed border-border p-16 text-center text-muted-foreground">
          No gallery images yet. Check back soon — or sign in as admin to upload.
        </div>
      )}

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0">
          {lightbox && <img src={lightbox} alt="" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
