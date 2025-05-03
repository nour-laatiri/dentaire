import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Informations de contact</h2>
          <p><strong>Adresse:</strong> 123 Rue de borghiba, Tunisie, Monastir</p>
          <p><strong>Téléphone:</strong> +216 54 395 278</p>
          <p><strong>Email:</strong> contact@prothea.com</p>
          <p><strong>Heures d'ouverture:</strong> Lun-Ven: 9h-17h</p>
        </div>
        <form className="contact-form">
          <h2>Envoyez-nous un message</h2>
          <div className="form-group-contact">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" required />
          </div>
          <div className="form-group-contact">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-btn-contact">Envoyer</button>
        </form>
      </div>
    </div>
  );
}