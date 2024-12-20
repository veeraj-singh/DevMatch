// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOVBB-qDc6FEtUFEm4GW74UZjlFOQLCsQ",
  authDomain: "devmatch-auth.firebaseapp.com",
  projectId: "devmatch-auth",
  storageBucket: "devmatch-auth.firebasestorage.app",
  messagingSenderId: "50820592301",
  appId: "1:50820592301:web:93e6a3a3d24c64d03d0c24",
  measurementId: "G-WQ0NN4Y64H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
