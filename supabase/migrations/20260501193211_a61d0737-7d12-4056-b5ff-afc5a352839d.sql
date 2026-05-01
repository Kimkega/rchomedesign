
-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'designer', 'client');
CREATE TYPE public.inquiry_status AS ENUM ('new', 'in_review', 'quoted', 'won', 'lost');
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.appointment_type AS ENUM ('discovery_call', 'consultation', 'walkthrough');

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER ROLES
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_designer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'designer')
  );
$$;

-- Auto-create profile + assign role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SITE SETTINGS (key-value)
-- =====================================================
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO public.site_settings (key, value) VALUES
  ('branding', '{"site_name":"RC Home Design","tagline":"First drafts in 7 days","logo_url":null,"favicon_url":null}'::jsonb),
  ('hero', '{"headline":"Creating Spaces that Inspire","subheadline":"Your Lifestyle, Our Design","description":"Every season of life deserves a home that fits. We create custom floor plans for new builds, remodels, and additions—so your home is always ready for the way you live today (and tomorrow).","model_url":null,"mode":"3d"}'::jsonb),
  ('whatsapp', '{"enabled":true,"phone":"14066902263","message":"Hi! I''d like to learn more about your design services."}'::jsonb),
  ('contact', '{"phone":"(406) 690-2263","email":"Rebecca@RCHomeDesign.com","address":"Billings, MT","hours":"Mon-Fri 9am-5pm"}'::jsonb),
  ('socials', '{"facebook":"","instagram":"","youtube":"","pinterest":"","linkedin":"","tiktok":""}'::jsonb),
  ('about', '{"text":"A cutting-edge Interior Design agency, Revision Custom Home Design has designed interiors, homes, and custom home plans for clients across the United States. Rebecca Langman, Owner and Head Designer, attended the Harrington Institute of Interior Design and has 20 years of design experience."}'::jsonb);

-- =====================================================
-- GALLERY
-- =====================================================
CREATE TABLE public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

INSERT INTO public.gallery_categories (name, slug, sort_order) VALUES
  ('No More Closed Kitchen','no-more-closed-kitchen',1),
  ('Modern Renovation','modern-renovation',2),
  ('Barndominium Inspiration','barndominium-inspiration',3),
  ('Custom Home in the Mountains','custom-home-in-the-mountains',4),
  ('Custom Floor Plans','custom-floor-plans',5),
  ('Double Bathroom Remodel','double-bathroom-remodel',6),
  ('Materials Concept Boards','materials-concept-boards',7),
  ('Laundry Room for a Queen','laundry-room-for-a-queen',8);

CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  title TEXT,
  caption TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FLOOR PLANS (Boutique)
-- =====================================================
CREATE TABLE public.floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  sqft INT,
  beds INT,
  baths NUMERIC(3,1),
  price NUMERIC(10,2),
  cover_image_url TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  pdf_url TEXT,
  category TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BLOG
-- =====================================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TESTIMONIALS
-- =====================================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  photo_url TEXT,
  rating INT DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FAQ
-- =====================================================
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- INQUIRIES
-- =====================================================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.inquiry_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiry_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- AVAILABILITY + APPOINTMENTS
-- =====================================================
CREATE TABLE public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES public.availability_slots(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  appointment_type appointment_type NOT NULL DEFAULT 'discovery_call',
  notes TEXT,
  status appointment_status NOT NULL DEFAULT 'confirmed',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_floor_plans_updated BEFORE UPDATE ON public.floor_plans FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_inquiries_updated BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- profiles
CREATE POLICY "Profiles viewable by self or staff" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings
CREATE POLICY "Public reads settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins write settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery
CREATE POLICY "Public reads gallery cats" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery cats" ON public.gallery_categories FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

CREATE POLICY "Public reads gallery imgs" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery imgs" ON public.gallery_images FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- floor plans
CREATE POLICY "Public reads published plans" ON public.floor_plans FOR SELECT
  USING (published = true OR public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Admins manage plans" ON public.floor_plans FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- blog
CREATE POLICY "Public reads published posts" ON public.blog_posts FOR SELECT
  USING (published = true OR public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Admins manage posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- testimonials
CREATE POLICY "Public reads testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- faq
CREATE POLICY "Public reads faq" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "Admins manage faq" ON public.faq_items FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- inquiries
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners or staff view inquiries" ON public.inquiries FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Staff update inquiries" ON public.inquiries FOR UPDATE TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Admins delete inquiries" ON public.inquiries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- inquiry messages
CREATE POLICY "View own inquiry msgs" ON public.inquiry_messages FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.inquiries i WHERE i.id = inquiry_id AND (i.user_id = auth.uid() OR public.is_admin_or_designer(auth.uid())))
    AND (NOT internal OR public.is_admin_or_designer(auth.uid()))
  );
CREATE POLICY "Insert inquiry msgs" ON public.inquiry_messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.inquiries i WHERE i.id = inquiry_id AND (i.user_id = auth.uid() OR public.is_admin_or_designer(auth.uid())))
  );

