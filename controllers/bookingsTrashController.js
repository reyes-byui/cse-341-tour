const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        try {
            const db = mongodb.getDb();
            const bookingsTrash = await db.collection('bookings_trash').find().toArray();
            res.status(200).json(bookingsTrash);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings from trash', error });
        }
    });
};

const getSingle = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const bookingId = req.params.id;

        if (!ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID format' });
        }

        try {
            const db = mongodb.getDb();
            const booking = await db.collection('bookings_trash').findOne({ _id: new ObjectId(bookingId) });

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found in trash' });
            }

            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving booking from trash', error });
        }
    });
};

const recoverBooking = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const bookingId = req.params.id;

        if (!ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID format' });
        }

        try {
            const db = mongodb.getDb();
            const booking = await db.collection('bookings_trash').findOne({ _id: new ObjectId(bookingId) });

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found in trash' });
            }

            // Restore booking to the original collection
            await db.collection('bookings').insertOne({ ...booking, restoredAt: new Date() });

            // Remove booking from the trash collection
            await db.collection('bookings_trash').deleteOne({ _id: new ObjectId(bookingId) });

            res.status(200).json({ message: 'Booking recovered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error recovering booking', error });
        }
    });
};

const deletePermanently = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const bookingId = req.params.id;

        if (!ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID format' });
        }

        try {
            const db = mongodb.getDb();
            const result = await db.collection('bookings_trash').deleteOne({ _id: new ObjectId(bookingId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Booking not found in trash' });
            }

            res.status(200).json({ message: 'Booking permanently deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting booking permanently', error });
        }
    });
};

module.exports = {
    getAll,
    getSingle,
    recoverBooking,
    deletePermanently
};
