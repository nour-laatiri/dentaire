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
    layers.Dropout(0.6),
    layers.Dense(3, activation='softmax')  # 3 classes
])
# After 5 epochs of training, unfreeze some layers

# Compile model

optimizer = tf.keras.optimizers.Adam(learning_rate=0.00001)  # Changed learning rate
model.compile(optimizer=optimizer, 
              loss='sparse_categorical_crossentropy', 
              metrics=['accuracy'])

datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rotation_range=30,
    horizontal_flip=True,
    zoom_range=0.2
)
model.fit(datagen.flow(X_train, y_train), epochs=20, validation_data=(X_test, y_test))
# Train model

# Stop training when validation loss plateaus

# Save model
model.save("dental_prosthesis_model_vgg16.keras")

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
        "Favorable" : "Meilleur design – Bon équilibre entre rétention et stabilité.",  
        "Moyennement favorable" : "Design modéré – Assez stable mais pourrait être amélioré avec un support postérieur supplémentaire.",  
        "Non favorable" : "Design le moins favorable – Rétention et stabilité insuffisantes en raison d'un manque de support postérieur."  
    }
    return f"Prediction: {class_text} ({confidence:.2f}% confidence)\nDescription: {descriptions[class_text]}"



# Example usage
if __name__ == "__main__":
    print("Dental Prosthesis Classification Model")