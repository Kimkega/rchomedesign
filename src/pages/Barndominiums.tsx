import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Barndominiums() {
  const { data: imgs } = useQuery({
    queryKey: ["barndo_imgs"],
    queryFn: async () => {
      const cat = (await supabase.from("gallery_categories").select("id").eq("slug", "barndominium-inspiration").maybeSingle()).data;
      if (!cat) return [];
      return (await supabase.from("gallery_images").select("*").eq("category_id", cat.id)).data ?? [];
    },
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-dark grain py-20">
        <div className="absolute inset-0 bg-radial-gold opacity-60" />
        <div className="container relative text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Barndominiums</p>
          <h1 className="mx-auto max-w-3xl font-display text-5xl md:text-7xl">High Drama. <span className="text-gradient-gold">Higher Detail.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Timber-frame barndominiums aren't just big — they're architectural theater. That's the power of custom.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground hover:opacity-90">
            <Link to="/book">Start your barndo design</Link>
          </Button>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="glass p-8">
            <h3 className="mb-3 font-display text-3xl">Built for the way you live.</h3>
            <p className="text-muted-foreground">
              Open-concept great rooms, mudrooms that actually work, kitchens as the social anchor, and seamless access to the outdoors. Every barndominium we design is rooted in how you'll actually use the space.
            </p>
          </Card>
          <Card className="glass p-8">
            <h3 className="mb-3 font-display text-3xl">No surprises in the field.</h3>
            <p className="text-muted-foreground">
              Render first. Build second. Sunlight, scale, materials — all dialed in before framing. Confidence isn't accidental. It's designed.
            </p>
          </Card>
        </div>
      </section>

      {imgs && imgs.length > 0 && (
        <section className="container pb-20">
          <h2 className="mb-8 font-display text-4xl">Inspiration</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imgs.map((g) => (
              <div key={g.id} className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src={g.image_url} alt={g.title ?? ""} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
