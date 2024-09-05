// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxPY1TD3IBet_QTS3RGZa7bQ5qqIZ8_p0",
  authDomain: "react-chat-7be33.firebaseapp.com",
  projectId: "react-chat-7be33",
  storageBucket: "react-chat-7be33.appspot.com",
  messagingSenderId: "835636406609",
  appId: "1:835636406609:web:77d953756eabe8b79a0b70",
  measurementId: "G-0X0XNKVYJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

