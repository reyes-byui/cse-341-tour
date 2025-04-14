const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); 

const packagesController = require('../controllers/packagesController'); // Corrected variable name

router.get('/', packagesController.getAll); // Public route

router.get('/:id', packagesController.getSingle); // Public route

router.post('/', ensureAuthenticated,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('continent').notEmpty().withMessage('Continent is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusion').notEmpty().withMessage('Inclusion is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
        body('packageCode').notEmpty().withMessage('Package code is required')
    ], packagesController.createPackage);

router.put('/:id', ensureAuthenticated,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('continent').notEmpty().withMessage('Continent is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('pax').isNumeric().withMessage('Pax must be a number'),
        body('inclusion').notEmpty().withMessage('Inclusion is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
        body('packageCode').notEmpty().withMessage('Package code is required')
    ], packagesController.updatePackage);

router.delete('/:id', ensureAuthenticated, packagesController.deletePackage);

module.exports = router;