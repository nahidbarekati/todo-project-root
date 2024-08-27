import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { DomainUser } from '@user-service/domain/entities/user.entity';
import { MongoUserRepository } from '@user-service/infrastructure/repositories/mongo-user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: MongoUserRepository,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<DomainUser | null> {
    // const user = await MongoUserRepository.findByUsername(username);
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
       return null;
    }
    let comp = await bcrypt.compare(pass, user.password);

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: DomainUser): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(username: string, password: string): Promise<DomainUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new DomainUser(
      Date.now().toString(),
      username,
      hashedPassword,
    );
    return this.userRepository.save(user);
  }
}
