import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  doSignInUserWithEmailAndPassword,
  doPasswordReset
} from "../firebase/auth"; // Update the path as needed
import "./Signin.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential": // Emulator or some configurations
      case "auth/user-not-found":
      case "auth/wrong-password":
        return 'Adresse email ou mot de passe est invalide '; // Generic message
      default:
        return 'Une erreur est survenue. Veuillez réessayer';
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await doSignInUserWithEmailAndPassword(email, password);
      
      // ADDED THIS LINE TO SET AUTHENTICATION FLAG
      localStorage.setItem('isAuthenticated', 'true');  // <--- THIS IS THE CRUCIAL ADDITION
      
      navigate("/home"); // Redirect to home after successful login
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await doPasswordReset(email);
      alert(`Password reset email sent to ${email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
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
            <Link to="/signup">S'inscrire</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignIn;