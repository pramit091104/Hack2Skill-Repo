import { Router } from 'express';
import { createMeal, getHistory } from '../controllers/meal.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createMealSchema } from '../schemas/meal.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validateRequest(createMealSchema), createMeal);
router.get('/history', getHistory);

export default router;
