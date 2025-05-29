'use client';
import React, { useState, useEffect } from 'react';
import '../styles/Components/Image.scss';
import { ToastContainer,toast } from 'react-toastify';

const ImageUpload = ({ onFilesChange }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

 const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const validFiles = [];
  const validPreviews = [];

  files.forEach((file) => {
    if (file.size <= MAX_SIZE_BYTES) {
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    } else {
      toast.error(`"${file.name}" is too large (max ${MAX_SIZE_MB}MB). It was not added.`);
    }
  });

  const updatedPreviews = [...imagePreviews, ...validPreviews];
  const updatedFiles = [...imageFiles, ...validFiles];

  setImagePreviews(updatedPreviews);
  setImageFiles(updatedFiles);
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
