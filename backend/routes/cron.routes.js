import { Router } from "express";
import { dailyMaintenanceJob } from "../controllers/cron.controller.js";
import { checkCronSecret } from "../middlewares/cron.middleware.js";

const router = Router();

router.get("/run-daily-job", checkCronSecret, dailyMaintenanceJob);

export default router;