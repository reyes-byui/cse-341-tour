const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log('Database is already initialized!');
        return callback(null, _db);
    }

    MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((client) => {
            _db = client.db('final');
            console.log('Database connected successfully!');
            callback(null, _db);
        })
        .catch((err) => {
            console.error('Failed to connect to the database:', err);
            callback(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized!');
    }
    return _db;
};

const queryDb = async ({ collection, filter }) => {
    if (!_db) {
        throw new Error('Database not initialized!');
    }
    return _db.collection(collection).find(filter).toArray();
};

module.exports = { initDb, getDb, queryDb };