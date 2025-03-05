import { Router } from "express";
import { StoreController } from "../controllers/storeController";

const router = Router();

router.get("/nearest-stores/:cep", StoreController.findNearestStores);

export default router;
