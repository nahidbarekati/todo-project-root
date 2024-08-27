import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateAuthTokenCommand } from '../create-auth-token.command';
import { AuthService } from '@user-service/auth/services/auth.service';


@CommandHandler(CreateAuthTokenCommand)
export class CreateAuthTokenHandler
  implements ICommandHandler<CreateAuthTokenCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(
    command: CreateAuthTokenCommand,
  ): Promise<{ access_token: string }> {
    const { username, password } = command;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
