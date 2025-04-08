import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df=pd.read_csv(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\cleaned_max (91cas) - cleaned_max (2) (2)(67%).csv")

df.head()

df.columns

df = df.drop(['eminences','hygiene'], axis=1)
print(df.columns)


df.head()

valid_targets = ['favorable', 'non favorable', 'moyennement favorable']
df = df[df['facteur du osteo-muqueux'].isin(valid_targets)]
df = df.dropna(subset=['facteur du osteo-muqueux'])

import matplotlib.pyplot as plt
# 4️⃣ Plot Class Distribution
class_counts = df['facteur du osteo-muqueux'].value_counts()
class_counts.plot(kind='bar', color=['#66c2a5', '#fc8d62', '#8da0cb'])
plt.title("Distribution des classes (facteur du osteo-muqueux)")
plt.ylabel("Nombre de cas")
plt.xlabel("Classe")
plt.grid(axis='y')
plt.xticks(rotation=15)
plt.tight_layout()
plt.show()

y = df['facteur du osteo-muqueux'].map({
    'favorable': 0,
    'non favorable': 1,
    'moyennement favorable': 2
})
X = df.drop(['facteur du osteo-muqueux'], axis=1)


# Identify categorical columns
from sklearn.preprocessing import LabelEncoder

# Identify categorical columns
categorical_columns = X.select_dtypes(include=['object']).columns
label_encoders = {}


X[categorical_columns] = X[categorical_columns].fillna("unknown").replace('', "unknown")

# Make sure 'unknown' is in label encoder
for col in categorical_columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le


X.head()

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

print(y.value_counts(normalize=True))  # See class proportions


# 9️⃣ Train Random Forest with class balancing
from sklearn.ensemble import RandomForestClassifier
rf_model = RandomForestClassifier(n_estimators=12, random_state=0, class_weight='balanced')
rf_model.fit(X_train, y_train)

from sklearn.metrics import accuracy_score
y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Random Forest Accuracy with Class Balancing: {accuracy:.2f}")

import pandas as pd
import matplotlib.pyplot as plt


# Check class distribution
print(df['facteur du osteo-muqueux'].value_counts())

# Optional: Also show percentages
print("\n✅ Class distribution (in %):")
print(df['facteur du osteo-muqueux'].value_counts(normalize=True) * 100)


from sklearn.metrics import confusion_matrix
cm=confusion_matrix(y_test,y_pred)
print(cm)

from sklearn.metrics import classification_report
print(classification_report(y_test,y_pred))



import numpy as np
cm = confusion_matrix(y_test, y_pred)
print(cm)

# Function to calculate metrics for a given class
def calculate_metrics_for_class(cm, target_class):
    tp = cm[target_class, target_class]
    fp = np.sum(cm[:, target_class]) - tp  # Corrected: predicted as this class but not actually
    fn = np.sum(cm[target_class, :]) - tp  # Corrected: actually this class but predicted as others
    tn = np.sum(cm) - (tp + fp + fn)
    return tp, fp, fn, tn


# Calculate metrics for each class
for class_label in range(3):  # Iterate through classes 0, 1, 2
    tp, fp, fn, tn = calculate_metrics_for_class(cm, class_label)
    print(f"\nMetrics for class {class_label}:")
    print(f"True Positives (TP): {tp}")
    print(f"True Negatives (TN): {tn}")
    print(f"False Positives (FP): {fp}")
    print(f"False Negatives (FN): {fn}")

# Save model, scaler, and label encoder
pickle.dump(rf_model, open('prothese_model.pkl', 'wb'))
pickle.dump(sc, open('scaler.pkl', 'wb'))
pickle.dump(label_encoders, open('label_encoders.pkl', 'wb'))
