import { db } from '../config/firebase';

const MEALS_COLLECTION = 'meals';

export const logMeal = async (uid: string, mealData: any) => {
  const mealRef = await db.collection(MEALS_COLLECTION).add({
    ...mealData,
    userId: uid,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  });
  
  const doc = await mealRef.get();
  return { id: doc.id, ...doc.data() };
};

export const getMealHistory = async (uid: string, limitCount = 20, lastVisibleId?: string) => {
  // We remove orderBy('timestamp') from the query to avoid Firebase Composite Index requirement crashes
  let query = db.collection(MEALS_COLLECTION)
    .where('userId', '==', uid);

  const snapshot = await query.get();
  let meals: any[] = [];
  snapshot.forEach((doc: any) => {
    meals.push({ id: doc.id, ...doc.data() });
  });

  // Sort in memory by timestamp descending
  meals.sort((a, b) => {
    const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
    const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Basic in-memory pagination
  if (lastVisibleId) {
    const idx = meals.findIndex(m => m.id === lastVisibleId);
    if (idx !== -1) {
      meals = meals.slice(idx + 1);
    }
  }

  return meals.slice(0, limitCount);
};
