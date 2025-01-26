'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { IoRocketSharp } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import default styles
import styles from '@/styles/explore.module.css';
import { CHAINS, getPlatformIcon, getChainIcon, getDexIcon } from '@/constants/options';

type Post = {
  id: number;
  slug: string; // Add slug field to the Post type
  title: string;
  symbol: string;
  chain: string;
  dex: string;
  category: string;
  launch_type: string;
  platform: string;
  launch_date: string;
  cover_photo_base64: string;
  logo_base64: string;
};

export default function ExploreProjects() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeChain, setActiveChain] = useState('All Chains');
  const [loading, setLoading] = useState(true); // Add loading state


  useEffect(() => {
    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data); // Initially show all posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchPosts();
  }, []);

  const handleFilter = (chain: string) => {
    setActiveChain(chain);
    if (chain === 'All Chains') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.chain === chain));
    }
  };

  

  return (
    <div className={styles.exploreContainer}>
      <h1 className={styles.heading}>Discover Upcoming Projects</h1>

      {/* Navbar */}
      <div className={styles.navbar}>
        {/* Add 'All Chains' option manually */}
        <button
          key="all-chains"
          className={`${styles.navButton} ${activeChain === 'All Chains' ? styles.active : ''}`}
          onClick={() => handleFilter('All Chains')}
        >
          <img src="/assets/icons/all_chains.svg" alt="All Chains" className={styles.navIcon} />
          All Chains
        </button>

        {/* Dynamically render chain buttons */}
        {CHAINS.map((chain) => (
          <button
            key={chain.name}
            className={`${styles.navButton} ${activeChain === chain.name ? styles.active : ''}`}
            onClick={() => handleFilter(chain.name)}
          >
            <img src={getChainIcon(chain.name)} className={styles.navIcon} />
            {chain.name}
          </button>
        ))}
      </div>

      <div className={styles.cardContainer}>
  {loading ? (
    <ul className={styles.postList}>
      {[...Array(6)].map((_, index) => (
        <li key={index} className={styles.postItem}>
          <div className={`${styles.cardLink} ${styles.skeletonCard}`}>
            <div className={styles.coverPhotoContainer}>
              <div className={styles.skeletonCoverPhoto}></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.logoSection}>
                <div className={styles.logoContainer}>
                  <div className={styles.skeletonLogo}></div>
                </div>
                <div className={styles.chain}>
                  <div className={styles.skeletonText}></div>
                </div>
              </div>
              <div className={styles.title}>
                <div className={styles.skeletonTextLarge}></div>
                <div className={styles.skeletonTextSmall}></div>
              </div>
              <div className={styles.details}>
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className={styles.detailRow}>
                    <div className={styles.skeletonTextSmall}></div>
                    <div className={styles.skeletonTextSmall}></div>
                  </div>
                ))}
              </div>
              <div className={styles.skeletonLaunchDate}></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    filteredPosts.length > 0 ? (
    <ul className={styles.postList}>
      {filteredPosts.map((post) => (
        <li key={post.id} className={styles.postItem}>
          <Link href={`/explore/projects/${post.slug}?id=${post.id}`} passHref>
            <div className={styles.cardLink}>
              <div className={styles.coverPhotoContainer}>
                <img
                  src={post.cover_photo_base64}
                  className={styles.coverPhoto}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.logoSection}>
                  <div className={styles.logoContainer}>
                    <img
                      src={post.logo_base64}
                      className={styles.logo}
                    />
                  </div>
                  <div className={styles.chain}>
                    <img
                      src={getChainIcon(post.chain)}
                      className={styles.chainIcon}
                    />
                    {post.chain}
                  </div>
                </div>
                <div className={styles.title}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.symbol}>{post.symbol}</p>
                  <p
                    className={`${styles.category} ${
                      post.category === 'Utility' ? styles.utility : styles.meme
                    }`}
                  >
                    {post.category}
                  </p>
                </div>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <span className={styles.types}>Type</span>
                    <span className={styles.detail}>{post.launch_type}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.types}>DEX</span>
                    <span className={styles.detail}>
                      <img
                        src={getDexIcon(post.dex)}
                        className={styles.platformIcon}
                      />
                      {post.dex}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.types}>Platform</span>
                    <span className={styles.detail}>
                      <img
                        src={getPlatformIcon(post.platform)}
                        className={styles.platformIcon}
                      />
                      {post.platform}
                    </span>
                  </div>
                </div>
                <p className={styles.launchDate}>
                  <IoRocketSharp size={22} style={{ color: '#849DAC' }} />
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  }).format(new Date(post.launch_date))}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className={styles.noPosts}>No projects found for this chain.</p>
  )  
  )}
</div>

    </div>
  );
}
