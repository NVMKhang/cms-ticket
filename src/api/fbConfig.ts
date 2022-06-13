// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC0qczUV5IZxtrsdh1rP0A79tklpGUtfqs",
  authDomain: "cms-ticket-aec48.firebaseapp.com",
  databaseURL: "https://cms-ticket-aec48-default-rtdb.firebaseio.com",
  projectId: "cms-ticket-aec48",
  storageBucket: "cms-ticket-aec48.appspot.com",
  messagingSenderId: "500197742285",
  appId: "1:500197742285:web:2a29dd53614a82fd5ebb84",
  measurementId: "G-J883B1Z2FL"
};

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

