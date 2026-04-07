import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { storage } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/url', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contentType, extension } = req.body;
    
    if (!contentType || !extension) {
      return res.status(400).json({ error: 'contentType and extension are required '});
    }

    const uid = req.user?.uid;
    const filename = `uploads/users/${uid}/${uuidv4()}.${extension}`;
    
    const file = storage.file(filename);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    res.status(200).json({ 
      uploadUrl: url, 
      path: filename,
      publicUrl: `https://storage.googleapis.com/${storage.name}/${filename}` 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
