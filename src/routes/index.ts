import { Router } from 'express';
import storeRoutes from './storeRoutes';

const router = Router();

router.use('/location', storeRoutes);

// pra checar se a API funciona normalmemnte
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;