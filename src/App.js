import React from "react";
 // Adjust path to your Firebase config file
import { BrowserRouter as Router, Routes, Route, Navigate ,Outlet } from "react-router-dom";
import Layout from "./components/Layout/layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Service from "./components/Service/Service";
import Signin from "./components/Signin/signin";
import Signup from "./components/Signup/Signup";
import FormPatient from "./Pages/FormPatient/FormPatient";
import PatientInfoPage from "./Pages/PatientInfoPage/PatientInfoPage";
import FormDePredictionMand from "./Pages/FormDePrediction/FormDePredictionMand/FormDePredictionMand";
import FormDePredictionMax from "./Pages/FormDePrediction/FormDePredictionMax/FormDePredictionMax";
import DeepLearning from "./Pages/DeepLearning/DeepLearning";
import { auth } from './components/firebase/firebase';
import ProfilPage from "./Pages/ProfilPage/ProfilPage";


import "./App.css";
const ProtectedRoute = () => {
   const isAuthenticated = localStorage.getItem('isAuthenticated') && auth.currentUser;
  
  if (!isAuthenticated) {
    return <Navigate to="/Signin" replace />;
  }
  
  return <Outlet />;
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
         <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

        {/* Protected routes with Layout (only accessible after login) */}
       
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/FormPatient" element={<FormPatient />} />
          <Route path="/PatientInfoPage" element={<PatientInfoPage />} />
          <Route path="/FormDePredictionMax" element={<FormDePredictionMax />} />
          <Route path="/FormDePredictionMand" element={<FormDePredictionMand />} />
          <Route path="/DeepLearning" element={<DeepLearning />} />
          <Route path="/ProfilPage" element={<ProfilPage />} />
        </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;