const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Bookings']
    try {
        const result = await mongodb.getDb().collection('bookings').find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error });
    }
};

const getSingle = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const result = await mongodb.getDb().collection('bookings').findOne({ _id: new ObjectId(bookingId) });
        if (!result) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving booking', error });
    }
};

const createBooking = async (req, res) => {
    const { firstName, lastName, email, price, discount, paymentStatus, packageCode } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !price || !discount || !paymentStatus || !packageCode ) {
        return res.status(400).json({ message: 'All fields are required: firstName, lastName, email, price, discount, paymentStatus, packageCode' });
    }

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
};

const updateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const { packageCode, firstName, lastName, email, price, discount, paymentStatus } = req.body;

    // Validate required fields
    if (!packageCode || !firstName || !lastName || !email || !price || !discount || !paymentStatus) {
        return res.status(400).json({ message: 'All fields are required: packageCode, firstName, lastName, email, price, discount, paymentStatus' });
    }

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
};

const deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const result = await mongodb.getDb().collection('bookings').deleteOne({ _id: new ObjectId(bookingId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
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