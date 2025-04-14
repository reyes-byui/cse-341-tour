const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Staff']
    try {
        const result = await mongodb.getDatabase().collection('staff').find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving items', error });
    }
};

const getSingle = async (req, res) => {
    const staffId = req.params.id;
    try {
        const result = await mongodb.getDatabase().collection('staff').findOne({ _id: new ObjectId(staffId) });
        if (!result) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving item', error });
    }
};

const createStaff = async (req, res) => {
    const { userName, password, firstName, lastName, email, position } = req.body;

    // Validate required fields
    if (!userName || !password || !firstName || !lastName || !email || !position) {
        return res.status(400).json({ message: 'All fields are required: userName, password, firstName, lastName, email, position' });
    }

    const staff = {
        userName,
        password,
        firstName,
        lastName,
        email,
        position
    };

    try {
        const result = await mongodb.getDatabase().collection('staff').insertOne(staff);
        res.status(201).json({ message: 'Staff created successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating staff', error });
    }
};

const updateStaff = async (req, res) => {
    const staffId = req.params.id;
    const { userName, password, firstName, lastName, email, position } = req.body;

    // Validate required fields
    if (!userName || !password || !firstName || !lastName || !email || !position) {
        return res.status(400).json({ message: 'All fields are required: userName, password, firstName, lastName, email, position' });
    }

    const staff = {
        userName,
        password,
        firstName,
        lastName,
        email,
        position
    };

    try {
        const result = await mongodb.getDatabase().collection('staff').updateOne(
            { _id: new ObjectId(staffId) },
            { $set: staff }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json({ message: 'Staff updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating staff', error });
    }
};

const deleteStaff = async (req, res) => {
    const staffId = req.params.id;
    try {
        const result = await mongodb.getDatabase().collection('staff').deleteOne({ _id: new ObjectId(staffId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createStaff,
    updateStaff,
    deleteStaff
};