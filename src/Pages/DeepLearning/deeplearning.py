import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.models import Model
import numpy as np
import cv2
import os
from sklearn.model_selection import train_test_split

# Load and preprocess images
def load_images_from_folder(folder):
    images = []
    labels = []
    class_names = {'favorable': 0, 'moderate': 1, 'not_favorable': 2}  # Class mapping

    for class_name, label in class_names.items():
        class_folder = os.path.join(folder, class_name)
        if not os.path.exists(class_folder):
            continue
        for filename in os.listdir(class_folder):
            img_path = os.path.join(class_folder, filename)
            img = cv2.imread(img_path)
            if img is not None:
                img = cv2.resize(img, (224, 224))  # Required size for VGG16
                images.append(img)
                labels.append(label)
    return np.array(images), np.array(labels)

# Load dataset
images, labels = load_images_from_folder(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\src\Pages\DeepLearning")
print(f"Total images loaded: {images.shape}")
print(f"Total labels loaded: {labels.shape}")

images = preprocess_input(images)  # VGG16 preprocessing

# Split into training and testing data
X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.2, random_state=42)

# Load VGG16 base model without top
vgg_base = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
vgg_base.trainable = False  # Freeze the base

# Add custom layers on top
model = keras.Sequential([
    vgg_base,
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(3, activation='softmax')  # 3 classes
])

# Compile model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train model
model.fit(X_train, y_train, epochs=12, validation_data=(X_test, y_test))

# Save model
model.save("dental_prosthesis_model_vgg16.h5")

# Prediction function
def predict_prosthesis(image_path, model_path="dental_prosthesis_model_vgg16.h5"):
    model = keras.models.load_model(model_path)
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    class_names = ['Favorable', 'Moderate', 'Not Favorable']
    class_text = class_names[np.argmax(prediction)]
    confidence = np.max(prediction) * 100  # Confidence percentage

    descriptions = {
        "Favorable": "Best Design – Well-balanced retention and stability.",
        "Moderate": "Moderate Design – Somewhat stable but could be improved with additional posterior support.",
        "Not Favorable": "Least Favorable Design – Insufficient retention and stability due to lack of posterior support."
    }
    return f"Prediction: {class_text} ({confidence:.2f}% confidence)\nDescription: {descriptions[class_text]}"

# Function to manually test an image
def test_image_manually():
    image_path = r"C:\Users\clien\Desktop\nour1.1\dl\img14.png"
    if not os.path.exists(image_path):
        print(f"Error: File not found at '{image_path}'")
        return
        
    try:
        result = predict_prosthesis(image_path)
        print("\n" + "="*50)
        print(result)
        print("="*50 + "\n")
    except Exception as e:
        print(f"Error processing image: {e}")

# Example usage
if __name__ == "__main__":
    print("Dental Prosthesis Classification Model")
    print("You can now test images manually.")
    test_image_manually()