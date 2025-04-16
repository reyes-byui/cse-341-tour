const request = require('supertest');
const app = require('../server');

describe('Swagger Documentation', () => {
    it('should serve Swagger UI at /api-docs', async () => {
        const res = await request(app).get('/api-docs').redirects(1); // Follow redirects
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Swagger UI');
    });
});
