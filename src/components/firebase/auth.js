// src/components/firebase/auth.js
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification, 
    updatePassword 
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
    const result = await signInWithPopup(auth, provider);
    return result;
  };
  
  export const doSignOut = () => {
    return auth.signOut();
  };
  
  export const doPasswordReset = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
  };
  
  export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  };