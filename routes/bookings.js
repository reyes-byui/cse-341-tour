const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const db = require('../db'); // Import your database connection

const bookingsController = require('../controllers/bookingsController');

router.get('/', ensureAuthenticated, bookingsController.getAll);

router.get('/:id', ensureAuthenticated, bookingsController.getSingle);

router.post('/', ensureAuthenticated, [
    body('firstName').matches(/^[a-zA-Z\s]+$/).withMessage('First name must contain only alphabetic characters and spaces.'),
    body('lastName').matches(/^[a-zA-Z\s']+$/).withMessage('Last name must contain only alphabetic characters and spaces.'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'), // Updated field name
    body('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be a percentage between 0 and 100'),
    body('paymentStatus').isIn(['paid', 'unpaid']).withMessage('Payment status must be either "paid" or "unpaid"'),
    body('packageCode').custom(async (value) => {
        const packageQuery = 'SELECT 1 FROM packages WHERE packageCode = $1';
        const promotionQuery = 'SELECT 1 FROM promotions WHERE packageCode = $1';

        const packageExists = await db.query(packageQuery, [value]);
        const promotionExists = await db.query(promotionQuery, [value]);

        if (packageExists.rowCount === 0 && promotionExists.rowCount === 0) {
            throw new Error('Package code does not exist in packages or promotions');
        }
        return true;
    }),
    body('startDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('Start date must be in mm/dd/yyyy format'),
    body('endDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('End date must be in mm/dd/yyyy format')

], bookingsController.createBooking);

router.put('/:id', ensureAuthenticated, [
    body('firstName').matches(/^[a-zA-Z\s]+$/).withMessage('First name must contain only alphabetic characters and spaces.'),
    body('lastName').matches(/^[a-zA-Z\s']+$/).withMessage('Last name must contain only alphabetic characters and spaces.'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('price').isCurrency({ symbol: '$', allow_negatives: false }).withMessage('Price must be in USD'), // Updated field name
    body('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be a percentage between 0 and 100'),
    body('paymentStatus').isIn(['paid', 'unpaid']).withMessage('Payment status must be either "paid" or "unpaid"'),
    body('packageCode').custom(async (value) => {
        const packageQuery = 'SELECT 1 FROM packages WHERE packageCode = $1';
        const promotionQuery = 'SELECT 1 FROM promotions WHERE packageCode = $1';

        const packageExists = await db.query(packageQuery, [value]);
        const promotionExists = await db.query(promotionQuery, [value]);

        if (packageExists.rowCount === 0 && promotionExists.rowCount === 0) {
            throw new Error('Package code does not exist in packages or promotions');
        }
        return true;
    }),
    body('startDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('Start date must be in mm/dd/yyyy format'),
    body('endDate').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/).withMessage('End date must be in mm/dd/yyyy format')

], bookingsController.updateBooking);

router.delete('/:id', ensureAuthenticated, bookingsController.deleteBooking);

module.exports = router;