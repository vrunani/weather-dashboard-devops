const request = require('supertest');
const app     = require('../server');

// Mock both external APIs so tests never hit the network
beforeAll(() => {
  global.fetch = jest.fn((url) => {
    // Open-Meteo geocoding
    if (url.includes('geocoding-api.open-meteo.com')) {
      return Promise.resolve({
        ok:   true,
        json: () => Promise.resolve({
          results: [{
            name:        'Pune',
            latitude:    18.5204,
            longitude:   73.8567,
            country_code:'IN',
            timezone:    'Asia/Kolkata',
          }],
        }),
      });
    }

    // Open-Meteo forecast
    if (url.includes('api.open-meteo.com')) {
      return Promise.resolve({
        ok:   true,
        json: () => Promise.resolve({
          current: {
            temperature_2m:        36,
            apparent_temperature:  38,
            relative_humidity_2m:  42,
            surface_pressure:      1005,
            wind_speed_10m:        3.2,
            wind_direction_10m:    270,
            weather_code:          0,
          },
          daily: {
            temperature_2m_max: [39],
            temperature_2m_min: [28],
            sunrise:  ['2024-05-15T06:02'],
            sunset:   ['2024-05-15T19:17'],
          },
        }),
      });
    }

    // Groq summary (optional — return null-like response)
    if (url.includes('groq.com')) {
      return Promise.resolve({
        ok:   true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Stay hydrated, it is scorching out there.' } }],
        }),
      });
    }

    return Promise.reject(new Error(`Unmocked URL: ${url}`));
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

// ── /health ───────────────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('returns status 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  it('returns status OK in body', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('OK');
  });
});

// ── /api/weather ──────────────────────────────────────────────────────────────
describe('GET /api/weather', () => {
  it('returns city data', async () => {
    const res = await request(app).get('/api/weather?city=Pune');
    expect(res.statusCode).toBe(200);
    expect(res.body.city).toBe('Pune');
  });

  it('has a temperature field', async () => {
    const res = await request(app).get('/api/weather?city=Pune');
    expect(res.body).toHaveProperty('temperature');
    expect(typeof res.body.temperature).toBe('number');
  });

  it('returns real-looking temperature (not hardcoded 28)', async () => {
    const res = await request(app).get('/api/weather?city=Pune');
    expect(res.body.temperature).toBe(36); // matches our mock
  });

  it('has all required weather fields', async () => {
    const res = await request(app).get('/api/weather?city=Pune');
    const required = ['city','country','temperature','feelsLike','tempMax','tempMin',
                      'humidity','pressure','windSpeed','windDirection','condition',
                      'iconCode','sunrise','sunset'];
    required.forEach(field => {
      expect(res.body).toHaveProperty(field);
    });
  });

  it('returns 404 for unknown city', async () => {
    // Override fetch just for this test to simulate city not found
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok:   true,
        json: () => Promise.resolve({ results: [] }),
      })
    );
    const res = await request(app).get('/api/weather?city=ZZZNotACity');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
