import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadbadges } from '../middleware/multer.js';
import * as mediaController from '../controllers/media.controller.js';

const router = express.Router();

router.post(
  '/',
  protect,
  uploadbadges.single('file'),
  mediaController.uploadMedia
);

router.get('/station', mediaController.getAll);

router.delete('/:id', protect, mediaController.remove);

export default router;
