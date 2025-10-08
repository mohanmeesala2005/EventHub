import express from 'express';
import { registerUser, loginUser,updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/update',updateProfile);

export default router;
