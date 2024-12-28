import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { WalletRepository } from '../wallet/wallet.repository';
import { CreateTransaction } from './types';
import { convertToUsd, convertToRecipientCurrency } from '../utils/utils';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  private readonly logger = new Logger(TransactionRepository.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly walletRepository: WalletRepository,
  ) {
    super(Transaction, dataSource.createEntityManager());
  }
  async insertOne(transactionInfo: CreateTransaction): Promise<Object> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock the sender's wallet
      const senderWallet = await queryRunner.manager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('pessimistic_write')
        .where('wallet.walletId = :walletId', {
          walletId: transactionInfo.senderWallet,
        })
        .getOne();

      if (!senderWallet) {
        throw new Error('Sender wallet not found');
      }
      if (senderWallet.balance < transactionInfo.amount) {
        throw new Error('Insufficient balance');
      }

      senderWallet.balance -= transactionInfo.amount;
      const usdAmount = await convertToUsd(
        senderWallet.currency,
        transactionInfo.amount,
      );

      await queryRunner.manager.save(senderWallet);

      const recipientWallet = await this.walletRepository.getOne(
        transactionInfo.recipientWallet,
      );
      const recipientAmount = await convertToRecipientCurrency(
        recipientWallet.currency,
        usdAmount,
      );

      recipientWallet.balance += recipientAmount;
      transactionInfo.currency = senderWallet.currency;
      const newTransaction = queryRunner.manager.create(
        Transaction,
        transactionInfo,
      );
      await queryRunner.manager.save(newTransaction);
      await this.walletRepository.save(recipientWallet);
      // Commit the transaction
      await queryRunner.commitTransaction();

      return { transaction: newTransaction, recipientAmount: recipientAmount };
    } catch (error) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction failed: ' + error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async getAll(
    userMail: string,
    limit: number,
    offset: number,
  ): Promise<Object[]> {
    try {
      return await this.createQueryBuilder('transaction')
        .innerJoinAndSelect(
          'wallet',
          'senderWallet',
          'transaction.senderWallet = senderWallet.walletId',
        )
        .innerJoinAndSelect(
          'auth',
          'senderUser',
          'senderWallet.userId = senderUser.userId',
        )
        .innerJoinAndSelect(
          'wallet',
          'recipientWallet',
          'transaction.recipientWallet = recipientWallet.walletId',
        )
        .innerJoinAndSelect(
          'auth',
          'recipientUser',
          'recipientWallet.userId = recipientUser.userId',
        )
        .where(
          `senderUser.email = '${userMail}' OR recipientUser.email = '${userMail}'`,
        )
        .select([
          'transaction.transactionId',
          'transaction.currency',
          'transaction.amount',
          'transaction.createdAt',
          'senderWallet.walletId',
          'senderUser.name AS senderName',
          'senderUser.email AS senderEmail',
          'recipientWallet.walletId',
          'recipientUser.name AS recipientName',
          'recipientUser.email AS recipientEmail',
        ])
        .limit(limit)
        .offset(offset)
        .getRawMany();
    } catch (error) {
      this.logger.error(error);
      throw new Error('Db Error: ' + error.message);
    }
  }
  async getAllAdmin(limit: number, offset: number): Promise<Transaction[]>{
    return await this.createQueryBuilder('transaction')
    .select([
      'transaction_id as "transactionId"',
      'currency',
      'amount',
      'created_at',
      'sender_wallet AS senderWallet', // Include FK
      'recipient_wallet AS recipientWallet', // Include FK
    ])
    .skip(offset)
    .take(limit)
    .getRawMany();
  }
}
