import styles from "./FooterSection.module.css"

export function FooterSection() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.copyright}>
            © 2026 MineSweeper CC. All rights reserved.
          </p>
        </div>
      </footer>

      <a
        className={styles.fab}
        href="mailto:support@minesweepercc.com"
        aria-label="Open support"
      >
        Help
      </a>
    </>
  )
}
