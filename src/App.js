import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function GymPrediction() {
  const [formData, setFormData] = useState({
    "Weight (kg)": "",
    "Height (m)": "",
    Max_BPM: "",
    Avg_BPM: "",
    Resting_BPM: "",
    "Session_Duration (hours)": "",
    Calories_Burned: "",
    Workout_Type: "",
    Fat_Percentage: "",
    "Water_Intake (liters)": "",
    "Workout_Frequency (days/week)": "",
    Experience_Level: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedData = { ...formData };
    Object.keys(processedData).forEach((key) => {
      if (!isNaN(processedData[key]) && processedData[key] !== "") {
        processedData[key] = parseFloat(processedData[key]);
      }
    });

    try {
      let response;
      if (selectedImage) {
        const imageData = new FormData();
        imageData.append("image", selectedImage);

        response = await axios.post("http://localhost:5000/predict-image", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("http://localhost:5000/predict", processedData);
      }

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error predicting:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Gym Member Prediction</h1>
      <p className="description">Enter details or upload an image for prediction.</p>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key, index) => (
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
        ))}

        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        </div>

        <button type="submit" className="button">Predict</button>
      </form>
      {prediction && <div className="prediction">Prediction: {prediction}</div>}
    </div>
  );
}