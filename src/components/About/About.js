import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1>À propos de PROTHEA</h1>
      <div className="about-content">
        <div className="about-text">
          <h2>Notre Mission</h2>
          <p>
            Chez PROTHEA, nous nous engageons à révolutionner le domaine des
            prothèses dentaires grâce à des technologies de pointe et une
            approche centrée sur le patient.
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