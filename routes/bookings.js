const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

const bookingsController = require('../controllers/bookingsController');

router.get('/', ensureAuthenticated, bookingsController.getAll);

router.get('/:id', ensureAuthenticated, bookingsController.getSingle);

router.post('/', ensureAuthenticated, [
    body('firstName').isAlpha().withMessage('First name is required'),
    body('lastName').isAlpha().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'), // Updated field name
    body('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be a percentage between 0 and 100'),
    body('paymentStatus').isIn(['paid', 'unpaid']).withMessage('Payment status must be either "paid" or "unpaid"'),
    body('packageCode').isAlphanumeric().withMessage('Package code must be alphanumeric'),
    body('startDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('Start date must be in mm/dd/yyyy format'),
    body('endDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('End date must be in mm/dd/yyyy format')

], bookingsController.createBooking);

router.put('/:id', ensureAuthenticated, [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'), // Updated field name
    body('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be a percentage between 0 and 100'),
    body('paymentStatus').isIn(['paid', 'unpaid']).withMessage('Payment status must be either "paid" or "unpaid"'),
    body('packageCode').isAlphanumeric().withMessage('Package code must be alphanumeric'),
    body('startDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('Start date must be in mm/dd/yyyy format'),
    body('endDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('End date must be in mm/dd/yyyy format')

], bookingsController.updateBooking);

router.delete('/:id', ensureAuthenticated, bookingsController.deleteBooking);

module.exports = router;