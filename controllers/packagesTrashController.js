const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        try {
            const db = mongodb.getDb();
            const packagesTrash = await db.collection('packages_trash').find().toArray();
            res.status(200).json(packagesTrash);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving packages from trash', error });
        }
    });
};

const getSingle = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const packageId = req.params.id;

        if (!ObjectId.isValid(packageId)) {
            return res.status(400).json({ message: 'Invalid package ID format' });
        }

        try {
            const db = mongodb.getDb();
            const packageData = await db.collection('packages_trash').findOne({ _id: new ObjectId(packageId) });

            if (!packageData) {
                return res.status(404).json({ message: 'Package not found in trash' });
            }

            res.status(200).json(packageData);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving package from trash', error });
        }
    });
};

const recoverPackage = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const packageId = req.params.id;

        if (!ObjectId.isValid(packageId)) {
            return res.status(400).json({ message: 'Invalid package ID format' });
        }

        try {
            const db = mongodb.getDb();
            const packageData = await db.collection('packages_trash').findOne({ _id: new ObjectId(packageId) });

            if (!packageData) {
                return res.status(404).json({ message: 'Package not found in trash' });
            }

            await db.collection('packages').insertOne({ ...packageData, restoredAt: new Date() });

            await db.collection('packages_trash').deleteOne({ _id: new ObjectId(packageId) });

            res.status(200).json({ message: 'Package recovered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error recovering package', error });
        }
    });
};

const deletePermanently = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const packageId = req.params.id;

        if (!ObjectId.isValid(packageId)) {
            return res.status(400).json({ message: 'Invalid package ID format' });
        }

        try {
            const db = mongodb.getDb();
            const result = await db.collection('packages_trash').deleteOne({ _id: new ObjectId(packageId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Package not found in trash' });
            }

            res.status(200).json({ message: 'Package permanently deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting package permanently', error });
        }
    });
};

module.exports = {
    getAll,
    getSingle,
    recoverPackage,
    deletePermanently
};
