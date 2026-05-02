import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "admin" | "designer" | "client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const fetchRoles = async (uid: string) => {
    setRolesLoading(true);
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    if (error) console.error("[useAuth] fetchRoles error:", error);
    setRoles((data?.map((r) => r.role) ?? []) as AppRole[]);
    setRolesLoading(false);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => fetchRoles(s.user.id), 0);
      } else {
        setRoles([]);
        setRolesLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchRoles(data.session.user.id);
      } else {
        setRolesLoading(false);
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin");
  const isDesigner = roles.includes("designer");
  const isStaff = isAdmin || isDesigner;

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, roles, isAdmin, isDesigner, isStaff, loading: loading || rolesLoading, signOut };
}
