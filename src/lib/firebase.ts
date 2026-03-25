// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDocs, query, where } from "firebase/firestore";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);




// 🔥 NEW: News Collection Reference
export const newsCollection = collection(db, "news");

// 🔥 Helper: Add News
export const addNews = async (news: {
  title: string;
  description: string;
  source: string;
  category: string;
}) => {
  // 🔥 Check duplicate by title
  const q = query(newsCollection, where("title", "==", news.title));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) return;

  await addDoc(newsCollection, {
    ...news,
    timestamp: serverTimestamp(),
  });
};