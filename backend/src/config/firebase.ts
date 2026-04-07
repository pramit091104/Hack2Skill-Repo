import * as admin from 'firebase-admin';

// Check if already initialized to prevent duplicate app initialization during hot-reloads
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  } else {
    // Falls back to Google Application Default Credentials (e.g. running in Cloud Run)
    console.warn('No specific Firebase credentials found in env. Falling back to Application Default Credentials.');
    admin.initializeApp({
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com');
export default admin;
