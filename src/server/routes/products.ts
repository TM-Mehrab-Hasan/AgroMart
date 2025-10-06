import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/search', ProductController.searchProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes
router.post('/', authMiddleware, requireRole(['SELLER', 'SHOP_OWNER']), ProductController.createProduct);
router.put('/:id', authMiddleware, requireRole(['SELLER', 'SHOP_OWNER']), ProductController.updateProduct);
router.delete('/:id', authMiddleware, requireRole(['SELLER', 'SHOP_OWNER', 'ADMIN']), ProductController.deleteProduct);

export default router;