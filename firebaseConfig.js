import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Replace these placeholder values with your actual Firebase project config
// Get these from Firebase Console > Project Settings > General > Your apps > Web app
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHNRvZNe1bQ5HyL3R_Lq4Qm-g2nDzjbzY",
  authDomain: "myfirebasepower.firebaseapp.com",
  projectId: "myfirebasepower",
  storageBucket: "myfirebasepower.firebasestorage.app",
  messagingSenderId: "601774840227",
  appId: "1:601774840227:web:ac95820f54073914bb2216"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // For development, you can set db and auth to null and handle in components
  db = null;
  auth = null;
}

export { db, auth };
