const express = require('express');
const { body } = require('express-validator'); 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); 

const staffController = require('../controllers/staffController');
const staffTrashController = require('../controllers/staffTrashController');

router.get('/', ensureAuthenticated, staffController.getAll);

router.get('/:id', ensureAuthenticated, staffController.getSingle);

router.post('/', ensureAuthenticated,
    [
        body('userName').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').notEmpty().withMessage('Position is required')
    ], staffController.createStaff);

router.put('/:id', ensureAuthenticated,
    [
        body('userName').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').notEmpty().withMessage('Position is required')
    ],staffController.updateStaff);

router.delete('/:id', ensureAuthenticated, staffController.deleteStaff);

// Recover a staff member from trash
router.post('/trash/recover/:id', ensureAuthenticated, staffTrashController.recoverStaff);

// Permanently delete a staff member from trash
router.delete('/trash/:id', ensureAuthenticated, staffTrashController.deletePermanently);

module.exports = router;