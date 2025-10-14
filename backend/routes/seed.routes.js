import { Router } from 'express';
import * as seedRouter from "../controllers/seed.controller.js";

const router = Router();

//Lawyers seeds
router.post("/lawyers/run", seedRouter.seedLawyers);
router.post("/lawyers/undo", seedRouter.unseedLawyers);

export default router;
