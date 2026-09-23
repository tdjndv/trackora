import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() data: CreateAccountDto) {
    return this.accountService.create(userId, data);
  }

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.accountService.findAllByUserId(userId);
  }
}
