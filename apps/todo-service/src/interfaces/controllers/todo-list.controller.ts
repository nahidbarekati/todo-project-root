import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTodoListDto } from '../dto/create-todo-list.dto';
import { UpdateTodoListDto } from '../dto/update-todo-list.dto';
import { CreateTodoListCommand } from '@todo-service/application/commands/create-todo-list.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { JwtToken } from '@todo-service/decorator/jwt-token.decorator';
import { MessagingService } from '@todo-service/api-gateway/src/services/ampq-queue.service';
import { UpdateTodoListCommand } from '@todo-service/application/commands/update-todo-list.command';
import { DeleteTodoListCommand } from '@todo-service/application/commands/delete-todo-list.command';

@ApiTags('Todo Lists')
@Controller('todo-lists')
export class TodoListController {
  private client: ClientProxy;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    //private readonly messagingService: MessagingService,
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
  @ApiOperation({ summary: 'Create a new todo list' })
  @ApiResponse({
    status: 201,
    description: 'The todo list has been successfully created.',
  })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createTodoListDto: CreateTodoListDto,
    @JwtToken() token: string,
  ) {
    //let user = await this.messagingService.userDetailsClient
    let user = await this.client
      .send({ cmd: 'get_user_details' }, { token })
      .toPromise();
    console.log(user);

    if (!user.userId) {
      throw new UnauthorizedException('Invalid token. Try again.');
    }
    let command = new CreateTodoListCommand(
      user.userId,
      createTodoListDto.title,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Update a todo list by ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo list has been successfully updated.',
  })
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
    @JwtToken() token: string,
  ) {
    //let user = await this.messagingService.userDetailsClient
    let user = await this.client
      .send({ cmd: 'get_user_details' }, { token })
      .toPromise();
    console.log(user, 'usser');

    if (!user.userId) {
      throw new UnauthorizedException('Invalid token. Try again.');
    }

    let command = new UpdateTodoListCommand(
      id,
      user.userId,
      updateTodoListDto.title
    );
    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Delete a todo list by ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo list has been successfully deleted.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string, @JwtToken() token: string) {
    //let user = await this.messagingService.userDetailsClient
    let user = await this.client
      .send({ cmd: 'get_user_details' }, { token })
      .toPromise();
    console.log(user, 'usser');

    if (!user.userId) {
      throw new UnauthorizedException('Invalid token. Try again.');
    }

    let command = new DeleteTodoListCommand(id);
    await this.commandBus.execute(command);

    return 'sucssefull';
  }

  // todo
  @ApiOperation({ summary: 'Get all todo lists' })
  @ApiResponse({
    status: 200,
    description: 'All todo lists have been successfully retrieved.',
  })
  @Get()
  async findAll() {}

  @ApiOperation({ summary: 'Get a todo list by ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo list has been successfully retrieved.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {}
}
