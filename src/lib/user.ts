import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

// ✅ SAVE USER TO FIRESTORE
export const saveUserToDB = async (user: any) => {
  await setDoc(doc(db, "users", user.id), user);
};

// ✅ GET ALL USERS
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      username: data.username || "",
      avatar: data.avatar || "",
    };
  });
};