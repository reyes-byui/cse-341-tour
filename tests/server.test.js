const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
    it('should return 200 for the root route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Logged Out');
    });

    it('should return 401 for protected routes without authentication', async () => {
        const res = await request(app).get('/data/staff');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Unauthorized access. Please log in with the correct GitHub account.');
    });

    it('should return 404 for undefined routes', async () => {
        const res = await request(app).get('/undefined-route');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Route not found');
    });

});
