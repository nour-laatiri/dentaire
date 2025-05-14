import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../FormDePredictionMax/FormDePredictionMax.css";
import { auth } from "../../../components/firebase/firebase";
import { PatientService } from "../../../components/firebase/firestore";

export default function PredictionFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patientData, setPatientData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [predictionType, setPredictionType] = useState('');
  const [formData, setFormData] = useState({
    crête: "",
    palais: "",
    "forme de l'arcade": "",
    "zone de Schroeder": "",
    "fibro-muqueuse": "",
    "Frein labial": "",
    tuberosité: "",
    "voile du palais": "",
    "Classe d'édentement": "",
    " type de prothèse à envisager": "",
  });
  const [prediction, setPrediction] = useState(null);
  const [modifications, setModifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/Signin', { replace: true });
  };

  useEffect(() => {
    console.log("Location state:", location.state);
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
      const response = await axios.post("http://localhost:5001/predict", {
        ...formData,
        patientData,
        predictionType
      });
      setPrediction(response.data.label);
      // Set modifications if they exist in the response
      if (response.data.modifications) {
        setModifications(response.data.modifications);
      } else {
        setModifications([]);
      }
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

const savePrediction = async () => {
  if (!patientData?.id || !prediction) {
    alert("Patient data or prediction missing");
    return;
  }
  
  if (!auth.currentUser) {
    alert("User not authenticated");
    return;
  }

  setIsSaving(true);
  try {
    const predictionData = {
      type: predictionType,
      result: prediction,
      formData: formData,
      modifications: modifications,
      patientInfo: { // Store basic patient info for reference
        id: patientData.id,
        name: `${patientData.prenom} ${patientData.nom}`,
        age: patientData.age
      }
    };
    
    console.log("Saving prediction data:", predictionData);
    
    await PatientService.savePrediction(
      auth.currentUser.uid,
      patientData.id,
      predictionData
    );
    
    alert("Prédiction enregistrée avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    alert(`Erreur lors de l'enregistrement: ${error.message}`);
  } finally {
    setIsSaving(false);
  }
};

  const groupFieldsIntoPairs = () => {
    const fields = Object.keys(formData);
    const pairs = [];
    
    for (let i = 0; i < fields.length; i += 2) {
      const pair = fields.slice(i, i + 2);
      pairs.push(pair);
    }
    
    return pairs;
  };

  const fieldPairs = groupFieldsIntoPairs();

  const handlePrintPrediction = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="text-align: center;">Résultat de Prédiction ${predictionType}</h1>
        
        ${patientData ? `
          <div style="margin-bottom: 20px;">
            <h3>Patient: ${patientData.prenom} ${patientData.nom}</h3>
            <p>Âge: ${patientData.age} | Sexe: ${patientData.sexe}</p>
          </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <h3>Caractéristiques:</h3>
          <ul>
            ${Object.entries(formData).map(([key, value]) => 
              `<li><strong>${key}:</strong> ${value}</li>`
            ).join('')}
          </ul>
        </div>
        
        ${prediction ? `
          <div style="margin-top: 20px;">
            <h3>Résultat:</h3>
            <p style="font-weight: bold; color: ${prediction === 'non favorable' ? 'red' : 'green'};">
              ${prediction}
            </p>
            ${modifications.length > 0 ? `
              <div>
                <h4>Modifications recommandées:</h4>
                <ul>
                  ${modifications.map(mod => `<li>${mod}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        <div style="margin-top: 20px; text-align: center; font-style: italic;">
          Impression générée le ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="dental-page">
      <header className="header">
        <Link to="/home" className="logo-text">PROTEQ</Link>
        <nav className="nav">
          <Link to="/home">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/service">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/ProfilPage">Mes patients</Link> 
        </nav>
        <button className="signout" onClick={handleSignOut}>
          Deconnexion
        </button>
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

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-group">
              {fieldPairs.map((pair, index) => (
                <div className="feature-pair" key={`pair-${index}`}>
                  {pair.map((fieldName) => (
                    <div className="feature-input" key={fieldName}>
                      <label>{fieldName}</label>
                      <input
                        type="text"
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleChange}
                        className="input"
                        
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Traitement..." : `Exécuter la Prédiction `}
            </button>
          </form>
          
          {prediction && (
            <div className="prediction-result">
              <h3>Résultat de la Prédiction {predictionType}:</h3>
              <div className={`prediction-value ${prediction === 'non favorable' ? 'non-favorable' : ''}`}>
                {prediction}
              </div>
              
              {prediction === 'non favorable' && modifications.length > 0 && (
                <div className="modifications-section">
                  <h4>Propositions thérapeutiques pour optimiser l'équilibre:</h4>
                  <ul className="modifications-list">
                    {modifications.map((mod, index) => (
                      <li key={index}>{mod}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="action-buttons">
                <button 
                  className="print-btn"
                  onClick={handlePrintPrediction}
                >
                  Imprimer cette Prédiction
                </button>
                <button 
                  className="save-btn1"
                  onClick={savePrediction}
                  disabled={!prediction || isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer cette Prédiction"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
