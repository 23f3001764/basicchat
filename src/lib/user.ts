import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

// ✅ USER TYPE (important for TypeScript)
export type User = {
  id: string;
  username: string;
  avatar: string;
  password: string;
};

// ==============================
// ✅ SIGNUP / CREATE USER
// ==============================
export const createUser = async (user: User) => {
  await setDoc(doc(db, "users", user.id), user);
};

// ✅ (Alias for old imports — fixes your Vercel error)
export const saveUserToDB = createUser;

// ==============================
// ✅ LOGIN
// ==============================
export const loginUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const data = snap.docs[0].data() as User;

  if (data.password !== password) return null;

  return data;
};

// ==============================
// ✅ GET ALL USERS
// ==============================
export const getAllUsers = async (): Promise<User[]> => {
  const snap = await getDocs(collection(db, "users"));

  return snap.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: data.id || docSnap.id,
      username: data.username || "",
      avatar: data.avatar || "",
      password: data.password || "",
    };
  });
};
