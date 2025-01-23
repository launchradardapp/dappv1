'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/explore.module.css';

type Post = {
  id: number;
  title: string;
  created_at: string;
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
        <p className={styles.loading}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className={styles.noPosts}>No projects found.</p>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postDate}>
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
