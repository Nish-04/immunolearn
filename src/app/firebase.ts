import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZPzz6nIjCnWu_idtSMuk43ffkftiufkc",
  authDomain: "immunolearn-5bafd.firebaseapp.com",
  projectId: "immunolearn-5bafd",
  storageBucket: "immunolearn-5bafd.firebasestorage.app",
  messagingSenderId: "788419682002",
  appId: "1:788419682002:web:b044ca6da397d9938a170b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);