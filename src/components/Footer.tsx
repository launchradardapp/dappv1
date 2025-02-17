import styles from '@/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Section: Rights and Disclaimer */}
        <div className={styles.left}>
          <p>© {new Date().getFullYear()} Launch Radar. All rights reserved.</p>
          <p className={styles.disclaimer}>
          Disclaimer: This site provides information only and does not offer financial, investment, or legal advice. Listing a project does not imply credibility or safety. Cryptocurrency investments carry risks, including scams and fraud. We strive for accuracy but cannot guarantee completeness or reliability. Conduct your own research (DYOR) before engaging with any project. We assume no liability for losses or damages. 
          </p>
        </div>

        {/* Right Section: Social Links (Stacked) */}
        <div className={styles.right}>
          <div>
            Socials
          </div>
          <div className={styles.socials}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>  
      </div>
    </footer>
  );
}
