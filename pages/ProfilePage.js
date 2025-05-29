'use client';

import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import '../styles/Profile.scss';
import NavBar from '../Components/NavBar';
import { logoutUser } from '../utils/apiFunctions/auth/LogoutFunction';
import { useRouter } from 'next/router';
import { fetchUserProfile } from '../utils/apiFunctions/ProfileDataFunction';

export default function UserData() {
  const [imageUrl, setImageUrl] = useState('/default.png');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    
    const userId = sessionStorage.getItem('id');

    if (!userId) return;

    fetchUserProfile(userId)
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        setImageUrl(data.profile_image_url || ''); 
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
      });
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl); 

    const formData = new FormData();
    formData.append('image', file);
    formData.append('email', email);

    try {
      const res = await fetch('/api/UploadProfileImage', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImageUrl(data.imageUrl); 
    } catch (err) {
      console.error('Upload error:', err.message);
    }
  };

  return (
    <div className="container">
      <NavBar />
      <div className="main-part">
        <div className="profile-container">
          <div className="profile">
            <div className="profileInfoContainer">
              <div className="profileImageContainer">
                <img
                  src={imageUrl || '/default.png'}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="profileImage"
                  crossOrigin="anonymous"
                />
                <div className="uploadButton">
                  <label htmlFor="upload-input">
                    <FaCamera
                      style={{ color: '#000', fontSize: '24px', cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="file"
                    id="upload-input"
                    className="img"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="profileDetails">
                <p className="profile-name">
                  <strong>{username}</strong>
                </p>
                <p className="profile-email"> {email}</p>
              </div>
            </div>

            <button className="logoutButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
