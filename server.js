const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather Dashboard running' });
});

app.get('/api/weather', (req, res) => {
  const city = req.query.city || 'Pune';
  res.json({ city, temperature: '28 C', humidity: '65%', condition: 'Partly Cloudy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on port ' + PORT));

module.exports = app; 
