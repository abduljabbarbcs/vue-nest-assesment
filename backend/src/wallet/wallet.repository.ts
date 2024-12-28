import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Wallet } from './entities/wallet.entity';
import { CreateWallet, CheckWallet } from './types';

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  private readonly logger = new Logger(WalletRepository.name);
  constructor(private readonly dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }
  async insertOne(wallet: CreateWallet): Promise<Wallet> {
    try {
      return await this.save(wallet);
    } catch (error) {
      throw new Error('Db Error: ' + error.message);
    }
  }

  async get(userId: string): Promise<Wallet[]> {
    try {
      return await this.find({ where: { userId } });
    } catch (error) {
      this.logger.error(error);
      throw new Error('Db Error: ' + error.message);
    }
  }

  async getOne(walletId: number): Promise<Wallet> {
    try {
      return await this.findOne({ where: { walletId } });
    } catch (error) {
      this.logger.error(error);
      throw new Error('Db Error: ' + error.message);
    }
  }

  async getUser(walletId: number): Promise<string> {
    try {
       const user = await this.find({
            relations: ['userId'],
            where:  { walletId }
        }
        )
        return user[0]['userId'];
    } catch (error) {
      throw new Error('Db Error: ' + error.message);
    }
  }
}
