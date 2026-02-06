const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const protect = require('../middleware/protectMiddleware');

const router = express.Router();

// All inventory routes are protected
router.use(protect);

router
    .route('/')
    .get(inventoryController.getAllCrops)
    .post(inventoryController.createCrop);

router
    .route('/:id')
    .patch(inventoryController.updateCrop)
    .delete(inventoryController.deleteCrop);

module.exports = router;
