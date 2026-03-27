import { forwardRef } from "react";
import type { Project } from "../../types";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  function ProjectCard({ project, index }, ref) {
    const isComingSoon = project.status === "coming-soon";

    const content = (
      <div
        className={`${styles.card} ${isComingSoon ? styles.comingSoon : ""}`}
      >
        <div className={styles.header}>
          <h3 className={styles.name}>{project.name}</h3>
          {isComingSoon && <span className={styles.badge}>soon</span>}
        </div>
        <p className={styles.tagline}>{project.tagline}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
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
