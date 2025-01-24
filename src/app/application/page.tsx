'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/apply.module.css';
import { CHAINS, LAUNCH_TYPES, CATEGORIES, getDexesForChain, getPlatformsForChainAndLaunchType } from '@/constants/options';

export default function ApplyListing() {
  const [title, setTitle] = useState('');
  const [symbol, setSymbol] = useState('');
  const [chain, setChain] = useState(CHAINS[0].name); // Default to the first chain
  const [dex, setDex] = useState('');
  const [availableDexes, setAvailableDexes] = useState<string[]>(getDexesForChain(CHAINS[0].name));

  const [category, setCategory] = useState(CATEGORIES[0]); // Default to the first category
  const [launchType, setLaunchType] = useState(LAUNCH_TYPES[0].name); // Default to the first launch type
  const [platform, setPlatform] = useState('');
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);

  const [launchDate, setLaunchDate] = useState('');
  const [launchTime, setLaunchTime] = useState('');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update available DEXes when the chain changes
  useEffect(() => {
    const dexesForChain = getDexesForChain(chain);
    setAvailableDexes(dexesForChain);
    if (!dexesForChain.includes(dex)) {
      setDex(''); // Reset DEX if invalid
    }
  }, [chain]);

  // Update available platforms when the chain or launch type changes
  useEffect(() => {
    const validPlatforms = getPlatformsForChainAndLaunchType(chain, launchType);
    setAvailablePlatforms(validPlatforms);
    if (!validPlatforms.includes(platform)) {
      setPlatform(''); // Reset platform if invalid
    }
  }, [chain, launchType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    // Validate required fields
    if (!title || !symbol || !chain || !dex || !category || !launchType || !platform || !launchDate || !launchTime) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          symbol,
          chain,
          dex,
          category,
          launch_type: launchType,
          platform,
          launch_date: launchDate,
          launch_time: launchTime,
        }),
      });

      if (response.ok) {
        // Reset form
        setTitle('');
        setSymbol('');
        setChain(CHAINS[0].name);
        setDex('');
        setCategory(CATEGORIES[0]);
        setLaunchType(LAUNCH_TYPES[0].name);
        setPlatform('');
        setLaunchDate('');
        setLaunchTime('');
        setSuccess(true);
      } else {
        const { error } = await response.json();
        setError(error || 'Something went wrong.');
      }
    } catch (error: unknown) {
      console.error('Error while submitting post:', error);
      setError('Failed to submit the post. Please try again later.');
    }
  };

  return (
    <div className={styles.applyContainer}>
      <h1 className={styles.heading}>Apply to List Your Project</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="title" className={styles.label}>Project Name:</label>
        <input
          type="text"
          id="title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your project title"
          required
        />

        <label htmlFor="symbol" className={styles.label}>Symbol:</label>
        <input
          type="text"
          id="symbol"
          className={styles.input}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter the project symbol"
          required
        />

        <label htmlFor="chain" className={styles.label}>Chain:</label>
        <select
          id="chain"
          className={styles.select}
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        >
          {CHAINS.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <label htmlFor="dex" className={styles.label}>DEX:</label>
        <select
          id="dex"
          className={styles.select}
          value={dex}
          onChange={(e) => setDex(e.target.value)}
          required
        >
          <option value="">Select a DEX</option>
          {availableDexes.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <label htmlFor="category" className={styles.label}>Category:</label>
        <select
          id="category"
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label htmlFor="launchType" className={styles.label}>Launch Type:</label>
        <select
          id="launchType"
          className={styles.select}
          value={launchType}
          onChange={(e) => setLaunchType(e.target.value)}
          required
        >
          {LAUNCH_TYPES.map((type) => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>

        <label htmlFor="platform" className={styles.label}>Platform:</label>
        <select
          id="platform"
          className={styles.select}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
        >
          <option value="">Select a Platform</option>
          {availablePlatforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label htmlFor="launchDate" className={styles.label}>Launch Date:</label>
        <input
          type="date"
          id="launchDate"
          className={styles.input}
          value={launchDate}
          onChange={(e) => setLaunchDate(e.target.value)}
          required
        />

        <label htmlFor="launchTime" className={styles.label}>Launch Time:</label>
        <input
          type="time"
          id="launchTime"
          className={styles.input}
          value={launchTime}
          onChange={(e) => setLaunchTime(e.target.value)}
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
