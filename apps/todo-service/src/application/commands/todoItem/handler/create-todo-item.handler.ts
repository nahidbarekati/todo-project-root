import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { MessagingService } from '@todo-service/api-gateway/src/services/ampq-queue.service';
import { MongoTodoItemRepository } from '@todo-service/infrastructure/repositories/mongo-todo-item.repository';
import { DomainTodoItem } from '@todo-service/domain/entities/todo-item.entity';
import { CreateTodoItemCommand } from '../create-todo-item.command';
import { MongoTodoListRepository } from '@todo-service/infrastructure/repositories/mongo-todo-list.repository';

@CommandHandler(CreateTodoItemCommand)
export class CreateTodoItemHandler
  implements ICommandHandler<CreateTodoItemCommand>
{
  private client: ClientProxy;
  constructor(
    // private readonly userRepository: MongoUserRepository,
    private readonly todoItemRepository: MongoTodoItemRepository,
    private readonly todoListRepository: MongoTodoListRepository,
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

  //async execute(command: CreateTodoItemCommand): Promise<DomainTodoItem> {
  async execute(command: CreateTodoItemCommand) {
    const { title, description, priority, todoList } = command;

    // console.log(userId, 'userId');
    // const user = await this.userRepository.findById(userId);
    // if (!user) {
    //   throw new Error('User not found');
    // }
    //let id = Date.now().toString();

    const domainTodoItem = new DomainTodoItem(
      title,
      description,
      priority,
      todoList,
    );

    let result = await this.todoItemRepository.save(domainTodoItem);

    console.log(result, 'result');

    let id = result.todoList.toString();
    let itemId = result._id.toString()

    const user = await this.todoListRepository.addTodoItemToList(id, itemId);

    // user.addTodoItem(domainTodoItem);
    // console.log(id, 'id');
    //await new Promise((resolve) => setTimeout(resolve, 3000));
    //const todoItem = this.convertToPersistenceModel(domainTodoItem);
    //let user = await this.messagingService.addTodoItemClient
    // let user = await this.client
    //   .send(
    //     { cmd: 'add_todo_Item' },
    //     { userId: '66cda4b022938c4a292e8899', todoItemId: id },
    //   )
    //   .toPromise();
    // console.log(user);
    return result;
  }
}
