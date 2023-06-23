// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCkw__woBoMj1FU2MS_hxsdZvo5hWLrnw",
  authDomain: import.meta.env.VITE_AD,
  projectId: 'schoolmanagementsystem-cb300',
  storageBucket: import.meta.env.VITE_SB,
  messagingSenderId: import.meta.env.VITE_MSI,
  appId: import.meta.env.VITE_AI,
  measurementId: import.meta.env.VITE_MI
};

// apiKey:,
// authDomain: ,
// projectId: import.meta.env.VITE_PI,
// storageBucket: ,
// messagingSenderId: ,
// appId: ,
// measurementId: 

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database  = getFirestore(app)
export const auth = getAuth(app)
// const analytics = getAnalytics(app);