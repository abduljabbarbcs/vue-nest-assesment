import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CronJobService } from './cronJob/cronJob.service';
import { RedisService } from './redis/redis.service';
import { TransactionModule } from './transaction/transaction.module';
import { MongooseModule } from '@nestjs/mongoose';
import {AuthSeeder} from './seeder/auth.seeder'
import { Role } from './auth/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:27017/wallet?authSource=admin`
    ),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    WalletModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronJobService, RedisService, AuthSeeder],
})
export class AppModule {}
