import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts } = useQuery({
    queryKey: ["blog_posts_public"],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .or(`scheduled_publish_at.is.null,scheduled_publish_at.lte.${nowIso}`)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Journal</p>
        <h1 className="font-display text-5xl md:text-6xl">Notes from the studio.</h1>
      </div>
      {!posts?.length ? (
        <div className="mt-16 rounded-lg border border-dashed border-border p-16 text-center text-muted-foreground">
          No posts published yet.
        </div>
      ) : (
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link to={`/blog/${p.slug}`} key={p.id}>
              <Card className="group h-full overflow-hidden transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant">
                {p.cover_image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={p.cover_image_url} alt={p.title} className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  {p.published_at && <p className="text-xs text-muted-foreground">{format(new Date(p.published_at), "MMMM d, yyyy")}</p>}
                  <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
