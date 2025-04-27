import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Effacer l'erreur à chaque frappe
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    console.log("Formulaire validé :", form);
    navigate('/'); // Rediriger vers l'accueil après inscription
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-form">
          <h1>Créer un compte sur PROTHEA</h1>
          <p className="subtitle">Entrez vos informations ci-dessous.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Entrez votre nom complet"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre adresse email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="signup-btn">S'inscrire</button>
          </form>

          <div className="have-account">
            Déjà un compte ? <a href="/signin">Connectez-vous ici</a>
          </div>
        </div>
      </div>

      <div className="signup-image">
        <img src="/dental-chair.jpg" alt="Dental Chair" />
      </div>
    </div>
  );
}
