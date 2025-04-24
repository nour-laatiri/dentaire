import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Service from "./components/Service/Service";
import Signin from "./components/Signin/signin";
import Signup from "./components/Signup/Signup";
import FormPatient from "./Pages/FormPatient/FormPatient";
import Footer from "./components/Footer/Footer";
import PatientInfoPage from "./Pages/PatientInfoPage/PatientInfoPage";
import FormDePredictionMand from "./Pages/FormDePrediction/FormDePredictionMand/FormDePredictionMand";
import FormDePredictionMax from "./Pages/FormDePrediction/FormDePredictionMax/FormDePredictionMax";
import DeepLearning from "./Pages/DeepLearning/DeepLearning";
import "./App.css";


function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="dental-page">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Signup" element={<Signup/>}/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/FormPatient" element={<FormPatient />} />
          <Route path="/PatientInfoPage" element={<PatientInfoPage />} />
          <Route path="/FormDePredictionMax" element={<FormDePredictionMax />} />
          <Route path="/FormDePredictionMand" element={<FormDePredictionMand />} />
          <Route path="/DeepLearning" element={<DeepLearning />} />
          
          
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;