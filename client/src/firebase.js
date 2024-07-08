// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8f4f3.firebaseapp.com",
  projectId: "mern-estate-8f4f3",
  storageBucket: "mern-estate-8f4f3.appspot.com",
  messagingSenderId: "485237776380",
  appId: "1:485237776380:web:d9265d9cba36f04acc5c79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);