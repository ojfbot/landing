import { useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Frame OS", href: "https://frame.jim.software" },
  { label: "Resumé", href: "https://cv.jim.software" },
  { label: "Blog", href: "https://medium.com/@ojfbot" },
  { label: "Log", href: "https://log.jim.software" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <a href="#hero" className={styles.wordmark}>
        jim.software
      </a>
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : ""}`} />
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={styles.navLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
