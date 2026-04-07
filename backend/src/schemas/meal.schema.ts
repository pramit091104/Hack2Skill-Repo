import { z } from 'zod';

export const createMealSchema = z.object({
  body: z.object({
    timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
    imageUrl: z.string().url().optional(),
    foodItems: z.array(z.object({
      name: z.string(),
      quantity: z.string().optional(),
      calories: z.number(),
    })).min(1),
    nutritionSummary: z.object({
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number()
    }),
    aiConfidencePoint: z.number().min(0).max(100).optional(),
    source: z.enum(['manual', 'ai_vision', 'ai_text'])
  })
});
