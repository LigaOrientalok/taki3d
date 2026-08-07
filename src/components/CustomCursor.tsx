import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.style.cursor = "none";

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a, button"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[90] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue"
        style={{ x: springX, y: springY }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[89] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-blue/40"
        style={{ x: springX, y: springY }}
        animate={{ width: hovering ? 56 : 36, height: hovering ? 56 : 36, opacity: hovering ? 0.9 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
