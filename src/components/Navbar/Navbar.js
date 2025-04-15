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
        <button className="signin">Connexion</button>
        <button className="signup">Inscription</button>
      </div>
    </header>
  );
}