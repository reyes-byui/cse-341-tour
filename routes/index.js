const express = require('express');
const router = express.Router();
const mongodb = require('../data/database');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    // #Swagger.tags=['Homepage']
    res.send('Welcome to the home page!');
});

router.get('/staff', async (req, res) => {
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

router.use('/staff', require('./staff'));

module.exports = router;