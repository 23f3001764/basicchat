import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

// ✅ SEND MESSAGE
export const sendMessage = async (msg: any) => {
  await addDoc(collection(db, "messages"), {
    ...msg,
    status: "sent",
    timestamp: Date.now(),
  });
};

// ✅ REALTIME LISTENER
export const subscribeToMessages = (
  currentUserId: string,
  otherUserId: string,
  callback: (msgs: any[]) => void
) => {
  const q = query(collection(db, "messages"), orderBy("timestamp"));

  return onSnapshot(q, (snapshot) => {
    const msgs: any[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // ✅ FILTER ONLY BETWEEN 2 USERS
      if (
        (data.senderId === currentUserId &&
          data.receiverId === otherUserId) ||
        (data.senderId === otherUserId &&
          data.receiverId === currentUserId)
      ) {
        msgs.push({
          id: docSnap.id,
          ...data,
        });

        // ✅ AUTO MARK AS SEEN
        if (
          data.receiverId === currentUserId &&
          data.status !== "seen"
        ) {
          updateDoc(doc(db, "messages", docSnap.id), {
            status: "seen",
          });
        }
      }
    });

    callback(msgs);
  });
};