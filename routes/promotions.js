const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); 

const promotionsController = require('../controllers/promotionsController');

router.get('/', promotionsController.getAll); 

router.get('/:id', promotionsController.getSingle);

router.post('/', ensureAuthenticated,
    [
        body('name').matches(/^[a-zA-Z0-9\s.]+$/).withMessage('Name must be alphanumeric and can include spaces and periods'),
        body('continent').matches(/^[a-zA-Z\s]+$/).withMessage('Continent must contain only alphabetic characters and spaces'),
        body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusions').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Include inclusions: airfare, transfers, accommodation, meals, tours, etc.'),
        body('description').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Description must be alphanumeric and can include spaces, paragraphs, and symbols'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
        body('discountRate').isFloat({ min: 0, max: 100 }).withMessage('Discount must be a percentage between 0 and 100'),
        body('packageCode').isAlphanumeric().withMessage('Package code is required'),
        body('startDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('Start date must be in mm/dd/yyyy format'),
        body('endDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('End date must be in mm/dd/yyyy format')
    ], promotionsController.createPromotion);

router.put('/:id', ensureAuthenticated,
    [
        body('name').matches(/^[a-zA-Z0-9\s.]+$/).withMessage('Name must be alphanumeric and can include spaces and periods'),
        body('continent').matches(/^[a-zA-Z\s]+$/).withMessage('Continent must contain only alphabetic characters and spaces'),
        body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusions').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Include inclusions: airfare, transfers, accommodation, meals, tours, etc.'),
        body('description').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Description must be alphanumeric and can include spaces, paragraphs, and symbols'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
        body('discountRate').isFloat({ min: 0, max: 100 }).withMessage('Discount must be a percentage between 0 and 100'),
        body('packageCode').isAlphanumeric().withMessage('Package code is required'),
        body('startDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('Start date must be in mm/dd/yyyy format'),
        body('endDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('End date must be in mm/dd/yyyy format')
    ], promotionsController.updatePromotion);

router.delete('/:id', ensureAuthenticated, promotionsController.deletePromotion);

module.exports = router;