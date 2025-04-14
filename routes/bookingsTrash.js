const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const bookingsTrashController = require('../controllers/bookingsTrashController');

// Get all bookings in trash
router.get('/', ensureAuthenticated, bookingsTrashController.getAll);

// Get a single booking from trash by ID
router.get('/:id', ensureAuthenticated, bookingsTrashController.getSingle);

// Recover a booking from trash
router.post('/recover/:id', ensureAuthenticated, bookingsTrashController.recoverBooking);

// Permanently delete a booking from trash
router.delete('/:id', ensureAuthenticated, bookingsTrashController.deletePermanently);

module.exports = router;
