import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../FormDePrediction/FormDePrediction.css";

export default function PredictionFormPage() {
  const location = useLocation();
  const [patientData, setPatientData] = useState(null);
  const [predictionType, setPredictionType] = useState('');
  const [formData, setFormData] = useState({
    crete: "",
    palais: "",
    "forme de l'arcade": "",
    "zone de Schroeder": "",
    "fibre muqueux": "",
    gencive: "",
    "Frein labial": "",
    tuberosite: "",
    voile: "",
    "classe de kennedy": "",
    pp: "",
  });
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (location.state) {
      setPatientData(location.state.patientData);
      setPredictionType(location.state.predictionType);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        ...formData,
        patientData,
        predictionType
      });
      setPrediction(response.data.label);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div className="dental-page">
      <header className="header">
        <Link to="/" className="logo-text">PROTHEA</Link>
        <nav className="nav">
          <Link to="/">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/service">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="buttons">
          <button className="signup">Inscription</button>
          <button className="signin">Connexion</button>
        </div>
      </header>

      <main className="form-page-container">
        <div className="form-page">
          <h1>Formulaire de Prédiction {predictionType}</h1>
          <p>Complétez les informations pour la prédiction {predictionType}</p>
          
          {patientData && (
            <div className="patient-info-summary">
              <h3>Patient: {patientData.prenom} {patientData.nom}</h3>
            </div>
          )}

          <form onSubmit={handleSubmit} className="prediction-form">
            {/* Form fields remain the same */}
            {Object.keys(formData).map((key, index) => (
              <div className="form-group" key={key}>
                <div className="feature-input">
                  <label>{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            ))}
            
            <button type="submit" className="submit-btn">
              Exécuter la Prédiction {predictionType}
            </button>
          </form>
          
          {prediction && (
            <div className="prediction-result">
              <h3>Résultat de la Prédiction {predictionType}:</h3>
              <div className="prediction-value">{prediction}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}