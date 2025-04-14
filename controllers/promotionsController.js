const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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
    const promotionId = req.params.id;
    try {
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
    const { name, continent, country, price, pax, inclusions, description, availability, discountRate, packageCode, startDate, endDate } = req.body;

    // Validate required fields
    if (!name || !continent || !country || !price || !pax || !inclusions || !description || !availability || !discountRate || !packageCode || !startDate || !endDate) {
        return res.status(400).json({ message: 'All fields are required: name, continent, country, price, pax, inclusions, description, availability, discountRate, packageCode, startDate, endDate' });
    }

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
};

const updatePromotion = async (req, res) => {
    const promotionId = req.params.id;
    const { name, continent, country, price, pax, inclusions, description, availability, discountRate, packageCode, startDate, endDate } = req.body;

    // Validate required fields
    if (!name || !continent || !country || !price || !pax || !inclusions || !description || !availability || !discountRate || !packageCode || !startDate || !endDate) {
        return res.status(400).json({ message: 'All fields are required: name, continent, country, price, pax, inclusions, description, availability, discountRate, packageCode, startDate, endDate' });
    }

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
};

const deletePromotion = async (req, res) => {
    const promotionId = req.params.id;
    try {
        const result = await mongodb.getDb().collection('promotions').deleteOne({ _id: new ObjectId(promotionId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.status(200).json({ message: 'Promotion deleted successfully' });
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