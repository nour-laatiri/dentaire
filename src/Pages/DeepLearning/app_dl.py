from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.vgg16 import preprocess_input
import numpy as np
import cv2
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Load your model (do this once when the server starts)
model = load_model("dental_prosthesis_model_vgg16.h5")

# Configuration
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)  # Create directory if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_image(image_path):
    # Add file existence check before processing
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file {image_path} not found")
        
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image file {image_path}")
        
    img = cv2.resize(img, (224, 224))
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    class_names = ['Favorable', 'Moyennement Favorable', 'Non Favorable']
    class_idx = np.argmax(prediction)
    class_text = class_names[class_idx]
    confidence = float(prediction[0][class_idx])

    descriptions = {
        "Favorable": "Meilleure conception - Rétention et stabilité bien équilibrées.",
        "Moyennement Favorable": "Conception modérée - Assez stable mais pourrait être améliorée avec un soutien postérieur supplémentaire.",
        "Non Favorable": "Conception la moins favorable - Rétention et stabilité insuffisantes en raison d'un manque de soutien postérieur."
    }
    
    return {
        "prediction": class_text,
        "confidence": confidence,
        "description": descriptions[class_text]
    }

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            # Save file and verify it was saved
            file.save(filepath)
            if not os.path.exists(filepath):
                return jsonify({"error": "Failed to save uploaded file"}), 500
                
            result = predict_image(filepath)
            
            # Safely remove file if it exists
            if os.path.exists(filepath):
                os.remove(filepath)
            else:
                app.logger.warning(f"File {filepath} was already removed")
                
            return jsonify(result)
            
        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 404
        except ValueError as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            app.logger.error(f"Prediction error: {str(e)}")
            return jsonify({"error": "An error occurred during prediction"}), 500
    
    return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    # Create upload folder with exist_ok to prevent race conditions
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(port=5002, debug=True)