import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoListCommand } from '../create-todo-list.command';
import { MongoTodoListRepository } from '../../../infrastructure/repositories/mongo-todo-list.repository';
import { DomainTodoList } from '@todo-service/domain/entities/todo-list.entity';
import { TodoList } from '@todo-service/infrastructure/repositories/todo-list.schema';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { MessagingService } from '@todo-service/api-gateway/src/services/ampq-queue.service';

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListHandler
  implements ICommandHandler<CreateTodoListCommand>
{
  private client: ClientProxy;
  constructor(
    // private readonly userRepository: MongoUserRepository,
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

  //async execute(command: CreateTodoListCommand): Promise<DomainTodoList> {
  async execute(command: CreateTodoListCommand) {
    const { userId, title } = command;

    console.log(userId, 'userId');
    // const user = await this.userRepository.findById(userId);
    // if (!user) {
    //   throw new Error('User not found');
    // }
    let id = Date.now().toString();

    const domainTodoList = new DomainTodoList(title, userId, []);

    let result = await this.todoListRepository.save(domainTodoList);
    // user.addTodoList(domainTodoList);
    console.log(result, 'result');
    //await new Promise((resolve) => setTimeout(resolve, 3000));
    //const todoList = this.convertToPersistenceModel(domainTodoList);
    //let user = await this.messagingService.addTodoListClient
    let user = await this.client
      .send(
        { cmd: 'add_todo_list' },
        { userId: '66cda4b022938c4a292e8899', todoListId: result },
      )
      .toPromise();
    console.log(user);
    return result;
  }
}
