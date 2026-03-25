import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

// ✅ NEW FUNCTION (THIS WAS MISSING)
export const getUserDomains = async (userId: string) => {
  try {
    if (!userId) {
      console.log("❌ No userId");
      return [];
    }

    const ref = doc(db, "userPreferences", userId); // ✅ CORRECT
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.log("⚠️ No preferences found");
      return [];
    }

    const data = snap.data();
    console.log("✅ USER DOMAINS:", data.domains);

    return data.domains || [];
  } catch (error) {
    console.error("❌ Error fetching user domains:", error);
    return [];
  }
};

export const listenToNews = async (
  userId: string,
  callback: (news: any[]) => void
) => {
  let domains: string[] = [];

  if (userId) {
    domains = await getUserDomains(userId);
  }

  let q;

  if (domains.length > 0) {
    q = query(
      collection(db, "news"),
      where("category", "in", domains),
      orderBy("timestamp", "desc"),
      limit(20)
    );
  } else {
    q = query(
      collection(db, "news"),
      orderBy("timestamp", "desc"),
      limit(20)
    );
  }

  return onSnapshot(q, (snapshot) => {
    const news = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("🔥 NEWS:", news);

    callback(news);
  });
};