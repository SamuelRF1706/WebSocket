// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6c7n_MwKINV5w7ip2Az9kyAyVAR8EAsE",
  authDomain: "asambela-a174f.firebaseapp.com",
  projectId: "asambela-a174f",
  storageBucket: "asambela-a174f.firebasestorage.app",
  messagingSenderId: "516723410236",
  appId: "1:516723410236:web:adcf82a35dc3d41d3a8a39",
  measurementId: "G-JGL2HL0WRS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // <-- necesario para leer datos
const analytics = getAnalytics(app);

export{db};