import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
export const saveUserToDB = async (user: any) => {
  await setDoc(doc(db, "users", user.id), user);
};