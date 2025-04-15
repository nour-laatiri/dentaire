import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Service from "./components/Service/Service";
import FormPatient from "./Pages/FormPatient/FormPatient";
import FormDePrediction from "./Pages/FormDePrediction/FormDePrediction";
import Footer from "./components/Footer/Footer";
import PatientInfoPage  from "./Pages/PatientInfoPage/PatientInfoPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="dental-page">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/FormPatient" element={<FormPatient />} />
          <Route path="/FormDePrediction" element={<FormDePrediction />} />
          <Route path="/PatientInfoPage" element={<PatientInfoPage />} />
          
          
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;