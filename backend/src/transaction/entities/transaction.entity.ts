import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity({ schema: 'public', name: 'transaction' })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'transaction_id',
  })
  transactionId: string;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  currency: string;

  @Column({
    name: 'amount',
    type: 'int',
    nullable: false,
  })
  amount: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: string;

  @ManyToOne(() => Wallet, (wallet: Wallet) => wallet.walletId)
  @JoinColumn({ name: 'sender_wallet' })
  senderWallet: number;

  @ManyToOne(() => Wallet, (wallet: Wallet) => wallet.walletId)
  @JoinColumn({ name: 'recipient_wallet' })
  recipientWallet: number;
}
