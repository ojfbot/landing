import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <h1 className={styles.headline}>
          What happens when an enterprise engineer
          <br />
          builds his own infrastructure?
        </h1>
        <p className={styles.subline}>
          This is jim.software — a personal platform where I experiment with
          <br />
          AI orchestration, module federation, and the CI/CD pipelines
          <br />
          that make it all work. Same rigor. Team of one.
        </p>
        <div className={styles.ctas}>
          <a
            href="https://frame.jim.software"
            className={styles.ctaPrimary}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore Frame OS
            <span className={styles.ctaHint}>(for now — best in fullscreen)</span>
          </a>
          <a
            href="/JFO-Resume.pdf"
            className={styles.ctaSecondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resumé
          </a>
        </div>
      </div>
    </section>
  );
}
