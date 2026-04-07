import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/ai.service';
import { db } from '../config/firebase';

export const analyzeText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text description is required' });
    const analysis = await aiService.analyzeMealText(text);
    res.status(200).json({ data: analysis });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages } = req.body; // Expects array of { role, content }
    const uid = req.user!.uid;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages array is required' });

    const reply = await aiService.chatWithAi(messages, uid);
    res.status(200).json({ data: { reply } });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const recommendations = await aiService.generateRecommendations(uid);
    res.status(200).json({ data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const analyzeImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageUri } = req.body;
    if (!imageUri) return res.status(400).json({ error: 'imageUri (gs:// format) is required' });
    const analysis = await aiService.analyzeMealImage(imageUri);
    res.status(200).json({ data: analysis });
  } catch (error) {
    next(error);
  }
};
