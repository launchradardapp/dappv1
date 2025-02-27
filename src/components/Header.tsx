'use client';

import styles from '@/styles/header.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname(); // Get the current path for active tab highlighting

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and Site Name */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoCircle}></div>
            <img 
              src="/assets/icons/LaunchRadar.svg"  /* Update the path to your SVG file */
              className={styles.logoImage} /* Optional: Add styling for the logo image */
            />
          </Link>
        </div>
        {/* Navigation Tabs */}
        <nav className={styles.nav}>
          <Link
            href="/explore"
            className={`${styles.navLink} ${
              pathname.startsWith('/explore') ? styles.active : ''
            }`}
          >
            Explore Projects
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${
              pathname === '/about' ? styles.active : ''
            }`}
          >
            About
          </Link>
        </nav>

        {/* Apply To List Button */}
        <div className={styles.applyButtonWrapper}>
          <Link href="/application" className={styles.applyButton}>
            Apply To List
          </Link>
        </div>
      </div>
    </header>
  );
}
