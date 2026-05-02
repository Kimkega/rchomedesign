import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Bed, Bath, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Boutique() {
  const { data: plans } = useQuery({
    queryKey: ["floor_plans_public"],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("published", true)
        .or(`scheduled_publish_at.is.null,scheduled_publish_at.lte.${nowIso}`)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Boutique Floor Plans</p>
        <h1 className="font-display text-5xl md:text-6xl">Stock plans. Custom feel.</h1>
        <p className="mt-4 text-muted-foreground">
          Builder-ready plans you can use as-is or customize to match your lot, lifestyle, and finishes.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((p) => (
          <Link to={`/boutique/${p.slug}`} key={p.id} className="group">
            <Card className="h-full overflow-hidden border-border/60 transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.name} className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl font-display text-muted-foreground/30">
                    {p.name.charAt(0)}
                  </div>
                )}
                {p.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur">
                    {p.category}
                  </span>
                )}
              </div>
              <div className="space-y-3 p-6">
                <div>
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  {p.tagline && <p className="text-sm text-muted-foreground">{p.tagline}</p>}
                </div>
                <div className="flex gap-4 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                  {p.sqft && <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" />{p.sqft} sqft</span>}
                  {p.beds != null && <span className="flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" />{p.beds}</span>}
                  {p.baths != null && <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" />{p.baths}</span>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
          <Link to="/contact">Need something custom? Let's talk.</Link>
        </Button>
      </div>
    </div>
  );
}
