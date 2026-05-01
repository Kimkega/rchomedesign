import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import PublicLayout from "@/components/PublicLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Barndominiums from "./pages/Barndominiums";
import Gallery from "./pages/Gallery";
import Boutique from "./pages/Boutique";
import FloorPlanDetail from "./pages/FloorPlanDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import {
  AdminSiteSettings, AdminContactFooter, AdminWhatsApp, AdminGallery,
  AdminFloorPlans, AdminBlog, AdminTestimonials, AdminFAQ,
  AdminInquiries, AdminAppointments, AdminUsers,
} from "./pages/admin/AdminPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/barndominiums" element={<Barndominiums />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/boutique/:slug" element={<FloorPlanDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="settings" element={<AdminSiteSettings />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="floor-plans" element={<AdminFloorPlans />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="faq" element={<AdminFAQ />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="contact" element={<AdminContactFooter />} />
            <Route path="whatsapp" element={<AdminWhatsApp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
