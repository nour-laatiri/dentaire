// src/components/login/login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInUserWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
import { useAuth } from "../../contexts/authContext";

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

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage('');
      try {
        await doSignInWithGoogle();
        navigate('/home');
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
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
      <form onSubmit={onSubmit}>
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
        <button type="submit" disabled={isSigningIn}>
          {isSigningIn ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <button onClick={onGoogleSignIn} disabled={isSigningIn}>
        {isSigningIn ? 'Signing In...' : 'Sign In with Google'}
      </button>
    </div>
  );
};

export default Login;