import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
//import { UserRepository } from '../../../domain/repositories/user.repository';
import { MongoUserRepository } from '../../../infrastructure/repositories/mongo-user.repository';

import { DomainUser } from '../../../domain/entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async execute(command: CreateUserCommand): Promise<DomainUser> {
    const { username, password } = command;
    const user = new DomainUser(Date.now().toString(), username, password);
    return this.userRepository.save(user);
  }
}
