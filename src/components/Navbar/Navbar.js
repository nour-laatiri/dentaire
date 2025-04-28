import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    
    const handleSignOut = () => {
      // Clear the authentication flag
      localStorage.removeItem('isAuthenticated');  // <-- THIS IS THE CRUCIAL ADDITION
      
      // Replace the current entry in history stack with signin page
      navigate('/Signin', { replace: true });  // Changed from '/' to '/Signin' to match your routes
      
      // Optional: Clear any user data from state/context here
    };

  return (
    <header className="header">
      <Link to="/home" className="logo">
        PROTHEA
      </Link>
      <nav className="nav">
        <div className="nav-center">
          <Link to="/home">Accueil</Link>
          <Link to="/about">À propos</Link> {/* Moved inside nav-center */}
          <Link to="/service">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        
      </nav>
      
          <button className="signout"onClick={handleSignOut}>
          Deconnexion

          </button>
        
    </header>
  );
}