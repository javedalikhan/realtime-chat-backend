import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Health Check', () => {
    it('should return 200 on /health', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('OK');
        expect(res.body).toHaveProperty('timestamp'); // optional check
    });
});