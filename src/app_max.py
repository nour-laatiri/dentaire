from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with Flask

# Load model and encoders
model = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\prothese_model(max).pkl", "rb"))
sc = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\scaler(max).pkl", "rb"))
label_encoders = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\label_encoders(max).pkl", "rb"))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Prepare dictionary of input features
        input_dict = {
            'crête': data['crête'],
            'palais': data['palais'],
            "forme de l'arcade": data["forme de l'arcade"],
            'zone de Schroeder': data['zone de Schroeder'],
            'fibro-muqueuse': data['fibro-muqueuse'],
            'Frein labial': data['Frein labial'],
            'tuberosité': data['tuberosité'],
            "voile du palais": data["voile du palais"],
            "Classe d'édentement": data["Classe d'édentement"],
            " type de prothèse à envisager": data[" type de prothèse à envisager"]
        }

        print("Input Dict:", input_dict)

        # Apply label encoding for each feature using corresponding encoder
        features_encoded = []
        for col, value in input_dict.items():
            value = value.strip().lower() if value else "unknown"
            # Fix typo from frontend or DB

            # Replace empty or null with 'unknown'
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

        # Scale the input
        features_scaled = sc.transform([features_encoded])
        print("Scaled Features:", features_scaled)

        # Predict
        prediction = model.predict(features_scaled)
        prediction_label = int(prediction[0])
        print("Prediction:", prediction_label)

        # Map prediction to label
        label_map = {
            0: 'favorable',
            1: 'non favorable',
            2: 'moyennement favorable'
        }

        # Prepare response
        response = {
            "prediction": prediction_label, 
            "label": label_map[prediction_label]
        }

        # Add modification recommendations for non favorable cases
        if prediction_label == 1:  # non favorable
            modifications = []
            
            # Check for hypertrophic tuberosity
            if input_dict['tuberosité'].lower() == 'hypertrophiée':
                modifications.append("faire une chirurgie préprothétique tubérositaire")
            
            # Check for resorbed ridge
            if input_dict['crête'].lower() in['résorbée','resorbee',"résorbé"] :
                modifications.append("faire un approfondissement du vestibule")
            
            # Check for non-adherent or thick mucosa
            if input_dict['fibro-muqueuse'].lower() in ['non adhérente', 'épaisse', 'hypertrophiée','hypertrophiee' ,'epaisse']:
                modifications.append("faire un désépaississement muqueux")
            
            # Check for thin mucosa
            if input_dict['fibro-muqueuse'].lower() == 'fine':
                modifications.append("faire une empreinte anatomo-fonctionnelle avec un élastomère de faible viscosité")
            
            # Check for ogival or deep palate in PPAM context
            if (input_dict['palais'].lower() in ['ogival', 'très profond'] and 
                input_dict[' type de prothèse à envisager'].lower() == 'ppam'):
                modifications.append("faire une conception en fer à cheval")
            
            if modifications:
                response["modifications"] = modifications

        return jsonify(response)

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5001 ,debug=True)