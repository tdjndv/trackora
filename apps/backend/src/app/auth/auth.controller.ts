import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('health')
  health() {
    return 'the server is up';
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signin')
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data.email, data.password);
  }

  @Public()
  @Post('signup')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data.email, data.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
