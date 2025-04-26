import React from "react";
import { useNavigate } from "react-router-dom";
import "./Service.css";

export default function Service() {
  const navigate = useNavigate();
  
  const services = [
    {
      title: "Prédiction d'Équilibre - Mandibulaire",
      description: "Prédiction précise de l'équilibre occlusal pour les prothèses partielles amovibles mandibulaires grâce à nos algorithmes avancés.",
      icon: "🦷",
      color: "#3a7bd5",
      predictionMethods: [
        {
          name: "Par Informations Cliniques et Par Analyse d'Images",
          type: "mandibulaire-ml",
          description: "Analyse des données cliniques du patient pour prédire l'équilibre et par Traitement d'images intra-orales par réseaux neuronaux profonds"
        },
      ]
    },
    {
      title: "Prédiction d'Équilibre - Maxillaire",
      description: "Évaluation prédictive de la stabilité des PPA maxillaires basée sur des modèles intelligents.",
      icon: "✨",
      color: "#00d2ff",
      predictionMethods: [
        {
          name: "Par Informations Cliniques et Par Analyse d'Images",
          type: "maxillaire-ml",
          description: "Utilisation des paramètres anatomiques et fonctionnels et par Reconnaissance d'images 3D des arcades dentaires"
        },
      ]
    },
  ];

  const handlePredictionClick = (type) => {
    navigate('/formPatient', { state: { predictionType: type } });
  };

  return (
    <div className="service-container">
      <div className="service-header">
        <h1>Prédiction d'Équilibre des Prothèses Amovibles</h1>
        <p className="subtitle">
          Deux approches innovantes: Analyse par données cliniques (Machine Learning) ou par imagerie dentaire (Deep Learning)
        </p>
        <div className="dental-illustration">
          <div className="tooth-icon">🦷</div>
          <div className="force-arrows">⇄</div>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="service-card"
            style={{ "--accent-color": service.color }}
          >
            <div className="card-header">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
            </div>
            <p>{service.description}</p>
            
            {service.predictionMethods && (
              <div className="prediction-methods">
                {service.predictionMethods.map((method, i) => (
                  <div key={i} className="method-card">
                    <h4>{method.name}</h4>
                    <p className="method-description">{method.description}</p>
                    <button
                      className="prediction-btn ml-btn"
                      onClick={() => handlePredictionClick(method.type)}
                    >
                      Commencer l'analyse
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="wave-decoration"></div>
          </div>
        ))}
      </div>
    </div>
  );
}