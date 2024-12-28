import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsUUID,
  isUUID,
  isNotEmpty,
} from 'class-validator';

export class CreateTransactionDto {

  transactionId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsNumber()
  @IsNotEmpty()
  senderWallet: number;
  @IsNumber()
  @IsNotEmpty()
  recipientWallet: number;
}
