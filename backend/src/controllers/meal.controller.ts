import { Request, Response, NextFunction } from 'express';
import * as mealService from '../services/meal.service';

export const createMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const meal = await mealService.logMeal(uid, req.body);
    res.status(201).json({ data: meal, message: 'Meal logged successfully' });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const { limit, lastVisibleId } = req.query;

    const meals = await mealService.getMealHistory(
      uid, 
      limit ? parseInt(limit as string) : 20, 
      lastVisibleId as string
    );
    
    res.status(200).json({ data: meals });
  } catch (error) {
    next(error);
  }
};
