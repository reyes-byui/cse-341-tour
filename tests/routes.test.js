const request = require('supertest');
const app = require('../server');

describe('Routes', () => {
    it('should return 200 for /api-docs', async () => {
        const res = await request(app).get('/api-docs').redirects(1);
        expect(res.statusCode).toBe(200);
    });

    it('should return 404 for an undefined route', async () => {
        const res = await request(app).get('/undefined-route');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Route not found');
    });
});
