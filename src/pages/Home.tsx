import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wallet, Shield, Compass, Building2, Home as HomeIcon } from "lucide-react";
import Hero3D from "@/components/Hero3D";
import { useSetting } from "@/hooks/useSiteSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const hero = useSetting<{ headline: string; subheadline: string; description: string; model_url: string | null }>("hero", {
    headline: "Creating Spaces that Inspire",
    subheadline: "Your Lifestyle, Our Design",
    description: "Every season of life deserves a home that fits.",
    model_url: null,
  });
  const branding = useSetting<{ tagline: string }>("branding", { tagline: "First drafts in 7 days" });

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials_featured"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").eq("featured", true).order("sort_order").limit(3);
      return data ?? [];
    },
  });

  const { data: gallery } = useQuery({
    queryKey: ["gallery_home"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-dark grain">
        <div className="absolute inset-0 bg-radial-gold opacity-80" />
        <div className="container relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {branding?.tagline}
            </div>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              {hero?.headline}
              <span className="block text-gradient-gold">{hero?.subheadline}</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">{hero?.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                <Link to="/book">Book Free Discovery Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[560px]"
          >
            <Hero3D modelUrl={hero?.model_url ?? null} className="h-full w-full" />
          </motion.div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">Why RCHD</p>
          <h2 className="font-display text-4xl md:text-5xl">Designing Homes Made Simple</h2>
          <p className="mt-4 text-muted-foreground">
            From new builds to remodels, we design stylish, functional homes that truly reflect you and your lifestyle.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Shield, title: "Build with certainty", body: "Photo-realistic 3D renderings show exactly what your home will look like — inside and out." },
            { icon: Wallet, title: "Save money", body: "Builder-ready plans give your contractor everything they need for accurate bids." },
            { icon: Compass, title: "Stress less", body: "We get to know you, your wishlist, your inspiration — then shape it into a buildable plan." },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="glass group p-8 transition-smooth hover:border-primary/40 hover:shadow-elegant">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-gold text-primary-foreground transition-smooth group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-2xl">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* SERVICES PROMO */}
      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { to: "/services", title: "Design Services", desc: "Custom plans for new builds, remodels & additions.", icon: HomeIcon },
            { to: "/barndominiums", title: "Barndominiums", desc: "Architectural theater meets country lifestyle.", icon: Building2 },
            { to: "/boutique", title: "Boutique Floor Plans", desc: "Stock plans you can customize. Faster turnaround.", icon: Sparkles },
          ].map(({ to, title, desc, icon: Icon }) => (
            <Link key={to} to={to} className="group">
              <Card className="relative h-full overflow-hidden border-border/60 p-8 transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-2xl">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
                <div className="mt-6 flex items-center text-sm text-primary">
                  Discover <ArrowRight className="ml-1 h-4 w-4 transition-smooth group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* GALLERY STRIP */}
      {gallery && gallery.length > 0 && (
        <section className="container pb-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Selected Work</p>
              <h2 className="font-display text-4xl md:text-5xl">Real life, just as imagined.</h2>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/gallery">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g) => (
              <div key={g.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                <img src={g.image_url} alt={g.title ?? ""} className="h-full w-full object-cover transition-smooth group-hover:scale-105" loading="lazy" />
                {g.caption && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 p-5 opacity-0 transition-smooth group-hover:opacity-100">
                    <p className="text-sm text-white">{g.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-card/30 py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Testimonials</p>
              <h2 className="font-display text-4xl md:text-5xl">The best compliment we receive.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.id} className="glass p-7">
                  <p className="mb-5 font-display text-xl leading-snug">"{t.quote}"</p>
                  <div>
                    <p className="font-medium">{t.author}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container py-24">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-dark p-12 text-center md:p-20">
          <div className="absolute inset-0 bg-radial-gold" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-6xl">
              Your dream home should start with a plan you <span className="text-gradient-gold">love</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Confidence isn't accidental. It's designed.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground hover:opacity-90">
              <Link to="/book">Book Your Free Discovery Call</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
