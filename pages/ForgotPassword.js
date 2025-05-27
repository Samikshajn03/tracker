'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import Link from 'next/link';
import '../styles/forgotpwd.scss';

function Forgot() {
const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOtp = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('OTP sent successfully to your email.');
        setOtpSent(true);
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
     if (data.success) {
  setMessage('OTP verified! Redirecting to reset password...');
  sessionStorage.setItem('resetEmail', email);
  router.push('/ResetPwd');
} else {
        setMessage(data.error || 'Invalid or expired OTP.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Failed to verify OTP. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-main-container">
      <div className="forgot-whole-container">
        <div className="forgot-image-container">
          <div className="heading">Tracker</div>
          <div className="image-section">
            <img src="forgot-pwd.png" className="forgot-img" alt="Forgot Password" />
          </div>
        </div>

        <div className="forgot-textual-container">
          <div className="forgot-pwd-heading">Forgot Your Password?</div>
          <div className="email-text">
            <div>Please enter your login email to receive the</div>
            <div>password reset link.</div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <label>Enter email address</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              className="email-input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpSent}  
            />

            <div className="request-link-btn" onClick={handleRequestOtp} style={{ marginTop: '10px' }}>
              {loading && !otpSent ? 'Sending...' : 'Request OTP'}
            </div>

            {otpSent && (
              <>
                <label style={{ marginTop: '20px' }}>Enter OTP</label>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  className="email-input-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <div className="request-link-btn" onClick={handleVerifyOtp} style={{ marginTop: '10px' }}>
                  {loading ? 'Verifying...' : 'Validate OTP'}
                </div>
              </>
            )}
          </form>

          {message && <p style={{ marginTop: '10px', color: 'blue' }}>{message}</p>}

          <div className="or-line">
            <span className="line"></span>
            <span className="or-text">OR</span>
            <span className="line"></span>
          </div>

          <div className="create-acc">
            Don't have an account? <Link href="/" className="sign-text">Create Account</Link>
          </div>
          <div className="login">
            <Link href="/login" className="sign-text">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
