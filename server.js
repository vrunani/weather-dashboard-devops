const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ── 1. Geocode city → lat/lon (Open-Meteo geocoding, free, no key) ───────────
async function geocodeCity(city) {
  const url  = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res  = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }
  const r = data.results[0];
  return {
    lat:      r.latitude,
    lon:      r.longitude,
    city:     r.name,
    country:  r.country_code,
    timezone: r.timezone,
  };
}

// ── 2. Fetch live weather from Open-Meteo (free, no key) ─────────────────────
async function fetchOpenMeteo(lat, lon, timezone) {
  const params = new URLSearchParams({
    latitude:  lat,
    longitude: lon,
    timezone,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    daily:         'temperature_2m_max,temperature_2m_min,sunrise,sunset',
    forecast_days: '1',
  });
  const res  = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const data = await res.json();
  return data;
}

// ── 3. WMO code → description + OWM-compatible icon ─────────────────────────
function wmoToCondition(code) {
  const map = {
    0:  { desc: 'Clear sky',           icon: '01d' },
    1:  { desc: 'Mainly clear',        icon: '01d' },
    2:  { desc: 'Partly cloudy',       icon: '02d' },
    3:  { desc: 'Overcast',            icon: '04d' },
    45: { desc: 'Foggy',               icon: '50d' },
    48: { desc: 'Icy fog',             icon: '50d' },
    51: { desc: 'Light drizzle',       icon: '09d' },
    53: { desc: 'Drizzle',             icon: '09d' },
    55: { desc: 'Heavy drizzle',       icon: '09d' },
    61: { desc: 'Slight rain',         icon: '10d' },
    63: { desc: 'Rain',                icon: '10d' },
    65: { desc: 'Heavy rain',          icon: '10d' },
    71: { desc: 'Slight snow',         icon: '13d' },
    73: { desc: 'Snow',                icon: '13d' },
    75: { desc: 'Heavy snow',          icon: '13d' },
    80: { desc: 'Slight showers',      icon: '09d' },
    81: { desc: 'Showers',             icon: '09d' },
    82: { desc: 'Heavy showers',       icon: '09d' },
    95: { desc: 'Thunderstorm',        icon: '11d' },
    96: { desc: 'Thunderstorm + hail', icon: '11d' },
    99: { desc: 'Heavy thunderstorm',  icon: '11d' },
  };
  return map[code] || { desc: 'Unknown', icon: '01d' };
}

// ── 4. Wind degrees → compass label ──────────────────────────────────────────
function degToDir(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── 5. Groq AI one-liner summary (best-effort, skipped if no key) ─────────────
async function getGroqSummary(weatherData) {
  if (!GROQ_KEY) return null;

  const prompt = `You are a witty weather assistant. Given this real-time weather, write ONE punchy sentence (max 15 words) of advice for going outside. Be specific.

City: ${weatherData.city}, Temp: ${weatherData.temperature}°C (feels ${weatherData.feelsLike}°C), ${weatherData.condition}, Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} m/s

Reply with ONLY the sentence. No quotes.`;

  try {
    const res = await fetch(GROQ_URL, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'llama3-8b-8192',
        max_tokens: 60,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather Dashboard running' });
});

app.get('/api/weather', async (req, res) => {
  const cityQuery = req.query.city || 'Pune';

  try {
    const geo  = await geocodeCity(cityQuery);
    const wx   = await fetchOpenMeteo(geo.lat, geo.lon, geo.timezone);
    const cur  = wx.current;
    const day  = wx.daily;
    const cond = wmoToCondition(cur.weather_code);

    const weatherData = {
      city:          geo.city,
      country:       geo.country,
      temperature:   Math.round(cur.temperature_2m),
      feelsLike:     Math.round(cur.apparent_temperature),
      tempMax:       Math.round(day.temperature_2m_max[0]),
      tempMin:       Math.round(day.temperature_2m_min[0]),
      humidity:      cur.relative_humidity_2m,
      pressure:      Math.round(cur.surface_pressure),
      visibility:    '10',                               // Open-Meteo free tier doesn't include visibility
      windSpeed:     cur.wind_speed_10m,                 // m/s
      windDeg:       cur.wind_direction_10m,
      windDirection: degToDir(cur.wind_direction_10m),
      condition:     cond.desc,
      iconCode:      cond.icon,
      sunrise:       day.sunrise[0]?.slice(11, 16) || '—',
      sunset:        day.sunset[0]?.slice(11, 16)  || '—',
      localTime:     new Date().toLocaleTimeString('en-IN', {
        timeZone: geo.timezone,
        hour:     '2-digit',
        minute:   '2-digit',
      }),
      aiSummary: null,
    };

    // Groq summary — non-blocking
    weatherData.aiSummary = await getGroqSummary(weatherData);

    res.json(weatherData);

  } catch (err) {
    console.error('Weather error:', err.message);
    res.status(404).json({ error: err.message || 'Failed to fetch weather' });
  }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
