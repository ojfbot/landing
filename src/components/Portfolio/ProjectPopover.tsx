import { useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../../types";
import styles from "./ProjectPopover.module.css";

interface Props {
  project: Project;
  anchor: HTMLElement | null;
  visible: boolean;
  onClose: () => void;
}

export function ProjectPopover({ project, anchor, visible, onClose }: Props) {
  const popRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!visible || !anchor || !popRef.current) return;
    const el = popRef.current;
    const rect = anchor.getBoundingClientRect();
    const popW = el.offsetWidth;
    const popH = el.offsetHeight;
    const gap = 12;

    // On mobile, CSS handles full-width overlay
    if (window.innerWidth < 600) {
      el.style.left = "";
      el.style.top = "";
      return;
    }

    // Position above the card, centered horizontally
    let left = rect.left + rect.width / 2 - popW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));

    let top = rect.top - popH - gap;
    if (top < 12) {
      // Not enough space above, position below
      top = rect.bottom + gap;
    }
    top = Math.max(12, Math.min(top, window.innerHeight - popH - 12));

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [visible, anchor]);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    // Delay click listener to avoid immediately closing
    const timer = setTimeout(() => {
      window.addEventListener("click", onClick);
    }, 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      clearTimeout(timer);
    };
  }, [visible, onClose]);

  if (!visible || !project.preview) return null;

  return createPortal(
    <div ref={popRef} className={styles.popover}>
      <img
        src={project.preview}
        alt={project.previewAlt || project.name}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.info}>
        <span className={styles.name}>{project.name}</span>
        <span className={styles.tagline}>{project.tagline}</span>
      </div>
    </div>,
    document.body,
  );
}
