import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiIWK015WR2qRQk4oW6-Kh5Ak-D93xIlQ",
  authDomain: "test-c3900.firebaseapp.com",
  projectId: "test-c3900",
  storageBucket: "test-c3900.firebasestorage.app",
  messagingSenderId: "882343698240",
  appId: "1:882343698240:web:af057d1dc3fb67bc6824a5",
  measurementId: "G-ED0N91M4SR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 