import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { AccountService } from '../accounts/account.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  async create(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<Transaction> {
    await this.accountService.findOne(data.accountId, userId);

    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  async findAll(
    userId: string,
    query: QueryTransactionDto,
  ): Promise<Transaction[]> {
    await this.accountService.findOne(query.accountId, userId);

    return this.transactionRepository.find({
      where: {
        accountId: query.accountId,
        ...(query.type && { type: query.type }),
        ...(query.category && { category: query.category }),
        ...(query.search && { description: Like(`%${query.search}%`) }),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOneByUserId(id, userId);
    Object.assign(transaction, data);
    return this.transactionRepository.save(transaction);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOneByUserId(id, userId);
    await this.transactionRepository.delete(id);
  }

  private async findOneByUserId(
    id: string,
    userId: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: { account: true },
    });

    if (!transaction || transaction.account.userId !== userId) {
      throw new NotFoundException('Transaction is not found');
    }

    return transaction;
  }
}
