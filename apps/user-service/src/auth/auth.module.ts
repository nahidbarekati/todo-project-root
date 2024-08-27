import { Module } from '@nestjs/common';

//import { AppModule } from './../app.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { MongoUserRepository } from '@user-service/infrastructure/repositories/mongo-user.repository';
import { AppModule } from '@user-service/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@user-service/infrastructure/repositories/user.schema';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    // AppModule,
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret_key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, MongoUserRepository],
  exports: [AuthService, MongoUserRepository],
})
export class AuthModule {}
