
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-_dYyW4tFiV5fbhzxJas4hvLQAQpQis8",
  authDomain: "studentsteach-357e6.firebaseapp.com",
  projectId: "studentsteach-357e6",
  storageBucket: "studentsteach-357e6.appspot.com",
  messagingSenderId: "861278059935",
  appId: "1:861278059935:web:d4f9061ee014d908a491aa",
  measurementId: "G-RRBH66W2S3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
const analytics = getAnalytics(app);
export const db=getFirestore()
export const storage = getStorage();