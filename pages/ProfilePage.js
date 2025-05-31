'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCamera } from 'react-icons/fa';
import NavBar from '../Components/NavBar';
import { logoutUser } from '../utils/apiFunctions/auth/LogoutFunction';
import { fetchUserProfile } from '../utils/apiFunctions/ProfileDataFunction';
import '../styles/Profile.scss';

export default function Profile() {
  const [imageUrl, setImageUrl] = useState('/default.png');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countries_traveled, setCountries_travelled]= useState('');
  const [cities_traveled, setCities_travelled]= useState('');


  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    if (!userId) return;

    fetchUserProfile(userId)
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        setImageUrl(data.profile_image_url || '/default.png');
        setCities_travelled(data.cities_traveled);
        setCountries_travelled(data.countries_traveled);

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
      
      <div className="backgroundImage">
        <img
          src="/bg.jpg"
          alt="Landscape Background"
        />
        <div className="overlay"></div>
      </div>

      <div className="foreground">
        <NavBar />
        <div className="centerContent">
          <div className="profileCard">
            <div className="profileImageContainer">
              <img
                src={imageUrl || '/default.png'}
                alt="Profile"
                crossOrigin="anonymous"
              />
              <div className="uploadButton">
                <label htmlFor="upload-input">
                  <FaCamera size={20} />
                </label>
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="profileText">
              <h1>{username || 'Traveler'}</h1>
              <p>{email || 'you@example.com'}</p>
              
            </div>
            <div className='count'>
             <div className='country-count'>
        <div>{countries_traveled}</div> 
        <div style={{color:'#6b7280'}}>Countries</div>
      </div>
       <div className='city-count'>
        <div>{cities_traveled}</div> 
        <div style={{color:'#6b7280'}}>Cities</div>
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