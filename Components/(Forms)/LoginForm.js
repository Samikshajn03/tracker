import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaRegEnvelope, FaRegEye } from 'react-icons/fa';
import styles from '../../styles/Components/Login.scss'; 
import { loginUser } from '../../utils/apiFunctions/auth/LoginUserFunction';
import { ToastContainer,toast } from 'react-toastify';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      await loginUser({email, password});
      toast.success('Login success');
      router.push('/Dashboard');
    } catch(err){
      toast.error(err.message);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className='login-main-container'>
      <div className="login-whole-container">
        <div className="login-details-container">
          <div className="container-heading">Tracker</div>

          <div className="detail-container">
            <p className="login-text">LOGIN</p>

            <form  className="data" onSubmit={handleSubmit}>

              <div className='email-input'>
                <FaRegEnvelope style={{ marginRight: '8px', color: 'black' }} />
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='password-input'>
                <FaRegEye style={{ marginRight: '8px', color: 'black' }} />
                <input
                  type="password"
                  className='input-field'
                  value={password}
                  placeholder='Enter Password'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <button type="submit" className='login-btn'>Login</button>
              </div>
            </form>

            <div className='base-text'>
              <div>
                {/* <p><Link href="/Adminlogin">Login as admin</Link></p> */}
                <p>
                  <Link href="/ForgotPassword" className='forget-pwd'>Forgot Password?</Link>
                </p>
              </div>
              <div>
                <p className="acc-text">
                  Don't have an account?
                  <Link href="/signup" className='sign-text'> SignUp</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-image-container">
          <div className='image-container-heading'>
            Wander beyond borders...!!!
          </div>
          <div className='image-container-text'>
            The world is yours to explore
          </div>
          <div className='image'>
            <img src="/signup.svg" className='login-img' alt="Signup" />
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default LoginForm;
