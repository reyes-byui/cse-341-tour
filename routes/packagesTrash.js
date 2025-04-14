const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const packagesTrashController = require('../controllers/packagesTrashController');

router.get('/', ensureAuthenticated, packagesTrashController.getAll);

router.get('/:id', ensureAuthenticated, packagesTrashController.getSingle);

router.post('/recover/:id', ensureAuthenticated, packagesTrashController.recoverPackage);

router.delete('/:id', ensureAuthenticated, packagesTrashController.deletePermanently);

module.exports = router;
