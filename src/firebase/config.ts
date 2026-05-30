// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFzefsLrCqTjXdMeyq6HwyKLGSNA44p10",
  authDomain: "free-app-game-store.firebaseapp.com",
  projectId: "free-app-game-store",
  storageBucket: "free-app-game-store.firebasestorage.app",
  messagingSenderId: "902535763320",
  appId: "1:902535763320:web:83d381b603eb0411c1248d",
  measurementId: "G-VK65782XZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app