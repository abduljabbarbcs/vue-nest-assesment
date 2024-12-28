import {RedisService} from '../redis/redis.service'

export async function convertToUsd(currency: string, amount: number): Promise<number>{
    const redisService = new RedisService()
    const data = await redisService.getExchangeRates();
    return amount / data[currency.toUpperCase()];
}

export async function convertToRecipientCurrency(currency: string, usdAmount: number){
    const redisService = new RedisService()
    const data = await redisService.getExchangeRates();
    return  data[currency.toUpperCase()] * usdAmount;
}