import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../DeepLearning/DeepLearning.css";

export default function DeepLearning() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const patientData = location?.state?.patientData;
  const image = location?.state?.image;
  const imageFile = location?.state?.imageFile;

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const processImage = async () => {
    if (!imageFile) {
      setError("No image available for processing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      // Send to your Flask backend (adjust port as needed)
      const response = await axios.post('http://localhost:5002/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically process the image when component mounts
  useEffect(() => {
    processImage();
  }, []); // Empty dependency array means this runs once on mount

  return (
    
    <div className="deep-learning-page">
        <header className="header">
        <Link to="/home" className="logo-text">PROTHEA</Link>
        <nav className="nav">
          <Link to="/home">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/service">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="buttons">
          <button className="signup">Inscription</button>
          <button className="signin">Connexion</button>
        </div>
      </header>
      <button onClick={handleBack} className="back-button">
        &larr; Retour
      </button>

      <h1>Analyse Deep Learning</h1>
      
      {patientData && (
        <div className="patient-summary">
          <h2>Patient: {patientData.prenom} {patientData.nom}</h2>
        </div>
      )}

      <div className="image-display">
        {image && <img src={image} alt="Dental scan for analysis" />}
      </div>

      {isLoading && <div className="loading">Analyse en cours...</div>}
      
      {error && <div className="error">{error}</div>}

      {prediction && (
        <div className="results">
          <h2>Résultats:</h2>
          <p><strong>Prédiction:</strong> {prediction.prediction}</p>
          <p><strong>Confiance:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
          <p><strong>Description:</strong> {prediction.description}</p>
        </div>
      )}
    </div>
  );
}