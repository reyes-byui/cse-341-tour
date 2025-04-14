const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const staffTrashController = require('../controllers/staffTrashController');

router.get('/', ensureAuthenticated, staffTrashController.getAll);
router.get('/:id', ensureAuthenticated, staffTrashController.getSingle);
router.post('/recover/:id', ensureAuthenticated, staffTrashController.recoverStaff);
router.delete('/:id', ensureAuthenticated, staffTrashController.deletePermanently);

module.exports = router;
