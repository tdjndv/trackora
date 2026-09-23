import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() data: CreateTransactionDto,
  ) {
    return this.transactionService.create(userId, data);
  }

  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    console.log(query.search);
    return this.transactionService.findAll(userId, query);
  }

  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, userId, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.transactionService.remove(id, userId);
  }
}
