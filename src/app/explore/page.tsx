'use client';

import { useEffect, useState } from 'react';
import { IoRocketSharp } from "react-icons/io5";
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

const chains = [
    { name: 'All Chains', icon: '/assets/icons/all_chains.svg' },
    { name: 'Ethereum', icon: '/assets/icons/ethereum.svg' },
    { name: 'BSC Smart Chain', icon: '/assets/icons/bsc.svg' },
    { name: 'Solana', icon: '/assets/icons/solana.svg' },
    { name: 'Base', icon: '/assets/icons/base.svg' },
    { name: 'Sui', icon: '/assets/icons/sui.svg' },
    { name: 'XRP Ledger', icon: '/assets/icons/xrpl.svg' },
    { name: 'AVAX', icon: '/assets/icons/avax.svg' },
  ];

  const getChainIcon = (chainName: string): string => {
    const chain = chains.find((c) => c.name === chainName);
    return chain ? chain.icon : '/assets/icons/default_chain.svg'; // Use a default icon if no match is found
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
      {/* Static Navbar */}
      <div className={styles.navbar}>
        {chains.map((chain) => (
            <button key={chain.name} className={`${styles.navButton} ${activeChain === chain.name ? styles.active : ''}`}
                onClick={() => handleFilter(chain.name)}>
                <img
                    src={chain.icon}
                    alt={chain.name}
                    className={styles.navIcon}
                />
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
                <div className={styles.coverPhoto}></div>
                <div className={styles.cardContent}>
                <div className={styles.logoSection}>
  <div className={styles.logo}></div>
  <div className={styles.chain}>
    <img
      src={getChainIcon(post.chain)} // Now always a string
      alt={post.chain}
      className={styles.chainIcon}
    />
    {post.chain}
  </div>
</div>


                  <div className={styles.title}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p className={styles.symbol}>{post.symbol}</p>
                      <p className={`${styles.category} ${post.category === 'Utility' ? styles.utility : styles.meme}`}>
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
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(post.launch_date))}

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
