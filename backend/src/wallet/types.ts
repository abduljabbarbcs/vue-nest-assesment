import {Wallet} from './entities/wallet.entity'

export type CreateWallet = Pick<Wallet, 'walletId' | 'currency' | 'balance' | 'userId'>;

export type DoesWalletExist = Pick<CreateWallet, 'walletId'>;

export type CheckWallet = {
    walletId: number;
    amount: number;
    currency: string;
}
