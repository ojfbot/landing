import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <h1 className={styles.headline}>
          One engineer. An AI-native dev stack. Eleven apps and counting.
        </h1>
        <p className={styles.subline}>
          This is jim.software — where I build the tools, the platform, and the
          products on top of it. Zero to one, over and over.
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
