import { useCallback, useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { projects } from "./projects";
import { useMasonrySpan } from "./useMasonrySpan";
import { useScrollAnimation } from "./useScrollAnimation";
import styles from "./Portfolio.module.css";

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    [],
  );

  useMasonrySpan(gridRef);
  useScrollAnimation(sectionRef, canvasRef, cardRefs);

  return (
    <section className={styles.section} id="portfolio" ref={sectionRef}>
      <h2 className={styles.heading}>What's running</h2>
      <p className={styles.subheading}>
        Each app is a Module Federation remote — independent deploy, shared
        shell, one AI gateway. All traceable, all works in progress. That's
        the fun part.{" "}
        <a
          href="https://log.jim.software"
          className={styles.inlineLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          See the daily dev log &rarr;
        </a>
      </p>

      <canvas ref={canvasRef} className={styles.sceneCanvas} />

      <div className={styles.gridWrapper}>
        <div className={styles.grid} ref={gridRef}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              ref={setCardRef(index)}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
