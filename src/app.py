from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with Flask

# Load the model and encoders
model = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\gym_model.pkl", "rb"))
scaler = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\scaler.pkl", "rb"))
label_encoder = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\label_encoder.pkl", "rb"))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        
        
        # Preprocess the data
        features = [
            data['Weight (kg)'],
            data['Height (m)'],
            data['Max_BPM'],
            data['Avg_BPM'],
            data['Resting_BPM'],
            data['Session_Duration (hours)'],
            data['Calories_Burned'],
            data['Workout_Type'],
            data['Fat_Percentage'],
            data['Water_Intake (liters)'],
            data['Workout_Frequency (days/week)'],
            data['Experience_Level'],
        ]
        
        print("Features:", features)  # Check the features being passed to the model
        
        # Scaling
        features_scaled = scaler.transform([features])
        print("Scaled Features:", features_scaled)

        # Prediction
        prediction = model.predict(features_scaled)
        print("Prediction:", prediction)

        prediction_int = int(prediction[0])

        return jsonify({"prediction": prediction_int})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
