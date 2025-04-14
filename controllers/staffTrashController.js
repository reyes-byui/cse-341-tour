const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        try {
            const db = mongodb.getDb();
            const staffTrash = await db.collection('staff_trash').find().toArray();
            res.status(200).json(staffTrash);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving staff from trash', error });
        }
    });
};

const getSingle = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const staffId = req.params.id;

        if (!ObjectId.isValid(staffId)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        try {
            const db = mongodb.getDb();
            const staff = await db.collection('staff_trash').findOne({ _id: new ObjectId(staffId) });

            if (!staff) {
                return res.status(404).json({ message: 'Staff not found in trash' });
            }

            res.status(200).json(staff);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving staff from trash', error });
        }
    });
};

const recoverStaff = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const staffId = req.params.id;

        if (!ObjectId.isValid(staffId)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        try {
            const db = mongodb.getDb();
            const staff = await db.collection('staff_trash').findOne({ _id: new ObjectId(staffId) });

            if (!staff) {
                return res.status(404).json({ message: 'Staff not found in trash' });
            }

            await db.collection('staff').insertOne({ ...staff, restoredAt: new Date() });

            await db.collection('staff_trash').deleteOne({ _id: new ObjectId(staffId) });

            res.status(200).json({ message: 'Staff recovered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error recovering staff', error });
        }
    });
};

const deletePermanently = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const staffId = req.params.id;

        if (!ObjectId.isValid(staffId)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        try {
            const db = mongodb.getDb();
            const result = await db.collection('staff_trash').deleteOne({ _id: new ObjectId(staffId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Staff not found in trash' });
            }

            res.status(200).json({ message: 'Staff permanently deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting staff permanently', error });
        }
    });
};

module.exports = {
    getAll,
    getSingle,
    recoverStaff,
    deletePermanently
};
