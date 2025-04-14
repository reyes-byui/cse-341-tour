const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator'); // Import validationResult
const { ensureAuthenticated } = require('../middleware/auth');

const getAll = async (req, res) => {
    //#swagger.tags=['Promotions']
    try {
        const result = await mongodb.getDb().collection('promotions').find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving promotions', error });
    }
};

const getSingle = async (req, res) => {
    try {
        const promotionId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().collection('promotions').findOne({ _id: new ObjectId(promotionId) });
        if (!result) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving promotion', error });
    }
};

const createPromotion = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, continent, country, price, pax, inclusions, description, availability, discountRate, packageCode, startDate, endDate } = req.body;

        const promotionData = {
            name,
            continent,
            country,
            price,
            pax,
            inclusions,
            description,
            availability,
            discountRate,
            packageCode,
            startDate,
            endDate
        };

        try {
            const result = await mongodb.getDb().collection('promotions').insertOne(promotionData);
            res.status(201).json({ message: 'Promotion created successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error creating promotion', error });
        }
    });
};

const updatePromotion = async (req, res) => {
    ensureAuthenticated(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const promotionId = req.params.id;
        const { name, continent, country, price, pax, inclusions, description, availability, discountRate, packageCode, startDate, endDate } = req.body;

        const promotionData = {
            name,
            continent,
            country,
            price,
            pax,
            inclusions,
            description,
            availability,
            discountRate,
            packageCode,
            startDate,
            endDate
        };

        try {
            const result = await mongodb.getDb().collection('promotions').updateOne(
                { _id: new ObjectId(promotionId) },
                { $set: promotionData }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Promotion not found' });
            }
            res.status(200).json({ message: 'Promotion updated successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error updating promotion', error });
        }
    });
};

const deletePromotion = async (req, res) => {
    const promotionId = req.params.id;

    if (!ObjectId.isValid(promotionId)) {
        return res.status(400).json({ message: 'Invalid promotion ID format' });
    }

    try {
        const db = mongodb.getDb();
        const promotion = await db.collection('promotions').findOne({ _id: new ObjectId(promotionId) });

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        // Move promotion to trash collection
        await db.collection('promotions_trash').insertOne({ ...promotion, deletedAt: new Date() });

        // Delete promotion from the original collection
        await db.collection('promotions').deleteOne({ _id: new ObjectId(promotionId) });

        res.status(200).json({ message: 'Promotion moved to trash successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting promotion', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createPromotion,
    updatePromotion,
    deletePromotion
};