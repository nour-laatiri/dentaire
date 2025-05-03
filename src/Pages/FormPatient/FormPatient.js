import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../FormPatient/FormPatient.css";

export default function PatientFormPage() {
  const navigate = useNavigate();
   
  const handleSignOut = () => {
    // Clear the authentication flag
    localStorage.removeItem('isAuthenticated');  // <-- THIS IS THE CRUCIAL ADDITION
    
    // Replace the current entry in history stack with signin page
    navigate('/Signin', { replace: true });  // Changed from '/' to '/Signin' to match your routes
    
    // Optional: Clear any user data from state/context here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get all form data
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    
    // Get teeth presence data
    const teethPresent = [];
    document.querySelectorAll('.tooth-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
      teethPresent.push(checkbox.name);
    });
    
    // Navigate with all collected data
    navigate('/PatientInfoPage', {
      state: {
        patientInfo: {
          ...formValues,
          teethPresent
        }
      }
    });
  };

  return (
    <div className="dental-page">
      <header className="header">
        <Link to="/home" className="logo-text">PROTEQ</Link>
        <nav className="nav">
          <Link to="/home">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/service">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <button className="signout"onClick={handleSignOut}>
        Deconnexion

          </button>
      </header>

      <main className="form-page-container">
        <div className="form-page">
          <h2>Formulaire du Patient</h2>
          <form className="patient-form" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="form-section">
              <h3>Informations Personnelles</h3>
              <div className="form-row">
                <label>Nom:</label>
                <input type="text" name="nom" required />
              </div>
              <div className="form-row">
                <label>Prénom:</label>
                <input type="text" name="prenom" required />
              </div>
              <div className="form-row">
                <label>Âge:</label>
                <input type="number" name="age" min="1" max="120" required />
              </div>
              <div className="form-row">
                <label>Sexe:</label>
                <select name="sexe" required>
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="form-section">
              <h3>Informations Médicales</h3>
              <div className="form-row">
                <label>État Général:</label>
                <textarea name="etat_general" rows="3"></textarea>
              </div>
              <div className="form-row">
                <label>Médication en cours:</label>
                <textarea name="medication" rows="3"></textarea>
              </div>
            </div>

            {/* Dental State Section */}
            <div className="form-section">
              <h3>État Dentaire</h3>
              <div className="form-row">
                <label>Classe d'édentement:</label>
                <select name="classe_edentement">
                  <option value="">Sélectionner</option>
                  <option value="Classe I">Classe I</option>
                  <option value="Classe II">Classe II</option>
                  <option value="Classe III">Classe III</option>
                  <option value="Classe IV">Classe IV</option>
                </select>
              </div>
              <div className="form-row">
                <label>Étendue de l'édentement:</label>
                <input type="text" name="etendue_edentement" />
              </div>
            </div>

            {/* Teeth Presence Section */}
            {/* Teeth Presence Section */}
<div className="form-section teeth-section">
  <h3>Dents Présentes</h3>
  <div className="teeth-grid-simple">
    <div className="teeth-row">
      <div className="tooth-input-pair">
        <div className="tooth-input">
          <label>Quadrant 1</label>
          <input 
            type="text" 
            name="quadrant1" 
            placeholder="Ex: 1-1,1-2,1-3" 
          />
        </div>
        <div className="tooth-input">
          <label>Quadrant 2</label>
          <input 
            type="text" 
            name="quadrant2" 
            placeholder="Ex: 2-1,2-2,2-3" 
          />
        </div>
      </div>
    </div>
    <div className="teeth-row">
      <div className="tooth-input-pair">
        <div className="tooth-input">
          <label>Quadrant 3</label>
          <input 
            type="text" 
            name="quadrant3" 
            placeholder="Ex: 3-1,3-2,3-3" 
          />
        </div>
        <div className="tooth-input">
          <label>Quadrant 4</label>
          <input 
            type="text" 
            name="quadrant4" 
            placeholder="Ex: 4-1,4-2,4-3" 
          />
        </div>
      </div>
    </div>
  </div>
</div>

            <button type="submit" className="submit-btn">Soumettre</button>
          </form>
        </div>
      </main>
    </div>
  );
}