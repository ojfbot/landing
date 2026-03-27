import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>&copy; {new Date().getFullYear()} jim.software</span>
      <div>
        <a
          href="mailto:hi@jim.software"
          className={styles.link}
        >
          hi@jim.software
        </a>
        <span className={styles.copy}> · </span>
        <a
          href="https://github.com/ojfbot"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
      </div>
    </footer>
  );
}
