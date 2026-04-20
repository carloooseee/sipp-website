import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2gohJj3LHEv6fUaAug8fYt3SZ0bkT8dk",
  authDomain: "sipp-website-15009.firebaseapp.com",
  projectId: "sipp-website-15009",
  storageBucket: "sipp-website-15009.firebasestorage.app",
  messagingSenderId: "802942013295",
  appId: "1:802942013295:web:503c443160aae334d4a29a",
  measurementId: "G-ZB4YGB2CVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
