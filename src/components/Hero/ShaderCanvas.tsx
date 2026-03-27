import { useEffect, useRef } from "react";
import { ShaderRenderer } from "./shader";
import styles from "./Hero.module.css";

export function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    const renderer = new ShaderRenderer(canvas, dpr);
    renderer.start();

    const onResize = () => renderer.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
