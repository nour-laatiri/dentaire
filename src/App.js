import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function ProthesePrediction() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      setPrediction(response.data.label);
    } catch (error) {
      console.error("Prediction error:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Facteur Ostéo-Muqueux Prediction</h1>
      <p className="description">Remplissez les informations pour prédire le facteur.</p>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key, index) =>
          index % 2 === 0 ? (
            <div className="form-group" key={key}>
              <div className="feature-input">
                <label>{key}</label>
                <input
                  type="text"
                  name={key}
                  placeholder={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              {Object.keys(formData)[index + 1] && (
                <div className="feature-input">
                  <label>{Object.keys(formData)[index + 1]}</label>
                  <input
                    type="text"
                    name={Object.keys(formData)[index + 1]}
                    placeholder={Object.keys(formData)[index + 1]}
                    value={formData[Object.keys(formData)[index + 1]]}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              )}
            </div>
          ) : null
        )}
        <button type="submit" className="button">Predict</button>
      </form>
      {prediction && (
        <div className="prediction">
          Résultat: <strong>{prediction}</strong>
        </div>
      )}
    </div>
  );
}
