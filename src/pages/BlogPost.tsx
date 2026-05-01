import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => (await supabase.from("blog_posts").select("*").eq("slug", slug!).eq("published", true).maybeSingle()).data,
    enabled: !!slug,
  });

  if (isLoading) return <div className="container py-24 text-center text-muted-foreground">Loading…</div>;
  if (!post) return <div className="container py-24 text-center">Post not found.</div>;

  return (
    <article className="container max-w-3xl py-16">
      <Link to="/blog" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> All posts
      </Link>
      {post.published_at && <p className="text-xs uppercase tracking-[0.2em] text-primary">{format(new Date(post.published_at), "MMMM d, yyyy")}</p>}
      <h1 className="mt-3 font-display text-5xl leading-tight">{post.title}</h1>
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="my-10 aspect-video w-full rounded-lg object-cover" />
      )}
      <div className="prose prose-invert prose-lg max-w-none whitespace-pre-line text-foreground">
        {post.body}
      </div>
    </article>
  );
}
