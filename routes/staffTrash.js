const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const staffTrashController = require('../controllers/staffTrashController');

// Get all staff members in trash
router.get('/', ensureAuthenticated, staffTrashController.getAll);

// Get a single staff member from trash by ID
router.get('/:id', ensureAuthenticated, staffTrashController.getSingle);

// Recover a staff member from trash
router.post('/recover/:id', ensureAuthenticated, staffTrashController.recoverStaff);

// Permanently delete a staff member from trash
router.delete('/:id', ensureAuthenticated, staffTrashController.deletePermanently);

module.exports = router;
