const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

const bookingsController = require('../controllers/bookingsController');

router.get('/', ensureAuthenticated, bookingsController.getAll);

router.get('/:id', ensureAuthenticated, bookingsController.getSingle);

router.post('/', ensureAuthenticated, [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('price').isFloat().withMessage('Price is required'), // Updated field name
    body('discount').isFloat({ min: 0 }).withMessage('Discount must be a valid number'),
    body('paymentStatus').notEmpty().withMessage('Payment status is required'),
    body('packageCode').notEmpty().withMessage('Package code is required')
], bookingsController.createBooking);

router.put('/:id', ensureAuthenticated, [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('price').isFloat().withMessage('Price is required'), // Updated field name
    body('discount').isFloat({ min: 0 }).withMessage('Discount must be a valid number'),
    body('paymentStatus').notEmpty().withMessage('Payment status is required'),
    body('packageCode').notEmpty().withMessage('Package code is required')
], bookingsController.updateBooking);

router.delete('/:id', ensureAuthenticated, bookingsController.deleteBooking);

module.exports = router;