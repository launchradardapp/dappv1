'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/styles/projectDetail.module.css';
import { IoRocketSharp } from 'react-icons/io5';
import { CHAINS } from '@/constants/options';

type Project = {
  id: number;
  title: string;
  symbol: string;
  cover_photo_base64: string;
  logo_base64: string;
  chain: string;
  dex: string;
  category: string;
  launch_type: string;
  platform: string;
  launch_date: string;
  launch_time: string;
  contract_address: string;
  description: string;
  socials: { [key: string]: string }; // Added socials as a key-value pair object
};


// Helper function to get the chain icon
const getChainIcon = (chainName: string): string => {
  const chain = CHAINS.find((c) => c.name === chainName);
  return chain ? chain.icon : '/assets/icons/default_chain.svg'; // Default icon if no match is found
};

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('About');

  const renderTabContent = () => {
    if (activeTab === 'About') {
      return (
        <div>
          <h3 className={styles.aboutTitle}>About {project?.title || 'this project'}</h3>
          <p className={styles.aboutDescription}>{project?.description || 'No description available.'}</p>
        </div>
      );
    } else if (activeTab === 'More Info') {
      return <p>More information about the project...</p>;
    }
    return null;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) {
          setError('Invalid project ID');
          return;
        }
        const response = await fetch(`/api/details?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to fetch project details.');
      }
    };

    fetchProject();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!project) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.detailContainer}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        {/* Cover Photo */}
        <div className={styles.coverPhotoContainer}>
          <img
            src={project.cover_photo_base64}
            className={styles.coverPhoto}
          />
        </div>
        {/* Project Details Wrapper */}
        <div className={styles.projectDetailsWrapper}>
          <div className={styles.projectDetails}>
            <div className={styles.logoAndInfo}>
            <div className={styles.logoContainer}>
              <img
                src={project.logo_base64} // Use the URL directly
                className={styles.logo}
              />
            </div>

              <div className={styles.infoContainer}>
                <div className={styles.chainWithIcon}>
                  <img
                    src={getChainIcon(project.chain)}
                    alt={project.chain}
                    className={styles.chainIcon}
                  />
                  <span>{project.chain}</span>
                </div>
                <span className={styles.launchDate}>
                  <IoRocketSharp size={20} style={{ color: '#849DAC' }} />
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  }).format(new Date(project.launch_date))}
                </span>
              </div>
            </div>
            <div className={styles.titleAndSymbol}>
              <h1 className={styles.projectTitle}>{project.title}</h1>
              <p className={styles.projectSymbol}>{project.symbol}</p>
            </div>
            <div className={styles.socialsSection}>
  <ul className={styles.socialLinks}>
    {project.socials &&
      Object.entries(
        Object.keys(project.socials)
          .sort((a, b) => {
            const order = ['website', 'telegram', 'twitter'];
            const indexA = order.indexOf(a.toLowerCase());
            const indexB = order.indexOf(b.toLowerCase());

            // Prioritize preferred keys in the defined order
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            return a.localeCompare(b);
          })
          .reduce((acc, key) => {
            acc[key] = project.socials[key];
            return acc;
          }, {} as Record<string, string>)
      ).map(([platform, url]) => (
        <li key={platform} className={styles.socialLinkItem}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
        </li>
      ))}
  </ul>
</div>


          </div>
        </div>

        {/* New Navbar and Additional Content */}
        <div className={styles.additionalContent}>
          <nav className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'About' ? styles.active : ''}`}
              onClick={() => setActiveTab('About')}
            >
              About
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'More Info' ? styles.active : ''}`}
              onClick={() => setActiveTab('More Info')}
            >
              More Info
            </button>
          </nav>
          <div className={styles.tabContent}>{renderTabContent()}</div>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <h2 className={styles.tokenDetailsTitle}>Token Details</h2>
        <ul className={styles.tokenDetailsList}>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Name</span>
            <span className={styles.detailValue}>{project.title || 'N/A'}</span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Symbol</span>
            <span className={styles.detailValue}>{project.symbol || 'N/A'}</span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Chain:</span>
            <span className={styles.detailValueWithIcon}>
              <img
                src={getChainIcon(project.chain)}
                alt={project.chain}
                className={styles.chainIcon}
              />
              {project.chain || 'N/A'}
            </span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>DEX</span>
            <span className={styles.detailValue}>{project.dex || 'N/A'}</span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Contract Address</span>
            <span className={styles.detailValue}>
              {project.contract_address
              ? `${project.contract_address.slice(0, 5)}...${project.contract_address.slice(-5)}`
              : 'N/A'}
            </span>          
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Category</span>
            <span className={styles.detailValue}>{project.category || 'N/A'}</span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Launch Type</span>
            <span className={styles.detailValue}>{project.launch_type || 'N/A'}</span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Launch Platform</span>
            <span className={styles.detailValue}>{project.platform || 'N/A'}</span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Launch Date</span>
            <span className={styles.detailValue}>
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }).format(new Date(project.launch_date))}
            </span>
          </li>
          <li className={styles.tokenDetailsItem}>
            <span className={styles.detailKey}>Launch Time (UTC)</span>
            <span className={styles.detailValue}>
              {project.launch_time
                ? new Date(`1970-01-01T${project.launch_time}Z`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'UTC',
                  })
                : 'N/A'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
