import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from 'src/guards/permission.guard';
import { Roles } from '../decorators/role.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    return this.transactionService.create(createTransactionDto, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllUser(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Req() req: Request,
  ) {
    return this.transactionService.findAll(limit, offset, req);
  }

  @Get('admin')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.transactionService.findAllAdmin(limit, offset);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
