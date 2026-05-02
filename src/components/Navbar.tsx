import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "Home" },
  { to: "/barndominiums", label: "Barndominiums" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/boutique", label: "Boutique Plans" },
  { to: "/blog", label: "Blog" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isStaff, signOut } = useAuth();
  const branding = useSetting<{ site_name: string; logo_url: string | null }>("branding", { site_name: "RC Home Design", logo_url: null });
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {branding?.logo_url ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-card sm:h-10 sm:w-10">
              <img src={branding.logo_url} alt={branding.site_name} className="h-full w-full object-contain p-0.5" />
            </span>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-gold font-display text-lg text-primary-foreground sm:h-10 sm:w-10">
              R
            </div>
          )}
          <span className="truncate font-display text-base tracking-wide sm:text-lg md:text-xl">{branding?.site_name ?? "RC Home Design"}</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition-smooth hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="default" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
            <Link to="/book">Book Discovery Call</Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Account">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                </DropdownMenuItem>
                {isStaff && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="mr-2 h-4 w-4" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut().then(() => navigate("/"))}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/40 bg-background/95 lg:hidden">
          <ul className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm transition-smooth ${isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary"}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Button asChild className="w-full bg-gradient-gold text-primary-foreground" onClick={() => setOpen(false)}>
                <Link to="/book">Book Discovery Call</Link>
              </Button>
            </li>
            {user ? (
              <>
                <li>
                  <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                    <Link to="/dashboard">My Dashboard</Link>
                  </Button>
                </li>
                {isStaff && (
                  <li>
                    <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                      <Link to="/admin">Admin</Link>
                    </Button>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Button asChild variant="ghost" className="w-full" onClick={() => setOpen(false)}>
                  <Link to="/auth">Sign in</Link>
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
