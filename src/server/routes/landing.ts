import { Router } from 'express';
import { LandingController } from '../controllers/LandingController';

const router = Router();

// GET /api/landing/stats - Get platform statistics
router.get('/stats', LandingController.getStats);

// GET /api/landing/categories - Get categories with product counts
router.get('/categories', LandingController.getCategories);

// GET /api/landing/featured-products - Get featured products
router.get('/featured-products', LandingController.getFeaturedProducts);

// GET /api/landing/testimonials - Get user testimonials
router.get('/testimonials', LandingController.getTestimonials);

// GET /api/landing/all - Get all landing page data in one request
router.get('/all', LandingController.getAllLandingData);

export default router;