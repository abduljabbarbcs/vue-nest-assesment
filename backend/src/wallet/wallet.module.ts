import { Module } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { WalletValidator } from './services/wallet-validator.service';
import { WalletController } from './wallet.controller';
import { WalletRepository } from './wallet.repository';
import { RedisService } from '../redis/redis.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/permission.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from '../schema/user.schema'


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletRepository,
    WalletValidator,
    RedisService,
    JwtAuthGuard,
    RolesGuard,
    AuthModule,
  ],
  exports: [WalletRepository, WalletValidator],
})
export class WalletModule {}
