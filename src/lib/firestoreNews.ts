import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

const NEWS_COLLECTION = "news";
const AI_COLLECTION = "aiInsights";

const TTL = 36 * 60 * 60 * 1000;

export const getStoredNews = async () => {
  const snap = await getDocs(collection(db, NEWS_COLLECTION));

  const now = Date.now();

  let valid: any[] = [];
  let expiredDocs: any[] = [];

  snap.forEach((d) => {
    const data = d.data();

    if (now - data.fetchedAt > TTL) {
      expiredDocs.push(d.id);
    } else {
      valid.push({ id: d.id, ...data });
    }
  });

  // ============================
  // 🔥 DELETE EXPIRED NEWS + AI
  // ============================
  for (const newsId of expiredDocs) {
    // ❌ Delete news
    await deleteDoc(doc(db, NEWS_COLLECTION, newsId));

    // 🔥 Find related AI insights
    const aiQuery = query(
      collection(db, AI_COLLECTION),
      where("articleId", "==", newsId)
    );

    const aiSnap = await getDocs(aiQuery);

    for (const aiDoc of aiSnap.docs) {
      await deleteDoc(doc(db, AI_COLLECTION, aiDoc.id));
    }
  }

  return valid;
};
// ============================
// SAVE NEWS
// ============================
export const saveNews = async (articles: any[]) => {
  for (const a of articles) {
    await addDoc(collection(db, NEWS_COLLECTION), {
      title: a.title,
      description: a.description,
      fetchedAt: Date.now(),
    });
  }
};

// ============================
// GET AI CACHE
// ============================
export const getAIInsight = async (articleId: string) => {
  const q = query(
    collection(db, AI_COLLECTION),
    where("articleId", "==", articleId)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0].data();
  }

  return null;
};

// ============================
// SAVE AI RESULT
// ============================
export const saveAIInsight = async (data: any) => {
  await addDoc(collection(db, AI_COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
};