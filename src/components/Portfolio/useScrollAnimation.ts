import { useEffect, useRef } from "react";
import type { ScrollScene } from "./ScrollScene";

/**
 * Drives card entry animations and the Three.js decorative scene
 * based on scroll position relative to the portfolio section.
 */
export function useScrollAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
) {
  const sceneRef = useRef<ScrollScene | null>(null);
  const revealedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Skip animations on reduced motion or mobile
    if (prefersReduced || isMobile) {
      for (const card of cardRefs.current) {
        if (card) {
          card.style.opacity = "1";
          card.style.transform = "none";
        }
      }
      // Hide canvas on mobile to save battery
      if (isMobile) {
        canvas.style.display = "none";
      }
      return;
    }

    // Lazy-load Three.js scene (desktop only)
    let scene: ScrollScene | null = null;
    import("./ScrollScene").then(({ ScrollScene: SC }) => {
      if (!canvas.isConnected) return; // unmounted
      try {
        scene = new SC(canvas);
        scene.init();
        sceneRef.current = scene;
      } catch {
        canvas.style.display = "none";
      }
    });

    function getScrollProgress(): number {
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
      const progress = 1 - (rect.bottom / (viewH + rect.height));
      return Math.max(0, Math.min(1, progress));
    }

    function onScroll() {
      const progress = getScrollProgress();

      // Update Three.js scene
      if (scene) {
        scene.setScrollProgress(progress);
      }

      // Staggered card reveal
      const cards = cardRefs.current;
      for (let i = 0; i < cards.length; i++) {
        if (revealedRef.current.has(i)) continue;
        const card = cards[i];
        if (!card) continue;

        const cardRect = card.getBoundingClientRect();
        const viewH = window.innerHeight;
        // Reveal when card is 80% into viewport
        if (cardRect.top < viewH * 0.85) {
          // Stagger delay based on index
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "perspective(1000px) translateZ(0)";
          }, i * 60);
          revealedRef.current.add(i);
        }
      }
    }

    function onResize() {
      scene?.resize();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Initial check
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene?.destroy();
      sceneRef.current = null;
    };
  }, [sectionRef, canvasRef, cardRefs]);
}
