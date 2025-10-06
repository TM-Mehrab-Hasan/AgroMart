import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();

// Order routes
router.get('/', OrderController.getAllOrders);
router.post('/', OrderController.createOrder);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);

export default router;