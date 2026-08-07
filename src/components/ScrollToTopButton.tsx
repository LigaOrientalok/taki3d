import { motion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ScrollToTopButton() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setVisible(y > 600));
    return () => unsub();
  }, [scrollY]);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 left-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full glass text-white transition-colors hover:border-brand-blue/50 hover:text-brand-blue",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      animate={{ opacity: visible ? 1 : 0 }}
      aria-label="Volver arriba"
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
}
