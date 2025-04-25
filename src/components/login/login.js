import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doSignInUserWithEmailAndPassword, doPasswordReset } from '../firebase/auth';
import { useAuth } from "../../contexts/authContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage('');
      try {
        await doSignInUserWithEmailAndPassword(email, password);
        navigate('/home');
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage("Please enter your email first");
      return;
    }
    
    setIsSigningIn(true);
    setErrorMessage('');
    
    try {
      await doPasswordReset(email);
      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  // If user is already logged in, redirect to home
  if (userLoggedIn) {
    navigate('/home');
    return null;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <form onSubmit={onSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isSigningIn} className="login-button">
          {isSigningIn ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="login-footer">
        <button 
          type="button" 
          onClick={handlePasswordReset}
          className="text-link"
          disabled={isSigningIn}
        >
          Forgot Password?
        </button>
        <span>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;