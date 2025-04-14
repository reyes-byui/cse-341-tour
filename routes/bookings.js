const express = require('express');
const router = express.Router();

const bookingsController = require('../controllers/bookingsController'); // Corrected variable name

router.get('/', bookingsController.getAll);

router.get('/:id', bookingsController.getSingle);

router.post('/', bookingsController.createBooking);

router.put('/:id', bookingsController.updateBooking);

router.delete('/:id', bookingsController.deleteBooking);

module.exports = router;