import { Request, Response, NextFunction } from 'express';
import * as habitService from '../services/habit.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const habit = await habitService.createHabit(uid, req.body);
    res.status(201).json({ data: habit });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const habits = await habitService.getHabits(uid);
    res.status(200).json({ data: habits });
  } catch (error) {
    next(error);
  }
};

export const toggle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;
    const { date } = req.body; // format YYYY-MM-DD
    
    if (!date) return res.status(400).json({ error: 'date string is required' });

    const status = await habitService.toggleHabitCompletion(uid, id, date);
    res.status(200).json({ status, message: status ? 'Marked complete' : 'Marked incomplete' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
