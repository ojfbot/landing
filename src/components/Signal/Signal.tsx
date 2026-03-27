import styles from "./Signal.module.css";

export function Signal() {
  return (
    <section className={styles.section} id="signal">
      <div className={styles.lines}>
        <p className={styles.line}>
          Enterprise software engineer by day.
          <span className={styles.muted}> Art history background. CCNA. iOS dev.</span>
        </p>
        <p className={styles.line}>
          At work I'm part of a team of teams.
          <span className={styles.accent}> Here, I am the team.</span>
        </p>
        <p className={styles.line}>
          ADRs, visual regression CI, daily automated dev logs
          <span className={styles.muted}> — enterprise-grade infrastructure,
          adapted for a solo workflow.</span>
        </p>
        <p className={styles.line}>
          This isn't a portfolio.
          <span className={styles.accent}> It's a lab.</span>
        </p>
      </div>
    </section>
  );
}
