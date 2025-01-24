'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { IoRocketSharp } from 'react-icons/io5';
import styles from '@/styles/explore.module.css';
import { CHAINS } from '@/constants/options'; // Import the updated CHAINS array

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
};

// Helper function to get the chain icon
const getChainIcon = (chainName: string): string => {
  const chain = CHAINS.find((c) => c.name === chainName);
  return chain ? chain.icon : '/assets/icons/default_chain.svg'; // Default icon if no match is found
};

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
            <img src={chain.icon} alt={chain.name} className={styles.navIcon} />
            {chain.name}
          </button>
        ))}
      </div>

      {/* Post Cards */}
      <div className={styles.cardContainer}>
        {filteredPosts.length > 0 ? (
          <ul className={styles.postList}>
            {filteredPosts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                {/* Add ID as a query parameter */}
                <Link href={`/projects/${post.slug}?id=${post.id}`} passHref>
                  <div className={styles.cardLink}>
                    <div className={styles.coverPhoto}></div>
                    <div className={styles.cardContent}>
                      <div className={styles.logoSection}>
                        <div className={styles.logo}></div>
                        <div className={styles.chain}>
                          <img
                            src={getChainIcon(post.chain)} // Dynamically fetch icon for each chain
                            alt={post.chain}
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
                          <span className={styles.detail}>{post.dex}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.types}>Platform</span>
                          <span className={styles.detail}>{post.platform}</span>
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
        )}
      </div>
    </div>
  );
}
