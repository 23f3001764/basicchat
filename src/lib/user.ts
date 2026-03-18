import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// ✅ GET ALL USERS FROM FIRESTORE
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