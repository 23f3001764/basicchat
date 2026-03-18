import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";

// 📤 SEND MESSAGE
export const sendMessage = async (msg: any) => {
  await addDoc(collection(db, "messages"), msg);
};

// 🔁 LISTEN MESSAGES (REALTIME)
export const listenMessages = (
  userId: string,
  otherId: string,
  callback: any
) => {
  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains", userId),
    orderBy("timestamp")
  );

  return onSnapshot(q, (snapshot) => {
    const allMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    const filtered = allMessages.filter(
      (m: any) =>
        (m.senderId === userId && m.receiverId === otherId) ||
        (m.senderId === otherId && m.receiverId === userId)
    );

    callback(filtered);
  });
};

// ✅ UPDATE MESSAGE STATUS
export const updateMessageStatus = async (id: string, status: string) => {
  const ref = doc(db, "messages", id);
  await updateDoc(ref, { status });
};