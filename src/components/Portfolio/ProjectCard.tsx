import { forwardRef, useState, useRef, useCallback } from "react";
import type { Project } from "../../types";
import { ProjectPopover } from "./ProjectPopover";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  function ProjectCard({ project, index }, ref) {
    const isComingSoon = project.status === "coming-soon";
    const hasPreview = !!project.preview;
    const [popoverVisible, setPopoverVisible] = useState(false);
    const cardElRef = useRef<HTMLDivElement>(null);
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const showPopover = useCallback(() => {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => setPopoverVisible(true), 200);
    }, []);

    const hidePopover = useCallback(() => {
      clearTimeout(hoverTimerRef.current);
      setPopoverVisible(false);
    }, []);

    const content = (
      <div
        ref={cardElRef}
        className={`${styles.card} ${isComingSoon ? styles.comingSoon : ""}`}
        onMouseEnter={hasPreview ? showPopover : undefined}
        onMouseLeave={hasPreview ? hidePopover : undefined}
      >
        <div className={styles.header}>
          <h3 className={styles.name}>{project.name}</h3>
          {isComingSoon && <span className={styles.badge}>soon</span>}
          {hasPreview && (
            <button
              className={styles.previewBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPopoverVisible((v) => !v);
              }}
              aria-label={`Preview ${project.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3C4.5 3 1.7 5.1 0.5 8c1.2 2.9 4 5 7.5 5s6.3-2.1 7.5-5c-1.2-2.9-4-5-7.5-5z" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          )}
        </div>
        <p className={styles.tagline}>{project.tagline}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        {hasPreview && (
          <ProjectPopover
            project={project}
            anchor={cardElRef.current}
            visible={popoverVisible}
            onClose={hidePopover}
          />
        )}
      </div>
    );

    const wrapper = (child: React.ReactNode) => (
      <div
        ref={ref}
        className={`${styles.wrapper} ${styles.cardAnimated}`}
        data-card-index={index}
        style={{ transitionDelay: `${index * 60}ms` }}
      >
        {child}
      </div>
    );

    if (isComingSoon) return wrapper(content);

    return wrapper(
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {content}
      </a>,
    );
  },
);
