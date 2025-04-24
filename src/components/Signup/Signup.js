import React, { useState } from "react";
import {} from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

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
    // ici tu peux faire un appel à Firebase ou autre service d'inscription
  };

  return (
    <div className="signup-container">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
