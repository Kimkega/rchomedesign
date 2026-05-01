import { Link } from "react-router-dom";
import { useSetting } from "@/hooks/useSiteSettings";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  const branding = useSetting<{ site_name: string }>("branding", { site_name: "RC Home Design" });
  const contact = useSetting<{ phone: string; email: string; address: string; hours: string }>("contact", {
    phone: "", email: "", address: "", hours: "",
  });
  const socials = useSetting<Record<string, string>>("socials", {});

  return (
    <footer className="relative mt-24 border-t border-border/40 bg-card/30">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-gold font-display text-lg text-primary-foreground">R</div>
            <span className="font-display text-2xl">{branding?.site_name}</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Custom architectural home design. Builder-ready plans, photo-realistic renderings, and a process that turns your vision into a home you'll love.
          </p>
          <div className="flex gap-3">
            {socials?.facebook && <a href={socials.facebook} aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>}
            {socials?.instagram && <a href={socials.instagram} aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>}
            {socials?.youtube && <a href={socials.youtube} aria-label="YouTube" className="text-muted-foreground hover:text-primary"><Youtube className="h-5 w-5" /></a>}
            {socials?.linkedin && <a href={socials.linkedin} aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/boutique" className="hover:text-primary">Boutique Plans</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {contact?.phone && <li>{contact.phone}</li>}
            {contact?.email && <li><a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a></li>}
            {contact?.address && <li>{contact.address}</li>}
            {contact?.hours && <li>{contact.hours}</li>}
            <li className="pt-2"><Link to="/contact" className="text-primary hover:underline">Send a message →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {branding?.site_name}. All rights reserved.</span>
          <span>Crafted with intention.</span>
        </div>
      </div>
    </footer>
  );
}
