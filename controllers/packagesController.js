const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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
    const packageId = req.params.id;
    try {
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
    const { name, continent, country, price, pax, inclusion, description, availability, packageCode } = req.body;

    // Validate required fields
    if (!name || !continent || !country || !price || !pax || !inclusion || !description || !availability || !packageCode) {
        return res.status(400).json({ message: 'All fields are required: name, continent, country, price, pax, inclusion, description, availability, packageCode' });
    }

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
};

const updatePackage = async (req, res) => {
    const packageId = req.params.id;
    const { name, continent, country, price, pax, inclusion, description, availability, packageCode } = req.body;

    // Validate required fields
    if (!name || !continent || !country || !price || !pax || !inclusion || !description || !availability || !packageCode) {
        return res.status(400).json({ message: 'All fields are required: name, continent, country, price, pax, inclusion, description, availability, packageCode' });
    }

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
};

const deletePackage = async (req, res) => {
    const packageId = req.params.id;
    try {
        const result = await mongodb.getDb().collection('packages').deleteOne({ _id: new ObjectId(packageId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json({ message: 'Package deleted successfully' });
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