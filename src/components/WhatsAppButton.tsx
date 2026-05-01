import { useSetting } from "@/hooks/useSiteSettings";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const wa = useSetting<{ enabled: boolean; phone: string; message: string }>("whatsapp", {
    enabled: false,
    phone: "",
    message: "",
  });

  if (!wa?.enabled || !wa.phone) return null;

  const phone = wa.phone.replace(/\D/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(wa.message || "")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] text-white shadow-2xl whatsapp-pulse transition-smooth hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
