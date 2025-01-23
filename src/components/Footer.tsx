import styles from '@/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Section: Name and Rights */}
        <div className={styles.left}>
          <p>© {new Date().getFullYear()} Launch Radar. All rights reserved.</p>
        </div>

        {/* Right Section: Social Links */}
        <div className={styles.right}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <p>
          Disclaimer: Launch Radar is a platform for showcasing crypto projects and does not 
          endorse or verify the legitimacy of any project listed. Please do your own research 
          before investing.
        </p>
      </div>
    </footer>
  );
}
