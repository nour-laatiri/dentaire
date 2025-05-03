import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1>À propos de PROTHEQ</h1>
      <div className="about-content">
        <div className="about-text">
          <h2>Notre Mission</h2>
          <p>
            Chez PROTEQ, notre mission est d'optimiser le traitement des patients par des prothèses partielles amovibles
             grâce à une prédiction des problèmes d'équilibre qui peuvent exister et une proposition des solutions qui peuvent être envisager.
          </p>
          
          <h2>Notre Équipe</h2>
          <p>
            Une équipe de professionnels dévoués composée de dentistes,
            techniciens et ingénieurs travaillant ensemble pour créer des
            solutions dentaires exceptionnelles.
          </p>
        </div>
        <div className="about-image"></div>
        
      </div>
    </div>
  );
}