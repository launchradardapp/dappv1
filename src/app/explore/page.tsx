'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/explore.module.css';

type Post = {
  id: number;
  title: string;
  symbol: string;
  chain: string;
  dex: string;
  category: string;
  launch_type: string;
  platform: string;
  launch_date: string;
};

const chains = ['All Chains', 'Ethereum', 'BSC Smart Chain', 'Solana', 'AVAX'];

export default function ExploreProjects() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeChain, setActiveChain] = useState('All Chains');

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
      {/* Static Navbar */}
      <div className={styles.navbar}>
        {chains.map((chain) => (
          <button
            key={chain}
            className={`${styles.navButton} ${
              activeChain === chain ? styles.active : ''
            }`}
            onClick={() => handleFilter(chain)}
          >
            {chain}
          </button>
        ))}
      </div>

      {/* Post Cards */}
      <div className={styles.cardContainer}>
        {filteredPosts.length > 0 ? (
          <ul className={styles.postList}>
            {filteredPosts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <div className={styles.coverPhoto}></div>
                <div className={styles.cardContent}>
                  <div className={styles.logoSection}>
                    <div className={styles.logo}></div>
                    <p className={styles.chain}>{post.chain}</p>

                  </div>
                  <div className={styles.title}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p className={styles.symbol}>{post.symbol}</p>
                      <p className={styles.category}>{post.category}</p>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.detailRow}>
                      <span className={styles.types}>Type</span>
                      <span className={styles.detail}>{post.launch_type}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.types}>DEX</span>
                      <span className={styles.detail}>{post.dex}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.types}>Platform</span>
                      <span className={styles.detail}>{post.platform}</span>
                    </div>
                  </div>
                  <p className={styles.launchDate}>
                    {new Date(post.launch_date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noPosts}>No projects found for this chain.</p>
        )}
      </div>
    </div>
  );
}
