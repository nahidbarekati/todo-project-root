import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserRepository } from '../../domain/repositories/user.repository';
import { DomainUser } from '../../domain/entities/user.entity';

export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findByIdAndUpdate(id: string, updateData): Promise<DomainUser | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
      })
      .exec();

    if (!updatedUser) {
      return null;
    }
    return this.toDomain(updatedUser);
  }

  async save(user: DomainUser): Promise<DomainUser> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }

  async findById(id: string): Promise<DomainUser | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }
    return this.toDomain(user);
  }

  async findByUsername(username: string): Promise<DomainUser | null> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      return null;
    }
    return this.toDomain(await user);
  }

  private toDomain(userDocument: User): DomainUser {
    return new DomainUser(
      userDocument._id.toString(),
      userDocument.username,
      userDocument.password,
    );
  }
}
