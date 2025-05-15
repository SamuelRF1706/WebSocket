// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);