import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Frame OS", href: "https://frame.jim.software" },
  { label: "Resumé", href: "https://cv.jim.software" },
  { label: "Blog", href: "https://medium.com/@ojfbot" },
  { label: "Log", href: "https://ojfbot.github.io/daily-logger/" },
];

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#hero" className={styles.wordmark}>
        jim.software
      </a>
      <nav className={styles.nav}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={styles.navLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
