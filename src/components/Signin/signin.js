import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  doSignInUserWithEmailAndPassword,
  doPasswordReset,
  doSignInWithGoogle
} from "../firebase/auth";
import "./Signin.css";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return 'Adresse email ou mot de passe est invalide';
      case "auth/popup-closed-by-user":
        return 'Vous avez fermé la fenêtre de connexion Google';
      default:
        return 'Une erreur est survenue. Veuillez réessayer';
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    
    try {
      await doSignInWithGoogle();
      localStorage.setItem('isAuthenticated', 'true');
      navigate("/home");
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await doSignInUserWithEmailAndPassword(email, password);
      localStorage.setItem('isAuthenticated', 'true');
      navigate("/home");
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Veuillez entrer votre email d'abord");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await doPasswordReset(email);
      alert(`Un email de réinitialisation a été envoyé à ${email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="signin-container">
        <div className="signin-card">
          <div className="welcome-section">
            <h1>Bienvenue dans Prothea</h1>
          </div>
  
          <form className="signin-form" onSubmit={handleSubmit}>
            <h2>Connexion</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Se connecter"}
            </button>
            
            <div className="oauth-providers">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="google-signin-btn"
                disabled={isGoogleLoading}
              >
                <FcGoogle size={20} />
                {isGoogleLoading ? "Connexion en cours..." : "Continuer avec Google"}
              </button>
            </div>
            
            <div className="signin-footer">
              <span>
                <button 
                  type="button" 
                  onClick={handlePasswordReset}
                  className="text-link"
                >
                  Mot de passe oublié ?
                </button>
              </span>
              <span>
                <Link to="/signup">vous n'avez pas de compte ?</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  };
  export default SignIn;

