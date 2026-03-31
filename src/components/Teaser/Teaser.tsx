import styles from "./Teaser.module.css";

export function Teaser() {
  return (
    <section className={styles.section} id="next">
      <p className={styles.text}>
        <span className={styles.label}>Now shipping</span>
        AI-powered knowledge search across 348 podcast transcripts. Scraped, indexed, and served.
      </p>
    </section>
  );
}
