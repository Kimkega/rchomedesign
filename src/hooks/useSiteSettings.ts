import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SettingsKey = "branding" | "hero" | "whatsapp" | "contact" | "socials" | "about";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const map: Record<string, any> = {};
      data.forEach((row) => (map[row.key] = row.value));
      return map as Record<SettingsKey, any>;
    },
  });
}

export function useSetting<T = any>(key: SettingsKey, fallback?: T) {
  const { data } = useSiteSettings();
  return (data?.[key] as T) ?? (fallback as T);
}
