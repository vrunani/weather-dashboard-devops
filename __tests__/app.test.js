const request = require('supertest');
const app = require('../server');

describe('Weather Dashboard Tests', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });
  test('GET /health returns status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('OK');
  });
  test('GET /api/weather returns city data', async () => {
    const res = await request(app).get('/api/weather?city=Pune');
    expect(res.statusCode).toBe(200);
    expect(res.body.city).toBe('Pune');
  });
  test('GET /api/weather has temperature field', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.body.temperature).toBeDefined();
  });
}); 
