// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Exportar db para usar en otros archivos
export { db };
