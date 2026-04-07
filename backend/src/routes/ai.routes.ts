import { Router } from 'express';
import { analyzeText, chat, getRecommendations, analyzeImage } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/analyze/text', analyzeText);
router.post('/analyze/image', analyzeImage);
router.get('/recommend', getRecommendations);
router.post('/chat', chat);

export default router;
