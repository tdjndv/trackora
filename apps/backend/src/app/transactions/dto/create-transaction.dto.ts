import {
  TransactionCategory,
  TransactionType,
} from '../../type/transaction.type';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsInt()
  amountCents: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsUUID()
  accountId: string;
}
