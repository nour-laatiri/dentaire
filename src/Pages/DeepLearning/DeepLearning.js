import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../DeepLearning/DeepLearning.css";
import { auth } from "../../components/firebase/firebase";
import { PatientService } from "../../components/firebase/firestore";


export default function DeepLearning() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const patientData = location?.state?.patientData;
  const image = location?.state?.image;
  const imageFile = location?.state?.imageFile;
  
  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/Signin', { replace: true });
  };

  const handleBack = () => {
    navigate(-1);
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
        type: ' analyse par image', // Differentiate from form-based predictions
        result: prediction.prediction,
        confidence: prediction.confidence,
        description: prediction.description,
        imageUrl: image, // Store the image URL if available
        parameters: { // Store any relevant parameters from the image analysis
          analysisType: 'dental_scan',
          // Add any other relevant metadata
        },
        patientInfo: {
          id: patientData.id,
          name: `${patientData.prenom} ${patientData.nom}`,
          age: patientData.age
        }
      };

      await PatientService.savePrediction(
        auth.currentUser.uid,
        patientData.id,
        predictionData
      );

      alert("Analyse d'image enregistrée avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Résultat d'analyse</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #2c3e50; }
            .header { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .content { display: flex; flex-direction: column; gap: 30px; }
            .patient-info, .image-container, .results { margin-bottom: 20px; }
            .image-container img { max-width: 100%; height: auto; display: block; margin: 0 auto; border: 1px solid #ddd; }
            .results { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            .footer { margin-top: 30px; text-align: center; font-style: italic; color: #7f8c8d; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Résultat d'analyse dentaire</h1>
          </div>
          
          <div class="content">
            ${patientData ? `
              <div class="patient-info">
                <h2>Informations patient</h2>
                <p><strong>Nom:</strong> ${patientData.nom}</p>
                <p><strong>Prénom:</strong> ${patientData.prenom}</p>
                <p><strong>Âge:</strong> ${patientData.age}</p>
                <p><strong>Sexe:</strong> ${patientData.sexe}</p>
              </div>
            ` : ''}
            
            ${image ? `
              <div class="image-container">
                <h2>Image analysée</h2>
                <img src="${image}" alt="Scan dentaire analysé" />
              </div>
            ` : ''}
            
            ${prediction ? `
              <div class="results">
                <h2>Résultats de l'analyse</h2>
                <p><strong>Prédiction:</strong> ${prediction.prediction || prediction.prediction}</p>
                <p><strong>Confiance:</strong> ${(prediction.confidence * 100).toFixed(2)}%</p>
                <p><strong>Description:</strong> ${prediction.description}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}</p>
            <p>PROTEQ - Analyse dentaire par intelligence artificielle</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
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

  useEffect(() => {
    processImage();
  }, []);

  return (
    <div className="deep-learning-page">
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
      <button onClick={handleBack} className="back-button">
        &larr; Retour
      </button>

      <h1>Analyse par image</h1>
      
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
          <p><strong>Prédiction:</strong> {prediction.prediction || prediction.prediction}</p>
          <p><strong>Confiance:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
          <p><strong>Description:</strong> {prediction.description}</p>
          
          <button onClick={handlePrint} className="print-button">
            Imprimer les résultats
          </button>
          <button 
              onClick={savePrediction} 
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? "Enregistrement..." : "Enregistrer cette analyse"}
            </button>
        </div>
      )}
    </div>
  );
}