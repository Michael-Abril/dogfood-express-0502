const express = require('express');
const Redis = require('ioredis');
const { Pool } = require('pg');

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

app.get('/sidecar-check', async (req, res) => {
  const result = {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    redisUrl: Boolean(process.env.REDIS_URL),
    postgres: 'not_checked',
    redis: 'not_checked'
  };

  let pool;
  let redis;
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query('select 1');
    result.postgres = 'ok';

    redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000
    });
    await redis.connect();
    await redis.set('varity:sidecar-check', 'ok', 'EX', 60);
    result.redis = await redis.get('varity:sidecar-check');

    res.json(result);
  } catch (error) {
    result.error = error.message;
    res.status(500).json(result);
  } finally {
    if (redis) redis.disconnect();
    if (pool) await pool.end().catch(() => {});
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express API running on port ${PORT}`);
});
