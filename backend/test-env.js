import * as dotenv from 'dotenv';
dotenv.config();
const key = process.env.FIREBASE_PRIVATE_KEY;
console.log("Raw Key:\\n", key);
const processed = key?.replace(/\\n/g, '\n');
console.log("Processed Key:\\n", processed);
