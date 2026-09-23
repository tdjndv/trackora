import {
  TransactionCategory,
  TransactionType,
} from '../../type/transaction.type';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class QueryTransactionDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
