import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ValidateJwtQuery } from '../validate-jwt.query';


@QueryHandler(ValidateJwtQuery)
export class ValidateJwtHandler implements IQueryHandler<ValidateJwtQuery> {
  constructor(private readonly jwtService: JwtService) {}

  async execute(query: ValidateJwtQuery): Promise<any> {
    const { token } = query;
    try {
      const user = this.jwtService.verify(token, {
        secret: 'your_jwt_secret_key',
      });
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
