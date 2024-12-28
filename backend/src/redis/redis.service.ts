import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import redis from './redis';

@Injectable()
export class RedisService {
  async getExchangeRates(): Promise<any> {
    const cacheKey = 'exchange_rates';
    const data = await redis.get(cacheKey);
    const exchangeRates = JSON.parse(data);
    return exchangeRates;
  }

  async blackListToken(token: string, expTime: number): Promise<any> {
    const key = `blacklist_${token}`;
    await redis.set(key, 'blacklisted', {
      EX: expTime,
    });
  }

  async checkTokenBlackList(token: string): Promise<boolean> {
    const key = `blacklist_${token}`;
    if (await redis.get(key)) return true;
    else return false;
  }
}
