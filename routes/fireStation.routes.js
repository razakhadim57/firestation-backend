import express from 'express';
import { create,getAll,deleteFire,update,getById } from '../controllers/fireStation.controller.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteFire);

export default router;