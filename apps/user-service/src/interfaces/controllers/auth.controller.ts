import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { DomainUser } from '@user-service/domain/entities/user.entity';

import { LoginDto } from '../dto/login.dto';
import { AuthService } from '@user-service/auth/services/auth.service';
import { JwtAuthGuard } from '@user-service/auth/guards/jwt-auth.guard';
import { RegisterDto } from '../dto/register.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from '@user-service/decorator/jwt-token.decorator';
import { MongoUserRepository } from '@user-service/infrastructure/repositories/mongo-user.repository';
import { Types } from 'mongoose';
const ObjectId = require("mongoose").Types.ObjectId;
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private client: ClientProxy;
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userRepository: MongoUserRepository,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'user_service_queue',
        queueOptions: {
          durable: true,
          exclusive: false,
          autoDelete: false,
        },
      },
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    console.log(loginDto, 'loginDto');
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      //throw new Error('invalid username or password. try again');
      throw new UnauthorizedException(
        'Invalid username or password. Try again.',
      );
    }
    return this.authService.login(user);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT' })
  @ApiResponse({ status: 200, description: 'JWT is valid.' })
  @ApiResponse({ status: 401, description: 'Invalid JWT.' })
  validateToken(@JwtToken() token: string) {
    const decoded = this.jwtService.verify(token);
    console.log(decoded, 'decodeddecodeddecoded');
    return { status: 'valid' };
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const existingUser = await this.authService.validateUser(
      registerDto.username,
      registerDto.password,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }
    return this.authService.register(
      registerDto.username,
      registerDto.password,
    );
  }

  @MessagePattern({ cmd: 'get_user_details' })
  async handleValidateToken(data: { token: string }) {
    console.log(`Token received: ${data.token}`);
    const decoded = await this.jwtService.verify(data.token);
    console.log(decoded, 'decoded');
    const user = await this.userRepository.findByUsername(decoded.username);
    if (!user) {
      return null;
    }
    // return { userId: decoded.userId };
    return { userId: user.id, username: user.username, valid: true };
  }

  @MessagePattern({ cmd: 'add_todo_list' })
  async handleAddTodoList(data: any) {
    console.log(`add-todo-listadd-todo-listadd-todo-list: ${data.todoListId}`);

    let id = new ObjectId(data.userId)

    console.log(id, 'id');

    const user = await this.userRepository.findByIdAndUpdate(
      //new ObjectId(data.userId),
      id,
      {
        $push: { todoLists: data.todoListId },
      },
    );
    if (!user) {
      return null;
    }
    //return { userId: decoded.userId };
    return { user: user, valid: true };
  }

}
