const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const packagesTrashController = require('../controllers/packagesTrashController');

// Get all packages in trash
router.get('/', ensureAuthenticated, packagesTrashController.getAll);

// Get a single package from trash by ID
router.get('/:id', ensureAuthenticated, packagesTrashController.getSingle);

// Recover a package from trash
router.post('/recover/:id', ensureAuthenticated, packagesTrashController.recoverPackage);

// Permanently delete a package from trash
router.delete('/:id', ensureAuthenticated, packagesTrashController.deletePermanently);

module.exports = router;
