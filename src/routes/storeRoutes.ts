import { Router } from 'express';
import { StoreController } from '../controllers/storeController';

const router = Router();

router.get('/nearest-store/:cep', StoreController.findNearestStore);

export default router;