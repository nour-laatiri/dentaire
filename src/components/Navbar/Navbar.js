import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
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
    </header>
  );
}