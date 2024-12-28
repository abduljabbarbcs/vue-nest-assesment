import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Roles } from '../decorators/role.decorator';
import { RolesGuard } from '../guards/permission.guard';
import { JwtAuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: Request) {
    return this.walletService.create(createWalletDto, req);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request) {
    return this.walletService.findAll(req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(
    @Query('wallet_id') walletId: number,
    @Query('amount') amount: number,
    @Query('currency') currency: string,
  ) {
    return this.walletService.checkWallet({
      walletId: walletId,
      amount: amount,
      currency: currency,
    });
  }

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  overview(@Req() req: Request) {
    return this.walletService.overview(req);
  }
}
