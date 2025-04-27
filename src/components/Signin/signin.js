import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion normale
    console.log('Login normal:', formData);
    navigate('/'); // Redirection vers l'accueil
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://www.facebook.com/';
  };

  const handleGoogleLogin = () => {
    // Stocke l'état avant de rediriger
    localStorage.setItem('returnToSignIn', 'true');
    
    // Ouvre la connexion Google dans un nouvel onglet
    const googleAuthWindow = window.open(
      'https://accounts.google.com/', 
      '_blank',
      'width=500,height=600'
    );
    
    // Vérifie périodiquement si la fenêtre est fermée
    const checkWindowClosed = setInterval(() => {
      if (googleAuthWindow.closed) {
        clearInterval(checkWindowClosed);
        if (localStorage.getItem('googleAuthSuccess') === 'true') {
          localStorage.removeItem('googleAuthSuccess');
          navigate('/'); // Redirige vers l'accueil après succès
        } else {
          // Recharge la page SignIn
          window.location.reload();
        }
      }
    }, 500);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-form">
          <h1>Sign in to PROTHEA.</h1>
          <p className="subtitle">Enter your details below.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="divider">or</div>

          <div className="social-login">
            <p>Sign in With Social Account</p>
            <button 
              className="social-btn facebook-btn"
              onClick={handleFacebookLogin}
            >
              Login with Facebook
            </button>
            <button 
              className="social-btn google-btn"
              onClick={handleGoogleLogin}
            >
              Sign in with Google+
            </button>
          </div>
          <div className="create-account">
            Don't have an account? <a href="/signup">Create new account.</a>
          </div>
        </div>
      </div>

      <div className="signin-image">
        <img src="/dental-chair.jpg" alt="Dental Chair" />
      </div>
    </div>
  );
};

export default Signin;
