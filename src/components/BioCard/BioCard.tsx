import { useRef, useState } from "react";
import styles from "./BioCard.module.css";

export function BioCard() {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next && cardRef.current) {
        // Wait for expand transition to start, then scroll into view
        setTimeout(() => {
          cardRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 50);
      }
      return next;
    });
  };

  return (
    <section className={styles.wrapper}>
      <button
        ref={cardRef}
        className={`${styles.card} ${expanded ? styles.expanded : ""}`}
        onClick={handleClick}
        aria-expanded={expanded}
      >
        <div className={styles.header}>
          <div className={styles.avatar}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
            </svg>
          </div>
          <div className={styles.identity}>
            <span className={styles.name}>James O'Connor</span>
            <span className={styles.title}>Design Engineer</span>
            <span className={styles.tagline}>
              Building the lab. Learning what works.
            </span>
          </div>
          <svg
            className={styles.chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className={styles.body}>
          <p className={styles.bio}>
            Frame&nbsp;OS is my workshop&nbsp;— eleven apps, one platform, all
            experiments. I come from design and cinema, which mostly means I'm
            obsessed with why things feel right or wrong. Right now I'm exploring
            how far one engineer and AI-native tooling can push that instinct.
            Everything here is a work in progress. That's the point.
          </p>
        </div>
      </button>
    </section>
  );
}
