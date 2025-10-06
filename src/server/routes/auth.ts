import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getProfile);

export default router;