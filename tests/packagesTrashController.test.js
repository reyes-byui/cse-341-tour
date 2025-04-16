const { getAll, getSingle, recoverPackage, deletePermanently } = require('../controllers/packagesTrashController');
const mongodb = require('../data/database');

jest.mock('../data/database', () => ({
    getDb: jest.fn(() => ({
        collection: jest.fn().mockReturnValue({
            find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
        }),
    })),
}));

describe('Packages Trash Controller', () => {
    beforeEach(() => {
        mongodb.getDb.mockClear();
    });

    it('should retrieve all packages from trash', async () => {
        const req = { session: { user: { username: 'reyes-byui' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
});
