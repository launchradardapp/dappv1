'use client';

import { useState, useRef } from 'react';
import styles from '@/styles/apply.module.css';
import { useRouter } from 'next/navigation'; // For navigation after submission
import AvatarEditor from 'react-avatar-editor';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { CHAINS, CATEGORIES, LAUNCH_TYPES, getDexesForChain, getPlatformsForChainAndLaunchType } from '@/constants/options';


const steps = ['Basic Information', 'Token Info', 'Social Links', 'Uploads', 'Review & Submit'];

export default function MultiStepForm() {

  // Reusable uploadToCloudinary function
  const uploadToCloudinary = async (imageBase64: string, folder: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', imageBase64); // The image data in Base64 format
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // Unsigned preset
      formData.append('folder', folder); // Folder for storing images (e.g., Logos or Banners)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        return data.secure_url; // Return the secure URL of the uploaded image
      } else {
        console.error('Cloudinary upload failed:', data);
        return null;
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  // Updated handleSubmit function
  const handleSubmit = async () => {

    setLoading(true); // Start the loading state

    const socialsObject = socialLinks.reduce((acc, link) => {
      if (link.name && link.url) {
        acc[link.name.toLowerCase()] = link.url;
      }
      return acc;
    }, {} as Record<string, string>);

    try {
      // Upload logo and banner using the reusable function
      const logoUrl = logoFile ? await uploadToCloudinary(logoFile, 'Logos') : null;
      const bannerUrl = bannerFile ? await uploadToCloudinary(bannerFile, 'Banners') : null;

      // Debugging: Check if URLs are properly assigned
      console.log('Logo URL:', logoUrl);
      console.log('Banner URL:', bannerUrl);

      const formData = {
        title: (document.getElementById('title') as HTMLInputElement)?.value || '',
        description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
        launch_date: (document.getElementById('launchDate') as HTMLInputElement)?.value || '',
        launch_time: (document.getElementById('launchTime') as HTMLInputElement)?.value || '',
        contract_address: (document.getElementById('contractAddress') as HTMLInputElement)?.value || '',
        symbol: (document.getElementById('symbol') as HTMLInputElement)?.value || '',
        category: (document.getElementById('category') as HTMLSelectElement)?.value || '',
        chain: selectedChain || '',
        dex: (document.getElementById('dex') as HTMLSelectElement)?.value || '',
        launch_type: selectedLaunchType || '',
        platform: (document.getElementById('platform') as HTMLSelectElement)?.value || '',
        socials: Object.keys(socialsObject).length > 0 ? socialsObject : null,
        logo_base64: logoUrl, // Cloudinary URL for the logo
        cover_photo_base64: bannerUrl, // Cloudinary URL for the banner
      };

      console.log('Form Data:', formData);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Your project has been submitted successfully!'); // Set custom message
        setShowModal(true); // Show success modal
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the project.');
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  
  

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

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  
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
          {/* Step 1: Basic Information */}
          <div className={styles.stepPanel}>
            <h2>Basic Information</h2>
            <form>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Project Name
              </label>
              <input
                type="text"
                id="title"
                className={styles.input}
                placeholder="Enter project name"
                maxLength={50} // Enforces character limit
                onChange={(e) => {
                  const regex = /^[a-zA-Z0-9\s.,!?-]*$/; // Valid characters for project name
                  if (regex.test(e.target.value)) {
                    e.target.value = e.target.value.substring(0, 50); // Enforces limit
                  } else {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Enter project description"
                maxLength={3000} // Enforces character limit
                onChange={(e) => {
                  const regex = /^[a-zA-Z0-9\s.,!?'"()-]*$/; // Valid characters for description
                  if (regex.test(e.target.value)) {
                    e.target.value = e.target.value.substring(0, 3000); // Enforces limit
                  } else {
                    e.preventDefault();
                  }
                }}
              />
            </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label htmlFor="launchDate" className={styles.label}>
                    Launch Date
                  </label>
                  <input type="date" id="launchDate" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="launchTime" className={styles.label}>
                    Launch Time (UTC)
                  </label>
                  <input type="time" id="launchTime" className={styles.input} />
                </div>
              </div>
            </form>
          </div>

          {/* Step 2: Token Info */}
          <div className={styles.stepPanel}>
            <h2>Token Info</h2>
            <form>
  {/* Contract Address and Token Symbol */}
  <div className={styles.row}>
    <div className={styles.formGroup}>
      <label htmlFor="contractAddress" className={styles.label}>
        Contract Address
      </label>
      <input
        type="text"
        id="contractAddress"
        className={styles.input}
        placeholder="Enter contract address"
      />
    </div>
  </div>

  {/* Chain and DEX */}
  <div className={styles.row}>
    <div className={styles.formGroup}>
        <label htmlFor="symbol" className={styles.label}>
          Token Symbol
        </label>
        <input
          type="text"
          id="symbol"
          className={styles.input}
          placeholder="Enter token symbol"
        />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="category" className={styles.label}>
        Category
      </label>
      <select id="category" className={styles.input}>
        <option value="">Select Category</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Category */}
  <div className={styles.row}>
    <div className={styles.formGroup}>
        <label htmlFor="chain" className={styles.label}>
          Chain
        </label>
        <select
          id="chain"
          className={styles.input}
          value={selectedChain}
          onChange={handleChainChange}
        >
          <option value="">Select Chain</option>
          {CHAINS.map((chain) => (
            <option key={chain.name} value={chain.name}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dex" className={styles.label}>
          DEX
        </label>
        <select id="dex" className={styles.input}>
          <option value="">Select DEX</option>
          {dexOptions.map((dex) => (
            <option key={dex} value={dex}>
              {dex}
            </option>
          ))}
        </select>
      </div>
  </div>

  {/* Launch Type and Launch Platform */}
  <div className={styles.row}>
    <div className={styles.formGroup}>
      <label htmlFor="launchType" className={styles.label}>
        Launch Type
      </label>
      <select
        id="launchType"
        className={styles.input}
        value={selectedLaunchType}
        onChange={handleLaunchTypeChange}
      >
        <option value="">Select Launch Type</option>
        {LAUNCH_TYPES.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>

    <div className={styles.formGroup}>
      <label htmlFor="platform" className={styles.label}>
        Launch Platform
      </label>
      <select id="platform" className={styles.input}>
        <option value="">Select Platform</option>
        {platformOptions.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </select>
    </div>
  </div>
</form>
          </div>

          {/* Step 3: Social Links */}
<div className={styles.stepPanel}>
  <h2>Social Links</h2>
  <div className={styles.socialArea}>
    <form>
      {/* Render predefined social links */}
      {socialLinks.slice(0, 3).map((social, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{social.name}</label>
            <input
              type="url"
              className={styles.input}
              placeholder={`Enter ${social.name} link`}
              value={social.url}
              onChange={(e) => {
                const updatedLinks = [...socialLinks];
                updatedLinks[index].url = e.target.value;
                setSocialLinks(updatedLinks);
              }}
            />
          </div>
        </div>
      ))}

      {/* Render newly added social links */}
      {socialLinks.slice(3).map((social, index) => (
        <div key={index + 3} className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{social.name}</label>
            <input
              type="url"
              className={styles.input}
              placeholder={`Enter ${social.name} link`}
              value={social.url}
              onChange={(e) => {
                const updatedLinks = [...socialLinks];
                updatedLinks[index + 3].url = e.target.value;
                setSocialLinks(updatedLinks);
              }}
            />
          </div>
          {/* Trash icon only for newly added links */}
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => handleRemoveSocial(index + 3)}
            aria-label={`Remove ${social.name}`}
          >
            <FaTrash />
          </button>
        </div>
      ))}

      {/* Add new social link */}
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Social Name"
            value={newSocialName}
            onChange={(e) => setNewSocialName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="url"
            className={styles.input}
            placeholder="Social Link"
            value={newSocialUrl}
            onChange={(e) => setNewSocialUrl(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddSocial}
          aria-label="Add Social Link"
        >
          <FaPlus />
        </button>
      </div>
    </form>
  </div>
</div>


          {/* Step 4: Upload Logo */}
          <div className={styles.stepPanel}>
            <h2>Upload Project Logo</h2>
            <form className={styles.uploadForm}>
            <div className={styles.logoSquare}>
              {logoFile ? (
                <div className={styles.logoPreviewContainer}>
                  <img src={logoFile} alt="Logo Preview" className={styles.logoPreviewImage} />
                  <div
                    className={styles.logoHoverOverlay}
                    onClick={() => {
                      setLogoFile(null); // Reset to initial state
                      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
                    }}
                  >
                    <FaTrash size={22} style={{ color: '#849DAC' }} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Logo
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef} // Attach ref to the file input
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImage(file); // Store the File object directly
                    handleOpenLogoCropper(URL.createObjectURL(file)); // Pass preview URL for cropping modal
                  }
                }}
              />
            </div>


            {/* Banner Square Placeholder */}
            <div className={styles.bannerSquare}>
              {bannerFile ? (
                <div className={styles.bannerPreviewContainer}>
                  <img src={bannerFile} alt="Banner Preview" className={styles.bannerPreviewImage} />
                  <div
                    className={styles.bannerHoverOverlay}
                    onClick={() => {
                      setBannerFile(null); // Reset to initial state
                      if (bannerFileInputRef.current) bannerFileInputRef.current.value = ''; // Reset file input
                    }}
                  >
                    <FaTrash size={22} style={{ color: '#849DAC' }} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={() => bannerFileInputRef.current?.click()}
                >
                  Upload Banner
                </button>
              )}
              <input
                type="file"
                ref={bannerFileInputRef} // Attach ref to the file input
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedBannerImage(file); // Store the File object directly
                    handleOpenBannerCropper(URL.createObjectURL(file)); // Pass preview URL for cropping modal
                  }
                }}
              />
            </div>
            </form>
          </div>
        </div>
      </div>
                {/* Logo Cropper Modal */}
                {isLogoCropperOpen && (
                  <div className={styles.logoModal}>
                    <div className={styles.logoModalContent}>
                      <h3>Crop Logo</h3>
                      <div className={styles.logoCropArea}>
                        {selectedImage && (
                          <AvatarEditor
                            ref={logoEditorRef}
                            image={selectedImage}
                            width={100} /* Larger crop area */
                            height={100}
                            border={0}
                            borderRadius={1500} /* Circle crop */
                            scale={zoomLevel}
                          />
                        )}
                      </div>
                      <input
                        type="range"
                        className={styles.logoRangeInput}
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                      />
                      <div className={styles.logoModalButtons}>
                        <button
                          className={`${styles.logoButton}`}
                          onClick={() => handleCrop(logoEditorRef.current, () => setIsLogoCropperOpen(false))}
                        >
                          Crop
                        </button>
                        <button
                          className={`${styles.logoButton} ${styles.logoCancelButton}`}
                          onClick={() => handleCancelCrop(() => setIsLogoCropperOpen(false))}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isBannerCropperOpen && (
                  <div className={styles.bannerModal}>
                    <div className={styles.bannerModalContent}>
                      <h3>Crop Banner</h3>
                      <div className={styles.bannerCropArea}>
                        {selectedBannerImage && (
                          <AvatarEditor
                            ref={bannerEditorRef}
                            image={selectedBannerImage}
                            width={750} /* Banner width */
                            height={200} /* Banner height */
                            border={0}
                            borderRadius={0} /* Rectangle crop */
                            scale={zoomLevel}
                          />
                        )}
                      </div>
                      <input
                        type="range"
                        className={styles.bannerRangeInput}
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                      />
                      <div className={styles.bannerModalButtons}>
                        <button
                          className={`${styles.bannerButton}`}
                          onClick={() => handleCropBanner(bannerEditorRef.current, () => setIsBannerCropperOpen(false))}
                        >
                          Crop
                        </button>
                        <button
                          className={`${styles.bannerButton} ${styles.bannerCancelButton}`}
                          onClick={() => handleCancelBannerCrop(() => setIsBannerCropperOpen(false))}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              {/* Step 5: Review & Submit */}
        {currentStep === 4 && (
          <div className={styles.stepPanel}>
            <h2>Review & Submit</h2>
            <div className={styles.summarySection}>
              {/* Basic Information */}
              <div className={styles.summaryItem}>
                <h3>Basic Information</h3>
                <p>
                  <strong>Project Name:</strong>{' '}
                  {(document.getElementById('title') as HTMLInputElement)?.value || 'N/A'}
                </p>
                <p>
                  <strong>Description:</strong>{' '}
                  {(document.getElementById('description') as HTMLTextAreaElement)?.value || 'N/A'}
                </p>
                <p>
                  <strong>Launch Date:</strong>{' '}
                  {(document.getElementById('launchDate') as HTMLInputElement)?.value || 'N/A'}
                </p>
                <p>
                  <strong>Launch Time:</strong>{' '}
                  {(document.getElementById('launchTime') as HTMLInputElement)?.value || 'N/A'}
                </p>
              </div>

              {/* Token Info */}
              <div className={styles.summaryItem}>
                <h3>Token Info</h3>
                <p>
                  <strong>Contract Address:</strong>{' '}
                  {(document.getElementById('contractAddress') as HTMLInputElement)?.value || 'N/A'}
                </p>
                <p>
                  <strong>Token Symbol:</strong>{' '}
                  {(document.getElementById('symbol') as HTMLInputElement)?.value || 'N/A'}
                </p>
                <p><strong>Chain:</strong> {selectedChain || 'N/A'}</p>
                <p>
                  <strong>DEX:</strong>{' '}
                  {(document.getElementById('dex') as HTMLSelectElement)?.value || 'N/A'}
                </p>
                <p>
                  <strong>Category:</strong>{' '}
                  {(document.getElementById('category') as HTMLSelectElement)?.value || 'N/A'}
                </p>
                <p><strong>Launch Type:</strong> {selectedLaunchType || 'N/A'}</p>
                <p>
                  <strong>Launch Platform:</strong>{' '}
                  {(document.getElementById('platform') as HTMLSelectElement)?.value || 'N/A'}
                </p>
              </div>

              {/* Social Links */}
              <div className={styles.summaryItem}>
                <h3>Social Links</h3>
                <ul>
                  {socialLinks.map((social, index) => (
                    <li key={index}>
                      <strong>{social.name}:</strong> {social.url || 'N/A'}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Uploaded Files */}
              <div className={styles.summaryItem}>
                <h3>Uploads</h3>
                <p>
                  <strong>Logo:</strong>{' '}
                  {logoFile ? (
                    <img src={logoFile} alt="Logo Preview" className={styles.uploadPreview} />
                  ) : (
                    'No logo uploaded'
                  )}
                </p>
                <p>
                  <strong>Banner:</strong>{' '}
                  {bannerFile ? (
                    <img src={bannerFile} alt="Banner Preview" className={styles.uploadPreview} />
                  ) : (
                    'No banner uploaded'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        {currentStep > 0 && (
          <button
            className={`${styles.button} ${styles.previousButton}`}
            onClick={handlePrevious}
          >
            Previous
          </button>
        )}
        {currentStep === steps.length - 1 ? (
          // Add handleSubmit for the Submit button
          <button
            className={`${styles.button} ${styles.nextButton}`}
            onClick={handleSubmit}
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <>
                <span className={styles.loader}></span> Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.nextButton}`}
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>

      {showModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Success</h2>
          <p>{successMessage}</p>
          <button
            className={styles.modalButton}
            onClick={() => {
              setShowModal(false); // Close modal
              router.push('/explore'); // Redirect to /explore
            }}
          >
            OK
          </button>
        </div>
      </div>
)}

    </div>
  );
}
