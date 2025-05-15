// src/firebase/firestore.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  addDoc // Add this import
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

export const PatientService = {
  // ================== PATIENT OPERATIONS ==================
  
  createPatient: async (patientData, userId) => {
    try {
      const docRef = doc(collection(db, "users", userId, "patients"));
      await setDoc(docRef, {
        ...patientData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw new Error("Failed to create patient record");
    }
  },

  getPatientsByUser: async (userId) => {
    try {
      const q = query(
        collection(db, "users", userId, "patients"),
        orderBy("lastUpdated", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error listing patients:", error);
      throw new Error("Failed to fetch patients list");
    }
  },

  getUserPatient: async (userId, patientId) => {
    try {
      const docSnap = await getDoc(doc(db, "users", userId, "patients", patientId));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw new Error("Failed to fetch patient data");
    }
  },

  updatePatient: async (userId, patientId, updates) => {
    try {
      await updateDoc(doc(db, "users", userId, "patients", patientId), {
        ...updates,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      throw new Error("Failed to update patient record");
    }
  },

  deletePatient: async (userId, patientId) => {
    try {
      // First delete all predictions for this patient
      const predictions = await PatientService.getPredictions(userId, patientId);
      const deletePredictionPromises = predictions.map(prediction => 
        PatientService.deletePrediction(userId, patientId, prediction.id)
      );
      await Promise.all(deletePredictionPromises);
      
      // Then delete the patient document
      await deleteDoc(doc(db, "users", userId, "patients", patientId));
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw new Error("Failed to delete patient record");
    }
  },

  // ================== PREDICTION OPERATIONS ==================
  
  savePrediction: async (userId, patientId, predictionData) => {
    try {
      const predictionRef = doc(collection(db, "users", userId, "patients", patientId, "predictions"));
      await setDoc(predictionRef, {
        ...predictionData,
        timestamp: serverTimestamp(),
        parameters: predictionData.formData || {},
        result: predictionData.result,
        modifications: predictionData.modifications || []
      });
      return predictionRef.id;
    } catch (error) {
      console.error("Error saving prediction:", error);
      throw new Error("Failed to save prediction");
    }
  },

  getPredictions: async (userId, patientId) => {
    try {
      const q = query(
        collection(db, "users", userId, "patients", patientId, "predictions"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching predictions:", error);
      throw new Error("Failed to fetch predictions");
    }
  },

  createPrediction: async (userId, patientId, predictionData) => {
    try {
      const predictionRef = await addDoc(
        collection(db, "users", userId, "patients", patientId, "predictions"),
        {
          ...predictionData,
          timestamp: serverTimestamp()
        }
      );
      return predictionRef.id;
    } catch (error) {
      console.error("Error creating prediction:", error);
      throw error;
    }
  },

  deletePrediction: async (userId, patientId, predictionId) => {
    try {
      await deleteDoc(doc(db, "users", userId, "patients", patientId, "predictions", predictionId));
    } catch (error) {
      console.error("Error deleting prediction:", error);
      throw new Error("Failed to delete prediction");
    }
  },

  updatePrediction: async (userId, patientId, predictionId, updatedData) => {
    try {
      await updateDoc(
        doc(db, "users", userId, "patients", patientId, "predictions", predictionId),
        {
          ...updatedData,
          lastUpdated: serverTimestamp()
        }
      );
    } catch (error) {
      console.error("Error updating prediction:", error);
      throw error;
    }
  },

  // ================== IMAGE OPERATIONS ==================
  uploadPatientImage: async (patientId, imageFile) => {
    try {
      const storageRef = ref(storage, `patients/${patientId}/profile_${Date.now()}`);
      await uploadBytes(storageRef, imageFile);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload patient image");
    }
  },

  deletePatientImage: async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Failed to delete patient image");
    }
  }
};