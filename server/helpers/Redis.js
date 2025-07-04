const redis = require('redis');
const { REDIS_URL = 'localhost', REDIS_PORT = 6379 } = process.env;

const client = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`
});

client.on('error', (err) => console.error('Redis Error:', err.message));
client.on('connect', () => console.log('Redis connected'));

// Connect to Redis 
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Redis connection failed. Running without cache.');
  }
})();

// Simple cache set/get functions
const setCache = async (key, value, ttl = 3600) => {
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error('Cache set error:', err.message);
  }
};

const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Cache get error:', err.message);
    return null;
  }
};

// Clear cache by pattern
const clearCache = async (pattern) => {
  try {
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(keys);
  } catch (err) {
    console.error('Cache clear error:', err.message);
  }
};

module.exports = { client, setCache, getCache, clearCache };