import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const { data } = useQuery({
    queryKey: ["all_testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("sort_order")).data ?? [],
  });

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Testimonials</p>
        <h1 className="font-display text-5xl md:text-6xl">In their words.</h1>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((t) => (
          <Card key={t.id} className="glass p-7">
            <div className="mb-3 flex gap-0.5 text-primary">
              {Array.from({ length: t.rating ?? 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mb-5 font-display text-xl leading-snug">"{t.quote}"</p>
            <p className="font-medium">{t.author}</p>
            {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
