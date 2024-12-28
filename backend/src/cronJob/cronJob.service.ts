import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';

import { Inject } from '@nestjs/common';
import redis from '../redis/redis'

@Injectable()
export class CronJobService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  async onModuleInit() {
    await this.fetchAndCacheExchangeRates();
  }
  @Cron(CronExpression.EVERY_HOUR)
  async fetchAndCacheExchangeRates() {
    const cacheKey = 'exchange_rates';

    try {
      const { data } = await this.httpService
        .get('https://api.exchangerate-api.com/v4/latest/USD')
        .toPromise();
      console.log('Cron job started');
      await redis.set(cacheKey, JSON.stringify(data.rates), {
        EX: Number(process.env.REDIS_TTL)
      });
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
    }
  }
}
