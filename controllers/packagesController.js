const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator'); // Import validationResult
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    //#swagger.tags=['Packages']
    try {
        const result = await mongodb.getDb().collection('packages').find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving packages', error });
    }
};

const getSingle = async (req, res) => {
    try {
        const packageId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().collection('packages').findOne({ _id: new ObjectId(packageId) });
        if (!result) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving package', error });
    }
};

const createPackage = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, continent, country, price, pax, inclusion, description, availability, packageCode } = req.body;

        const packageData = {
            name,
            continent,
            country,
            price,
            pax,
            inclusion,
            description,
            availability,
            packageCode
        };

        try {
            const result = await mongodb.getDb().collection('packages').insertOne(packageData);
            res.status(201).json({ message: 'Package created successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error creating package', error });
        }
    });
};

const updatePackage = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const packageId = req.params.id;
        const { name, continent, country, price, pax, inclusion, description, availability, packageCode } = req.body;

        const packageData = {
            name,
            continent,
            country,
            price,
            pax,
            inclusion,
            description,
            availability,
            packageCode
        };

        try {
            const result = await mongodb.getDb().collection('packages').updateOne(
                { _id: new ObjectId(packageId) },
                { $set: packageData }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Package not found' });
            }
            res.status(200).json({ message: 'Package updated successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error updating package', error });
        }
    });
};

const deletePackage = async (req, res) => {
    const packageId = req.params.id;

    if (!ObjectId.isValid(packageId)) {
        return res.status(400).json({ message: 'Invalid package ID format' });
    }

    try {
        const db = mongodb.getDb();
        const packageData = await db.collection('packages').findOne({ _id: new ObjectId(packageId) });

        if (!packageData) {
            return res.status(404).json({ message: 'Package not found' });
        }

        await db.collection('packages_trash').insertOne({ ...packageData, deletedAt: new Date() });

        await db.collection('packages').deleteOne({ _id: new ObjectId(packageId) });

        res.status(200).json({ message: 'Package moved to trash successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting package', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createPackage,
    updatePackage,
    deletePackage
};