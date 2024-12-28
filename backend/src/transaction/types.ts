import {Transaction} from './entities/transaction.entity'

export type CreateTransaction = Pick<Transaction, 'transactionId'| 'currency' | 'amount' | 'senderWallet' | 'recipientWallet'>;
