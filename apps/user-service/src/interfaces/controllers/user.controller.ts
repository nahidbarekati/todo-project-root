import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(
      createUserDto.username,
      createUserDto.password,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user data has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    return this.queryBus.execute(query);
  }
}
