import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { WHATSAPP_URL } from "@/lib/utils";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-6 bottom-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-brand-black shadow-lg shadow-brand-green/30"
    >
      <FaWhatsapp className="h-7 w-7" />
    </motion.a>
  );
}
