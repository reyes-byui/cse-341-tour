const express = require('express');
const router = express.Router();
const promotionsController = require('../controllers/promotionsController');

// Define routes for promotions
router.get('/', promotionsController.getAll);
router.get('/:id', promotionsController.getSingle);
router.post('/', promotionsController.createPromotion);
router.put('/:id', promotionsController.updatePromotion);
router.delete('/:id', promotionsController.deletePromotion);

module.exports = router;