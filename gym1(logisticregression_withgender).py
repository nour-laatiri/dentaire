import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

# Load dataset
gym = pd.read_csv('gym_members_exercise_tracking.csv')

y = gym['Gender'].map({'Male': 0, 'Female': 1})
x = gym.drop(['Gender', 'Age', 'BMI'], axis=1)

# Encode categorical feature
label_encoder = LabelEncoder()
x['Workout_Type'] = label_encoder.fit_transform(x['Workout_Type'])

# Split dataset
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=42)

# Standardize features
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

# Train model
model = LogisticRegression()
model.fit(x_train, y_train)

# Save model, scaler, and label encoder
pickle.dump(model, open('gym_model.pkl', 'wb'))
pickle.dump(scaler, open('scaler.pkl', 'wb'))
pickle.dump(label_encoder, open('label_encoder.pkl', 'wb'))
