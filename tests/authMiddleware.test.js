const { ensureAuthenticated } = require('../middleware/auth');

describe('Authentication Middleware', () => {
    it('should call next() if user is authenticated', () => {
        const req = { session: { user: { username: 'reyes-byui' } }, isAuthenticated: jest.fn().mockReturnValue(true) };
        const res = {};
        const next = jest.fn();

        ensureAuthenticated(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
        const req = { session: {}, isAuthenticated: jest.fn().mockReturnValue(false) };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized access. Please log in with the correct GitHub account.' });
    });
});
