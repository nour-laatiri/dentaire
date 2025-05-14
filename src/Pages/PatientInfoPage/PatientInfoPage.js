import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { PatientService } from "../../components/firebase/firestore";
import { auth } from "../../components/firebase/firebase";
import "../PatientInfoPage/PatientInfoPage.css";

export default function PatientInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load patient data
  useEffect(() => {
    const loadPatientData = async () => {
      try {
        // Check for patient ID in URL
        const params = new URLSearchParams(window.location.search);
        const patientId = params.get('id');
        
        if (patientId) {
          const data = await PatientService.getPatient(patientId);
          if (data) {
            setPatientData(data);
            if (data.imageUrl) setSelectedImage(data.imageUrl);
          }
        } else if (location.state?.patientInfo) {
          setPatientData(location.state.patientInfo);
        }
      } catch (error) {
        console.error("Error loading patient:", error);
        alert("Failed to load patient data");
      }
    };

    loadPatientData();
  }, [location]);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => navigate('/Signin', { replace: true }))
      .catch(error => console.error("Sign out error:", error));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };
  
    const handleSavePatient = async () => {
  if (!currentUser) {
    alert("Vous devez être connecté pour sauvegarder");
    return;
  }

  setIsSaving(true);
  try {
    // Upload image if new one was selected
    let imageUrl = patientData.imageUrl;
    if (imageFile) {
      imageUrl = await PatientService.uploadPatientImage(
        patientData.id || "temp_" + Date.now(),
        imageFile
      );
    }

    // Prepare complete patient data
    const fullPatientData = {
      prenom: patientData.prenom || "",
      nom: patientData.nom || "",
      age: patientData.age || 0,
      sexe: patientData.sexe || "",
      etat_general: patientData.etat_general || "",
      medication: patientData.medication || "",
      classe_edentement: patientData.classe_edentement || "",
      etendue_edentement: patientData.etendue_edentement || "",
      teethPresent: patientData.teethPresent || [],
      imageUrl: imageUrl || null
    };

    if (patientData.id) {
      await PatientService.updatePatient(currentUser.uid, patientData.id, fullPatientData);
      alert("Dossier patient mis à jour avec succès!");
    } else {
      const docId = await PatientService.createPatient(fullPatientData, currentUser.uid);
      setPatientData(prev => ({ ...prev, id: docId }));
      alert("Nouveau patient enregistré avec succès!");
    }
  } catch (error) {
    console.error("Save error:", error);
    alert("Erreur lors de la sauvegarde: " + error.message);
  } finally {
    setIsSaving(false);
  }
};

  const navigateToPrediction = (type) => {
    const route = type === 'maxillaire' 
      ? '/FormDePredictionMax' 
      : '/FormDePredictionMand';
    
    navigate(route, { 
      state: { 
        patientData: {
          ...patientData,
          imageUrl: selectedImage
        },
        image: selectedImage,
        predictionType: type 
      } 
    });
  };

  const navigateToDeepLearning = () => {
    if (!selectedImage) {
      alert("Veuillez téléverser une image d'abord");
      return;
    }
    
    navigate('/DeepLearning', { 
      state: { 
        patientData: {
          ...patientData,
          imageUrl: selectedImage
        },
        image: selectedImage,
        imageFile: imageFile
      } 
    });
  };

  const handlePrintPatientInfo = () => {
    const printWindow = window.open('', '_blank');
    const cardClone = document.querySelector('.patient-info-card').cloneNode(true);
    
    const elementsToRemove = [
      '.action-buttons',
      '.image-preview',
      '.upload-btn'
    ];
    
    elementsToRemove.forEach(selector => {
      const element = cardClone.querySelector(selector);
      if (element) element.remove();
    });
  
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
        <Link to="/home" className="logo-text">PROTEQ</Link>
        <nav className="nav">
          <Link to="/home">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/service">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/ProfilPage">Mes patients</Link> 
        </nav>
        <button className="signout" onClick={handleSignOut}>
          Déconnexion
        </button>
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
                  className="action-btn save-btn"
                  onClick={handleSavePatient}
                  disabled={isSaving}
                >
                  {isSaving ? "Sauvegarde..." : (patientData.id ? "Mettre à jour" : "Enregistrer")}
                </button>
                
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
                  Analyse d'équilibre de prothèse
                </button>
                
                <button 
                  className="action-btn print-btn"
                  onClick={handlePrintPatientInfo}
                >
                  Imprimer les Informations
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
                  <img src={selectedImage} alt="Aperçu de l'image" />
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