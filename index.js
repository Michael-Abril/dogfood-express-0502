const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'dogfood-express-0502',
    version: '1.0.0',
    status: 'ok',
    message: 'Express API regression test — 2026-05-02',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/api/items', (req, res) => {
  res.json({
    items: [
      { id: 1, name: 'Widget A', price: 9.99 },
      { id: 2, name: 'Widget B', price: 19.99 },
      { id: 3, name: 'Widget C', price: 29.99 }
    ],
    total: 3
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express API running on port ${PORT}`);
});
