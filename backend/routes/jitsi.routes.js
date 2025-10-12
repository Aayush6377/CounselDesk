import express from 'express';
import { getMeetingLink } from '../controllers/jitsi.controller.js';
import isLogin from '../middlewares/isLogin.js';

const router = express.Router();

router.get('/meeting/:appointmentId', isLogin, getMeetingLink);

export default router;