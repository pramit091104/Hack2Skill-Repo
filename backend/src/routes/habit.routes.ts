import { Router } from 'express';
import { create, list, toggle } from '../controllers/habit.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createHabitSchema } from '../schemas/habit.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validateRequest(createHabitSchema), create);
router.get('/', list);
router.post('/:id/toggle', toggle);

export default router;
