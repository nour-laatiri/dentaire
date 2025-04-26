// src/contexts/authContext.js
import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../components/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  async function logout() {
    try {
      await signOut(auth);
      return true; // Indicates successful logout
    } catch (error) {
      console.error("Error signing out: ", error);
      return false; // Indicates failed logout
    }
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    logout  // Add logout function to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}