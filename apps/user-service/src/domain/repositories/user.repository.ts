import { DomainUser } from '../entities/user.entity';

export interface UserRepository {
  save(user: DomainUser): Promise<DomainUser>;
  findById(id: string): Promise<DomainUser | null>;
  findByUsername(username: string): Promise<DomainUser | null>;
  findByIdAndUpdate(
    id: string,
    updateData: Partial<DomainUser>,
  ): Promise<DomainUser | null>;
}
