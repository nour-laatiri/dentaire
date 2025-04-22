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
            Bienvenue sur <span>PROTHEA</span>
          </h1>
          <p>
          Prédiction du pronostic de l'équilibre de la prothèse mandibulaire et maxillaire.
           Pourquoi y a-t-il une différence dans le texte entre le maxillaire et le mandibulaire ?
          </p>
          <button className="learn-more" onClick={handleExploreClick}>
            Explorer ➜
          </button>
        </div>
        <div className="illustration"></div>
      </div>
      
    </>
  );
}