import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/FormPatient');
  };

  return (
    <>
      <div className="home-container">
        <div className="text-content">
          <h1>
            Bienvenue sur <span>PROTEQ</span>
          </h1>
          <p>
            Il s'agit d'une plateforme qui permet la prédiction du pronostic d'équilibre 
            de la prothèse partielle amovible, aidant ainsi les médecins dentistes à optimiser 
            la prise en charge de patients présentant des édentements partiels.
          </p>
          <p>
            Notre solution couvre à la fois les prothèses mandibulaires et maxillaires, 
            offrant une analyse complète pour chaque cas clinique.
          </p>
          <button className="learn-more" onClick={handleExploreClick}>
            Explorer ➜
          </button>
        </div>
        <div className="illustration">
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
        </div>
      </div>
    </>
  );
}