import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '@user-service/auth/services/auth.service';
import { DomainUser } from '@user-service/domain/entities/user.entity';
import { RegisterUserCommand } from '../register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RegisterUserCommand): Promise<DomainUser> {
    const { username, password } = command;
    return this.authService.register(username, password);
  }
}
