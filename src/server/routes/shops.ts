import { Router } from 'express';
import { ShopController } from '../controllers/ShopController';

const router = Router();

// Shop routes
router.get('/', ShopController.getAllShops);
router.post('/', ShopController.createShop);
router.get('/:id', ShopController.getShopById);
router.put('/:id', ShopController.updateShop);
router.delete('/:id', ShopController.deleteShop);

export default router;