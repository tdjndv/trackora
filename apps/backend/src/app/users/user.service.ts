import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, passwordHash: string): Promise<User> {
    const user = this.userRepository.create({
      email: this.normalize(email),
      passwordHash,
    });

    try {
      return await this.userRepository.save(user);
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: this.normalize(email) },
    });
  }

  private normalize(email: string): string {
    return email.trim().toLowerCase();
  }
}
