import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  console.log("Key starts with:", privateKey?.substring(0, 30));
  console.log("Key ends with:", privateKey?.substring(privateKey.length - 30));
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase init failed:", error);
}
