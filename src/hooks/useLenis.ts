import { useEffect } from "react";
import Lenis from "lenis";
import { scrollToId, setLenis } from "@/lib/scroll";

export function useLenis() {
  useEffect(() => {
    const mobile = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mobile || reduced) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      smoothWheel: true,
    });
    setLenis(lenis);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      if (!document.getElementById(id.slice(1))) return;
      e.preventDefault();
      scrollToId(id.slice(1));
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
