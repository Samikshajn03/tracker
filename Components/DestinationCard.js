'use client';

import { useState } from 'react';
import '../styles/Dashboard.scss';

export default function DestinationCard({ dest, onDelete, index }) {
  const images = dest.photos || [];
  const hasImages = images.length > 0;
  const randomImage = hasImages
    ? images[Math.floor(Math.random() * images.length)].url
    : null;

  const [showModal, setShowModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleImageClick = () => {
    if (images.length === 1) {
      setFullscreenImage(images[0].url);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="destination-card">
        {hasImages && (
          <img
            loading="lazy"
            src={randomImage}
            alt={`Image of ${dest.city}, ${dest.country}`}
            className="destination-image"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
            onClick={handleImageClick}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        )}

        {images.length > 1 && (
          <button className="show-more-btn" onClick={() => setShowModal(true)}>
            More images
          </button>
        )}

        <h3 className="destination-name">{dest.city}, {dest.country}</h3>

        {dest.memory && (
          <p className="destination-memory">Memory: {dest.memory}</p>
        )}
      </div>

      {/* Modal to show all images */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content images-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Images of {dest.city}</h2>
            <div className="modal-images-grid">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Image ${i + 1}`}
                  className="modal-image"
                  loading="lazy"
                  onClick={() => setFullscreenImage(img.url)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <img
            src={fullscreenImage}
            alt="Full View"
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="close-fullscreen-btn" onClick={() => setFullscreenImage(null)}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
