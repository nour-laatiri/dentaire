// src/components/firebase/auth.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification, 
  updatePassword,
  deleteUser, // ADDED: Import deleteUser function for account deletion
  signOut // ADDED: Proper signOut import (was using auth.signOut directly before)
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInUserWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // ADDED: These parameters force Google to show account selection every time
  provider.setCustomParameters({
    prompt: 'select_account',
    login_hint: ''
  });
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error; // ADDED: Better error handling
  }
};

export const doSignOut = () => {
  return signOut(auth); // CHANGED: Using imported signOut instead of auth.signOut
};

// ADDED: New function for complete account deletion
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await deleteUser(user);
      await doSignOut(); // Sign out after deletion
    }
  } catch (error) {
    console.error("Account Deletion Error:", error);
    throw error;
  }
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user"); // ADDED: Safety check
  }
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user"); // ADDED: Safety check
  }
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};

// ADDED: Optional function to clear all auth state
export const clearAuthState = async () => {
  await doSignOut();
  if (window.localStorage) localStorage.clear();
  if (window.sessionStorage) sessionStorage.clear();
};