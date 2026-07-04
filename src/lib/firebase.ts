import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "rorygpk",
  appId: "1:726082457423:web:97a374031172cfa5767f3a",
  apiKey: "AIzaSyCG8dw0Wc_TzZCGToUuk9K9qB92bLtBq3I",
  authDomain: "rorygpk.firebaseapp.com",
  storageBucket: "rorygpk.firebasestorage.app",
  messagingSenderId: "726082457423"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
