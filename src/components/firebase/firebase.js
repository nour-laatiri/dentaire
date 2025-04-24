// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOuR2WfQbTTwAEe4UmA4Z8PPZYBiGhuW8",
  authDomain: "reactjsauth-c46e8.firebaseapp.com",
  projectId: "reactjsauth-c46e8",
  storageBucket: "reactjsauth-c46e8.firebasestorage.app",
  messagingSenderId: "811514365554",
  appId: "1:811514365554:web:87610e2ecc35e42cffe4eb",
  measurementId: "G-GNKS48C08F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth};