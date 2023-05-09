// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-S1ogWuD8AUGATV3gNK3OuKXsP0vPrcI",
  authDomain: "chat-6444e.firebaseapp.com",
  projectId: "chat-6444e",
  storageBucket: "chat-6444e.appspot.com",
  messagingSenderId: "1089269385288",
  appId: "1:1089269385288:web:316f86ee6dba129690707d",
  measurementId: "G-74Y30EMLD7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//inicializamos la base de datos
export const db = getFirestore(app);
