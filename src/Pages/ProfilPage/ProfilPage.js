import React, { useState, useEffect } from "react";
import { PatientService } from "../../components/firebase/firestore";
import { auth } from "../../components/firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./ProfilPage.css";

export default function ProfilePage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [predictionsMap, setPredictionsMap] = useState({}); // Store predictions by patient ID
  const [loadingPredictions, setLoadingPredictions] = useState({}); // Track loading state per patient
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      if (auth.currentUser) {
        try {
          const patientList = await PatientService.getPatientsByUser(auth.currentUser.uid);
          setPatients(patientList);
          
          // Fetch predictions for each patient
          patientList.forEach(patient => {
            fetchPredictions(patient.id);
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des patients:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatients();
  }, []);

  const fetchPredictions = async (patientId) => {
    if (!auth.currentUser) return;
    
    setLoadingPredictions(prev => ({ ...prev, [patientId]: true }));
    try {
      const preds = await PatientService.getPredictions(auth.currentUser.uid, patientId);
setPredictionsMap(prev => ({
  ...prev,
  [patientId]: preds.map(pred => {
    // For image-based predictions
    if (pred.type === 'analyse par image') {
      return {
        ...pred,
        formData: {  // Changed from parameters to formData
          ...(pred.formData || {}),
          confidence: pred.confidence,
          description: pred.description
        }
      };
    }
    // For other predictions
    return {
      ...pred,
      formData: pred.formData || {}  // Ensure formData exists
    };
  })
}));
          
          
        
    } catch (error) {
      console.error("Erreur lors de la récupération des prédiction:", error);
    } finally {
      setLoadingPredictions(prev => ({ ...prev, [patientId]: false }));
    }
  };
  

const handleDeletePatient = async (patientId) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient et toutes ses données?")) {
    try {
      await PatientService.deletePatient(auth.currentUser.uid, patientId);
      setPatients(patients.filter(p => p.id !== patientId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la patient:", error);
    }
  }
};
const handleUpdatePrediction = (patientId, predictionId, predictionType) => {
  const patient = patients.find(p => p.id === patientId);
  
  navigate(`/FormDePrediction${predictionType === 'maxillaire' ? 'Max' : 'Mand'}`, {
    state: {
      patientData: patient,
      predictionId: predictionId,
      predictionType: predictionType,
    }
  });
};


const handleDeletePrediction = async (patientId, predictionId) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette prédiction?")) {
    try {
      await PatientService.deletePrediction(auth.currentUser.uid, patientId, predictionId);
      fetchPredictions(patientId); // Refresh predictions
    } catch (error) {
      console.error("Erreur lors de la suppression de la prédiction:", error);
    }
  }
};
const handleCreateNewPrediction = (patientId, predictionType) => {
  const patient = patients.find(p => p.id === patientId);
  
  if (predictionType === 'maxillaire') {
    navigate(`/FormDePredictionMax`, {
      state: {
        patientData: patient
      }
    });
  } else if (predictionType === 'mandibulaire') {
    navigate(`/FormDePredictionMand`, {
      state: {
        patientData: patient
      }
    });
  }
};


