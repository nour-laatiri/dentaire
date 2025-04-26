import React from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Service from "./components/Service/Service";
import Signin from "./components/Signin/signin";
import Signup from "./components/Signup/Signup";
import FormPatient from "./Pages/FormPatient/FormPatient";
import PatientInfoPage from "./Pages/PatientInfoPage/PatientInfoPage";
import FormDePredictionMand from "./Pages/FormDePrediction/FormDePredictionMand/FormDePredictionMand";
import FormDePredictionMax from "./Pages/FormDePrediction/FormDePredictionMax/FormDePredictionMax";
import DeepLearning from "./Pages/DeepLearning/DeepLearning";
import "./App.css";
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated (you'll need to implement your actual auth check)
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Example using localStorage
  
  if (!isAuthenticated) {
    // If not authenticated, redirect to signin page
    return <Navigate to="/Signin" replace />;
  }
  
  // If authenticated, render the children (the protected page)
  return children;
};


function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        {/* Redirect root path to /Signin */}
        <Route path="/" element={<Navigate to="/Signin" replace />} />

        {/* Auth routes without Layout */}
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<Signup />} />

        {/* All protected routes wrapped in ProtectedRoute */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/FormPatient" element={<FormPatient />} />
          <Route path="/PatientInfoPage" element={<PatientInfoPage />} />
          <Route path="/FormDePredictionMax" element={<FormDePredictionMax />} />
          <Route path="/FormDePredictionMand" element={<FormDePredictionMand />} />
          <Route path="/DeepLearning" element={<DeepLearning />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;