'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUser, FaRegEnvelope, FaLock, FaRegEye } from 'react-icons/fa';
import '../../styles/Components/Signup.scss';
import { registerUser } from '../../utils/apiFunctions/auth/RegisterUserFunction'; 
import { ToastContainer,toast } from 'react-toastify';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
      toast.success('Registration successful!');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      sessionStorage.setItem('token', data.token);
      setTimeout(() => {
      router.push('/'); 
    }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-main-container">
      <div className="signup-whole-container">
        <div className="signup-details-container">
          <div className="container-heading">Tracker</div>
          <div className="details-container">
            <p className="signup-text">SIGN UP</p>
            <form className="details-fields" onSubmit={handleSubmit}>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
              <div className="name-field">
                <FaUser style={{ marginRight: '8px', color: 'black' }} />
                <input
                  type="text"
                  value={username}
                  className="input-field"
                  placeholder="User Name"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="email-field">
                <FaRegEnvelope style={{ marginRight: '8px', color: 'black' }} />
                <input
                  type="email"
                  value={email}
                  className="input-field"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="password-field">
                <FaLock style={{ marginRight: '8px', color: 'black' }} />
                <input
                  type="password"
                  value={password}
                  className="input-field"
                  placeholder="Create Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="confirm-password-field">
                <FaRegEye style={{ marginRight: '8px', color: 'black' }} />
                <input
                  type="password"
                  value={confirmPassword}
                  className="input-field"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? 'Signing Up...' : 'Signup'}
              </button>
            </form>
            <p className="acc-text">
              Already have an account?
              <Link href="/" className="log-text"> Login</Link>
            </p>
          </div>
        </div>
        <div className="signup-image-container">
          <div className="image-container-heading">Wander beyond borders...!!!</div>
          <div className="image-container-text">The world is yours to explore</div>
          <div className="image">
            <img src="signup.svg" className="signup-img" alt="Signup" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpForm;