const PredictionHistory = ({ patientId }) => {
  const predictions = predictionsMap[patientId] || [];
  const isLoading = loadingPredictions[patientId];
  const hasMaxillaire = predictions.some(p => p.type === 'maxillaire');
  const hasMandibulaire = predictions.some(p => p.type === 'mandibulaire');
  
  
  return (
    <div className="prediction-history">
      <h4>Historique des Prédictions</h4>
       <div className="prediction-creation-buttons">
        {!hasMaxillaire && (
          <button 
            className="create-btn maxillaire"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateNewPrediction(patientId, 'maxillaire');
            }}
          >
            + Ajouter prédiction maxillaire avec un formulaire de saisie
          </button>
        )}
        
        {!hasMandibulaire && (
          <button 
            className="create-btn mandibulaire"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateNewPrediction(patientId, 'mandibulaire');
            }}
          >
            + Ajouter prédiction mandibulaire avec un formulaire de saisie
          </button>
        )}
      </div>
      
      {isLoading ? (
        <p>Chargement des prédictions...</p>
      ) : predictions.length === 0 ? (
        <p>Aucune prédiction enregistrée</p>
      ) : (
        <div className="prediction-list">
          {predictions.slice(0, 2).map((pred) => (
            <div key={pred.id} className={`prediction-card ${pred.result === 'non favorable' ? 'unfavorable' : ''}`}>
              <div className="prediction-header">
                <h5>Prédiction {pred.type}</h5>
                <span className="prediction-date">
                  {new Date(pred.timestamp?.toDate()).toLocaleString('fr-FR')}
                </span>
              </div>
                            <div className="prediction-actions">
                <button 
                  className="update-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdatePrediction(patientId, pred.id, pred.type);
                  }}
                >
                  Modifier {pred.type === 'maxillaire' ? 'Maxillaire' : 'Mandibulaire'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePrediction(patientId, pred.id);
                  }}
                >
                  Supprimer
                </button>
              </div>

              
              <div className="prediction-result">
                <strong>Résultat:</strong>
                <span className={`result-value ${pred.result === 'non favorable' ? 'unfavorable' : ''}`}>
                  {pred.result}
                </span>
              </div>

              {/* Display entered features/parameters */}
              <div className="prediction-parameters">
                <h6>Paramètres utilisés:</h6>
                <div className="parameters-grid">
                   {Object.entries(pred.formData || {}).map(([key, value]) => (
                    <div key={key} className="parameter-item">
                      <span className="parameter-name">{key}:</span>
                      <span className="parameter-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pred.result === 'non favorable' && pred.modifications && (
                <div className="modifications-section">
                  <h6>Propositions thérapeutiques:</h6>
                  <ul>
                    {pred.modifications.map((mod, index) => (
                      <li key={index}>{mod}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {predictions.length > 2 && (
            <button 
              className="view-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/patients/${patientId}`);
              }}
            >
              Voir plus ({predictions.length - 2} autres)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

  const filteredPatients = patients.filter(patient =>
    `${patient.prenom} ${patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.age.toString().includes(searchTerm) ||
    patient.sexe.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="profile-container">
      <h1>Mes Patients</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher des patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Chargement des patients...</p>
      ) : filteredPatients.length === 0 ? (
        <p>Aucun patient trouvé{searchTerm ? ` pour "${searchTerm}"` : ""}</p>
      ) : (
        <div className="patient-list">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="patient-card"
            >
              <div className="patient-main-info">
                <h3>{patient.prenom} {patient.nom}</h3>
                <p>Âge: {patient.age}</p>
                <p>Sexe: {patient.sexe}</p>
              </div>
              
              <div className="detail-section">
                <h4>Informations Médicales</h4>
                <p><strong>État Général:</strong> {patient.etat_general || 'Non spécifié'}</p>
                <p><strong>Médication en cours:</strong> {patient.medication || 'Aucune'}</p>
              </div>
              
              <div className="detail-section">
                <h4>État Dentaire</h4>
                <p><strong>Classe d'édentement:</strong> {patient.classe_edentement || 'Non spécifié'}</p>
                <p><strong>Étendue de l'édentement:</strong> {patient.etendue_edentement || 'Non spécifié'}</p>
                {patient.teethPresent && patient.teethPresent.length > 0 ? (
                  <div>
                    <strong>Dents Présentes:</strong>
                    <div className="teeth-present">
                      {patient.teethPresent.join(', ')}
                    </div>
                  </div>
                ) : (
                  <p><strong>Dents Présentes:</strong> Aucune sélectionnée</p>
                )}
              </div>
              
              {/* Prediction History Inside Patient Card */}
              <PredictionHistory patientId={patient.id} />
              <div className="patient-actions">

  <button 
    className="delete-btn"
    onClick={(e) => {
      e.stopPropagation();
      handleDeletePatient(patient.id);
    }}
  >
    Supprimer Patient
  </button>
</div>
              

              
              <p className="last-updated">
                Dernière mise à jour: {new Date(patient.lastUpdated?.toDate()).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}