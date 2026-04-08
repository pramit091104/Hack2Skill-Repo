import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not defined in the environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'unconfigured');

// Export pre-configured models
export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
