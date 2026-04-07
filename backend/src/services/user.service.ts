import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

export const getUserProfile = async (uid: string) => {
  const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();
  
  if (!userDoc.exists) {
    // If it doesn't exist, we can create a default profile or throw an error
    return null;
  }
  
  return { id: userDoc.id, ...userDoc.data() };
};

export const updateUserProfile = async (uid: string, data: any) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  
  // Use set with merge: true to update existing fields or create new doc
  await userRef.set({
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  
  return getUserProfile(uid);
};
