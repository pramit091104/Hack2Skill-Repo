import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  body: z.object({
    displayName: z.string().optional(),
    goals: z.object({
      targetCalories: z.number().positive(),
      targetProtein: z.number().positive(),
      targetCarbs: z.number().positive(),
      targetFats: z.number().positive(),
    }).optional(),
    restrictions: z.array(z.string()).optional(),
    onboardingComplete: z.boolean().optional()
  })
});
