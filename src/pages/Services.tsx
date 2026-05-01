import { Link } from "react-router-dom";
import { Building2, Hammer, PencilRuler, Layers, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Services() {
  const services = [
    { icon: PencilRuler, title: "Custom Floor Plans", desc: "Fully tailored builder-ready plans for your lot and lifestyle." },
    { icon: Building2, title: "Barndominium Design", desc: "High-drama, high-detail architectural theater for country builds." },
    { icon: Hammer, title: "Remodels & Additions", desc: "See it before you commit. Avoid costly mid-build surprises." },
    { icon: Layers, title: "Materials Concepts", desc: "Cohesive material boards rendered together — no more guesswork." },
    { icon: Sparkles, title: "3D Renderings", desc: "Photo-realistic interiors, exteriors, and dollhouse views." },
    { icon: PencilRuler, title: "Boutique Stock Plans", desc: "Pre-designed, customizable plans for faster turnaround." },
  ];

  const steps = [
    { n: "01", t: "Discovery", d: "We learn about you, your land, your wishlist." },
    { n: "02", t: "Concept", d: "Sketches and first drafts within 7 days." },
    { n: "03", t: "Refinement", d: "Renderings, revisions, finishes, materials." },
    { n: "04", t: "Hand-off", d: "Builder-ready plan package with everything they need." },
  ];

  return (
    <div>
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Services</p>
          <h1 className="font-display text-5xl md:text-6xl">Designed for the way you actually live.</h1>
          <p className="mt-4 text-muted-foreground">
            From the first sketch to the final material selection — we walk with you every step.
          </p>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="glass p-7 transition-smooth hover:border-primary/40">
              <Icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-display text-2xl">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card/30 py-20">
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Process</p>
            <h2 className="font-display text-4xl md:text-5xl">Clarity from concept to keys.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-lg border border-border/60 bg-card p-6">
                <span className="font-display text-5xl text-gradient-gold">{s.n}</span>
                <h3 className="mt-3 font-display text-xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl md:text-5xl">Ready to start? <span className="text-gradient-gold">Let's plan.</span></h2>
        <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground hover:opacity-90">
          <Link to="/book">Book Discovery Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>
    </div>
  );
}
