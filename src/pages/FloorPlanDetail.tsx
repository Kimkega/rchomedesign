import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bed, Bath, Maximize2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloorPlanDetail() {
  const { slug } = useParams();
  const { data: plan, isLoading } = useQuery({
    queryKey: ["floor_plan", slug],
    queryFn: async () => (await supabase.from("floor_plans").select("*").eq("slug", slug!).maybeSingle()).data,
    enabled: !!slug,
  });

  if (isLoading) return <div className="container py-24 text-center text-muted-foreground">Loading…</div>;
  if (!plan) return <div className="container py-24 text-center">Plan not found.</div>;

  const images: string[] = Array.isArray(plan.images) ? (plan.images as unknown[]).filter((x): x is string => typeof x === "string") : [];

  return (
    <div className="container py-16">
      <Link to="/boutique" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Boutique Plans
      </Link>
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
            {plan.cover_image_url ? (
              <img src={plan.cover_image_url} alt={plan.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-8xl font-display text-muted-foreground/30">
                {plan.name.charAt(0)}
              </div>
            )}
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((url, i) => (
                <img key={i} src={url} alt="" className="aspect-square w-full rounded object-cover" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {plan.category && <p className="text-xs uppercase tracking-[0.2em] text-primary">{plan.category}</p>}
          <h1 className="font-display text-5xl">{plan.name}</h1>
          {plan.tagline && <p className="text-lg text-muted-foreground">{plan.tagline}</p>}

          <div className="flex gap-6 border-y border-border/60 py-5">
            {plan.sqft && <span className="flex items-center gap-2"><Maximize2 className="h-4 w-4 text-primary" />{plan.sqft} sqft</span>}
            {plan.beds != null && <span className="flex items-center gap-2"><Bed className="h-4 w-4 text-primary" />{plan.beds} bed</span>}
            {plan.baths != null && <span className="flex items-center gap-2"><Bath className="h-4 w-4 text-primary" />{plan.baths} bath</span>}
          </div>

          {plan.description && <p className="leading-relaxed text-muted-foreground">{plan.description}</p>}

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
              <Link to={`/contact?plan=${plan.slug}`}>Inquire about this plan</Link>
            </Button>
            {plan.pdf_url && (
              <Button asChild variant="outline" size="lg">
                <a href={plan.pdf_url} target="_blank" rel="noopener noreferrer">Download PDF</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
