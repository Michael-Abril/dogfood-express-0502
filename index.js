const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'dogfood-express-0502', status: 'ok', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/api/items', (req, res) => {
  res.json({ items: [{ id: 1, name: 'Widget A' }, { id: 2, name: 'Widget B' }] });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`dogfood-express-0502 listening on port ${PORT}`);
});
