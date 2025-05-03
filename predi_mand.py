import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df=pd.read_csv(r"C:\Users\clien\Desktop\nour1.1\react-prediction-form\mandibule(ihope).csv")

df.head()




df.columns

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

from sklearn.preprocessing import LabelEncoder
categorical_columns = X.select_dtypes(include=['object']).columns
label_encoders = {}


X[categorical_columns] = X[categorical_columns].fillna("unknown").replace('', "unknown")

# Make sure 'unknown' is in label encoder
for col in categorical_columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

zero_not_accepted=["crête", "forme de l'arcade", "fibro-muqueuse", "Frein labial","eminences", "Classe d'édentement", "type de prothèse à envisager"]
for column in zero_not_accepted:
    X[column] = X[column].replace(0, np.nan)
    mean= int(X[column].mean(skipna=True))
    X[column] = X[column].replace(np.nan, mean)



X.head()

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)



print(y.value_counts(normalize=True))  # See class proportions


import xgboost as xgb



# Create XGBoost DMatrix (optimized data structure for XGBoost)
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Set XGBoost parameters
params = {
    'objective': 'multi:softmax',  # Changed to multi:softmax for multi-class classification
    'num_class': 3,              # Specify the number of classes
    'eval_metric': 'mlogloss',     # Use mlogloss for multi-class
    'eta': 0.1,                     # learning rate
    'max_depth': 20,                 # maximum depth of a tree
    'subsample': 0.8,               # percentage of samples used per tree
    'colsample_bytree': 0.8,        # percentage of features used per tree
    'seed': 42                      #
}

# Train the model
num_rounds = 90



# number of boosting rounds
model = xgb.train(params, dtrain, num_rounds)
#mandibule 40 with 84%
#maxillaire 37 64%
# Make predictions
y_pred_prob = model.predict(dtest)
y_pred = y_pred_prob.astype(int) # Convert predictions to integer class labels

from sklearn.metrics import accuracy_score
# Convert X_test to DMatrix before prediction
dtest_pred = xgb.DMatrix(X_test)
y_pred = model.predict(dtest_pred)  # Use DMatrix for prediction
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ XGBOOST Accuracy: {accuracy:.2f}")

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Get feature importances using get_score()
importances = model.get_score(importance_type='gain')  # Or other importance types like 'weight', 'cover'

# If you want a DataFrame:
importance_df = pd.DataFrame(list(importances.items()), columns=['Feature', 'Importance'])
importance_df = importance_df.sort_values(by='Importance', ascending=False)
# Rest of your plotting code
plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=importance_df)
plt.title('Feature Importances from XGBoost') # Corrected the title
plt.xlabel('Importance Score')
plt.ylabel('Feature')
plt.tight_layout()
plt.show()

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
pickle.dump(model, open('prothese_model(mand(xgboost)).pkl', 'wb'))
pickle.dump(sc, open('scaler(mand(xgboost)).pkl', 'wb'))
pickle.dump(label_encoders, open('label_encoders(mand(xgboost)).pkl', 'wb'))
