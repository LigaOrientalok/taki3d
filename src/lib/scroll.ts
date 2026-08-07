import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

const NAV_OFFSET = -76;

export function scrollToId(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: NAV_OFFSET, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
  return true;
}

export function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  if (!id) return;
  let attempts = 0;
  const tryScroll = () => {
    if (scrollToId(id)) return;
    attempts++;
    if (attempts < 120) requestAnimationFrame(tryScroll);
  };
  tryScroll();
}
