import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
//import { UserRepository } from '../../../domain/repositories/user.repository';
import { MongoUserRepository } from '../../../infrastructure/repositories/mongo-user.repository';

import { DomainUser } from '../../../domain/entities/user.entity';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async execute(query: GetUserQuery): Promise<DomainUser | null> {
    return this.userRepository.findById(query.id);
  }
}
