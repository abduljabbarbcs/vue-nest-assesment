import { createClient, RedisClientType } from '@redis/client';
require('dotenv').config();

const redis = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });
  
  redis.connect();


export default redis;