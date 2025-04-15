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
            Nous façonnons des prothèses dentaires plus précises, plus humaines
            et plus intelligentes, pour un meilleur sourire demain.
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