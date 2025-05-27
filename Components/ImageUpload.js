'use client';
import React, { useState, useEffect } from 'react';
import '../styles/Components/Image.scss';

const ImageUpload = ({ onFilesChange }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...imagePreviews, ...newPreviews];
    const updatedFiles = [...imageFiles, ...files];

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
    </div>
  );
};

export default ImageUpload;
