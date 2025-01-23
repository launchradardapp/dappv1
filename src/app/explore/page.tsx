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
  launch_time: string;
};

export default function ExploreProjects() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.exploreContainer}>
      <h1 className={styles.heading}>Explore Projects</h1>
      {loading ? (
        <p className={styles.loading}>Loading projects...</p>
      ) : posts.length === 0 ? (
        <p className={styles.noPosts}>No projects found.</p>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p><strong>Symbol:</strong> {post.symbol}</p>
              <p><strong>Chain:</strong> {post.chain}</p>
              <p><strong>DEX:</strong> {post.dex}</p>
              <p><strong>Category:</strong> {post.category}</p>
              <p><strong>Launch Type:</strong> {post.launch_type}</p>
              <p><strong>Platform:</strong> {post.platform}</p>
              <p><strong>Launch Date:</strong> {new Date(post.launch_date).toLocaleDateString()}</p>
              <p><strong>Launch Time:</strong> {post.launch_time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
