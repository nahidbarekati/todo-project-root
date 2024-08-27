import { Module } from '@nestjs/common';
import { UserController } from './interfaces/controllers/user.controller';
import { AuthModule } from './auth/auth.module';
import { GetUserHandler } from './application/queries/handlers/get-user.handler';
import { CreateUserHandler } from './application/commands/handlers/create-user.handler';
import { CreateAuthTokenHandler } from './application/commands/handlers/create-auth-token.handler';
import { ValidateJwtHandler } from './application/queries/handlers/validate-jwt.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/repositories/user.schema';
import { MongoUserRepository } from './infrastructure/repositories/mongo-user.repository';
import { AuthController } from './interfaces/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
//import { MessagingModule } from '@todo-service/api-gateway/src/massaging.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    JwtModule.register({
      secret: 'your_jwt_secret_key',
      signOptions: { expiresIn: '60m' },
    }),
    CqrsModule,
   // MessagingModule,
  ],
  providers: [
    CreateUserHandler,
    GetUserHandler,
    CreateAuthTokenHandler,
    ValidateJwtHandler,
    MongoUserRepository,
  ],
  controllers: [UserController, AuthController],
  exports: [MongoUserRepository],
})
export class AppModule {}
