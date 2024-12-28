import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../wallet.repository';
import { CreateWallet, DoesWalletExist } from '../types';
import { ConflictException } from '@nestjs/common';
import {Wallet} from '../entities/wallet.entity'

@Injectable()
export class WalletValidator {
  constructor(private readonly walletRepository: WalletRepository) {}

  async validateOnCreate(options: CreateWallet): Promise<void> {
    const doesUserExist = await this.doesUserExist({
      walletId: options.walletId,
    });
    if (doesUserExist) {
      throw new ConflictException('wallet id already exists');
    }
  }

    async doesUserExist({ walletId }: DoesWalletExist): Promise<boolean> {
        return await this.walletRepository.exist({
          where: { walletId },
        });
      }
}
