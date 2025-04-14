const express = require('express');
const router = express.Router();

const packagesController = require('../controllers/packagesController'); // Corrected variable name

router.get('/', packagesController.getAll);

router.get('/:id', packagesController.getSingle);

router.post('/', packagesController.createPackage);

router.put('/:id', packagesController.updatePackage);

router.delete('/:id', packagesController.deletePackage);

module.exports = router;