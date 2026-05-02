import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const { data } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("faq_items")
        .select("*")
        .eq("published", true)
        .or(`scheduled_publish_at.is.null,scheduled_publish_at.lte.${nowIso}`)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      <div className="text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">FAQ</p>
        <h1 className="font-display text-5xl md:text-6xl">Good questions.</h1>
      </div>
      <Accordion type="single" collapsible className="mt-12 space-y-3">
        {data?.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="rounded-lg border border-border/60 bg-card px-5">
            <AccordionTrigger className="text-left font-display text-xl">{f.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
