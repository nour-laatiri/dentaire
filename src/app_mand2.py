from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS
import xgboost as xgb
import pandas as pd  # Added for DataFrame support

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with Flask

# Load model and preprocessing objects
model = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\prothese_model(mand(xgboost)).pkl", "rb"))
sc = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\scaler(mand(xgboost)).pkl", "rb"))
label_encoders = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\label_encoders(mand(xgboost)).pkl", "rb"))

# Define feature names in the correct order (should match training order)
FEATURE_NAMES = [
    "crête",
    "forme de l'arcade",
    "fibro-muqueuse",
    "Frein labial",
    "eminences",
    "Classe d'édentement",
    "type de prothèse à envisager",
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Prepare dictionary of input features
        input_dict = {
            'crête': data['crête'],
            "forme de l'arcade": data["forme de l'arcade"],
            'fibro-muqueuse': data['fibro-muqueuse'],
            'Frein labial': data['Frein labial'],
            'eminences': data['eminences'],
            "Classe d'édentement": data["Classe d'édentement"],
            "type de prothèse à envisager": data["type de prothèse à envisager"]
        }

        print("Input Dict:", input_dict)

        # Apply label encoding for each feature using corresponding encoder
        features_encoded = []
        for col in FEATURE_NAMES:  # Process features in consistent order
            value = input_dict[col]
            value = value.strip().lower() if value else "unknown"
            
            le = label_encoders.get(col)
            if le:
                try:
                    encoded_value = le.transform([value])[0]
                except ValueError:
                    if 'unknown' in le.classes_:
                        encoded_value = le.transform(['unknown'])[0]
                    else:
                        return jsonify({"error": f"Value '{value}' not seen during training and 'unknown' not in classes for '{col}'."}), 400
                features_encoded.append(encoded_value)
            else:
                features_encoded.append(value)

        print("Encoded Features:", features_encoded)

        # Create DataFrame with proper feature names and order
        features_df = pd.DataFrame([features_encoded], columns=FEATURE_NAMES)
        
        # Scale the input - now using DataFrame with feature names
        features_scaled = sc.transform(features_df)
        print("Scaled Features:", features_scaled)

        # Convert to DMatrix before prediction
        dmatrix = xgb.DMatrix(features_scaled)
        
        # Predict
        prediction = model.predict(dmatrix)
        prediction_label = int(prediction[0])
        print("Prediction:", prediction_label)

        # Map prediction to label
        label_map = {
            0: 'favorable',
            1: 'non favorable',
            2: 'moyennement favorable'
        }
        response = {
            "prediction": prediction_label, 
            "label": label_map[prediction_label]
        }

        # Add modification recommendations for non favorable cases
        if prediction_label == 1:  # non favorable
            modifications = []
            
            # Check for hypertrophic tuberosity
            
            # Check for resorbed ridge
            if input_dict['crête'].lower() in['résorbée','resorbee',"résorbé"] :
                modifications.append("faire un approfondissement du vestibule")
            
            # Check for non-adherent or thick mucosa
            if input_dict['fibro-muqueuse'].lower() in ['non adhérente', 'épaisse', 'hypertrophiée','hypertrophiee']:
                modifications.append("faire un désépaississement muqueux")
            
            # Check for thin mucosa
            if input_dict['fibro-muqueuse'].lower() == 'fine':
                modifications.append("faire une empreinte anatomo-fonctionnelle avec un élastomère de faible viscosité")
            
            if modifications:
                response["modifications"] = modifications

        return jsonify(response)

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5003, debug=True)