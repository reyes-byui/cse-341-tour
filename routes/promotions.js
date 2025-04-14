const express = require('express');
const { body } = require('express-validator'); // Import validation functions
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); // Import authentication middleware
const promotionsController = require('../controllers/promotionsController');

// Define routes for promotions
router.get('/', promotionsController.getAll); // Public route
router.get('/:id', promotionsController.getSingle); // Public route

router.post('/', ensureAuthenticated,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('continent').notEmpty().withMessage('Continent is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusions').notEmpty().withMessage('Inclusions are required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('availability').isNumeric().withMessage('Availability must be a number'),
        body('discountRate').notEmpty().withMessage('Discount rate is required'),
        body('packageCode').notEmpty().withMessage('Package code is required'),
        body('startDate').notEmpty().withMessage('Start date is required'),
        body('endDate').notEmpty().withMessage('End date is required')
    ], promotionsController.createPromotion);

router.put('/:id', ensureAuthenticated,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('continent').notEmpty().withMessage('Continent is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusions').notEmpty().withMessage('Inclusions are required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('availability').isNumeric().withMessage('Availability must be a number'),
        body('discountRate').notEmpty().withMessage('Discount rate is required'),
        body('packageCode').notEmpty().withMessage('Package code is required'),
        body('startDate').notEmpty().withMessage('Start date is required'),
        body('endDate').notEmpty().withMessage('End date is required')
    ], promotionsController.updatePromotion);

router.delete('/:id', ensureAuthenticated, promotionsController.deletePromotion);

module.exports = router;