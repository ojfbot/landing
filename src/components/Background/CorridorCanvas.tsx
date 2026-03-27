import { useEffect, useRef } from "react";

const bgStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  pointerEvents: "none",
  transition: "background 0.6s ease-out",
};

/**
 * Scroll-driven gradient background.
 * Smoothly shifts hue/stops as the user scrolls through the page.
 */
export function CorridorCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const t = window.scrollY / maxScroll; // 0 → 1

      // Interpolate between gradient stops as user scrolls
      // Top: deep dark → accent-tinted
      // Bottom: pure black → subtle purple
      const hue = 255 + t * 20;          // 255 (purple) → 275 (violet)
      const sat = 40 + t * 20;           // 40% → 60%
      const topL = 4 + t * 6;            // 4% → 10%
      const midL = 2 + t * 3;            // 2% → 5%
      const angle = 160 + t * 20;        // 160deg → 180deg

      el.style.background = [
        `linear-gradient(${angle}deg,`,
        `hsl(${hue} ${sat}% ${topL}%) 0%,`,
        `hsl(${hue + 10} ${sat - 10}% ${midL}%) 50%,`,
        `#0a0a0a 100%)`,
      ].join(" ");
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial state

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={ref} style={bgStyle} />;
}
