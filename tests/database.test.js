const { initDb, getDb } = require('../data/database');

describe('Database Connection', () => {
    it('should throw an error if the database is not initialized', () => {
        expect(() => getDb()).toThrow('Database not initialized!');
    });

});
