import { AccountType } from '../../type/account.type';
import {
  IsEnum,
  IsISO4217CurrencyCode,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsISO4217CurrencyCode()
  currency: string;
}
