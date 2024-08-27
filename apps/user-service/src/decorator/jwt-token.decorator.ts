import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (authHeader) {
      // Assuming the token is in the format "Bearer <token>"
      return authHeader.split(' ')[1];
    }
    return null;
  },
);
