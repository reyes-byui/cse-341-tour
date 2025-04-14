const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const promotionsTrashController = require('../controllers/promotionsTrashController');

router.get('/', ensureAuthenticated, promotionsTrashController.getAll);
router.get('/:id', ensureAuthenticated, promotionsTrashController.getSingle);
router.post('/recover/:id', ensureAuthenticated, promotionsTrashController.recoverPromotion);
router.delete('/:id', ensureAuthenticated, promotionsTrashController.deletePermanently);

module.exports = router;
