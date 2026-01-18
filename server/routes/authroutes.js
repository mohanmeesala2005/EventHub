import express from 'express';
import { registerUser, loginUser, updateProfile } from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/update', authMiddleware, updateProfile);

export default router;
