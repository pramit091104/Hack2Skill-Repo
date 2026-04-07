import { geminiFlash, geminiPro } from '../config/gemini';
import { db } from '../config/firebase';
import vision from '@google-cloud/vision';
import { getMealHistory } from './meal.service';

const visionClient = new vision.ImageAnnotatorClient();

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

  const result = await geminiFlash.generateContent(prompt);
  const responseText = result.response.text();
  try {
    return JSON.parse(responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, ''));
  } catch (error) {
    throw new Error('Failed to parse AI response into JSON');
  }
};

export const chatWithAi = async (messages: {role: string, content: string}[], uid: string) => {
  const userDoc = await db.collection('users').doc(uid).get();
  const profile = userDoc.exists ? userDoc.data() : {};
  
  const systemPrompt = `You are the NutriSmart AI assistant. User Context: ${JSON.stringify(profile)}. Be concise, helpful and ensure your advice aligns with their targets.`;
  
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'ai' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
  
  const latestMessage = messages[messages.length - 1].content;
  
  let formattedHistory: any[] = [];
  if (history.length > 0 && history[0].role === 'model') {
    formattedHistory = [
       { role: 'user', parts: [{ text: systemPrompt }] },
       ...history
    ];
  } else {
    formattedHistory = [
       { role: 'user', parts: [{ text: systemPrompt }] },
       { role: 'model', parts: [{ text: 'Understood. I am ready to advise.'}] },
       ...history
    ];
  }
  
  const chatSession = geminiFlash.startChat({
    history: formattedHistory
  });
  
  const result = await chatSession.sendMessage(latestMessage);
  return result.response.text();
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
  
  const result = await geminiPro.generateContent(prompt);
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
  const aiResult = await geminiFlash.generateContent(prompt);
  try {
    return JSON.parse(aiResult.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, ''));
  } catch(e) {
    throw new Error('Failed to parse Gemini output bridging from Vision API labels');
  }
};
