import { z } from 'zod';

export const createHabitSchema = z.object({
  body: z.object({
    name: z.string(),
    frequency: z.enum(['daily', 'weekly']),
    targetDays: z.number().min(1).max(7).optional()
  })
});
