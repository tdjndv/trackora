import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';

const ROUNDS = 12;
const DUMMY_HASH =
  '$2b$12$6QEy9Np8uzmA95UJV.OFXOFpqAoOzttISQXpuae1l0aiKYXKqKCV6';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);
    const match = await bcrypt.compare(
      password,
      user?.passwordHash ?? DUMMY_HASH,
    );

    if (!user || !match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueToken(user);
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const passwordHash = await bcrypt.hash(password, ROUNDS);
    const user = await this.userService.create(email, passwordHash);

    return this.issueToken(user);
  }

  private async issueToken(user: User): Promise<{ access_token: string }> {
    return {
      access_token: await this.jwtService.signAsync({ sub: user.id }),
    };
  }
}
