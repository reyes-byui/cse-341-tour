const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const promotionsTrashController = require('../controllers/promotionsTrashController');

// Get all promotions in trash
router.get('/', ensureAuthenticated, promotionsTrashController.getAll);

// Get a single promotion from trash by ID
router.get('/:id', ensureAuthenticated, promotionsTrashController.getSingle);

// Recover a promotion from trash
router.post('/recover/:id', ensureAuthenticated, promotionsTrashController.recoverPromotion);

// Permanently delete a promotion from trash
router.delete('/:id', ensureAuthenticated, promotionsTrashController.deletePermanently);

module.exports = router;
