import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';

@Entity({ schema: 'public', name: 'wallet' })
export class Wallet extends BaseEntity {
  @PrimaryColumn({
    name: 'wallet_id',
    type: 'int',
    nullable: false,
    unique: true,
  })
  walletId: number;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  currency: string;

  @Column({
    name: 'balance',
    type: 'real',
    nullable: false,
  })
  balance: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: string;

  @ManyToOne(() => Auth, (auth) => auth.userId)
  @JoinColumn({ name: 'owner' })
  userId: string;
}
