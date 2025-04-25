// src/components/Footer/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>PROTHEA</h3>
          <p>Des solutions intelligentes pour des sourires parfaits.</p>
        </div>
        
        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul>
            <li><Link to="/home">Accueil</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/service">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contactez-nous</h4>
          <p>Email: contact@prothea.com</p>
          <p>Téléphone: +216 54 395 278</p>
          <p>Adresse: 123 Rue borghiba, monastir</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PROTHEA. Tous droits réservés.</p>
      </div>
    </footer>
  );
}