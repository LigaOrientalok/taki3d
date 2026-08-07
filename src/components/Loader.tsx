import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          aria-hidden="true"
        >
          <motion.svg
            viewBox="-28 -30 56 60"
            className="h-16 w-16"
            initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <path d="M 0,-28 L 24,-14 L 0,0 L -24,-14 Z" fill="#7cc4ff" />
            <path d="M 24,-14 L 0,0 L 0,28 L 24,14 Z" fill="#28A9FF" />
            <path d="M -24,-14 L 0,0 L 0,28 L -24,14 Z" fill="#0f6cb3" />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
