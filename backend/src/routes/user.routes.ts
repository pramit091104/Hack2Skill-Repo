import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { updateUserProfileSchema } from '../schemas/user.schema';

const router = Router();

router.use(requireAuth); // Protect all user routes

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateUserProfileSchema), updateProfile);

export default router;
