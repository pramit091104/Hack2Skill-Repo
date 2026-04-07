import { chatWithAi } from './services/ai.service';
import * as dotenv from 'dotenv';
dotenv.config();

const messages = [
  { role: 'ai', content: "Hi there! I'm your NutriSmart assistant. How can I help you meet your health goals today?" },
  { role: 'user', content: "Hello" }
];

async function run() {
  try {
    const res = await chatWithAi(messages, 'test-uid');
    console.log("Success:", res);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
run();
