const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const bookingsTrashController = require('../controllers/bookingsTrashController');

router.get('/', ensureAuthenticated, bookingsTrashController.getAll);
router.get('/:id', ensureAuthenticated, bookingsTrashController.getSingle);
router.post('/recover/:id', ensureAuthenticated, bookingsTrashController.recoverBooking);
router.delete('/:id', ensureAuthenticated, bookingsTrashController.deletePermanently);

module.exports = router;
