const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator'); // Correct 
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    //#swagger.tags=['Staff']
    ensureAuthenticated(req, res, async () => {
        try {
            const result = await mongodb.getDb().collection('staff').find().toArray();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving staff', error });
        }
    });
};

const getSingle = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        try {
            const staffId = new ObjectId(req.params.id);
            const result = await mongodb.getDb().collection('staff').findOne({ _id: staffId });
            if (!result) {
                return res.status(404).json({ message: 'Staff not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving staff', error });
        }
    });
};

const createStaff = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const staff = {
            userName: "jdfktu13",
            password: "njjdjfl134f",
            firstName: "Jake",
            lastName: "Blake",
            email: "jblake@streetlife.com",
            position: "Marketing Director"
        };

        try {
            const result = await mongodb.getDb().collection('staff').insertOne(staff);
            res.status(201).json({ message: 'Staff created successfully', staffId: result.insertedId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating staff', error });
        }
    });
};

const updateStaff = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const staffId = new ObjectId(req.params.id);
        const { userName, password, firstName, lastName, email, position } = req.body;

        const staff = {
            userName,
            password,
            firstName,
            lastName,
            email,
            position
        };
        try {
            const result = await mongodb.getDb().collection('staff').updateOne(
                { _id: staffId },
                { $set: staff }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Staff not found' });
            }
            res.status(200).json({ message: 'Staff updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating staff', error });
        }
    });
};

const deleteStaff = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const staffId = req.params.id;

        if (!ObjectId.isValid(staffId)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        try {
            const result = await mongodb.getDb().collection('staff').deleteOne({ _id: new ObjectId(staffId) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Staff not found' });
            }
            res.status(200).json({ message: 'Staff deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting staff', error });
        }
    });
};

module.exports = {
    getAll,
    getSingle,
    createStaff,
    updateStaff,
    deleteStaff
};