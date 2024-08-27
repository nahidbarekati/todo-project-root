import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateTodoItemDto } from '../dto/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dto/update-todo-item.dto';
import { CreateTodoItemCommand } from '@todo-service/application/commands/todoItem/create-todo-item.command';
import { JwtToken } from '@todo-service/decorator/jwt-token.decorator';
import { UpdateTodoItemCommand } from '@todo-service/application/commands/todoItem/update-todo-item.command';
import { DeleteTodoItemCommand } from '@todo-service/application/commands/todoItem/delete-todo-item.command';
import { GetTodoItemsQuery } from '@todo-service/application/queries/get-todo-items.query';
import { UpdateTodoItemPriorityCommand } from '@todo-service/application/commands/todoItem/update-todo-item-priority.command';

@ApiTags('Todo items')
@Controller('todo-items')
export class TodoItemController {
  private client: ClientProxy;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
  @ApiOperation({ summary: 'Create a new todo Item' })
  @ApiResponse({
    status: 201,
    description: 'The todo Item has been successfully created.',
  })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createTodoItemDto: CreateTodoItemDto,
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
    let command = new CreateTodoItemCommand(
      //user.userId,
      createTodoItemDto.title,
      createTodoItemDto.description,
      createTodoItemDto.priority,
      createTodoItemDto.todoList,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Update a todo Item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo Item has been successfully updated.',
  })
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
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

    let command = new UpdateTodoItemCommand(
      id,
      updateTodoItemDto.title,
      updateTodoItemDto.description,
      updateTodoItemDto.priority,
      updateTodoItemDto.todoList,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Delete a todo Item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo Item has been successfully deleted.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string, @JwtToken() token: string) {
    let user = await this.client
      .send({ cmd: 'get_user_details' }, { token })
      .toPromise();
    console.log(user, 'usser');

    if (!user.userId) {
      throw new UnauthorizedException('Invalid token. Try again.');
    }

    let command = new DeleteTodoItemCommand(id);
    await this.commandBus.execute(command);

    return 'sucssefull';
  }

  @ApiOperation({ summary: 'Get all todo Items' })
  @ApiResponse({
    status: 200,
    description: 'All todo Items have been successfully retrieved.',
  })
  @ApiBearerAuth()
  @Get()
  async findAll(@JwtToken() token: string) {
    let user = await this.client
      .send({ cmd: 'get_user_details' }, { token })
      .toPromise();
    console.log(user, 'usser');

    if (!user.userId) {
      throw new UnauthorizedException('Invalid token. Try again.');
    }
    const todoItems = await this.queryBus.execute(
      new GetTodoItemsQuery(user.userId),
    );

    console.log(todoItems, 'todoItems');

    return todoItems;
  }

  @ApiOperation({ summary: 'Update priority of a todo item' })
  @ApiResponse({
    status: 200,
    description: 'Todo item priority has been successfully updated.',
  })
  @ApiBearerAuth()
  @Patch(':id/priority')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        priority: {
          type: 'number',
          description: 'Priority of the todo item',
          example: 1,
        },
      },
      required: ['priority'],
    },
  })
  async updatePriority(
    @Param('id') id: string,
    @Body('priority') priority: number,
    @JwtToken() token: string,
  ) {
    let user = await this.client
      .send({ cmd: 'get_user_details' }, { token })
      .toPromise();
    console.log(user, 'user');

    if (!user.userId) {
      throw new UnauthorizedException('Invalid token. Try again.');
    }

    await this.commandBus.execute(
      new UpdateTodoItemPriorityCommand(id, priority),
    );

    return { message: 'Priority updated successfully' };
  }
}

  

