import { Injectable, BadRequestException, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { WalletRepository } from '../wallet.repository';
import { WalletValidator } from './wallet-validator.service';
import { RedisService } from '../../redis/redis.service';
import { CheckWallet } from '../types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schema/user.schema';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletValidator: WalletValidator,
    private readonly walletRepository: WalletRepository,
    private readonly redisService: RedisService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createWalletDto: CreateWalletDto, @Req() request: Request) {
    await this.walletValidator.validateOnCreate(createWalletDto);
    createWalletDto.userId = request['user']['userId'];
    const wallet = await this.walletRepository.insertOne(createWalletDto);
    await this.userModel
      .findOneAndUpdate(
        { email: request['user']['email'] },
        { $push: { wallet: wallet } },
        { new: true },
      )
      .exec();
    return { message: 'Wallet created successfully' };
  }

  async findAll(@Req() request: Request) {
    const userId = request['user']['userId'];
    return await this.walletRepository.get(userId);
  }

  async checkWallet(wallet: CheckWallet) {
    const reciepientWallet = await this.walletRepository.getOne(
      wallet.walletId,
    );
    const currency = reciepientWallet.currency.toUpperCase();
    const data = await this.redisService.getExchangeRates();
    const usdAmount = wallet.amount / data[wallet.currency.toUpperCase()];
    const receivingAmount = data[currency] * usdAmount;
    return { amount: receivingAmount, currency: currency };
  }

  async overview(@Req() request: Request) {
    const email = request['user']['email'];
    const user = await this.userModel.findOne({ email: email }).exec();
    const data = await this.redisService.getExchangeRates();
    let totalBalance = 0;
    for (let wallet of user.wallet){
      const balance = wallet['balance']
      const usdAmount = balance / data[wallet['currency'].toUpperCase()];
      totalBalance += usdAmount;
    }
    for (let transaction of user.transaction){
      const usdAmount = transaction['amount'] / data[transaction['currency'].toUpperCase()];
      transaction['usdAmount'] = usdAmount;
    }
    return {
      availableBalance: totalBalance,
      incoming: user.incoming,
      expenses: user.expenses,
      transactions: user.transaction
    }
  }
}
