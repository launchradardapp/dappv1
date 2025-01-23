'use client';

import { useState } from 'react';
import styles from '@/styles/apply.module.css';

export default function ApplyListing() {
  const [title, setTitle] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setTitle('');
        setSuccess(true);
      } else {
        const { error } = await response.json();
        setError(error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to submit the post. Please try again later.');
    }
  };

  return (
    <div className={styles.applyContainer}>
      <h1 className={styles.heading}>Apply to List Your Project</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="title" className={styles.label}>
          Project Title:
        </label>
        <input
          type="text"
          id="title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your project title"
          required
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      {success && <p className={styles.success}>Project submitted successfully!</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
