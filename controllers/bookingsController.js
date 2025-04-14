const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator'); // Import validationResult
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    //#swagger.tags=['Bookings']
    ensureAuthenticated(req, res, async () => {
        try {
            const result = await mongodb.getDb().collection('bookings').find().toArray();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings', error });
        }
    });
};

const getSingle = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        try {
            const bookingId = new ObjectId(req.params.id);
            const result = await mongodb.getDb().collection('bookings').findOne({ _id: new ObjectId(bookingId) });
            if (!result) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving booking', error });
        }
    });
};

const createBooking = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, price, discount, paymentStatus, packageCode } = req.body;

        const bookingData = {
            firstName,
            lastName,
            email,
            price,
            discount,
            paymentStatus,
            packageCode
        };

        try {
            const result = await mongodb.getDb().collection('bookings').insertOne(bookingData);
            res.status(201).json({ message: 'Booking created successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error creating booking', error });
        }
    });
};

const updateBooking = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const bookingId = req.params.id;
        const { packageCode, firstName, lastName, email, price, discount, paymentStatus } = req.body;

        const bookingData = {
            firstName,
            lastName,
            email,
            price,
            discount,
            paymentStatus,
            packageCode
        };

        try {
            const result = await mongodb.getDb().collection('bookings').updateOne(
                { _id: new ObjectId(bookingId) },
                { $set: bookingData }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json({ message: 'Booking updated successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error updating booking', error });
        }
    });
};

const deleteBooking = async (req, res) => {
    const bookingId = req.params.id;

    if (!ObjectId.isValid(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID format' });
    }

    try {
        const db = mongodb.getDb();
        const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Move booking to trash collection
        await db.collection('bookings_trash').insertOne({ ...booking, deletedAt: new Date() });

        // Delete booking from the original collection
        await db.collection('bookings').deleteOne({ _id: new ObjectId(bookingId) });

        res.status(200).json({ message: 'Booking moved to trash successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBooking,
    updateBooking,
    deleteBooking
};