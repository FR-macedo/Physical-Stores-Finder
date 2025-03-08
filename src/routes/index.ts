// routes/index.ts
import { Router } from 'express';
import { StoreController } from '../controllers/storeController';
import { validateCep } from '../middlewares/validationMiddleware';
import { asyncHandler } from '../middlewares/errorMiddleware';

const router = Router();

router.get('/stores/nearest/:cep', 
  validateCep,
  asyncHandler(StoreController.findNearestStores)
);

export default router;