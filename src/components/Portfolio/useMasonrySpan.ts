import { useEffect } from "react";

const ROW_UNIT = 4;
const GAP_PX = 12; // bottom padding on each wrapper

/**
 * Measures each child of the grid container and sets grid-row: span N
 * based on content height / 4px row unit. Skips on mobile (single-column).
 */
export function useMasonrySpan(gridRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const isMobile = () => window.matchMedia("(max-width: 600px)").matches;

    function recalc() {
      if (!grid) return;
      if (isMobile()) {
        // Reset spans on mobile
        for (const child of Array.from(grid.children) as HTMLElement[]) {
          child.style.gridRowEnd = "";
        }
        return;
      }

      for (const child of Array.from(grid.children) as HTMLElement[]) {
        // Measure the inner content height
        const content = child.firstElementChild as HTMLElement | null;
        if (!content) continue;
        const height = content.getBoundingClientRect().height;
        const span = Math.ceil((height + GAP_PX) / ROW_UNIT);
        child.style.gridRowEnd = `span ${span}`;
      }
    }

    // Initial calc after a frame so cards have rendered
    requestAnimationFrame(recalc);

    const ro = new ResizeObserver(recalc);
    ro.observe(grid);

    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [gridRef]);
}
