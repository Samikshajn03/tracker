'use client';
import React, { useState, useEffect } from 'react';
import '../styles/Components/Image.scss';
import { ToastContainer,toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

 const MAX_ALLOWED_SIZE_MB = 5;

const ImageUpload = ({ onFilesChange }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);




const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = [];
    const newFiles = [];

    for (const file of files) {
      try {
        const options = {
          maxSizeMB: MAX_ALLOWED_SIZE_MB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        if (compressedFile.size / 1024 / 1024 > MAX_ALLOWED_SIZE_MB) {
          alert(`"${file.name}" could not be compressed below 5MB. Skipped.`);
          continue;
        }

        const previewUrl = URL.createObjectURL(compressedFile);
        newPreviews.push(previewUrl);
        newFiles.push(compressedFile);
      } catch (err) {
        console.error('Compression failed:', err);
        alert(`Failed to compress "${file.name}". Skipped.`);
      }
    }

    const updatedFiles = [...imageFiles, ...newFiles];
    const updatedPreviews = [...imagePreviews, ...newPreviews];

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    onFilesChange?.(updatedFiles);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...imageFiles];

    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);

    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  // Cleanup when unmounting
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="modalinput">
      <label htmlFor="imageUpload">Upload Images:</label>
      <input
        type="file"
        id="imageUpload"
        onChange={handleImageChange}
        accept="image/*"
        multiple
      />
      <div className="image-previews">
        {imagePreviews.map((image, index) => (
          <div key={index} className="image-preview-container">
            <img src={image} alt={`Preview ${index}`} className="image-preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => handleRemoveImage(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ImageUpload;
