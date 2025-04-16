const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); 

const packagesController = require('../controllers/packagesController'); 

router.get('/', packagesController.getAll); 

router.get('/:id', packagesController.getSingle);

router.post('/', ensureAuthenticated,
    [
        body('name').matches(/^[a-zA-Z0-9\s.]+$/).withMessage('Name must be alphanumeric and can include spaces and periods'),
        body('continent').matches(/^[a-zA-Z\s]+$/).withMessage('Continent must contain only alphabetic characters and spaces'),
        body('country').matches(/^[a-zA-Z\s]+$/).withMessage('Country must contain only alphabetic characters and spaces'),
        body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusion').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Include inclusions: airfare, transfers, accommodation, meals, tours, etc.'),
        body('description').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Description must be alphanumeric and can include spaces, paragraphs, and symbols'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
        body('packageCode').isAlphanumeric().withMessage('Package code is required')
    ], packagesController.createPackage);

router.put('/:id', ensureAuthenticated,
    [
        body('name').matches(/^[a-zA-Z0-9\s.]+$/).withMessage('Name must be alphanumeric and can include spaces and periods'),
        body('continent').matches(/^[a-zA-Z\s]+$/).withMessage('Continent must contain only alphabetic characters and spaces'),
        body('country').matches(/^[a-zA-Z\s]+$/).withMessage('Country must contain only alphabetic characters and spaces'),
        body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusion').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Include inclusions: airfare, transfers, accommodation, meals, tours, etc.'),
        body('description').matches(/^[a-zA-Z0-9\s.,!?/'"\-]+$/).withMessage('Description must be alphanumeric and can include spaces, paragraphs, and symbols'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
        body('packageCode').isAlphanumeric().withMessage('Package code is required')
    ], packagesController.updatePackage);

router.delete('/:id', ensureAuthenticated, packagesController.deletePackage);

module.exports = router;