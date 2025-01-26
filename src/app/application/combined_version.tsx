'use client';

import { useState, useRef } from 'react';
import styles from '@/styles/apply.module.css';
import AvatarEditor from 'react-avatar-editor';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { CHAINS, CATEGORIES, LAUNCH_TYPES, getDexesForChain, getPlatformsForChainAndLaunchType } from '@/constants/options';

const steps = ['Basic Information', 'Token Info', 'Social Links', 'Uploads', 'Review & Submit'];

export default function MultiStepForm() {
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [selectedLaunchType, setSelectedLaunchType] = useState<string>('');
  const [dexOptions, setDexOptions] = useState<string[]>([]);
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [socialLinks, setSocialLinks] = useState([
    { name: 'Website', url: '' },
    { name: 'Telegram', url: '' },
    { name: 'Twitter', url: '' },
  ]);
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | File>(''); // Default to an empty string
  const [isLogoCropperOpen, setIsLogoCropperOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.2);

  const logoEditorRef = useRef<AvatarEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input

  const [bannerFile, setBannerFile] = useState<string | null>(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState<string | File>(''); // Banner-specific image state
  const [isBannerCropperOpen, setIsBannerCropperOpen] = useState(false);
  const bannerEditorRef = useRef<AvatarEditor | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null); // Ref for banner file input

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddSocial = () => {
    if (newSocialName.trim() && newSocialUrl.trim()) {
      setSocialLinks([...socialLinks, { name: newSocialName, url: newSocialUrl }]);
      setNewSocialName('');
      setNewSocialUrl('');
    }
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleOpenLogoCropper = (image: string) => {
    setSelectedImage(image);
    setIsLogoCropperOpen(true);
  };

  const handleCrop = (editor: AvatarEditor | null, closeCropper: () => void) => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      const croppedImage = canvas.toDataURL(); // Convert cropped area to Base64
      setLogoFile(croppedImage);
      closeCropper();
    }
  };

  const handleCancelCrop = (closeCropper: () => void) => {
    setSelectedImage(''); // Reset selected image
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input to allow re-selection of the same file
    }
    closeCropper();
  };

  const handleOpenBannerCropper = (image: string) => {
    setSelectedBannerImage(image);
    setIsBannerCropperOpen(true);
  };

  const handleCropBanner = (editor: AvatarEditor | null, closeCropper: () => void) => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      const croppedImage = canvas.toDataURL(); // Convert cropped area to Base64
      setBannerFile(croppedImage);
      closeCropper();
    }
  };

  const handleCancelBannerCrop = (closeCropper: () => void) => {
    setSelectedBannerImage(''); // Reset selected image
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.value = ''; // Reset file input to allow re-selection of the same file
    }
    closeCropper();
  };

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chainName = e.target.value;
    setSelectedChain(chainName);
    setDexOptions(getDexesForChain(chainName)); // Update DEX options based on the selected chain

    // Reset platform options if launch type is already selected
    if (selectedLaunchType) {
      setPlatformOptions(getPlatformsForChainAndLaunchType(chainName, selectedLaunchType));
    }
  };

  const handleLaunchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const launchTypeName = e.target.value;
    setSelectedLaunchType(launchTypeName);

    // Update platform options based on the selected chain and launch type
    if (selectedChain) {
      setPlatformOptions(getPlatformsForChainAndLaunchType(selectedChain, launchTypeName));
    }
  };

  return (
    <div className={styles.container}>
      {/* Step Bar */}
      <div className={styles.stepBar}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${index <= currentStep ? styles.active : ''}`}
          >
            <span>{index + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <div className={styles.formContent}>
        <div
          className={styles.formStep}
          style={{
            transform: `translateX(-${currentStep * 100}%)`,
          }}
        >
          {/* Step 1 to Step 4 */}
          {/* Add your existing step panels here (Basic Information, Token Info, Social Links, Uploads) */}
          
          {/* Step 5: Review & Submit */}
          <div className={styles.stepPanel}>
            <h2>Review & Submit</h2>
            <div className={styles.summarySection}>
              {/* Basic Information */}
              <div className={styles.summaryItem}>
                <h3>Basic Information</h3>
                <p>
                  <strong>Project Name:</strong> {(document.getElementById('title') as HTMLInputElement)?.value || 'N/A'}
                </p>
                {/* Additional summaries */}
              </div>
              {/* Token Info, Social Links, Uploads */}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        {currentStep > 0 && (
          <button className={`${styles.button} ${styles.previousButton}`} onClick={handlePrevious}>
            Previous
          </button>
        )}
        {currentStep === steps.length - 1 ? (
          <button className={`${styles.button} ${styles.nextButton}`}>Submit</button>
        ) : (
          <button className={`${styles.button} ${styles.nextButton}`} onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
