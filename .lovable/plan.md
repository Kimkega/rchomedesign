
# Revision Custom Home Design — Modern Site + Admin CMS

A dark-luxury, mobile-responsive marketing site for RCHD with a rotating 3D house hero, full content management via an admin panel, role-based authentication (Admin / Designer / Client), inquiry tracking, and consultation/appointment booking with availability slots.

## Public Site

**Visual direction**
- Dark luxury aesthetic: near-black background, warm gold/bronze accents, soft glass cards, subtle grain, large editorial typography (serif display + clean sans body), generous spacing, smooth scroll-reveal animations.
- Fully mobile responsive (hamburger nav, stacked sections, touch-friendly buttons).

**Pages**
1. **Home** — rotating 3D house model hero (admin-uploaded GLB or default), tagline "First drafts in 7 days", three feature cards (Design Services / Barndominiums / Boutique Plans), "Why RCHD" trio (Build with certainty / Save money / Stress less), testimonial strip, featured gallery, CTA to book a discovery call.
2. **Barndominiums** — hero, description, gallery filtered to barndo category, CTA.
3. **Services** — design process steps, what's included, pricing tiers (admin-editable), CTA.
4. **Gallery** — filterable grid (No More Closed Kitchen, Modern Renovation, Barndominium Inspiration, Custom Home in the Mountains, Custom Floor Plans, Double Bathroom Remodel, Materials Concept Boards, Laundry Room for a Queen, etc.), lightbox view.
5. **Boutique Floor Plans** — card grid of stock plans (Bass Pond, Tempest Mountain, etc.) with sqft, beds, baths, detail page per plan.
6. **Blog** — list + post detail (admin CMS authored).
7. **Testimonials** — quote cards.
8. **FAQ** — accordion.
9. **Book Now** — calendar view of available slots → booking form.
10. **Contact** — inquiry form + contact info.
11. **Auth** — Sign in / Sign up (Email + Google).
12. **Client Dashboard** — "My Inquiries" with status timeline, "My Appointments" with reschedule/cancel.

**Global**
- Sticky top nav with logo (admin-uploaded), site name, menu, "Sign in" / avatar.
- Floating WhatsApp button (number set by admin) — bottom-right, pulsing.
- Footer with admin-edited contact info, address, hours, social links, newsletter.

## 3D Hero

- `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` + `three`.
- Default: a stylized low-poly modern house (built procedurally so no asset needed) slowly auto-rotating with soft environment lighting and subtle camera float.
- Admin can upload a `.glb` model in the dashboard to replace the default; falls back gracefully on mobile (reduced quality / static image option).

## Authentication & Roles

- Lovable Cloud auth: Email/password + Google sign-in.
- Roles in a separate `user_roles` table with enum `app_role` (`admin`, `designer`, `client`) and `has_role()` security-definer function (no recursive RLS).
- First user to sign up auto-promoted to admin (seed); admin can promote others.
- Route guards: `/admin/*` requires admin, `/designer/*` requires designer or admin, `/dashboard` requires any signed-in user.

## Inquiries

- Public contact form (validated with zod) creates an inquiry → status `new`.
- Client dashboard: list of their inquiries with timeline (new → in review → quoted → won/lost), comments thread with assigned designer.
- Admin/Designer dashboard: kanban or table of all inquiries, assign designer, change status, add internal notes, respond (logged to thread).

## Appointments / Booking

- Admin defines **availability slots** (recurring weekly schedule + one-off slots/blackouts).
- Public booking page shows next 4 weeks of open slots on a calendar; client picks slot → fills purpose (Discovery Call / Consultation / Walkthrough), confirms.
- Slot is locked instantly; confirmation email-style toast + entry on client dashboard.
- Admin/Designer dashboard: today/upcoming appointments, calendar view, mark complete / no-show / cancel, reassign.

## Admin Panel (`/admin`)

Sidebar-driven dashboard with these sections:

- **Overview** — KPI cards (new inquiries, upcoming appointments, total clients, gallery items), recent activity feed.
- **Site Settings** — site name, logo upload, favicon, tagline, primary color accent, hero 3D model upload (or pick built-in), hero headline/subhead.
- **Pages Content** — edit homepage sections (headline, subhead, feature cards), Services copy, FAQ entries, About text.
- **Gallery** — upload images (drag/drop, multi-file), assign category, caption, reorder, delete.
- **Boutique Floor Plans** — CRUD plans (name, sqft, beds, baths, price, description, images, downloadable PDF).
- **Blog** — CRUD posts with cover image, rich text body, tags, publish toggle.
- **Testimonials** — CRUD quotes with author, role, photo.
- **Inquiries** — table + detail view, assign, status, internal notes.
- **Appointments** — calendar + list, manage availability, view bookings.
- **Users & Roles** — list users, assign role (admin/designer/client).
- **Contact & Footer** — phone, email, address, hours, social URLs, footer columns.
- **WhatsApp** — phone number for floating button + on/off toggle + default message.

Designer role sees a trimmed dashboard: assigned Inquiries + Appointments only.

## Technical Notes

- Stack: React + Vite + Tailwind + shadcn/ui + React Router + TanStack Query, Lovable Cloud (Supabase) for DB/auth/storage, Three.js via react-three-fiber for hero.
- Database tables: `profiles`, `user_roles`, `site_settings` (key-value), `pages_content`, `gallery_images`, `gallery_categories`, `floor_plans`, `blog_posts`, `testimonials`, `faq_items`, `inquiries`, `inquiry_messages`, `availability_slots`, `appointments`, `contact_info`. RLS on every table; public read for published content, admin/designer write per role, clients read own rows.
- Storage buckets: `site-assets` (logo, hero model — public), `gallery` (public), `floor-plans` (public + PDFs), `blog` (public), `avatars` (public).
- Form validation with zod + react-hook-form on every form.
- WhatsApp button uses validated phone, opens `https://wa.me/<number>?text=...`.
- Image optimization via responsive `srcset`; lazy-load below the fold; reduce 3D quality on mobile.
- SEO meta per page, Open Graph tags pulled from site settings.

## Build Order

1. Design system (dark luxury tokens, fonts, Tailwind theme), layout shell, nav, footer, WhatsApp button.
2. Lovable Cloud setup: auth, roles, all tables + RLS + storage buckets.
3. Public marketing pages with seed content + 3D hero.
4. Admin panel: site settings, gallery, floor plans, blog, testimonials, FAQ, contact/footer, WhatsApp.
5. Inquiries flow (public form → client dashboard → admin/designer management).
6. Appointments: availability management + public booking calendar + dashboards.
7. Users & Roles management, polish, mobile QA.

```text
Public Site ──► Inquiry/Booking ──► Lovable Cloud DB
       ▲                                  │
       └── Site Settings/Content ◄── Admin Panel (Admin/Designer)
                                          │
                              Client Dashboard ◄─ Client role
```
