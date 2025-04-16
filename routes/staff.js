const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); 

const staffController = require('../controllers/staffController');

router.get('/', ensureAuthenticated, staffController.getAll);

router.get('/:id', ensureAuthenticated, staffController.getSingle);

router.post('/', ensureAuthenticated,
    [
        body('userName').isAlphanumeric().withMessage('Username is required'),
        body('password').isAlphanumeric().withMessage('Password is required'),
        body('firstName').isAlpha().withMessage('First name is required'),
        body('lastName').isAlpha().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').isAlpha().withMessage('Position is required')
    ], staffController.createStaff);

router.put('/:id', ensureAuthenticated,
    [
        body('userName').isAlphanumeric().withMessage('Username is required'),
        body('password').isAlphanumeric().withMessage('Password is required'),
        body('firstName').isAlpha().withMessage('First name is required'),
        body('lastName').isAlpha().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').isAlpha().withMessage('Position is required')
    ], staffController.updateStaff);

router.delete('/:id', ensureAuthenticated, staffController.deleteStaff);

module.exports = router;