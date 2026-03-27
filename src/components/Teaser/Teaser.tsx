import styles from "./Teaser.module.css";

export function Teaser() {
  return (
    <section className={styles.section} id="next">
      <p className={styles.text}>
        <span className={styles.label}>Next</span>
        Exploring what happens when you point a RAG pipeline at Roger Deakins'
        cinematography philosophy.
      </p>
    </section>
  );
}
