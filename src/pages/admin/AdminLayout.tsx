import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Settings, Image, Layers, Newspaper, Quote, HelpCircle,
  Inbox, Calendar, Users, MessageSquare, Home as HomeIcon, LogOut, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings, adminOnly: true },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/floor-plans", label: "Floor Plans", icon: Layers },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar },
  { to: "/admin/users", label: "Users & Roles", icon: Users, adminOnly: true },
  { to: "/admin/contact", label: "Contact / Footer", icon: Phone, adminOnly: true },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageSquare, adminOnly: true },
];

export default function AdminLayout() {
  const { user, isStaff, isAdmin, loading, signOut } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Loading admin…</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth?redirect=/admin" replace />;
  if (!isStaff) return <Navigate to="/dashboard" replace />;

  const visible = items.filter((i) => !i.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="border-b border-sidebar-border p-5">
          <Link to="/" className="flex items-center gap-2 font-display text-xl text-gradient-gold">
            RCHD Admin
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {visible.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-smooth ${
                    isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`
                }
              >
                <Icon className="h-4 w-4" /> {it.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-sidebar-border p-3">
          <Button asChild variant="ghost" className="w-full justify-start"><Link to="/"><HomeIcon className="mr-2 h-4 w-4" /> View site</Link></Button>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4">
          <Link to="/admin" className="font-display text-lg text-gradient-gold">RCHD Admin</Link>
          <Button asChild size="sm" variant="ghost"><Link to="/">View site</Link></Button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-border p-2">
          {visible.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"}`
            }>{it.label}</NavLink>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-x-hidden p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
