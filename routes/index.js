const express = require('express');
const router = express.Router();
const mongodb = require('../data/database');
const { ensureAuthenticated } = require('../middleware/auth'); // Import ensureAuthenticated middleware

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    // #Swagger.tags=['Homepage']
    res.send('Welcome to the home page!');
});

router.get('/staff', ensureAuthenticated, async (req, res) => {
    try {
        const db = mongodb.getDb();
        console.log('Connected to database:', db.databaseName); // Log the database name
        const staff = await db.collection('staff').find().toArray();
        console.log('Staff collection data:', staff); // Log the retrieved data
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error retrieving staff:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving staff', error });
    }
});

router.get('/packages', async (req, res) => {
    try {
        const db = mongodb.getDb();
        console.log('Connected to database:', db.databaseName); // Log the database name
        const packages = await db.collection('packages').find().toArray();
        console.log('Packages collection data:', packages); // Log the retrieved data
        res.status(200).json(packages);
    } catch (error) {
        console.error('Error retrieving packages:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving packages', error });
    }
});

router.get('/bookings', ensureAuthenticated, async (req, res) => {
    try {
        const db = mongodb.getDb();
        console.log('Connected to database:', db.databaseName); // Log the database name
        const bookings = await db.collection('bookings').find().toArray();
        console.log('Bookings collection data:', bookings); // Log the retrieved data
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error retrieving bookings:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving bookings', error });
    }
});

router.get('/promotions', async (req, res) => {
    try {
        const db = mongodb.getDb();
        console.log('Connected to database:', db.databaseName); // Log the database name
        const promotions = await db.collection('promotions').find().toArray();
        console.log('Promotions collection data:', promotions); // Log the retrieved data
        res.status(200).json(promotions);
    } catch (error) {
        console.error('Error retrieving promotions:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving promotions', error });
    }
});

router.use('/staff', require('./staff'));
router.use('/packages', require('./packages'));
router.use('/bookings', require('./bookings'));
router.use('/promotions', require('./promotions'));

// Add routes for trash collections
router.use('/staff-trash', require('./staffTrash'));
router.use('/packages-trash', require('./packagesTrash'));
router.use('/bookings-trash', require('./bookingsTrash'));
router.use('/promotions-trash', require('./promotionsTrash'));

module.exports = router;