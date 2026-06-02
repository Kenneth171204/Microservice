const redis = require('redis');

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

(async () => {
    try {
        await client.connect();
        console.log('Redis connected');
    } catch (error) {
        console.log('Redis connection failed');
    }
})();

module.exports = client;