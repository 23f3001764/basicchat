import { db } from "./firebase";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

// SIGNUP
export const createUser = async (user: any) => {
  await setDoc(doc(db, "users", user.id), user); // ✅ use ID not username
};
// LOGIN
export const loginUser = async (username: string, password: string) => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const user = snap.docs[0].data();

  if (user.password !== password) return null;

  return user;
};

// GET USERS
export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));

  return snap.docs.map(doc => doc.data()); // now includes id
};