const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        try {
            const db = mongodb.getDb();
            const promotionsTrash = await db.collection('promotions_trash').find().toArray();
            res.status(200).json(promotionsTrash);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving promotions from trash', error });
        }
    });
};

const getSingle = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const promotionId = req.params.id;

        if (!ObjectId.isValid(promotionId)) {
            return res.status(400).json({ message: 'Invalid promotion ID format' });
        }

        try {
            const db = mongodb.getDb();
            const promotion = await db.collection('promotions_trash').findOne({ _id: new ObjectId(promotionId) });

            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found in trash' });
            }

            res.status(200).json(promotion);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving promotion from trash', error });
        }
    });
};

const recoverPromotion = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const promotionId = req.params.id;

        if (!ObjectId.isValid(promotionId)) {
            return res.status(400).json({ message: 'Invalid promotion ID format' });
        }

        try {
            const db = mongodb.getDb();
            const promotion = await db.collection('promotions_trash').findOne({ _id: new ObjectId(promotionId) });

            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found in trash' });
            }

            await db.collection('promotions').insertOne({ ...promotion, restoredAt: new Date() });

            await db.collection('promotions_trash').deleteOne({ _id: new ObjectId(promotionId) });

            res.status(200).json({ message: 'Promotion recovered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error recovering promotion', error });
        }
    });
};

const deletePermanently = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const promotionId = req.params.id;

        if (!ObjectId.isValid(promotionId)) {
            return res.status(400).json({ message: 'Invalid promotion ID format' });
        }

        try {
            const db = mongodb.getDb();
            const result = await db.collection('promotions_trash').deleteOne({ _id: new ObjectId(promotionId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Promotion not found in trash' });
            }

            res.status(200).json({ message: 'Promotion permanently deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting promotion permanently', error });
        }
    });
};

module.exports = {
    getAll,
    getSingle,
    recoverPromotion,
    deletePermanently
};
