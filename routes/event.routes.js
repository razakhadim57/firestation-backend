import express from 'express';
import * as eventController from '../controllers/event.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public access to get events, with optional filters
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);

// Protected routes (only station_admin and admin can manage events)
router.post('/', protect, authorize('admin', 'station_admin'), eventController.create);
router.put('/:id', protect, authorize('admin', 'station_admin'), eventController.update);
router.delete('/:id', protect, authorize('admin', 'station_admin'), eventController.remove);

export default router;
