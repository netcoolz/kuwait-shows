


import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ مهم


const firebaseConfig = {
  apiKey: "AIzaSyA24Xl8envI8pT8ioiTJZERps8sVz4knIk",
  authDomain: "kuwaitshows-a82e1.firebaseapp.com",
  projectId: "kuwaitshows-a82e1",
  storageBucket: "kuwaitshows-a82e1.firebasestorage.app",
  messagingSenderId: "587975812328",
  appId: "1:587975812328:web:b44b9dbd7a2bad39c0d55d",
  measurementId: "G-6D2FZQ4WDD"
};

// حل مشكلة التكرار
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// ✅ التصدير الصحيح
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // 🔥 هذا هو الحل