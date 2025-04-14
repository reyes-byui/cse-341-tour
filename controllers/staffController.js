const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator'); // Correct 
const { ensureAuthenticated } = require('../middleware/auth');

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
    console.log('getSingle called with ID:', req.params.id); // Debug log
    const staffId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(staffId)) {
        return res.status(400).json({ message: 'Invalid staff ID format' });
    }

    try {
        const result = await mongodb.getDatabase().collection('staff').findOne({ _id: new ObjectId(staffId) });
        if (!result) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getSingle:', error); // Debug log
        res.status(500).json({ message: 'Error retrieving item', error });
    }
};

const createStaff = async (req, res) => {
    console.log('createStaff called with body:', req.body); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
        const result = await mongodb.getDatabase().collection('staff').insertOne(staff);
        res.status(201).json({ message: 'Staff created successfully', data: result });
    } catch (error) {
        console.error('Error in createStaff:', error); // Debug log
        res.status(500).json({ message: 'Error creating staff', error });
    }
};

const updateStaff = async (req, res) => {
    console.log('updateStaff called with ID:', req.params.id, 'and body:', req.body); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const staffId = req.params.id;
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
        const result = await mongodb.getDatabase().collection('staff').updateOne(
            { _id: new ObjectId(staffId) },
            { $set: staff }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json({ message: 'Staff updated successfully', data: result });
    } catch (error) {
        console.error('Error in updateStaff:', error); // Debug log
        res.status(500).json({ message: 'Error updating staff', error });
    }
};

const deleteStaff = async (req, res) => {
    console.log('deleteStaff called with ID:', req.params.id); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const staffId = req.params.id;
    try {
        const result = await mongodb.getDatabase().collection('staff').deleteOne({ _id: new ObjectId(staffId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error in deleteStaff:', error); // Debug log
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