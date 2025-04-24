import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        PROTHEA
      </Link>
      <nav className="nav">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
        <Link to="/service">Services</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="buttons">
        <Link to="/signin" className="signin">Connexion</Link>
        <Link to="/signup" className="signup">Inscription</Link>
      </div>
    </header>
  );
}