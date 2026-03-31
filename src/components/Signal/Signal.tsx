import styles from "./Signal.module.css";

export function Signal() {
  return (
    <section className={styles.section} id="signal">
      <div className={styles.lines}>
        <p className={styles.line}>
          Part of a team of teams by day. I build developer tools.
          <span className={styles.accent}> Here, I'm the whole stack.</span>
        </p>
        <p className={styles.line}>
          How it's built matters as much as what ships.
          <span className={styles.muted}> That's the point.</span>
        </p>
        <p className={styles.line}>
          ADRs, visual regression CI, automated dev logs
          <span className={styles.muted}> — the kind of infra that makes
          one person feel like ten.</span>
        </p>
        <p className={styles.line}>
          This isn't a portfolio.
          <span className={styles.accent}> It's a dev environment.</span>
        </p>
      </div>
    </section>
  );
}