-- availability slots
CREATE POLICY "Public reads slots" ON public.availability_slots FOR SELECT USING (true);
CREATE POLICY "Admins manage slots" ON public.availability_slots FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- appointments
CREATE POLICY "Anyone can book appointment" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners or staff view appointments" ON public.appointments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Owners can cancel own appointments" ON public.appointments FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff manage appointments" ON public.appointments FOR ALL TO authenticated
  USING (public.is_admin_or_designer(auth.uid())) WITH CHECK (public.is_admin_or_designer(auth.uid()));

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('site-assets','site-assets', true),
  ('gallery','gallery', true),
  ('floor-plans','floor-plans', true),
  ('blog','blog', true),
  ('avatars','avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for all these buckets
CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read floor-plans" ON storage.objects FOR SELECT USING (bucket_id = 'floor-plans');
CREATE POLICY "Public read blog" ON storage.objects FOR SELECT USING (bucket_id = 'blog');
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Staff write to content buckets
CREATE POLICY "Staff write site-assets" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin_or_designer(auth.uid()))
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Staff write gallery" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin_or_designer(auth.uid()))
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Staff write floor-plans" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'floor-plans' AND public.is_admin_or_designer(auth.uid()))
  WITH CHECK (bucket_id = 'floor-plans' AND public.is_admin_or_designer(auth.uid()));
CREATE POLICY "Staff write blog" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'blog' AND public.is_admin_or_designer(auth.uid()))
  WITH CHECK (bucket_id = 'blog' AND public.is_admin_or_designer(auth.uid()));

-- Users manage own avatar
CREATE POLICY "Users write own avatar" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- SEED CONTENT
-- =====================================================
INSERT INTO public.testimonials (author, role, quote, featured, sort_order) VALUES
  ('Jen & Mark T.', 'Custom Home Client', 'RCHD took our scattered Pinterest ideas and turned them into a builder-ready plan we love. The 3D renderings made every decision feel safe.', true, 1),
  ('Sarah L.', 'Barndominium Owner', 'We saved thousands by catching design issues before construction. Best money we''ve spent on the build.', true, 2),
  ('Daniel R.', 'Boutique Plan Buyer', 'Bass Pond was exactly what we needed for the in-laws. Builder loved how complete the plans were.', true, 3);

INSERT INTO public.faq_items (question, answer, sort_order) VALUES
  ('How long does a custom design take?', 'First drafts are delivered within 7 days. Full plan packages typically take 4–8 weeks depending on revisions.', 1),
  ('Do you work with our builder?', 'Absolutely. Our plans are builder-ready and we coordinate directly with your builder for accurate bids.', 2),
  ('Can I customize a Boutique plan?', 'Yes — every Boutique plan can be tailored to your lot, lifestyle, and finishes.', 3),
  ('Do you do remodels?', 'Yes — remodels, additions, and new builds. We''ll help you visualize before you commit.', 4);

INSERT INTO public.floor_plans (slug, name, tagline, description, sqft, beds, baths, category, sort_order) VALUES
  ('bass-pond','Bass Pond','ADU / Granny Pod','A smart, flexible solution for multigenerational living or private guest quarters. Under 700 sqft with full bath and kitchenette.', 680, 1, 1.0, 'ADU', 1),
  ('tempest-mountain','Tempest Mountain','Shop-house with studio loft','30x40 shop-house shell with a 15x20 studio apartment and sleeping loft. Live on-site while you build your dream home.', 1200, 1, 1.0, 'Shop-house', 2),
  ('cedar-ridge','Cedar Ridge','Modern Mountain Retreat','3-bed retreat with vaulted great room, wraparound deck, and panoramic window walls.', 2450, 3, 2.5, 'Custom Home', 3),
  ('willow-creek','Willow Creek','Family Farmhouse','Open-concept farmhouse with mudroom, walk-in pantry, and bonus suite over the garage.', 2980, 4, 3.0, 'Custom Home', 4);
