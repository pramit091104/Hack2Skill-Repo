import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await userService.getUserProfile(uid);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please complete onboarding.' });
    }

    res.status(200).json({ data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    const updatedProfile = await userService.updateUserProfile(uid, req.body);
    res.status(200).json({ data: updatedProfile, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};
