from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with Flask

# Load model and encoders
model = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\prothese_model(mand).pkl", "rb"))
sc = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\scaler(mand).pkl", "rb"))
label_encoders = pickle.load(open(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\label_encoders(mand).pkl", "rb"))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Prepare dictionary of input features
        input_dict = {
            'crete': data['crete'],
            "forme de l'arcade": data["forme de l'arcade"],
            'fibre muqueux': data['fibre muqueux'],
            'Frein labial': data['Frein labial'],
            'eminences':data['eminences'],
            'classe de kennedy': data['classe de kennedy'],
            'pp': data['pp']
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

        return jsonify({"prediction": prediction_label, "label": label_map[prediction_label]})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000)
