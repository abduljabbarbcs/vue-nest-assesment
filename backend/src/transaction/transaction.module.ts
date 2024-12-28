import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './transaction.controller';
import { RedisService } from '../redis/redis.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/permission.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import {WalletModule} from '../wallet/wallet.module'
import { TransactionRepository } from './transaction.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from '../schema/user.schema'

@Module({
  controllers: [TransactionController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
    AuthModule,
    WalletModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    TransactionService,
    RedisService,
    RedisService,
    JwtAuthGuard,
    RolesGuard,
    AuthModule,
    TransactionRepository,
  ],
})
export class TransactionModule {}
