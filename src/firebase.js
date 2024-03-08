// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfnpWMAvmlzzEhqKqYABFfkIW6j_4S_7Q",
  authDomain: "chit-chat-app-1bc34.firebaseapp.com",
  projectId: "chit-chat-app-1bc34",
  storageBucket: "chit-chat-app-1bc34.appspot.com",
  messagingSenderId: "202144905497",
  appId: "1:202144905497:web:7b753575f60b997a0d6d88",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
