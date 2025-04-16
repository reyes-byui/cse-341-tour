const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); 

const staffController = require('../controllers/staffController');

router.get('/', ensureAuthenticated, staffController.getAll);

router.get('/:id', ensureAuthenticated, staffController.getSingle);

router.post('/', ensureAuthenticated,
    [
        body('userName').isAlphanumeric().withMessage('Username is must be alphanumeric. Special Characters are not allowed'),
        body('password').isAlphanumeric().withMessage('Password is must be alphanumeric. Special Characters are not allowed'),
        body('firstName').isAlpha().withMessage('First name is required. Special Characters are not allowed'),
        body('lastName').isAlpha().withMessage('Last name is required. Special Characters are not allowed'),
        body('email').isEmail().withMessage('Valid email is required.'),
        body('position').matches(/^[a-zA-Z\s]+$/).withMessage('Position must contain only alphabetic characters and spaces')
    ], staffController.createStaff);

router.put('/:id', ensureAuthenticated,
    [
        body('userName').isAlphanumeric().withMessage('Username is must be alphanumeric. Special Characters are not allowed'),
        body('password').isAlphanumeric().withMessage('Password is must be alphanumeric. Special Characters are not allowed'),
        body('firstName').isAlpha().withMessage('First name is required. Special Characters are not allowed'),
        body('lastName').isAlpha().withMessage('Last name is required. Special Characters are not allowed'),
        body('email').isEmail().withMessage('Valid email is required.'),
        body('position').matches(/^[a-zA-Z\s]+$/).withMessage('Position must contain only alphabetic characters and spaces')
    ], staffController.updateStaff);

router.delete('/:id', ensureAuthenticated, staffController.deleteStaff);

module.exports = router;