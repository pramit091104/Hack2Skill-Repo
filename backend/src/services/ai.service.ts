import { geminiFlash, geminiPro } from '../config/gemini';
import { db } from '../config/firebase';
import vision from '@google-cloud/vision';
import { getMealHistory } from './meal.service';

const visionClient = new vision.ImageAnnotatorClient();

// Retry helper for transient Gemini errors (503, 429)
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 2000): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const isTransient = msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('high demand');
      if (isTransient && i < retries - 1) {
        console.warn(`[withRetry] Transient error, retrying in ${delayMs}ms... (attempt ${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delayMs * (i + 1)));
      } else {
        throw e;
      }
    }
  }
  throw new Error('Max retries exceeded');
};

export const analyzeMealText = async (text: string) => {
  const prompt = `
    You are an expert nutritionist AI. Analyze the following meal description: "${text}".
    Return a strictly formatted JSON array containing food items and a total nutrition summary.
    Do NOT use markdown blocks like \`\`\`json. Return only raw JSON.
    Format:
    {
      "foodItems": [{ "name": "string", "quantity": "string", "calories": number }],
      "nutritionSummary": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  `;

  const result = await withRetry(() => geminiFlash.generateContent(prompt));
  const responseText = result.response.text();
  try {
    return JSON.parse(responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, ''));
  } catch (error) {
    throw new Error('Failed to parse AI response into JSON');
  }
};

export const chatWithAi = async (messages: {role: string, content: string}[], uid: string) => {
  let profile: Record<string, unknown> = {};
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    profile = userDoc.exists ? (userDoc.data() as Record<string, unknown>) : {};
  } catch (e) {
    console.warn('[chatWithAi] Could not fetch user profile:', e);
  }

  const systemInstruction = {
    role: 'system',
    parts: [{ text: `You are the NutriSmart AI assistant. User Context: ${JSON.stringify(profile)}. Be concise, helpful and ensure your advice aligns with their targets.` }],
  };

  // Normalize roles and collapse consecutive same-role messages
  const normalized: {role: 'user' | 'model', content: string}[] = [];
  for (const m of messages) {
    const role = m.role === 'ai' || m.role === 'model' ? 'model' : 'user';
    if (normalized.length > 0 && normalized[normalized.length - 1].role === role) {
      normalized[normalized.length - 1].content += '\n\n' + m.content;
    } else {
      normalized.push({ role, content: m.content });
    }
  }

  // Must end with a user message to send
  let latestMsg = 'Please continue.';
  if (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    latestMsg = normalized.pop()!.content;
  }

  // History must start with 'user' — drop any leading model turns
  while (normalized.length > 0 && normalized[0].role === 'model') {
    normalized.shift();
  }

  const history = normalized.map(m => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  console.log('[chatWithAi] history length:', history.length, '| latestMsg:', latestMsg.slice(0, 80));

  try {
    const chatModel = geminiFlash.startChat({ systemInstruction, history });
    const result = await withRetry(() => chatModel.sendMessage(latestMsg));
    return result.response.text();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[chatWithAi] Gemini error:', msg);
    const err = new Error(`Gemini API error: ${msg}`) as Error & { statusCode?: number };
    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
      err.statusCode = 429;
      err.message = 'AI service is temporarily unavailable due to rate limits. Please try again in a few minutes.';
    }
    throw err;
  }
};

export const generateRecommendations = async (uid: string) => {
  const userDoc = await db.collection('users').doc(uid).get();
  const profile = userDoc.exists ? userDoc.data() : { goals: { targetCalories: 2000 } };
  
  const history = await getMealHistory(uid, 5); // Last 5 meals
  const summary = history.map(h => `Logged on ${h.timestamp}: ${h.nutritionSummary?.calories || 0}kcal`).join('; ');

  const prompt = `
    You are a premium nutritionist AI. 
    User Profile/Goals: ${JSON.stringify(profile)}.
    Recent Meal Logs: ${summary}.
    Current Server Time: ${new Date().toISOString()}.
    
    Given their goals and recent behavior, generate 3 highly personalized, varied meal recommendations suitable for their next meal.
    If they are missing protein, suggest protein-heavy meals.
    Return strictly raw JSON format without markdown blocks:
    [
      { "mealName": "string", "reasoning": "string", "estimatedCalories": number }
    ]
  `;
  
  const result = await withRetry(() => geminiPro.generateContent(prompt));
  try {
     return JSON.parse(result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, ''));
  } catch(e) {
     throw new Error('Failed to parse AI recommendation output');
  }
};

export const analyzeMealImage = async (gsUri: string) => {
  // Use Google Cloud Vision API to detect labels from the GS URI directly
  const [result] = await visionClient.labelDetection(gsUri);
  const labels = result.labelAnnotations?.map(label => label.description).join(', ');
  
  if (!labels) throw new Error('No items detected in image');

  const prompt = `
    You are an expert nutritionist AI. The Google Vision API detected the following items in a meal image: ${labels}.
    Based on these labels, estimate the most likely components of this meal and approximate their nutritional value for a standard portion size.
    Return strictly raw JSON format without markdown blocks:
    {
      "foodItems": [{ "name": "string", "quantity": "string", "calories": number }],
      "nutritionSummary": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  `;
  const aiResult = await withRetry(() => geminiFlash.generateContent(prompt));
  try {
    return JSON.parse(aiResult.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, ''));
  } catch(e) {
    throw new Error('Failed to parse Gemini output bridging from Vision API labels');
  }
};
