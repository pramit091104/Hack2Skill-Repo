import { db } from '../config/firebase';

const MEALS_COLLECTION = 'meals';

export const logMeal = async (uid: string, mealData: any) => {
  const mealRef = await db.collection(MEALS_COLLECTION).add({
    ...mealData,
    userId: uid,
    createdAt: new Date().toISOString()
  });
  
  const doc = await mealRef.get();
  return { id: doc.id, ...doc.data() };
};

export const getMealHistory = async (uid: string, limit = 20, lastVisibleId?: string) => {
  let query = db.collection(MEALS_COLLECTION)
    .where('userId', '==', uid)
    .orderBy('timestamp', 'desc')
    .limit(limit);

  if (lastVisibleId) {
    const lastDoc = await db.collection(MEALS_COLLECTION).doc(lastVisibleId).get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  const snapshot = await query.get();
  const meals: any[] = [];
  snapshot.forEach((doc: any) => {
    meals.push({ id: doc.id, ...doc.data() });
  });

  return meals;
};
