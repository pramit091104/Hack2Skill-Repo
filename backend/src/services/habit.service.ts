import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

const HABITS_COLLECTION = 'habits';

export const createHabit = async (uid: string, data: any) => {
  const habitRef = await db.collection(HABITS_COLLECTION).add({
    ...data,
    userId: uid,
    active: true,
    completedDates: [],
    streak: 0,
    createdAt: new Date().toISOString()
  });
  const doc = await habitRef.get();
  return { id: doc.id, ...doc.data() };
};

export const getHabits = async (uid: string) => {
  const snapshot = await db.collection(HABITS_COLLECTION)
    .where('userId', '==', uid)
    .where('active', '==', true)
    .get();
    
  const habits: any[] = [];
  snapshot.forEach((doc: any) => {
    habits.push({ id: doc.id, ...doc.data() });
  });
  return habits;
};

export const toggleHabitCompletion = async (uid: string, habitId: string, dateStr: string) => {
  const ref = db.collection(HABITS_COLLECTION).doc(habitId);
  const doc = await ref.get();
  
  if (!doc.exists) throw new Error('Habit not found');
  if (doc.data()?.userId !== uid) throw new Error('Unauthorized');
  
  const completedDates = doc.data()?.completedDates || [];
  const isCompleted = completedDates.includes(dateStr);
  
  if (isCompleted) {
    // Remove date (untoggle)
    await ref.update({
      completedDates: admin.firestore.FieldValue.arrayRemove(dateStr)
    });
  } else {
    // Add date (toggle)
    await ref.update({
      completedDates: admin.firestore.FieldValue.arrayUnion(dateStr)
    });
  }
  
  return !isCompleted;
};
