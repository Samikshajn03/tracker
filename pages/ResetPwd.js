import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('Invalid access. Please verify your OTP first.');
      setTimeout(() => router.push('/forgot'), 3000);
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleReset = async () => {
    setError('');
    setMessage('');
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setMessage('Password reset successfully! You can now log in.');
      sessionStorage.removeItem('resetEmail');
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Reset Password</h2>
      <p>Reset password for: <strong>{email}</strong></p>
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={handleReset} style={{ padding: '10px 20px' }}>
        Reset Password
      </button>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default ResetPassword;
