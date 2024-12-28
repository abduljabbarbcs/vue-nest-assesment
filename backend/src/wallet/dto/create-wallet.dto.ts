import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateWalletDto {
    @IsNumber()
  @IsNotEmpty()
    walletId: number;
    @IsString()
    @IsNotEmpty()
    currency: string;
    @IsNumber()
    @IsNotEmpty()
    balance: number;
    userId: string;
}
