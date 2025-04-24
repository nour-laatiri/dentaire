import React, { useState } from "react";
import {Link} from "react-router-dom";
import "./Signin.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Ajoute ici la logique de connexion (ex: Firebase auth)
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
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
        <button type="submit">Se connecter</button>
        <div className="signin-footer">
           <span><a href="#">Mot de passe oublié ?</a></span>
           <span style={{ float: "right" }}>
           <Link to="/signup">S'inscrire</Link>
           </span>
        </div>

      </form>
    </div>
  );
};

export default SignIn;
