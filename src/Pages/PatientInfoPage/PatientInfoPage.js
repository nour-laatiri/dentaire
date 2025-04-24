import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../PatientInfoPage/PatientInfoPage.css";

export default function PatientInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store the actual file object

  useEffect(() => {
    if (location.state?.patientInfo) {
      setPatientData(location.state.patientInfo);
    }
  }, [location]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file); // Store the file object for later use
    }
  };

  const navigateToPrediction = (type) => {
    const route = type === 'maxillaire' 
      ? '/FormDePredictionMax' 
      : '/FormDePredictionMand';
    
    navigate(route, { 
      state: { 
        patientData,
        image: selectedImage,
        predictionType: type 
      } 
    });
  };

  const navigateToDeepLearning = () => {
    if (!selectedImage) {
      alert("Please upload an image first");
      return;
    }
    
    navigate('/DeepLearning', { 
      state: { 
        patientData,
        image: selectedImage,
        imageFile: imageFile // Pass the actual file object
      } 
    });
  };
  const handlePrintPatientInfo = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get the patient info card content
    const cardClone = document.querySelector('.patient-info-card').cloneNode(true);
    
    // Remove elements we don't want to print
    const elementsToRemove = [
      '.action-buttons',
      '.image-preview',
      '.upload-btn'
    ];
    
    elementsToRemove.forEach(selector => {
      const element = cardClone.querySelector(selector);
      if (element) element.remove();
    });
  
    // Write the print content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informations du Patient</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 30px; }
            .detail-section { margin-bottom: 20px; }
            strong { font-weight: bold; }
            .teeth-present { display: inline-block; margin-left: 5px; }
            .print-footer { 
              margin-top: 20px; 
              text-align: center; 
              font-style: italic; 
            }
          </style>
        </head>
        <body>
          <h1>Informations du Patient</h1>
          ${cardClone.innerHTML}
          <div class="print-footer">
            Impression générée le ${new Date().toLocaleDateString()}
          </div>
          <script>
            // Automatically trigger print and close when done
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
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

      <main className="info-page-container">
        <div className="info-page">
          <h1>Informations Complètes du Patient</h1>
          
          {patientData && (
            <div className="patient-info-card">
              <div className="patient-details">
                <h2>{patientData.prenom} {patientData.nom}</h2>
                
           
                
                <div className="detail-section">
                  <h3>Informations Personnelles</h3>
                  <p><strong>Âge:</strong> {patientData.age}</p>
                  <p><strong>Sexe:</strong> {patientData.sexe}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Informations Médicales</h3>
                  <p><strong>État Général:</strong> {patientData.etat_general || 'Non spécifié'}</p>
                  <p><strong>Médication en cours:</strong> {patientData.medication || 'Aucune'}</p>
                </div>
                
                <div className="detail-section">
                  <h3>État Dentaire</h3>
                  <p><strong>Classe d'édentement:</strong> {patientData.classe_edentement || 'Non spécifié'}</p>
                  <p><strong>Étendue de l'édentement:</strong> {patientData.etendue_edentement || 'Non spécifié'}</p>
                  {patientData.teethPresent && patientData.teethPresent.length > 0 ? (
                    <div>
                      <strong>Dents Présentes:</strong>
                      <div className="teeth-present">
                        {patientData.teethPresent.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <p><strong>Dents Présentes:</strong> Aucune sélectionnée</p>
                  )}
                </div>
              </div>
              <div className="action-buttons">
                <button 
                  className="action-btn maxillaire"
                  onClick={() => navigateToPrediction('maxillaire')}
                >
                  Prédiction Maxillaire
                </button>
                <button 
                  className="action-btn mandibulaire"
                  onClick={() => navigateToPrediction('mandibulaire')}
                >
                  Prédiction Mandibulaire
                </button>
                <button
                  className="action-btn deep-learning"
                  onClick={navigateToDeepLearning}
                  disabled={!selectedImage}
                >
                  analyse d'equilibre de prothése
                </button>
                <button 
                className="action-btn print-btn"
                onClick={handlePrintPatientInfo}
>
              Imprimer les Informations du Patient
              </button>
               
                <label className="upload-btn">
                  Téléverser une Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    style={{ display: 'none' }} 
                  />
                </label>
               
              </div>

              {selectedImage && (
                <div className="image-preview">
                  <img src={selectedImage} alt="Uploaded preview" />
                  <p>Image prête pour analyse</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
              

            