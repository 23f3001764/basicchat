// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqFOl_Xmj7t_9bf99R2dcJOtFHwGxCgno",
  authDomain: "basicchat-19d4a.firebaseapp.com",
  databaseURL: "https://basicchat-19d4a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "basicchat-19d4a",
  storageBucket: "basicchat-19d4a.firebasestorage.app",
  messagingSenderId: "999245871466",
  appId: "1:999245871466:web:9f0937b742df8f35b4cd13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);