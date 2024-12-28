import { Injectable, Req } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionRepository } from '../transaction.repository';
import { WalletRepository } from '../../wallet/wallet.repository';
import { Model } from 'mongoose';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schema/user.schema';
import { convertToUsd } from '../../utils/utils';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(
    createTransactionDto: CreateTransactionDto,
    @Req() request: Request,
  ) {
    const transactionInfo = await this.transactionRepository.insertOne({
      ...createTransactionDto,
      currency: '',
    });
    const transaction = transactionInfo['transaction'];
    const recipientUser = await this.walletRepository.getUser(
      transaction.recipientWallet,
    );
    const usdAmount = await convertToUsd(
      transaction.currency,
      transaction.amount,
    );
    await this.userModel.updateOne(
      {
        email: request['user']['email'],
        'wallet.walletId': transaction.senderWallet,
      },
      {
        $inc: {
          'wallet.$.balance': -transaction.amount,
          expenses: +usdAmount,
        },
        $push: {
          transaction: {
            name: recipientUser['name'],
            currency: transaction.currency,
            amount: transaction.amount,
            createdAt: new Date(transaction.createdAt).toLocaleDateString(
              'en-CA',
            ),
            status: 'outbound',
          },
        },
      },
    );
    await this.userModel.updateOne(
      {
        email: recipientUser['email'],
        'wallet.walletId': transaction.recipientWallet,
      },
      {
        $inc: {
          'wallet.$.balance': +transactionInfo['recipientAmount'],
          incoming: +usdAmount,
        },
        $push: {
          transaction: {
            name: request['user']['name'],
            currency: transaction.currency,
            amount: transaction.amount,
            createdAt: new Date(transaction.createdAt).toLocaleDateString(
              'en-CA',
            ),
            status: 'inbound',
          },
        },
      },
    );
    return transaction;
  }

  async findAll(limit: number, offset: number, @Req() req: Request) {
    const transactions = await this.transactionRepository.getAll(
      req['user']['email'],
      limit,
      offset
    );
    let transactionHistory = [];
    for (let transaction of transactions) {
      let history = {};
      history['transactionId'] = transaction['transaction_transaction_id'];
      history['created_at'] = new Date(
        transaction['transaction_created_at'],
      ).toLocaleDateString('en-CA');
      history['currency'] = transaction['transaction_currency'];
      history['amount'] = transaction['transaction_amount'];
      if (req['user']['email'] == transaction['senderemail']) {
        history['status'] = 'outbound';
        history['name'] = transaction['recipientname'];
        history['walletId'] = transaction['recipientWallet_wallet_id'];
      } else {
        history['status'] = 'inbound';
        history['name'] = transaction['sendername'];
        history['walletId'] = transaction['senderWallet_wallet_id'];
      }
      transactionHistory.push(history)
    }
    return transactionHistory;
  }

  async findAllAdmin(limit: number, offset: number) {
    const result = await this.transactionRepository.getAllAdmin(limit, offset);
    return result;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
